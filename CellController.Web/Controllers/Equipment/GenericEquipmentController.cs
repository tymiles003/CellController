using CellController.Web.Helpers;
using CellController.Web.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers.Equipment
{
    public class GenericEquipmentController : Controller
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
                var module = ModuleModels.getModule("Equipment");

                ViewBag.Title = "Cell Controller";
                ViewBag.PageHeader = "Maintenance / Equipment";
                ViewBag.Breadcrumbs = "Equipment";

                bool check = false;

                if (module != null)
                {
                    //generate the menus
                    ViewBag.Menu = custom_helper.GenerateMenu(module.Id, module.ParentId, userType);
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

        //function for getting all equipments from table
        [HttpGet]
        public JsonResult GetAllEquipment()
        {
            //get the result using ignition web service
            var equipments = HttpHandler.GetAllEquipments();

            string json = "";
            try
            {
                //serialize the object so that javascript can read the data
                json = JsonConvert.SerializeObject(equipments);
            }
            catch
            {
                json = "";
            }

            //return the json data
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for getting user equipment to be displayed on the gridview
        [HttpGet]
        public JsonResult GetUserEquipmentList()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = UserEquipmentModels.GetCols();

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
                int totalRows = UserEquipmentModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

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
                    transactions = UserEquipmentModels.GetData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = UserEquipmentModels.GetData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
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
                result_config.Add("TotalRows", UserEquipmentModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }
            string temp = Request["searchStr"];
            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for updating enrolled equipment
        [HttpPost]
        public JsonResult UpdateEnrollment(string ID, string username, string equipment, string hostID)
        {
            //get the result using ignition web service
            var result = HttpHandler.UpdateUserEquipment(ID, username, equipment, hostID);

            //return the json data
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for enrolling equipment
        [HttpPost]
        public JsonResult AddEnrollment(string username, string equipment, string hostID)
        {
            //get the result using ignition web service
            var result = HttpHandler.AddUserEquipment(username, equipment, hostID);

            //return the json data
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for deleting enrolled equipment
        [HttpPost]
        public JsonResult DeleteEnrollment(string ID)
        {
            //get the result using ignition web service
            var result = HttpHandler.DeleteUserEquipment(ID);

            //return the json data
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for validating if the equipment exist in the table
        [HttpGet]
        public JsonResult ValidateEntry(string username, string equipment)
        {
            int count = 0;

            //get the result
            count = UserEquipmentModels.CheckEntry(username, equipment);

            return Json(count, JsonRequestBehavior.AllowGet);
        }

        //function for validating if the equipment exist in the table (for update)
        [HttpGet]
        public JsonResult ValidateEntryForUpdate(string username, string equipment, int ID)
        {
            int count = 0;

            //get the result
            count = UserEquipmentModels.CheckEntryForUpdate(username, equipment, ID);

            return Json(count, JsonRequestBehavior.AllowGet);
        }

        //function for validating a user
        [HttpGet]
        public JsonResult CheckUser(string username)
        {
            //get the result
            var result = UserModels.UserExist(username);

            //return the result
            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting all users
        [HttpGet]
        public JsonResult GetAllUser()
        {
            //get the result using ignition web service
            var users = HttpHandler.GetAllUsers();

            string json = "";
            try
            {
                //serialize the object so that javascript can read the data
                json = JsonConvert.SerializeObject(users);
            }
            catch
            {
                json = "";
            }

            //return the json data
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for getting equipments to be displayed on the gridview
        [HttpGet]
        public JsonResult GetEquipmentList()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = EquipmentModels.GetCols();

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
                int totalRows = EquipmentModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

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
                    transactions = EquipmentModels.GetData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = EquipmentModels.GetData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
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
                result_config.Add("TotalRows", EquipmentModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }
            string temp = Request["searchStr"];
            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for getting equipment types
        [HttpGet]
        public JsonResult GetEquipmentType()
        {
            var types = EquipmentModels.GetEquipmentType();

            return Json(types, JsonRequestBehavior.AllowGet);
        }

        //function for checking if the equipment exists
        [HttpGet]
        public JsonResult CheckEquipment(string equipment)
        {
            var result = EquipmentModels.EquipmentExist(equipment);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for checking if the equipment exists (for update)
        [HttpGet]
        public JsonResult CheckEquipmentForUpdate(string equipment, int ID)
        {
            var result = EquipmentModels.EquipmentExistForUpdate(equipment, ID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for adding equipment to table
        [HttpPost]
        public JsonResult AddEquipment(string equipmentID, string model, string serialNumber, string ip, string port, string deviceID, string type, string hostID)
        {
            var result = HttpHandler.AddEquipment(equipmentID, model, serialNumber, ip, port, deviceID, type, hostID);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for updating equipment from table
        [HttpPost]
        public JsonResult UpdateEquipment(string equipmentID, string model, string serialNumber, string ip, string port, string deviceID, string type, string hostID, string ID)
        {
            var result = HttpHandler.UpdateEquipment(equipmentID, model, serialNumber, ip, port, deviceID, type, hostID, ID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for deleting equipment from table
        [HttpPost]
        public JsonResult DeleteEquipment(string equipmentID)
        {
            var result = HttpHandler.DeleteEquipment(equipmentID);

            if (result == "True")
            {
                var temp_result = UserEquipmentModels.DeleteUserEquipmentByBatch(equipmentID);
                result = temp_result.ToString();
            }
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}