using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using Android.App;

namespace CellController.Classes
{
    public class HttpHandler
    {
        public static string Host = GetIPAddress(Application.Context.Resources.GetString(Resource.String.IgnitionServer)).ToString();
        //public static string Port = Application.Context.Resources.GetString(Resource.String.IgnitionServerPort);
        public static string Library = Application.Context.Resources.GetString(Resource.String.IgnitionWebDevLibrary);

        //public static string WebServiceUrl = "http://" + Host + ":" + Port + Library;
        public static string WebServiceUrl = "http://" + Host + Library;

        public static IPAddress GetIPAddress(string hostName)
        {
            if (!System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable())
            {
                return null;
            }

            if (!hostName.Contains(".allegro.msad"))
            {
                hostName += ".allegro.msad";
            }

            IPHostEntry host = Dns.GetHostEntry(hostName);

            return host
                .AddressList
                .FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork);
        }

        public static string UserLogin(string username, string password)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                URL = WebServiceUrl + "user/userLogin";
                URL = string.Format(URL);

                string json = "{";
                json += '"' + "Username" + '"' + ":" + '"' + username + '"' + ",";
                json += '"' + "Password" + '"' + ":" + '"' + password + '"' + "}";

                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(URL, "POST", json);

                AD output = Deserialize<AD>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        public static List<EnrolledEquipment> GetEnrolledEquipments(string username)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";
                
                URL = WebServiceUrl + "equipment/getEnrolledEquipments?UserID=" + username + "&HostID=" + "TEST" + "&isHostEnabled=" + "0" + "&IP=" + "TEST";

                URL = string.Format(URL);
                result = webclient.DownloadString(URL);
                List<EnrolledEquipment> enrolledEquipment = new List<EnrolledEquipment>();

                enrolledEquipment = Deserialize<List<EnrolledEquipment>>(result);
                return enrolledEquipment;
            }
            catch
            {
                return null;
            }
        }

        public static string trackIn(string userID, string LotNo, string Equipment, int TrackInQty, string comment)
        {
            try
            {
                string result = "";
                string json = "";

                json = "{";
                json += '"' + "UserID" + '"' + ":" + '"' + userID + '"' + ",";
                json += '"' + "Equipment" + '"' + ":" + '"' + Equipment + '"' + ",";
                json += '"' + "TrackInQty" + '"' + ":" + '"' + TrackInQty.ToString() + '"' + ",";
                json += '"' + "Comment" + '"' + ":" + '"' + comment + '"' + ",";
                json += '"' + "LotNo" + '"' + ":" + '"' + LotNo + '"' + "}";

                var webclient = new WebClient();
                webclient.Headers["Content-type"] = "application/json";

                webclient.Encoding = Encoding.UTF8;

                result = webclient.UploadString(WebServiceUrl + "camstar/" + "trackin", "POST", json);
                Camstar output = new Camstar();

                output = Deserialize<Camstar>(result);

                return output.RESULT;
            }
            catch
            {
                return null;
            }
        }

        public static List<Alarm> GetAlarms(string username, string equipID)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                //URL = WebServiceUrl + "alarm/getNewAlarmsByEquipment?UserID=" + username + "&EquipID=" + equipID;
                URL = WebServiceUrl + "alarm/getNewAlarmsByEquipment?EquipID=" + equipID;
                URL = string.Format(URL);
                result = webclient.DownloadString(URL);
                List<Alarm> alarm = new List<Alarm>();

                alarm = Deserialize<List<Alarm>>(result);
                return alarm;
            }
            catch
            {
                return null;
            }
        }

        public static string GetEquipmentStatus(string Equipment)
        {
            try
            {
                var webclient = new WebClient();
                string URL = "";
                string result = "";

                URL = WebServiceUrl + "equipment/getEquipmentStatus?Equipment=" + Equipment;
                URL = string.Format(URL);
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
    }
}