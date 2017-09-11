using System.Web.Mvc;
using CellController.Web.Helpers;
using CellController.Web.Models;
using System.Web;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Net;

namespace CellController.Web.Controllers
{
    public class HomeController : Controller
    {
        private CustomHelper custom_helper = new CustomHelper();

        [CustomAuthorize]
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

                //get the enrolled equipments of the user
                var enrolledEquipments = HttpHandler.GetEnrolledEquipments(username);

                int count = 0;
                try
                {
                    count = enrolledEquipments.Count;
                }
                catch
                {
                    count = 0;
                }

                //loop the equipments and create cookie
                string equipments = "";
                if (count > 0)
                {
                    foreach (var x in enrolledEquipments)
                    {
                        equipments += x.Equipment + ",";
                    }
                    equipments += ")";
                    equipments = equipments.Replace(",)", "");
                }

                try
                {
                    HttpContext.Session.Add("Equipments", equipments);
                    HttpCookie cookieEquipments = new HttpCookie("Equipments");
                    cookieEquipments.Value = equipments;
                    DateTime now = DateTime.Now;
                    cookieEquipments.Expires = now.AddDays(30);
                    Response.Cookies.Add(cookieEquipments);
                }
                catch { }

                //get the module
                var modName = "Home";
                var module = ModuleModels.getModule(modName);

                ViewBag.Title = "Cell Controller";

                bool check = false;

                if (module != null)
                {
                    //generate the menus
                    ViewBag.Menu = custom_helper.GenerateMenu(module.Id, module.ParentId, userType);
                    check = true;
                    //ViewBag.PageHeader = modName + " / " + "Enrolled Machines";
                    ViewBag.PageHeader = modName;
                    ViewBag.Breadcrumbs = "Enrolled Machines";
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

        //function to get the location of the lot from camstar
        [HttpGet]
        public JsonResult GetLotLocation(string LotNo)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();

            var lot = HttpHandler.GetLotInfo(LotNo);

            response.Add("Location", lot.ProcessSpecObjectCategory);


            return Json(response, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult getReel(string equipment)
        {
            var res = ReelModel.SelectReel(equipment);

            return Json(res, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string GetMachineName()
        {
            string[] computer_name = Dns.GetHostEntry(Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
            string HostName = computer_name[0].ToString().ToUpper();
            return HostName;
        }

        [HttpGet]
        public bool IsChildEquipment(string equipment)
        {
            bool check = false;
            check = EquipmentModels.IsChildEquipment(equipment);
            return check;
        }

        [HttpGet]
        public string getParentEquipment(string equipment)
        {
            string parent = "";
            parent = EquipmentModels.getParentEquipment(equipment);
            return parent;
        }

        [HttpGet]
        public JsonResult getChildEquipments(string parent)
        {
            List<string> child = new List<string>();
            child = EquipmentModels.getChildEquipments(parent);
            return Json(child, JsonRequestBehavior.AllowGet);
        }

        //function for getting signalR
        [HttpGet]
        public string GetSignalR()
        {
            return SignalRHelper.SignalRHub;
        }

        //function for getting access rights to be used to display in the context menu
        [HttpGet]
        public JsonResult getUserRights(string username)
        {
            List<string> result = new List<string>();

            result = ModuleModels.getUserRights(username);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAllAlarmsTCP(string Equipment)
        {
            var result = EquipmentModels.getAllAlarmsTCP(Equipment);

            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(result);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAllAlarmsSECSGEM(string Equipment)
        {
            var result = HttpHandler.GetAllAlarms(Equipment);

            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(result);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult markAsRead(string ID)
        {
            var result = EquipmentModels.markAsRead(ID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult markAsReadSECSGEM(string ID)
        {
            var result = EquipmentModels.markAsReadSECSGEM(ID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult isProcessing(string Equipment)
        {
            var result = EquipmentModels.isProcessing(Equipment);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}