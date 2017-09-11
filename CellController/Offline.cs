using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "Offline")]
    public class Offline : Activity
    {
        ImageButton imgbtnBack;
        TextView txtEquipment;
        string equipment = "";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.Offline);

            try
            {
                equipment = Intent.GetStringExtra("Equipment") ?? "No data";
            }
            catch { }

            //set the global equipment for later use
            GlobalVariable.currentEquipment = equipment;

            PopulateDetails(GlobalVariable.currentEquipment);

            imgbtnBack = FindViewById<ImageButton>(Resource.Id.btnBack);
            imgbtnBack.Click += btnBack_Click;

            SignalRListener.Listen(this);
        }

        private void PopulateDetails(string equipment)
        {
            txtEquipment = FindViewById<TextView>(Resource.Id.txtEquipment);
            txtEquipment.Text = equipment;
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            Finish();
            StartActivity(typeof(Equipment));
        }
    }
}