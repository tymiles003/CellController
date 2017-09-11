using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Android.Views.Animations;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "Online", ScreenOrientation = Android.Content.PM.ScreenOrientation.Landscape)]
    public class Online : Activity
    {
        LinearLayout linearLogin, linearPie;
        ImageButton imgbtnBack;
        Button btnStop, btnCancel, btnLogin;
        TextView txtEquipment, txtLot, txtProductName, txtTotalQuantity, txtRecipe, txtPkgGroup, txtProductLine, txtPkgDev, txtSpecsName, txtInProgressQuantity, txtInProgressPercentage, txtYieldPercentage;
        LinearLayout.LayoutParams ll = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
        string equipment = "";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.Online);

            try
            {
                equipment = Intent.GetStringExtra("Equipment") ?? "No data";
            }
            catch { }

            //set the global equipment for later use
            GlobalVariable.currentEquipment = equipment;

            PopulateDetails(GlobalVariable.currentEquipment);
            
            btnStop = FindViewById<Button>(Resource.Id.btnStop);
            btnStop.Click += btnStop_Click;

            btnCancel = FindViewById<Button>(Resource.Id.btnCancel);
            btnCancel.Click += btnCancel_Click;

            imgbtnBack = FindViewById<ImageButton>(Resource.Id.btnBack);
            imgbtnBack.Click += btnBack_Click;

            btnLogin = FindViewById<Button>(Resource.Id.btnLogin);
            btnLogin.Click += btnLogin_Click;

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
            txtYieldPercentage.Text = "100%";

            linearPie = FindViewById<LinearLayout>(Resource.Id.linearLayoutPieHolder);

            View vwOEE = Doughnut.OEE(this, 100, 0, UIControl.GetColorCodeStatus("ONLINE"), UIControl.GetColorCodePie());
            linearPie.AddView(vwOEE);
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            Finish();
            StartActivity(typeof(Equipment));
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            //Toast.MakeText(this, "Login!", ToastLength.Short).Show();
            //login code here
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            Animation anim = new AlphaAnimation(0, 1);
            anim.Duration = 500;
            btnStop.StartAnimation(anim);
            linearLogin.Visibility = ViewStates.Gone;
            btnStop.Visibility = ViewStates.Visible;
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            Animation anim = new AlphaAnimation(0, 1);
            anim.Duration = 500;
            linearLogin.StartAnimation(anim);
            linearLogin.Visibility = ViewStates.Visible;
            btnStop.Visibility = ViewStates.Gone;
        }
    }
}