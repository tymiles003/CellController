using System.Collections.Generic;
using System.Linq;
using Android.App;
using Android.Views;

namespace CellController.Classes
{
    public class UIControl
    {
        public string ControlName { get; set; }
        public int ControlID { get; set; }
        public string FormOwner { get; set; }

        public static void AddControl(Activity activity, View view, string ControlName)
        {
            try
            {
                string activityName = activity.LocalClassName.ToString().Split('.')[1].Replace(" ", "");

                UIControl control = new UIControl { ControlID = GlobalVariable.controlID, ControlName = ControlName, FormOwner = activityName };

                int myKey = GlobalVariable.myUIControls.FirstOrDefault(c => c.Value.ControlName == control.ControlName && c.Value.FormOwner == control.FormOwner).Key;

                if (myKey == 0)
                {
                    GlobalVariable.myUIControls.Add(GlobalVariable.controlID, control);
                    view.Id = GlobalVariable.controlID;
                    GlobalVariable.controlID++;
                }
            }
            catch
            {

            }
        }

        public static int GetControlID(Activity activity, string controlName)
        {
            int ID = 0;

            string activityName = activity.LocalClassName.ToString().Split('.')[1].Replace(" ", "");

            try
            {
                ID = GlobalVariable.myUIControls.FirstOrDefault(c => c.Value.ControlName == controlName && c.Value.FormOwner == activityName).Value.ControlID;
            }
            catch
            {
                ID = 0;
            }

            return ID;
        }

        public static void ResetControls()
        {
            try
            {
                GlobalVariable.myUIControls = new Dictionary<int, UIControl>();
                GlobalVariable.controlID = 1;
                GlobalVariable.currentEquipment = "";
            }
            catch { }
        }

        public static string GetColorCodeStatus(string status)
        {
            string bgColor = "";

            if (status == "ONLINE")
            {
                bgColor = "#25AE60";
            }
            else if (status == "OFFLINE")
            {
                bgColor = "#AC4241";
            }
            else if (status == "IDLE")
            {
                bgColor = "#2196F3";
            }

            return bgColor;
        }

        public static string GetColorCodePie()
        {
            string bgColor = "#ffffff";

            return bgColor;
        }

        public static void ShowMessageBox(Activity activity, string title, string message)
        {
            activity.RunOnUiThread(() => {
                AlertDialog.Builder alert = new AlertDialog.Builder(activity);
                alert.SetTitle(title);
                alert.SetMessage(message);
                alert.SetCancelable(true);
                alert.SetPositiveButton("Close", delegate { activity.CloseContextMenu(); });
                alert.Show();
            });
        }
    }
}