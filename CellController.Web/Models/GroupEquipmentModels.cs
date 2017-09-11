using CellController.Web.Helpers;
using CellController.Web.ViewModels;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace CellController.Web.Models
{
    public class GroupEquipmentModels
    {
        //for getting the columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("a.ID", "id_number");
            cols.Add("b.GroupName", "name_string");
            cols.Add("a.UserID", "username_string");
            cols.Add("a.HostID", "host_id_string");
            cols.Add("case when b.[IsEnabled]=1 then (select 'Enabled') else (select 'Disabled') end", "status_string");

            return cols;
        }

        //for getting the count
        public static int GetCount(string where, string searchStr)
        {
            //for searching
            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND (b.GroupName like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR b.IsEnabled like '%" + searchStr + "%')";
                }
                else
                {
                    where += " WHERE (b.GroupName like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR b.IsEnabled like '%" + searchStr + "%')";
                }
            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID " + where;

            //execute the sql statement
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //for getting the data
        public static DataTable GetData(int offset, int next, string where, string sorting, string searchStr)
        {
            //call for the method in getting the columns
            Dictionary<string, string> cols = GetCols();

            //default sorting
            if (sorting == "")
            {
                sorting = "a.UserID,b.GroupName asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND (b.GroupName like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR b.IsEnabled like '%" + searchStr + "%')";

                }
                else
                {
                    where += " WHERE (b.GroupName like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR b.IsEnabled like '%" + searchStr + "%')";
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
               sql += " FROM tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }

        public static List<EquipmentGroupObject> GetAllGroup()
        {
            try
            {
                string query = "Select ID,GroupName from tblEquipmentGroup order by GroupName";
                List<EquipmentGroupObject> obj = new List<EquipmentGroupObject>();
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if(dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach(DataRow dr in dt.Rows)
                        {
                            EquipmentGroupObject temp = new EquipmentGroupObject();
                            temp.ID = Convert.ToInt32(dr["ID"].ToString());
                            temp.GroupName = dr["GroupName"].ToString();

                            obj.Add(temp);
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

        //function for validating if the group/user exists
        public static int CheckEntryWithHost(string username, string groupID, string host)
        {
            string sql = "SELECT COUNT(*) FROM tblGroupEnrollment WHERE UserID='" + username + "' and GroupID='" + groupID + "' and HostID='" + host + "'";

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //function for validating if the equipment/user exists (for update)
        public static int CheckEntryForUpdateWithHost(string username, string groupID, int ID, string host)
        {
            string sql = "SELECT COUNT(*) FROM tblGroupEnrollment WHERE UserID='" + username + "' and GroupID='" + groupID + "' and HostID='" + host + "' and ID<>" + ID.ToString();

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        public static bool AddEnrollment(string username, string groupID, string host)
        {
            bool result = false;

            try
            {
                string query = "Insert into tblGroupEnrollment(GroupID,UserID,HostID) values (" + groupID + ",'" + username + "','" + host + "')";
                result = DBModel.ExecuteCustomQuery(query);

                if(result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Group Enrollment", "Added Group Enrollment - Username: " + username + ", Group ID: " + groupID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool UpdateEnrollment(string ID, string username, string groupID, string host)
        {
            bool result = false;

            try
            {
                string query = "Update tblGroupEnrollment set GroupID=" + groupID + ",UserID='" + username + "',HostID='" + host + "' where ID=" + ID.ToString();
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Group Enrollment", "Updated Group Enrollment - ID: " + ID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool DeleteEnrollment(string ID)
        {
            bool result = false;

            try
            {
                string query = "Delete tblGroupEnrollment where ID=" + ID.ToString();
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Group Enrollment", "Deleted Group Enrollment - ID: " + ID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static List<string> GetGroupIDConnection()
        {
            bool isHost = SettingModels.isHostEnabled();

            string query = "";

            string IP = HttpHandler.GetIPAddress();

            string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
            string HostName = computer_name[0].ToString().ToUpper();

            if (isHost == true)
            {
                query = "Select a.GroupID,b.GroupName from tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID where a.UserID='" + HttpContext.Current.Session["Username"].ToString() + "' and (a.HostID='" + HostName + "' or a.HostID='" + IP + "') and b.isEnabled=1";
            }
            else
            {
                query = "Select a.GroupID,b.GroupName from tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID where a.UserID='" + HttpContext.Current.Session["Username"].ToString() + "' and b.isEnabled=1";
            }

            DataTable dt = new DataTable();
            dt = DBModel.CustomSelectQuery(query);

            List<string> result = new List<string>();

            foreach(DataRow dr in dt.Rows)
            {
                string Name = dr["GroupName"].ToString();
                query = "Select ID,EquipID from EquipmentTable where EquipID='" + Name + "'";
                DataTable dt2 = new DataTable();
                dt2 = DBModel.CustomSelectQuery(query);
                foreach(DataRow dr2 in dt2.Rows)
                {
                    string ID = "";
                    string EquipID = "";
                    ID = dr2["ID"].ToString();
                    EquipID = dr2["EquipID"].ToString();
                    string temp = ID + ":" + EquipID;
                    result.Add(temp);
                }
            }

            return result;
        }

        public static List<EquipmentGroupObject> GetEnrolledGroup()
        {
            int groupCount = 0;

            try
            {
                bool isHost = SettingModels.isHostEnabled();

                string query = "";

                string IP = HttpHandler.GetIPAddress();

                string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                string HostName = computer_name[0].ToString().ToUpper();

                if (isHost == true)
                {
                    query = "Select a.GroupID,b.GroupName from tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID where a.UserID='" + HttpContext.Current.Session["Username"].ToString() + "' and (a.HostID='" + HostName + "' or a.HostID='" + IP + "') and b.isEnabled=1";
                }
                else
                {
                    query = "Select a.GroupID,b.GroupName from tblGroupEnrollment a left join tblEquipmentGroup b on a.GroupID=b.ID where a.UserID='" + HttpContext.Current.Session["Username"].ToString() + "' and b.isEnabled=1";
                }

                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        List<EquipmentGroupObject> obj = new List<EquipmentGroupObject>();
                        foreach(DataRow dr in dt.Rows)
                        {
                            EquipmentGroupObject temp = new EquipmentGroupObject();
                            temp.ID = Convert.ToInt32(dr["GroupID"].ToString());
                            temp.GroupName = dr["GroupName"].ToString();

                            var check = hasChildGroup(temp.ID.ToString());

                            if (check == true)
                            {
                                obj.Add(temp);
                            }
                        }

                        groupCount = dt.Rows.Count;
                        CreateGroupCountSessionCookie(groupCount);

                        return obj;
                    }
                    else
                    {
                        groupCount = 0;
                        CreateGroupCountSessionCookie(groupCount);

                        return null;
                    }
                }
                else
                {
                    groupCount = 0;
                    CreateGroupCountSessionCookie(groupCount);

                    return null;
                }
            }
            catch
            {
                //handle error
                groupCount = 0;
                CreateGroupCountSessionCookie(groupCount);

                return null;
            }
        }

        public static void CreateGroupCountSessionCookie(int groupCount)
        {
            HttpContext.Current.Session.Add("GroupCount", groupCount);

            try
            {
                DateTime now = DateTime.Now;
                HttpCookie cookieEquipCount = new HttpCookie("GroupCount");
                cookieEquipCount.Value = groupCount.ToString();
                cookieEquipCount.Expires = now.AddDays(30);
                HttpContext.Current.Response.Cookies.Add(cookieEquipCount);
            }
            catch { }
        }

        public static bool hasChildGroup(string groupID)
        {
            bool result = false;

            try
            {
                string query = "Select a.EquipID from MachineGroupRelationTable a left join EquipmentTable b on a.EquipID=b.ID left join tblEquipmentType c on b.EquipType=c.ID where c.IsEnabled=1 and a.GroupID=" + groupID.ToString();
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if (dt  != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        result = true;
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

        public static List<EnrolledEquipment> GetChildEquipment(string groupID, string userID)
        {
            try
            {
                string query = "Select a.ID as 'ID', a.EquipID as 'Equipment', a.EquipType as 'TypeCode', c.Type as 'Type', c.IsSECSGEM as 'IsSECSGEM', a.EquipPort as 'Port', d.HostID as 'HostID' from EquipmentTable a left join MachineGroupRelationTable b on a.ID=b.EquipID left join tblEquipmentType c on a.EquipType=c.ID left join tblGroupEnrollment d on b.GroupID=d.GroupID where b.GroupID=" + groupID.ToString() + " and d.UserID='" + userID + "' order by a.EquipID asc";
                List<EnrolledEquipment> obj = new List<EnrolledEquipment>();

                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach(DataRow dr in dt.Rows)
                        {
                            EnrolledEquipment temp = new EnrolledEquipment();
                            temp.ID = Convert.ToInt32(dr["ID"].ToString());
                            temp.Equipment = dr["Equipment"].ToString();
                            temp.TypeCode = Convert.ToInt32(dr["TypeCode"].ToString());
                            temp.Type = dr["Type"].ToString();
                            temp.isSECSGEM = Convert.ToBoolean(dr["isSECSGEM"]);
                            temp.Port = dr["Port"].ToString();
                            temp.HostID = dr["HostID"].ToString();

                            obj.Add(temp);
                        }

                        return obj;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }
    }
}