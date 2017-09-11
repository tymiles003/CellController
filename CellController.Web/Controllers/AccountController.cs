using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using CellController.Web.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CellController.Web.Helpers;
using static CellController.Web.Library.EncryptDecrypt;
using System.IO;
using System.Net;

namespace CellController.Web.Controllers
{
    public class AccountController : Controller
    {
        //init the response objects
        private Dictionary<string, object> response = new Dictionary<string, object>();
        private Dictionary<string, object> r = new Dictionary<string, object>();

        [AllowAnonymous]
        public ActionResult Login()
        {
            //Check cookie and session variables for retaining login status
            //if true go to home page, else return to login page
            if (HttpHandler.CheckSession())
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return View();
            }
        }

        //function for reading data from a location and converting it to byte data
        public static byte[] ReadImageFile(string imageLocation)
        {
            byte[] imageData = null;
            FileInfo fileInfo = new FileInfo(imageLocation);
            long imageFileLength = fileInfo.Length;
            FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            imageData = br.ReadBytes((int)imageFileLength);
            return imageData;
        }

        //function for the login form submission
        [ValidateInput(false)]
        [AllowAnonymous]
        [HttpPost]
        public JsonResult Attempt(string username, string password)
        {
            try
            {
                //check if model is valid
                if (ModelState.IsValid)
                {
                    //get the result of login using ignition web service
                    string result = HttpHandler.UserLogin(username, password);

                    //handle error
                    if (result == null || result == "")
                    {
                        response.Add("success", false);
                        response.Add("error", true);
                        response.Add("message", "Something went wrong. Please try again later.");
                    }
                    else
                    {
                        if (Convert.ToBoolean(result) == true)
                        {
                            //if the result is true get the user info from AD web service

                            string userType = "";

                            //init the encryptor/decryptor
                            EncryptDecryptPassword e = new EncryptDecryptPassword();

                            //use default credentials for the service
                            HttpClientHandler handler = new HttpClientHandler();
                            handler.UseDefaultCredentials = true;

                            //init the client
                            HttpClient client = new HttpClient(handler);
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                            //get the user type from the local db and use it to display the position
                            //we are not using the AD's employee position. instead we will use our application's user type for the position
                            try
                            {
                                userType = UserModels.GetPosition(username);
                            }
                            catch {
                                userType = "N/A";
                            }

                            bool isLoginSuperVision = UserModels.isLoginSuperVision(username);

                            JavaScriptSerializer j = new JavaScriptSerializer();

                            //init the url for the service
                            var url = ConfigurationManager.AppSettings[ConfigurationManager.AppSettings["env"].ToString() + "_api_base_url"].ToString() + "login/userinfo?username=" + username + "&json=true";
                            HttpResponseMessage res = client.GetAsync(url).Result;

                            //if success create session and cookie to store login status
                            if (res.IsSuccessStatusCode)
                            {
                                try
                                {
                                    //create the session and cookie based on the result from AD service (user info)
                                    string strJson = res.Content.ReadAsStringAsync().Result;
                                    dynamic jObj = (JObject)JsonConvert.DeserializeObject(strJson);
                                    object a = j.Deserialize(strJson, typeof(object));
                                    var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(strJson);

                                    HttpContext.Session.Add("Username", username);
                                    HttpContext.Session.Add("Name", dict["cn"]);
                                    HttpContext.Session.Add("Position", userType);
                                    HttpContext.Session.Add("isLoginSuperVision", isLoginSuperVision);
                                    HttpContext.Session.Add("EmployeeNumber", dict["employeeNumber"].ToString());

                                    string thumbnail = "";

                                    try
                                    {
                                        thumbnail = dict["thumbnailPhoto"].ToString();
                                    }
                                    catch { }

                                    if (thumbnail.ToString() == null || thumbnail == "")
                                    {
                                        byte[] imageBytes = ReadImageFile(Server.MapPath("~/Content/template/images/default_photo.jpg"));
                                        string imageBase64String = Convert.ToBase64String(imageBytes);
                                        string defaultImage = imageBase64String;
                                        thumbnail = defaultImage;
                                    }

                                    HttpContext.Session.Add("ThumbnailPhoto", thumbnail);

                                    HttpHandler.UpdateThumbnailPhoto(username, thumbnail);

                                    DateTime now = DateTime.Now;

                                    try
                                    {
                                        HttpCookie cookieThumbnailPhoto = new HttpCookie("ThumbnailPhoto");
                                        cookieThumbnailPhoto.Value = thumbnail;
                                        cookieThumbnailPhoto.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieThumbnailPhoto);

                                        HttpCookie cookieName = new HttpCookie("Name");
                                        cookieName.Value = dict["cn"].ToString();
                                        cookieName.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieName);

                                        HttpCookie cookiePositon = new HttpCookie("Position");
                                        cookiePositon.Value = userType;
                                        cookiePositon.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookiePositon);

                                        HttpCookie cookieLoginSupervision = new HttpCookie("isLoginSuperVision");
                                        cookieLoginSupervision.Value = isLoginSuperVision.ToString();
                                        cookieLoginSupervision.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieLoginSupervision);

                                        HttpCookie cookieEmployeeNumber = new HttpCookie("EmployeeNumber");
                                        cookieEmployeeNumber.Value = dict["employeeNumber"].ToString();
                                        cookieEmployeeNumber.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieEmployeeNumber);
                                    }
                                    catch { }
                                }
                                catch
                                {
                                    //handle users not in the AD (standalone user for the application)

                                    //get the default thumbnail photo
                                    byte[] imageBytes = ReadImageFile(Server.MapPath("~/Content/template/images/default_photo.jpg"));
                                    string imageBase64String = Convert.ToBase64String(imageBytes);

                                    string defaultImage = imageBase64String;

                                    //create session and cookie
                                    HttpContext.Session.Add("Username", username);
                                    HttpContext.Session.Add("Name", username);
                                    HttpContext.Session.Add("Position", userType);
                                    HttpContext.Session.Add("isLoginSuperVision", isLoginSuperVision);
                                    HttpContext.Session.Add("EmployeeNumber", "");
                                    HttpContext.Session.Add("ThumbnailPhoto", defaultImage);

                                    HttpHandler.UpdateThumbnailPhoto(username, defaultImage);

                                    DateTime now = DateTime.Now;

                                    try
                                    {
                                        HttpCookie cookieThumbnailPhoto = new HttpCookie("ThumbnailPhoto");
                                        cookieThumbnailPhoto.Value = defaultImage;
                                        cookieThumbnailPhoto.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieThumbnailPhoto);

                                        HttpCookie cookieName = new HttpCookie("Name");
                                        cookieName.Value = username;
                                        cookieName.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieName);

                                        HttpCookie cookiePosition = new HttpCookie("Position");
                                        cookiePosition.Value = userType;
                                        cookiePosition.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookiePosition);

