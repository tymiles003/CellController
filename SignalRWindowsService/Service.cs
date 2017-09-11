using Microsoft.Owin;
using Microsoft.Owin.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SignalRWindowsService.Classes;
using SignalRWindowsService.Hubs;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.ServiceProcess;
using System.Timers;
using TableDependency.EventArgs;
using TableDependency.Mappers;
using TableDependency.SqlClient;

[assembly: OwinStartup(typeof(SignalRWindowsService.Startup))]
namespace SignalRWindowsService
{
    public partial class Service : ServiceBase
    {
        //configuration variables
        private string env = ConfigurationManager.AppSettings["env"].ToString();
        private string WebServiceUrl = "";
        private string connString = "";
        private string port = "";
        private string url = "";
        private bool enableSECSGEM = false;
        private bool enableOPC = false;
        private bool enableMaterialExpirationTimer = false;
        private bool enablePanasonicPolling = false;
        private bool enableDEKPolling = false;

        //this will be the original variable
        SqlTableDependency<EquipmentStatus> EquipmentStatusDep = null;
        SqlTableDependency<Alarm> AlarmDep = null;
        SqlTableDependency<SECSGEM_Message> SECSGEM_Dep = null;
        SqlTableDependency<EquipmentQty> EquipmentQtyDep = null;
        SqlTableDependency<TCPNotifications> TCPNotificationsDep = null;
        SqlTableDependency<EquipmentTable> EquipmentTableDep = null;
        SqlTableDependency<ReelTable> ReelTableDep = null;
        SqlTableDependency<SECSGEM_Qty> SECSGEMQtyDep = null;

        //this variable will be used to address the null pointer issue randomly encountered
        SqlTableDependency<EquipmentStatus> globalEquipmentStatusDep = null;
        SqlTableDependency<Alarm> globalAlarmDep = null;
        SqlTableDependency<SECSGEM_Message> globalSECSGEM_Dep = null;
        SqlTableDependency<EquipmentQty> globalEquipmentQtyDep = null;
        SqlTableDependency<TCPNotifications> globalTCPNotificationsDep = null;
        SqlTableDependency<EquipmentTable> globalEquipmentTableDep = null;
        SqlTableDependency<ReelTable> globalReelTableDep = null;
        SqlTableDependency<SECSGEM_Qty> globalSECSGEMQtyDep = null;

        //for timed event
        private Timer opcTimer;
        private Timer materialExpirationTimer;
        private Timer PanasonicPollingtimer;
        private Timer DEKPollingTimer;

        //this variables will be used in TCP (OPC)
        private List<string> lstEquipID = new List<string>();
        private List<string> lstEquipPort = new List<string>();
        private List<string> lstEquipType = new List<string>();

        public Service()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            bool result = false;
            
            try
            {
                result = Common.createMainDirectory();

                if (result == true)
                {
                    try
                    {
                        result = Common.createRecipeDirectory();
                    }
                    catch
                    {
                        result = false;
                    }
                }
            }
            catch
            {
                result = false;
            }

