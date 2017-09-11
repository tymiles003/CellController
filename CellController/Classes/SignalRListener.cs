using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Microsoft.AspNet.SignalR.Client;
using System;
using System.Linq;

namespace CellController.Classes
{
    public class SignalRListener
    {
        public static string Host = HttpHandler.GetIPAddress(Application.Context.Resources.GetString(Resource.String.SignalRServer)).ToString();
        public static string Port = Application.Context.Resources.GetString(Resource.String.SignalRServerPort);

        public static string SignalRUrl = "http://" + Host + ":" + Port;

        public static HubConnection hubConn;
        public static IHubProxy proxy;

        public static void stopConnection()
        {
            try
            {
                hubConn.Stop();
            }
            catch { }
        }

        public static async void Init()
        {
            try
            {
                stopConnection();
            }
            catch { }

            try
            {
                hubConn = new HubConnection(SignalRUrl);
                proxy = hubConn.CreateHubProxy("MessagesHub");
            }
            catch { }

            try
            {
                await hubConn.Start();
            }
            catch { }
        }

        public static void Listen(Activity activity)
        {
            try
            {
                string activityName = activity.LocalClassName.ToString().Split('.')[1].Replace(" ", "");

                proxy.On<string, string>("MachineStatus", (equip, status) =>
                {
                    var lstEquipment = GlobalVariable.myEnrolledEquipment.Where(o => o.Equipment == equip).ToList();

                    activity.RunOnUiThread(() =>
                    {
                        //Handle different activities with if else statements
                        if (activityName == "Equipment")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                //Toast.MakeText(activity, "Equipment: " + equip + " Status: " + status, ToastLength.Short).Show();

                                var myEquip = lstEquipment.First();

                                string equipment = myEquip.Equipment;

                                int ID = UIControl.GetControlID(activity, "linearEquipTitle_" + equipment);
                                LinearLayout linearEquipTitle = activity.FindViewById<LinearLayout>(ID);

                                ID = UIControl.GetControlID(activity, "linearIdle_" + equipment);
                                LinearLayout linearIdle = activity.FindViewById<LinearLayout>(ID);
                                linearIdle.Visibility = ViewStates.Gone;

                                ID = UIControl.GetControlID(activity, "linearOnline_" + equipment);
                                LinearLayout linearOnline = activity.FindViewById<LinearLayout>(ID);
                                linearOnline.Visibility = ViewStates.Gone;

                                ID = UIControl.GetControlID(activity, "linearOffline_" + equipment);
                                LinearLayout linearOffline = activity.FindViewById<LinearLayout>(ID);
                                linearOffline.Visibility = ViewStates.Gone;

                                if (status == "ONLINE")
                                {
                                    linearEquipTitle.SetBackgroundColor(Color.ParseColor(UIControl.GetColorCodeStatus("ONLINE")));
                                    linearOnline.Visibility = ViewStates.Visible;
                                }
                                else if (status == "OFFLINE")
                                {
                                    linearEquipTitle.SetBackgroundColor(Color.ParseColor(UIControl.GetColorCodeStatus("OFFLINE")));
                                    linearOffline.Visibility = ViewStates.Visible;
                                }
                                else if (status == "IDLE")
                                {
                                    linearEquipTitle.SetBackgroundColor(Color.ParseColor(UIControl.GetColorCodeStatus("IDLE")));
                                    linearIdle.Visibility = ViewStates.Visible;
                                }
                            }
                        }
                        else if (activityName == "Online")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                var myEquip = lstEquipment.First();
                                if (GlobalVariable.currentEquipment == myEquip.Equipment)
                                {
                                    if (status == "IDLE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Idle));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                    else if (status == "OFFLINE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Offline));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                }
                            }
                        }
                        else if (activityName == "Idle")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                var myEquip = lstEquipment.First();
                                if (GlobalVariable.currentEquipment == myEquip.Equipment)
                                {
                                    if (status == "ONLINE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Online));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                    else if (status == "OFFLINE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Offline));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                }
                            }
                        }
                        else if (activityName == "Offline")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                var myEquip = lstEquipment.First();
                                if (GlobalVariable.currentEquipment == myEquip.Equipment)
                                {
                                    if (status == "ONLINE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Online));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                    else if (status == "IDLE")
                                    {
                                        Intent myIntent = new Intent(activity, typeof(Idle));
                                        myIntent.PutExtra("Equipment", myEquip.Equipment);
                                        activity.Finish();
                                        activity.StartActivity(myIntent);
                                    }
                                }
                            }
                        }
                    });
                });

                proxy.On<string, string, string, string>("Alarm", (messageId, userId, equip, message) =>
                {
                    var lstEquipment = GlobalVariable.myEnrolledEquipment.Where(o => o.Equipment == equip).ToList();

                    activity.RunOnUiThread(() =>
                    {
                        if (activityName == "Equipment")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                if (userId == GlobalVariable.userID)
                                {
                                    var myEquip = lstEquipment.First();

                                    string equipment = myEquip.Equipment;

                                    int ID = UIControl.GetControlID(activity, "btnAlarmOnline_" + equipment);
                                    Button btnAlarmOnline = activity.FindViewById<Button>(ID);

                                    int count = 0;
                                    count = Convert.ToInt32(btnAlarmOnline.Text.Replace("+", ""));
                                    count++;

                                    btnAlarmOnline.Text = count.ToString();

                                    if (count > 999)
                                    {
                                        btnAlarmOnline.Text = "999+";
                                    }
                                    else
                                    {
                                        btnAlarmOnline.Text = count.ToString();
                                    }

                                    if (count == 0)
                                    {
                                        btnAlarmOnline.Visibility = ViewStates.Gone;
                                    }
                                    else
                                    {
                                        btnAlarmOnline.Visibility = ViewStates.Visible;
                                    }

                                    ID = UIControl.GetControlID(activity, "btnAlarmIdle_" + equipment);
                                    Button btnAlarmIdle = activity.FindViewById<Button>(ID);

                                    count = 0;
                                    count = Convert.ToInt32(btnAlarmIdle.Text.Replace("+", ""));
                                    count++;

                                    btnAlarmIdle.Text = count.ToString();

                                    if (count > 999)
                                    {
                                        btnAlarmIdle.Text = "999+";
                                    }
                                    else
                                    {
                                        btnAlarmIdle.Text = count.ToString();
                                    }

                                    if (count == 0)
                                    {
                                        btnAlarmIdle.Visibility = ViewStates.Gone;
                                    }
                                    else
                                    {
                                        btnAlarmIdle.Visibility = ViewStates.Visible;
                                    }
                                }
                            }
                        }
                    });
                });

                proxy.On<string, string>("Recipe", (equip, recipeFilePath) =>
                {
                    var lstEquipment = GlobalVariable.myEnrolledEquipment.Where(o => o.Equipment == equip).ToList();

                    activity.RunOnUiThread(() =>
                    {
                        if (activityName == "Equipment")
                        {
                            if (lstEquipment.Count > 0)
                            {
                                Toast.MakeText(activity, "Recipe Uploaded! Equipment: " + equip + " Directory: " + recipeFilePath, ToastLength.Short).Show();
                            }
                        }
                    });
                });


            }
            catch { }
        }
    }
}