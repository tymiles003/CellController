using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Android.Views.Animations;
using Android.Graphics;
using Android.Views.InputMethods;
using Java.Lang;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "Login")]
    public class Login : Activity
    {
        Button mLogin;
        EditText mUser, mPass;
        TextView mTitle, mFail;
        ProgressBar mLoading;
        InputMethodManager imm;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            Window.RequestFeature(WindowFeatures.NoTitle);
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.Login);

            mLogin = FindViewById<Button>(Resource.Id.login);
            mUser = FindViewById<EditText>(Resource.Id.userName);
            mPass = FindViewById<EditText>(Resource.Id.password);
            mTitle = FindViewById<TextView>(Resource.Id.title);
            mLoading = FindViewById<ProgressBar>(Resource.Id.loading);
            mFail = FindViewById<TextView>(Resource.Id.loginfail);
            imm = (InputMethodManager)GetSystemService(Activity.InputMethodService);

            Typeface typeface = Typeface.CreateFromAsset(Assets, "fonts/OpenSans-Light.ttf");
            mTitle.SetTypeface(typeface, TypefaceStyle.Normal);

            Animation anim = new AlphaAnimation(0, 1);
            anim.Duration = 1500;
            mUser.StartAnimation(anim);
            mPass.StartAnimation(anim);
            mTitle.StartAnimation(anim);
            mLogin.StartAnimation(anim);

            mLogin.Click += MLogin_Click;
        }
        
        private void MLogin_Click(object sender, EventArgs e)
        {
            mLoading.Visibility = ViewStates.Visible;
            mUser.Enabled = false;
            mPass.Enabled = false;
            imm.ToggleSoftInput(InputMethodManager.ShowForced, 0);
            Thread load = new Thread(Functions);
            load.Start();
        }

        public void Functions()
        {
            imm.ToggleSoftInput(InputMethodManager.ShowForced, 0);
            
            try
            {
                string output = HttpHandler.UserLogin(mUser.Text, mPass.Text);
                output = "True";
                if (output == "True")
                {
                    RunOnUiThread(() => {
                        Finish();
                        var activity = new Intent(this, typeof(Equipment));
                        activity.PutExtra("username", mUser.Text);
                        StartActivity(activity);
                        mLoading.Visibility = ViewStates.Gone;
                        mPass.Enabled = true;
                        mUser.Enabled = true;
                    });
                }
                else
                {
                    RunOnUiThread(() => {
                        mFail.Visibility = ViewStates.Visible;
                        Animation anim = new AlphaAnimation(0, 1);
                        anim.Duration = 500;
                        mFail.StartAnimation(anim);
                        mLoading.Visibility = ViewStates.Gone;
                        mPass.Enabled = true;
                        mUser.Enabled = true;
                    });

                    Thread.Sleep(3000);

                    RunOnUiThread(() => {
                        mFail.Visibility = ViewStates.Gone;
                        Animation anim = new AlphaAnimation(1, 0);
                        anim.Duration = 500;
                        mFail.StartAnimation(anim);
                    });

                }
            }
            catch (System.Exception)
            {
                RunOnUiThread(() =>
                {
                    mFail.Visibility = ViewStates.Visible;
                    Animation anim = new AlphaAnimation(0, 1);
                    anim.Duration = 500;
                    mFail.StartAnimation(anim);
                    mFail.Text = "Something went wrong, please try again later.";
                    mLoading.Visibility = ViewStates.Gone;
                    mPass.Enabled = true;
                    mUser.Enabled = true;
                });

                Thread.Sleep(3000);

                RunOnUiThread(() => {
                    mFail.Visibility = ViewStates.Gone;
                    Animation anim = new AlphaAnimation(1, 0);
                    anim.Duration = 500;
                    mFail.StartAnimation(anim);
                });
            }
        }
    }
}