using System.Web.Mvc;
using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.ViewModels;
using System.Collections.Generic;
using System;
using CellController.Web.LMCC_DCC;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace CellController.Web.Controllers
{
    public class EngineerController : Controller
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
                var modName = "Engineering Mode";
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

        //function for getting lot information from camstar
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

        //function to get the location of the lot from camstar
        [HttpGet]
        public JsonResult GetLotLocation(string LotNo)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();

            var lot = HttpHandler.GetLotInfo(LotNo);

            response.Add("Location", lot.ProcessSpecObjectCategory);


            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //get tolerance quantity from the database
        [HttpGet]
        public int GetTolerance(int quantity)
        {
            double tolerance = HttpHandler.tolerance;
            double percent = tolerance / 100;

            double value = quantity * percent;

            //int retval = Convert.ToInt32(Math.Round(value, MidpointRounding.AwayFromZero));
            int retval = Convert.ToInt32(Math.Ceiling(value));

            return retval;
        }

        //get tolerance percent from the database
        [HttpGet]
        public double GetTolerancePercent()
        {
            double tolerance = HttpHandler.tolerance;

            return tolerance;
        }

        //function for executing first insert of lot to camstar
        [HttpPost]
        public string FirstInsert(string userID, string lotNo, string location)
        {
            var result = HttpHandler.FirstInsert(userID, lotNo, location);
            return result;
        }

        //function for getting data from WEB UI (templates)
        [HttpGet]
        public JsonResult GetDataFromDCC(string productName)
        {
            var result = LMCC.getData(productName);

            Dictionary<string, object> response = new Dictionary<string, object>();

            try
            {
                if (result.Rows.Count > 0)
                {
                    foreach (DataRow dr in result.Rows)
                    {
                        string partNo = dr["PartNo"].ToString();
                        string casName = dr["CASName"].ToString();
                        string casLink = dr["CASLink"].ToString();
                        string specs = dr["Specs"].ToString();
                        string packageType = dr["PackageType"].ToString();
                        string markingInstructionID = dr["MarkingInstructionID"].ToString();
                        string pkgTemp = dr["PkgTemp"].ToString();
                        string vlmName = dr["VLMName"].ToString();
                        response.Add("PartNo", partNo);
                        response.Add("CASName", casName);
                        response.Add("CASLink", casLink);
                        response.Add("Specs", specs);
                        response.Add("PackageType", packageType);
                        response.Add("MarkingInstructionID", markingInstructionID);
                        response.Add("PkgTemp", pkgTemp);
                        response.Add("VLMName", vlmName);
                        response.Add("Error", false);
                    }
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

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //get the line number
        [HttpGet]
        public JsonResult GetLineNumber(string MarkingInstructionID)
        {
            var result = LMCC.getNumLine(MarkingInstructionID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get the equipment type by equipment ID (2 tables joined)
        [HttpGet]
        public JsonResult GetEquipmentTypeJoin(int ID)
        {
            var result = EquipmentModels.GetEquipmentTypeJoin(ID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //get line text of template
        [HttpGet]
        public JsonResult GetLineText(string MarkingInstructionID, string PartNum, string LotNo, string PkgTemp)
        {
            var result = LMCC.getLineText(MarkingInstructionID, PartNum, LotNo, PkgTemp);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //execute trackin to camstar
        [HttpPost]
        public string TrackIn(string UserID, string LotNo, string Equipment, int TrackInQty, string Comment, string Location)
        {
            var result = HttpHandler.trackIn(UserID, LotNo, Equipment, TrackInQty, Comment, Location);
            return result;
        }

        //get line text of template
        [HttpGet]
        public JsonResult IsEquipmentProcessing(string equipment)
        {
            var result = EquipmentModels.isProcessing(equipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //send the command to ignition OPC UA module
        [HttpPost]
        public JsonResult OPCSendCommand(string Equipment, string Command, string Type)
        {
            Dictionary<string, object> response = new Dictionary<string, object>();
            string port = EquipmentModels.GetPort(Equipment);

            //for forcing values for testing purposes
            //Equipment = "AMPICIMAPPDEV1";
            //port = "6666";

            if (port != "" && port != null)
            {
                if (Type.ToString().ToUpper() == "LASER MARK TEST")
                {
                    Command = "<C>" + Command + "</C>";
                }

                var Duration = Convert.ToInt32(SettingModels.GetOPCTimeout());
                var isTimer = SettingModels.IsOPCTimeout();

                EquipmentModels.insertTCPNotification(Equipment, Command, "REQUEST");

                var result = HttpHandler.OPCSendCommand(Equipment, port, Command, Duration, isTimer);

                if (result != null)
                {
                    response.Add("Result", result.Result);
                    response.Add("Error", Convert.ToBoolean(result.Error));
                }
            }

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for getting access rights to be used to display the control
        [HttpGet]
        public JsonResult getUserRights(string username)
        {
            List<string> result = new List<string>();

            result = ModuleModels.getUserRights(username);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for getting access rights to be used to display the control
        [HttpGet]
        public JsonResult getTrackInQty(string equipment)
        {
            var res = EquipmentModels.getTrackInQTY(equipment);

            return Json(res, JsonRequestBehavior.AllowGet);
        }

        //function for getting access rights to be used to display the control
        [HttpGet]
        public JsonResult getProcessedQTY(string equipment)
        {
            var res = EquipmentModels.getProcessedQTY(equipment);

            return Json(res, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult markAsBrand(string equipment, string isBrand)
        {
            var res = EquipmentModels.markAsBrand(equipment, isBrand);

            return Json(res, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult isBrand(string equipment)
        {
            var res = EquipmentModels.isBrand(equipment);

            return Json(res, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getChildEquipment(string equipment)
        {
            var res = EquipmentModels.getChildEquipments(equipment);

            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}

