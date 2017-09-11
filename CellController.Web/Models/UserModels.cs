using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using CellController.Web.ViewModels;
using System.Data.SqlClient;
using Microsoft.Ajax.Utilities;
using System.Net;
using CellController.Web.Helpers;

namespace CellController.Web.Models
{
    public class UserModels
    {
        //start of sample from gatepass
        #region gatepass_sample
        public int AddUser(ADUserObject userObject)
        {
            //return Library.ConnectionString.returnCon.executeQuery("spAddUser", params_, CommandType.StoredProcedure);
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery("exec spAddUser " +
                " @Username = '" + userObject.Username + "'," +
                " @LastName = '" + userObject.LastName + "'," +
                " @GivenName = '" + userObject.GivenName + "'," +
                " @EmployeeNbr = '" + userObject.EmployeeNbr + "'," +
                " @Email = '" + userObject.Email + "'," +
                " @IsActive = '" + userObject.IsActive + "'," +
                " @Department = '" + userObject.Department + "'," +
                " @AddedBy = '" + userObject.AddedBy + "'," +
                " @DateAdded = '" + userObject.DateAdded + "'," +
                " @Source = '" + userObject.Source + "'," +
                " @Type = '" + userObject.Type + "',"+
                " @ThumbnailPhoto = '" + userObject.ThumbnailPhoto + "'", CommandType.Text));
        }

