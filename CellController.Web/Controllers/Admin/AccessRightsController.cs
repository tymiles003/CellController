using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers.Admin
{
    public class AccessRightsController : Controller
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

                //get the module
                var modName = "Access Rights";
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

        //function for getting account types
        [HttpGet]
        public JsonResult GetAccountTypes()
        {
            DataTable dt = new DataTable();

            dt = UserModels.GetAllUserType();
            List<AccountObject> obj = new List<AccountObject>();

            //loop the data table and create the account object
            foreach (DataRow dr in dt.Rows)
            {
                obj.Add(new AccountObject { UserModeCode = Convert.ToInt32(dr["UserModeCode"].ToString()), UserModeDesc = dr["UserModeDesc"].ToString(), isLoginOverride = Convert.ToBoolean(dr["isLoginOverride"].ToString()) });
            }

            //serialize the object to json
            string json = JsonConvert.SerializeObject(obj);

            //return the json object
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for saving user rights
        [HttpPost]
        public JsonResult Save(int UserModeCode, List<string> lstModuleID, List<string> lstIsEnabled)
        {
            bool result = true;
            for (int x = 0; x <lstModuleID.Count; x++)
            {
                int ModuleID = Convert.ToInt32(lstModuleID[x]);
                bool isEnabled = Convert.ToBoolean(lstIsEnabled[x]);
                bool tempResult = ModuleModels.SaveSettings(UserModeCode, ModuleID, isEnabled);
                if (tempResult == false)
                {
                    result = false;
                }
            }

            if (result == true)
            {
                ModuleModels.LogAccessRightsUpdate(UserModeCode);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for getting modules
        [HttpGet]
        public JsonResult GetModules(string UserModeCode)
        {
            ModuleModels mod = new ModuleModels();
            DataTable dt = new DataTable();
            dt = mod.GetAvailableModules();
            List<ModuleObject> obj = new List<ModuleObject>();

            //loop the data table and create the module object
            foreach (DataRow dr in dt.Rows)
            {
                bool result = ModuleModels.checkAccess(UserModeCode, Convert.ToInt32(dr["Id"].ToString()));
                bool hasChild = ModuleModels.hasChild(Convert.ToInt32(dr["Id"].ToString()));
                int count = ModuleModels.getChildCount(Convert.ToInt32(dr["Id"].ToString()));
                obj.Add(new ModuleObject
                {
                    Id = Convert.ToInt32(dr["Id"].ToString()),
                    ParentId = Convert.ToInt32(dr["ParentId"].ToString()),
                    Name = dr["Name"].ToString(),
                    Description = dr["Description"].ToString(),
                    IsEnabled = result,
                    HasChild = hasChild,
                    ChildCount = count
                });
            }

            //serialize the object to json
            string json = JsonConvert.SerializeObject(obj);

            //return the json object
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function to check if the rights is enabled
        [HttpGet]
        public JsonResult CheckRights(string UserModeCode, int ModuleId, int ParentId, string Name)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();

            bool result = ModuleModels.checkAccess(UserModeCode, ModuleId);
            response.Add("Result", result);
            response.Add("ID", ModuleId);
            response.Add("ParentID", ParentId);
            response.Add("Name", Name);

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}