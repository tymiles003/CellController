using CellController.Web.Helpers;
using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers
{
    public class MaterialSetupController : Controller
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
                var modName = "Material Setup";
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

        [HttpGet]
        public JsonResult GetGroupIDConnection()
        {
            List<string> result = GroupEquipmentModels.GetGroupIDConnection();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetMaterial(string Equipment, string UserID)
        {
            var result = HttpHandler.GetMaterial(Equipment, UserID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetMaterialInfo(string MaterialLot, string UserID)
        {
            var result = HttpHandler.GetMaterialInfo(MaterialLot, UserID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUTC()
        {
            var result = HttpHandler.GetUTC();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SubmitSetup(string Equipment, List<string> lstMaterialLot, List<string> lstDesc, List<string> lstMaterialPart, List<string> lstRev, List<string> lstROR, List<string> lstQty, List<string> lstQty2, List<string> lstThawingTimestamp, List<string> lstWithdrawalTimestamp, List<string> lstExpiryTimestamp, string Comment, string UserID)
        {
            string result = HttpHandler.SubmitMaterialSetup(Equipment, lstMaterialLot, lstDesc, lstMaterialPart, lstRev, lstROR, lstQty, lstQty2, lstThawingTimestamp, lstWithdrawalTimestamp, lstExpiryTimestamp, Comment, UserID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}