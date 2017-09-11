using CellController.Web.Models;
using CellController.Web.RMS;
using CellController.Web.SECSGEM;
using CellController.Web.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;

namespace CellController.Web.Helpers
{
    public class HttpHandler
    {
        //this class will be used to handle Camstar/Ignition Web Services

        //Get the configurations
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string WebServiceUrl = ConfigurationManager.AppSettings[env + "_" + "IgnitionServer"];

        //get settings from db
        public static bool isSignalR = SettingModels.IsSignalR();
        public static double tolerance = SettingModels.GetTolerance();
        public static Dictionary<int, EquipmentType> isEquipmentEnabled = InitMachine();
        public static bool EnablePanasonic = Convert.ToBoolean(ConfigurationManager.AppSettings[env + "_" + "EnablePanasonic"]);

        //function for sending S1F13
        public static List<SECSGEMDefaultReplyObject> S1F13(string Equipment)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;
                        URL = WebServiceUrl + "secsgem/S1F13_EstablishCommunicationsRequest?Equipment=" + ChildEquipment;
                        URL = string.Format(URL);

                        //execute the service and handle the result
                        result = webclient.DownloadString(URL);
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        JArray a = JArray.Parse(body);
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                string name = p.Name;
                                string value = (string)p.Value;

                                if (name == "value")
                                {
                                    int Response = Convert.ToInt32(value);
                                    SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                    temp_obj.Equipment = ChildEquipment;
                                    temp_obj.Value = Response;
                                    int temp_id = EquipmentModels.GetEquipmentID(ChildEquipment);
                                    string temp_type = EquipmentModels.GetEquipmentTypeJoin(temp_id);
                                    temp_obj.EquipmentType = temp_type;
                                    temp_obj.StreamFunction = "S1F13";
                                    obj.Add(temp_obj);
                                }
                            }
                        }
                    }
                }
                else
                {
                    URL = WebServiceUrl + "secsgem/S1F13_EstablishCommunicationsRequest?Equipment=" + Equipment;
                    URL = string.Format(URL);

                    result = webclient.DownloadString(URL);

                    var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                    string header = dict["header"].ToString();
                    string body = dict["body"].ToString();

                    JArray a = JArray.Parse(body);
                    foreach (JObject o in a.Children<JObject>())
                    {
                        foreach (JProperty p in o.Properties())
                        {
                            string name = p.Name;
                            string value = (string)p.Value;

                            if (name == "value")
                            {
                                int Response = Convert.ToInt32(value);
                                SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = Equipment;
                                temp_obj.Value = Response;
                                temp_obj.EquipmentType = type;
                                temp_obj.StreamFunction = "S1F13";
                                obj.Add(temp_obj);
                            }
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

        //function for sending S1F17
        public static List<SECSGEMDefaultReplyObject> S1F17(string Equipment)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;
                        URL = WebServiceUrl + "secsgem/S1F17_RequestONLINE?Equipment=" + ChildEquipment;
                        URL = string.Format(URL);

                        //execute the service and handle the result
                        result = webclient.DownloadString(URL);
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = ChildEquipment;
                        temp_obj.Value = Response;
                        int temp_id = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string temp_type = EquipmentModels.GetEquipmentTypeJoin(temp_id);
                        temp_obj.EquipmentType = temp_type;
                        temp_obj.StreamFunction = "S1F17";
                        obj.Add(temp_obj);
                    }
                }
                else
                {
                    URL = WebServiceUrl + "secsgem/S1F17_RequestONLINE?Equipment=" + Equipment;
                    URL = string.Format(URL);

                    result = webclient.DownloadString(URL);

                    var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                    string header = dict["header"].ToString();
                    string body = dict["body"].ToString();

                    var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                    string value = dictBody["value"].ToString();

                    int Response = Convert.ToInt32(value);
                    SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                    temp_obj.Equipment = Equipment;
                    temp_obj.Value = Response;
                    temp_obj.EquipmentType = type;
                    temp_obj.StreamFunction = "S1F17";
                    obj.Add(temp_obj);
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F17
        public static List<SECSGEMDefaultReplyObject> S7F17(string Equipment)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();
                string data = "";

                List<string> lstPPID = new List<string>();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;
                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childtype = EquipmentModels.GetEquipmentTypeJoin(ChildID);

                        if (childtype.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                        {
                            //override
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = 0;
                            temp_obj.EquipmentType = childtype;
                            temp_obj.StreamFunction = "S7F17";
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            URL = WebServiceUrl + "secsgem/S7F17_ProcessProgramDelete?Equipment=" + ChildEquipment;
                            URL = string.Format(URL);

                            lstPPID = new List<string>();

                            if (lstPPID == null)
                            {
                                data = "";
                            }
                            else
                            {
                                if (lstPPID.Count > 0)
                                {
                                    data = string.Join(",", lstPPID);
                                    data = "[" + data + "]";
                                }
                                else
                                {
                                    data = "";
                                }
                            }

                            //create the json string
                            string json = "{";
                            json += '"' + "Data" + '"' + ":" + '"' + data + '"';
                            json += "}";

                            webclient.Headers["Content-type"] = "application/json";

                            webclient.Encoding = Encoding.UTF8;

                            //call the web service
                            result = webclient.UploadString(URL, "POST", json);

                            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                            string header = dict["header"].ToString();
                            string body = dict["body"].ToString();

                            var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                            string value = dictBody["value"].ToString();

                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = childtype;
                            temp_obj.StreamFunction = "S7F17";
                            obj.Add(temp_obj);
                        }
                    }
                }
                else
                {
                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        //override
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F17";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        URL = WebServiceUrl + "secsgem/S7F17_ProcessProgramDelete?Equipment=" + Equipment;
                        URL = string.Format(URL);

                        lstPPID = new List<string>();

                        if (lstPPID == null)
                        {
                            data = "";
                        }
                        else
                        {
                            if (lstPPID.Count > 0)
                            {
                                data = string.Join(",", lstPPID);
                                data = "[" + data + "]";
                            }
                            else
                            {
                                data = "";
                            }
                        }

                        string json = "{";
                        json += '"' + "Data" + '"' + ":" + '"' + data + '"';
                        json += "}";

                        webclient.Headers["Content-type"] = "application/json";

                        webclient.Encoding = Encoding.UTF8;

                        result = webclient.UploadString(URL, "POST", json);

                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = Response;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F17";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F1
        public static List<SECSGEMDefaultReplyObject> S7F1(string Equipment, string LotNo)
        {
            try
            {
                var LotInfo = GetLotInfo(LotNo);
                string ProductName = LotInfo.ProductName;

                int RecipeSize = 0;
                string PPID = "";

                var webclient = new WebClient();
                string URL = "";
                string result = "";
                string lengthFormat = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;

                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childType = EquipmentModels.GetEquipmentTypeJoin(ChildID);
                        
                        if(childType.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                        {
                            //override
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = 0;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F1";
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            var RecipeInfo = RecipeClass.getData(ProductName, ChildEquipment, ChildID.ToString());

                            foreach (DataRow dr in RecipeInfo.Rows)
                            {
                                PPID = dr["RecipeName"].ToString();
                                RecipeSize = Convert.ToInt32(dr["RecipeSize"].ToString());
                            }

                            if (childType.ToUpper() == "DEK PRINTER")
                            {
                                lengthFormat = "U4";
                            }
                            else if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH")
                            {
                                //lengthFormat = "U4";
                                lengthFormat = "U8";
                            }
                            else if (childType.ToUpper() == "HELLER OVEN")
                            {
                                lengthFormat = "U4";
                            }

                            URL = WebServiceUrl + "secsgem/S7F1_ProcessProgramLoadInquire?Equipment=" + ChildEquipment + "&PPID=" + PPID + "&RecipeSize=" + RecipeSize.ToString() + "&LengthFormat=" + lengthFormat;
                            URL = string.Format(URL);

                            result = webclient.DownloadString(URL);
                            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                            string header = dict["header"].ToString();
                            string body = dict["body"].ToString();

                            var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                            string value = dictBody["value"].ToString();

                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F1";
                            obj.Add(temp_obj);
                        }
                    }
                }
                else
                {
                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        //override
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F1";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        var RecipeInfo = RecipeClass.getData(ProductName, Equipment, ID.ToString());

                        foreach (DataRow dr in RecipeInfo.Rows)
                        {
                            PPID = dr["RecipeName"].ToString();
                            RecipeSize = Convert.ToInt32(dr["RecipeSize"].ToString());
                        }

                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            lengthFormat = "U4";
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            lengthFormat = "U4";
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            lengthFormat = "U4";
                        }

                        URL = WebServiceUrl + "secsgem/S7F1_ProcessProgramLoadInquire?Equipment=" + Equipment + "&PPID=" + PPID + "&RecipeSize=" + RecipeSize.ToString() + "&LengthFormat=" + lengthFormat;
                        URL = string.Format(URL);

                        result = webclient.DownloadString(URL);
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = Response;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F1";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F1 Custom (File Browsed)
        public static List<SECSGEMDefaultReplyObject> S7F1_Custom(string Equipment, int RecipeSize, string PPID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";
                string lengthFormat = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;

                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childType = EquipmentModels.GetEquipmentTypeJoin(ChildID);

                        if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                        {
                            //override
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = 0;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F1";
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            if (childType.ToUpper() == "DEK PRINTER")
                            {
                                lengthFormat = "U4";
                            }
                            else if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH")
                            {
                                //lengthFormat = "U4";
                                lengthFormat = "U8";
                            }
                            else if (childType.ToUpper() == "HELLER OVEN")
                            {
                                lengthFormat = "U4";
                            }

                            URL = WebServiceUrl + "secsgem/S7F1_ProcessProgramLoadInquire?Equipment=" + ChildEquipment + "&PPID=" + PPID + "&RecipeSize=" + RecipeSize.ToString() + "&LengthFormat=" + lengthFormat;
                            URL = string.Format(URL);

                            result = webclient.DownloadString(URL);
                            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                            string header = dict["header"].ToString();
                            string body = dict["body"].ToString();

                            var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                            string value = dictBody["value"].ToString();

                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F1";
                            obj.Add(temp_obj);
                        }
                    }
                }
                else
                {
                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        //override
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F1";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            lengthFormat = "U4";
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            lengthFormat = "U4";
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            lengthFormat = "U4";
                        }

                        URL = WebServiceUrl + "secsgem/S7F1_ProcessProgramLoadInquire?Equipment=" + Equipment + "&PPID=" + PPID + "&RecipeSize=" + RecipeSize.ToString() + "&LengthFormat=" + lengthFormat;
                        URL = string.Format(URL);

                        result = webclient.DownloadString(URL);
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = Response;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F1";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F3
        public static List<SECSGEMDefaultReplyObject> S7F3(string Equipment, string LotNo)
        {
            try
            {
                var LotInfo = GetLotInfo(LotNo);
                string ProductName = LotInfo.ProductName;

                var webclient = new WebClient();
                string URL = "";
                string result = "";
                string PPID = "";
                string Format = "";
                byte[] RecipeBody = new byte[] { };

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();
                string json = "";
                string B64 = "";

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;

                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childType = EquipmentModels.GetEquipmentTypeJoin(ChildID);

                        if(childType.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                        {
                            //override
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = 0;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F3";
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            var RecipeInfo = RecipeClass.getData(ProductName, ChildEquipment, ChildID.ToString());

                            foreach (DataRow dr in RecipeInfo.Rows)
                            {
                                PPID = dr["RecipeName"].ToString();
                                RecipeBody = (byte[])dr["RecipeBody"];
                            }

                            B64 = Convert.ToBase64String(RecipeBody);

                            if (childType.ToUpper() == "DEK PRINTER")
                            {
                                Format = "B";
                            }
                            else if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH")
                            {
                                Format = "B";
                                //Format = "A";
                            }
                            else if (childType.ToUpper() == "HELLER OVEN")
                            {
                                Format = "B";
                                //Format = "A";
                            }
                            else
                            {
                                Format = "B";
                            }

                            json = "{" + '"' + "Data" + '"' + ":" + '"' + B64 + '"' + "}";

                            URL = WebServiceUrl + "secsgem/S7F3_ProcessProgramSend?Equipment=" + ChildEquipment + "&PPID=" + PPID + "&Format=" + Format;
                            URL = string.Format(URL);

                            webclient.Headers["Content-type"] = "application/json";

                            webclient.Encoding = Encoding.UTF8;

                            //call the web service
                            result = webclient.UploadString(URL, "POST", json);

                            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                            string header = dict["header"].ToString();
                            string body = dict["body"].ToString();

                            var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                            string value = dictBody["value"].ToString();

                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F3";
                            obj.Add(temp_obj);
                        }
                    }
                }
                else
                {
                    if(type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F3";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        var RecipeInfo = RecipeClass.getData(ProductName, Equipment, ID.ToString());

                        foreach (DataRow dr in RecipeInfo.Rows)
                        {
                            PPID = dr["RecipeName"].ToString();
                            RecipeBody = (byte[])dr["RecipeBody"];
                        }

                        B64 = Convert.ToBase64String(RecipeBody);

                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            Format = "B";
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            Format = "B";
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            Format = "B";
                        }
                        else
                        {
                            Format = "B";
                        }

                        json = "{" + '"' + "Data" + '"' + ":" + '"' + B64 + '"' + "}";

                        URL = WebServiceUrl + "secsgem/S7F3_ProcessProgramSend?Equipment=" + Equipment + "&PPID=" + PPID + "&Format=" + Format;
                        URL = string.Format(URL);

                        webclient.Headers["Content-type"] = "application/json";

                        webclient.Encoding = Encoding.UTF8;

                        result = webclient.UploadString(URL, "POST", json);

                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);

                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = Response;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F3";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F3 Custom (File Browsed)
        public static List<SECSGEMDefaultReplyObject> S7F3_Custom(string Equipment, string PPID, string PPBODY)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";
                string Format = "";
                byte[] RecipeBody = new byte[] { };

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();
                string json = "";
                string B64 = "";

                if (type == "")
                {
                    var child = EquipmentModels.getChildEquipments(Equipment);
                    foreach (var x in child)
                    {
                        string ChildEquipment = x;

                        int ChildID = EquipmentModels.GetEquipmentID(ChildEquipment);
                        string childType = EquipmentModels.GetEquipmentTypeJoin(ChildID);

                        if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                        {
                            //override
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = 0;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F3";
                            obj.Add(temp_obj);
                        }
                        else
                        {
                            B64 = PPBODY;

                            if (childType.ToUpper() == "DEK PRINTER")
                            {
                                Format = "B";
                            }
                            else if (childType.ToUpper() == "PANASONIC COMPONENT ATTACH")
                            {
                                Format = "B";
                                //Format = "A";
                            }
                            else if (childType.ToUpper() == "HELLER OVEN")
                            {
                                Format = "B";
                                //Format = "A";
                            }
                            else
                            {
                                Format = "B";
                            }

                            json = "{" + '"' + "Data" + '"' + ":" + '"' + B64 + '"' + "}";

                            URL = WebServiceUrl + "secsgem/S7F3_ProcessProgramSend?Equipment=" + ChildEquipment + "&PPID=" + PPID + "&Format=" + Format;
                            URL = string.Format(URL);

                            webclient.Headers["Content-type"] = "application/json";

                            webclient.Encoding = Encoding.UTF8;

                            //call the web service
                            result = webclient.UploadString(URL, "POST", json);

                            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                            string header = dict["header"].ToString();
                            string body = dict["body"].ToString();

                            var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                            string value = dictBody["value"].ToString();

                            int Response = Convert.ToInt32(value);
                            SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                            temp_obj.Equipment = ChildEquipment;
                            temp_obj.Value = Response;
                            temp_obj.EquipmentType = childType;
                            temp_obj.StreamFunction = "S7F3";
                            obj.Add(temp_obj);
                        }
                    }
                }
                else
                {
                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F3";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        B64 = PPBODY;

                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            Format = "B";
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            Format = "B";
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            Format = "B";
                        }
                        else
                        {
                            Format = "B";
                        }

                        json = "{" + '"' + "Data" + '"' + ":" + '"' + B64 + '"' + "}";

                        URL = WebServiceUrl + "secsgem/S7F3_ProcessProgramSend?Equipment=" + Equipment + "&PPID=" + PPID + "&Format=" + Format;
                        URL = string.Format(URL);

                        webclient.Headers["Content-type"] = "application/json";

                        webclient.Encoding = Encoding.UTF8;

                        result = webclient.UploadString(URL, "POST", json);

                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                        string header = dict["header"].ToString();
                        string body = dict["body"].ToString();

                        var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                        string value = dictBody["value"].ToString();

                        int Response = Convert.ToInt32(value);

                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = Response;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S7F3";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S7F5 Process Program Request
        public static string S7F5(string Equipment, string PPID)
        {
            try
            {
                string URL = WebServiceUrl + "secsgem/S7F5_ProcessProgramRequest?Equipment=" + Equipment + "&PPID=" + PPID;
                URL = string.Format(URL);
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var data = string.Format(URL);

                data = webclient.DownloadString(data);

                if (data == @"{""STATUS"":""FAIL""}")
                {
                    data = null;
                }

                if (data != null && data != "")
                {
                    PPID = "";
                    string PPBODY_FORMAT = "";
                    string PPBODY = "";

                    try
                    {
                        var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(data);
                        PPID = dict["PPID"].ToString();
                        PPBODY_FORMAT = dict["PPBODY_FORMAT"].ToString();
                        PPBODY = dict["PPBODY"].ToString();
                    }
                    catch { }

                    if (PPID != "" && PPBODY != "")
                    {
                        string base64String = PPBODY;
                        //byte[] myByte = Convert.FromBase64String(base64String);
                        return base64String;

                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        //function for sending S2F41 (PP-SELECT)
        public static List<SECSGEMDefaultReplyObject> PPSELECT(List<string> lstEquipment, string LotNo)
        {
            try
            {
                var LotInfo = GetLotInfo(LotNo);
                string ProductName = LotInfo.ProductName;

                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                foreach (string x in lstEquipment)
                {
                    string PPID = "";

                    var webclient = new WebClient();

                    string URL = "";
                    string result = "";

                    string Equipment = x;

                    int ID = EquipmentModels.GetEquipmentID(Equipment);
                    string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S2F41";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        var RecipeInfo = RecipeClass.getData(ProductName, Equipment, ID.ToString());

                        Dictionary<string, object> dict = new Dictionary<string, object>();
                        string header = "";
                        string body = "";

                        foreach (DataRow dr in RecipeInfo.Rows)
                        {
                            PPID = dr["RecipeName"].ToString();
                        }

                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_DEK_PRINTER?Equipment=" + Equipment + "&PPID=" + PPID;
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_PANASONIC_COMPONENT_ATTACH?Equipment=" + Equipment + "&PPID=" + PPID;
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_HELLER_OVEN?Equipment=" + Equipment + "&PPID=" + PPID;
                        }

                        URL = string.Format(URL);
                        result = webclient.DownloadString(URL);
                        dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        header = dict["header"].ToString();
                        body = dict["body"].ToString();

                        JArray a = JArray.Parse(body);
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                string name = p.Name;
                                string value = (string)p.Value;

                                if (name == "value")
                                {
                                    int Response = Convert.ToInt32(value);
                                    SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                    temp_obj.Equipment = Equipment;
                                    temp_obj.Value = Response;
                                    temp_obj.EquipmentType = type;
                                    temp_obj.StreamFunction = "S2F41";
                                    obj.Add(temp_obj);
                                }
                            }
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

        //function for sending S2F41 (PP-SELECT) Custom (File Browsed)
        public static List<SECSGEMDefaultReplyObject> PPSELECT_Custom(List<string> lstEquipment, string PPID)
        {
            try
            {
                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                foreach (string x in lstEquipment)
                {
                    var webclient = new WebClient();

                    string URL = "";
                    string result = "";

                    string Equipment = x;

                    int ID = EquipmentModels.GetEquipmentID(Equipment);
                    string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                    if (type.ToUpper() == "PANASONIC COMPONENT ATTACH" && EnablePanasonic == false)
                    {
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S2F41";
                        obj.Add(temp_obj);
                    }
                    else
                    {
                        Dictionary<string, object> dict = new Dictionary<string, object>();
                        string header = "";
                        string body = "";

                        if (type.ToUpper() == "DEK PRINTER")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_DEK_PRINTER?Equipment=" + Equipment + "&PPID=" + PPID;
                        }
                        else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_PANASONIC_COMPONENT_ATTACH?Equipment=" + Equipment + "&PPID=" + PPID;
                        }
                        else if (type.ToUpper() == "HELLER OVEN")
                        {
                            URL = WebServiceUrl + "secsgem/S2F41_PPSELECT_HELLER_OVEN?Equipment=" + Equipment + "&PPID=" + PPID;
                        }

                        URL = string.Format(URL);
                        result = webclient.DownloadString(URL);
                        dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        header = dict["header"].ToString();
                        body = dict["body"].ToString();

                        JArray a = JArray.Parse(body);
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                string name = p.Name;
                                string value = (string)p.Value;

                                if (name == "value")
                                {
                                    int Response = Convert.ToInt32(value);
                                    SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                    temp_obj.Equipment = Equipment;
                                    temp_obj.Value = Response;
                                    temp_obj.EquipmentType = type;
                                    temp_obj.StreamFunction = "S2F41";
                                    obj.Add(temp_obj);
                                }
                            }
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

        //function for sending S2F41 (START)
        public static List<SECSGEMDefaultReplyObject> START(List<string> lstEquipment)
        {
            try
            {
                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                foreach (string x in lstEquipment)
                {
                    var webclient = new WebClient();

                    string URL = "";
                    string result = "";

                    string Equipment = x;
                    int ID = EquipmentModels.GetEquipmentID(Equipment);
                    string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                    Dictionary<string, object> dict = new Dictionary<string, object>();
                    string header = "";
                    string body = "";

                    string command = "";

                    if (type.ToUpper() == "DEK PRINTER")
                    {
                        command = "START";
                    }
                    else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                    {
                        command = "START";
                    }
                    else if (type.ToUpper() == "HELLER OVEN")
                    {
                        command = "START";
                    }

                    //only heller oven requires start
                    if (type.ToUpper() == "HELLER OVEN" || type.ToUpper() == "DEK PRINTER")
                    {
                        URL = WebServiceUrl + "secsgem/S2F41_NOPARAM?Equipment=" + Equipment + "&Command=" + command;

                        URL = string.Format(URL);
                        result = webclient.DownloadString(URL);
                        dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                        header = dict["header"].ToString();
                        body = dict["body"].ToString();

                        JArray a = JArray.Parse(body);
                        foreach (JObject o in a.Children<JObject>())
                        {
                            foreach (JProperty p in o.Properties())
                            {
                                string name = p.Name;
                                string value = (string)p.Value;

                                if (name == "value")
                                {
                                    int Response = Convert.ToInt32(value);
                                    SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                    temp_obj.Equipment = Equipment;
                                    temp_obj.Value = Response;
                                    temp_obj.EquipmentType = type;
                                    temp_obj.StreamFunction = "S2F41";
                                    obj.Add(temp_obj);
                                }
                            }
                        }
                    }
                    //override panasonic since it does not have start command
                    else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                    {
                        SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                        temp_obj.Equipment = Equipment;
                        temp_obj.Value = 0;
                        temp_obj.EquipmentType = type;
                        temp_obj.StreamFunction = "S2F41";
                        obj.Add(temp_obj);
                    }
                }

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for sending S2F41 (STOP)
        public static List<SECSGEMDefaultReplyObject> STOP(List<string> lstEquipment)
        {
            try
            {
                List<SECSGEMDefaultReplyObject> obj = new List<SECSGEMDefaultReplyObject>();

                foreach (string x in lstEquipment)
                {
                    var webclient = new WebClient();

                    string URL = "";
                    string result = "";

                    string Equipment = x;
                    int ID = EquipmentModels.GetEquipmentID(Equipment);
                    string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                    Dictionary<string, object> dict = new Dictionary<string, object>();
                    string header = "";
                    string body = "";

                    string command = "";

                    if (type.ToUpper() == "DEK PRINTER")
                    {
                        command = "STOP";
                    }
                    else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                    {
                        command = "STOP";
                    }
                    else if (type.ToUpper() == "HELLER OVEN")
                    {
                        command = "STOP";
                    }

                    URL = WebServiceUrl + "secsgem/S2F41_NOPARAM?Equipment=" + Equipment + "&Command=" + command;

                    URL = string.Format(URL);
                    result = webclient.DownloadString(URL);
                    dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
                    header = dict["header"].ToString();
                    body = dict["body"].ToString();

                    JArray a = JArray.Parse(body);
                    foreach (JObject o in a.Children<JObject>())
                    {
                        foreach (JProperty p in o.Properties())
                        {
                            string name = p.Name;
                            string value = (string)p.Value;

                            if (name == "value")
                            {
                                int Response = Convert.ToInt32(value);
                                SECSGEMDefaultReplyObject temp_obj = new SECSGEMDefaultReplyObject();
                                temp_obj.Equipment = Equipment;
                                temp_obj.Value = Response;
                                temp_obj.EquipmentType = type;
                                temp_obj.StreamFunction = "S2F41";
                                obj.Add(temp_obj);
                            }
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

        //function for S2F37 (Disable Collection)
        public static SECSGEMDefaultReplyObject DisableCollection(string Equipment, int CEID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string CEIDFormat = "";
                
                if (type.ToUpper() == "DEK PRINTER")
                {
                    CEIDFormat = "U4";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    CEIDFormat = "U4";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    CEIDFormat = "U4";
                }

                URL = WebServiceUrl + "secsgem/S2F37_EnableDisableEventReport?Equipment=" + Equipment + "&isEnabled=0" + "&CEIDFormat=" + CEIDFormat;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + CEID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F37_DISABLE_COLLECTION";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F33 (Delete Report)
        public static SECSGEMDefaultReplyObject DeleteReport(string Equipment, int RPTID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string DATAIDFormat = "";
                string RPTIDFormat = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }

                URL = WebServiceUrl + "secsgem/S2F33_DeleteReport?Equipment=" + Equipment + "&DATAIDFormat=" + DATAIDFormat + "&RPTIDFormat=" + RPTIDFormat;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + RPTID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F33_DELETE_REPORT";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F35 (Unlink Report)
        public static SECSGEMDefaultReplyObject UnlinkCollection(string Equipment, int CEID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string CEIDFormat = "";
                string DATAIDFormat = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                }

                URL = WebServiceUrl + "secsgem/S2F35_UnlinkReport?Equipment=" + Equipment + "&DATAIDFormat=" + DATAIDFormat + "&CEIDFormat=" + CEIDFormat;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + CEID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F35_UNLINK_COLLECTION";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F33 (Add to Report Single)
        public static SECSGEMDefaultReplyObject AddToReport_Single(string Equipment, int RPTID, int VID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string DATAIDFormat = "";
                string RPTIDFormat = "";
                string IDFormat = "";
                string IDVariable = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }

                URL = WebServiceUrl + "secsgem/S2F33_AddToReport?Equipment=" + Equipment + "&DATAIDFormat=" + DATAIDFormat + "&RPTIDFormat=" + RPTIDFormat + "&IDFormat=" + IDFormat + "&IDVariable=" + IDVariable;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + RPTID.ToString() + '"' + ",";
                json += '"' + "ID" + '"' + ":" + '"' + VID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F33_ADD_REPORT";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F33 (Add to Report Multi)
        public static SECSGEMDefaultReplyObject AddToReport_Multi(string Equipment, int RPTID, List<int> lstVID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string DATAIDFormat = "";
                string RPTIDFormat = "";
                string IDFormat = "";
                string IDVariable = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                    IDFormat = "U4";
                    IDVariable = "VID";
                }

                URL = WebServiceUrl + "secsgem/S2F33_AddToReport?Equipment=" + Equipment + "&DATAIDFormat=" + DATAIDFormat + "&RPTIDFormat=" + RPTIDFormat + "&IDFormat=" + IDFormat + "&IDVariable=" + IDVariable;
                URL = string.Format(URL);

                string VID = "";

                if(lstVID != null)
                {
                    if(lstVID.Count >0)
                    {
                        VID = "[" + string.Join(",", lstVID) + "]";
                    }
                }

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + RPTID.ToString() + '"' + ",";
                json += '"' + "ID" + '"' + ":" + '"' + VID + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F33_ADD_REPORT";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F35 (Link Report)
        public static SECSGEMDefaultReplyObject LinkCollection(string Equipment, int CEID, int RPTID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string CEIDFormat = "";
                string DATAIDFormat = "";
                string RPTIDFormat = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    CEIDFormat = "U4";
                    DATAIDFormat = "U4";
                    RPTIDFormat = "U4";
                }

                URL = WebServiceUrl + "secsgem/S2F35_LinkReport?Equipment=" + Equipment + "&DATAIDFormat=" + DATAIDFormat + "&CEIDFormat=" + CEIDFormat + "&RPTIDFormat=" + RPTIDFormat;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + CEID.ToString() + '"' + ",";
                json += '"' + "ID" + '"' + ":" + '"' + RPTID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F35_LINK_COLLECTION";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for S2F37 (Enable Collection)
        public static SECSGEMDefaultReplyObject EnableCollection(string Equipment, int CEID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                int ID = EquipmentModels.GetEquipmentID(Equipment);
                string type = EquipmentModels.GetEquipmentTypeJoin(ID);

                string CEIDFormat = "";

                if (type.ToUpper() == "DEK PRINTER")
                {
                    CEIDFormat = "U4";
                }
                else if (type.ToUpper() == "PANASONIC COMPONENT ATTACH")
                {
                    CEIDFormat = "U4";
                }
                else if (type.ToUpper() == "HELLER OVEN")
                {
                    CEIDFormat = "U4";
                }

                URL = WebServiceUrl + "secsgem/S2F37_EnableDisableEventReport?Equipment=" + Equipment + "&isEnabled=1" + "&CEIDFormat=" + CEIDFormat;
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Data" + '"' + ":" + '"' + CEID.ToString() + '"';
                json += "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);

                string header = dict["header"].ToString();
                string body = dict["body"].ToString();

                var dictBody = JsonConvert.DeserializeObject<Dictionary<string, object>>(body);
                string value = dictBody["value"].ToString();

                int Response = Convert.ToInt32(value);

                SECSGEMDefaultReplyObject obj = new SECSGEMDefaultReplyObject();
                obj.Equipment = Equipment;
                obj.Value = Response;
                obj.EquipmentType = type;
                obj.StreamFunction = "S2F37_ENABLE_COLLECTION";

                return obj;
            }
            catch
            {
                return null;
            }
        }

        //function for getting IP address of client
        public static string GetIPAddress()
        {
            string ipAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }

        //function for initializing machine configuration
        public static Dictionary<int, EquipmentType> InitMachine()
        {
            Dictionary<int, EquipmentType> dictionary = new Dictionary<int, EquipmentType>();

            DataTable dt = new DataTable();
            dt = EquipmentModels.GetAllEquipmentType();

            foreach (DataRow dr in dt.Rows)
            {
                dictionary.Add(Convert.ToInt32(dr["ID"].ToString()), new EquipmentType
                {
                    ID = Convert.ToInt32(dr["ID"].ToString()),
                    Type = dr["Type"].ToString(),
                    IsEnabled = Convert.ToBoolean(dr["IsEnabled"].ToString())
                });
            }

            return dictionary;
        }

        //function for getting default password for newly created accounts
        public static string getDefaultPassword()
        {
            string defaultPassword = SettingModels.DefaultPassword();
            return defaultPassword;
        }

        //function for recalling the config
        public static void ReInitMachine()
        {
            isEquipmentEnabled = InitMachine();
            isSignalR = SettingModels.IsSignalR();
            tolerance = SettingModels.GetTolerance();
        }

        //function for AD login
        public static string ADLogin(string Username, string Password)
        {
            try
            {
                //initialize the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //initialize the url for the service
                URL = WebServiceUrl + "user/ADLogin";
                URL = string.Format(URL);

                //create the json string
                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + Password + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //call the web service
                result = webclient.UploadString(URL, "POST", json);

                //handle the result
                AD output = Deserialize<AD>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for user login
        public static string UserLogin(string Username, string Password)
        {
            try
            {
                //initialize the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //initialize the url for the service
                URL = WebServiceUrl + "user/userLogin";
                URL = string.Format(URL);

                //create the json string
                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + Password + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //call the web service
                result = webclient.UploadString(URL, "POST", json);

                //handle the result
                AD output = Deserialize<AD>(result);

                if (Convert.ToBoolean(output.RESULT) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Login", "Login Successful", HostName, IP, Username);
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function to insert the logout details in audit trail
        public static void logBeforeLogout()
        {
            string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
            string HostName = computer_name[0].ToString().ToUpper();
            string IP = GetIPAddress();
            AuditModel.AddLog("Logout", "Logout Successful", HostName, IP, HttpContext.Current.Session["Username"].ToString());
        }

        //function for EProcedure
        public static string EProcedure(string LotNo, string Equipment, string Mode, string UnitInspected, string UnitRejected, string ContainmentDone, int[] arrRejectQuantity, string[] arrRejectCode, string RequalPass, string attrMon, string UserID)
        {
            try
            {
                //initialize the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //initialize the url for the service
                URL = WebServiceUrl + "camstar/eproc";
                URL = string.Format(URL);

                //create the json string
                string json = "{";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "Mode" + '"' + ":" + '"' + Mode + '"' + ",";
                json += '"' + "UnitInspected" + '"' + ":" + '"' + UnitInspected + '"' + ",";
                json += '"' + "UnitRejected" + '"' + ":" + '"' + UnitRejected + '"' + ",";
                json += '"' + "ContainmentDone" + '"' + ":" + '"' + ContainmentDone + '"' + ",";
                json += '"' + "RequalPass" + '"' + ":" + '"' + RequalPass + '"' + ",";
                json += '"' + "attrMon" + '"' + ":" + '"' + attrMon + '"' + ",";

                string quantity = "";
                if (arrRejectQuantity != null && arrRejectQuantity.Length > 0)
                {
                    foreach (int x in arrRejectQuantity)
                    {
                        quantity += x.ToString() + ",";
                    }
                    quantity += ')';
                    quantity = quantity.Replace(",)", "");
                }

                json += '"' + "arrRejectQuantity" + '"' + ":" + '"' + quantity + '"' + ",";

                string code = "";
                if (arrRejectCode != null && arrRejectCode.Length > 0)
                {
                    foreach (string x in arrRejectCode)
                    {
                        code += x.ToString() + ",";
                    }
                    code += ')';
                    code = code.Replace(",)", "");
                }

                json += '"' + "arrRejectCode" + '"' + ":" + '"' + code + '"' + ",";

                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //call the web service
                result = webclient.UploadString(URL, "POST", json);

                //handle the result
                Camstar output = Deserialize<Camstar>(result);

                output = Deserialize<Camstar>(result);

                if (output.RESULT != null && output.RESULT != "")
                {
                    if (output.RESULT.ToUpper().Contains("SUCCESS"))
                    {
                        string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                        string HostName = computer_name[0].ToString().ToUpper();
                        string IP = GetIPAddress();
                        AuditModel.AddLog("EProcedure", "EProcedure Successful - User ID: " + UserID + ", Lot Number: " + LotNo, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                    }

                    return output.RESULT;
                }
                else
                {
                    return output.ERROR;
                }
            }
            catch
            {
                return null;
            }
        }

        //function for creating user
        public static string CreateUser(string Username, string FirstName, string LastName, string MiddleName, string ModeCode, string Password, string Email, string ThumbnailPhoto)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/createUser";
                URL = string.Format(URL);

                //create the json object
                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "FirstName" + '"' + ":" + '"' + FirstName + '"' + ",";
                json += '"' + "LastName" + '"' + ":" + '"' + LastName + '"' + ",";
                json += '"' + "MiddleName" + '"' + ":" + '"' + MiddleName + '"' + ",";
                json += '"' + "ModeCode" + '"' + ":" + '"' + ModeCode + '"' + ",";
                json += '"' + "Email" + '"' + ":" + '"' + Email + '"' + ",";
                json += '"' + "ThumbnailPhoto" + '"' + ":" + '"' + ThumbnailPhoto + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + Password + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(URL, "POST", json);

                AD output = Deserialize<AD>(result);

                if (Convert.ToBoolean(output.RESULT) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("User", "Added User - Username: " + Username, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for updating user
        public static string UpdateUser(string Username, string FirstName, string LastName, string MiddleName, string ModeCode, string Password, string Email, string ThumbnailPhoto)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/updateUser";
                URL = string.Format(URL);

                //create the json object
                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "FirstName" + '"' + ":" + '"' + FirstName + '"' + ",";
                json += '"' + "LastName" + '"' + ":" + '"' + LastName + '"' + ",";
                json += '"' + "MiddleName" + '"' + ":" + '"' + MiddleName + '"' + ",";
                json += '"' + "ModeCode" + '"' + ":" + '"' + ModeCode + '"' + ",";
                json += '"' + "Email" + '"' + ":" + '"' + Email + '"' + ",";
                json += '"' + "ThumbnailPhoto" + '"' + ":" + '"' + ThumbnailPhoto + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + Password + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //handle the result
                result = webclient.UploadString(URL, "POST", json);

                AD output = Deserialize<AD>(result);

                if (Convert.ToBoolean(output.RESULT) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("User", "Updated User - Username: " + Username, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for updating the thumbnail photo of user
        public static string UpdateThumbnailPhoto(string Username, string Photo)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/updateUser";
                URL = string.Format(URL);

                //create the json object
                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "FirstName" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "LastName" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "MiddleName" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "ModeCode" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "Email" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "Position" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "ThumbnailPhoto" + '"' + ":" + '"' + Photo + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + "" + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //handle the result
                result = webclient.UploadString(URL, "POST", json);

                AD output = Deserialize<AD>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for deleting user
        public static string DeleteUser(string username)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + username + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "user/" + "deleteUser", "POST", json);

                AD output = Deserialize<AD>(result);

                if (Convert.ToBoolean(output.RESULT) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("User", "Deleted User - Username: " + username, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar trackin
        public static string trackIn(string userID, string LotNo, string Equipment, int TrackInQty, string comment, string location, List<string> lstProgram = null, List<string> lstEquip = null)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "TrackInQty" + '"' + ":" + '"' + TrackInQty.ToString() + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + comment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                if (location.ToUpper() == "TEST")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "trackin_test", "POST", json);
                }
                else if (location.ToUpper() == "ASSEMBLY")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "trackin", "POST", json);
                }

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string type = EquipmentModels.EquipmentType(Equipment);

                    var LotInfo = GetLotInfo(LotNo);
                    string ProductName = LotInfo.ProductName;

                    if (type == "LASER MARK TEST")
                    {
                        EquipmentModels.updateEquipmentTrackIn(Convert.ToInt32(TrackInQty), Equipment, LotNo, userID, lstProgram[0]);
                        EquipmentModels.validateWarningTracker(Equipment);
                        EquipmentModels.insertTCPNotification(Equipment, "Track In Successful", "REQUEST");

                        //for getting the reel quantity
                        var myQuery = "17-T&R Label Data By Lot";
                        var onlineQuery = GetAllOnlineQuery();
                        bool isValid = false;

                        foreach (var x in onlineQuery)
                        {
                            if (myQuery == x.Field)
                            {
                                isValid = true;
                            }
                        }

                        if(isValid == true)
                        {
                            var fields = GetOnlineQueryField(myQuery, userID);

                            bool isValid2 = false;
                            string myField = "";

                            foreach (var y in fields)
                            {
                                if ("Lot" == y.Field)
                                {
                                    isValid2 = true;
                                    myField = y.Field;
                                }
                            }

                            if(isValid2 == true)
                            {
                                List<string> lstField = new List<string>();
                                lstField.Add(myField);

                                List<string> lstValue = new List<string>();
                                lstValue.Add(LotNo);

                                var report = GetOnlineQueryReport(myQuery, lstField, lstValue, userID);

                                JArray a = JArray.Parse(report);
                                string Media_Qty = "";
                                foreach (JObject o in a.Children<JObject>())
                                {
                                    foreach (JProperty p in o.Properties())
                                    {
                                        string name = p.Name;
                                        string value = (string)p.Value;

                                        if (name == "Media_Qty")
                                        {
                                            Media_Qty = value;
                                        }
                                    }
                                }

                                int ReelQty = Convert.ToInt32(Media_Qty);
                                int CurrentQty = 0;
                                int CurrentReel = 0;
                                int TotalReel = TrackInQty / ReelQty;
                                int RemainingReel = TotalReel - CurrentReel;
                                int AllowedReel = 0;
                                int InReel = 0;
                                bool check = ReelModel.UpdatePrintReelTable(Equipment, ReelQty, CurrentQty, CurrentReel, TotalReel, RemainingReel, AllowedReel, InReel);
                            }
                        }

                    }
                    else if (type == "")
                    {
                        var child = EquipmentModels.getChildEquipments(Equipment);
                        foreach (var x in child)
                        {
                            string ChildEquipment = x;
                            bool isSECSGEM = EquipmentModels.isSECSGEM(ChildEquipment);
                            int multiplier = 1;
                            
                            if (isSECSGEM == true)
                            {
                                string temp_type = EquipmentModels.EquipmentType(ChildEquipment);
                                if (temp_type == "DEK PRINTER" || temp_type == "PANASONIC COMPONENT ATTACH" || temp_type == "HELLER OVEN")
                                {
                                    var myQuery = "25-SMT_Units Per Strip";
                                    var onlineQuery = GetAllOnlineQuery();
                                    bool isValid = false;

                                    foreach (var i in onlineQuery)
                                    {
                                        if (myQuery == i.Field)
                                        {
                                            isValid = true;
                                        }
                                    }

                                    if (isValid == true)
                                    {
                                        var fields = GetOnlineQueryField(myQuery, userID);

                                        bool isValid2 = false;
                                        string myField = "";

                                        foreach (var y in fields)
                                        {
                                            if ("PRODUCT" == y.Field)
                                            {
                                                isValid2 = true;
                                                myField = y.Field;
                                            }
                                        }

                                        if (isValid2 == true)
                                        {
                                            List<string> lstField = new List<string>();
                                            lstField.Add(myField);
                                            lstField.Add("BLOCKOF200ROWS");

                                            List<string> lstValue = new List<string>();
                                            lstValue.Add(ProductName);
                                            lstValue.Add("1");

                                            var report = GetOnlineQueryReport(myQuery, lstField, lstValue, userID);

                                            JArray a = JArray.Parse(report);
                                            string Strips = "";
                                            foreach (JObject o in a.Children<JObject>())
                                            {
                                                foreach (JProperty p in o.Properties())
                                                {
                                                    string name = p.Name;
                                                    string value = (string)p.Value;

                                                    if (name == "UnitsPerStrip")
                                                    {
                                                        Strips = value;
                                                        multiplier = Convert.ToInt32(Strips);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                EquipmentModels.ValidateSECSGEMQty(ChildEquipment, multiplier);
                            }
                            
                            int index = lstEquip.IndexOf(ChildEquipment);
                            string recipe = lstProgram[index];

                            EquipmentModels.updateEquipmentTrackIn(Convert.ToInt32(TrackInQty), ChildEquipment, LotNo, userID, recipe);
                            EquipmentModels.validateWarningTracker(ChildEquipment);
                        }
                    }
                    else
                    {
                        bool isSECSGEM = EquipmentModels.isSECSGEM(Equipment);
                        int multiplier = 1;
                        if (isSECSGEM == true)
                        {
                            if (type == "DEK PRINTER" || type == "PANASONIC COMPONENT ATTACH" || type == "HELLER OVEN")
                            {
                                var myQuery = "25-SMT_Units Per Strip";
                                var onlineQuery = GetAllOnlineQuery();
                                bool isValid = false;

                                foreach (var i in onlineQuery)
                                {
                                    if (myQuery == i.Field)
                                    {
                                        isValid = true;
                                    }
                                }

                                if (isValid == true)
                                {
                                    var fields = GetOnlineQueryField(myQuery, userID);

                                    bool isValid2 = false;
                                    string myField = "";

                                    foreach (var y in fields)
                                    {
                                        if ("PRODUCT" == y.Field)
                                        {
                                            isValid2 = true;
                                            myField = y.Field;
                                        }
                                    }

                                    if (isValid2 == true)
                                    {
                                        List<string> lstField = new List<string>();
                                        lstField.Add(myField);
                                        lstField.Add("BLOCKOF200ROWS");

                                        List<string> lstValue = new List<string>();
                                        lstValue.Add(ProductName);
                                        lstValue.Add("1");

                                        var report = GetOnlineQueryReport(myQuery, lstField, lstValue, userID);

                                        JArray a = JArray.Parse(report);
                                        string Strips = "";
                                        foreach (JObject o in a.Children<JObject>())
                                        {
                                            foreach (JProperty p in o.Properties())
                                            {
                                                string name = p.Name;
                                                string value = (string)p.Value;

                                                if (name == "UnitsPerStrip")
                                                {
                                                    Strips = value;
                                                    multiplier = Convert.ToInt32(Strips);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            EquipmentModels.ValidateSECSGEMQty(Equipment, multiplier);
                        }
                        EquipmentModels.updateEquipmentTrackIn(Convert.ToInt32(TrackInQty), Equipment, LotNo, userID, lstProgram[0]);
                        EquipmentModels.validateWarningTracker(Equipment);
                    }

                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Track In", "Track In Successful - User ID: " + userID + ", Equipment: " + Equipment + ", Lot Number: " + LotNo, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar trackout
        public static string trackOut(string userID, string LotNo, string Equipment, int TrackOutQty, int TotalScrapQty, string comment, string location, string remainInEquipment, string remainInEquipmentIfPossible)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "TrackOutQty" + '"' + ":" + '"' + TrackOutQty.ToString() + '"' + ",";
                json += '"' + "TotalScrapQty" + '"' + ":" + '"' + TotalScrapQty.ToString() + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + comment + '"' + ",";
                json += '"' + "remainInEquipment" + '"' + ":" + '"' + remainInEquipment + '"' + ",";
                json += '"' + "remainInEquipmentIfPossible" + '"' + ":" + '"' + remainInEquipmentIfPossible + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                if (location.ToUpper() == "TEST")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "trackout_test", "POST", json);
                }
                else if (location.ToUpper() == "ASSEMBLY")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "trackout", "POST", json);
                }

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    List<string> trackout_msg = new List<string>();
                    if (Convert.ToBoolean(remainInEquipment) == true)
                    {
                        trackout_msg.Add("Remain in Equipment");
                    }
                    if (Convert.ToBoolean(remainInEquipmentIfPossible) == true)
                    {
                        trackout_msg.Add("Remain in Equipment if Possible");
                    }

                    string append = "";
                    if (trackout_msg != null)
                    {
                        if (trackout_msg.Count > 0)
                        {
                            append = "(" + string.Join("/", trackout_msg) + ")";
                            append += " ";
                        }
                    }

                    string type = EquipmentModels.EquipmentType(Equipment);
                    if (type == "LASER MARK TEST")
                    {
                        EquipmentModels.insertTCPNotification(Equipment, "Track Out " + append + "Successful", "REQUEST");
                    }

                    if (Convert.ToBoolean(remainInEquipment) == false && Convert.ToBoolean(remainInEquipmentIfPossible) == false)
                    {
                        if (type == "LASER MARK TEST")
                        {
                            EquipmentModels.clearTrackedEquipment(Equipment);
                            bool check = ReelModel.ClearReelTable(Equipment);
                        }
                        else if (type == "")
                        {
                            var child = EquipmentModels.getChildEquipments(Equipment);
                            foreach (var x in child)
                            {
                                EquipmentModels.clearTrackedEquipment(x);
                            }
                        }
                        else
                        {
                            EquipmentModels.clearTrackedEquipment(Equipment);
                        }
                    }
                    else if (Convert.ToBoolean(remainInEquipment) == true || Convert.ToBoolean(remainInEquipmentIfPossible) == true)
                    {
                        if (type == "LASER MARK TEST")
                        {
                            var reel = ReelModel.SelectReel(Equipment);
                            if (reel != null)
                            {
                                int allowedReel = 0;
                                try
                                {
                                    allowedReel = reel.AllowedReel;
                                }
                                catch
                                {
                                    allowedReel = 0;
                                }

                                if (allowedReel > 0)
                                {
                                    allowedReel = allowedReel - 1;
                                }
                                else
                                {
                                    allowedReel = 0;
                                }

                                int currentReel = 0;
                                try
                                {
                                    currentReel = reel.CurrentReel;
                                }
                                catch
                                {
                                    currentReel = 0;
                                }

                                currentReel = currentReel + 1;

                                int remainingReel = 0;
                                try
                                {
                                    remainingReel = reel.RemainingReel;
                                }
                                catch
                                {
                                    remainingReel = 0;
                                }

                                if (remainingReel > 0)
                                {
                                    remainingReel = remainingReel - 1;
                                }
                                else
                                {
                                    remainingReel = 0;
                                }

                                ReelModel.UpdateCounter(Equipment, allowedReel, currentReel, remainingReel);

                            }

                        }
                    }

                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Track Out", "Track Out " + append + "Successful - User ID: " + userID + ", Equipment: " + Equipment + ", Lot Number: " + LotNo, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }



                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for getting the online query from camstar
        public static List<OnlineQuery> GetAllOnlineQuery()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/getAllQuery";
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                List<OnlineQuery> columns = new List<OnlineQuery>();

                columns = Deserialize<List<OnlineQuery>>(result);

                return columns;
            }
            catch
            {
                return null;
            }
        }

        //function for getting online query fields from camstar
        public static List<OnlineQuery> GetOnlineQueryField(string QueryName, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "QueryName" + '"' + ":" + '"' + QueryName + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "getQueryField", "POST", json);

                List<OnlineQuery> columns = new List<OnlineQuery>();

                columns = Deserialize<List<OnlineQuery>>(result);

                return columns;
            }
            catch
            {
                return null;
            }
        }

        //function for getting online query fields from camstar (this returns dynamic json based on the query)
        public static string GetOnlineQueryReport(string QueryName, List<string> lstField, List<string> lstValue, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "QueryName" + '"' + ":" + '"' + QueryName + '"' + ",";
                json += '"' + "lstField" + '"' + ":" + '"' + string.Join(",", lstField) + '"' + ",";
                json += '"' + "lstValue" + '"' + ":" + '"' + string.Join(",", lstValue) + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "getOnlineQueryReport", "POST", json);

                return result;
            }
            catch
            {
                return null;
            }
        }

        //function for getting adhoc wip data object types
        public static List<AdhocWIPDataObjectType> GetAdhocWIPData_ObjectTypes()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/adhocwipdata_getObjectTypes";
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                List<AdhocWIPDataObjectType> obj = new List<AdhocWIPDataObjectType>();

                obj = Deserialize<List<AdhocWIPDataObjectType>>(result);

                return obj;

            }
            catch
            {
                return null;
            }
        }

        //function for getting adhoc wip data setup
        public static List<AdhocWIPDataObjectType> GetAdhocWIPData_Setup(string objectType)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/adhocwipdata_getWipDataSetup?ObjectType=" + objectType;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                List<AdhocWIPDataObjectType> obj = new List<AdhocWIPDataObjectType>();

                obj = Deserialize<List<AdhocWIPDataObjectType>>(result);

                return obj;

            }
            catch
            {
                return null;
            }
        }

        //function for getting adhoc wip data record sequence
        public static List<AdhocWIPDataRecordSequence> GetAdhocWIPData_RecordSequence(string AdhocWIPDataSetup, string ObjectType, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "Setup" + '"' + ":" + '"' + AdhocWIPDataSetup + '"' + ",";
                json += '"' + "ObjectType" + '"' + ":" + '"' + ObjectType + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "adhocwipdata_getRecordSequence", "POST", json);

                List<AdhocWIPDataRecordSequence> output = new List<AdhocWIPDataRecordSequence>();

                output = Deserialize<List<AdhocWIPDataRecordSequence>>(result);

                return output;
            }
            catch
            {
                return null;
            }
        }

        //function for getting adhoc wip data details
        public static List<AdhocWIPDataDetails> GetAdhocWIPData_Details(string AdhocWIPDataSetup, string ObjectType, string ObjectName, string ObjectRevision, string RecordSequence, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "Setup" + '"' + ":" + '"' + AdhocWIPDataSetup + '"' + ",";
                json += '"' + "ObjectType" + '"' + ":" + '"' + ObjectType + '"' + ",";
                json += '"' + "ObjectName" + '"' + ":" + '"' + ObjectName + '"' + ",";
                json += '"' + "ObjectRevision" + '"' + ":" + '"' + ObjectRevision + '"' + ",";
                json += '"' + "RecordSequence" + '"' + ":" + '"' + RecordSequence + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "adhocwipdata_getDetails", "POST", json);

                List<AdhocWIPDataDetails> output = new List<AdhocWIPDataDetails>();

                output = Deserialize<List<AdhocWIPDataDetails>>(result);

                return output;
            }
            catch
            {
                return null;
            }
        }

        //function for submitting adhoc wip data
        public static string AdhocWIPData_Submit(string AdhocWIPDataSetup, string ObjectName, string ObjectType, string RecordSequence, string lstField, string lstValue, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "Setup" + '"' + ":" + '"' + AdhocWIPDataSetup + '"' + ",";
                json += '"' + "ObjectName" + '"' + ":" + '"' + ObjectName + '"' + ",";
                json += '"' + "ObjectType" + '"' + ":" + '"' + ObjectType + '"' + ",";
                json += '"' + "RecordSequence" + '"' + ":" + '"' + RecordSequence + '"' + ",";
                json += '"' + "lstField" + '"' + ":" + '"' + lstField + '"' + ",";
                json += '"' + "lstValue" + '"' + ":" + '"' + lstValue + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "adhocwipdata_submit", "POST", json);

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Adhoc WIP Data", "Adhoc WIP Data (" + ObjectType + ": " + ObjectName + ")" + " Successful - User ID: " + UserID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar moveout
        public static string moveOut(string userID, string LotNo, int moveOutQty, int TotalScrapQty, string comment, string location)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "MoveOutQty" + '"' + ":" + '"' + moveOutQty.ToString() + '"' + ",";
                json += '"' + "TotalScrapQty" + '"' + ":" + '"' + TotalScrapQty.ToString() + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + comment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                if (location.ToUpper() == "TEST")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "moveout_test", "POST", json);
                }
                else if (location.ToUpper() == "ASSEMBLY")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "moveout", "POST", json);
                }

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Move Out", "Move Out Successful - User ID: " + userID + ", Lot Number: " + LotNo, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch(Exception e)
            {
                return e.Message;
            }
        }

        //function for listening to machine to get its processed quantity
        public static DefaultReturnObj ListenToMachine(string Equipment, string Port)
        {
            //var output = "";
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "opc/getMessage?Equipment=" + Equipment + "&Port=" + Port;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                DefaultReturnObj output = Deserialize<DefaultReturnObj>(result);

                return output;
            }
            catch
            {
                return null;
            }
        }

        //function for sending command to OPC-UA
        public static DefaultReturnObj OPCSendCommand(string Equipment, string Port, string command, int Duration, bool isTimer)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "opc/SendCommand";
                URL = string.Format(URL);

                //create the json object
                string json = "{";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "Port" + '"' + ":" + '"' + Port + '"' + ",";
                json += '"' + "Duration" + '"' + ":" + '"' + Duration.ToString() + '"' + ",";
                json += '"' + "isTimer" + '"' + ":" + '"' + isTimer.ToString() + '"' + ",";
                json += '"' + "Command" + '"' + ":" + '"' + command + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //handle the result
                result = webclient.UploadString(URL, "POST", json);

                DefaultReturnObj output = Deserialize<DefaultReturnObj>(result);

                if (output.Error.ToString().ToUpper() == "FALSE")
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Machine Command", "Command Sent to Machine - Command: " + command + ", Machine: " + Equipment, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar reset reject
        public static string ResetRejects(string userID, string lotNo, string equipment, string ProcessType)
        {
            try
            {
                //create the json object
                string json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "ProcessType" + '"' + ":" + '"' + ProcessType + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + equipment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + lotNo + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                string result = webclient.UploadString(WebServiceUrl + "camstar/resetreject", "POST", json);
                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for sending camstar lot rejects
        public static string LotRejects(string userID , string lotNo, string equipment, List<string> lstLossReason, List<string> lstLossQuantity, List<string> lstCategory, List<string> lstCause, List<string> lstComment)
        {
            try
            {
                string LossReason = "";
                string Quantity = "";
                string Category = "";
                string Cause = "";
                string Comment = "";
                
                //dont allow to pass null list
                if (lstLossReason == null)
                {
                    return null;
                }

                if (lstLossReason.Count <= 0)
                {
                    return null;
                }

                LossReason = '"' + "LossReason" + '"' + ":" + '"';
                for (int x = 0; x < lstLossReason.Count; x++)
                {
                    LossReason += lstLossReason[x].ToString() + ",";
                }
                LossReason += ")";
                LossReason = LossReason.Replace(",)", '"'.ToString());

                Quantity = '"' + "Quantity" + '"' + ":" + '"';
                for (int x = 0; x < lstLossQuantity.Count; x++)
                {
                    Quantity += lstLossQuantity[x].ToString() + ",";
                }
                Quantity += ")";
                Quantity = Quantity.Replace(",)", '"'.ToString());

                Category = '"' + "Category" + '"' + ":" + '"';
                for (int x = 0; x < lstCategory.Count; x++)
                {
                    Category += lstCategory[x].ToString() + ",";
                }
                Category += ")";
                Category = Category.Replace(",)", '"'.ToString());

                Cause = '"' + "Cause" + '"' + ":" + '"';
                for (int x = 0; x < lstCause.Count; x++)
                {
                    Cause += lstCause[x].ToString() + ",";
                }
                Cause += ")";
                Cause = Cause.Replace(",)", '"'.ToString());

                Comment = '"' + "Comment" + '"' + ":" + '"';
                for (int x = 0; x < lstComment.Count; x++)
                {
                    Comment += lstComment[x].ToString() + ",";
                }
                Comment += ")";
                Comment = Comment.Replace(",)", '"'.ToString());


                string json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + equipment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + lotNo + '"' + ",";
                json += LossReason + ",";
                json += Category + ",";
                json += Cause + ",";
                json += Comment + ",";
                json += Quantity;
                json += "}";

                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;
                string result = webclient.UploadString(WebServiceUrl + "camstar/lotreject", "POST", json);


                //handle the result
                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar first insert
        public static string FirstInsert(string userID, string LotNo, string location)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + ",";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + "}";

                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //determine the location and execute the service based on it
                if (location.ToUpper() == "TEST")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "firstinsert_test", "POST", json);
                }
                else if (location.ToUpper() == "ASSEMBLY")
                {
                    result = webclient.UploadString(WebServiceUrl + "camstar/" + "firstinsert", "POST", json);
                }
                
                //handle the result
                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        //function for getting alarms of equipment
        public static List<Alarm> GetAlarms(string equipID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "alarm/getNewAlarmsByEquipment?EquipID=" + equipID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                List<Alarm> alarm = new List<Alarm>();

                alarm = Deserialize<List<Alarm>>(result);
                foreach(var x in alarm)
                {
                    string dateStr = Convert.ToDateTime(x.Date).ToString();
                    x.DateStr = dateStr;
                }

                return alarm;
            }
            catch
            {
                return null;
            }
        }

        //function for getting all alarms of equipment
        public static List<Alarm> GetAllAlarms(string equipID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "alarm/getAllAlarmsByEquipment?EquipID=" + equipID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                List<Alarm> alarm = new List<Alarm>();

                alarm = Deserialize<List<Alarm>>(result);
                foreach (var x in alarm)
                {
                    string dateStr = Convert.ToDateTime(x.Date).ToString();
                    x.DateStr = dateStr;
                }

                return alarm;
            }
            catch
            {
                return null;
            }
        }

        //function for getting loss reason from camstar
        public static List<LossReasonObject> GetLossReason(string lotNo, string equipment, string processType, string UserID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/lossreason?Equipment=" + equipment + "&ProcessType=" + processType + "&LotNo=" + lotNo + "&UserID=" + UserID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                List<LossReasonObject> lossReason = new List<LossReasonObject>();

                lossReason = Deserialize<List<LossReasonObject>>(result);
                return lossReason;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar lot info
        public static LotObject GetLotInfo(string LotNo)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/lotstatus?LotNo=" + LotNo;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                LotObject lot = new LotObject();

                lot = Deserialize<LotObject>(result);
                return lot;
            }
            catch
            {
                return null;
            }
        }

        //function for getting encoded password
        public static string GetEncodedPassword(string password)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/getEncodedPassword?Password=" + password;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);
                DefaultReturnObj obj = new DefaultReturnObj();

                obj = Deserialize<DefaultReturnObj>(result);

                if (obj.Error != null && obj.Error != "")
                {
                    return null;
                }
                else
                {
                    return obj.Result;
                }
            }
            catch
            {
                return null;
            }
        }

        public static TrackEquipment GetTrackInEquipment(string LotNo, string Username, string Location)
        {
            try
            {
                //init the url
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                if (Location.ToUpper() == "TEST")
                {
                    URL = WebServiceUrl + "camstar/getEquipmentForTrackIn_test?LotNo=" + LotNo + "&UserID=" + Username;
                }
                else if (Location.ToUpper() == "ASSEMBLY")
                {
                    URL = WebServiceUrl + "camstar/getEquipmentForTrackIn?LotNo=" + LotNo + "&UserID=" + Username;
                }

                URL = string.Format(URL);

                //execute and handle the result
                result = webclient.DownloadString(URL);

                TrackEquipment equipment = new TrackEquipment();
                equipment = Deserialize<TrackEquipment>(result);

                return equipment;
            }
            catch
            {
                return null;
            }
        }

        public static TrackEquipment GetTrackOutEquipment(string LotNo, string Username, string Location)
        {
            try
            {
                //init the url
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                if (Location.ToUpper() == "TEST")
                {
                    URL = WebServiceUrl + "camstar/getEquipmentForTrackOut_test?LotNo=" + LotNo + "&UserID=" + Username;
                }
                else if (Location.ToUpper() == "ASSEMBLY")
                {
                    URL = WebServiceUrl + "camstar/getEquipmentForTrackOut?LotNo=" + LotNo + "&UserID=" + Username;
                }

                URL = string.Format(URL);

                //execute and handle the result
                result = webclient.DownloadString(URL);

                TrackEquipment equipment = new TrackEquipment();
                equipment = Deserialize<TrackEquipment>(result);

                return equipment;
            }
            catch
            {
                return null;
            }
        }

        //function for getting enrolled equipments for user
        public static List<EnrolledEquipment> GetEnrolledEquipments(string username)
        {
            try
            {
                string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                string HostName = computer_name[0].ToString().ToUpper();

                string IP = GetIPAddress();

                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                var isHostEnabled = SettingModels.isHostEnabled();
                string bit = "";

                if (isHostEnabled.ToString().ToLower() == "true")
                {
                    bit = "1";
                }
                else
                {
                    bit = "0";
                }

                //init the url
                URL = WebServiceUrl + "equipment/getEnrolledEquipments?UserID=" + username + "&HostID=" + HostName + "&isHostEnabled=" + bit.ToString() + "&IP=" + IP;
                URL = string.Format(URL);

                //execute and handle the result
                result = webclient.DownloadString(URL);
                
                List<EnrolledEquipment> enrolledEquipment = new List<EnrolledEquipment>();
                enrolledEquipment = Deserialize<List<EnrolledEquipment>>(result);
                List<EnrolledEquipment> TempEnrolledEquipment = new List<EnrolledEquipment>();
                TempEnrolledEquipment = enrolledEquipment;

                List<string> ID = new List<string>();

                //remove dupes
                for (int i = TempEnrolledEquipment.Count - 1; i > -1; i--)
                {
                    var tempID = TempEnrolledEquipment[i].Equipment.ToString();

                    if (!ID.Contains(tempID))
                    {
                        ID.Add(tempID);
                    }
                    else
                    {
                        TempEnrolledEquipment.RemoveAt(i);
                    }
                }

                enrolledEquipment = new List<EnrolledEquipment>();
                enrolledEquipment = TempEnrolledEquipment;

                for (int i = enrolledEquipment.Count - 1; i > -1; i--)
                {
                    string type = "";
                    try
                    {
                        type = enrolledEquipment[i].Type.ToUpper();
                    }
                    catch
                    {
                        type = "";
                    }

                    //this will be used to remove the equipment from the list
                    //if the feature is currently disabled based on the config
                    foreach (var entry in isEquipmentEnabled)
                    {
                        if (entry.Value.IsEnabled == false && type == entry.Value.Type)
                        {
                            enrolledEquipment.RemoveAt(i);
                        }
                    }
                }

                //create session and cookie to be used later
                int equipCount = 0;
                try
                {
                    equipCount = enrolledEquipment.Count;
                }
                catch
                {
                    equipCount = 0;
                }

                HttpContext.Current.Session.Add("EquipCount", equipCount);

                try
                {
                    DateTime now = DateTime.Now;
                    HttpCookie cookieEquipCount = new HttpCookie("EquipCount");
                    cookieEquipCount.Value = equipCount.ToString();
                    cookieEquipCount.Expires = now.AddDays(30);
                    HttpContext.Current.Response.Cookies.Add(cookieEquipCount);
                }
                catch { }

                return enrolledEquipment;
            }
            catch
            {
                //handle error
                int equipCount = 0;
                HttpContext.Current.Session.Add("EquipCount", equipCount);

                try
                {
                    DateTime now = DateTime.Now;
                    HttpCookie cookieEquipCount = new HttpCookie("EquipCount");
                    cookieEquipCount.Value = equipCount.ToString();
                    cookieEquipCount.Expires = now.AddDays(30);
                    HttpContext.Current.Response.Cookies.Add(cookieEquipCount);
                }
                catch { }

                return null;
            }
        }

        //function for getting all the equipments
        public static List<EquipmentObject> GetAllEquipments()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "equipment/selectAllEquipment";
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                if (result.Contains("\"EquipType\":\"None\""))
                {
                    result = result.Replace("\"EquipType\":\"None\"", "\"EquipType\":\"0\"");
                }

                List<EquipmentObject> equipments = new List<EquipmentObject>();

                equipments = Deserialize<List<EquipmentObject>>(result);

                for (int i = equipments.Count - 1; i > -1; i--)
                {
                    int typeID = 0;
                    try
                    {
                        typeID = equipments[i].EquipType;
                    }
                    catch
                    {
                        typeID = 0;
                    }
                    
                    string type = EquipmentModels.GetEquipmentTypeByID(typeID);
                    //this will be used to remove the equipment from the list
                    //if the feature is currently disabled based on the config
                    foreach (var entry in isEquipmentEnabled)
                    {
                        if (entry.Value.IsEnabled == false && type == entry.Value.Type)
                        {
                            equipments.RemoveAt(i);
                        }
                    }
                }

                return equipments;
            }
            catch
            {
                return null;
            }
        }

        //function for getting all the equipments
        public static List<EquipmentObject> GetAllEquipmentsWithGroup()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "equipment/selectAllEquipmentWithGroup";
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                if (result.Contains("\"EquipType\":\"None\""))
                {
                    result = result.Replace("\"EquipType\":\"None\"", "\"EquipType\":\"0\"");
                }

                List<EquipmentObject> equipments = new List<EquipmentObject>();

                equipments = Deserialize<List<EquipmentObject>>(result);

                for (int i = equipments.Count - 1; i > -1; i--)
                {
                    int typeID = 0;
                    try
                    {
                        typeID = equipments[i].EquipType;
                    }
                    catch
                    {
                        typeID = 0;
                    }

                    string type = EquipmentModels.GetEquipmentTypeByID(typeID);
                    //this will be used to remove the equipment from the list
                    //if the feature is currently disabled based on the config
                    foreach (var entry in isEquipmentEnabled)
                    {
                        if (entry.Value.IsEnabled == false && type == entry.Value.Type)
                        {
                            equipments.RemoveAt(i);
                        }
                    }
                }

                return equipments;
            }
            catch
            {
                return null;
            }
        }

        //function for getting all the users
        public static List<UserObject> GetAllUsers()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/selectAllUser";
                URL = string.Format(URL);

                //execute and handle the result
                result = webclient.DownloadString(URL);

                List<UserObject> users = new List<UserObject>();

                users = Deserialize<List<UserObject>>(result);

                return users;
            }
            catch
            {
                return null;
            }
        }

        //function for getting user by id
        public static UserObject GetUserByID(string username)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "user/selectUser?Username=" + username;
                URL = string.Format(URL);

                //execute and handle the result
                result = webclient.DownloadString(URL);
                UserObject user = new UserObject();

                user = Deserialize<UserObject>(result);

                return user;
            }
            catch
            {
                return null;
            }
        }

        //function for getting equipment status
        public static string GetEquipmentStatus(string Equipment)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "equipment/getEquipmentStatus?Equipment=" + Equipment;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                EquipmentStatus equipmentStatus = new EquipmentStatus();

                equipmentStatus = Deserialize<EquipmentStatus>(result);

                if (equipmentStatus.Status == null || equipmentStatus.Status == "None")
                {
                    return "OFFLINE";
                }
                else
                {
                    return equipmentStatus.Status;
                }
            }
            catch
            {
                return "OFFLINE";
            }
        }

        //function for getting equipment status tcp
        public static string GetEquipmentStatusTCP(string Equipment, string Port)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "opc/getStatus?Equipment=" + Equipment + "&Port=" + Port;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                DefaultReturnObj obj = Deserialize<DefaultReturnObj>(result);

                string status = "";

                if (obj.Result.ToString().ToUpper() == "TRUE")
                {
                    status = "ONLINE";
                }
                else
                {
                    status = "OFFLINE";
                }

                return status;
            }
            catch
            {
                return "OFFLINE";
            }
        }

        //function for updating user-equipment
        public static string UpdateUserEquipment(string ID, string Username, string Equipment, string hostID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "ID" + '"' + ":" + '"' + ID + '"' + ",";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "HostID" + '"' + ":" + '"' + hostID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "userEquipment/" + "updateUserEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Enrollment", "Updated Enrollment - ID: " + ID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for deleting user-equipment
        public static string DeleteUserEquipment(string ID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "ID" + '"' + ":" + '"' + ID + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "userEquipment/" + "deleteUserEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Enrollment", "Deleted Enrollment - ID: " + ID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for adding user-equipment
        public static string AddUserEquipment(string Username, string Equipment, string Host)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + Username + '"' + ",";
                json += '"' + "HostID" + '"' + ":" + '"' + Host + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + "}";

                //init the web client
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "userEquipment/" + "createUserEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Enrollment", "Added Enrollment - Username: " + Username + ", Equipment: " + Equipment, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for adding equipment
        public static string AddEquipment(string equipmentID, string model, string serialNumber, string ip, string port, string deviceID, string type, string hostID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "EquipID" + '"' + ":" + '"' + equipmentID + '"' + ",";
                json += '"' + "Model" + '"' + ":" + '"' + model + '"' + ",";
                json += '"' + "SerialNumber" + '"' + ":" + '"' + serialNumber + '"' + ",";
                json += '"' + "Data" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "IP" + '"' + ":" + '"' + ip + '"' + ",";
                json += '"' + "Port" + '"' + ":" + '"' + port + '"' + ",";
                json += '"' + "HostID" + '"' + ":" + '"' + hostID + '"' + ",";
                json += '"' + "DeviceID" + '"' + ":" + '"' + deviceID + '"' + ",";
                json += '"' + "Type" + '"' + ":" + '"' + type + '"' + "}";

                //init the web client
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "equipment/" + "createEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Machine Settings", "Added Equipment - Equipment: " + equipmentID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for updating equipment
        public static string UpdateEquipment(string equipmentID, string model, string serialNumber, string ip, string port, string deviceID, string type, string hostID, string ID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "ID" + '"' + ":" + '"' + ID + '"' + ",";
                json += '"' + "EquipID" + '"' + ":" + '"' + equipmentID + '"' + ",";
                json += '"' + "Model" + '"' + ":" + '"' + model + '"' + ",";
                json += '"' + "SerialNumber" + '"' + ":" + '"' + serialNumber + '"' + ",";
                json += '"' + "Data" + '"' + ":" + '"' + "" + '"' + ",";
                json += '"' + "IP" + '"' + ":" + '"' + ip + '"' + ",";
                json += '"' + "Port" + '"' + ":" + '"' + port + '"' + ",";
                json += '"' + "HostID" + '"' + ":" + '"' + hostID + '"' + ",";
                json += '"' + "DeviceID" + '"' + ":" + '"' + deviceID + '"' + ",";
                json += '"' + "Type" + '"' + ":" + '"' + type + '"' + "}";

                //init the web client
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "equipment/" + "updateEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Machine Settings", "Updated Equipment - ID: " + ID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for deleting equipment
        public static string DeleteEquipment(string equipmentID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "ID" + '"' + ":" + '"' + equipmentID + '"' + "}";

                //init the web client
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute and handle the result
                result = webclient.UploadString(WebServiceUrl + "equipment/" + "deleteEquipment", "POST", json);
                Default output = new Default();

                output = Deserialize<Default>(result);

                if (Convert.ToBoolean(output.Result) == true)
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Machine Settings", "Deleted Equipment - ID: " + equipmentID, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.Result;
            }
            catch
            {
                return null;
            }
        }

        //function for checking session and cookie for user login status
        public static bool CheckSession()
        {
            //get the session and cookie and handle the result
            try
            {
                //reinitialize the machine configuration
                ReInitMachine();

                string sessionUsername = "";
                try
                {
                    sessionUsername = HttpContext.Current.Session["Username"].ToString();
                }
                catch
                {
                    sessionUsername = "";
                }

                string cookie = "";
                try
                {
                    cookie = HttpContext.Current.Request.Cookies["Username"].Value.ToString();
                }
                catch
                {
                    cookie = "";
                }

                if (sessionUsername == "" || sessionUsername == null)
                {
                    if (cookie != null && cookie != "")
                    {
                        HttpContext.Current.Session["Username"] = cookie;

                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public static Task<bool> CheckSessionAsync()
        {
            //get the session and cookie and handle the result
            try
            {
                //reinitialize the machine configuration
                ReInitMachine();

                string sessionUsername = "";
                try
                {
                    sessionUsername = HttpContext.Current.Session["Username"].ToString();
                }
                catch
                {
                    sessionUsername = "";
                }

                string cookie = "";
                try
                {
                    cookie = HttpContext.Current.Request.Cookies["Username"].Value.ToString();
                }
                catch
                {
                    cookie = "";
                }

                if (sessionUsername == "" || sessionUsername == null)
                {
                    if (cookie != null && cookie != "")
                    {
                        HttpContext.Current.Session["Username"] = cookie;

                        return Task.FromResult(true);
                    }
                    else
                    {
                        return Task.FromResult(false);
                    }
                }
                else
                {
                    return Task.FromResult(true);
                }
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        //Generic type deserializer
        public static T Deserialize<T>(string json)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(json);
            }
            catch
            {
                return default(T);
            }
        }

        public static List<WIPColumn> GetWIPColumns(string LotNo, string Equipment, string ServiceType, string UserID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/getwipdatacolumns?Equipment=" + Equipment + "&LotNo=" + LotNo + "&ServiceName=" + ServiceType + "&UserID=" + UserID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                List<WIPColumn> columns = new List<WIPColumn>();

                columns = Deserialize<List<WIPColumn>>(result);

                return columns;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar wip data
        public static string WIPData(string LotNo, string Equipment, string ServiceType, List<string> lstField, List<string> lstValue, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + ",";
                json += '"' + "ServiceName" + '"' + ":" + '"' + ServiceType + '"' + ",";
                json += '"' + "lstField" + '"' + ":" + '"' + string.Join(",", lstField) + '"' + ",";
                json += '"' + "lstValue" + '"' + ":" + '"' + string.Join(",", lstValue) + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "submitwipdata", "POST", json);

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Data Collection", "Data Collection Successful - User ID: " + UserID + ", Lot Number: " + LotNo, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        public static List<MaterialLot> GetMaterial(string Equipment, string UserID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/getMaterial?Equipment=" + Equipment + "&UserID=" + UserID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                List<MaterialLot> materials = new List<MaterialLot>();

                materials = Deserialize<List<MaterialLot>>(result);

                return materials;
            }
            catch
            {
                return null;
            }
        }

        public static MaterialLot GetMaterialInfo(string MaterialLot, string UserID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/material_info?MaterialLot=" + MaterialLot + "&UserID=" + UserID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                MaterialLot material = new MaterialLot();

                material = Deserialize<MaterialLot>(result);

                return material;
            }
            catch
            {
                return null;
            }
        }

        public static string GetUTC()
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "general/getUTC";
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                UTCOffset utc = new UTCOffset();

                utc = Deserialize<UTCOffset>(result);

                return utc.UTC;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar material setup
        public static string SubmitMaterialSetup(string Equipment, List<string> lstMaterialLot, List<string> lstDesc, List<string> lstMaterialPart, List<string> lstRev, List<string> lstROR, List<string> lstQty, List<string> lstQty2, List<string> lstThawingTimestamp, List<string> lstWithdrawalTimestamp, List<string> lstExpiryTimestamp, string Comment, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";

                int count = 0;
                string materialLot = "";
                if (lstMaterialLot != null)
                {
                    foreach (var x in lstMaterialLot)
                    {
                        if (count == lstMaterialLot.Count - 1)
                        {
                            materialLot += x;
                        }
                        else
                        {
                            materialLot += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstMaterialLot" + '"' + ":" + '"' + materialLot + '"' + ",";
                }

                count = 0;
                string desc = "";
                if(lstDesc != null)
                {
                    foreach (var x in lstDesc)
                    {
                        if (count == lstDesc.Count - 1)
                        {
                            desc += x;
                        }
                        else
                        {
                            desc += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstDesc" + '"' + ":" + '"' + desc + '"' + ",";
                }

                count = 0;
                string materialPart = "";
                if(lstMaterialPart != null)
                {
                    foreach (var x in lstMaterialPart)
                    {
                        if (count == lstMaterialPart.Count - 1)
                        {
                            materialPart += x;
                        }
                        else
                        {
                            materialPart += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstName" + '"' + ":" + '"' + materialPart + '"' + ",";
                }
                
                count = 0;
                string rev = "";
                if(lstRev != null)
                {
                    foreach (var x in lstRev)
                    {
                        if (count == lstRev.Count - 1)
                        {
                            rev += x;
                        }
                        else
                        {
                            rev += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstRev" + '"' + ":" + '"' + rev + '"' + ",";
                }

                count = 0;
                string ROR = "";
                if(lstROR != null)
                {
                    foreach (var x in lstROR)
                    {
                        if (count == lstROR.Count - 1)
                        {
                            ROR += x;
                        }
                        else
                        {
                            ROR += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstROR" + '"' + ":" + '"' + ROR + '"' + ",";
                }

                count = 0;
                string Qty = "";
                if(lstQty != null)
                {
                    foreach (var x in lstQty)
                    {
                        if (count == lstQty.Count - 1)
                        {
                            Qty += x;
                        }
                        else
                        {
                            Qty += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstQty" + '"' + ":" + '"' + Qty + '"' + ",";
                }

                count = 0;
                string Qty2 = "";
                if(lstQty2 != null)
                {
                    foreach (var x in lstQty2)
                    {
                        if (count == lstQty2.Count - 1)
                        {
                            Qty2 += x;
                        }
                        else
                        {
                            Qty2 += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstQty2" + '"' + ":" + '"' + Qty2 + '"' + ",";
                }

                count = 0;
                string thawing = "";
                if(lstThawingTimestamp != null)
                {
                    foreach (var x in lstThawingTimestamp)
                    {
                        if (count == lstThawingTimestamp.Count - 1)
                        {
                            thawing += x;
                        }
                        else
                        {
                            thawing += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstThawingTimestamp" + '"' + ":" + '"' + thawing + '"' + ",";
                }
                
                count = 0;
                string withdrawal = "";
                if(lstWithdrawalTimestamp != null)
                {
                    foreach (var x in lstWithdrawalTimestamp)
                    {
                        if (count == lstWithdrawalTimestamp.Count - 1)
                        {
                            withdrawal += x;
                        }
                        else
                        {
                            withdrawal += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstWithdrawalTimestamp" + '"' + ":" + '"' + withdrawal + '"' + ",";
                }

                count = 0;
                string expiry = "";
                if(lstExpiryTimestamp != null)
                {
                    foreach (var x in lstExpiryTimestamp)
                    {
                        if (count == lstExpiryTimestamp.Count - 1)
                        {
                            expiry += x;
                        }
                        else
                        {
                            expiry += x + ",";
                        }

                        count++;
                    }
                    json += '"' + "lstExpiryTimestamp" + '"' + ":" + '"' + expiry + '"' + ",";
                }

                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + Comment + '"';

                json += "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "materialsetup_submit", "POST", json);

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Material Setup", "Material Setup Successful - User ID: " + UserID + ", Equipment: " + Equipment, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        public static CamstarEquipmentStatus GetCamstarInitialStatus(string Equipment, string UserID)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //init the url
                URL = WebServiceUrl + "camstar/getCamstarEquipmentStatus?Equipment=" + Equipment + "&UserID=" + UserID;
                URL = string.Format(URL);

                //execute the service and handle the result
                result = webclient.DownloadString(URL);

                CamstarEquipmentStatus status = new CamstarEquipmentStatus();

                status = Deserialize<CamstarEquipmentStatus>(result);

                return status;
            }
            catch
            {
                return null;
            }
        }

        public static List<CamstarEquipmentStatus> PopulateCamstarEquipmentStatus(string Equipment, string UserID, string Status, string Type)
        {
            try
            {
                //init the web client
                var webclient = new WebClient();
                string result = "";

                //init the webclient
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                string json = "";
                json += "{";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "StatusReason" + '"' + ":" + '"' + Status + '"' + ",";
                json += '"' + "Type" + '"' + ":" + '"' + Type + '"';
                json += "}";

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "populateEquipmentStatusDropdown", "POST", json);

                List<CamstarEquipmentStatus> status = new List<CamstarEquipmentStatus>();

                status = Deserialize<List<CamstarEquipmentStatus>>(result);

                return status;
            }
            catch
            {
                return null;
            }
        }

        //function for camstar equipment status
        public static string SubmitCamstarEquipmentStatus(string Equipment, string statusCode, string statusReason, string Comment, string UserID)
        {
            try
            {
                string result = "";
                string json = "";

                //create the json object
                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + UserID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "StatusCode" + '"' + ":" + '"' + statusCode + '"' + ",";
                json += '"' + "StatusReason" + '"' + ":" + '"' + statusReason + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + Comment + '"' + "}";

                //init the webclient
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                //webclient.Encoding = Encoding.UTF8;
                

                //execute the webservice and handle the result
                result = webclient.UploadString(WebServiceUrl + "camstar/" + "submitCamstarEquipmentStatus", "POST", json);

                var bytes = Encoding.Default.GetBytes(result);
                var correctString = Encoding.UTF8.GetString(bytes);
                result = correctString;

                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                if (output.RESULT.ToUpper().Contains("SUCCESS"))
                {
                    string[] computer_name = Dns.GetHostEntry(HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]).HostName.Split(new Char[] { '.' });
                    string HostName = computer_name[0].ToString().ToUpper();
                    string IP = GetIPAddress();
                    AuditModel.AddLog("Set Status", "Equipment Set Status Successful - User ID: " + UserID + ", Equipment: " + Equipment, HostName, IP, HttpContext.Current.Session["Username"].ToString());
                }

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }
    }
}