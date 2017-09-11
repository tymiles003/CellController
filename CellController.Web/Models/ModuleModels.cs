using CellController.Web.Helpers;
using CellController.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;

namespace CellController.Web.Models
{
    public class ModuleModels
    {
        //get all active modules
        public DataTable GetAvailableModules()
        {
            return Library.ConnectionString.returnCon.executeSelectQuery("SELECT * FROM tblModules WHERE IsActive='True' order by ParentId,Sequence", CommandType.Text);
        }

        //validate if the parent has a sub module
        public bool validateParentModule(string parentID)
        {
            bool result = false;
            DataTable dt = new DataTable();

            dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT * FROM tblModules WHERE ParentId=" + parentID + " order by ParentId,Sequence", CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                try
                {
                    dt = new DataTable();

                    dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT * FROM tblModules WHERE IsActive='True' and ParentId=" + parentID + " order by ParentId,Sequence", CommandType.Text);

                    try
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
                    catch
                    {
                        result = false;
                    }
                }
                catch
                {
                    result = false;
                }
            }
            else
            {
                try
                {
                    dt = new DataTable();

                    dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT IsActive FROM tblModules WHERE Id=" + parentID, CommandType.Text);

                    foreach (DataRow dr in dt.Rows)
                    {
                        result = Convert.ToBoolean(dr["IsActive"].ToString());
                    }
                }
                catch
                {
                    result = false;
                }
            }

            return result;
        }

        //function for getting module id and parent id
        public static ModuleObject getModule(string ModuleName)
        {
            ModuleObject obj = new ModuleObject();

            try
            {
                string query = "Select Name, Id, ParentId from tblModules where Name='" + ModuleName + "'";
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);
                foreach (DataRow dr in dt.Rows)
                {
                    obj.Id = Convert.ToInt32(dr["Id"].ToString());
                    obj.ParentId = Convert.ToInt32(dr["ParentId"].ToString());
                    obj.Name = dr["Name"].ToString();

                    string query2 = "Select Name from tblModules where Id=" + obj.ParentId.ToString();
                    DataTable dt2 = new DataTable();
                    obj.ParentName = null;
                    dt2 = DBModel.CustomSelectQuery(query2);

                    foreach (DataRow dr2 in dt2.Rows)
                    {
                        obj.ParentName = dr2["Name"].ToString();
                    }
                }
            }
            catch
            {
                obj = null;
            }