                                        HttpCookie cookieLoginSupervision = new HttpCookie("isLoginSuperVision");
                                        cookieLoginSupervision.Value = isLoginSuperVision.ToString();
                                        cookieLoginSupervision.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieLoginSupervision);

                                        HttpCookie cookieEmployeeNumber = new HttpCookie("EmployeeNumber");
                                        cookieEmployeeNumber.Value = "";
                                        cookieEmployeeNumber.Expires = now.AddDays(30);
                                        Response.Cookies.Add(cookieEmployeeNumber);
                                    }
                                    catch {
                                    }
                                }

                                r.Add("success", true);
                                r.Add("error", false);
                            }

                            var check = r["success"];
                            if (check.ToString() == "True")
                            {
                                response.Add("message", "Login Successful");
                                response.Add("success", true);
                                response.Add("error", false);

                            }
                            else
                            {
                                throw new Exception("Login failed!");
                            }
                        }
                        else
                        {
                            response.Add("success", false);
                            response.Add("error", true);
                            response.Add("message", "Invalid username and/or password.");
                        }
                    }
                }
                else
                {
                    throw new Exception("Login failed!");
                }
            }
            catch (Exception e)
            {
                response.Add("success", false);
                response.Add("error", true);
                response.Add("message", e.ToString());
            }
            

            //return the json response
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for login supervision this will be used to override user rights
        [HttpPost]
        public JsonResult LoginSupervision(string Username, string Password)
        {
            string result = "";
            int val = 0;
            
            //check if the username is a valid user
            result = HttpHandler.UserLogin(Username, Password);

            if (result == "True")
            {
                //check if user has login supervision rights
                bool check = UserModels.isLoginSuperVision(Username);
                if (check == true)
                {
                    val = 1;
                }
                else
                {
                    val = 2;
                }
            }
            else
            {
                //Invalid Credentials
                val = 3;
            }

            return Json(val, JsonRequestBehavior.AllowGet);
        }

        //function for checking if the user has supervision rights
        [HttpGet]
        public JsonResult isSupervision(string Username)
        {
            bool result = UserModels.isLoginSuperVision(Username);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for logout
        public JsonResult Logout()
        {
            HttpHandler.logBeforeLogout();

            //remove session and cookie
            Session.Remove("Username");
            Session.Remove("Name");
            Session.Remove("Position");
            Session.Remove("isLoginSuperVision");
            Session.Remove("ThumbnailPhoto");
            Session.Remove("EmployeeNumber");

            try
            {
                Response.Cookies["Username"].Expires = DateTime.Now.AddDays(-1);
                Response.Cookies["Name"].Expires = DateTime.Now.AddDays(-1);
                Response.Cookies["Position"].Expires = DateTime.Now.AddDays(-1);
                Response.Cookies["isLoginSuperVision"].Expires = DateTime.Now.AddDays(-1);
                Response.Cookies["ThumbnailPhoto"].Expires = DateTime.Now.AddDays(-1);
                Response.Cookies["EmployeeNumber"].Expires = DateTime.Now.AddDays(-1);
            }
            catch { }

            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", "");

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}