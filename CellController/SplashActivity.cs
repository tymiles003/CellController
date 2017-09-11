using Android.App;
using Android.Content;
using Android.OS;
using Android.Content.PM;
using Android.Util;
using System.Threading.Tasks;

namespace CellController
{
    [Activity(Theme = "@style/Splash", MainLauncher = true, NoHistory = true, ScreenOrientation = ScreenOrientation.Landscape)]
    //[Activity(Label = "Splash")]
    public class SplashActivity : Activity
    {
        static readonly string TAG = "X:" + typeof(SplashActivity).Name;
        public override void OnCreate(Bundle savedInstanceState, PersistableBundle persistentState)
        {
            base.OnCreate(savedInstanceState, persistentState);
            Log.Debug(TAG, "SplashActivity.OnCreate");
            // Create your application here
        }

        protected override void OnResume()
        {
            base.OnResume();

            Task startupWork = new Task(() =>
            {
                Log.Debug(TAG, "Performing some startup work that takes a bit of time.");
                Task.Delay(15000);  // Simulate a bit of startup work.
                Log.Debug(TAG, "Working in the background - important stuff.");
            });

            startupWork.ContinueWith(t =>
            {
                Log.Debug(TAG, "Work is finished - start MainActivity.");
                StartActivity(new Intent(Application.Context, typeof(Login)));
            }, TaskScheduler.FromCurrentSynchronizationContext());

            startupWork.Start();
        }
    }
}