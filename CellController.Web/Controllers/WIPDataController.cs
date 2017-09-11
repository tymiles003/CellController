using CellController.Web.Helpers;
using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CellController.Web.Controllers
{
    public class WIPDataController : Controller
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
                var modName = "Data Collection";
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

        //function for getting lot info from camstar
        [HttpGet]
        public JsonResult GetLotInfo(string LotNo)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();

            var lot = HttpHandler.GetLotInfo(LotNo);

            response.Add("Owner", lot.Owner);
            response.Add("ProductName", lot.ProductName);
            response.Add("WorkflowRev", lot.WorkflowRev);
            response.Add("PriorityCode", lot.PriorityCode);
            response.Add("WIPType", lot.WIPType);
            response.Add("Step", lot.Step);
            response.Add("WIPStatus", lot.WIPStatus);
            response.Add("ProcessSpec", lot.ProcessSpec);
            response.Add("MaxStandbyQty", lot.MaxStandbyQty);
            response.Add("FactoryName", lot.FactoryName);
            response.Add("ProcessSpecObjectType", lot.ProcessSpecObjectType);
            response.Add("ReworkReason", lot.ReworkReason);
            response.Add("ContainerName", lot.ContainerName);
            response.Add("Qty", lot.Qty);
            response.Add("ProductRev", lot.ProductRev);
            response.Add("MainQty", lot.MainQty);
            response.Add("MaxQtyToProcess", lot.MaxQtyToProcess);
            response.Add("ProductLine", lot.ProductLine);
            response.Add("ProcessSpecObjectCategory", lot.ProcessSpecObjectCategory);
            response.Add("ProcessSpecRev", lot.ProcessSpecRev);
            response.Add("Workflow", lot.Workflow);
            response.Add("MaxInProcessQty", lot.MaxInProcessQty);
            response.Add("WIPYieldResult", lot.WIPYieldResult);
            response.Add("HoldReason", lot.HoldReason);
            response.Add("MaxProcessedQty", lot.MaxProcessedQty);
            response.Add("StartReason", lot.StartReason);
            response.Add("MfgOrderName", lot.MfgOrderName);
            response.Add("Qty2", lot.Qty2);
            response.Add("LotStatus", lot.LotStatus);
            response.Add("Location", lot.Location);
            response.Add("NextStep", lot.NextStep);


            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for executing first insert of lot to camstar
        [HttpPost]
        public string FirstInsert(string userID, string lotNo, string location)
        {
            var result = HttpHandler.FirstInsert(userID, lotNo, location);
            return result;
        }

        //function for getting wip data columns from camstar
        [HttpGet]
        public JsonResult GetWIPColumns(string LotNo, string Equipment, string ServiceType, string UserID)
        {
            var Columns = HttpHandler.GetWIPColumns(LotNo, Equipment, ServiceType, UserID);

            JavaScriptSerializer ser = new JavaScriptSerializer();
            string json = ser.Serialize(Columns);

            return Json(json, JsonRequestBehavior.AllowGet);
        }
        
        //function for executing wip data
        [HttpPost]
        public JsonResult WIPData(string LotNo, string Equipment, string ServiceType, List<string> lstField, List<string> lstValue, string UserID)
        {
            var result = HttpHandler.WIPData(LotNo, Equipment, ServiceType, lstField, lstValue, UserID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}