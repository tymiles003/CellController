using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "Idle", ScreenOrientation = Android.Content.PM.ScreenOrientation.Landscape)]
    public class Idle : Activity
    {
        LinearLayout linearLogin, linearPie;
        ImageButton imgbtnBack;
        Button btnTrackIn;
        TextView txtEquipment, txtLot, txtProductName, txtTotalQuantity, txtRecipe, txtPkgGroup, txtProductLine, txtPkgDev, txtSpecsName, txtInProgressQuantity, txtInProgressPercentage, txtYieldPercentage;
        LinearLayout.LayoutParams ll = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
        string equipment = "";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.Idle);

            try
            {
                equipment = Intent.GetStringExtra("Equipment") ?? "No data";
            }
            catch { }

            //set the global equipment for later use
            GlobalVariable.currentEquipment = equipment;

            PopulateDetails(GlobalVariable.currentEquipment);

            btnTrackIn = FindViewById<Button>(Resource.Id.btnTrackin);
            btnTrackIn.Click += btnTrackIn_Click;

            imgbtnBack = FindViewById<ImageButton>(Resource.Id.btnBack);
            imgbtnBack.Click += btnBack_Click;

            linearLogin = FindViewById<LinearLayout>(Resource.Id.linearLayoutLogin);

            SignalRListener.Listen(this);
        }

        private void PopulateDetails(string equipment)
        {
            txtEquipment = FindViewById<TextView>(Resource.Id.txtEquipment);
            txtEquipment.Text = equipment;

            txtLot = FindViewById<TextView>(Resource.Id.txtLot);
            txtLot.Text = "1610950DDAA";

            txtProductName = FindViewById<TextView>(Resource.Id.txtProductName);
            txtProductName.Text = "1770TKC-000";

            txtTotalQuantity = FindViewById<TextView>(Resource.Id.txtTotalQuantity);
            txtTotalQuantity.Text = "5000";

            txtRecipe = FindViewById<TextView>(Resource.Id.txtRecipe);
            txtRecipe.Text = "P9179TSL-TSL8038";

            txtPkgGroup = FindViewById<TextView>(Resource.Id.txtPkgGroup);
            txtPkgGroup.Text = "K-Matrix";

            txtProductLine = FindViewById<TextView>(Resource.Id.txtProductLine);
            txtProductLine.Text = "TKC";

            txtPkgDev = FindViewById<TextView>(Resource.Id.txtPkgDev);
            txtPkgDev.Text = "1770TKC";

            txtSpecsName = FindViewById<TextView>(Resource.Id.txtSpecsName);
            txtSpecsName.Text = "2200 BELLY BRAND / RECODE";

            txtInProgressQuantity = FindViewById<TextView>(Resource.Id.txtInProgressQuantity);
            txtInProgressQuantity.Text = "5000";

            txtInProgressPercentage = FindViewById<TextView>(Resource.Id.txtInProgressPercentage);
            txtInProgressPercentage.Text = "100%";

            txtYieldPercentage = FindViewById<TextView>(Resource.Id.txtYieldPercentage);
            txtYieldPercentage.Text = "N / A";

            linearPie = FindViewById<LinearLayout>(Resource.Id.linearLayoutPieHolder);

            View vwOEE = Doughnut.OEE(this, 100, 0, UIControl.GetColorCodeStatus("IDLE"), UIControl.GetColorCodePie());
            linearPie.AddView(vwOEE);
        }
        
        private void btnBack_Click(object sender, EventArgs e)
        {
            Finish();
            StartActivity(typeof(Equipment));
        }

        private void btnTrackIn_Click(object sender, EventArgs e)
        {
            Intent myIntent = new Intent(this, typeof(TrackIn));
            myIntent.PutExtra("Equipment", equipment);
            Finish();
            StartActivity(myIntent);
        }
    }
}