            if (result == true)
            {
                try
                {
                    //init variables
                    InitVariables();

                    Common.Log("Starting Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());

                    if (!EventLog.SourceExists("CCSignalRService"))
                    {
                        EventLog.CreateEventSource(
                            "CCSignalRService", "Application");
                    }

                    //init the web url
                    WebApp.Start(url);

                    //Listen to Database:
                    //we use this loop to handle when the server restarts
                    //the Initialization() function will fail when the server is newly restarted
                    //it will return the exception "Invalid Connection String" because the server's SQL service is not yet started.
                    //to handle this scenario. we will attempt to reconnect until a connection is established

                    Result val = new Result();
                    val.Success = false;
                    val.Message = "";

                    //this is an infinite loop until we can establish a connection
                    while (val.Success == false)
                    {
                        val = Initialization();

                        if (val.Success == true)
                        {
                            //For TCP
                            if (enableOPC == true)
                            {
                                InitTimer();
                            }

                            //For Material Expiration
                            if (enableMaterialExpirationTimer == true)
                            {
                                InitMaterialExpirationTimer();
                            }

                            //for Panasonic Polling
                            if(enablePanasonicPolling == true)
                            {
                                InitPanasonicPollingTimer();
                            }

                            //for DEK Polling
                            if (enableDEKPolling == true)
                            {
                                InitDEKPollingTimer();
                            }

                            Common.Log("Started Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
                        }
                    }
                }
                catch (Exception e)
                {
                    Common.Log("Error: " + e.Message + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
                }
            }
            else
            {
                Common.Log("Error: " + "Failed to create directory" + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
            }
        }

        private void InitVariables()
        {
            connString = ConfigurationManager.ConnectionStrings[env + "_" + "DBConn"].ConnectionString;
            port = ConfigurationManager.AppSettings[env + "_" + "Port"].ToString();
            url = "http://" + LocalIPAddress().ToString() + ":" + port.ToString();
            WebServiceUrl = ConfigurationManager.AppSettings[env + "_" + "IgnitionServer"];
            enableSECSGEM = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnableSECSGEM"]);
            enableOPC = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnableOPC"]);
            enableMaterialExpirationTimer = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnableMaterialExpiration"]);
            enablePanasonicPolling = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnablePanasonicPolling"]);
            enableDEKPolling = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnableDEKPolling"]); 
        }

        private Result Initialization()
        {
            Result result = new Result();
            result.Success = false;
            result.Message = "";

            bool checkConnection = TestConnection(connString);
            Console.WriteLine(checkConnection);

            if (checkConnection == true)
            {
                try
                {
                    ClearObjects();
                }
                catch { }

                try
                {
                    var EquipmentTableMapper = new ModelToTableMapper<EquipmentTable>();
                    EquipmentTableMapper.AddMapping(c => c.ID, "ID");
                    EquipmentTableMapper.AddMapping(c => c.EquipID, "EquipID");
                    EquipmentTableMapper.AddMapping(c => c.EquipModel, "EquipModel");
                    EquipmentTableMapper.AddMapping(c => c.EquipSerialNum, "EquipSerialNum");
                    EquipmentTableMapper.AddMapping(c => c.EquipData, "EquipData");
                    EquipmentTableMapper.AddMapping(c => c.TimeStamp, "TimeStamp");
                    EquipmentTableMapper.AddMapping(c => c.EquipIP, "EquipIP");
                    EquipmentTableMapper.AddMapping(c => c.EquipPort, "EquipPort");
                    EquipmentTableMapper.AddMapping(c => c.HostID, "HostID");
                    EquipmentTableMapper.AddMapping(c => c.DeviceID, "DeviceID");
                    EquipmentTableMapper.AddMapping(c => c.EquipType, "EquipType");
                    EquipmentTableMapper.AddMapping(c => c.LotInProcess, "LotInProcess");
                    EquipmentTableMapper.AddMapping(c => c.TrackInQty, "TrackInQty");
                    EquipmentTableMapper.AddMapping(c => c.TrackInToleranceQty, "TrackInToleranceQty");
                    EquipmentTableMapper.AddMapping(c => c.LastFeedBackData, "LastFeedBackData");
                    EquipmentTableMapper.AddMapping(c => c.LastFeedBackTime, "LastFeedBackTime");
                    EquipmentTableMapper.AddMapping(c => c.UserInProcess, "UserInProcess");
                    EquipmentTableMapper.AddMapping(c => c.IsGrouped, "IsGrouped");
                    EquipmentTableMapper.AddMapping(c => c.RecipeInProcess, "RecipeInProcess");

                    EquipmentTableDep = new SqlTableDependency<EquipmentTable>(connString, "EquipmentTable", EquipmentTableMapper);
                    EquipmentTableDep.OnChanged += OnChanged_EquipmentTable;
                    EquipmentTableDep.Start();
                    globalEquipmentTableDep = EquipmentTableDep;

                    var ReelTableMapper = new ModelToTableMapper<ReelTable>();
                    ReelTableMapper.AddMapping(c => c.EquipID, "EquipID");
                    ReelTableMapper.AddMapping(c => c.ReelQty, "ReelQty");
                    ReelTableMapper.AddMapping(c => c.CurrentQty, "CurrentQty");
                    ReelTableMapper.AddMapping(c => c.CurrentReel, "CurrentReel");
                    ReelTableMapper.AddMapping(c => c.TotalReel, "TotalReel");
                    ReelTableMapper.AddMapping(c => c.RemainingReel, "RemainingReel");
                    ReelTableMapper.AddMapping(c => c.AllowedReel, "AllowedReel");
                    ReelTableMapper.AddMapping(c => c.InReel, "InReel");
                    ReelTableDep = new SqlTableDependency<ReelTable>(connString, "PrintTable", ReelTableMapper);
                    ReelTableDep.OnChanged += OnChanged_ReelTable;
                    ReelTableDep.Start();
                    globalReelTableDep = ReelTableDep;

                    if (enableOPC == true)
                    {
                        //Equipment Qty
                        var EquipmentQtyMapper = new ModelToTableMapper<EquipmentQty>();
                        EquipmentQtyMapper.AddMapping(c => c.EquipmentID, "EquipmentID");
                        EquipmentQtyMapper.AddMapping(c => c.ProcessedQty, "ProcessedQty");
                        EquipmentQtyMapper.AddMapping(c => c.EndQty, "EndQty");
                        EquipmentQtyMapper.AddMapping(c => c.TotalQty, "TotalQty");
                        EquipmentQtyMapper.AddMapping(c => c.BrandedQty, "BrandedQty");
                        EquipmentQtyMapper.AddMapping(c => c.UnbrandedQty, "UnbrandedQty");

                        EquipmentQtyDep = new SqlTableDependency<EquipmentQty>(connString, "EquipmentQty", EquipmentQtyMapper);
                        EquipmentQtyDep.OnChanged += OnChanged_EquipmentQty;
                        EquipmentQtyDep.Start();
                        globalEquipmentQtyDep = EquipmentQtyDep;

                        //TCP Notification
                        var TCPNotificationsMapper = new ModelToTableMapper<TCPNotifications>();
                        TCPNotificationsMapper.AddMapping(c => c.EquipmentId, "EquipmentId");
                        TCPNotificationsMapper.AddMapping(c => c.MessageId, "MessageId");
                        TCPNotificationsMapper.AddMapping(c => c.MessageText, "MessageText");
                        TCPNotificationsMapper.AddMapping(c => c.ReadNotification, "ReadNotification");
                        TCPNotificationsMapper.AddMapping(c => c.MessageType, "MessageType");
                        TCPNotificationsMapper.AddMapping(c => c.Date, "Date");

                        TCPNotificationsDep = new SqlTableDependency<TCPNotifications>(connString, "TCPNotificationsTable", TCPNotificationsMapper);
                        TCPNotificationsDep.OnChanged += OnChanged_TCPNotifications;
                        TCPNotificationsDep.Start();
                        globalTCPNotificationsDep = TCPNotificationsDep;
                    }

                    if (enableSECSGEM == true)
                    {
                        //Equipment Status
                        var EquipmentStatusMapper = new ModelToTableMapper<EquipmentStatus>();
                        EquipmentStatusMapper.AddMapping(c => c.Equipment, "Equipment");
                        EquipmentStatusMapper.AddMapping(c => c.Status, "Status");

                        EquipmentStatusDep = new SqlTableDependency<EquipmentStatus>(connString, "SECSGEM_EquipmentInfo", EquipmentStatusMapper);
                        EquipmentStatusDep.OnChanged += OnChanged_EquipmentStatus;
                        EquipmentStatusDep.Start();
                        globalEquipmentStatusDep = EquipmentStatusDep;

                        //Alarms
                        var AlarmMapper = new ModelToTableMapper<Alarm>();
                        AlarmMapper.AddMapping(c => c.MessageId, "MessageId");
                        AlarmMapper.AddMapping(c => c.Equipment, "EquipmentId");
                        AlarmMapper.AddMapping(c => c.Message, "MessageText");
                        AlarmMapper.AddMapping(c => c.TransactionId, "TxnID");
                        AlarmMapper.AddMapping(c => c.ReadNotification, "ReadNotification");
                        AlarmMapper.AddMapping(c => c.Date, "Date");
                        AlarmMapper.AddMapping(c => c.MessageType, "MessageType");

                        AlarmDep = new SqlTableDependency<Alarm>(connString, "NotificationsTable", AlarmMapper);
                        AlarmDep.OnChanged += OnChanged_Alarm;
                        AlarmDep.Start();
                        globalAlarmDep = AlarmDep;

                        //SECS/GEM
                        var SECSGEM_Mapper = new ModelToTableMapper<SECSGEM_Message>();
                        SECSGEM_Mapper.AddMapping(c => c.ID, "ID");
                        SECSGEM_Mapper.AddMapping(c => c.Equipment, "Equipment");
                        SECSGEM_Mapper.AddMapping(c => c.StreamFunction, "StreamFunction");
                        SECSGEM_Mapper.AddMapping(c => c.Direction, "Direction");
                        SECSGEM_Mapper.AddMapping(c => c.RequestResponse, "RequestResponse");
                        SECSGEM_Mapper.AddMapping(c => c.CommonID, "CommonID");
                        SECSGEM_Mapper.AddMapping(c => c.TxID, "TxID");
                        SECSGEM_Mapper.AddMapping(c => c.Reply, "Reply");
                        SECSGEM_Mapper.AddMapping(c => c.Message, "Message");
                        SECSGEM_Mapper.AddMapping(c => c.TimeSentReceived, "TimeSentReceived");

                        SECSGEM_Dep = new SqlTableDependency<SECSGEM_Message>(connString, "Messages", SECSGEM_Mapper);
                        SECSGEM_Dep.OnChanged += OnChanged_SECSGEM;
                        SECSGEM_Dep.Start();
                        globalSECSGEM_Dep = SECSGEM_Dep;

                        //SECSGEM Qty
                        var SECSGEM_QtyMapper = new ModelToTableMapper<SECSGEM_Qty>();
                        SECSGEM_QtyMapper.AddMapping(c => c.EquipID, "EquipID");
                        SECSGEM_QtyMapper.AddMapping(c => c.Qty, "Qty");
                        SECSGEM_QtyMapper.AddMapping(c => c.Qty2, "Qty2");
                        SECSGEM_QtyMapper.AddMapping(c => c.Multiplier, "Multiplier");

                        SECSGEMQtyDep = new SqlTableDependency<SECSGEM_Qty>(connString, "tblSECSGEM_Qty", SECSGEM_QtyMapper);
                        SECSGEMQtyDep.OnChanged += OnChanged_SECSGEMQty;
                        SECSGEMQtyDep.Start();
                        globalSECSGEMQtyDep = SECSGEMQtyDep;
                    }

                    result.Success = true;
                    result.Message = "Connecting to Database Successful";
                }
                catch (Exception e)
                {
                    result.Success = false;
                    result.Message = e.Message;
                }
            }
            else
            {
                result.Success = false;
                result.Message = "Connecting to Database Failed";
            }

            return result;
        }

        private void InitTimer()
        {
            opcTimer = new Timer();

            // Hook up the Elapsed event for the timer.
            opcTimer.Elapsed += new ElapsedEventHandler(OnOPCTimedEvent);

            // Set the Interval to 5 seconds (5000 milliseconds).
            opcTimer.Interval = 5000;
            opcTimer.Enabled = true;
        }

        private void InitMaterialExpirationTimer()
        {
            materialExpirationTimer = new Timer();

            // Hook up the Elapsed event for the timer.
            materialExpirationTimer.Elapsed += new ElapsedEventHandler(OnMaterialExpiryEvent);

            // Set the Interval to 5 seconds (5000 milliseconds).
            materialExpirationTimer.Interval = 5000;
            materialExpirationTimer.Enabled = true;
        }

        private void InitPanasonicPollingTimer()
        {
            PanasonicPollingtimer = new Timer();

            // Hook up the Elapsed event for the timer.
            PanasonicPollingtimer.Elapsed += new ElapsedEventHandler(OnPanasonicPollingEvent);

            // Set the Interval to 5 seconds (5000 milliseconds).
            PanasonicPollingtimer.Interval = 5000;
            PanasonicPollingtimer.Enabled = true;
        }

        private void InitDEKPollingTimer()
        {
            DEKPollingTimer = new Timer();

            // Hook up the Elapsed event for the timer.
            DEKPollingTimer.Elapsed += new ElapsedEventHandler(OnDEKPollingEvent);

            // Set the Interval to 5 seconds (5000 milliseconds).
            DEKPollingTimer.Interval = 5000;
            DEKPollingTimer.Enabled = true;
        }

        private void OnOPCTimedEvent(object source, ElapsedEventArgs e)
        {
            ListenToTCP();
        }

        private void OnMaterialExpiryEvent(object source, ElapsedEventArgs e)
        {
            try
            {
                materialExpirationTimer.Enabled = false;
            }
            catch { }

            try
            {
                try
                {
                    materialExpirationTimer.Enabled = false;
                }
                catch { }

                string query = "select a.ID,a.EquipID,b.Type,a.LotInProcess,a.UserInProcess,a.IsGrouped from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where a.Process=1 order by a.EquipID";
                
                DataTable dt = new DataTable();
                dt = CustomSelectQuery(query);
                foreach (DataRow dr in dt.Rows)
                {
                    List<MaterialLot> Totalmaterials = new List<MaterialLot>();
                    if (dr["Type"].ToString().ToUpper() == "DEK PRINTER")
                    {
                        string ID = dr["ID"].ToString();
                        string lotNumber = dr["LotInProcess"].ToString();
                        string equipment = dr["EquipID"].ToString();
                        string user = dr["UserInProcess"].ToString();
                        string isGrouped = dr["isGrouped"].ToString();

                        var webclient = new WebClient();
                        string URL = "";
                        string result = "";

                        //init the url
                        //URL = WebServiceUrl + "camstar/getMaterial?Equipment=" + equipment + "&UserID=" + user;
                        URL = WebServiceUrl + "camstar/getMaterial?Equipment=" + equipment;
                        URL = string.Format(URL);

                        //execute the service and handle the result
                        result = webclient.DownloadString(URL);

                        List<MaterialLot> materials = new List<MaterialLot>();

                        materials = Deserialize<List<MaterialLot>>(result);

                        if(materials != null)
                        {
                            foreach(var item in materials)
                            {
                                Totalmaterials.Add(item);
                            }
                        }

                        if (isGrouped.ToUpper() == "1" || isGrouped.ToUpper() == "TRUE")
                        {
                            string query2 = "select b.GroupName from MachineGroupRelationTable a left join tblEquipmentGroup b on a.GroupID=b.ID where a.EquipID=" + ID.ToString();
                            DataTable dt2 = new DataTable();
                            dt2 = CustomSelectQuery(query2);
                            string groupName = "";
                            foreach (DataRow dr2 in dt2.Rows)
                            {
                                groupName = dr2["GroupName"].ToString();
                            }

                            if (groupName != null && groupName != "")
                            {
                                URL = WebServiceUrl + "camstar/getMaterial?Equipment=" + groupName;
                                URL = string.Format(URL);

                                //execute the service and handle the result
                                result = webclient.DownloadString(URL);
                                materials = Deserialize<List<MaterialLot>>(result);

                                if (materials != null)
                                {
                                    foreach (var item in materials)
                                    {
                                        Totalmaterials.Add(item);
                                    }
                                }
                            }
                        }

                        List<string> materialLotExp = new List<string>();

                        if (Totalmaterials != null)
                        {
                            if(Totalmaterials.Count > 0)
                            {
                                foreach(var i in Totalmaterials)
                                {
                                    string expiry = i.ExpiryTimestamp;
                                    //expiry = "2017-07-26T12:38:47+07:00";
                                    //expiry = "";
                                    string thawing = i.ThawingTimestamp;
                                    string withdrawal = i.WithdrawalTimestamp;
                                    string materialLot = i.MaterialLotName;
                                    DateTime convertedDate;
                                    if (expiry != null && expiry != "" && expiry.ToString().ToUpper() != "NONE")
                                    {
                                        convertedDate = DateTime.Parse(expiry);
                                        DateTime now = DateTime.Now;
                                        if (convertedDate < now)
                                        {
                                            //expired
                                            STOP(equipment);
                                            string strDate = convertedDate.ToString();
                                            string WarningQuery = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + "Machine was stopped due to material expiration (" + materialLot + ") on " + strDate + "',0,getdate()," + "0" + ",'MESSAGE')";
                                            ExecuteCustomQuery(WarningQuery);
                                        }
                                        else
                                        {
                                            //not yet expired
                                            double diff = (convertedDate - now).TotalMinutes;

                                            string strDate = convertedDate.ToString();

                                            string checkQuery = "select Tier from tblWarningTracker where EquipID='" + equipment + "'";
                                            DataTable dtTracker = new DataTable();
                                            dtTracker = CustomSelectQuery(checkQuery);
                                            int Tier = 0;
                                            foreach (DataRow drTracker in dtTracker.Rows)
                                            {
                                                try
                                                {
                                                    Tier = Convert.ToInt32(drTracker["Tier"].ToString());
                                                }
                                                catch
                                                {
                                                    Tier = 0;
                                                }
                                            }

                                            if (diff <= 360 && diff > 180 && Tier !=1)
                                            {
                                                string WarningQuery = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + "Material (" + materialLot + ") will expire on " + strDate + " (in about 6hrs)',0,getdate()," + "0" + ",'MESSAGE')";
                                                ExecuteCustomQuery(WarningQuery);

                                                Tier = 1;
                                                string updateQueryTier = "Update tblWarningTracker set Tier=" + Tier.ToString() + " where EquipID='" + equipment + "'";
                                                ExecuteCustomQuery(updateQueryTier);
                                            }
                                            else if (diff <= 180 && diff > 120 && Tier != 2)
                                            {
                                                string WarningQuery = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + "Material (" + materialLot + ") will expire on " + strDate + " (in about 3hrs)',0,getdate()," + "0" + ",'MESSAGE')";
                                                ExecuteCustomQuery(WarningQuery);

                                                Tier = 2;
                                                string updateQueryTier = "Update tblWarningTracker set Tier=" + Tier.ToString() + " where EquipID='" + equipment + "'";
                                                ExecuteCustomQuery(updateQueryTier);
                                            }
                                            else if (diff <= 120 && diff > 60 && Tier != 3)
                                            {
                                                string WarningQuery = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + "Material (" + materialLot + ") will expire on " + strDate + " (in about 2hrs)',0,getdate()," + "0" + ",'MESSAGE')";
                                                ExecuteCustomQuery(WarningQuery);

                                                Tier = 3;
                                                string updateQueryTier = "Update tblWarningTracker set Tier=" + Tier.ToString() + " where EquipID='" + equipment + "'";
                                                ExecuteCustomQuery(updateQueryTier);
                                            }
                                            else if (diff <= 60 && Tier != 4)
                                            {
                                                string WarningQuery = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + "Material (" + materialLot + ") will expire on " + strDate + " (in about 1hr)',0,getdate()," + "0" + ",'MESSAGE')";
                                                ExecuteCustomQuery(WarningQuery);

                                                Tier = 4;
                                                string updateQueryTier = "Update tblWarningTracker set Tier=" + Tier.ToString() + " where EquipID='" + equipment + "'";
                                                ExecuteCustomQuery(updateQueryTier);
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

                try
                {
                    materialExpirationTimer.Enabled = true;
                }
                catch { }

            }
            catch
            {
                try
                {
                    materialExpirationTimer.Enabled = true;
                }
                catch { }
            }
        }

        private void OnDEKPollingEvent(object source, ElapsedEventArgs e)
        {
            try
            {
                DEKPollingTimer.Enabled = false;
            }
            catch { }

            try
            {
                try
                {
                    DEKPollingTimer.Enabled = false;
                }
                catch { }

                string query = "select a.ID,a.EquipID,b.Type,a.LotInProcess,a.UserInProcess,a.IsGrouped,a.TrackInQty from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where a.Process=1 order by a.EquipID";
                
                DataTable dt = new DataTable();
                dt = CustomSelectQuery(query);
                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["Type"].ToString().ToUpper() == "DEK PRINTER")
                    {
                        int TrackInQty = 0;
                        try
                        {
                            TrackInQty = Convert.ToInt32(dr["TrackInQty"].ToString());
                        }
                        catch
                        {
                            TrackInQty = 0;
                        }
                        string equipID = dr["EquipID"].ToString();
                        string query2 = "Select Qty,Qty2,Multiplier from tblSECSGEM_Qty where EquipID='" + equipID + "'";
                        DataTable dt2 = new DataTable();
                        dt2 = CustomSelectQuery(query2);
                        int TotalQty = 0;
                        int Multiplier = 1;
                        foreach (DataRow dr2 in dt2.Rows)
                        {
                            int Qty = 0;
                            int Qty2 = 0;

                            try
                            {
                                Qty = Convert.ToInt32(dr2["Qty"].ToString());
                            }
                            catch
                            {
                                Qty = 0;
                            }

                            try
                            {
                                Qty2 = Convert.ToInt32(dr2["Qty2"].ToString());
                            }
                            catch
                            {
                                Qty2 = 0;
                            }

                            try
                            {
                                Multiplier = Convert.ToInt32(dr2["Multiplier"].ToString());
                            }
                            catch
                            {
                                Multiplier = 1;
                            }

                            TotalQty = Qty + Qty2;
                        }

                        double temp = Convert.ToDouble(TrackInQty) / Convert.ToDouble(Multiplier);
                        double strips = TotalQty;
                        bool Stop = false;

                        if (strips >= temp)
                        {
                            Stop = true;
                        }
                        
                        if(Stop == true)
                        {
                            STOP(equipID);
                        }
                    }
                }

                try
                {
                    DEKPollingTimer.Enabled = true;
                }
                catch { }

            }
            catch
            {
                try
                {
                    DEKPollingTimer.Enabled = true;
                }
                catch { }
            }
        }

        private void OnPanasonicPollingEvent(object source, ElapsedEventArgs e)
        {
            try
            {
                PanasonicPollingtimer.Enabled = false;
            }
            catch { }

            try
            {
                try
                {
                    PanasonicPollingtimer.Enabled = false;
                }
                catch { }

                string type = "PANASONIC COMPONENT ATTACH";
                string query = "select a.EquipID from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where b.Type='" + type + "' and a.Process=1 order by a.EquipID";
                
                DataTable dt = new DataTable();
                dt = CustomSelectQuery(query);
                if(dt!=null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        string equipment = "";
                        foreach(DataRow dr in dt.Rows)
                        {
                            equipment = dr["EquipID"].ToString();
                        }

                        string Format = "U4";
                        string Variable = "7003";//7003(Board)
                        string URL = WebServiceUrl + "secsgem/S1F3_StatusRequest?Equipment=" + equipment + "&Format=" + Format + "&Variable=" + Variable;
                        URL = string.Format(URL);

                        var WebClient = new WebClient();

                        string res = WebClient.DownloadString(URL);
                        
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(res);
                        string header = dict["header"].ToString();
                        var dictHeader = JsonConvert.DeserializeObject<Dictionary<string, object>>(header);
                        string stream = dictHeader["stream"].ToString();
                        string function = dictHeader["function"].ToString();
                        string body = dict["body"].ToString();
                        JArray a = JArray.Parse(body);
                        string value = "0";
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                if (p.Name == "value")
                                {
                                    value = (string)p.Value;
                                }
                            }
                        }

                        string queryQty = "";
                        queryQty = "Update tblSECSGEM_Qty SET Qty=" + value + " where EquipID='" + equipment + "'";
                        ExecuteCustomQuery(queryQty);
                    }
                }

                try
                {
                    PanasonicPollingtimer.Enabled = true;
                }
                catch { }

            }
            catch
            {
                try
                {
                    PanasonicPollingtimer.Enabled = true;
                }
                catch { }
            }
        }

        //function for getting ID of equipment
        private int GetEquipmentID(string EquipmentName)
        {
            string query = "select ID from EquipmentTable where EquipID='" + EquipmentName + "'";

            DataTable dt = new DataTable();

            try
            {
                dt = CustomSelectQuery(query);
                int ID = 0;

                if (dt != null)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        ID = Convert.ToInt32(dr["ID"].ToString());
                    }
                }

                return ID;
            }
            catch
            {
                return 0;
            }
        }

        //get the equipment type by equipment ID (joined table)
        private string GetEquipmentTypeJoin(int ID)
        {
            DataTable dt = new DataTable();
            string query = "SELECT a.Type FROM tblEquipmentType a left join EquipmentTable b on a.ID=b.EquipType where b.ID=" + ID.ToString();
            dt = CustomSelectQuery(query);

            string result = "";
            try
            {
                foreach (DataRow dr in dt.Rows)
                {
                    result = dr["Type"].ToString();
                }
            }
            catch
            {
                result = "";
            }

            return result;
        }

        private List<SECSGEMDefaultReplyObject> STOP(string equipment)
        {
            try
            {
                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                var webclient = new WebClient();

                string URL = "";
                string result = "";

                int ID = GetEquipmentID(equipment);
                string type = GetEquipmentTypeJoin(ID);

                Dictionary<string, object> dict = new Dictionary<string, object>();
                string header = "";
                string body = "";

                string command = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    command = "STOP";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    command = "STOP";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    command = "STOP";
                }

                //only heller oven requires start
                URL = WebServiceUrl + "secsgem/S2F41_NOPARAM?Equipment=" + equipment + "&Command=" + command;

                URL = string.Format(URL);
                result = webclient.DownloadString(URL);
                dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                header = dict["header"].ToString();
                body = dict["body"].ToString();

                JArray a = JArray.Parse(body);
                foreach (JObject o in a.Children<JObject>())
                {
                    foreach (JProperty p in o.Properties())
                    {
                        string name = p.Name;
                        string value = (string)p.Value;

                        if (name == "value")
                        {
                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = equipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F41";
                            obj.Add(temp_obj);
                        }
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        private void ListenToTCP()
        {
            try
            {
                opcTimer.Enabled = false;
            }
            catch { }

            try
            {
                try
                {
                    opcTimer.Enabled = false;
                }
                catch { }

                string query = "select a.EquipID,a.EquipPort,b.Type from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where b.IsSECSGEM=0 order by a.EquipID";
                DataTable dt = new DataTable();
                dt = CustomSelectQuery(query);
                lstEquipID = new List<string>();
                lstEquipPort = new List<string>();
                lstEquipType = new List<string>();
                foreach (DataRow dr in dt.Rows)
                {
                    lstEquipID.Add(dr["EquipID"].ToString());
                    lstEquipPort.Add(dr["EquipPort"].ToString());
                    lstEquipType.Add(dr["Type"].ToString());
                }

                int count = 0;
                foreach (var x in lstEquipID)
                {
                    var webclient = new WebClient();
                    string equipment = x;

                    string port = lstEquipPort[count].ToString();
                    string type = lstEquipType[count].ToString();

                    ////replaced by ignitions tag changed
                    ////init the url
                    //string URL = "";
                    //string result = "";

                    //URL = WebServiceUrl + "opc/getMessage?Equipment=" + equipment + "&Port=" + port;
                    //URL = string.Format(URL);

                    ////execute the service and handle the result
                    //result = webclient.DownloadString(URL);
                    //DefaultReturnObj output = Deserialize<DefaultReturnObj>(result);

                    //if (Convert.ToBoolean(output.Error) == false)
                    //{
                    //    string feedbackQuery = "Select LastFeedBackTime from EquipmentTable where EquipID='" + equipment + "'";
                    //    DataTable dt2 = new DataTable();
                    //    dt2 = CustomSelectQuery(feedbackQuery);
                    //    string lastFTime = "";
                    //    try
                    //    {
                    //        foreach (DataRow dr in dt2.Rows)
                    //        {
                    //            lastFTime = dr["LastFeedBackTime"].ToString();
                    //        }
                    //    }
                    //    catch
                    //    {
                    //        lastFTime = "";
                    //    }

                    //    if (lastFTime != output.Time)
                    //    {
                    //        string feedbackQueryUpdate = "Update EquipmentTable set LastFeedBackTime='" + output.Time + "', LastFeedBackData='" + output.Result + "' where EquipID='" + equipment + "'";
                    //        ExecuteCustomQuery(feedbackQueryUpdate);
                    //        Common.Log("TCP Listener (Equipment: " + equipment + " Result: " + output.Result + " Date: " + DateTime.Now.ToString() + ")");

                    //        //for job end
                    //        if (output.Result.ToString().Contains("ACTUAL_QTY") || output.Result.ToString().Contains("JOBEND_QTY"))
                    //        {
                    //            string checkQuery = "Select EquipmentID,ProcessedQty,EndQty from EquipmentQty where EquipmentID='" + equipment + "'";
                    //            DataTable dt3 = new DataTable();
                    //            dt3 = CustomSelectQuery(checkQuery);
                    //            string qtyQuery = "";
                    //            string endQty = output.Result.ToString().Replace("ACTUAL_QTY", "").Replace("JOBEND_QTY", "").Replace("=", "");
                    //            if (dt.Rows.Count > 0)
                    //            {
                    //                string lastEndQty = "";
                    //                string processed = "";
                    //                int temp = 0;
                    //                foreach(DataRow dr in dt3.Rows)
                    //                {
                    //                    lastEndQty = dr["EndQty"].ToString();
                    //                    processed = dr["ProcessedQty"].ToString();
                    //                }

                    //                try
                    //                {
                    //                    temp = Convert.ToInt32(lastEndQty);
                    //                }
                    //                catch
                    //                {
                    //                    temp = 0;
                    //                }

                    //                temp = Convert.ToInt32(endQty) + temp;
                    //                endQty = temp.ToString();

                    //                qtyQuery = "Update EquipmentQty set EndQty=" + endQty + ",TotalQty=" + endQty + ",ProcessedQty=null where EquipmentID='" + equipment + "'";
                    //            }
                    //            else
                    //            {
                    //                qtyQuery = "Insert into EquipmentQty(EquipmentID,EndQty) values ('" + equipment + "'," + endQty + ")";
                    //            }

                    //            try
                    //            {
                    //                ExecuteCustomQuery(qtyQuery);
                    //            }
                    //            catch { }
                    //        }
                    //        //for pause or stop
                    //        else if (output.Result.ToString().Contains("PROCESSED_QTY") || output.Result.ToString().Contains("STOP_QTY"))
                    //        {
                    //            string checkQuery = "Select EquipmentID,ProcessedQty,EndQty from EquipmentQty where EquipmentID='" + equipment + "'";
                    //            DataTable dt3 = new DataTable();
                    //            dt3 = CustomSelectQuery(checkQuery);
                    //            string qtyQuery = "";
                    //            string processedQty = output.Result.ToString().Replace("PROCESSED_QTY", "").Replace("STOP_QTY", "").Replace("=", "");
                    //            if (dt.Rows.Count > 0)
                    //            {
                    //                string lastProcessedQty = "";
                    //                string lastEndQty = "";
                    //                int temp = 0;
                    //                foreach (DataRow dr in dt3.Rows)
                    //                {
                    //                    lastProcessedQty = dr["ProcessedQty"].ToString();
                    //                    lastEndQty = dr["EndQty"].ToString();
                    //                }

                    //                try
                    //                {
                    //                    temp = Convert.ToInt32(lastProcessedQty);
                    //                }
                    //                catch
                    //                {
                    //                    temp = 0;
                    //                }

                    //                //temp = Convert.ToInt32(processedQty) + temp;
                    //                temp = Convert.ToInt32(processedQty);
                    //                processedQty = temp.ToString();

                    //                //for adding total
                    //                int tempEnd = 0;
                    //                try
                    //                {
                    //                    tempEnd = Convert.ToInt32(lastEndQty);
                    //                }
                    //                catch
                    //                {
                    //                    tempEnd = 0;
                    //                }

                    //                int total = 0;
                    //                total = tempEnd + Convert.ToInt32(processedQty);

                    //                qtyQuery = "Update EquipmentQty set ProcessedQty=" + processedQty + ",TotalQty=" + total + " where EquipmentID='" + equipment + "'";
                    //            }
                    //            else
                    //            {
                    //                qtyQuery = "Insert into EquipmentQty(EquipmentID,ProcessedQty) values ('" + equipment + "'," + processedQty + ")";
                    //            }

                    //            try
                    //            {
                    //                ExecuteCustomQuery(qtyQuery);
                    //            }
                    //            catch { }
                    //        }

                    //        string messageType = "FEEDBACK";

                    //        if (output.Result.ToString().Contains("ACTUAL_QTY") || output.Result.ToString().Contains("JOBEND_QTY"))
                    //        {
                    //            messageType = "COUNT-END";
                    //        }
                    //        else if (output.Result.ToString().Contains("PROCESSED_QTY"))
                    //        {
                    //            messageType = "COUNT-AUTO";
                    //        }
                    //        else if (output.Result.ToString().Contains("STOP_QTY"))
                    //        {
                    //            messageType = "COUNT-STOP";
                    //        }

                    //        string insertNotificationQuery = "Insert into TCPNotificationsTable(EquipmentId,MessageText,ReadNotification,MessageType,Date) values ('" + equipment + "','" + output.Result + "'," + "0" + ",'" + messageType + "', getdate())";
                    //        try
                    //        {
                    //            ExecuteCustomQuery(insertNotificationQuery);
                    //        }
                    //        catch { }

                    //        Common.Log("TCP Listener (Equipment: " + equipment + " Result: " + output.Result + " Date: " + DateTime.Now.ToString() + ")");
                    //    }
                    //}

                    string URLStatus = WebServiceUrl + "opc/getStatus?Equipment=" + equipment + "&Port=" + port;
                    URLStatus = string.Format(URLStatus);
                    string resultStatus = "";
                    resultStatus = webclient.DownloadString(URLStatus);
                    DefaultReturnObj output2 = Deserialize<DefaultReturnObj>(resultStatus);

                    if (Convert.ToBoolean(output2.Error) == false)
                    {
                        string status = "";
                        if (output2.Result.ToString().ToUpper() == "TRUE")
                        {
                            status = "ONLINE";
                        }
                        else
                        {
                            status = "OFFLINE";
                        }

                        MessagesHub.SendTPCStatus(equipment, status);
                        Common.Log("TCP Listener (Equipment: " + equipment + " Status: " + status + " Date: " + DateTime.Now.ToString() + ")");
                    }

                    count++;
                }

                try
                {
                    opcTimer.Enabled = true;
                }
                catch { }
            }
            catch
            {
                try
                {
                    opcTimer.Enabled = true;
                }
                catch { }
            }
        }

        private void OnChanged_EquipmentTable(object sender, RecordChangedEventArgs<EquipmentTable> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "UPDATE")
                {
                    var changedEntity = e.Entity;

                    string equipID = changedEntity.EquipID;

                    MessagesHub.SendEquipmentUpdate(equipID);
                }
            }
            catch { }
        }

        private void OnChanged_ReelTable(object sender, RecordChangedEventArgs<ReelTable> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "UPDATE")
                {
                    var changedEntity = e.Entity;

                    string equipID = changedEntity.EquipID;
                    int reelQty = 0;
                    reelQty = changedEntity.ReelQty;
                    int currentQty = 0;
                    currentQty = changedEntity.CurrentQty;
                    int currentReel = 0;
                    currentReel = changedEntity.CurrentReel;
                    int totalReel = 0;
                    totalReel = changedEntity.TotalReel;
                    int remainingReel = 0;
                    remainingReel = changedEntity.RemainingReel;
                    int allowedReel = 0;
                    allowedReel = changedEntity.AllowedReel;
                    int inReel = 0;
                    inReel = changedEntity.InReel;

                    MessagesHub.SendReelUpdate(equipID, reelQty, currentQty, currentReel, totalReel, remainingReel, allowedReel, inReel);
                }
            }
            catch { }
        }

        private void OnChanged_EquipmentQty(object sender, RecordChangedEventArgs<EquipmentQty> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "UPDATE" || transactionType == "INSERT")
                {
                    var changedEntity = e.Entity;

                    int ProcessedQty = changedEntity.ProcessedQty;
                    int EndQty = changedEntity.EndQty;
                    int TotalQty = 0;
                    string equipment = changedEntity.EquipmentID;
                    int BrandedQty = changedEntity.BrandedQty;
                    int UnbrandedQty = changedEntity.UnbrandedQty;

                    TotalQty = ProcessedQty + EndQty;

                    MessagesHub.SendProcessedQTY(equipment, TotalQty, BrandedQty, UnbrandedQty);
                    Common.Log("Processed QTY (Equipment: " + equipment + " TOTAL QTY: " + TotalQty + " BRANDED QTY: " + BrandedQty + " UNBRANDED QTY: " + UnbrandedQty + " Date: " + DateTime.Now.ToString() + ")");
                }
            }
            catch { }
        }

        private void OnChanged_EquipmentStatus(object sender, RecordChangedEventArgs<EquipmentStatus> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "UPDATE")
                {
                    var changedEntity = e.Entity;
                    string equipment = changedEntity.Equipment.ToString();
                    string status = changedEntity.Status.ToString().ToUpper();

                    if (status != "INITIALIZING" && status != "CONNECTING" && status != "FAULTED")
                    {
                        if (status == "CONNECTION ESTABLISHED")
                        {
                            status = "IDLE";
                        }
                        else if (status == "COMMUNICATING")
                        {
                            status = "ONLINE";
                        }
                        else if (status == "NOT CONNECTED")
                        {
                            status = "OFFLINE";
                        }
                        else
                        {
                            status = "OFFLINE";
                        }

                        MessagesHub.SendMachineStatus(equipment, status);
                        Common.Log("Equipment Status Changed (Equipment: " + equipment + " Status: " + status + " Date: " + DateTime.Now.ToString() + ")");
                    }
                }
            }
            catch { }
        }

