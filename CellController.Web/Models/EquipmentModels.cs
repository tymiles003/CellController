using CellController.Web.Helpers;
using CellController.Web.ViewModels;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace CellController.Web.Models
{
    public class EquipmentModels
    {
        //for getting the columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("a.ID", "id_number");
            cols.Add("a.EquipID", "equipment_id_string");
            cols.Add("a.EquipModel", "model_string");
            cols.Add("a.EquipSerialNum", "serial_number_string");
            //cols.Add("a.EquipData", "data_string");
            //cols.Add("a.TimeStamp", "date_created_datetime");
            cols.Add("a.EquipIP", "ip_string");
            cols.Add("a.EquipPort", "port_string");
            cols.Add("a.HostID", "host_id_string");
            cols.Add("a.DeviceID", "device_id_string");
            cols.Add("b.Type", "type_string");

            return cols;
        }

        //function for getting ID of equipment
        public static int GetEquipmentID(string EquipmentName)
        {
            string query = "select ID from EquipmentTable where EquipID='" + EquipmentName + "'";

            DataTable dt = new DataTable();

            try
            {
                dt = DBModel.CustomSelectQuery(query);
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

        //function for getting equipment by type
        public static DataTable GetEquipmentByType(string typeCode)
        {
            string query = "select ID from EquipmentTable where EquipType=" + typeCode.ToString();

            DataTable dt = new DataTable();

            try
            {
                dt = DBModel.CustomSelectQuery(query);
            }
            catch
            {
                dt = null;
            }

            return dt;
        }

        public static bool isSECSGEM(string EquipID)
        {
            string query = "select b.IsSECSGEM from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where a.EquipID='" + EquipID + "'";

            DataTable dt = new DataTable();

            bool isSECSGEM = false;

            try
            {
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        string secsgem = "";

                        secsgem = dr["IsSECSGEM"].ToString();
                        
                        if (secsgem.ToUpper() == "1" || secsgem.ToUpper() == "TRUE")
                        {
                            isSECSGEM = true;
                        }
                        else
                        {
                            isSECSGEM = false;
                        }
                    }
                }

                return isSECSGEM;
            }
            catch
            {
                return false;
            }
        }

        public static void ValidateSECSGEMQty(string EquipID, int Multiplier)
        {
            string query = "select EquipID from tblSECSGEM_Qty where EquipID='" + EquipID + "'";
            string query2 = "insert into tblSECSGEM_Qty(EquipID,Qty,Qty2,Multiplier) values ('" + EquipID + "',NULL,NULL," + Multiplier.ToString() + ")";
            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                if (dt == null)
                {
                    DBModel.ExecuteCustomQuery(query2);
                }
                else
                {
                    if (dt.Rows.Count == 0)
                    {
                        DBModel.ExecuteCustomQuery(query2);
                    }
                    else
                    {
                        query2 = "Update tblSECSGEM_Qty set Multiplier=" + Multiplier.ToString() + " where EquipID='" + EquipID + "'";
                        DBModel.ExecuteCustomQuery(query2);
                    }
                }
            }
            catch { }
        }

        public static string EquipmentType(string EquipID)
        {
            string query = "select b.Type as 'Type' from EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID where a.EquipID='" + EquipID + "'";

            DataTable dt = new DataTable();

            try
            {
                dt = DBModel.CustomSelectQuery(query);
                string type = null;

                if (dt != null)
                {
                    foreach(DataRow dr in dt.Rows)
                    {
                        type = dr["Type"].ToString();
                    }
                }

                return type;
            }
            catch
            {
                return null;
            }
        }

        //function for deleting equipment by type
        public static bool DeleteEquipmentByType(string typeCode)
        {
            bool result = false;

            string query = "delete from EquipmentTable where EquipType=" + typeCode.ToString();

            try
            {
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for getting the count
        public static int GetCount(string where, string searchStr)
        {
            //for searching
            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " a.EquipID like '%" + searchStr + "%'"
                        + " OR a.EquipModel like '%" + searchStr + "%'"
                        + " OR a.EquipSerialNum like '%" + searchStr + "%'"
                        //+ " OR a.EquipData like '%" + searchStr + "%'"
                        //+ " OR a.TimeStamp like '%" + searchStr + "%' "
                        + " OR a.EquipIP like '%" + searchStr + "%'"
                        + " OR a.EquipIP like '%" + searchStr + "%' "
                        + " OR a.EquipPort like '%" + searchStr + "%'"
                        + " OR a.HostID like '%" + searchStr + "%' "
                        + " OR DeviceID like '%" + searchStr + "%'"
                        + " OR b.Type like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " a.EquipID like '%" + searchStr + "%'"
                        + " OR a.EquipModel like '%" + searchStr + "%'"
                        + " OR a.EquipSerialNum like '%" + searchStr + "%'"
                        //+ " OR a.EquipData like '%" + searchStr + "%'"
                        //+ " OR a.TimeStamp like '%" + searchStr + "%' "
                        + " OR a.EquipIP like '%" + searchStr + "%'"
                        + " OR a.EquipIP like '%" + searchStr + "%' "
                        + " OR a.EquipPort like '%" + searchStr + "%'"
                        + " OR a.HostID like '%" + searchStr + "%' "
                        + " OR DeviceID like '%" + searchStr + "%'"
                        + " OR b.Type like '%" + searchStr + "%'"
                        + ")";
                }
            }

            //this where statement will be used if the config for certain equipments are set to false (disable feature)
            if (where == "")
            {
                where = " WHERE ";
                string temp = "";

                foreach (var entry in HttpHandler.isEquipmentEnabled)
                {
                    if (entry.Value.IsEnabled == false && temp == "")
                    {
                        temp += " b.Type<>'" + entry.Value.Type + "'";
                    }
                    else
                    {
                        if (entry.Value.IsEnabled == false)
                        {
                            temp += " AND b.Type<>'" + entry.Value.Type + "'";
                        }
                    }
                }

                if (temp == "")
                {
                    where = "";
                }
                else
                {
                    where += temp;
                }
            }
            else
            {
                string temp = "";

                foreach (var entry in HttpHandler.isEquipmentEnabled)
                {
                    if (entry.Value.IsEnabled == false)
                    {
                        temp += " AND b.Type<>'" + entry.Value.Type + "'";
                    }
                }

                where += temp;

            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID " + where;

            //execute the sql statement
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //get the equipment type by id
        public static string GetEquipmentTypeByID(int ID)
        {
            DataTable dt = new DataTable();
            dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Type FROM tblEquipmentType where ID=" + ID.ToString() + "", CommandType.Text);

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

        //get the port of the equipment
        public static string GetPort(string Equipment)
        {
            string port = "";
            try
            {
                DataTable dt = new DataTable();
                string query = "Select EquipPort from EquipmentTable where EquipID='" + Equipment + "'";
                dt = DBModel.CustomSelectQuery(query);
                foreach (DataRow dr in dt.Rows)
                {
                    port = dr["EquipPort"].ToString();
                }
            }
            catch
            {
                port = "";
            }

            return port;
        }

        //get the equipment type by equipment ID (joined table)
        public static string GetEquipmentTypeJoin(int ID)
        {
            DataTable dt = new DataTable();
            dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT a.Type FROM tblEquipmentType a left join EquipmentTable b on a.ID=b.EquipType where b.ID=" + ID.ToString() + "", CommandType.Text);

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

        //for getting the data
        public static DataTable GetData(int offset, int next, string where, string sorting, string searchStr)
        {
            //call for the method in getting the columns
            Dictionary<string, string> cols = GetCols();

            //default sorting
            if (sorting == "")
            {
                sorting = "a.EquipID,b.Type asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " a.EquipID like '%" + searchStr + "%'"
                        + " OR a.EquipModel like '%" + searchStr + "%'"
                        + " OR a.EquipSerialNum like '%" + searchStr + "%'"
                        //+ " OR a.EquipData like '%" + searchStr + "%'"
                        //+ " OR a.TimeStamp like '%" + searchStr + "%' " 
                        + " OR a.EquipIP like '%" + searchStr + "%'"
                        + " OR a.EquipIP like '%" + searchStr + "%' "
                        + " OR a.EquipPort like '%" + searchStr + "%'"
                        + " OR a.HostID like '%" + searchStr + "%' "
                        + " OR a.DeviceID like '%" + searchStr + "%'"
                        + " OR b.Type like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " a.EquipID like '%" + searchStr + "%'"
                        + " OR a.EquipModel like '%" + searchStr + "%'"
                        + " OR a.EquipSerialNum like '%" + searchStr + "%'"
                        //+ " OR a.EquipData like '%" + searchStr + "%'"
                        //+ " OR a.TimeStamp like '%" + searchStr + "%' " 
                        + " OR a.EquipIP like '%" + searchStr + "%'"
                        + " OR a.EquipIP like '%" + searchStr + "%' "
                        + " OR a.EquipPort like '%" + searchStr + "%'"
                        + " OR a.HostID like '%" + searchStr + "%' "
                        + " OR a.DeviceID like '%" + searchStr + "%'"
                        + " OR b.Type like '%" + searchStr + "%'"
                        + ")";
                }
            }

            //set pagination
            string pagination = "";
            if (offset != 0 && next != 0)
            {
                if (next > 0)
                {
                    pagination = "OFFSET " + offset + " ROWS FETCH NEXT " + next + " ROWS ONLY";
                }
            }

            //this where statement will be used if the config for certain equipments are set to false (disable feature)
            if (where == "")
            {
                where = " WHERE ";
                string temp = "";

                foreach (var entry in HttpHandler.isEquipmentEnabled)
                {
                    if (entry.Value.IsEnabled == false && temp == "")
                    {
                        temp += " b.Type<>'" + entry.Value.Type + "'";
                    }
                    else
                    {
                        if (entry.Value.IsEnabled == false)
                        {
                            temp += " AND b.Type<>'" + entry.Value.Type + "'";
                        }
                    }
                }

                if (temp == "")
                {
                    where = "";
                }
                else
                {
                    where += temp;
                }
            }
            else
            {
                string temp = "";

                foreach (var entry in HttpHandler.isEquipmentEnabled)
                {
                    if (entry.Value.IsEnabled == false)
                    {
                        temp += " AND b.Type<>'" + entry.Value.Type + "'";
                    }
                }

                where += temp;

            }

            //start building the sql statement
            string sql = "SELECT ";

            //place the columns in the sql string
            foreach (var item in cols)
            {
                sql += item.Key + " AS " + item.Value + ", ";
            }

            //remove the trailing " ," from the right
            sql = sql.Substring(0, sql.Length - 2);

            //set the table name and other params
            if (sorting != "")
            {
                sql += " FROM EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }

        //function for getting equipment types
        public static string GetEquipmentType()
        {
            //get the data from sql table
            string sql = "Select ID,Type from tblEquipmentType";

            string where = " where ";

            //for disabling certain equipments
            int check = 0;

            foreach (var entry in HttpHandler.isEquipmentEnabled)
            {
                if (entry.Value.IsEnabled == false && check == 0)
                {
                    where += " Type<>'" + entry.Value.Type + "'";
                    check++;
                }
                else
                {
                    if (entry.Value.IsEnabled == false)
                    {
                        where += " AND Type<>'" + entry.Value.Type + "'";
                        check++;
                    }
                }
            }

            if (check > 0)
            {
                sql += where + " order by Type";
            }
            else
            {
                sql += " order by Type";
            }
            
            DataTable dt = new DataTable();
            dt = Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
            string json = "";

            //loop the datatable and build the json string
            if (dt.Rows.Count > 0)
            {
                json = "[";
                foreach (DataRow dr in dt.Rows)
                {
                    json += "{";
                    json += '"' + "ID" + '"' + ":" + '"' + dr["ID"].ToString() + '"' + ",";
                    json += '"' + "Type" + '"' + ":" + '"' + dr["Type"].ToString() + '"' + "";
                    json += "},";
                }
                json += ")";
                json = json.Replace(",)", "]");
            }

            //return the json string
            return json;
        }

        //function for validating if an equipment from the table
        public static bool EquipmentExist(string equipment)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT EquipID FROM EquipmentTable where EquipID='" + equipment + "'", CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //function for validating if an equipment from the table (for update)
        public static bool EquipmentExistForUpdate(string equipment, int ID)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT EquipID FROM EquipmentTable where EquipID='" + equipment + "' and ID<>" + ID.ToString(), CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //function for getting all equipment types
        public static DataTable GetAllEquipmentType()
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT ID, Type, IsEnabled FROM tblEquipmentType", CommandType.Text);

            return dt;
        }

        public static bool IsChildEquipment(string equipment)
        {
            bool result = false;

            string query = "select IsGrouped from EquipmentTable where EquipID='" + equipment + "'";
            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach(DataRow dr in dt.Rows)
                        {
                            try
                            {
                                result = Convert.ToBoolean(dr["IsGrouped"].ToString());
                            }
                            catch
                            {
                                result = false;
                            }
                        }
                    }
                    else
                    {
                        result = false;
                    }
                }
                else
                {
                    result = false;
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static string getParentEquipment(string equipment)
        {
            string result = "";

            string query = "select c.GroupName as 'GroupName' from EquipmentTable a left join MachineGroupRelationTable b on a.ID=b.EquipID left join tblEquipmentGroup c on b.GroupID=c.ID where a.EquipID='" + equipment + "'";
            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            try
                            {
                                result = dr["GroupName"].ToString();
                            }
                            catch
                            {
                                result = "";
                            }
                        }
                    }
                    else
                    {
                        result = "";
                    }
                }
                else
                {
                    result = "";
                }
            }
            catch
            {
                result = "";
            }

            return result;
        }

        public static List<string> getChildEquipments(string parent)
        {
            List<string> result = new List<string>();

            string query = "select c.EquipID as 'EquipID' from tblEquipmentGroup a left join MachineGroupRelationTable b on a.ID=b.GroupID left join EquipmentTable c on b.EquipID=c.ID where a.GroupName='" + parent + "'";
            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            result.Add(dr["EquipID"].ToString());
                        }
                    }
                    else
                    {
                        result = null;
                    }
                }
                else
                {
                    result = null;
                }
            }
            catch
            {
                result = null;
            }

            return result;
        }

        public static bool validateWarningTracker(string equipment)
        {
            bool val = false;

            try
            {
                string query = "Select EquipID from tblWarningTracker where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if(dt != null)
                {
                    string query2 = "";
                    if(dt.Rows.Count == 0)
                    {
                        query2 = "Insert into tblWarningTracker(EquipID,Tier) values ('" + equipment + "',NULL)";
                        try
                        {
                            val = DBModel.ExecuteCustomQuery(query2);
                        }
                        catch
                        {
                            val = false;
                        }
                    }
                }
            }
            catch
            {
                val = false;
            }

            return val;
        }

        public static bool updateEquipmentTrackIn(int quantity, string equipment, string LotNo, string UserID, string Recipe)
        {
            bool val = false;
            
            try
            {
                double tolerance = HttpHandler.tolerance;
                double percent = tolerance / 100;

                double toleranceQuantity = quantity * percent;

                int value = Convert.ToInt32(Math.Ceiling(toleranceQuantity));

                string query = "Update EquipmentTable set Process=1, UserInProcess='" + UserID.ToString().ToUpper() + "', RecipeInProcess='" + Recipe + "', LotInProcess='" + LotNo + "', TrackInToleranceQty=" + value + ", TrackInQty=" + quantity.ToString() + " where EquipID='" + equipment + "'";
                DBModel.ExecuteCustomQuery(query);

                val = true;
            }
            catch
            {
                val = false;
            }

            return val;
        }

        public static bool clearTrackedEquipment(string equipment)
        {
            bool val = false;

            try
            {
                string query = "Update EquipmentTable set Process=NULL, UserInProcess=NULL, LotInProcess=NULL, TrackInToleranceQty=NULL, TrackInQty=NULL, RecipeInProcess=NULL where EquipID='" + equipment + "'";
                DBModel.ExecuteCustomQuery(query);

                query = "Update EquipmentQty set ProcessedQty=NULL,EndQty=NULL,TotalQty=NULL,isBranded=NULL,BrandedQty=NULL,UnbrandedQty=NULL where EquipmentID='" + equipment + "'";
                DBModel.ExecuteCustomQuery(query);

                query = "Update tblSECSGEM_Qty set Qty=NULL,Qty2=NULL,Multiplier=NULL where EquipID='" + equipment + "'";
                DBModel.ExecuteCustomQuery(query);

                query = "Update tblWarningTracker set Tier=NULL where EquipID='" + equipment + "'";
                DBModel.ExecuteCustomQuery(query);

                val = true;
            }
            catch
            {
                val = false;
            }

            return val;
        }

        public static bool isProcessing(string equipment)
        {
            bool result = false;

            string query = "Select Process from EquipmentTable where EquipID='" + equipment + "'";
            DataTable dt = new DataTable();
            dt = DBModel.CustomSelectQuery(query);

            string proc = "";
            foreach (DataRow dr in dt.Rows)
            {
                proc = dr["Process"].ToString();
            }

            if (proc.ToUpper() == "1" || proc.ToUpper() == "TRUE")
            {
                result = true;
            }
            else
            {
                result = false;
            }

            return result;
        }

        public static int getTrackInQTY(string equipment)
        {
            int qty = 0;

            try
            {
                string query = "Select TrackInQty from EquipmentTable where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    qty = Convert.ToInt32(dr["TrackInQty"].ToString());
                }
            }
            catch
            {
                qty = 0;
            }

            return qty;
        }

        public static int getBrandedQty(string equipment)
        {
            int qty = 0;

            try
            {
                string query = "Select BrandedQty from EquipmentQty where EquipmentID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    qty = Convert.ToInt32(dr["BrandedQty"].ToString());
                }
            }
            catch
            {
                qty = 0;
            }

            return qty;
        }

        public static int getUnbrandedQty(string equipment)
        {
            int qty = 0;

            try
            {
                string query = "Select UnbrandedQty from EquipmentQty where EquipmentID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    qty = Convert.ToInt32(dr["UnbrandedQty"].ToString());
                }
            }
            catch
            {
                qty = 0;
            }

            return qty;
        }

        public static string getTrackInUser(string equipment)
        {
            string user = "";

            try
            {
                string query = "Select UserInProcess from EquipmentTable where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    user = dr["UserInProcess"].ToString();
                }
            }
            catch
            {
                user = "";
            }

            return user;
        }

        public static int getNewAlarmCountTCP(string equipment)
        {
            int count = 0;

            try
            {
                string query = "Select EquipmentId,MessageId,MessageText,ReadNotification,MessageType,Date from TCPNotificationsTable where EquipmentId='" + equipment + "' and ReadNotification=0";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if(dt != null)
                {
                    count = dt.Rows.Count;
                }
            }
            catch
            {
                count = 0;
            }

            return count;
        }

        public static bool markAsRead(string id)
        {
            string query = "update TCPNotificationsTable set ReadNotification=1 where MessageId='" + id + "'";
            bool result = false;

            try
            {
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool markAsReadSECSGEM(string id)
        {
            string query = "update NotificationsTable set ReadNotification=1 where MessageId='" + id + "'";
            bool result = false;

            try
            {
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool markAsBrand(string equipment, string isBranded)
        {
            string checkQuery = "select EquipmentID from EquipmentQty where EquipmentID='" + equipment + "'";
            
            DataTable dt = new DataTable();

            try
            {
                dt = DBModel.CustomSelectQuery(checkQuery);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        string query = "update EquipmentQty set isBranded=" + isBranded + " where EquipmentID='" + equipment + "'";
                        bool result = false;

                        try
                        {
                            result = DBModel.ExecuteCustomQuery(query);
                        }
                        catch
                        {
                            result = false;
                        }

                        return result;
                    }
                    else
                    {
                        string query = "Insert into EquipmentQty(EquipmentID,isBranded) values ('" + equipment + "'," + isBranded + ")";

                        bool result = false;

                        try
                        {
                            result = DBModel.ExecuteCustomQuery(query);
                        }
                        catch
                        {
                            result = false;
                        }

                        return result;

                    }
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public static bool isBrand(string equipment)
        {
            bool result = false;

            try
            {
                string query = "Select IsBranded from EquipmentQty where EquipmentID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach(DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["IsBranded"]);
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static List<TCPAlarm> getAllAlarmsTCP(string equipment)
        {
            string query = "Select EquipmentId,MessageId,MessageText,ReadNotification,MessageType,Date from TCPNotificationsTable where EquipmentId='" + equipment + "' order by Date desc";
            List<TCPAlarm> alarm = new List<TCPAlarm>();

            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                foreach(DataRow dr in dt.Rows)
                {
                    TCPAlarm temp = new TCPAlarm();
                    temp.EquipmentId = dr["EquipmentId"].ToString();
                    temp.MessageId = dr["MessageId"].ToString();
                    temp.MessageText = dr["MessageText"].ToString();
                    temp.ReadNotification = Convert.ToInt32(dr["ReadNotification"].ToString());
                    temp.MessageType = dr["MessageType"].ToString();
                    temp.Date = Convert.ToDateTime(dr["Date"]);
                    temp.DateStr = Convert.ToDateTime(dr["Date"]).ToString();
                    alarm.Add(temp);
                }
                return alarm;
            }
            catch
            {
                return null;
            }

        }

        public static List<TCPAlarm> getAllAlarmsSECSGEM(string equipment)
        {
            //string query = "Select EquipmentId,MessageId,MessageText,ReadNotification,MessageType,Date from TCPNotificationsTable where EquipmentId='" + equipment + "' order by Date desc";
            //List<TCPAlarm> alarm = new List<TCPAlarm>();

            //try
            //{
            //    DataTable dt = new DataTable();
            //    dt = DBModel.CustomSelectQuery(query);
            //    foreach (DataRow dr in dt.Rows)
            //    {
            //        TCPAlarm temp = new TCPAlarm();
            //        temp.EquipmentId = dr["EquipmentId"].ToString();
            //        temp.MessageId = dr["MessageId"].ToString();
            //        temp.MessageText = dr["MessageText"].ToString();
            //        temp.ReadNotification = Convert.ToInt32(dr["ReadNotification"].ToString());
            //        temp.MessageType = dr["MessageType"].ToString();
            //        temp.Date = Convert.ToDateTime(dr["Date"]);
            //        temp.DateStr = Convert.ToDateTime(dr["Date"]).ToString();
            //        alarm.Add(temp);
            //    }
            //    return alarm;
            //}
            //catch
            //{
            //    return null;
            //}

            return null;

        }

        public static string getLotInProcess(string equipment)
        {
            string LotNo = null;
            try
            {
                string query = "Select LotInProcess from EquipmentTable where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                foreach (DataRow dr in dt.Rows)
                {
                    LotNo = dr["LotInProcess"].ToString();
                }

                return LotNo;
            }
            catch
            {
                return null;
            }
        }

        public static bool insertTCPNotification(string equipment, string message, string type)
        {
            bool result = false;

            try
            {
                string query = "insert into TCPNotificationsTable(EquipmentId,MessageText,ReadNotification,MessageType,Date) values('" + equipment + "','" + message + "',0,'" + type + "',getdate())";
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static int getProcessedQTY(string equipment)
        {
            int qty = 0;

            try
            {
                string query = "Select TotalQty from EquipmentQty where EquipmentID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    qty = Convert.ToInt32(dr["TotalQty"].ToString());
                }
            }
            catch
            {
                qty = 0;
            }

            return qty;
        }

        public static int getSECSGEMProcessedQTY(string equipment)
        {
            int qty = 0;
            int qty2 = 0;
            int multiplier = 1;

            try
            {
                string query = "Select Qty,Qty2,Multiplier from tblSECSGEM_Qty where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    try
                    {
                        qty = Convert.ToInt32(dr["Qty"].ToString());
                    }
                    catch
                    {
                        qty = 0;
                    }

                    try
                    {
                        qty2 = Convert.ToInt32(dr["Qty2"].ToString());
                    }
                    catch
                    {
                        qty2 = 0;
                    }

                    try
                    {
                        multiplier = Convert.ToInt32(dr["Multiplier"].ToString());
                    }
                    catch
                    {
                        multiplier = 1;
                    }
                }
            }
            catch { }

            int total = (qty + qty2) * multiplier;

            return total;
        }

        public static int getSECSGEMProcessedQTYInUnits(string equipment)
        {
            int qty = 0;
            int qty2 = 0;

            try
            {
                string query = "Select Qty,Qty2 from tblSECSGEM_Qty where EquipID='" + equipment + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    try
                    {
                        qty = Convert.ToInt32(dr["Qty"].ToString());
                    }
                    catch
                    {
                        qty = 0;
                    }

                    try
                    {
                        qty2 = Convert.ToInt32(dr["Qty2"].ToString());
                    }
                    catch
                    {
                        qty2 = 0;
                    }
                }
            }
            catch { }

            int total = qty + qty2;

            return total;
        }
    }
}