            return obj;
        }

        //validate if the user group has access for the module
        public bool validateAccess(string UserModeCode, string ModuleId)
        {
            bool result = false;
            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("select ModuleId from tblPermissions where ModuleId=" + ModuleId + " and UserModeCode=" + UserModeCode + " order by ModuleId", CommandType.Text);

                if (dt.Rows.Count>0)
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
                result = false;
            }
            return result;
        }

        //getting the parent id of the child module
        public static int getParentID(int ID)
        {
            int result = 0;

            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("select ParentId from tblModules where Id=" + ID.ToString(), CommandType.Text);
                foreach (DataRow dr in dt.Rows)
                {
                    result = Convert.ToInt32(dr["ParentId"].ToString());
                }
            }
            catch
            {
                result = 0;
            }

            return result;
        }

        //function for validating module
        public bool validateMenu(string UserModeCode, string ParentID)
        {
            bool result = false;

            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("select Id from tblModules where ParentId=" + ParentID, CommandType.Text);

                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        string ID = "";
                        ID = dr["Id"].ToString();

                        if (validateAccess(UserModeCode, ID))
                        {
                            result = true;
                        }
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

        //function will check the access rights
        public static bool checkAccess(string UserModeCode, int ModuleID)
        {
            bool result = false;

            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id FROM tblPermissions WHERE ModuleId=" + ModuleID.ToString() + " and UserModeCode=" + UserModeCode, CommandType.Text);

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
                result = false;
            }

            return result;
        }

        //function will check the access rights when the url is manually inputted in the browser
        public static bool checkAccessForURL(string UserModeCode, int ModuleID)
        {
            bool result = false;

            try
            {
                DataTable dt = new DataTable();
                int ParentID = getParentID(ModuleID);

                if (ParentID == 0)
                {
                    dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT a.Id FROM tblPermissions a left join tblModules b on a.ModuleId=b.Id WHERE a.ModuleId="
                    + ModuleID.ToString() + " and a.UserModeCode=" + UserModeCode.ToString()
                    + " and b.IsActive=1", CommandType.Text);

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
                    dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id from tblModules where Id=" + ParentID.ToString() + " and IsActive=1", CommandType.Text);

                    if (dt.Rows.Count > 0)
                    {
                        dt = new DataTable();

                        dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT a.Id FROM tblPermissions a left join tblModules b on a.ModuleId=b.Id WHERE a.ModuleId="
                        + ModuleID.ToString() + " and a.UserModeCode=" + UserModeCode.ToString()
                        + " and b.IsActive=1", CommandType.Text);

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
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function to log access rights update in audit log
        public static void LogAccessRightsUpdate(int UserModeCode)
        {
            string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
            string HostName = computer_name[0].ToString().ToUpper();
            string IP = HttpHandler.GetIPAddress();
            AuditModel.AddLog("Access Rights", "Updated Access Rights - ID: " + UserModeCode.ToString(), HostName, IP, HttpContext.Current.Session["Username"].ToString());
        }

        //function for saving access rights
        public static bool SaveSettings(int UserModeCode, int ModuleID, bool isEnabled)
        {
            bool result = true;

            try
            {
                int bitEnabled = 0;

                if (isEnabled == true)
                {
                    bitEnabled = 1;
                }

                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id FROM tblPermissions WHERE UserModeCode=" + UserModeCode.ToString() + " AND ModuleId=" + ModuleID.ToString(), CommandType.Text);

                string query = "";
                if (dt.Rows.Count > 0)
                {
                    int ID = 0;
                    foreach (DataRow dr in dt.Rows)
                    {
                        ID = Convert.ToInt32(dr["Id"].ToString());
                    }

                    if (bitEnabled == 0)
                    {
                        query = "Delete tblPermissions WHERE Id=" + ID.ToString();
                    }
                    else
                    {
                        query = "Update tblPermissions SET UserModeCode=" + UserModeCode.ToString() + ",ModuleID=" + ModuleID.ToString() + " WHERE Id=" + ID.ToString();
                    }

                    result = DBModel.ExecuteCustomQuery(query);
                }
                else
                {
                    if (bitEnabled == 1)
                    {
                        query = "Insert into tblPermissions(UserModeCode,ModuleId) values(" + UserModeCode.ToString() + "," + ModuleID.ToString() + ")";
                        result = DBModel.ExecuteCustomQuery(query);
                    }
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for checking if the parent module has child
        public static bool hasChild(int ID)
        {
            bool result = false;

            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id FROM tblModules WHERE ParentId=" + ID.ToString(), CommandType.Text);

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
                result = false;
            }

            return result;
        }

        //function for getting child count
        public static int getChildCount(int ID)
        {
            int count = 0;
            try
            {
                DataTable dt = new DataTable();
                dt = Library.ConnectionString.returnCon.executeSelectQuery("SELECT Id FROM tblModules WHERE IsActive=1 and ParentId=" + ID.ToString(), CommandType.Text);

                count = dt.Rows.Count;
            }
            catch
            {
                count = 0;
            }

            return count;
        }

        public DataTable GetUserModules(int EntityId)
        {
            return Library.ConnectionString.returnCon.executeSelectQuery("SELECT ParentId, ObjectId FROM vwUserModules " +
                " WHERE EntityType = 'user' " +
                " AND EntityId = " + "1" +
                " AND Category = 'module' " +
                " AND HasAccess = 1 " +
                " AND  IsActive = 1", CommandType.Text);
        }

        //function for deleting access rights
        public static bool DeletePermission(int UserModeCode)
        {
            bool result = false;
            try
            {
                string query = "Delete tblPermissions WHERE UserModeCode=" + UserModeCode.ToString();
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        //function for getting user access rights
        public static List<string> getUserRights(string username)
        {
            string query = "select a.username,b.UserModeDesc,d.Name,d.Id,d.ParentId from users a left join UserModeTable b on a.UserModeCode=b.UserModeCode left join tblPermissions c on b.UserModeCode=c.UserModeCode left join tblModules d on c.ModuleId=d.Id where d.IsActive=1 and a.UserName='" + username + "'";

            List<string> result = new List<string>();

            try
            {
                DataTable dt = new DataTable();
                dt = DBModel.CustomSelectQuery(query);

                foreach (DataRow dr in dt.Rows)
                {
                    if(Convert.ToInt32(dr["ParentId"].ToString()) == 0)
                    {
                        var count = getChildCount(Convert.ToInt32(dr["Id"].ToString()));
                        if (count == 0)
                        {
                            result.Add(dr["Name"].ToString());
                        }
                    }
                    else
                    {
                        var parentID = getParentID(Convert.ToInt32(dr["Id"].ToString()));
                        query = "Select IsActive from tblModules where Id=" + parentID;
                        DataTable dt_temp = new DataTable();
                        try
                        {
                            dt_temp = DBModel.CustomSelectQuery(query);
                            foreach (DataRow dr2 in dt_temp.Rows)
                            {
                                var isActive = Convert.ToBoolean(dr2["IsActive"]);
                                if (isActive == true)
                                {
                                    result.Add(dr["Name"].ToString());
                                }
                            }
                        }
                        catch
                        { }
                    }
                }

            }
            catch
            {
                result = null;
            }

            return result;
        }

    }
}