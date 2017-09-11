using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace CellController.Web.Models
{
    public class AuditModel
    {
        //for getting columns
        public static Dictionary<string, string> GetCols()
        {
            //declare columns to be selected here
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("ID", "id_number");
            cols.Add("CONVERT(VARCHAR(10), date, 101) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), date, 22), 11))", "date_string");
            cols.Add("Module", "module_string");
            cols.Add("Description", "description_string");
            //cols.Add("ComputerName", "computer_name_string");
            cols.Add("IPAddress", "IP_address_string");
            cols.Add("UserID", "username_string");

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
                        + " Module like '%" + searchStr + "%'"
                        + " OR Description like '%" + searchStr + "%'"
                        //+ " OR ComputerName like '%" + searchStr + "%'"
                        + " OR IPAddress like '%" + searchStr + "%'"
                        + " OR UserID like '%" + searchStr + "%'"
                        + " OR CONVERT(VARCHAR(10), date, 101) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), date, 22), 11)) like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " Module like '%" + searchStr + "%'"
                        + " OR Description like '%" + searchStr + "%'"
                        //+ " OR ComputerName like '%" + searchStr + "%'"
                        + " OR IPAddress like '%" + searchStr + "%'"
                        + " OR UserID like '%" + searchStr + "%'"
                        + " OR CONVERT(VARCHAR(10), date, 101) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), date, 22), 11)) like '%" + searchStr + "%'"
                        + ")";
                }
            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM tblAuditLogs " + where;

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
                sorting = "Date desc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " Module like '%" + searchStr + "%'"
                        + " OR Description like '%" + searchStr + "%'"
                        //+ " OR ComputerName like '%" + searchStr + "%'"
                        + " OR IPAddress like '%" + searchStr + "%'"
                        + " OR UserID like '%" + searchStr + "%'"
                        + " OR CONVERT(VARCHAR(10), date, 101) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), date, 22), 11)) like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " Module like '%" + searchStr + "%'"
                        + " OR Description like '%" + searchStr + "%'"
                        //+ " OR ComputerName like '%" + searchStr + "%'"
                        + " OR IPAddress like '%" + searchStr + "%'"
                        + " OR UserID like '%" + searchStr + "%'"
                        + " OR CONVERT(VARCHAR(10), date, 101) + ' ' + LTRIM(RIGHT(CONVERT(CHAR(20), date, 22), 11)) like '%" + searchStr + "%'"
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
                sql += " FROM tblAuditLogs " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM tblAuditLogs " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }


        public static void AddLog(string Module, string Description, string ComputerName, string IPAddress, string UserID)
        {
            string query = "Insert into tblAuditLogs(Module,Description,ComputerName,IPAddress,UserID,Date) values('" + Module + "','" + Description + "','" + ComputerName + "','" + IPAddress + "','" + UserID + "',getdate())";

            try
            {
                DBModel.ExecuteCustomQuery(query);
            }
            catch { }
        }
    }
}