        public int UpdateUser(ADUserObject userObject)
        {
            //return Library.ConnectionString.returnCon.executeQuery("spAddUser", params_, CommandType.StoredProcedure);
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery("exec spUpdateUser " +
                " @Id = " + userObject.Id + "," +
                " @Username = '" + userObject.Username + "'," +
                " @LastName = '" + userObject.LastName + "'," +
                " @GivenName = '" + userObject.GivenName + "'," +
                " @EmployeeNbr = '" + userObject.EmployeeNbr + "'," +
                " @Email = '" + userObject.Email + "'," +
                " @IsActive = '" + userObject.IsActive + "'," +
                " @Department = '" + userObject.Department + "'," +
                " @Source = '" + userObject.Source + "'," +
                " @Type = '" + userObject.Type + "'," +
                " @ThumbnailPhoto = '" + userObject.ThumbnailPhoto + "'", CommandType.Text));
        }

        public int CheckIdFromLocal(string Email)
        {
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery("exec spReadUserIdByEmail " +
                " @Email = '" + Email + "'", CommandType.Text));
        }

        public bool AssignPermissions(int userId)
        {
            //SqlParameter[] params_ = new SqlParameter[] {
            //    new SqlParameter("@FK", FK),
            //    new SqlParameter("@Name", Name),
            //    new SqlParameter("@Department", Department),
            //    new SqlParameter("@Status", Status),
            //    new SqlParameter("@AddedBy", AddedBy),
            //    new SqlParameter("@DateAdded", DateAdded),
            //    new SqlParameter("@ComputerName", System.Net.Dns.GetHostName()),
            //    new SqlParameter("@LoggedInUser", custom_helper.GetCurrentUser()),
            //};

            //return Library.ConnectionString.returnCon.executeQuery("spAddNominationMember", params_, CommandType.StoredProcedure);
            return false;
        }

        public DataTable GetRegisteredUsers()
        {
            return Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id as Id_int, " +
                " Username as Username_string, " +
                " LastName as LastName_string, " +
                " GivenName as GivenName_string, " +
                " EmployeeNbr as EmployeeNbr_string, " +
                " Email as Email_string, " +
                " Department as Department_string, " +
                " Source as Source_string, " +
                " Type as Type_string " +
                " FROM tblUsers" +
                " ORDER BY LastName", CommandType.Text);
        }
        #endregion
        //end of sample from gatepass

        //function for getting the user type for a specific user
        public static string GetPosition(string username)
        {
            return Library.ConnectionString.returnCon.executeScalarQuery("SELECT b.UserModeDesc FROM Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode" +
                " WHERE a.UserName = '" + username + "'", CommandType.Text).ToString();
        }

        //function for getting user code
        public static string GetUserType(string username)
        {
            return Library.ConnectionString.returnCon.executeScalarQuery("SELECT ISNULL(UserModeCode,0) FROM Users " +
                " WHERE UserName = '" + username + "'", CommandType.Text).ToString();
        }

        //function for updating batch user group
        public static bool ResetUserByBatch(int UserModeCode)
        {
            bool result = false;
            try
            {
                string query = "Update Users set UserModeCode=null where UserModeCode=" + UserModeCode.ToString();
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for checking if account has login supervision
        public static bool isLoginSuperVision(string username)
        {
            bool result = false;
            
            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT b.isLoginOverride FROM Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode where a.UserName='" + username + "'", CommandType.Text);

                foreach (DataRow dr in dt.Rows)
                {
                    if (Convert.ToBoolean(dr["isLoginOverride"].ToString()) == true)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for searching username from table using sql LIKE
        public static DataTable SearchUser(string username)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT UserName FROM Users where UserName like '%" + username + "%' order by UserName", CommandType.Text);

            return dt;
        }

        //function for getting thumbnail photo for a specific user
        public static string GetThumbnailPhoto(string username)
        {
            return Library.ConnectionString.returnCon.executeScalarQuery("SELECT [ThumbnailPhoto] FROM Users " +
                " WHERE UserName = '" + username + "'", CommandType.Text).ToString();
        }

        //function for validating if a user exist from the table
        public static bool UserExist(string username)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT UserName FROM Users where UserName='" + username + "'", CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //function for adding user group
        public static bool AddUserGroup(string UserModeDesc, bool isEnabled)
        {
            bool result = false;

            try
            {
                string query = "";

                if (isEnabled == true)
                {
                    query = "Insert into UserModeTable(UserModeDesc,isLoginOverride) values('" + UserModeDesc + "', 1)";
                }
                else
                {
                    query = "Insert into UserModeTable(UserModeDesc,isLoginOverride) values('" + UserModeDesc + "', 0)";
                }

                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("User Role", "Added User Role - User Role: " + UserModeDesc, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for updating user group
        public static bool UpdateUserGroup(string UserModeDesc, bool isEnabled, int UserModeCode)
        {
            bool result = false;

            try
            {
                string query = "";

                if (isEnabled == true)
                {
                    query = "Update UserModeTable set UserModeDesc='" + UserModeDesc + "',isLoginOverride=1 where UserModeCode=" + UserModeCode.ToString();
                }
                else
                {
                    query = "Update UserModeTable set UserModeDesc='" + UserModeDesc + "',isLoginOverride=0 where UserModeCode=" + UserModeCode.ToString();
                }

                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("User Role", "Updated User Role - ID: " + UserModeCode.ToString(), HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for deleting user group
        public static bool DeleteUserGroup(int UserModeCode)
        {
            bool result = false;

            try
            {
                string query = "Delete UserModeTable where UserModeCode=" + UserModeCode;

                result = DBModel.ExecuteCustomQuery(query);

                if (result == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = HttpHandler.GetIPAddress();
                    AuditModel.AddLog("User Role", "Deleted User Role - ID: " + UserModeCode.ToString(), HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for validating if a user group exist from the table
        public static bool UserGroupExist(string groupname)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT UserModeDesc FROM UserModeTable where UserModeDesc='" + groupname + "'", CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //function for validating if a user group exist from the table (this is for the update)
        public static bool UserGroupExistForUpdate(string groupname, int UserModeCode)
        {
            DataTable dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT UserModeDesc FROM UserModeTable where UserModeDesc='" + groupname + "' and UserModeCode<>" + UserModeCode.ToString() , CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //function for getting all user type
        public static DataTable GetAllUserType()
        {
            return Library.ConnectionString.returnCon.executeSelectQuery("SELECT UserModeCode,UserModeDesc,isLoginOverride from UserModeTable order by UserModeDesc", CommandType.Text);
        }
        
        //for getting the columns
        public static Dictionary<string, string> GetCols()
        {
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("a.Username", "username_string");
            cols.Add("a.FirstName", "first_name_string");
            cols.Add("a.LastName", "last_name_string");
            cols.Add("a.MiddleName", "middle_initial_string");
            cols.Add("a.Email", "email_string");
            cols.Add("b.UserModeDesc", "user_role_string");

            return cols;
        }

        //for getting the columns
        public static Dictionary<string, string> GetTypeCols()
        {
            Dictionary<string, string> cols = new Dictionary<string, string>();

            cols.Add("UserModeCode", "user_mode_code_number");
            cols.Add("UserModeDesc", "name_string");
            cols.Add("case when [isLoginOverride]=1 then (select 'Enabled') else (select 'Disabled') end", "login_supervision_string");

            return cols;
        }

        //for getting the count
        public static int GetCount(string where, string searchStr)
        {
            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " a.UserName like '%" + searchStr + "%'"
                        + " OR a.FirstName like '%" + searchStr + "%'"
                        + " OR a.MiddleName like '%" + searchStr + "%'"
                        + " OR a.LastName like '%" + searchStr + "%'"
                        + " OR a.Email like '%" + searchStr + "%' "
                        + " OR b.UserModeDesc like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                       + " a.UserName like '%" + searchStr + "%'"
                       + " OR a.FirstName like '%" + searchStr + "%'"
                       + " OR a.MiddleName like '%" + searchStr + "%'"
                       + " OR a.LastName like '%" + searchStr + "%'"
                       + " OR a.Email like '%" + searchStr + "%' "
                       + " OR b.UserModeDesc like '%" + searchStr + "%'"
                       + ")";
                }
            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode " + where;

            //execute the sql statement
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //for getting the count
        public static int GetTypeCount(string where, string searchStr)
        {
            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " UserModeDesc like '%" + searchStr + "%'"
                        + " OR isLoginOverride like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " UserModeDesc like '%" + searchStr + "%'"
                        + " OR isLoginOverride like '%" + searchStr + "%'"
                        + ")";
                }
            }

            //build the sql statement
            string sql = "SELECT COUNT(*) FROM UserModeTable " + where;

            //execute the sql statement
            return Convert.ToInt32(Library.ConnectionString.returnCon.executeScalarQuery(sql, CommandType.Text));
        }

        //function for getting user profile
        public static DataTable GetUserProfile(string username)
        {
            string query = "Select a.Username,b.UserModeDesc,a.Password,a.Email,a.FirstName,a.LastName,a.MiddleName from Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode where a.Username='" + username + "'";
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

        //for getting the data
        public static DataTable GetTypeData(int offset, int next, string where, string sorting, string searchStr)
        {
            //call for the method in getting the columns
            Dictionary<string, string> cols = GetTypeCols();

            //default sorting
            if (sorting == "")
            {
                sorting = "UserModeDesc asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " UserModeDesc like '%" + searchStr + "%'"
                        + " OR isLoginOverride like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " UserModeDesc like '%" + searchStr + "%'"
                        + " OR isLoginOverride like '%" + searchStr + "%'"
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
                sql += " FROM UserModeTable " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM UserModeTable " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }

        //for getting the data
        public static DataTable GetData(int offset, int next, string where, string sorting, string searchStr)
        {
            //call for the method in getting the columns
            Dictionary<string, string> cols = GetCols();

            //default sorting
            if (sorting == "")
            {
                sorting = "a.UserName,a.LastName,a.FirstName asc";
            }

            if (!searchStr.IsNullOrWhiteSpace())
            {
                if (where != "")
                {
                    where += " AND ("
                        + " a.UserName like '%" + searchStr + "%'"
                        + " OR a.FirstName like '%" + searchStr + "%'"
                        + " OR a.MiddleName like '%" + searchStr + "%'"
                        + " OR a.LastName like '%" + searchStr + "%'"
                        + " OR a.Email like '%" + searchStr + "%' "
                        + " OR b.UserModeDesc like '%" + searchStr + "%'"
                        + ")";
                }
                else
                {
                    where += " WHERE ("
                        + " a.UserName like '%" + searchStr + "%'"
                        + " OR a.FirstName like '%" + searchStr + "%'"
                        + " OR a.MiddleName like '%" + searchStr + "%'"
                        + " OR a.LastName like '%" + searchStr + "%'"
                        + " OR a.Email like '%" + searchStr + "%' "
                        + " OR b.UserModeDesc like '%" + searchStr + "%'"
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
                sql += " FROM Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode " + where + " ORDER BY " + sorting + " " + pagination + ";";
            }
            else
            {
                sql += " FROM Users a left join UserModeTable b on a.UserModeCode=b.UserModeCode " + where + " " + pagination + ";";
            }

            //execute the sql statement
            return Library.ConnectionString.returnCon.executeSelectQuery(sql, CommandType.Text);
        }
    }
}