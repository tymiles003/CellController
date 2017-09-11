using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.SECSGEM;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers
{
    public class SECSGEMController : Controller
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static bool EnablePanasonic = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnablePanasonic"]);

        //Establish Communications Request
        [HttpGet]
        public JsonResult S1F13(string Equipment)
        {
            var result = HttpHandler.S1F13(Equipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Request ON-LINE
        [HttpGet]
        public JsonResult S1F17(string Equipment)
        {
            var result = HttpHandler.S1F17(Equipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Delete
        [HttpGet]
        public JsonResult S7F17(string Equipment)
        {
            var result = HttpHandler.S7F17(Equipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Load Grant
        [HttpGet]
        public JsonResult S7F1(string Equipment, string LotNo)
        {
            var result = HttpHandler.S7F1(Equipment, LotNo);
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Load Grant Custom (File Browsed)
        [HttpGet]
        public JsonResult S7F1_Custom(string Equipment, int RecipeSize, string PPID)
        {
            var result = HttpHandler.S7F1_Custom(Equipment, RecipeSize, PPID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Send
        [HttpPost]
        public JsonResult S7F3(string Equipment, string LotNo)
        {
            var result = HttpHandler.S7F3(Equipment, LotNo);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Send Custom (File Browsed)
        [HttpPost]
        public JsonResult S7F3_Custom(string Equipment, string PPID, string PPBODY)
        {
            var result = HttpHandler.S7F3_Custom(Equipment, PPID, PPBODY);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Process Program Request
        [HttpPost]
        public JsonResult S7F5(string Equipment, string PPID)
        {
            var result = HttpHandler.S7F5(Equipment, PPID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //PPSELECT
        [HttpGet]
        public JsonResult PPSELECT(List<string> lstEquipment, string LotNo)
        {
            var result = HttpHandler.PPSELECT(lstEquipment, LotNo);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //PPSELECT Custom (File Browsed)
        [HttpGet]
        public JsonResult PPSELECT_Custom(List<string> lstEquipment, string PPID)
        {
            var result = HttpHandler.PPSELECT_Custom(lstEquipment, PPID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //START
        [HttpGet]
        public JsonResult START(List<string> lstEquipment)
        {
            var result = HttpHandler.START(lstEquipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //Trigger Report
        [HttpPost]
        public JsonResult TriggerReports(string Equipment)
        {
            var result = SetupReport(Equipment);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //function for Report Setup
        public static List<SECSGEMDefaultReplyObject> SetupReport(string Equipment)
        {
            try
            {
                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();
                SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;

                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childtype = EquipmentModels.GetEquipmentTypeJoin(ChildID);

                        if (childtype.ToUpper() == "DEK PRINTER")
                        {
                            //Product Data modified (CEID 31346)
                            //Equipment constant change (CEID 31440)
                            //Configuration change (CEID 31287)
                            //Configuration Parameter modified(CEID 31345)
                            //Adjust Parameter modified (CEID 31347)

                            //for processed quantity
                            temp_obj = HttpHandler.DisableCollection(ChildEquipment, 31277); //31277 Board printed
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.DeleteReport(ChildEquipment, 301); //301 RPTID = User Defined ID
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.UnlinkCollection(ChildEquipment, 31277);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.AddToReport_Single(ChildEquipment, 301, 1020); //SVID = 1020 (batch_count)
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.LinkCollection(ChildEquipment, 31277, 301);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.EnableCollection(ChildEquipment, 31277);
                            obj.Add(temp_obj);

                            //for multi vid sample
                            //List<int> lstVID = new List<int>();
                            //lstVID.Add(456);
                            //lstVID.Add(789);

                            //temp_obj = HttpHandler.AddToReport_Multi(ChildEquipment, 301, lstVID);
                            //obj.Add(temp_obj);
                        }
                        else if (childtype.ToUpper() == "HELLER OVEN")
                        {
                            //for lane 1
                            temp_obj = HttpHandler.DisableCollection(ChildEquipment, 1080); //1080 HellerBoardExitLane1
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.DeleteReport(ChildEquipment, 401); //401 RPTID = User Defined ID
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.UnlinkCollection(ChildEquipment, 1080);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.AddToReport_Single(ChildEquipment, 401, 13049); //SVID = 13049 (HellerPVChannel49) Boards processed Lane1
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.LinkCollection(ChildEquipment, 1080, 401);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.EnableCollection(ChildEquipment, 1080);
                            obj.Add(temp_obj);

                            //for lane 2
                            temp_obj = HttpHandler.DisableCollection(ChildEquipment, 1081); //1080 HellerBoardExitLane2
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.DeleteReport(ChildEquipment, 402); //402 RPTID = User Defined ID
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.UnlinkCollection(ChildEquipment, 1081);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.AddToReport_Single(ChildEquipment, 402, 13050); //SVID = 13050 (HellerPVChannel50) Boards processed Lane2
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.LinkCollection(ChildEquipment, 1081, 402);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.EnableCollection(ChildEquipment, 1081);
                            obj.Add(temp_obj);
                        }
                        else if (childtype.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            if (EnablePanasonic == true)
                            {
                                temp_obj = HttpHandler.DisableCollection(ChildEquipment, 16016); //16016 (Product1BoardEnd)??
                                obj.Add(temp_obj);

                                temp_obj = HttpHandler.DeleteReport(ChildEquipment, 501); //501 RPTID = User Defined ID
                                obj.Add(temp_obj);

                                temp_obj = HttpHandler.UnlinkCollection(ChildEquipment, 16016);
                                obj.Add(temp_obj);

                                temp_obj = HttpHandler.AddToReport_Single(ChildEquipment, 501, 7003); //SVID = 7003 (Board)
                                obj.Add(temp_obj);

                                temp_obj = HttpHandler.LinkCollection(ChildEquipment, 16016, 501);
                                obj.Add(temp_obj);

                                temp_obj = HttpHandler.EnableCollection(ChildEquipment, 16016);
                                obj.Add(temp_obj);
                            }
                            else
                            {
                                //Override
                                //Disable Collection 
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F37_DISABLE_COLLECTION";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);

                                //Delete Report
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F33_DELETE_REPORT";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);

                                //Unlink Collection
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F35_UNLINK_COLLECTION";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);

                                //Add Report
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F33_ADD_REPORT";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);

                                //Link Collection
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F35_LINK_COLLECTION";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);

                                //Enable Collection
                                temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = ChildEquipment;
                                temp_obj.EquipmentType = childtype;
                                temp_obj.StreamFunction = "S2F37_ENABLE_COLLECTION";
                                temp_obj.Value = 0;
                                obj.Add(temp_obj);
                            }
                        }
                    }
                }
                else
                {
                    if (type.ToUpper() == "DEK PRINTER")
                    {
                        temp_obj = HttpHandler.DisableCollection(Equipment, 31277); //31277 Board printed
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.DeleteReport(Equipment, 301); //301 RPTID = User Defined ID
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.UnlinkCollection(Equipment, 31277);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.AddToReport_Single(Equipment, 301, 1020); //SVID = 1020 (batch_count)
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.LinkCollection(Equipment, 31277, 301);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.EnableCollection(Equipment, 31277);
                        obj.Add(temp_obj);


                        //Product Data modified (CEID 31346)
                        //Equipment constant change (CEID 31440)
                        //Configuration change (CEID 31287)
                        //Configuration Parameter modified(CEID 31345)
                        //Adjust Parameter modified (CEID 31347)

                        //testing ceids

                        //temp_obj = HttpHandler.DisableCollection(Equipment, 31346); 
                        //obj.Add(temp_obj);

                        //temp_obj = HttpHandler.DeleteReport(Equipment, 302); 
                        //obj.Add(temp_obj);

                        //temp_obj = HttpHandler.UnlinkCollection(Equipment, 31346);
                        //obj.Add(temp_obj);

                        ////temp_obj = HttpHandler.AddToReport_Single(Equipment, 302, 2009); //SVID = 2009 (rear_print_pressure)
                        ////obj.Add(temp_obj);

                        //List<int> lstVID = new List<int>();
                        //lstVID.Add(2009); //SVID = 2009 (rear_print_pressure) 
                        //lstVID.Add(2008); //SVID = 2008 (front_print_pressure)

                        //temp_obj = HttpHandler.AddToReport_Multi(Equipment, 302, lstVID); 
                        //obj.Add(temp_obj);

                        //temp_obj = HttpHandler.LinkCollection(Equipment, 31346, 302);
                        //obj.Add(temp_obj);

                        //temp_obj = HttpHandler.EnableCollection(Equipment, 31346);
                        //obj.Add(temp_obj);

                        //end of testing ceid
                    }
                    else if (type.ToUpper() == "HELLER OVEN")
                    {
                        //for lane 1
                        temp_obj = HttpHandler.DisableCollection(Equipment, 1080); //1080 HellerBoardExitLane1
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.DeleteReport(Equipment, 401); //401 RPTID = User Defined ID
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.UnlinkCollection(Equipment, 1080);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.AddToReport_Single(Equipment, 401, 13049); //SVID = 13049 (HellerPVChannel49) Boards processed Lane1
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.LinkCollection(Equipment, 1080, 401);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.EnableCollection(Equipment, 1080);
                        obj.Add(temp_obj);

                        //for lane 2
                        temp_obj = HttpHandler.DisableCollection(Equipment, 1081); //1080 HellerBoardExitLane2
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.DeleteReport(Equipment, 402); //402 RPTID = User Defined ID
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.UnlinkCollection(Equipment, 1081);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.AddToReport_Single(Equipment, 402, 13050); //SVID = 13050 (HellerPVChannel50) Boards processed Lane2
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.LinkCollection(Equipment, 1081, 402);
                        obj.Add(temp_obj);

                        temp_obj = HttpHandler.EnableCollection(Equipment, 1081);
                        obj.Add(temp_obj);
                    }
                    else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                    {
                        if(EnablePanasonic == true)
                        {
                            temp_obj = HttpHandler.DisableCollection(Equipment, 16016); //16016 (Product1BoardEnd)??
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.DeleteReport(Equipment, 501); //501 RPTID = User Defined ID
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.UnlinkCollection(Equipment, 16016);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.AddToReport_Single(Equipment, 501, 7003); //SVID = 7003 (Board)
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.LinkCollection(Equipment, 16016, 501);
                            obj.Add(temp_obj);

                            temp_obj = HttpHandler.EnableCollection(Equipment, 16016);
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            //Override
                            //Disable Collection 
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F37_DISABLE_COLLECTION";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);

                            //Delete Report
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F33_DELETE_REPORT";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);

                            //Unlink Collection
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F35_UNLINK_COLLECTION";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);

                            //Add Report
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F33_ADD_REPORT";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);

                            //Link Collection
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F35_LINK_COLLECTION";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);

                            //Enable Collection
                            temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = Equipment;
                            temp_obj.EquipmentType = type;
                            temp_obj.StreamFunction = "S2F37_ENABLE_COLLECTION";
                            temp_obj.Value = 0;
                            obj.Add(temp_obj);
                        }
                    }
                }

                //if any machine fail its transaction dont let continue
                if (obj.Contains(null))
                {
                    return null;
                }
                else
                {
                    if (obj == null)
                    {
                        return null;
                    }
                    else
                    {
                        if (obj.Count == 0)
                        {
                            return null;
                        }
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }
    }
}