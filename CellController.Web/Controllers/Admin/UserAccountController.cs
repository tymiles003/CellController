using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CellController.Web.Controllers.Admin
{
    public class UserAccountController : Controller
    {
        private CustomHelper custom_helper = new CustomHelper();
        private Dictionary<string, object> response = new Dictionary<string, object>();

        public ActionResult Index()
        {
            //Check cookie and session variables for retaining login status
            //if true go to page, else return to login page
            if (HttpHandler.CheckSession())
            {
                string username = Session["Username"].ToString();
                string userType = UserModels.GetUserType(username);
                string thumbnailPhoto = UserModels.GetThumbnailPhoto(username);
                try
                {
                    HttpContext.Session.Add("ThumbnailPhoto", thumbnailPhoto);
                    HttpContext.Session.Add("Name", Request.Cookies["Name"].Value.ToString());
                    HttpContext.Session.Add("Position", Request.Cookies["Position"].Value.ToString());
                    HttpContext.Session.Add("EmployeeNumber", Request.Cookies["EmployeeNumber"].Value.ToString());
                }
                catch { }

                //get the module
                var modName = "User";
                var module = ModuleModels.getModule(modName);

                ViewBag.Title = "Cell Controller";

                bool check = false;

                if (module != null)
                {
                    //generate the menus
                    ViewBag.Menu = custom_helper.GenerateMenu(module.Id, module.ParentId, userType);
                    ViewBag.PageHeader = module.ParentName + " / " + module.Name;
                    ViewBag.Breadcrumbs = module.Name;

                    check = true;
                }
                else
                {
                    check = false;
                }

                //check access for module, if no access redirect to error page
                if (ModuleModels.checkAccessForURL(userType, module.Id) && check)
                {
                    try
                    {
                        Session.Remove("ModuleErrorHeader");
                        Session.Remove("ModuleErrorBreadCrumbs");
                    }
                    catch { }
                    return View();
                }
                else
                {
                    Session.Add("ModuleErrorHeader", ViewBag.PageHeader);
                    Session.Add("ModuleErrorBreadCrumbs", ViewBag.Breadcrumbs);
                    return RedirectToAction("Index", "Error");
                }
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

        //function for getting the user details from AD
        [HttpGet]
        public JsonResult GetUserDetails(string username)
        {
            //use default credentials
            HttpClientHandler handler = new HttpClientHandler();
            handler.UseDefaultCredentials = true;

            //init the client
            HttpClient client = new HttpClient(handler);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var url = ConfigurationManager.AppSettings[ConfigurationManager.AppSettings["env"].ToString() + "_api_base_url"].ToString() + "login/userinfo?username=" + username + "&json=true";

            //get the response
            HttpResponseMessage res = client.GetAsync(url).Result;

            Dictionary<string, object> response = new Dictionary<string, object>();

            if (res.IsSuccessStatusCode)
            {
                string strJson = res.Content.ReadAsStringAsync().Result;
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(strJson);

                JavaScriptSerializer j = new JavaScriptSerializer();
                object a = j.Deserialize(strJson, typeof(object));

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(strJson);

                try
                {
                    string temp = dict["sAMAccountName"].ToString();

                    //get the data and build the dictionary
                    if (temp != "" && temp != null)
                    {
                        response = new Dictionary<string, object>();

                        response.Add("FirstName", dict["givenName"].ToString());

                        try
                        {
                            response.Add("LastName", dict["sn"].ToString());
                        }
                        catch
                        {
                            response.Add("LastName", dict["givenName"].ToString());
                        }

                        try
                        {
                            response.Add("MiddleName", dict["initials"].ToString());
                        }
                        catch
                        {
                            response.Add("MiddleName", "");
                        }

                        try
                        {
                            response.Add("Email", dict["mail"].ToString().ToLower());
                        }
                        catch
                        {
                            response.Add("Email", "");
                        }

                        
                        response.Add("Error", false);
                    }
                    else
                    {
                        response = new Dictionary<string, object>();
                        response.Add("Error", true);
                    }
                }
                catch
                {
                    response = new Dictionary<string, object>();
                    response.Add("Error", true);
                }
            }
            else
            {
                response = new Dictionary<string, object>();
                response.Add("Error", true);
            }

            //return the data dictionary
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for adding user
        [HttpPost]
        public JsonResult AddUser(string Username, string FirstName, string LastName, string MiddleName, string ModeCode, string Password, string Email)
        {
            var result = HttpHandler.CreateUser(Username, FirstName, LastName, MiddleName, ModeCode, Password, Email, "");

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for getting default password
        [HttpGet]
        public string GetDefaultPassword()
        {
            string defaultPassword = HttpHandler.getDefaultPassword();

            return defaultPassword;
        }

        //function for adding user group
        [HttpPost]
        public JsonResult AddUserGroup(string UserModeDesc, bool isEnabled)
        {
            var result = UserModels.AddUserGroup(UserModeDesc, isEnabled);
            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for updating user
        [HttpPost]
        public JsonResult UpdateUser(string Username, string FirstName, string LastName, string MiddleName, string ModeCode, string Password, string Email)
        {
            var result = HttpHandler.UpdateUser(Username, FirstName, LastName, MiddleName, ModeCode, Password, Email, "");

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for updating user group
        [HttpPost]
        public JsonResult UpdateUserGroup(string UserModeDesc, bool isEnabled, int UserModeCode)
        {
            var result = UserModels.UpdateUserGroup(UserModeDesc, isEnabled, UserModeCode);
            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for deleting user
        [HttpPost]
        public JsonResult DeleteUser(string username)
        {
            //get the result using ignition web service
            var result = HttpHandler.DeleteUser(username);
            
            //return the json data
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for deleting user group
        [HttpPost]
        public JsonResult DeleteUserGroup(int UserModeCode)
        {
            //get the result using ignition web service
            var result = UserModels.DeleteUserGroup(UserModeCode);

            if (result == true)
            {
                result = ModuleModels.DeletePermission(UserModeCode);

                if (result == true)
                {
                    result = UserModels.ResetUserByBatch(UserModeCode);

                    if (result == true)
                    {
                        string position = "";
                        bool isNAPosition = false;
                        try
                        {
                            position = UserModels.GetPosition(Session["Username"].ToString());
                            isNAPosition = false;
                        }
                        catch
                        {
                            position = "N/A";
                            isNAPosition = true;
                        }

                        HttpContext.Session.Add("Position", position);
                        HttpContext.Session.Add("isNAUser", isNAPosition);

                        try
                        {
                            Response.Cookies["Position"].Expires = DateTime.Now.AddDays(-1);
                            Response.Cookies["isNAUser"].Expires = DateTime.Now.AddDays(-1);
                        }
                        catch { }

                        try
                        {
                            HttpCookie cookiePositon = new HttpCookie("Position");
                            cookiePositon.Value = position;
                            cookiePositon.Expires = DateTime.Now.AddDays(30);
                            Response.Cookies.Add(cookiePositon);

                            HttpCookie cookieisNAUser = new HttpCookie("isNAUser");
                            cookieisNAUser.Value = isNAPosition.ToString();
                            cookieisNAUser.Expires = DateTime.Now.AddDays(30);
                            Response.Cookies.Add(cookieisNAUser);
                        }
                        catch { }
                    }
                }
            }

            //return the json data
            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the user exists
        [HttpGet]
        public JsonResult CheckUser(string Username)
        {
            var result = UserModels.UserExist(Username);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the user group exists
        [HttpGet]
        public JsonResult CheckUserGroup(string GroupName)
        {
            var result = UserModels.UserGroupExist(GroupName);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the user group exists (for update)
        [HttpGet]
        public JsonResult CheckUserGroupForUpdate(string GroupName, int UserModeCode)
        {
            var result = UserModels.UserGroupExistForUpdate(GroupName, UserModeCode);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting account types
        [HttpGet]
        public JsonResult GetAccountTypes()
        {
            DataTable dt = new DataTable();

            dt = UserModels.GetAllUserType();
            List<AccountObject> obj = new List<AccountObject>();

            //loop the data table and create the account object
            foreach(DataRow dr in dt.Rows)
            {
                obj.Add(new AccountObject { UserModeCode = Convert.ToInt32(dr["UserModeCode"].ToString()), UserModeDesc = dr["UserModeDesc"].ToString() });
            }

            //serialize the object to json
            string json = JsonConvert.SerializeObject(obj);

            //return the json object
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for refreshing position
        [HttpGet]
        public JsonResult RefreshPosition(string username)
        {
            var result = UserModels.GetPosition(username);
            string json = result.ToString();

            HttpContext.Session.Add("Position", result);

            try
            {
                Response.Cookies["Position"].Expires = DateTime.Now.AddDays(-1);
            }
            catch { }

            try
            {
                HttpCookie cookiePositon = new HttpCookie("Position");
                cookiePositon.Value = result;
                cookiePositon.Expires = DateTime.Now.AddDays(30);
                Response.Cookies.Add(cookiePositon);
            }
            catch { }

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for getting users to be displayed on the gridview
        [HttpGet]
        public JsonResult GetUserList()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = UserModels.GetCols();

            //check for filters
            string where = "";
            Dictionary<string, string> filters = new Dictionary<string, string>();
            if (Request["filterscount"] != null && Int32.Parse(Request["filterscount"]) > 0)
            {
                for (int i = 0; i < Int32.Parse(Request["filterscount"]); i++)
                {
                    filters.Add("filtervalue" + i, Request["filtervalue" + i]);
                    filters.Add("filtercondition" + i, Request["filtercondition" + i]);
                    filters.Add("filterdatafield" + i, Request["filterdatafield" + i]);
                    filters.Add("filteroperator" + i, Request["filteroperator" + i]);
                }
                where = custom_helper.FormatFilterConditions(filters, Int32.Parse(Request["filterscount"]), columns);
            }

            //check for sorting ops
            string sorting = "";
            if (Request["sortdatafield"] != null)
            {
                sorting = Request["sortdatafield"].ToString() + " " + Request["sortorder"].ToString().ToUpper();
            }

            //determine if cols_only
            if (Request["cols_only"] != null && bool.Parse(Request["cols_only"]) == true)
            {
                //get total row count
                int totalRows = UserModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

                //prepare column config
                var cols = new List<string>();
                foreach (var item in columns)
                {
                    cols.Add(item.Value);
                }

                Dictionary<string, object> cols_arr = custom_helper.PrepareStaticColumns(cols);
                result_config.Add("column_config", custom_helper.PrepareColumns(cols_arr));
                result_config.Add("TotalRows", totalRows);
            }
            else
            {
                //pagination initialization
                int pagenum = Request["pagenum"] == null ? 0 : Int32.Parse(Request["pagenum"].ToString());
                int pagesize = Request["pagesize"] == null ? 0 : Int32.Parse(Request["pagesize"].ToString());
                int start = pagenum * pagesize;

                //get data
                DataTable transactions = new DataTable();
                if (Request["showAll"] != null && bool.Parse(Request["showAll"]) == true)
                {
                    transactions = UserModels.GetData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = UserModels.GetData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }

                //convert data into json object
                var data = custom_helper.DataTableToJson(transactions);

                result_config.Add("data", data);

                //prepare column config
                var cols = new List<string>();
                foreach (DataColumn column in transactions.Columns)
                {
                    cols.Add(column.ColumnName);
                }
                Dictionary<string, object> cols_arr = custom_helper.PrepareStaticColumns(cols);
                result_config.Add("column_config", custom_helper.PrepareColumns(cols_arr));
                result_config.Add("TotalRows", UserModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }

            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }
        
        //function for getting user groups to be displayed on the gridview
        [HttpGet]
        public JsonResult GetUserGroupList()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = UserModels.GetTypeCols();

            //check for filters
            string where = "";
            Dictionary<string, string> filters = new Dictionary<string, string>();
            if (Request["filterscount"] != null && Int32.Parse(Request["filterscount"]) > 0)
            {
                for (int i = 0; i < Int32.Parse(Request["filterscount"]); i++)
                {
                    filters.Add("filtervalue" + i, Request["filtervalue" + i]);
                    filters.Add("filtercondition" + i, Request["filtercondition" + i]);
                    filters.Add("filterdatafield" + i, Request["filterdatafield" + i]);
                    filters.Add("filteroperator" + i, Request["filteroperator" + i]);
                }
                where = custom_helper.FormatFilterConditions(filters, Int32.Parse(Request["filterscount"]), columns);
            }

            //check for sorting ops
            string sorting = "";
            if (Request["sortdatafield"] != null)
            {
                sorting = Request["sortdatafield"].ToString() + " " + Request["sortorder"].ToString().ToUpper();
            }

            //determine if cols_only
            if (Request["cols_only"] != null && bool.Parse(Request["cols_only"]) == true)
            {
                //get total row count
                int totalRows = UserModels.GetTypeCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

                //prepare column config
                var cols = new List<string>();
                foreach (var item in columns)
                {
                    cols.Add(item.Value);
                }

                Dictionary<string, object> cols_arr = custom_helper.PrepareStaticColumns(cols);
                result_config.Add("column_config", custom_helper.PrepareColumns(cols_arr));
                result_config.Add("TotalRows", totalRows);
            }
            else
            {
                //pagination initialization
                int pagenum = Request["pagenum"] == null ? 0 : Int32.Parse(Request["pagenum"].ToString());
                int pagesize = Request["pagesize"] == null ? 0 : Int32.Parse(Request["pagesize"].ToString());
                int start = pagenum * pagesize;

                //get data
                DataTable transactions = new DataTable();
                if (Request["showAll"] != null && bool.Parse(Request["showAll"]) == true)
                {
                    transactions = UserModels.GetTypeData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = UserModels.GetTypeData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }

                //convert data into json object
                var data = custom_helper.DataTableToJson(transactions);

                result_config.Add("data", data);

                //prepare column config
                var cols = new List<string>();
                foreach (DataColumn column in transactions.Columns)
                {
                    cols.Add(column.ColumnName);
                }
                Dictionary<string, object> cols_arr = custom_helper.PrepareStaticColumns(cols);
                result_config.Add("column_config", custom_helper.PrepareColumns(cols_arr));
                result_config.Add("TotalRows", UserModels.GetTypeCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }

            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}