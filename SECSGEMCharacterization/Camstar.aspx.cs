using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Web.Script.Serialization;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Configuration;

namespace SECSGEMCharacterization
{
    public partial class Camstar : System.Web.UI.Page
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string BASE_URL = ConfigurationManager.AppSettings[env + "_" + "IgnitionWebService"].ToString();

        protected void Page_Load(object sender, EventArgs e)
        {
            //Response.Write(@"SELECT [RequestTxID], [ResponseTxID], [Equipment], [Message], [Retrieved], [Processed], [AddTime] FROM [dbo].[SECSGEM_NewMessage] where [Message] like '%{""header"":{""stream"":%'");
            if (!IsPostBack)
            {
                lblServer.Text = BASE_URL;
                PopulateDD();
                SelectDD();
                tblLotStat.Visible = false;
                tblAdhoc.Visible = true;
                //lblType.Text = "Lot Status Test";
                lblType.Text = "Adhoc WIP Data Test";
                populateTextBox();
                trIMG.Visible = true;
                //trIMG.Visible = false;
            }
        }

        private void SelectDD()
        {
            ListItem selectedListItem = ddType.Items.FindByValue("Adhoc WIP Data");

            if (selectedListItem != null)
            {
                selectedListItem.Selected = true;
            }
        }

        private void populateTextBox()
        {   
            textbox1.Text = "Lot No.";
            textbox1.Enabled = false;
            textbox2.Text = "1623638DDAL";
            textbox3.Text = "BST_1";
            textbox3.Enabled = false;
            textbox4.Text = "38.21";
            textbox5.Text = "BST_2";
            textbox5.Enabled = false;
            textbox6.Text = "40.02";
            textbox7.Text = "BST_3";
            textbox7.Enabled = false;
            textbox8.Text = "40.72";
            textbox9.Text = "BST_4";
            textbox9.Enabled = false;
            textbox10.Text = "40.21";
            textbox11.Text = "BST_5";
            textbox11.Enabled = false;
            textbox12.Text = "40.7";
            textbox13.Text = "BST_6";
            textbox13.Enabled = false;
            textbox14.Text = "37.97";
            textbox15.Text = "BST_7";
            textbox15.Enabled = false;
            textbox16.Text = "35.83";
            textbox17.Text = "BST_8";
            textbox17.Enabled = false;
            textbox18.Text = "40.31";
            textbox19.Text = "BST_9";
            textbox19.Enabled = false;
            textbox20.Text = "37.83";
            textbox21.Text = "BST_10";
            textbox21.Enabled = false;
            textbox22.Text = "41.4";
            textbox23.Text = "BST_11";
            textbox23.Enabled = false;
            textbox24.Text = "39.04";
            textbox25.Text = "BST_12";
            textbox25.Enabled = false;
            textbox26.Text = "38.17";
            textbox27.Text = "BSFM_1";
            textbox27.Enabled = false;
            textbox28.Text = "4";
            textbox29.Text = "BSFM_2";
            textbox29.Enabled = false;
            textbox30.Text = "4";
            textbox31.Text = "BSFM_3";
            textbox31.Enabled = false;
            textbox32.Text = "4";
            textbox33.Text = "BSFM_4";
            textbox33.Enabled = false;
            textbox34.Text = "4";
            textbox35.Text = "BSFM_5";
            textbox35.Enabled = false;
            textbox36.Text = "4";
            textbox37.Text = "BSFM_6";
            textbox37.Enabled = false;
            textbox38.Text = "4";
            textbox39.Text = "BSFM_7";
            textbox39.Enabled = false;
            textbox40.Text = "4";
            textbox41.Text = "BSFM_8";
            textbox41.Enabled = false;
            textbox42.Text = "4";
            textbox43.Text = "BSFM_9";
            textbox43.Enabled = false;
            textbox44.Text = "4";
            textbox45.Text = "BSFM_10";
            textbox45.Enabled = false;
            textbox46.Text = "4";
            textbox47.Text = "BSFM_11";
            textbox47.Enabled = false;
            textbox48.Text = "4";
            textbox49.Text = "BSFM_12";
            textbox49.Enabled = false;
            textbox50.Text = "4";
            textbox51.Text = "Reason for SPC";
            textbox51.Enabled = false;
            textbox52.Text = "E";
            textbox53.Text = "Comments";
            textbox53.Enabled = false;
            textbox54.Text = "Test";
        }

