using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Android.Views.InputMethods;
using Java.Lang;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "TrackIn")]
    public class TrackIn : Activity
    {
        LinearLayout linearMain;
        ImageButton imgbtnBack;
        SeekBar seek1, seek2;
        EditText txtQty, txtComment, txtLot;
        Button btnTrackIn;
        ProgressBar loading;
        InputMethodManager inputMethodManager;
        TextView txtEquipment;
        string equipment = "";

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.TrackIn);

            equipment = Intent.GetStringExtra("Equipment") ?? "No data";
            txtEquipment = FindViewById<TextView>(Resource.Id.txtEquipment);
            txtEquipment.Text = equipment;

            seek1 = FindViewById<SeekBar>(Resource.Id.seekBar1);
            seek2 = FindViewById<SeekBar>(Resource.Id.seekBar2);
            txtQty = FindViewById<EditText>(Resource.Id.txtQty);
            btnTrackIn = FindViewById<Button>(Resource.Id.btnTrackIn);
            txtComment = FindViewById<EditText>(Resource.Id.txtComment);
            txtLot = FindViewById<EditText>(Resource.Id.txtLot);
            imgbtnBack = FindViewById<ImageButton>(Resource.Id.btnBack);
            loading = FindViewById<ProgressBar>(Resource.Id.loadingTrackIn);
            inputMethodManager = (InputMethodManager)GetSystemService(Activity.InputMethodService);
            linearMain = FindViewById<LinearLayout>(Resource.Id.roots);

            seek2.ProgressChanged += MSeekbarhun_ProgressChanged;
            seek1.ProgressChanged += MSeekbar_ProgressChanged;
            btnTrackIn.Click += MTrackIn_Click;
            txtQty.Text = null;
            seek1.Progress = 0;
            seek2.Progress = 0;
            seek1.Max = 99;
            seek2.Max = 99;
            txtQty.AfterTextChanged += MQty_AfterTextChanged;
            imgbtnBack.Click += btnBack_Click;
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            Finish();
            StartActivity(typeof(Equipment));
        }

        private void MTrackIn_Click(object sender, EventArgs e)
        {
            loading.Visibility = ViewStates.Visible;
            inputMethodManager.ToggleSoftInput(InputMethodManager.ShowForced, 0);
            Thread thread = new Thread(trackin);
            thread.Start();
        }

        public void trackin()
        {
            inputMethodManager.ToggleSoftInput(InputMethodManager.ShowForced, 0);

            string LotNo = txtLot.Text;
            int trackInQty = 0;

            if (LotNo == "" || LotNo == null)
            {
                RunOnUiThread(() => {
                    linearMain.RequestFocus();
                    AlertDialog.Builder alert = new AlertDialog.Builder(this);
                    alert.SetTitle("Message");
                    alert.SetMessage("Please enter Lot Number");
                    alert.SetCancelable(true);
                    alert.SetPositiveButton("Close", delegate { CloseContextMenu(); });
                    alert.Show();
                    loading.Visibility = ViewStates.Invisible;
                });
                return;
            }

            try
            {
                trackInQty = Convert.ToInt32(txtQty.Text);
            }
            catch
            {
                RunOnUiThread(() => {
                    linearMain.RequestFocus();
                    AlertDialog.Builder alert = new AlertDialog.Builder(this);
                    alert.SetTitle("Message");
                    alert.SetMessage("Please specify correct Track In Quantity");
                    alert.SetCancelable(true);
                    alert.SetPositiveButton("Close", delegate { CloseContextMenu(); });
                    alert.Show();
                    loading.Visibility = ViewStates.Invisible;
                });
                return;
            }

            string result = HttpHandler.trackIn(GlobalVariable.userID, LotNo, equipment, trackInQty, txtComment.Text);

            RunOnUiThread(() => {
                linearMain.RequestFocus();
                AlertDialog.Builder alert = new AlertDialog.Builder(this);
                alert.SetTitle("Message");
                alert.SetMessage(result);
                alert.SetCancelable(true);
                alert.SetPositiveButton("Close", delegate { CloseContextMenu(); });
                alert.Show();
                loading.Visibility = ViewStates.Invisible;
            });
        }

        private void MQty_AfterTextChanged(object sender, Android.Text.AfterTextChangedEventArgs e)
        {
            if (txtQty.Length() == 0 || txtQty.Text == "0")
            {
                seek1.Progress = 0;
                seek2.Progress = 0;
            }
            else
            {
                try
                {
                    if (txtQty.Length() <= 2)
                    {
                        seek2.Progress = Convert.ToInt32(txtQty.Text);
                        seek1.Progress = 0;
                        txtQty.SetSelection(txtQty.Length());
                    }
                    else if (txtQty.Length() == 3)
                    {
                        string holder = txtQty.Text;
                        seek2.Progress = Convert.ToInt32(txtQty.Text.Substring(1, 2));
                        seek1.Progress = Convert.ToInt32(holder.Substring(0, 1));
                        txtQty.SetSelection(txtQty.Length());
                    }
                    else if (txtQty.Length() == 4)
                    {
                        string holder = txtQty.Text;
                        string holder2 = txtQty.Text;
                        seek2.Progress = Convert.ToInt32(holder2.Substring(2, 2));
                        seek1.Progress = Convert.ToInt32(holder.Substring(0, 2));
                        txtQty.SetSelection(txtQty.Length());
                    }
                }
                catch
                {
                    seek1.Progress = seek1.Max;
                    seek2.Progress = seek2.Max;
                }
            }
        }

        private void MSeekbarhun_ProgressChanged(object sender, SeekBar.ProgressChangedEventArgs e)
        {
            int holder = (seek1.Progress * 1000) + seek2.Progress;
            txtQty.Text = ((seek1.Progress * 100) + seek2.Progress).ToString();
            if (holder == 0)
            {
                txtQty.Text = null;
            }
        }

        private void MSeekbar_ProgressChanged(object sender, SeekBar.ProgressChangedEventArgs e)
        {
            int holder = (seek1.Progress * 1000) + seek2.Progress;
            txtQty.Text = ((seek1.Progress * 100) + seek2.Progress).ToString();
            if (holder == 0)
            {
                txtQty.Text = null;
            }
        }
    }
}