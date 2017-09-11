using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Text;
using System.Configuration;

namespace SECSGEMCharacterization
{
    public partial class TrackIn : System.Web.UI.Page
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string BASE_URL = ConfigurationManager.AppSettings[env + "_" + "IgnitionWebService"].ToString();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblServer.Text = BASE_URL;
                ddType.Items.Add(new ListItem("Track In", "Track In"));
                ddType.Items.Add(new ListItem("Track Out", "Track Out"));

                txtUserID.Text = "jacupan";

                txtCommentTrackIn.Text = "test";
                txtLotTrackIn.Text = "1610950DDAM";
                //txtLotTrackIn.Text = "1610025DDAE";
                txtTrackInQty.Text = "4065";
                txtEquipmentTrackIn.Text = "WB-104_KNS";
                
                txtLotTrackOut.Text = txtLotTrackIn.Text;
                txtCommentTrackOut.Text = txtCommentTrackIn.Text;
                txtTrackOutQty.Text = "100";
                txtTotalScrapQty.Text = "0";
                txtEquipmentTrackOut.Text = txtEquipmentTrackIn.Text;
            }
        }

        protected void btnTrackIN_Click(object sender, EventArgs e)
        {
            string json = "{";
            json += '"' + "UserID" + '"' + ":" + '"' + txtUserID.Text + '"' + ",";
            json += '"' + "Equipment" + '"' + ":" + '"' + txtEquipmentTrackIn.Text + '"' + ",";
            json += '"' + "TrackInQty" + '"' + ":" + '"' + txtTrackInQty.Text + '"' + ",";
            json += '"' + "Comment" + '"' + ":" + '"' + txtCommentTrackIn.Text + '"' + ",";
            json += '"' + "LotNo" + '"' + ":" + '"' + txtLotTrackIn.Text + '"' + "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;
            string result = webclient.UploadString(BASE_URL + "camstar/trackin", "POST", json);

            lblResult.Text = result;

            if (result.Contains("ERROR"))
            {
                lblResult.ForeColor = System.Drawing.Color.Red;
            }
            else
            {
                lblResult.ForeColor = System.Drawing.Color.Green;
            }
        }

        protected void ddType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddType.SelectedValue.ToString() == "Track In")
            {
                tblTrackIn.Visible = true;
                tblTrackOut.Visible = false;
            }
            else
            {
                tblTrackIn.Visible = false;
                tblTrackOut.Visible = true;
            }
        }

        protected void btnTrackOut_Click(object sender, EventArgs e)
        {
            string json = "{";
            json += '"' + "UserID" + '"' + ":" + '"' + txtUserID.Text + '"' + ",";
            json += '"' + "Equipment" + '"' + ":" + '"' + txtEquipmentTrackOut.Text + '"' + ",";
            json += '"' + "TrackOutQty" + '"' + ":" + '"' + txtTrackOutQty.Text + '"' + ",";
            json += '"' + "TotalScrapQty" + '"' + ":" + '"' + txtTotalScrapQty.Text + '"' + ",";
            json += '"' + "Comment" + '"' + ":" + '"' + txtCommentTrackOut.Text + '"' + ",";
            json += '"' + "LotNo" + '"' + ":" + '"' + txtLotTrackOut.Text + '"' + "}";

            var webclient = new WebClient();
            webclient.Headers["Content-type"] = "application/json";

            webclient.Encoding = Encoding.UTF8;
            string result = webclient.UploadString(BASE_URL + "camstar/trackout", "POST", json);

            lblResult.Text = result;

            if (result.Contains("ERROR"))
            {
                lblResult.ForeColor = System.Drawing.Color.Red;
            }
            else
            {
                lblResult.ForeColor = System.Drawing.Color.Green;
            }
        }
    }
}