        private void PopulateDD()
        {
            ddType.Items.Add(new ListItem("Lot Status", "Lot Status"));
            ddType.Items.Add(new ListItem("Adhoc WIP Data", "Adhoc WIP Data"));

            SortListControl(ddType, true);

            ddEquip.Items.Add(new ListItem("WB-088_KNS", "WB-088_KNS"));
            SortListControl(ddEquip, true);
            
            ddSetup.Items.Add(new ListItem("274-SPC-GTS_BST-4W_Standard_Iconn", "274-SPC-GTS_BST-4W_Standard_Iconn"));
            SortListControl(ddSetup, true);
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

        protected void btnLotStat_Click(object sender, EventArgs e)
        {
            string userID = txtUser.Text;
            string URL = BASE_URL + "camstar/lotstatus?LotNo=" + txtLotNo.Text + "&UserID=" + userID;
            
            var data = string.Format(URL);

            var webclient = new WebClient();
            try
            {
                data = webclient.DownloadString(data);
                lblResult.Text = data.ToString();
                lblResult.ForeColor = System.Drawing.Color.Green;
            }
            catch(Exception err)
            {
                lblResult.Text = err.Message.ToString();
                lblResult.ForeColor = System.Drawing.Color.Red;
            }
        }

        protected void ddType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddType.SelectedValue.ToString() == "Lot Status")
            {
                tblLotStat.Visible = true;
                tblAdhoc.Visible = false;
                lblType.Text = "Lot Status Test";
                trIMG.Visible = false;
            }
            else if (ddType.SelectedValue.ToString() == "Adhoc WIP Data")
            {
                tblAdhoc.Visible = true;
                tblLotStat.Visible = false;
                lblType.Text = "Adhoc WIP Data Test";
                trIMG.Visible = true;
            }
        }

        private void IMG(string data)
        {
            var js = new JavaScriptSerializer();
            var result = js.Deserialize<List<Result>>(data);

            Session.Remove("IMGURL");

            string imgurl = "";
            foreach (var x in result)
            {
                imgurl = x.SPCResultFilename.ToString();
                Session["IMGURL"] = imgurl;
            }
        }

        protected void btnAdhoc_Click(object sender, EventArgs e)
        {
            string type = "EQUIPMENT";
            string userID = txtUser.Text;

            List<AdhocWIPData> lstAdhoc = new List<AdhocWIPData>();

            AdhocWIPData adhoc = new AdhocWIPData();

            adhoc = new AdhocWIPData { Name = textbox1.Text, Value = textbox2.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox3.Text, Value = textbox4.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox5.Text, Value = textbox6.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox7.Text, Value = textbox8.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox9.Text, Value = textbox10.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox11.Text, Value = textbox12.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox13.Text, Value = textbox14.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox15.Text, Value = textbox16.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox17.Text, Value = textbox18.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox19.Text, Value = textbox20.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox21.Text, Value = textbox22.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox23.Text, Value = textbox24.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox25.Text, Value = textbox26.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox27.Text, Value = textbox28.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox29.Text, Value = textbox30.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox31.Text, Value = textbox32.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox33.Text, Value = textbox34.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox35.Text, Value = textbox36.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox37.Text, Value = textbox38.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox39.Text, Value = textbox40.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox41.Text, Value = textbox42.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox43.Text, Value = textbox44.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox45.Text, Value = textbox46.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox47.Text, Value = textbox48.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox49.Text, Value = textbox50.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox51.Text, Value = textbox52.Text };
            lstAdhoc.Add(adhoc);
            adhoc = new AdhocWIPData { Name = textbox53.Text, Value = textbox54.Text };
            lstAdhoc.Add(adhoc);

            string json = "[";
            foreach (var ad in lstAdhoc)
            {
                json += "{" + '"' + "Name" + '"' + ":" + '"' + ad.Name + '"' + "," + '"' + "Value" + '"' + ":" + '"' + ad.Value + '"' + "},";
            }

            json += ")";
            json = json.Replace(",)", "]");

            try
            {
                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;
                string result = webclient.UploadString(BASE_URL + "camstar/adhocwipdata?Equipment=" + ddEquip.SelectedValue.ToString() + "&Setup=" + ddSetup.SelectedValue.ToString() + "&Type=" + type + "&UserID=" + userID, "POST", json);
                lblResult.Text = result;

                IMG(result);

                lblResult.ForeColor = System.Drawing.Color.Green;

                launchimg();
            }
            catch(Exception ex)
            {
                lblResult.Text = ex.Message.ToString();
                lblResult.ForeColor = System.Drawing.Color.Red;
            }
        }

        protected void btnView_Click(object sender, EventArgs e)
        {
            launchimg();
        }

        private void launchimg()
        {
            string url = "";
            try
            {
                url = Session["IMGURL"].ToString();
            }
            catch
            {
                url = "";
            }

            if (url != "" && url != null)
            {
                string script = "window.open('" + url + "', '" + "test" + "', " + "'width=1100,height=850'" + ");";
                ClientScript.RegisterStartupScript(GetType(), "hwa1", script, true);
            }
            else
            {
                //ClientScript.RegisterStartupScript(GetType(), "hwa1", "alert('No SPC Image Result Available');", true);
            }
        }

        protected void btnFirstInsert_Click(object sender, EventArgs e)
        {
            //firstinsert
            string userID = "jacupan";
            string lotNo = "1610978DDAA";

            string json = "{";
            json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
            json += '"' + "LotNo" + '"' + ":" + '"' + lotNo + '"' + "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;
            string result = webclient.UploadString(BASE_URL + "camstar/firstinsert", "POST", json);

            Response.Write(result);
        }

        private void test()
        {
            string json = "{";
            json += '"' + "Username" + '"' + ":" + '"' + "jacupan" + '"' + ",";
            json += '"' + "Password" + '"' + ":" + '"' + "pass" + '"' + "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;

            string result = webclient.UploadString(BASE_URL + "user/" + "userLogin", "POST", json);

            Response.Write(result);
        }

        protected void btnResetReject_Click(object sender, EventArgs e)
        {
            ResetRejects();

            //test();
        }

        private void ResetRejects()
        {
            //reset reject
            string userID = "jacupan";
            string lotNo = "1610978DDAA";
            string machineType = "Bottom";
            string equipment = "LM-010_KNGY";

            string json = "{";
            json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
            json += '"' + "MachineType" + '"' + ":" + '"' + machineType + '"' + ",";
            json += '"' + "Equipment" + '"' + ":" + '"' + equipment + '"' + ",";
            json += '"' + "LotNo" + '"' + ":" + '"' + lotNo + '"' + "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;
            string result = webclient.UploadString(BASE_URL + "camstar/resetreject", "POST", json);

            Response.Write(result);
        }

        protected void btnLotRejects_Click(object sender, EventArgs e)
        {
            ResetRejects();

            //lot rejects
            string userID = "jacupan";
            string lotNo = "1610978DDAA";
            string equipment = "LM-010_KNGY";
            string LossReason = "";
            string Quantity = "";

            List<string> lstLossReason = new List<string>();
            List<string> lstLossQuantity = new List<string>();

            //set static list of values for testing only
            lstLossReason.Add("GE 2010_DIRTY PACKAGE");
            lstLossQuantity.Add("1");
            lstLossReason.Add("GE 2011_SCRATCHES");
            lstLossQuantity.Add("2");

            //dont allow to pass null list
            if (lstLossReason.Count <= 0)
            {
                return;
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


            string json = "{";
            json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
            json += '"' + "Equipment" + '"' + ":" + '"' + equipment + '"' + ",";
            json += '"' + "LotNo" + '"' + ":" + '"' + lotNo + '"' + ",";
            json += LossReason + ",";
            json += Quantity;
            json += "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;
            string result = webclient.UploadString(BASE_URL + "camstar/lotreject", "POST", json);

            Response.Write(result);

        }
    }
}