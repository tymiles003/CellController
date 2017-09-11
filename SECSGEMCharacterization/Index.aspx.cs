using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Xml.Linq;
using System.Web.Script.Serialization;
using System.IO;
using System.Xml.Serialization;
using System.Web.Helpers;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace SECSGEMCharacterization
{
    public partial class Index : System.Web.UI.Page
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string BASE_URL = ConfigurationManager.AppSettings[env + "_" + "IgnitionWebService"].ToString();
        public static string connString = ConfigurationManager.ConnectionStrings[env + "_" + "myConn"].ToString();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                PopulateEquipment();
                PopulateSECS();
                SelectDD();
                trVariable.Visible = false;
                RefreshMessages();

                lblServer.Text = BASE_URL;

                ////for testing generic type
                //Equipment eq = new Equipment();
                //eq = test<Equipment>();
                //Response.Write("TEST: " + eq.ID.ToString());


                //                string xml = @"<Equipment xmlns=""http://schemas.datacontract.org/2004/07/AMPI.WCF"" xmlns:i=""http://www.w3.org/2001/XMLSchema-instance"">
                //                            <Data>testdata</Data>
                //                            <DeviceID>testdevice</DeviceID>
                //                            <HostID>testhost</HostID>
                //                            <ID>TESTID</ID>
                //                            <IP>testip</IP>
                //                            <Model>testmodel</Model>
                //                            <Port>testport</Port>
                //                            <SerialNumber>testserial</SerialNumber>
                //                            <TimeStamp>2016-07-20T15:06:51</TimeStamp>
                //                            </Equipment>";
                //                Equipment eq2 = new Equipment();
                //                eq2 = DeserializeXML_Single2<Equipment>(xml);
                //                Response.Write(eq2.ID.ToString());

                //byte[] bytes = Encoding.ASCII.GetBytes("test");
                //var temp =  BitConverter.ToString(bytes);
                //Response.Write(temp);

                //Response.Write("<br/>");
                //var temp2 = Encoding.ASCII.GetString(bytes);
                //Response.Write(temp2);

                //Response.Write("<br/>");
                //byte[] bytes2 = Encoding.ASCII.GetBytes(temp2);
                //var temp3 = BitConverter.ToString(bytes2);
                //Response.Write(temp3);

                //Response.ContentType = "text/html";
                //Response.Charset = null;
                //Response.Write("\\u0003");
            }
        }

        //for testing generic type
        public T test<T>()
        {
            try
            {
                var webclient = new WebClient();
                var data = string.Format(BASE_URL + "find?id={0}", "TESTID");
                data = webclient.DownloadString(data);

                if (data == @"{""Result"":""NULL""}")
                {
                    return default(T);
                }
                else
                {
                    var js = new JavaScriptSerializer();
                    return js.Deserialize<T>(data);
                }
            }
            catch
            {
                return default(T);
            }
        }

        //for testing generic type
        public T DeserializeXML_Single2<T>(string XML)
        {
            string xmlResultString = XML;
            var doc = XDocument.Parse(xmlResultString);

            foreach (var element in doc.Descendants())
            {
                element.Attributes().Where(a => a.IsNamespaceDeclaration).Remove();
                element.Name = element.Name.LocalName;
            }
            xmlResultString = doc.ToString();
            var rdr = new StringReader(xmlResultString);
            var serializer = new XmlSerializer(typeof(T));
            return (T)serializer.Deserialize(rdr);
        }

        private void RefreshMessages(string Equipment = null)
        {
            string query = "";

            if (Equipment == null || Equipment == "")
            {
                query = "SELECT TOP 50 ID as 'ID', Equipment as 'Equipment', StreamFunction as 'SF', Direction as 'Direction', RequestResponse as 'Type', CommonID as 'Common ID', TxID as 'Transaction ID', Reply as 'Reply', Message as 'Message', TimeSentReceived as 'Time Stamp' from Messages order by TimeSentReceived desc";
            }
            else
            {
                query = "SELECT TOP 50 ID as 'ID', Equipment as 'Equipment', StreamFunction as 'SF', Direction as 'Direction', RequestResponse as 'Type', CommonID as 'Common ID', TxID as 'Transaction ID', Reply as 'Reply', Message as 'Message', TimeSentReceived as 'Time Stamp' from Messages where Equipment='" + Equipment + "' order by TimeSentReceived desc";
            }

            SqlConnection conn = new SqlConnection(connString);
            conn.Open();
            SqlCommand cmd = new SqlCommand(query, conn);

            DataTable dt = new DataTable();
            dt.Load(cmd.ExecuteReader());

            conn.Close();
            conn.Dispose();
            cmd.Dispose();

            gvMessage.DataSource = dt;
            gvMessage.DataBind();
        }

        private void SelectDD()
        {
            ListItem selectedListItem = ddSECS.Items.FindByValue("S1F1");

            if (selectedListItem != null)
            {
                selectedListItem.Selected = true;
            }
        }

        private void PopulateSECS()
        {
            ddSECS.Items.Add(new ListItem("S1F1 (Are You There Request)", "S1F1"));
            ddSECS.Items.Add(new ListItem("S1F13 (Establish Communications Request)", "S1F13"));
            ddSECS.Items.Add(new ListItem("S1F17 (Request ON-LINE)", "S1F17"));
            ddSECS.Items.Add(new ListItem("S1F3 (Selected Equipment Status Request)", "S1F3"));
            //ddSECS.Items.Add(new ListItem("S1F1 (Are You There Request)", "S1F1"));
            ddSECS.Items.Add(new ListItem("S1F15 (Request OFF-LINE)", "S1F15"));
            //ddSECS.Items.Add(new ListItem("S1F11 (Status Variable Namelist Request)", "S1F11"));
            //ddSECS.Items.Add(new ListItem("S2F13 (Equipment Constant Request)", "S2F13"));
            //ddSECS.Items.Add(new ListItem("S2F29 (Equipment Constant Namelist Request)", "S2F29"));
            ddSECS.Items.Add(new ListItem("S2F15 (New Equipment Constant Send)", "S2F15"));
            ddSECS.Items.Add(new ListItem("S2F17 (Date and Time Request)", "S2F17"));
            ddSECS.Items.Add(new ListItem("S2F31 (Date and Time Set Request)", "S2F31"));
            ddSECS.Items.Add(new ListItem("S2F41 (Host Command Send)", "S2F41"));
            ddSECS.Items.Add(new ListItem("S7F1 (Process Program Load Inquire)", "S7F1"));
            ddSECS.Items.Add(new ListItem("S7F3 (Process Program Send)", "S7F3"));
            ddSECS.Items.Add(new ListItem("S7F5 (Process Program Request)", "S7F5"));
            ddSECS.Items.Add(new ListItem("S7F17 (Process Program Delete)", "S7F17"));
            ddSECS.Items.Add(new ListItem("S7F19 (Process Program Directory Request)", "S7F19"));
            ddSECS.Items.Add(new ListItem("S2F37 (Disable Collection)", "S2F37_DISABLE"));
            ddSECS.Items.Add(new ListItem("S2F37 (Enable Collection)", "S2F37_ENABLE"));
            ddSECS.Items.Add(new ListItem("S2F33 (Delete Report)", "S2F33_DELETE"));
            ddSECS.Items.Add(new ListItem("S2F35 (Unlink Collection)", "S2F35_UNLINK"));
            ddSECS.Items.Add(new ListItem("S2F33 (Add IDs to Report)", "S2F33_ADD"));
            ddSECS.Items.Add(new ListItem("S2F35 (Link Collection)", "S2F35_LINK"));

            SortListControl(ddSECS, true);
        }

        public static void SortListControl(ListControl control, bool isAscending)
        {
            List<ListItem> collection;

            if (isAscending)
                collection = control.Items.Cast<ListItem>()
                    .Select(x => x)
                    .OrderBy(x => x.Text)
                    .ToList();
            else
                collection = control.Items.Cast<ListItem>()
                    .Select(x => x)
                    .OrderByDescending(x => x.Text)
                    .ToList();

            control.Items.Clear();

            foreach (ListItem item in collection)
                control.Items.Add(item);
        }


        private void PopulateEquipment()
        {
            string query = "SELECT case when Prefix='' or Prefix is null then Equipment else Equipment + ' (' + Prefix + ')' end as 'Equipment',case when Prefix='' or Prefix is null then 'NULL_' + Equipment else Prefix end as 'Prefix', Status, SDLFile from SECSGEM_EquipmentInfo";

            SqlConnection conn = new SqlConnection(connString);
            conn.Open();
            SqlCommand cmd = new SqlCommand(query, conn);

            DataTable dt = new DataTable();
            dt.Load(cmd.ExecuteReader());

            conn.Close();
            conn.Dispose();
            cmd.Dispose();

            foreach (DataRow dr in dt.Rows)
            {
                ddEquipment.Items.Add(new ListItem(dr["Equipment"].ToString(), dr["Prefix"].ToString()));
            }
        }

        private dynamic ReadJSON(string json)
        {
            dynamic JSON = System.Web.Helpers.Json.Decode(json);
            return JSON;
        }

        protected void btnSend_Click(object sender, EventArgs e)
        {
            string dataSource = "CellController";
            string prefix = "";
            string equipment = "";
            string body = "";
            string id = "";
            string format = "";
            string value = "";
            string date = "";

            string SECS = ddSECS.SelectedValue.ToString();

            if (SECS == "S2F31")
            {
                string temp = DateTime.Now.ToString("yyMMddHHmmss");
                date = temp;
            }

            if (SECS == "S1F3" || SECS == "S1F11" || SECS == "S2F13" || SECS == "S2F29" || SECS == "S2F15")
            {
                string temp = string.Empty;

                //for (int i = 0; i < chkVariable.Items.Count; i++)
                //{
                //    if (chkVariable.Items[i].Selected)
                //    {
                //        temp += chkVariable.Items[i].Value + ",";
                //    }
                //}

                temp = txtVariable.Text;
                //temp += ")";
                //temp = temp.Replace(",)", "");
                body = temp;
                id = temp;

                //if (temp == ")")
                if (temp == "")
                {
                    //ClientScript.RegisterStartupScript(GetType(), "js1", "alert('Pls select at least 1 Variable!');", true);
                    ClientScript.RegisterStartupScript(GetType(), "js1", "alert('Pls enter variable!');", true);
                    return;
                }
                else
                {
                    if (SECS == "S2F15")
                    {
                        if (id.Contains("200") && txtTimeFormat.Text == "")
                        {
                            ClientScript.RegisterStartupScript(GetType(), "js2", "alert('Pls input Time Format!');", true);
                            return;
                        }

                        if (id.Contains("200"))
                        {
                            format += "U4" + ",";
                            value += txtTimeFormat.Text + ",";
                        }

                        try
                        {
                            int count = Convert.ToInt32(txtTimeFormat.Text);
                        }
                        catch
                        {
                            ClientScript.RegisterStartupScript(GetType(), "js3", "alert('Input is numeric only!');", true);
                            return;
                        }

                        if (id.Contains("201") && txtTimeout.Text == "")
                        {
                            ClientScript.RegisterStartupScript(GetType(), "js4", "alert('Pls input Timeout!');", true);
                            return;
                        }

                        if (id.Contains("201"))
                        {
                            format += "U2" + ",";
                            value += txtTimeout.Text + ",";
                        }

                        try
                        {
                            int count = Convert.ToInt32(txtTimeout.Text);
                        }
                        catch
                        {
                            ClientScript.RegisterStartupScript(GetType(), "js5", "alert('Input is numeric only!');", true);
                            return;
                        }

                        format += ")";
                        format = format.Replace(",)", "");
                        value += ")";
                        value = value.Replace(",)", "");
                    }
                }
            }

            string filename = "";
            string bodyFormat = "";
            int fileLength;
            byte[] input;

            if (SECS == "S7F3")
            {
                filename = fileUploadRecipe.FileName.ToString();
                string FileExtension = System.IO.Path.GetExtension(fileUploadRecipe.FileName);
                
                if(FileExtension != "" && FileExtension != null)
                {
                    filename = filename.Replace(FileExtension, "");
                }

                bodyFormat = txtFormat.Text.ToString().Trim().ToUpper();
            }

            if (filename == "" && SECS == "S7F3")
            {
                ClientScript.RegisterStartupScript(GetType(), "filealert1", "alert('Please upload a file!');", true);
                return;
            }
            else if (bodyFormat == "" && SECS == "S7F3")
            {
                ClientScript.RegisterStartupScript(GetType(), "filealert1", "alert('Please enter format!');", true);
                return;
            }
            else if (filename != "" && SECS == "S7F3")
            {
                fileLength = fileUploadRecipe.PostedFile.ContentLength;
                input = new byte[fileLength - 1];
                input = fileUploadRecipe.FileBytes;
            }
            else
            {
                input = null;
            }

            //Response.Write(id + "<br/>");
            //Response.Write(format + "<br/>");
            //Response.Write(value + "<br/>");
            //Response.Write(body + "<br/>");

            var webclient = new WebClient();

            if (SECS == "S7F3" && filename != "" && bodyFormat != "")
            {
                string json = "";

                string B64 = Convert.ToBase64String(input);

                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                json = "{" + '"' + "Data" + '"' + ":" + '"' + B64 + '"' + "}";

                string URL = BASE_URL + "secsgem/S7F3_ProcessProgramSend?Equipment=" + equipment + "&PPID=" + filename + "&Format=" + bodyFormat;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var data = webclient.UploadString(URL, "POST", json);

                //Response.Write(data + "<br/>");

                if (data == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                    //ClientScript.RegisterStartupScript(GetType(), "hwa1", "alert('Equipment Unreachable!');", true);
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = data;
                    lblJSON.ForeColor = System.Drawing.Color.Green;

                    //dynamic json = ReadJSON(data);
                    //Response.Write("VAL: " + json.body[0].format);
                    //Response.Write("JSON: " + json.ToString());

                    //ClientScript.RegisterStartupScript(GetType(), "hwa2", "alert('Equipment Reachable!');", true);
                }
            }
            else if (SECS == "S7F5")
            {
                if (txtPPID.Text == "")
                {
                    ClientScript.RegisterStartupScript(GetType(), "filealert1", "alert('Please enter PPID!');", true);
                    return;
                }

                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string URL = BASE_URL + "secsgem/S7F5_ProcessProgramRequest?Equipment=" + equipment + "&PPID=" + txtPPID.Text;
                URL = string.Format(URL);
                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var data = string.Format(URL);

                data = webclient.DownloadString(data);

                if (data == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = data;
                    lblJSON.ForeColor = System.Drawing.Color.Green;


                    bool result = false;

                    try
                    {
                        result = createMainDirectory();

                        if (result == true)
                        {
                            try
                            {
                                result = createRecipeDirectory();
                            }
                            catch
                            {
                                result = false;
                            }
                        }
                    }
                    catch
                    {
                        result = false;
                    }

                    if (result == true)
                    {
                        string PPID = "";
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
                            string recipePath = ConfigurationManager.AppSettings[env + "_" + "subDirectory"].ToString();
                            string fullPath = recipePath + "\\" + PPID;
                            string base64String = PPBODY;
                            byte[] myByte = Convert.FromBase64String(base64String);
                            //File.WriteAllBytes(fullPath, myByte);

                            Response.AddHeader("content-disposition", "attachment;filename=" + PPID);
                            Response.ContentType = "application/octet-stream";
                            Response.BinaryWrite(myByte);
                            Response.End();
                        }
                    }
                }
            }
            else if (SECS == "S2F37_ENABLE")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtCEID_ENABLE.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F37_EnableDisableEventReport?Equipment=" + equipment + "&CEIDFormat=" + txtCEIDFormat_ENABLE.Text + "&isEnabled=1";

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F37_DISABLE")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtCEID_DISABLE.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F37_EnableDisableEventReport?Equipment=" + equipment + "&CEIDFormat=" + txtCEIDFormat_DISABLE.Text + "&isEnabled=0";

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F33_DELETE")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtRPTID_DELETE.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F33_DeleteReport?Equipment=" + equipment + "&RPTIDFormat=" + txtRPTIDFormat_DELETE.Text + "&DATAIDFormat=" + txtDATAIDFormat_DELETE.Text;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F33_ADD")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtRPTID_ADD.Text + '"' + ",";
                json += '"' + "ID" + '"' + ":" + '"' + txtID_ADD.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F33_AddToReport?Equipment=" + equipment + "&DATAIDFormat=" + txtDATAIDFormat_ADD.Text + "&RPTIDFormat=" + txtRPTIDFormat_ADD.Text + "&IDVariable=" + txtVARIABLEID_ADD.Text + "&IDFormat=" + txtIDFormat_ADD.Text;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F35_UNLINK")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtCEID_UNLINK.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F35_UnlinkReport?Equipment=" + equipment + "&CEIDFormat=" + txtCEIDFormat_UNLINK.Text + "&DATAIDFormat=" + txtDATAIDFormat_UNLINK.Text;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F35_LINK")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtCEID_LINK.Text + '"' + ",";
                json += '"' + "ID" + '"' + ":" + '"' + txtRPTID_LINK.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S2F35_LinkReport?Equipment=" + equipment + "&CEIDFormat=" + txtCEIDFormat_LINK.Text + "&DATAIDFormat=" + txtDATAIDFormat_LINK.Text + "&RPTIDFormat=" + txtRPTIDFormat_LINK.Text;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S2F41" && txtCPNAME.Text.Trim() != "")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string URL = BASE_URL + "secsgem/S2F41_GENERIC?Equipment=" + equipment + "&Command=" + txtCommand.Text + "&CPName=" + txtCPNAME.Text + "&CPVal=" + txtCPVAL.Text;

                var data = string.Format(URL);

                try
                {
                    data = webclient.DownloadString(data);
                }
                catch
                {
                    data = "NULL";
                }

                if (data == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = data;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else if (SECS == "S7F1")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string filename_S7F1 = FileUpload_S7F1.FileName.ToString();
                string length_format_S7F1 = txtLengthFormat_S7F1.Text.ToUpper();

                if (filename_S7F1 == "")
                {
                    ClientScript.RegisterStartupScript(GetType(), "filealert1", "alert('Please upload a file!');", true);
                    return;
                }

                string FileExtension_S7F1 = System.IO.Path.GetExtension(FileUpload_S7F1.FileName);

                if (FileExtension_S7F1 != "" && FileExtension_S7F1 != null)
                {
                    filename_S7F1 = filename_S7F1.Replace(FileExtension_S7F1, "");
                }

                int recipeSize = FileUpload_S7F1.PostedFile.ContentLength;

                string URL = BASE_URL + "secsgem/S7F1_ProcessProgramLoadInquire?PPID=" + filename_S7F1 + "&Equipment=" + equipment + "&LengthFormat=" + length_format_S7F1 + "&RecipeSize=" + recipeSize.ToString();

                var data = string.Format(URL);

                data = webclient.DownloadString(data);

                //Response.Write("DATA: " + data);

                //return;

                if (data == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                    //ClientScript.RegisterStartupScript(GetType(), "hwa1", "alert('Equipment Unreachable!');", true);
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = data;
                    lblJSON.ForeColor = System.Drawing.Color.Green;

                    //dynamic json = ReadJSON(data);
                    //Response.Write("VAL: " + json.body[0].format);
                    //Response.Write("JSON: " + json.ToString());

                    //ClientScript.RegisterStartupScript(GetType(), "hwa2", "alert('Equipment Reachable!');", true);
                }

            }
            else if (SECS == "S7F17")
            {
                if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                {
                    prefix = "";
                    equipment = ddEquipment.SelectedItem.Text.ToString();
                }
                else
                {
                    prefix = ddEquipment.SelectedItem.Value.ToString();
                    equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                }

                string json = "{" + '"' + "Data" + '"' + ":" + '"' + txtPPID_S7F17.Text + '"' + "}";

                string URL = BASE_URL + "secsgem/S7F17_ProcessProgramDelete?Equipment=" + equipment;

                URL = string.Format(URL);

                webclient.Headers["Content-type"] = "application/json";
                webclient.Encoding = Encoding.UTF8;

                var result = webclient.UploadString(URL, "POST", json);

                if (result == @"{""STATUS"":""FAIL""}")
                {
                    lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblJSON.Text = "NULL";
                    lblJSON.ForeColor = System.Drawing.Color.Red;
                }
                else
                {
                    lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                    lblStatus.ForeColor = System.Drawing.Color.Green;

                    lblJSON.Text = result;
                    lblJSON.ForeColor = System.Drawing.Color.Green;
                }
            }
            else
            {
                try
                {
                    if (ddEquipment.SelectedValue.ToString().Contains("NULL_" + ddEquipment.SelectedItem.Text))
                    {
                        prefix = "";
                        equipment = ddEquipment.SelectedItem.Text.ToString();
                    }
                    else
                    {
                        prefix = ddEquipment.SelectedItem.Value.ToString();
                        equipment = ddEquipment.SelectedItem.Text.ToString().Replace(" (" + prefix + ")", "");
                    }

                    if (SECS == "S2F41")
                    {
                        value = txtCommand.Text;

                        if (value == "")
                        {
                            ClientScript.RegisterStartupScript(GetType(), "filealert1", "alert('Please enter command!');", true);
                            return;
                        }
                    }

                    string URL = BASE_URL + "secsgem/SECSGEM_Generic?secsName=" + SECS + "&datasource=" + dataSource + "&equipment=" + equipment + "&prefix=" + prefix + "&body=" + body + "&id=" + id + "&format=" + format + "&value=" + value + "&date=" + date;

                    //Response.Write("URL: " + URL);
                    //return;

                    var data = string.Format(URL);

                    data = webclient.DownloadString(data);

                    //Response.Write("DATA: " + data);

                    //return;

                    if (data == @"{""STATUS"":""FAIL""}")
                    {
                        lblStatus.Text = "DEVICE COMMUNICATION FAILED";
                        lblStatus.ForeColor = System.Drawing.Color.Red;
                        lblJSON.Text = "NULL";
                        lblJSON.ForeColor = System.Drawing.Color.Red;
                        //ClientScript.RegisterStartupScript(GetType(), "hwa1", "alert('Equipment Unreachable!');", true);
                    }
                    else
                    {
                        lblStatus.Text = "DEVICE COMMUNICATION SUCCESSFUL";
                        lblStatus.ForeColor = System.Drawing.Color.Green;

                        lblJSON.Text = data;
                        lblJSON.ForeColor = System.Drawing.Color.Green;

                        dynamic json = ReadJSON(data);
                        //Response.Write("VAL: " + json.body[0].format);
                        //Response.Write("JSON: " + json.ToString());

                        //ClientScript.RegisterStartupScript(GetType(), "hwa2", "alert('Equipment Reachable!');", true);
                    }
                }
                catch (Exception ex)
                {
                    Response.Write("Error: " + ex.Message + "<br/>");
                }
            }

            RefreshMessages(equipment);
        }

        public static byte[] GetByteArrayFromIntArray(int[] intArray)
        {
            byte[] data = new byte[intArray.Length * 4];
            for (int i = 0; i < intArray.Length; i++)
            {
                Array.Copy(BitConverter.GetBytes(intArray[i]), 0, data, i * 4, 4);
            }
            return data;
        }

        public static int toUnsigned(int num)
        {
            if(num <0)
            {
                return (256 - Math.Abs(num));
            }
            else
            {
                return num;
            }
        }

        protected void ddSECS_SelectedIndexChanged(object sender, EventArgs e)
        {
            trVariable.Visible = false;
            trVariable2.Visible = false;
            trUpload.Visible = false;
            trUpload2.Visible = false;
            trPPID.Visible = false;
            trCommand.Visible = false;
            trS2F37_DISABLE.Visible = false;
            trS2F37_ENABLE.Visible = false;
            trS2F33_DELETE.Visible = false;
            trS2F33_ADD.Visible = false;
            trS2F35_LINK.Visible = false;
            trS2F35_UNLINK.Visible = false;
            trS7F1.Visible = false;
            trS7F17.Visible = false;
            //chkVariable.Items.Clear();

            if (ddSECS.SelectedValue == "S1F3" || ddSECS.SelectedValue == "S1F11")
            {
                trVariable.Visible = true;

                lblVariable.Text = "Status Variable";

                ListItem li1 = new ListItem("Clock", "1", true);
                ListItem li2 = new ListItem("ControlState", "2", true);
                ListItem li3 = new ListItem("EventsEnabled", "3", true);
                ListItem li4 = new ListItem("PPID (DEK - SOLDER PRINT [1019])", "1019", true);
                ListItem li5 = new ListItem("PPID (HELLER - REFLOW OVEN [12000])", "21000", true);
                ListItem li6 = new ListItem("PPID (PANASONIC - COMPONENT ATTACH [32])", "32", true);

                li1.Selected = false;
                li2.Selected = false;
                li3.Selected = false;
                li4.Selected = false;
                li5.Selected = false;
                li6.Selected = false;

                //chkVariable.Items.Add(li1);
                //chkVariable.Items.Add(li2);
                //chkVariable.Items.Add(li3);
                //chkVariable.Items.Add(li4);
                //chkVariable.Items.Add(li5);
                //chkVariable.Items.Add(li6);
            }
            else if (ddSECS.SelectedValue == "S2F13" || ddSECS.SelectedValue == "S2F29" || ddSECS.SelectedValue == "S2F15")
            {
                trVariable.Visible = true;

                if (ddSECS.SelectedValue == "S2F15")
                {
                    trVariable2.Visible = true;
                    lblTimeFormat.Visible = true;
                    lblTimeout.Visible = true;
                    txtTimeFormat.Visible = true;
                    txtTimeout.Visible = true;
                }
                else
                {
                    trVariable2.Visible = false;
                    lblTimeFormat.Visible = false;
                    lblTimeout.Visible = false;
                    txtTimeFormat.Visible = false;
                    txtTimeout.Visible = false;
                }

                lblVariable.Text = "Equipment Constant";

                ListItem li1 = new ListItem("TimeFormat", "200", true);
                ListItem li2 = new ListItem("EstablishCommunicationsTimeout", "201", true);
                li1.Selected = true;
                li2.Selected = true;

                //chkVariable.Items.Add(li1);
                //chkVariable.Items.Add(li2);
            }
            else if(ddSECS.SelectedValue == "S7F3")
            {
                trUpload.Visible = true;
                trUpload2.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S7F5")
            {
                trPPID.Visible = true;
            }
            else if(ddSECS.SelectedValue == "S2F41")
            {
                trCommand.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F37_DISABLE")
            {
                trS2F37_DISABLE.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F37_ENABLE")
            {
                trS2F37_ENABLE.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F33_DELETE")
            {
                trS2F33_DELETE.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F35_UNLINK")
            {
                trS2F35_UNLINK.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F33_ADD")
            {
                trS2F33_ADD.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S2F35_LINK")
            {
                trS2F35_LINK.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S7F1")
            {
                trS7F1.Visible = true;
            }
            else if (ddSECS.SelectedValue == "S7F17")
            {
                trS7F17.Visible = true;
            }
        }

        protected void chkVariable_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddSECS.SelectedValue == "S2F15")
            {
                lblTimeFormat.Visible = false;
                txtTimeFormat.Visible = false;
                lblTimeout.Visible = false;
                txtTimeout.Visible = false;

                //for (int i = 0; i < chkVariable.Items.Count; i++)
                //{
                //    if (chkVariable.Items[i].Selected)
                //    {
                //        if (chkVariable.Items[i].Value == "200")
                //        {
                //            lblTimeFormat.Visible = true;
                //            txtTimeFormat.Visible = true;
                //        }
                //        else if (chkVariable.Items[i].Value == "201")
                //        {
                //            lblTimeout.Visible = true;
                //            txtTimeout.Visible = true;
                //        }
                //    }
                //}
            }
        }

        public static bool createMainDirectory()
        {
            bool exists = false;

            string path = ConfigurationManager.AppSettings[env + "_" + "mainDirectory"].ToString();

            try
            {
                exists = Directory.Exists(path);
            }
            catch
            {
                exists = false;
            }

            bool result = false;

            if (!exists)
            {
                try
                {
                    Directory.CreateDirectory(path);
                    result = true;
                }
                catch
                {
                    result = false;
                }
            }
            else
            {
                result = true;
            }

            return result;
        }

        public static bool createRecipeDirectory()
        {
            bool exists = false;

            string recipePath = ConfigurationManager.AppSettings[env + "_" + "subDirectory"].ToString();

            try
            {
                exists = Directory.Exists(recipePath);
            }
            catch
            {
                exists = false;
            }

            bool result = false;

            if (!exists)
            {
                try
                {
                    Directory.CreateDirectory(recipePath);
                    result = true;
                }
                catch
                {
                    result = false;
                }
            }
            else
            {
                result = true;
            }

            return result;
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            string Equipment = "";
            Equipment = ddEquipment.SelectedValue.ToString().Replace("NULL_", "");
            RefreshMessages(Equipment);
        }
    }
}