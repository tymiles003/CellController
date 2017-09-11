using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using CellController.Web.ViewModels;
using System.Data.SqlClient;
using Microsoft.Ajax.Utilities;
using System.Configuration;
using CellController.Web.Helpers;

namespace CellController.Web.Models
{
    public class UserEquipmentModels
    {
        //function for validating if the equipment/user exists
        public static int CheckEntry(string username, string equipment)
        {
            string sql = "SELECT COUNT(*) FROM UserEquipmentTable WHERE UserID='" + username + "' and EquipID='" + equipment + "'";

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //function for validating if the equipment/user exists
        public static int CheckEntryWithHost(string username, string equipment, string host)
        {
            string sql = "SELECT COUNT(*) FROM UserEquipmentTable WHERE UserID='" + username + "' and EquipID='" + equipment + "' and HostID='" + host + "'";

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //function for validating if the equipment/user exists (for update)
        public static int CheckEntryForUpdate(string username, string equipment, int ID)
        {
            string sql = "SELECT COUNT(*) FROM UserEquipmentTable WHERE UserID='" + username + "' and EquipID='" + equipment + "' and ID<>" + ID.ToString();

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //function for validating if the equipment/user exists (for update)
        public static int CheckEntryForUpdateWithHost(string username, string equipment, int ID, string host)
        {
            string sql = "SELECT COUNT(*) FROM UserEquipmentTable WHERE UserID='" + username + "' and EquipID='" + equipment + "' and HostID='" + host + "' and ID<>" + ID.ToString();

            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //for getting the columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("a.ID", "id_number");
            cols.Add("b.EquipID", "equipment_id_string");
            cols.Add("c.Type", "type_string");
            cols.Add("a.UserID", "username_string");
            cols.Add("a.HostID", "host_id_string");


            return cols;
        }

        //function to delete equipment by batch
        public static bool DeleteUserEquipmentByBatch(string equipID)
        {
            bool result = false;

            try
            {
                string query = "Delete from UserEquipmentTable where EquipID=" + equipID;
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
                    where += " AND (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";
                }
                else
                {
                    where += " WHERE (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";
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
                        temp += " c.Type<>'" + entry.Value.Type + "'";
                    }
                    else
                    {
                        if (entry.Value.IsEnabled == false)
                        {
                            temp += " AND c.Type<>'" + entry.Value.Type + "'";
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
                        temp += " AND c.Type<>'" + entry.Value.Type + "'";
                    }
                }

                where += temp;

            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM UserEquipmentTable a left join EquipmentTable b on a.EquipID=b.ID left join tblEquipmentType c on b.EquipType=c.ID " + where;

            //execute the sql statement
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //for getting the data
        public static DataTable GetData(int offset, int next, string where, string sorting, string searchStr)
        {
            //call for the method in getting the columns
            Dictionary<string, string> cols = GetCols();

            //default sorting
            if(sorting == "")
            {
                sorting = "a.UserID,b.EquipID asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    //where += " AND (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";
                    where += " AND (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";

                }
                else
                {
                    //where += " WHERE (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";
                    where += " WHERE (b.EquipID like '%" + searchStr + "%' " + " OR a.UserID like '%" + searchStr + "%' " + " OR a.HostID like '%" + searchStr + "%' " + " OR c.Type like '%" + searchStr + "%')";
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
                        temp += " c.Type<>'" + entry.Value.Type + "'";
                    }
                    else
                    {
                        if (entry.Value.IsEnabled == false)
                        {
                            temp += " AND c.Type<>'" + entry.Value.Type + "'";
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
                        temp += " AND c.Type<>'" + entry.Value.Type + "'";
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
                sql += " FROM UserEquipmentTable a left join EquipmentTable b on a.EquipID=b.ID left join tblEquipmentType c on b.EquipType=c.ID " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM UserEquipmentTable a left join EquipmentTable b on a.EquipID=b.ID left join tblEquipmentType c on b.EquipType=c.ID " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }
    }
}