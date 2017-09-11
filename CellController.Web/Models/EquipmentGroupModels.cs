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
    public class EquipmentGroupModels
    {
        //for getting the columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("a.ID", "id_number");
            cols.Add("a.GroupName", "name_string");
            cols.Add("case when [IsEnabled]=1 then (select 'Enabled') else (select 'Disabled') end", "status_string");

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
                    where += " AND ("
                        + " a.GroupName like '%" + searchStr + "%'"
                        + " OR a.isEnabled like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " a.GroupName like '%" + searchStr + "%'"
                        + " OR a.isEnabled like '%" + searchStr + "%'"
                        + ")";
                }
            }

            //build the sql statement
            //string sql = "SELECT COUNT(*) FROM tblEquipmentGroup a left join tblEquipmentType b on a.EquipType=b.ID " + where;
            string sql = "SELECT COUNT(*) FROM tblEquipmentGroup a " + where;

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
                sorting = "a.GroupName asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " a.GroupName like '%" + searchStr + "%'"
                        + " OR a.isEnabled like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " a.GroupName like '%" + searchStr + "%'"
                        + " OR a.isEnabled like '%" + searchStr + "%'"
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
                //sql += " FROM EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID " + where + " ORDER BY " + sorting + " " + pagination + ";";
                sql += " FROM tblEquipmentGroup a " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                //sql += " FROM EquipmentTable a left join tblEquipmentType b on a.EquipType=b.ID " + where + " " + pagination + ";";
                sql += " FROM tblEquipmentGroup a " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }

        //for checking if the equipment group exists in the table
        public static bool CheckGroup(string name)
        {
            bool result = true;
            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT GroupName FROM tblEquipmentGroup where GroupName='" + name + "'", CommandType.Text);

                if (dt.Rows.Count > 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for checking if the equipment group exists in the table (for update)
        public static bool CheckGroupForUpdate(string name, int ID)
        {
            bool result = true;
            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT GroupName FROM tblEquipmentGroup where GroupName='" + name + "' and ID<>" + ID.ToString(), CommandType.Text);

                if (dt.Rows.Count > 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for inserting equipment group table
        public static bool AddMachineGroup(string name, bool isEnabled)
        {
            bool result = false;
            try
            {
                string bit = "";
                if (isEnabled == true)
                {
                    bit = "1";
                }
                else
                {
                    bit = "0";
                }

                string query = "insert into tblEquipmentGroup(GroupName,IsEnabled) values('" + name + "'," + bit.ToString() + ")";
                result = DBModel.ExecuteCustomQuery(query);

                if(result == true)
                {
                    query = "insert into EquipmentTable(EquipID,EquipType,EquipModel,EquipSerialNum,EquipData,TimeStamp,EquipIP,EquipPort,HostID,DeviceID) values('" + name + "',0,'','','',getdate(),'','','','')";
                    result = DBModel.ExecuteCustomQuery(query);

                    if (result == true)
                    {
                        string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                        string HostName = computer_name[0].ToString().ToUpper();
                        string IP = HttpHandler.GetIPAddress();
                        AuditModel.AddLog("Group Settings", "Added Equipment Group - Name: " + name, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                    }
                }

            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for inserting equipment group table
        public static bool AddMachineGroupRelation(int groupID, int equipID)
        {
            bool result = false;
            try
            {
                string query = "";
                query = "insert into MachineGroupRelationTable(GroupID,EquipID) values(" + groupID.ToString() + "," + equipID.ToString() + ")";
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    query = "select isEnabled from tblEquipmentGroup where ID=" + groupID.ToString();
                    DataTable dt = new DataTable();
                    dt = DBModel.CustomSelectQuery(query);

                    bool isEnabled = false;

                    if (dt != null)
                    {
                        if (dt.Rows.Count > 0)
                        {
                            foreach (DataRow dr in dt.Rows)
                            {
                                isEnabled = Convert.ToBoolean(dr["isEnabled"]);
                            }
                        }
                    }

                    if (isEnabled == true)
                    {
                        result = MarkEquipmentAsGrouped(equipID.ToString());
                    }
                    else
                    {
                        result = MarkEquipmentAsUngrouped(equipID.ToString());
                    }

                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Group Settings", "Updated Equipment Group Assignment - ID: " + groupID, HostName, IP, HttpContext.Current.Session["Username"].ToString());

                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool MarkEquipmentAsGrouped(string ID)
        {
            bool result = false;
            try
            {
                string query = "update EquipmentTable set IsGrouped=1 where ID=" + ID;
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool MarkEquipmentAsUngrouped(string ID)
        {
            bool result = false;
            try
            {
                string query = "update EquipmentTable set IsGrouped=null where ID=" + ID;
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for updating equipment group table
        public static bool UpdateMachineGroup(string id, string name, bool isEnabled)
        {
            bool result = false;
            try
            {
                string bit = "";
                if (isEnabled == true)
                {
                    bit = "1";
                }
                else
                {
                    bit = "0";
                }

                string query = "";
                query = "select a.ID from EquipmentTable a left join tblEquipmentGroup b on a.EquipID=b.GroupName where b.ID=" + id;
                DataTable dt_temp = new DataTable();
                dt_temp = DBModel.CustomSelectQuery(query);
                string tempID = "";
                if (dt_temp != null)
                {
                    if (dt_temp.Rows.Count > 0)
                    {
                        foreach (DataRow dr_temp in dt_temp.Rows)
                        {
                            tempID = dr_temp["ID"].ToString();
                        }

                        query = "update EquipmentTable set EquipID='" + name + "' where ID=" + tempID;
                        result = DBModel.ExecuteCustomQuery(query);

                        if(result == true)
                        {
                            query = "update tblEquipmentGroup set GroupName='" + name + "',IsEnabled=" + bit.ToString() + " where ID=" + id;
                            result = DBModel.ExecuteCustomQuery(query);

                            if (result == true)
                            {
                                query = "select EquipID from MachineGroupRelationTable where GroupID=" + id;
                                DataTable dt = new DataTable();
                                dt = DBModel.CustomSelectQuery(query);

                                if (dt != null)
                                {
                                    if (dt.Rows.Count > 0)
                                    {
                                        foreach (DataRow dr in dt.Rows)
                                        {
                                            string EquipID = dr["EquipID"].ToString();

                                            if (isEnabled == true)
                                            {
                                                MarkEquipmentAsGrouped(EquipID);
                                            }
                                            else
                                            {
                                                MarkEquipmentAsUngrouped(EquipID);
                                            }
                                        }
                                    }
                                }

                                string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                                string HostName = computer_name[0].ToString().ToUpper();
                                string IP = HttpHandler.GetIPAddress();
                                AuditModel.AddLog("Group Settings", "Updated Equipment Group - ID: " + id, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                            }
                        }
                    }
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for deleting equipment group from table
        public static bool DeleteMachineGroup(string id)
        {
            bool result = false;

            try
            {
                string query = "";

                query = "select a.ID from EquipmentTable a left join tblEquipmentGroup b on a.EquipID=b.GroupName where b.ID=" + id;
                DataTable dt_temp = new DataTable();
                dt_temp = DBModel.CustomSelectQuery(query);
                string tempID = "";
                if (dt_temp != null)
                {
                    if (dt_temp.Rows.Count > 0)
                    {
                        foreach (DataRow dr_temp in dt_temp.Rows)
                        {
                            tempID = dr_temp["ID"].ToString();
                        }

                        query = "delete EquipmentTable where ID=" + tempID;
                        result = DBModel.ExecuteCustomQuery(query);

                        if(result == true)
                        {
                            query = "delete tblEquipmentGroup where ID=" + id;
                            result = DBModel.ExecuteCustomQuery(query);

                            if (result == true)
                            {
                                result = DeleteMachineGroupRelation(id);

                                if (result == true)
                                {
                                    query = "delete tblGroupEnrollment where GroupID=" + id;
                                    result = DBModel.ExecuteCustomQuery(query);

                                    if (result == true)
                                    {
                                        string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                                        string HostName = computer_name[0].ToString().ToUpper();
                                        string IP = HttpHandler.GetIPAddress();
                                        AuditModel.AddLog("Group Settings", "Deleted Equipment Group - ID: " + id, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for deleting equipment group relation from table
        public static bool DeleteMachineGroupRelation(string id)
        {
            bool result = false;

            try
            {
                List<string> lstEquipID = new List<string>();

                string query = "";
                query = "select EquipID from MachineGroupRelationTable where groupID=" + id;
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            lstEquipID.Add(dr["EquipID"].ToString());
                        }
                    }
                }

                query = "delete MachineGroupRelationTable where groupID=" + id;
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    if (lstEquipID != null)
                    {
                        if (lstEquipID.Count > 0)
                        {
                            foreach (string temp in lstEquipID)
                            {
                                MarkEquipmentAsUngrouped(temp);
                            }
                        }
                    }

                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Group Settings", "Updated Equipment Group Assignment - ID: " + id, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool isMachineInGroup(int groupID, int equipID)
        {
            bool result = true;

            try
            {
                string query = "Select ID from MachineGroupRelationTable where GroupID<>" + groupID.ToString() + " and EquipID=" + equipID.ToString();
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                if (dt.Rows.Count > 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        public static List<EquipmentObject> GetAssignedMachine(int groupID)
        {
            try
            {
                string query = "Select a.EquipID as ID, b.EquipID as EquipID from MachineGroupRelationTable a left join EquipmentTable b on a.EquipID=b.ID where a.GroupID=" + groupID.ToString() + " order by a.EquipID asc";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                List<EquipmentObject> obj = new List<EquipmentObject>();

                if (dt.Rows.Count > 0)
                {
                    foreach(DataRow dr in dt.Rows)
                    {
                        EquipmentObject temp = new EquipmentObject();
                        temp.ID = Convert.ToInt32(dr["ID"].ToString());
                        temp.EquipID = dr["EquipID"].ToString();

                        obj.Add(temp);
                    }

                    return obj;
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