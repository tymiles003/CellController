using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.ViewModels;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CellController.Web.Controllers
{
    public class TrackOutController : Controller
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
                var modName = "Track Out";
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
        public JsonResult GetTrackOutEquipment(string LotNo, string UserID, string Location)
        {
            TrackEquipment equipment = new TrackEquipment();
            equipment = HttpHandler.GetTrackOutEquipment(LotNo, UserID, Location);

            return Json(equipment, JsonRequestBehavior.AllowGet);
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

        //function for getting loss reason from camstar
        [HttpGet]
        public JsonResult GetAllLossReason(string lotNo, string equipment, string processType, string UserID)
        {
            List<LossReasonObject> lossReason = new List<LossReasonObject>();
            lossReason = HttpHandler.GetLossReason(lotNo, equipment, processType, UserID);
            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(lossReason);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for executing first insert of lot to camstar
        [HttpPost]
        public string FirstInsert(string userID, string lotNo, string location)
        {
            var result = HttpHandler.FirstInsert(userID, lotNo, location);
            return result;
        }

        //function for executing reset rejects of lot to camstar
        [HttpPost]
        public string ResetRejects(string userID, string lotNo, string equipment, string ProcessType)
        {
            var result = HttpHandler.ResetRejects(userID, lotNo, equipment, ProcessType);
            return result;
        }

        //function for sending rejects of lot to camstar
        [HttpPost]
        public string LotRejects(string userID, string lotNo, string equipment, List<string> lstLossReason, List<string> lstLossQuantity, List<string> lstCategory, List<string> lstCause, List<string> lstComment)
        {
            var result = HttpHandler.LotRejects(userID, lotNo, equipment, lstLossReason, lstLossQuantity, lstCategory, lstCause, lstComment);
            return result;
        }

        //function for executing track out of lot to camstar
        [HttpPost]
        public string TrackOut(string userID, string lotNo, string equipment, int TrackOutQty, int TotalScrapQty, string comment, string location, string remainInEquipment, string remainInEquipmentIfPossible)
        {
            var result = HttpHandler.trackOut(userID, lotNo, equipment, TrackOutQty, TotalScrapQty, comment, location, remainInEquipment, remainInEquipmentIfPossible);
            return result;
        }

        //function for getting access rights to be used to display the control
        [HttpGet]
        public JsonResult getUserRights(string username)
        {
            List<string> result = new List<string>();

            result = ModuleModels.getUserRights(username);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for getting reel object
        [HttpGet]
        public JsonResult getReel(string EquipID)
        {
            var result = ReelModel.SelectReel(EquipID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}