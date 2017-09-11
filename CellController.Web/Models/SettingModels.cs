using CellController.Web.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace CellController.Web.Models
{
    public class SettingModels
    {
        //for getting the config signal r
        public static bool IsSignalR()
        {
            bool result = true;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 isSignalR FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["isSignalR"].ToString());
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //function for getting default password for newly created accounts
        public static string DefaultPassword()
        {
            string result = "welcome1";

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 DefaultPassword FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = dr["DefaultPassword"].ToString();
                }
            }
            catch
            {
                result = "welcome1";
            }

            return result;
        }

        //function for getting no mark template file name
        public static string NoMarkTemplate()
        {
            string result = "NOMARK.TPL";

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 NoMarkTemplate FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = dr["NoMarkTemplate"].ToString();
                }
            }
            catch
            {
                result = "NOMARK.TPL";
            }

            return result.ToUpper();
        }

        //for getting the config opc timeout
        public static bool IsOPCTimeout()
        {
            bool result = true;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 isOPCTimeout FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["isOPCTimeout"].ToString());
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for getting the config host enabled
        public static bool isHostEnabled()
        {
            bool result = true;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 isHostEnrollment FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["isHostEnrollment"].ToString());
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for getting the config scanner
        public static bool IsScanner()
        {
            bool result = true;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 isScanner FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["isScanner"].ToString());
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for getting if the effective date is enabled
        public static bool isEffectiveDate()
        {
            bool result = true;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 isEffectiveDate FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToBoolean(dr["isEffectiveDate"].ToString());
                }
            }
            catch
            {
                result = true;
            }

            return result;
        }

        //for getting the config tolerance
        public static double GetTolerance()
        {
            double result = 2;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 Tolerance FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToDouble(dr["Tolerance"].ToString());
                }
            }
            catch
            {
                result = 2;
            }

            return result;
        }

        //for getting the config opc timeout
        public static double GetOPCTimeout()
        {
            double result = 60;

            try
            {
                DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT top 1 OPCTimeout FROM tblSettings", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToDouble(dr["OPCTimeout"].ToString());
                }
            }
            catch
            {
                result = 60;
            }

            return result;
        }

        //for saving config settings
        public static bool SaveConfig(bool isSignalR, double tolerance, bool isOPCTimeout, double OPCTimeout, string DefaultPassword, string NoMarkTemplate, bool isScanner, bool isHost, bool isEffectiveDate)
        {
            bool result = false;

            try
            {
                DataTable dt = new DataTable();

                string query = "select isSignalR, Tolerance, isOPCTimeout, OPCTimeout, DefaultPassword, NoMarkTemplate, isScanner, isHostEnrollment from tblSettings";

                dt = DBModel.CustomSelectQuery(query);

                string bit = "";

                if (isSignalR.ToString().ToLower() == "true")
                {
                    bit = "1";
                }
                else
                {
                    bit = "0";
                }

                string bit2 = "";

                if (isOPCTimeout.ToString().ToLower() == "true")
                {
                    bit2 = "1";
                }
                else
                {
                    bit2 = "0";
                }

                string bit3 = "";

                if (isScanner.ToString().ToLower() == "true")
                {
                    bit3 = "1";
                }
                else
                {
                    bit3 = "0";
                }

                string bit4 = "";

                if (isHost.ToString().ToLower() == "true")
                {
                    bit4 = "1";
                }
                else
                {
                    bit4 = "0";
                }

                string bit5 = "";

                if (isEffectiveDate.ToString().ToLower() == "true")
                {
                    bit5 = "1";
                }
                else
                {
                    bit5 = "0";
                }

                if (dt.Rows.Count > 0)
                {
                    query = "update tblSettings set isSignalR=" + bit.ToString() + "," + "Tolerance=" + tolerance.ToString()
                        + "," + "isOPCTimeout=" + bit2.ToString()
                        + "," + "OPCTimeout=" + OPCTimeout.ToString()
                        + "," + "isScanner=" + bit3.ToString()
                        + "," + "isHostEnrollment=" + bit4.ToString()
                        + "," + "IsEffectiveDate=" + bit5.ToString()
                        + "," + "NoMarkTemplate='" + NoMarkTemplate.ToString().ToUpper() + "'"
                        + "," + "DefaultPassword='" + DefaultPassword.ToString() + "'";
                }
                else
                {
                    query = "insert into tblSettings(isSignalR,Tolerance,isOPCTimeout,OPCTimeout,NoMarkTemplate,DefaultPassword,isScanner,isHostEnrollment,IsEffectiveDate) values(" + bit.ToString() + "," + tolerance.ToString() 
                        + "," + bit2.ToString()
                        + "," + OPCTimeout.ToString()
                        + "," + "'" + NoMarkTemplate.ToString().ToUpper() + "'"
                        + "," + "'" + DefaultPassword.ToString() + "'"
                        + "," + bit3.ToString()
                        + "," + bit4.ToString()
                        + "," + bit5.ToString()
                        + ")";
                }

                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("Configuration", "Updated Configuration", HostName, IP, HttpContext.Current.Session["Username"].ToString());
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