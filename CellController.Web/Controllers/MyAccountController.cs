using CellController.Web.Helpers;
using CellController.Web.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CellController.Web.Controllers
{
    public class MyAccountController : Controller
    {
        private CustomHelper custom_helper = new CustomHelper();

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

                //generate the menus
                ViewBag.Menu = custom_helper.GenerateMenu(0, 0, userType);

                ViewBag.Title = "Cell Controller";
                ViewBag.PageHeader = "My Account";
                ViewBag.Breadcrumbs = "My Account";

                return View();
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

        //function for getting default password
        [HttpGet]
        public string GetDefaultPassword()
        {
            string defaultPassword = HttpHandler.getDefaultPassword();

            return defaultPassword;
        }

        //function for saving user profile
        [HttpPost]
        public bool Save(string username, string password, string fname, string lname, string mname, string email)
        {
            bool result = false;

            try
            {
                var temp = HttpHandler.UpdateUser(username, fname, lname, mname, "", password, email, "");
                try
                {
                    result = Convert.ToBoolean(temp);
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

            return result;
        }

        //function for validating account
        [HttpGet]
        public string ValidateAD(string username, string password)
        {
            string result = HttpHandler.ADLogin(username, password);

            return result;
        }

        //function for getting encoded password
        [HttpGet]
        public string GetEncodedPassword(string password)
        {
            string result = HttpHandler.GetEncodedPassword(password);

            return result;
        }

        //function for getting user profile
        [HttpGet]
        public JsonResult GetUserProfile(string username)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();

            DataTable dt = new DataTable();
            dt = UserModels.GetUserProfile(username);

            foreach (DataRow dr in dt.Rows)
            {
                response.Add("Username", dr["UserName"].ToString());
                response.Add("FirstName", dr["FirstName"].ToString());
                response.Add("LastName", dr["LastName"].ToString());
                response.Add("MiddleName", dr["MiddleName"].ToString());
                response.Add("Password", dr["Password"].ToString());
                response.Add("Email", dr["Email"].ToString());
                response.Add("UserModeDesc", dr["UserModeDesc"].ToString());
            }

            return Json(response, JsonRequestBehavior.AllowGet);
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
    }
}