        private void OnChanged_TCPNotifications(object sender, RecordChangedEventArgs<TCPNotifications> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();
                var changedEntity = e.Entity;
                var EquipmentID = changedEntity.EquipmentId;

                if (transactionType == "INSERT")
                {
                    MessagesHub.SendTCPNotification(EquipmentID);
                }
                else if (transactionType == "UPDATE")
                {
                    MessagesHub.SendReadTCPNotification(EquipmentID);
                }
            }
            catch { }
        }

        private void OnChanged_Alarm(object sender, RecordChangedEventArgs<Alarm> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                var changedEntity = e.Entity;
                string messageId = changedEntity.MessageId.ToString();
                string equip = changedEntity.Equipment.ToString();
                string message = changedEntity.Message.ToString();
                string transactionId = changedEntity.TransactionId.ToString();
                string readNotification = changedEntity.ReadNotification.ToString();
                DateTime date = changedEntity.Date;
                string messageType = changedEntity.MessageType.ToString();

                if (transactionType == "INSERT")
                {
                    MessagesHub.SendAlarm(messageId, equip, message, readNotification, transactionId, date, messageType);
                }
                else if (transactionType == "UPDATE")
                {
                    MessagesHub.SendReadAlarm(messageId, equip, message, readNotification, transactionId, date, messageType);
                }
            }
            catch { }
        }

        private void OnChanged_SECSGEMQty(object sender, RecordChangedEventArgs<SECSGEM_Qty> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "INSERT" || transactionType == "UPDATE")
                {
                    var changedEntity = e.Entity;
                    string equip = changedEntity.EquipID.ToString();
                    int qty = 0;
                    try
                    {
                        qty = changedEntity.Qty;
                    }
                    catch { }

                    int qty2 = 0;
                    try
                    {
                        qty2 = changedEntity.Qty2;
                    }
                    catch { }

                    int multiplier = 1;
                    try
                    {
                        multiplier = changedEntity.Multiplier;

                        if (multiplier == null)
                        {
                            multiplier = 1;
                        }
                        if (multiplier == 0)
                        {
                            multiplier = 1;
                        }
                    }
                    catch { }


                    int total = qty + qty2;

                    MessagesHub.SendSECSGEMCounter(equip, qty, qty2, multiplier);
                    Common.Log("SECSGEM QTY (Equipment: " + equip + " MULTIPLIER: " + multiplier + " QTY: " + total + " Date: " + DateTime.Now.ToString() + ")");
                }
            }
            catch { }
        }

        private void OnChanged_SECSGEM(object sender, RecordChangedEventArgs<SECSGEM_Message> e)
        {
            try
            {
                string transactionType = e.ChangeType.ToString().ToUpper();

                if (transactionType == "INSERT")
                {
                    var changedEntity = e.Entity;

                    int ID = changedEntity.ID;
                    string equipment = changedEntity.Equipment.ToString();
                    string streamFunction = changedEntity.StreamFunction.ToString();
                    string direction = changedEntity.Direction.ToString();
                    string requestResponse = changedEntity.RequestResponse.ToString();
                    string commonID = "";

                    try
                    {
                        commonID = changedEntity.CommonID.ToString();
                    }
                    catch { }

                    int txID = changedEntity.TxID;
                    int reply = changedEntity.Reply;
                    string messageText = changedEntity.Message.ToString();
                    DateTime TimeSentReceived = changedEntity.TimeSentReceived;

                    string PPID = "";
                    string PPBODY = "";
                    int checker = 0;
                    if (streamFunction == "S7F3" && direction == "Received")
                    {
                        var resultObjects = AllChildren(JObject.Parse(messageText))
                            .First(c => c.Type == JTokenType.Array && c.Path.Contains("body"))
                            .Children<JObject>();

                        foreach (JObject result in resultObjects)
                        {
                            foreach (JProperty property in result.Properties())
                            {
                                if (property.Name == "value")
                                {
                                    if (checker == 0)
                                    {
                                        PPID = property.Value.ToString();
                                    }
                                    else if (checker == 1)
                                    {
                                        PPBODY = property.Value.ToString();
                                    }

                                    checker++;
                                }
                            }
                        }

                        string recipeFilePath = ConfigurationManager.AppSettings[env + "_" + "recipeDirectory"].ToString();

                        try
                        {
                            string[] strArr = new string[] { };
                            strArr = PPBODY.Replace("[", "").Replace("]", "").Split(',');
                            int[] intArr = new int[] { };

                            intArr = strArr.Select(int.Parse).ToArray();

                            byte[] bytes = intArr.Select(x => (byte)x).ToArray();

                            File.WriteAllBytes(PPID, bytes);

                            FileStream streamFile = new FileStream(recipeFilePath + "\\" + PPID, FileMode.Create, FileAccess.Write);
                            streamFile.Write(bytes, 0, bytes.Length);
                            streamFile.Close();

                            MessagesHub.SendRecipe(equipment, recipeFilePath + "\\" + PPID);
                            Common.Log("Recipe Uploaded (Equipment: " + equipment + " Directory: " + recipeFilePath + "\\" + PPID + " Date: " + DateTime.Now.ToString() + ")");
                        }
                        catch (Exception err)
                        {
                            Common.Log("Error Uploading Recipe: (" + err.Message + ") " + "(Equipment: " + equipment + " Directory: " + recipeFilePath + "\\" + PPID + " Date: " + DateTime.Now.ToString() + ")");
                        }
                    }
                    else if (streamFunction == "S6F11" && direction == "Received")
                    {
                        string json = messageText;
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                        string header = dict["header"].ToString();
                        var dictHeader = JsonConvert.DeserializeObject<Dictionary<string, object>>(header);
                        string stream = dictHeader["stream"].ToString();
                        string function = dictHeader["function"].ToString();
                        string body = dict["body"].ToString();
                        JArray a = JArray.Parse(body);
                        string CEID = "";
                        string temp_val = "";
                        bool isCount = false;

                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                string name = p.Name;

                                if (name == "value")
                                {
                                    temp_val = (string)p.Value;
                                }

                                if (name == "doc")
                                {
                                    if ((string)p.Value == "CEID, Collected Event ID")
                                    {
                                        CEID = temp_val;
                                    }
                                }

                            }
                        }

                        string query = "Select a.Type from tblEquipmentType a left join EquipmentTable b on a.ID=b.EquipType where b.EquipID='" + equipment + "'";
                        DataTable dt = CustomSelectQuery(query);
                        string type = "";
                        foreach (DataRow dr in dt.Rows)
                        {
                            type = dr["Type"].ToString();
                        }

                        string URL = "";
                        string res = "";
                        var Webclient = new WebClient();
                        string Format = "";
                        string Variable = "";
                        int inQTY = 1;

                        if (type == "DEK PRINTER")
                        {
                            if (CEID == "31277") //31277 Board printed
                            {
                                Format = "U4";
                                Variable = "1020"; //1020(batch_count)
                                URL = WebServiceUrl + "secsgem/S1F3_StatusRequestWithSleep?Equipment=" + equipment + "&Format=" + Format + "&Variable=" + Variable;
                                URL = string.Format(URL);

                                res = Webclient.DownloadString(URL);
                                isCount = true;
                            }
                        }
                        else if (type == "HELLER OVEN")
                        {
                            if (CEID == "1080") //1080 HellerBoardExitLane1
                            {
                                Format = "U4";
                                Variable = "13049"; //13049(HellerPVChannel49) Boards processed Lane1
                                URL = WebServiceUrl + "secsgem/S1F3_StatusRequestWithSleep?Equipment=" + equipment + "&Format=" + Format + "&Variable=" + Variable;
                                URL = string.Format(URL);

                                res = Webclient.DownloadString(URL);
                                isCount = true;
                            }

                            if (CEID == "1081") //1081 HellerBoardExitLane2
                            {
                                Format = "U4";
                                Variable = "13050"; //13049(HellerPVChannel50) Boards processed Lane2
                                URL = WebServiceUrl + "secsgem/S1F3_StatusRequestWithSleep?Equipment=" + equipment + "&Format=" + Format + "&Variable=" + Variable;
                                URL = string.Format(URL);

                                res = Webclient.DownloadString(URL);
                                isCount = true;
                                inQTY = 2;
                            }
                        }
                        else if (type == "PANASONIC COMPONENT ATTACH")
                        {
                            if (CEID == "16016") //16016 Product1BoardEnd??
                            {
                                Format = "U4";
                                Variable = "7003"; //7003(Board)
                                URL = WebServiceUrl + "secsgem/S1F3_StatusRequestWithSleep?Equipment=" + equipment + "&Format=" + Format + "&Variable=" + Variable;
                                URL = string.Format(URL);

                                res = Webclient.DownloadString(URL);
                                isCount = true;
                            }
                        }

                        if (isCount == true)
                        {
                            bool isProcessing = false;
                            string queryProcess = "Select Process from EquipmentTable where EquipID='" + equipment + "'";
                            DataTable dtProc = new DataTable();
                            dtProc = CustomSelectQuery(queryProcess);
                            if (dtProc != null)
                            {
                                if (dtProc.Rows.Count > 0)
                                {
                                    string proc = "";
                                    foreach (DataRow dr in dtProc.Rows)
                                    {
                                        proc = dr["Process"].ToString();
                                    }

                                    if (proc.ToUpper() == "1" || proc.ToUpper() == "TRUE")
                                    {
                                        isProcessing = true;
                                    }
                                    else
                                    {
                                        isProcessing = false;
                                    }
                                }
                            }

                            if (isProcessing == true)
                            {
                                var dict2 = JsonConvert.DeserializeObject<Dictionary<string, object>>(res);
                                string header2 = dict2["header"].ToString();
                                var dictHeader2 = JsonConvert.DeserializeObject<Dictionary<string, object>>(header2);
                                string stream2 = dictHeader2["stream"].ToString();
                                string function2 = dictHeader2["function"].ToString();
                                string body2 = dict2["body"].ToString();
                                JArray a2 = JArray.Parse(body2);
                                string value = "0";
                                foreach (JObject o in a2.Children<JObject>())
                                {
                                    foreach (JProperty p in o.Properties())
                                    {
                                        if (p.Name == "value")
                                        {
                                            value = (string)p.Value;
                                        }
                                    }
                                }
                                
                                string queryQty = "";
                                if (inQTY == 1)
                                {
                                    queryQty = "Update tblSECSGEM_Qty SET Qty=" + value + " where EquipID='" + equipment + "'";
                                }
                                else if (inQTY == 2)
                                {
                                    queryQty = "Update tblSECSGEM_Qty SET Qty2=" + value + " where EquipID='" + equipment + "'";
                                }

                                ExecuteCustomQuery(queryQty);
                            }
                        }

                        MessagesHub.SendS6F11(equipment, ID, messageText);
                    }
                    else if (streamFunction == "S5F1")
                    {
                        //alarms
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(messageText);
                        string header = dict["header"].ToString();
                        var dictHeader = JsonConvert.DeserializeObject<Dictionary<string, object>>(header);
                        string stream = dictHeader["stream"].ToString();
                        string function = dictHeader["function"].ToString();
                        string body = dict["body"].ToString();
                        JArray a = JArray.Parse(body);
                        string value = "0";
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                if (p.Name == "value")
                                {
                                    value = (string)p.Value;
                                }
                            }
                        }
                        string query = "Insert into NotificationsTable(EquipmentId,MessageText,ReadNotification,Date,TxnID,MessageType) values ('" + equipment + "','" + value + "',0,getdate()," + txID + ",'ALARM')";
                        ExecuteCustomQuery(query);
                    }
                    else
                    {
                        //others
                    }
                }
            }
            catch { }
        }

        private void Clear()
        {
            //Disable the timer
            try
            {
                opcTimer.Enabled = false;
            }
            catch { }

            try
            {
                materialExpirationTimer.Enabled = false;
            }
            catch { }

            //Equipment Table
            try
            {
                globalEquipmentTableDep.OnChanged -= OnChanged_EquipmentTable;
            }
            catch { }

            try
            {
                globalEquipmentTableDep.Stop();
            }
            catch { }

            try
            {
                EquipmentTableDep.OnChanged -= OnChanged_EquipmentTable;
            }
            catch { }

            try
            {
                EquipmentTableDep.Stop();
            }
            catch { }


            //Reel Table
            try
            {
                globalReelTableDep.OnChanged -= OnChanged_ReelTable;
            }
            catch { }

            try
            {
                globalReelTableDep.Stop();
            }
            catch { }

            try
            {
                ReelTableDep.OnChanged -= OnChanged_ReelTable;
            }
            catch { }

            try
            {
                ReelTableDep.Stop();
            }
            catch { }

            if (enableOPC == true)
            {
                //Equipment Qty
                try
                {
                    globalEquipmentQtyDep.OnChanged -= OnChanged_EquipmentQty;
                }
                catch { }

                try
                {
                    globalEquipmentQtyDep.Stop();
                }
                catch { }

                try
                {
                    EquipmentQtyDep.OnChanged -= OnChanged_EquipmentQty;
                }
                catch { }

                try
                {
                    EquipmentQtyDep.Stop();
                }
                catch { }

                //TCP Notification
                try
                {
                    globalTCPNotificationsDep.OnChanged -= OnChanged_TCPNotifications;
                }
                catch { }

                try
                {
                    globalTCPNotificationsDep.Stop();
                }
                catch { }

                try
                {
                    TCPNotificationsDep.OnChanged -= OnChanged_TCPNotifications;
                }
                catch { }

                try
                {
                    TCPNotificationsDep.Stop();
                }
                catch { }
            }

            if (enableSECSGEM == true)
            {
                //Equipment Status
                try
                {
                    globalEquipmentStatusDep.OnChanged -= OnChanged_EquipmentStatus;
                }
                catch { }

                try
                {
                    globalEquipmentStatusDep.Stop();
                }
                catch { }

                try
                {
                    EquipmentStatusDep.OnChanged -= OnChanged_EquipmentStatus;
                }
                catch { }

                try
                {
                    EquipmentStatusDep.Stop();
                }
                catch { }

                //Alarms
                try
                {
                    globalAlarmDep.OnChanged -= OnChanged_Alarm;
                }
                catch { }

                try
                {
                    globalAlarmDep.Stop();
                }
                catch { }

                try
                {
                    AlarmDep.OnChanged -= OnChanged_Alarm;
                }
                catch { }

                try
                {
                    AlarmDep.Stop();
                }
                catch { }

                //SECS/GEM
                try
                {
                    globalSECSGEM_Dep.OnChanged -= OnChanged_SECSGEM;
                }
                catch { }

                try
                {
                    globalSECSGEM_Dep.Stop();
                }
                catch { }

                try
                {
                    SECSGEM_Dep.OnChanged -= OnChanged_SECSGEM;
                }
                catch { }

                try
                {
                    SECSGEM_Dep.Stop();
                }
                catch { }

                //SECSGEM Qty
                try
                {
                    globalSECSGEMQtyDep.OnChanged -= OnChanged_SECSGEMQty;
                }
                catch { }

                try
                {
                    globalSECSGEMQtyDep.Stop();
                }
                catch { }

                try
                {
                    SECSGEMQtyDep.OnChanged -= OnChanged_SECSGEMQty;
                }
                catch { }

                try
                {
                    SECSGEMQtyDep.Stop();
                }
                catch { }
            }
        }

        private void ClearObjects()
        {
            try
            {
                string query = "";
                query = "select SPECIFIC_NAME from information_schema.routines where routine_type = 'PROCEDURE' and SPECIFIC_NAME like '%_QueueActivation' order by SPECIFIC_NAME";
                DataTable dt = new DataTable();
                dt = CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            string stored_proc_name = dr["SPECIFIC_NAME"].ToString();
                            string root_name = stored_proc_name.Replace("_QueueActivation", "");
                            string trigger_name = "tr_" + root_name;
                            string service_name = root_name;
                            string queue_name = root_name;
                            string contract_name = root_name;
                            string message_type = root_name;

                            //Drop the stored procedure
                            query = "DROP PROCEDURE [dbo].[" + stored_proc_name + "]";
                            try
                            {
                                ExecuteCustomQuery(query);
                            }
                            catch { }

                            //Drop the trigger
                            query = "DROP TRIGGER [dbo].[" + trigger_name + "]";
                            try
                            {
                                ExecuteCustomQuery(query);
                            }
                            catch { }

                            //Drop the service
                            query = "DROP SERVICE [" + service_name + "]";
                            try
                            {
                                ExecuteCustomQuery(query);
                            }
                            catch { }

                            //Drop the queue
                            query = "DROP QUEUE [dbo].[" + queue_name + "]";
                            try
                            {
                                ExecuteCustomQuery(query);
                            }
                            catch { }

                            //Drop the contract
                            query = "DROP CONTRACT [" + contract_name + "]";
                            try
                            {
                                ExecuteCustomQuery(query);
                            }
                            catch { }

                            //Determine the table to drop the Message Type
                            List<string> lstCols = new List<string>();
                            if (root_name.Contains("EquipmentQty"))
                            {
                                lstCols.Add(message_type + "/" + "BrandedQty");
                                lstCols.Add(message_type + "/" + "EndQty");
                                lstCols.Add(message_type + "/" + "EquipmentID");
                                lstCols.Add(message_type + "/" + "ProcessedQty");
                                lstCols.Add(message_type + "/" + "TotalQty");
                                lstCols.Add(message_type + "/" + "UnbrandedQty");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("PrintTable"))
                            {
                                lstCols.Add(message_type + "/" + "EquipID");
                                lstCols.Add(message_type + "/" + "ReelQty");
                                lstCols.Add(message_type + "/" + "CurrentQty");
                                lstCols.Add(message_type + "/" + "CurrentReel");
                                lstCols.Add(message_type + "/" + "TotalReel");
                                lstCols.Add(message_type + "/" + "RemainingReel");
                                lstCols.Add(message_type + "/" + "AllowedReel");
                                lstCols.Add(message_type + "/" + "InReel");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("Messages"))
                            {
                                lstCols.Add(message_type + "/" + "CommonID");
                                lstCols.Add(message_type + "/" + "Direction");
                                lstCols.Add(message_type + "/" + "Equipment");
                                lstCols.Add(message_type + "/" + "ID");
                                lstCols.Add(message_type + "/" + "Message");
                                lstCols.Add(message_type + "/" + "Reply");
                                lstCols.Add(message_type + "/" + "RequestResponse");
                                lstCols.Add(message_type + "/" + "StreamFunction");
                                lstCols.Add(message_type + "/" + "TimeSentReceived");
                                lstCols.Add(message_type + "/" + "TxID");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("NotificationsTable"))
                            {
                                lstCols.Add(message_type + "/" + "Date");
                                lstCols.Add(message_type + "/" + "EquipmentId");
                                lstCols.Add(message_type + "/" + "MessageId");
                                lstCols.Add(message_type + "/" + "MessageText");
                                lstCols.Add(message_type + "/" + "MessageType");
                                lstCols.Add(message_type + "/" + "ReadNotification");
                                lstCols.Add(message_type + "/" + "TxnID");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("SECSGEM_EquipmentInfo"))
                            {
                                lstCols.Add(message_type + "/" + "Equipment");
                                lstCols.Add(message_type + "/" + "Status");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("TCPNotificationsTable"))
                            {
                                lstCols.Add(message_type + "/" + "Date");
                                lstCols.Add(message_type + "/" + "EquipmentId");
                                lstCols.Add(message_type + "/" + "MessageId");
                                lstCols.Add(message_type + "/" + "MessageText");
                                lstCols.Add(message_type + "/" + "MessageType");
                                lstCols.Add(message_type + "/" + "ReadNotification");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("EquipmentTable"))
                            {
                                lstCols.Add(message_type + "/" + "DeviceID");
                                lstCols.Add(message_type + "/" + "EquipData");
                                lstCols.Add(message_type + "/" + "EquipID");
                                lstCols.Add(message_type + "/" + "EquipIP");
                                lstCols.Add(message_type + "/" + "EquipModel");
                                lstCols.Add(message_type + "/" + "EquipPort");
                                lstCols.Add(message_type + "/" + "EquipSerialNum");
                                lstCols.Add(message_type + "/" + "EquipType");
                                lstCols.Add(message_type + "/" + "HostID");
                                lstCols.Add(message_type + "/" + "ID");
                                lstCols.Add(message_type + "/" + "IsGrouped");
                                lstCols.Add(message_type + "/" + "LastFeedBackData");
                                lstCols.Add(message_type + "/" + "LastFeedBackTime");
                                lstCols.Add(message_type + "/" + "LotInProcess");
                                lstCols.Add(message_type + "/" + "Process");
                                lstCols.Add(message_type + "/" + "TimeStamp");
                                lstCols.Add(message_type + "/" + "TrackInQty");
                                lstCols.Add(message_type + "/" + "TrackInToleranceQty");
                                lstCols.Add(message_type + "/" + "UserInProcess");
                                lstCols.Add(message_type + "/" + "RecipeInProcess");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }
                            else if (root_name.Contains("tblSECSGEM_Qty"))
                            {
                                lstCols.Add(message_type + "/" + "EquipID");
                                lstCols.Add(message_type + "/" + "Qty");
                                lstCols.Add(message_type + "/" + "Qty2");
                                lstCols.Add(message_type + "/" + "Multiplier");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Insert");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Update");
                                lstCols.Add(message_type + "/" + "StartDialog" + "/" + "Delete");
                            }

                            //Loop and drop the message types
                            if (lstCols != null)
                            {
                                if (lstCols.Count > 0)
                                {
                                    foreach (string temp in lstCols)
                                    {
                                        query = "DROP MESSAGE TYPE [" + temp + "]";
                                        try
                                        {
                                            ExecuteCustomQuery(query);
                                        }
                                        catch { }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        protected override void OnStop()
        {
            try
            {
                Clear();
            }
            catch { }

            try
            {
                ClearObjects();
            }
            catch { }

            Common.Log("Stopping Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
        }

        protected override void OnShutdown()
        {
            try
            {
                Clear();
            }
            catch { }

            try
            {
                ClearObjects();
            }
            catch { }

            Common.Log("Shutting Down Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
        }

        protected override void OnPause()
        {
            Common.Log("Pausing Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
        }

        protected override void OnContinue()
        {
            Common.Log("Resuming Cell Controller SignalR Service on " + url + " (" + Environment.MachineName.ToUpper() + ") Date: " + DateTime.Now.ToString());
        }

        private static bool TestConnection(string connectionString)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    return true;
                }
                catch (SqlException)
                {
                    return false;
                }
            }
        }

        private DataTable CustomSelectQuery(string query)
        {
            SqlConnection conn = new SqlConnection(connString);
            SqlCommand cmd = new SqlCommand(query, conn);
            //cmd.CommandTimeout = 3600;

            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            SqlDataAdapter da = new SqlDataAdapter(cmd);

            try
            {
                conn.Open();
                da.Fill(ds);
                dt = ds.Tables[0];
                da.Dispose();
                cmd.Dispose();
                conn.Close();
                conn.Dispose();
                SqlConnection.ClearPool(conn);
            }
            catch
            {
                conn.Close();
                conn.Dispose();
                SqlConnection.ClearPool(conn);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                    conn.Dispose();
                    SqlConnection.ClearPool(conn);
                }
            }

            return dt;
        }

        private bool ExecuteCustomQuery(string query)
        {
            SqlConnection conn = new SqlConnection(connString);
            SqlCommand cmd = new SqlCommand(query, conn);
            //cmd.CommandTimeout = 3600;

            bool result = false;

            try
            {
                conn.Open();
                cmd.ExecuteNonQuery();
                cmd.Dispose();
                conn.Close();
                conn.Dispose();
                result = true;
                SqlConnection.ClearPool(conn);
            }
            catch
            {
                result = false;
                conn.Close();
                conn.Dispose();
                SqlConnection.ClearPool(conn);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                    conn.Dispose();
                    SqlConnection.ClearPool(conn);
                }
            }

            return result;
        }

        private IPAddress LocalIPAddress()
        {
            if (!NetworkInterface.GetIsNetworkAvailable())
            {
                return null;
            }

            IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());

            return host
                .AddressList
                .FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork);
        }

        private IEnumerable<JToken> AllChildren(JToken json)
        {
            foreach (var c in json.Children())
            {
                yield return c;
                foreach (var cc in AllChildren(c))
                {
                    yield return cc;
                }
            }
        }

        private T Deserialize<T>(string json)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(json);
            }
            catch
            {
                return default(T);
            }
        }
    }
}
