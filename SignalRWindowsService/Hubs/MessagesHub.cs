using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace SignalRWindowsService.Hubs
{
    [HubName("MessagesHub")]
    public class MessagesHub : Hub
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string connString = ConfigurationManager.ConnectionStrings[env + "_" + "DBConn"].ConnectionString;

        [HubMethodName("TestSend")]
        public void TestSend(string equipment, int processedQty)
        {
            string checkQuery = "Select EquipmentID,ProcessedQty from EquipmentQty where EquipmentID='" + equipment + "'";
            DataTable dt = new DataTable();
            dt = CustomSelectQuery(checkQuery);
            string qtyQuery = "";
            if (dt.Rows.Count > 0)
            {
                qtyQuery = "Update EquipmentQty set ProcessedQty=" + processedQty.ToString() + " where EquipmentID='" + equipment + "'";
            }
            else
            {
                qtyQuery = "Insert into EquipmentQty(EquipmentID,ProcessedQty) values ('" + equipment + "'," + processedQty.ToString() + ")";

            }

            try
            {
                ExecuteCustomQuery(qtyQuery);
            }
            catch { }

            string message = "ACTUAL_QTY=" + processedQty.ToString();
            string messageType = "COUNT";
            string insertNotificationQuery = "Insert into TCPNotificationsTable(EquipmentId,MessageText,ReadNotification,MessageType,Date) values ('" + equipment + "','" + message + "'," + "0" + ",'" + messageType + "', getdate())";
            try
            {
                ExecuteCustomQuery(insertNotificationQuery);
            }
            catch { }
        }

        [HubMethodName("SendEquipmentBroadcast")]
        public void SendEquipmentBroadcast(string equipment)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.BroadcastEquipmentUpdate(equipment);
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

        [HubMethodName("SendMachineStatus")]
        public static void SendMachineStatus(string equipment, string status)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.MachineStatus(equipment, status);
        }

        [HubMethodName("SendProcessedQTY")]
        public static void SendProcessedQTY(string equipment, int totalQty, int brandedQty, int unbrandedQty)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.ProcessedQTY(equipment, totalQty, brandedQty, unbrandedQty);
        }

        [HubMethodName("SendEquipmentUpdate")]
        public static void SendEquipmentUpdate(string equipID)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.EquipmentUpdate(equipID);
        }

        [HubMethodName("SendReelUpdate")]
        public static void SendReelUpdate(string equipID, int ReelQty, int CurrentQty, int CurrentReel, int TotalReel, int RemainingReel, int AllowedReel, int InReel)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.ReelUpdate(equipID, ReelQty, CurrentQty, CurrentReel, TotalReel, RemainingReel, AllowedReel, InReel);
        }

        [HubMethodName("SendTCPNotification")]
        public static void SendTCPNotification(string equipment)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.TCPNotification(equipment);
        }

        [HubMethodName("SendReadTCPNotification")]
        public static void SendReadTCPNotification(string equipment)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.ReadTCPNotification(equipment);
        }

        [HubMethodName("SendAlarm")]
        public static void SendAlarm(string messageId, string equipment, string message, string readNotification, string transactionId, DateTime date, string messageType)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.Alarm(messageId, equipment, message, readNotification, transactionId, date, messageType);
        }

        [HubMethodName("SendReadAlarm")]
        public static void SendReadAlarm(string messageId, string equipment, string message, string readNotification, string transactionId, DateTime date, string messageType)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.ReadAlarm(messageId, equipment, message, readNotification, transactionId, date, messageType);
        }

        [HubMethodName("SendRecipe")]
        public static void SendRecipe(string equipment, string recipeFilePath)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.Recipe(equipment, recipeFilePath);
        }

        [HubMethodName("SendS6F11")]
        public static void SendS6F11(string equipment, int MsgID, string message)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.S6F11FromEquipment(equipment, MsgID, message);
        }

        [HubMethodName("SendSECSGEMCounter")]
        public static void SendSECSGEMCounter(string equipment, int qty, int qty2, int multiplier)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.SECSGEMCounter(equipment, qty, qty2, multiplier);
        }

        [HubMethodName("SendTPCListenedValue")]
        public static void SendTPCListenedValue(string equipment, string type, string message)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.TCPListen(equipment, type, message);
        }

        [HubMethodName("SendTPCStatus")]
        public static void SendTPCStatus(string equipment, string status)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            context.Clients.All.MachineStatus(equipment, status);
        }

        //[HubMethodName("Send")]
        //public void Send(string name, string message)
        //{
        //    Clients.All.addMessage(name, message);
        //}

        //[HubMethodName("test")]
        //public static void test()
        //{
        //    string test = "Hello World!";
        //    IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
        //    context.Clients.All.temp(test);
        //}
    }
}
