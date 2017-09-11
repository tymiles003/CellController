using CellController.Web.Helpers;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace CellController.Web.Models
{
    public class EquipTypeModels
    {
        //for getting columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("ID", "id_number");
            cols.Add("Type", "type_string");
            cols.Add("case when [IsEnabled]=1 then (select 'Enabled') else (select 'Disabled') end", "status_string");
            cols.Add("case when [IsSECSGEM]=1 then (select 'Yes') else (select 'No') end", "SECSGEM_Compatible_string");

            return cols;
        }

        //for getting count
        public static int GetCount(string where, string searchStr)
        {
            //for searching
            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " Type like '%" + searchStr + "%'"
                        + " OR IsEnabled like '%" + searchStr + "%'"
                        + " OR IsSECSGEM like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " Type like '%" + searchStr + "%'"
                        + " OR IsEnabled like '%" + searchStr + "%'"
                        + " OR IsSECSGEM like '%" + searchStr + "%'"
                        + ")";
                }
            }
            
            //build the sql statement
            string sql = "SELECT COUNT(*) FROM tblEquipmentType " + where;

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
                sorting = "Type asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                         + " Type like '%" + searchStr + "%'"
                         + " OR IsEnabled like '%" + searchStr + "%'"
                         + " OR IsSECSGEM like '%" + searchStr + "%'"
                         + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " Type like '%" + searchStr + "%'"
                        + " OR IsEnabled like '%" + searchStr + "%'"
                        + " OR IsSECSGEM like '%" + searchStr + "%'"
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
                sql += " FROM tblEquipmentType " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM tblEquipmentType " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }
        
        //for checking if the equipment type exists in the table
        public static bool CheckType(string type)
        {
            bool result = true;
            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Type FROM tblEquipmentType where Type='" + type + "'", CommandType.Text);

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

        //for checking if the equipment type exists in the table (for update)
        public static bool CheckTypeForUpdate(string type, int ID)
        {
            bool result = true;
            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Type FROM tblEquipmentType where Type='" + type + "' and ID<>" + ID.ToString(), CommandType.Text);

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

        //for inserting equipment type table
        public static bool AddEquipmentType(string type, bool isEnabled, bool isSECSGEM)
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

                string bit2 = "";
                if (isSECSGEM == true)
                {
                    bit2 = "1";
                }
                else
                {
                    bit2 = "0";
                }

                string query = "insert into tblEquipmentType(Type,IsEnabled,IsSECSGEM) values('" + type + "'," + bit.ToString() + "," + bit2.ToString() + ")";
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Machine Type", "Added Machine Type - Type: " + type, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for updating equipment type table
        public static bool UpdateEquipmentType(string id, string type, bool isEnabled, bool isSECSGEM)
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

                string bit2 = "";
                if (isSECSGEM == true)
                {
                    bit2 = "1";
                }
                else
                {
                    bit2 = "0";
                }

                string query = "update tblEquipmentType set Type='" + type + "',IsEnabled=" + bit.ToString() + ",IsSECSGEM=" + bit2.ToString() + " where ID=" + id;
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Machine Type", "Updated Machine Type - ID: " + id, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //for deleting equipment type from table
        public static bool DeleteEquipmentType(string id)
        {
            bool result = false;

            try
            {
                string query = "delete tblEquipmentType where ID=" + id;
                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Machine Type", "Deleted Machine Type - ID: " + id, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }
    }
}