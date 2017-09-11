using CellController.Web.Helpers;
using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers
{
    public class AdhocWIPDataController : Controller
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
                var modName = "Adhoc WIP Data";
                var module = ModuleModels.getModule(modName);

                ViewBag.Title = "Cell Controller";

                bool check = false;

                if (module != null)
                {
                    //generate the menus
                    ViewBag.Menu = custom_helper.GenerateMenu(module.Id, module.ParentId, userType);
                    ViewBag.PageHeader = module.Name;
                    //ViewBag.Breadcrumbs = module.Name;
                    ViewBag.Breadcrumbs = "";

                    check = true;
                }
                else
                {
                    check = false;
                }

                //check access for module, if no access redirect to error page
                if (ModuleModels.checkAccessForURL(userType, module.Id) && check)
                {
                    var enrolledEquipments = HttpHandler.GetEnrolledEquipments(username);
                    try
                    {
                        Session.Remove("ModuleErrorHeader");
                        Session.Remove("ModuleErrorBreadCrumbs");
                    }
                    catch { }
                    return View(enrolledEquipments);
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

        //function to get the adhoc wip data object types from camstar
        [HttpGet]
        public JsonResult GetObjecTypes()
        {
            var result = HttpHandler.GetAdhocWIPData_ObjectTypes();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function to get the adhoc wip data setup from camstar
        [HttpGet]
        public JsonResult GetSetup(string objectType)
        {
            var result = HttpHandler.GetAdhocWIPData_Setup(objectType);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function to get the adhoc wip data record sequence from camstar
        [HttpPost]
        public JsonResult GetRecordSequence(string AdhocWIPDataSetup, string ObjectType, string UserID)
        {
            var result = HttpHandler.GetAdhocWIPData_RecordSequence(AdhocWIPDataSetup, ObjectType, UserID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function to get the adhoc wip data details from camstar
        [HttpPost]
        public JsonResult GetDetails(string AdhocWIPDataSetup, string ObjectType, string ObjectName, string ObjectRevision, string RecordSequence, string UserID)
        {
            var result = HttpHandler.GetAdhocWIPData_Details(AdhocWIPDataSetup, ObjectType, ObjectName, ObjectRevision, RecordSequence, UserID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AdhocWIPData_Submit(string AdhocWIPDataSetup, string ObjectName, string ObjectType, string RecordSequence, string lstField, string lstValue, string UserID)
        {
            var result = HttpHandler.AdhocWIPData_Submit(AdhocWIPDataSetup, ObjectName, ObjectType, RecordSequence, lstField, lstValue, UserID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetGroupIDConnection()
        {
            List<string> result = GroupEquipmentModels.GetGroupIDConnection();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}