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
    public class EquipmentGroupController : Controller
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
                var modName = "Group Settings";
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

        //function for getting equipments to be displayed on the gridview
        [HttpGet]
        public JsonResult GetEquipmentGroupList()
        {
            //create a dictionary that will contain the column + datafied config for the grid
            Dictionary<string, object> result_config = new Dictionary<string, object>();

            //get columns
            Dictionary<string, string> columns = EquipmentGroupModels.GetCols();

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
                int totalRows = EquipmentGroupModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));

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
                    transactions = EquipmentGroupModels.GetData(0, 0, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
                }
                else
                {
                    transactions = EquipmentGroupModels.GetData(start, pagesize, where, sorting, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString()));
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
                result_config.Add("TotalRows", EquipmentGroupModels.GetCount(where, ((Request["searchStr"] == null) ? "" : Request["searchStr"].ToString())));
            }
            string temp = Request["searchStr"];
            response.Add("success", true);
            response.Add("error", false);
            response.Add("message", result_config);

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //function for validating equipment group
        [HttpGet]
        public JsonResult CheckEquipmentGroup(string name)
        {
            var result = EquipmentGroupModels.CheckGroup(name);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for validating equipment group (for update)
        [HttpGet]
        public JsonResult CheckEquipmentGroupForUpdate(string name, int ID)
        {
            var result = EquipmentGroupModels.CheckGroupForUpdate(name, ID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for adding equipment group
        [HttpPost]
        public JsonResult AddMachineGroup(string name, bool IsEnabled)
        {
            var result = EquipmentGroupModels.AddMachineGroup(name, IsEnabled);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for updating equipment group
        [HttpPost]
        public JsonResult UpdateMachineGroup(string id, string name, bool isEnabled)
        {
            var result = EquipmentGroupModels.UpdateMachineGroup(id, name, isEnabled);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for deleting equipment group
        [HttpPost]
        public JsonResult DeleteMachineGroup(string ID)
        {
            var result = EquipmentGroupModels.DeleteMachineGroup(ID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }
        

        //function for validating if equipment is in group
        [HttpGet]
        public JsonResult CheckIfMachineExist(int groupID, int equipID)
        {
            var result = EquipmentGroupModels.isMachineInGroup(groupID, equipID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for deleting equipment group relation
        [HttpPost]
        public JsonResult DeleteMachineGroupRelation(string ID)
        {
            var result = EquipmentGroupModels.DeleteMachineGroupRelation(ID);

            return Json(result.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for adding equipment group relation
        [HttpPost]
        public JsonResult AddMachineGroupRelation(int groupID, string[] arrEquip)
        {
            var result = false;
            var overallResult = false;

            foreach (var equip in arrEquip)
            {
                result = EquipmentGroupModels.AddMachineGroupRelation(groupID, Convert.ToInt32(equip));
                if (result == true)
                {
                    overallResult = true;
                }
            }
            
            return Json(overallResult.ToString(), JsonRequestBehavior.AllowGet);
        }

        //function for getting assigned machine
        [HttpGet]
        public JsonResult GetAssignedMachine(int groupID)
        {
            var result = EquipmentGroupModels.GetAssignedMachine(groupID);

            string json = "";
            try
            {
                //serialize the object so that javascript can read the data
                json = JsonConvert.SerializeObject(result);
            }
            catch
            {
                json = "";
            }

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        //function for getting all equipments from table
        [HttpGet]
        public JsonResult GetAllEquipmentWithGroup()
        {
            //get the result using ignition web service
            var equipments = HttpHandler.GetAllEquipmentsWithGroup();

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

    }
}