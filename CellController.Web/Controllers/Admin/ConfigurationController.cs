using CellController.Web.Helpers;
using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers.Admin
{
    public class ConfigurationController : Controller
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
                var modName = "Configuration";
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

                //get the configuration settings
                var signalR = SettingModels.IsSignalR();
                ViewBag.SignalR = signalR;

                var tolerance = SettingModels.GetTolerance();
                ViewBag.Tolerance = tolerance;

                var isOPCTimeout = SettingModels.IsOPCTimeout();
                ViewBag.isOPCTimeout = isOPCTimeout;

                var OPCTimeout = SettingModels.GetOPCTimeout();
                ViewBag.OPCTimeout = OPCTimeout;

                var isScanner = SettingModels.IsScanner();
                ViewBag.isScanner = isScanner;

                var isHostEnabled = SettingModels.isHostEnabled();
                ViewBag.isHostEnabled = isHostEnabled;

                var isEffectiveDate = SettingModels.isEffectiveDate();
                ViewBag.isEffectiveDate = isEffectiveDate;

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

        //function for checking if the signalr is enabled
        [HttpGet]
        public JsonResult GetSignalR()
        {
            var result = SettingModels.IsSignalR();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the tolerance
        [HttpGet]
        public JsonResult GetTolerance()
        {
            var result = SettingModels.GetTolerance();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the opc timeout
        [HttpGet]
        public JsonResult GetOPCTimeoout()
        {
            var result = SettingModels.GetOPCTimeout();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the config host enabled
        [HttpGet]
        public JsonResult GetIsHostEnabled()
        {
            var result = SettingModels.isHostEnabled();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the opc timeout is enabled
        [HttpGet]
        public JsonResult GetIsOPCTimeoout()
        {
            var result = SettingModels.IsOPCTimeout();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the scanner is enabled
        [HttpGet]
        public JsonResult GetIsScanner()
        {
            var result = SettingModels.IsScanner();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the default password
        [HttpGet]
        public JsonResult GetDefaultPassword()
        {
            var result = SettingModels.DefaultPassword();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the default password
        [HttpGet]
        public JsonResult GetNoMarkTemplate()
        {
            var result = SettingModels.NoMarkTemplate();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting the opc timeout
        [HttpGet]
        public JsonResult GetIsEffectiveDate()
        {
            var result = SettingModels.isEffectiveDate();

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for saving config
        [HttpPost]
        public JsonResult SaveConfig(bool isSignalR, double tolerance, bool isOPCTimeout, double OPCTimeout, string DefaultPassword, string NoMarkTemplate, bool isScanner, bool isHost, bool isEffectiveDate)
        {
            var result = SettingModels.SaveConfig(isSignalR, tolerance, isOPCTimeout, OPCTimeout, DefaultPassword, NoMarkTemplate, isScanner, isHost, isEffectiveDate);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for validating equipment type
        [HttpGet]
        public JsonResult CheckEquipmentType(string type)
        {
            var result = EquipTypeModels.CheckType(type);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for validating equipment type (for update)
        [HttpGet]
        public JsonResult CheckEquipmentTypeForUpdate(string type, int ID)
        {
            var result = EquipTypeModels.CheckTypeForUpdate(type, ID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for adding equipment type
        [HttpPost]
        public JsonResult AddEquipmentType(string type, bool isEnabled, bool isSECSGEM)
        {
            var result = EquipTypeModels.AddEquipmentType(type, isEnabled, isSECSGEM);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for updating equipment type
        [HttpPost]
        public JsonResult UpdateEquipmentType(string id, string type, bool isEnabled, bool isSECSGEM)
        {
            var result = EquipTypeModels.UpdateEquipmentType(id, type, isEnabled, isSECSGEM);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for deleting equipment type
        [HttpPost]
        public JsonResult DeleteEquipmentType(string ID)
        {
            var result = EquipTypeModels.DeleteEquipmentType(ID);

            DataTable dt = new DataTable();

            if (result == true)
            {
                dt = EquipmentModels.GetEquipmentByType(ID);

                int count = 0;
                try
                {
                    count = dt.Rows.Count;
                }
                catch
                {
                    count = 0;
                }

                if (count > 0)
                {
                    result = EquipmentModels.DeleteEquipmentByType(ID);
                }

                bool temp = result;
                if (result == true)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        int EquipID = Convert.ToInt32(dr["ID"].ToString());
                        result = UserEquipmentModels.DeleteUserEquipmentByBatch(EquipID.ToString());
                        if (result == true)
                        {
                            temp = true;
                        }
                    }
                }

                result = temp;
            }

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting equipment types to be displayed on the gridview
        [HttpGet]
        public JsonResult GetEquipmentType()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = EquipTypeModels.GetCols();

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
                int totalRows = EquipTypeModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

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
                    transactions = EquipTypeModels.GetData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = EquipTypeModels.GetData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
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
                result_config.Add("TotalRows", EquipTypeModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }
            string temp = Request["searchStr"];
            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }

    }
}