using Android.App;
using Android.Content;
using Android.Views;
using Android.Widget;
using Android.OS;
using System.Collections.Generic;
using Android.Graphics;
using CellController.Classes;

namespace CellController
{
    [Activity(Label = "CellController")]
    //[Activity(Label = "CellController", MainLauncher = true, ScreenOrientation = ScreenOrientation.Landscape)]
    public class Equipment : Activity
    {
        protected override void OnCreate(Bundle bundle)
        {
            Window.RequestFeature(WindowFeatures.NoTitle);
            base.OnCreate(bundle);
            SetContentView(Resource.Layout.Equipment);

            UIControl.ResetControls();

            string username = Intent.GetStringExtra("username") ?? null;

            //set the global username for later use
            if (GlobalVariable.userID == "" || GlobalVariable.userID == null)
            {
                GlobalVariable.userID = username;
            }

            initEquipment(GlobalVariable.userID);

            if (SignalRListener.hubConn == null)
            {
                SignalRListener.Init();
            }

            SignalRListener.Listen(this);
        }

        private void initEquipment(string username)
        {
            //get the enrolled equipments
            List<EnrolledEquipment> enrolledEquipments = new List<EnrolledEquipment>();
            enrolledEquipments = HttpHandler.GetEnrolledEquipments(username);

            //set the global list for later use
            int enrolledCount = 0;
            try
            {
                GlobalVariable.myEnrolledEquipment = new List<EnrolledEquipment>(enrolledEquipments);
                enrolledCount = enrolledEquipments.Count;
            }
            catch
            {
                enrolledCount = 0;
            }

            //create the first group holder
            LinearLayout linearEquipList = new LinearLayout(this);
            LinearLayout linearEquipListNext = new LinearLayout(this);

            if (enrolledCount > 0)
            {
                linearEquipList.Orientation = Orientation.Horizontal;
                linearEquipList.SetMinimumWidth(Common.convertDPtoPixel(25));
                linearEquipList.SetMinimumHeight(Common.convertDPtoPixel(25));

                linearEquipList.LayoutParameters =
                    new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, 0)
                    {
                        Weight = Common.convertDPtoPixel(45),
                        TopMargin = Common.convertDPtoPixel(55),
                        LeftMargin = Common.convertDPtoPixel(20),
                        RightMargin = Common.convertDPtoPixel(20),
                        Gravity = GravityFlags.Center
                    };

                //re-set the gravity value cause of xamarin bug
                linearEquipList.SetGravity(GravityFlags.Center);

                //linearEquipList.SetBackgroundColor(Color.Green);

                linearEquipList.WeightSum = Common.convertDPtoPixel(100);

                FindViewById<LinearLayout>(Resource.Id.linearLayoutMain).AddView(linearEquipList);
            }
            else
            {
                Toast.MakeText(this, "You don't have enrolled equipments!", ToastLength.Long).Show();
                //do work here to tell that user has no equipment enrolled
                //maybe redirect to other page?
            }

            int count = 1;
            int batchCount = 1;
            int tempBatchCount = 1;
            bool isNext = false;
            int rowCount = enrolledCount;
            if (enrolledCount > 0)
            {
                foreach (var x in enrolledEquipments)
                {
                    string equipment = x.Equipment.ToString();
                    string status = HttpHandler.GetEquipmentStatus(equipment);

                    string bgColor = UIControl.GetColorCodeStatus(status);

                    if (tempBatchCount != batchCount)
                    {
                        linearEquipListNext = new LinearLayout(this);
                        linearEquipListNext.Orientation = Orientation.Horizontal;
                        linearEquipListNext.SetMinimumWidth(Common.convertDPtoPixel(25));
                        linearEquipListNext.SetMinimumHeight(Common.convertDPtoPixel(25));

                        linearEquipListNext.LayoutParameters =
                            new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, 0)
                            {
                                Weight = Common.convertDPtoPixel(45),
                                LeftMargin = Common.convertDPtoPixel(20),
                                RightMargin = Common.convertDPtoPixel(20),
                                Gravity = GravityFlags.Center
                            };

                        //re-set the gravity value cause of xamarin bug
                        linearEquipListNext.SetGravity(GravityFlags.Center);

                        linearEquipListNext.WeightSum = Common.convertDPtoPixel(100);

                        //linearEquipListNext.SetBackgroundColor(Color.Green);

                        FindViewById<LinearLayout>(Resource.Id.linearLayoutMain).AddView(linearEquipListNext);

                        isNext = true;
                    }

                    tempBatchCount = batchCount;

                    //For Equip Box
                    LinearLayout linearEquipBox = new LinearLayout(this);

                    linearEquipBox.Orientation = Orientation.Vertical;
                    linearEquipBox.SetMinimumWidth(Common.convertDPtoPixel(25));
                    linearEquipBox.SetMinimumHeight(Common.convertDPtoPixel(25));

                    linearEquipBox.LayoutParameters =
                        new LinearLayout.LayoutParams(Common.convertDPtoPixel(25), Common.convertDPtoPixel(300))
                        {
                            Weight = Common.convertDPtoPixel(27)
                        };

                    linearEquipBox.SetBackgroundResource(Resource.Drawable.equipmentborder);

                    linearEquipBox.Click += delegate
                    {
                        GoToEquipmentPage(equipment);
                    };

                    if (isNext == true)
                    {
                        linearEquipListNext.AddView(linearEquipBox);
                    }
                    else
                    {
                        linearEquipList.AddView(linearEquipBox);
                    }

                    //For Title
                    LinearLayout linearEquipTitle = new LinearLayout(this);

                    linearEquipTitle.Orientation = Orientation.Horizontal;
                    linearEquipTitle.SetMinimumWidth(Common.convertDPtoPixel(25));
                    linearEquipTitle.SetMinimumHeight(Common.convertDPtoPixel(25));

                    linearEquipTitle.LayoutParameters =
                        new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                        {
                            LeftMargin = Common.convertDPtoPixel(5)
                        };

                    linearEquipTitle.SetBackgroundColor(Color.ParseColor(bgColor));

                    UIControl.AddControl(this, linearEquipTitle, "linearEquipTitle_" + equipment);
                    
                    linearEquipBox.AddView(linearEquipTitle);

                    TextView txtTitle = new TextView(this);

                    txtTitle.Text = equipment;

                    txtTitle.SetTextAppearance(this, Android.Resource.Style.TextAppearanceLarge);
                    txtTitle.SetTypeface(null, TypefaceStyle.Bold);

                    txtTitle.LayoutParameters =
                        new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent)
                        {
                            LeftMargin = Common.convertDPtoPixel(5)
                        };

                    linearEquipTitle.AddView(txtTitle);

                    string LotNo = "1610950DDAA";

                    if (status == "ONLINE")
                    {
                        createOnline(linearEquipBox, equipment, LotNo, true);
                        createOffline(linearEquipBox, equipment, false);
                        createIdle(linearEquipBox, equipment, LotNo, false);
                    }
                    else if (status == "IDLE")
                    {
                        createIdle(linearEquipBox, equipment, LotNo, true);
                        createOffline(linearEquipBox, equipment, false);
                        createOnline(linearEquipBox, equipment, LotNo, false);
                    }
                    else if (status == "OFFLINE")
                    {
                        createOffline(linearEquipBox, equipment, true);
                        createIdle(linearEquipBox, equipment, LotNo, false);
                        createOnline(linearEquipBox, equipment, LotNo, false);
                    }

                    if (count % 3 != 0)
                    {
                        //For Space
                        LinearLayout linearSpace = new LinearLayout(this);

                        linearSpace.Orientation = Orientation.Vertical;
                        linearSpace.SetMinimumWidth(Common.convertDPtoPixel(25));
                        linearSpace.SetMinimumHeight(Common.convertDPtoPixel(25));

                        linearSpace.LayoutParameters =
                        new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent)
                        {
                            Weight = Common.convertDPtoPixel(1)
                        };

                        //linearSpace.SetBackgroundColor(Color.Red);

                        if (isNext == true)
                        {
                            linearEquipListNext.AddView(linearSpace);
                        }
                        else
                        {
                            linearEquipList.AddView(linearSpace);
                        }
                    }

                    if (count == 1)
                    {
                        LinearLayout linearGroupSpace = new LinearLayout(this);

                        linearGroupSpace.Orientation = Orientation.Horizontal;
                        linearGroupSpace.SetMinimumWidth(Common.convertDPtoPixel(25));
                        linearGroupSpace.SetMinimumHeight(Common.convertDPtoPixel(25));

                        linearGroupSpace.LayoutParameters =
                        new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                        {
                            LeftMargin = Common.convertDPtoPixel(20),
                            RightMargin = Common.convertDPtoPixel(20),
                            Weight = Common.convertDPtoPixel(2)
                        };

                        //linearGroupSpace.SetBackgroundColor(Color.Blue);

                        FindViewById<LinearLayout>(Resource.Id.linearLayoutMain).AddView(linearGroupSpace);
                    }

                    if (count % 3 == 0)
                    {
                        batchCount++;
                        count = 1;
                    }
                    else
                    {
                        count++;
                    }
                }

                //For adding blank box
                int tempHolder = rowCount % 3;

                if (tempHolder == 1)
                {
                    for (int i = 0; i < 2; i++)
                    {
                        LinearLayout linearFiller = new LinearLayout(this);

                        linearFiller.Orientation = Orientation.Vertical;
                        linearFiller.SetMinimumWidth(Common.convertDPtoPixel(25));
                        linearFiller.SetMinimumHeight(Common.convertDPtoPixel(25));

                        linearFiller.LayoutParameters =
                            new LinearLayout.LayoutParams(Common.convertDPtoPixel(25), ViewGroup.LayoutParams.MatchParent)
                            {
                                Weight = Common.convertDPtoPixel(27)
                            };

                        if (isNext == true)
                        {
                            linearEquipListNext.AddView(linearFiller);
                        }
                        else
                        {
                            linearEquipList.AddView(linearFiller);
                        }

                        if (i != 1)
                        {
                            LinearLayout linearSpaceFiller = new LinearLayout(this);

                            linearSpaceFiller.Orientation = Orientation.Vertical;
                            linearSpaceFiller.SetMinimumWidth(Common.convertDPtoPixel(25));
                            linearSpaceFiller.SetMinimumHeight(Common.convertDPtoPixel(25));

                            linearSpaceFiller.LayoutParameters =
                            new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent)
                            {
                                Weight = Common.convertDPtoPixel(1)
                            };

                            //linearSpaceFiller.SetBackgroundColor(Color.Red);

                            if (isNext == true)
                            {
                                linearEquipListNext.AddView(linearSpaceFiller);
                            }
                            else
                            {
                                linearEquipList.AddView(linearSpaceFiller);
                            }
                        }
                    }
                }
                else if (tempHolder == 2)
                {
                    LinearLayout linearFiller = new LinearLayout(this);

                    linearFiller.Orientation = Orientation.Vertical;
                    linearFiller.SetMinimumWidth(Common.convertDPtoPixel(25));
                    linearFiller.SetMinimumHeight(Common.convertDPtoPixel(25));

                    linearFiller.LayoutParameters =
                        new LinearLayout.LayoutParams(Common.convertDPtoPixel(25), ViewGroup.LayoutParams.MatchParent)
                        {
                            Weight = Common.convertDPtoPixel(27)
                        };

                    if (isNext == true)
                    {
                        linearEquipListNext.AddView(linearFiller);
                    }
                    else
                    {
                        linearEquipList.AddView(linearFiller);
                    }
                }
            }
        }

        private void createIdle(LinearLayout LinearParent, string equipment, string LotNo, bool isVisible)
        {
            LinearLayout linearDetails = new LinearLayout(this);
            linearDetails.Orientation = Orientation.Vertical;

            if (isVisible == true)
            {
                linearDetails.Visibility = ViewStates.Visible;
            }
            else
            {
                linearDetails.Visibility = ViewStates.Gone;
            }

            UIControl.AddControl(this, linearDetails, "linearIdle_" + equipment);

            linearDetails.LayoutParameters =
            new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent)
            {
                LeftMargin = Common.convertDPtoPixel(5),
                BottomMargin = Common.convertDPtoPixel(5),
                Weight = Common.convertDPtoPixel(100)
            };

            LinearParent.AddView(linearDetails);

            TextView txtLot = new TextView(this);

            txtLot.Text = LotNo;
            txtLot.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtLot.SetTypeface(null, TypefaceStyle.Bold);
            txtLot.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            UIControl.AddControl(this, txtLot, "txtLotIdle_" + equipment);

            txtLot.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                {
                    LeftMargin = Common.convertDPtoPixel(5),
                    TopMargin = Common.convertDPtoPixel(5),
                    Weight = Common.convertDPtoPixel(10)
                };

            linearDetails.AddView(txtLot);

            RelativeLayout relLayout = new RelativeLayout(this);

            relLayout.SetMinimumHeight(Common.convertDPtoPixel(25));
            relLayout.SetMinimumWidth(Common.convertDPtoPixel(25));

            relLayout.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, Common.convertDPtoPixel(170))
                {
                    Weight = Common.convertDPtoPixel(60),
                    TopMargin = Common.convertDPtoPixel(5)
                };

            linearDetails.AddView(relLayout);

            LinearLayout linearPie = new LinearLayout(this);
            linearPie.Orientation = Orientation.Vertical;

            linearPie.SetMinimumHeight(Common.convertDPtoPixel(25));
            linearPie.SetMinimumWidth(Common.convertDPtoPixel(25));

            linearPie.LayoutParameters =
            new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, Common.convertDPtoPixel(138))
            {
                TopMargin = Common.convertDPtoPixel(23)
            };

            relLayout.AddView(linearPie);

            var pie = Doughnut.OEE(this, 100, 0, UIControl.GetColorCodeStatus("IDLE"), UIControl.GetColorCodePie());

            linearPie.AddView(pie);

            ImageView imgView = new ImageView(this);

            imgView.LayoutParameters =
            new RelativeLayout.LayoutParams(Common.convertDPtoPixel(125), Common.convertDPtoPixel(125))
            {
                TopMargin = Common.convertDPtoPixel(30),
                LeftMargin = Common.convertDPtoPixel(98)
            };

            imgView.SetBackgroundResource(Resource.Drawable.oval);
            relLayout.AddView(imgView);

            TextView txt100 = new TextView(this);
            txt100.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt100.Text = "100";
            txt100.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            var param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(3)
            };

            txt100.LayoutParameters = param;
            txt100.Gravity = GravityFlags.Center;

            relLayout.AddView(txt100);

            TextView txt50 = new TextView(this);
            txt50.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt50.Text = "50";
            txt50.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(161)
            };

            txt50.LayoutParameters = param;
            txt50.Gravity = GravityFlags.Center;

            relLayout.AddView(txt50);

            TextView txt75 = new TextView(this);
            txt75.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt75.Text = "75";
            txt75.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(81),
                RightMargin = Common.convertDPtoPixel(160)
            };

            txt75.LayoutParameters = param;
            txt75.Gravity = GravityFlags.Center;

            txt75.Rotation = 270;

            relLayout.AddView(txt75);

            TextView txt25 = new TextView(this);
            txt25.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt25.Text = "25";
            txt25.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(81),
                LeftMargin = Common.convertDPtoPixel(160)
            };

            txt25.LayoutParameters = param;
            txt25.Gravity = GravityFlags.Center;

            txt25.Rotation = 90;

            relLayout.AddView(txt25);

            TextView txtYieldTitle = new TextView(this);
            txtYieldTitle.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtYieldTitle.Text = "Yield";
            txtYieldTitle.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("IDLE")));
            txtYieldTitle.SetTypeface(null, TypefaceStyle.Bold);
            txtYieldTitle.SetTextSize(Android.Util.ComplexUnitType.Sp, 15);

            param = new RelativeLayout.LayoutParams(Common.convertDPtoPixel(100), ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(65),
                LeftMargin = Common.convertDPtoPixel(111)
            };

            txtYieldTitle.LayoutParameters = param;
            txtYieldTitle.Gravity = GravityFlags.Center;

            relLayout.AddView(txtYieldTitle);

            TextView txtYield = new TextView(this);
            txtYield.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtYield.Text = "100%";
            txtYield.SetTypeface(null, TypefaceStyle.Bold);
            txtYield.SetTextSize(Android.Util.ComplexUnitType.Dip, 20);
            txtYield.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("IDLE")));

            UIControl.AddControl(this, txtYield, "txtYieldIdle_" + equipment);

            param = new RelativeLayout.LayoutParams(Common.convertDPtoPixel(100), ViewGroup.LayoutParams.WrapContent)
            {
                LeftMargin = Common.convertDPtoPixel(111),
                TopMargin = Common.convertDPtoPixel(82)
            };

            txtYield.LayoutParameters = param;
            txtYield.Gravity = GravityFlags.Center;

            relLayout.AddView(txtYield);

            Button btn = new Button(this);
            btn.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            btn.SetTypeface(null, TypefaceStyle.Bold);
            btn.SetTextSize(Android.Util.ComplexUnitType.Sp, 25);

            btn.LayoutParameters =
                new RelativeLayout.LayoutParams(70, 70)
                {
                    LeftMargin = Common.convertDPtoPixel(245)
                };

            btn.Click += delegate
            {
                GoToAlarmPage(equipment);
            };

            btn.SetBackgroundResource(Resource.Drawable.notification);

            var result = HttpHandler.GetAlarms(GlobalVariable.userID, equipment);
            int alarmCount = 0;
            try
            {
                alarmCount = result.Count;
            }
            catch
            {
                alarmCount = 0;
            }

            if (alarmCount > 999)
            {
                btn.Text = "999+";
            }
            else
            {
                btn.Text = alarmCount.ToString();
            }

            if (alarmCount == 0)
            {
                btn.Visibility = ViewStates.Gone;
            }
            else
            {
                btn.Visibility = ViewStates.Visible;
            }

            UIControl.AddControl(this, btn, "btnAlarmIdle_" + equipment);

            relLayout.AddView(btn);

            //In Progress
            LinearLayout linearInProgress = new LinearLayout(this);
            linearInProgress.Orientation = Orientation.Horizontal;
            linearInProgress.SetGravity(GravityFlags.Center);

            linearInProgress.LayoutParameters = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(185)
            };

            relLayout.AddView(linearInProgress);

            TextView txtInProgressTitle = new TextView(this);
            txtInProgressTitle.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressTitle.Text = "In Progress: ";
            txtInProgressTitle.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressTitle.SetTypeface(null, TypefaceStyle.Bold);

            txtInProgressTitle.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtInProgressTitle);

            TextView txtInProgressCurrent = new TextView(this);
            txtInProgressCurrent.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressCurrent.Text = "5000";
            txtInProgressCurrent.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressCurrent.SetTypeface(null, TypefaceStyle.Bold);
            
            txtInProgressCurrent.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            UIControl.AddControl(this, txtInProgressCurrent, "txtInProgressCurrentIdle_" + equipment);

            linearInProgress.AddView(txtInProgressCurrent);

            TextView txtSlash = new TextView(this);
            txtSlash.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtSlash.Text = " / ";
            txtSlash.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtSlash.SetTypeface(null, TypefaceStyle.Bold);
            
            txtSlash.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtSlash);

            TextView txtInProgressTotal = new TextView(this);
            txtInProgressTotal.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressTotal.Text = "5000";
            txtInProgressTotal.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressTotal.SetTypeface(null, TypefaceStyle.Bold);

            UIControl.AddControl(this, txtInProgressTotal, "txtInProgressTotalIdle_" + equipment);

            txtInProgressTotal.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtInProgressTotal);

            TextView txtFiller = new TextView(this);
            txtFiller.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtFiller.Text = " [ ";
            txtFiller.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtFiller.SetTypeface(null, TypefaceStyle.Bold);
            
            txtFiller.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtFiller);

            TextView txtPercentage = new TextView(this);
            txtPercentage.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtPercentage.Text = "100%";
            txtPercentage.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("IDLE")));
            txtPercentage.SetTypeface(null, TypefaceStyle.Bold);

            UIControl.AddControl(this, txtPercentage, "txtPercentageIdle_" + equipment);

            txtPercentage.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtPercentage);

            TextView txtFiller2 = new TextView(this);
            txtFiller2.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtFiller2.Text = " ]";
            txtFiller2.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtFiller2.SetTypeface(null, TypefaceStyle.Bold);
            
            txtFiller2.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtFiller2);
        }

        private void createOnline(LinearLayout LinearParent, string equipment, string LotNo, bool isVisible)
        {
            LinearLayout linearDetails = new LinearLayout(this);
            linearDetails.Orientation = Orientation.Vertical;

            if (isVisible == true)
            {
                linearDetails.Visibility = ViewStates.Visible;
            }
            else
            {
                linearDetails.Visibility = ViewStates.Gone;
            }

            UIControl.AddControl(this, linearDetails, "linearOnline_" + equipment);

            linearDetails.LayoutParameters =
            new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent)
            {
                LeftMargin = Common.convertDPtoPixel(5),
                BottomMargin = Common.convertDPtoPixel(5),
                Weight = Common.convertDPtoPixel(100)
            };

            LinearParent.AddView(linearDetails);

            TextView txtLot = new TextView(this);

            txtLot.Text = LotNo;
            txtLot.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtLot.SetTypeface(null, TypefaceStyle.Bold);
            txtLot.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            UIControl.AddControl(this, txtLot, "txtLotOnline_" + equipment);

            txtLot.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                {
                    LeftMargin = Common.convertDPtoPixel(5),
                    TopMargin = Common.convertDPtoPixel(5),
                    Weight = Common.convertDPtoPixel(10)
                };

            linearDetails.AddView(txtLot);

            RelativeLayout relLayout = new RelativeLayout(this);

            relLayout.SetMinimumHeight(Common.convertDPtoPixel(25));
            relLayout.SetMinimumWidth(Common.convertDPtoPixel(25));

            relLayout.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, Common.convertDPtoPixel(170))
                {
                    Weight = Common.convertDPtoPixel(60),
                    TopMargin = Common.convertDPtoPixel(5)
                };

            linearDetails.AddView(relLayout);

            LinearLayout linearPie = new LinearLayout(this);
            linearPie.Orientation = Orientation.Vertical;

            linearPie.SetMinimumHeight(Common.convertDPtoPixel(25));
            linearPie.SetMinimumWidth(Common.convertDPtoPixel(25));

            linearPie.LayoutParameters =
            new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, Common.convertDPtoPixel(138))
            {
                TopMargin = Common.convertDPtoPixel(23)
            };

            relLayout.AddView(linearPie);

            var pie = Doughnut.OEE(this, 100, 0, UIControl.GetColorCodeStatus("ONLINE"), UIControl.GetColorCodePie());

            linearPie.AddView(pie);

            ImageView imgView = new ImageView(this);

            imgView.LayoutParameters =
            new RelativeLayout.LayoutParams(Common.convertDPtoPixel(125), Common.convertDPtoPixel(125))
            {
                TopMargin = Common.convertDPtoPixel(30),
                LeftMargin = Common.convertDPtoPixel(98)
            };

            imgView.SetBackgroundResource(Resource.Drawable.oval);
            relLayout.AddView(imgView);

            TextView txt100 = new TextView(this);
            txt100.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt100.Text = "100";
            txt100.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            var param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(3)
            };

            txt100.LayoutParameters = param;
            txt100.Gravity = GravityFlags.Center;

            relLayout.AddView(txt100);

            TextView txt50 = new TextView(this);
            txt50.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt50.Text = "50";
            txt50.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(161)
            };

            txt50.LayoutParameters = param;
            txt50.Gravity = GravityFlags.Center;

            relLayout.AddView(txt50);

            TextView txt75 = new TextView(this);
            txt75.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt75.Text = "75";
            txt75.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(81),
                RightMargin = Common.convertDPtoPixel(160)
            };

            txt75.LayoutParameters = param;
            txt75.Gravity = GravityFlags.Center;

            txt75.Rotation = 270;

            relLayout.AddView(txt75);

            TextView txt25 = new TextView(this);
            txt25.SetTextAppearance(this, Android.Resource.Style.TextAppearanceSmall);
            txt25.Text = "25";
            txt25.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            param = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(81),
                LeftMargin = Common.convertDPtoPixel(160)
            };

            txt25.LayoutParameters = param;
            txt25.Gravity = GravityFlags.Center;

            txt25.Rotation = 90;

            relLayout.AddView(txt25);

            TextView txtYieldTitle = new TextView(this);
            txtYieldTitle.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtYieldTitle.Text = "Yield";
            txtYieldTitle.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("ONLINE")));
            txtYieldTitle.SetTypeface(null, TypefaceStyle.Bold);
            txtYieldTitle.SetTextSize(Android.Util.ComplexUnitType.Sp, 15);

            param = new RelativeLayout.LayoutParams(Common.convertDPtoPixel(100), ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(65),
                LeftMargin = Common.convertDPtoPixel(111)
            };

            txtYieldTitle.LayoutParameters = param;
            txtYieldTitle.Gravity = GravityFlags.Center;

            relLayout.AddView(txtYieldTitle);

            TextView txtYield = new TextView(this);
            txtYield.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtYield.Text = "100%";
            txtYield.SetTypeface(null, TypefaceStyle.Bold);
            txtYield.SetTextSize(Android.Util.ComplexUnitType.Dip, 20);
            txtYield.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("ONLINE")));

            UIControl.AddControl(this, txtYield, "txtYieldOnline_" + equipment);

            param = new RelativeLayout.LayoutParams(Common.convertDPtoPixel(100), ViewGroup.LayoutParams.WrapContent)
            {
                LeftMargin = Common.convertDPtoPixel(111),
                TopMargin = Common.convertDPtoPixel(82)
            };

            txtYield.LayoutParameters = param;
            txtYield.Gravity = GravityFlags.Center;

            relLayout.AddView(txtYield);

            Button btn = new Button(this);
            btn.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            btn.SetTypeface(null, TypefaceStyle.Bold);
            btn.SetTextSize(Android.Util.ComplexUnitType.Sp, 25);

            btn.LayoutParameters =
                new RelativeLayout.LayoutParams(70, 70)
                {
                    LeftMargin = Common.convertDPtoPixel(245)
                };

            btn.Click += delegate
            {
                GoToAlarmPage(equipment);
            };

            btn.SetBackgroundResource(Resource.Drawable.notification);

            var result = HttpHandler.GetAlarms(GlobalVariable.userID, equipment);
            int alarmCount = 0;
            try
            {
                alarmCount = result.Count;
            }
            catch
            {
                alarmCount = 0;
            }

            if (alarmCount > 999)
            {
                btn.Text = "999+";
            }
            else
            {
                btn.Text = alarmCount.ToString();
            }

            if (alarmCount == 0)
            {
                btn.Visibility = ViewStates.Gone;
            }
            else
            {
                btn.Visibility = ViewStates.Visible;
            }

            UIControl.AddControl(this, btn, "btnAlarmOnline_" + equipment);

            relLayout.AddView(btn);

            //In Progress
            LinearLayout linearInProgress = new LinearLayout(this);
            linearInProgress.Orientation = Orientation.Horizontal;
            linearInProgress.SetGravity(GravityFlags.Center);

            linearInProgress.LayoutParameters = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
            {
                TopMargin = Common.convertDPtoPixel(185)
            };

            relLayout.AddView(linearInProgress);

            TextView txtInProgressTitle = new TextView(this);
            txtInProgressTitle.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressTitle.Text = "In Progress: ";
            txtInProgressTitle.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressTitle.SetTypeface(null, TypefaceStyle.Bold);

            txtInProgressTitle.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtInProgressTitle);

            TextView txtInProgressCurrent = new TextView(this);
            txtInProgressCurrent.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressCurrent.Text = "5000";
            txtInProgressCurrent.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressCurrent.SetTypeface(null, TypefaceStyle.Bold);

            txtInProgressCurrent.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            UIControl.AddControl(this, txtInProgressCurrent, "txtInProgressCurrentOnline_" + equipment);

            linearInProgress.AddView(txtInProgressCurrent);

            TextView txtSlash = new TextView(this);
            txtSlash.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtSlash.Text = " / ";
            txtSlash.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtSlash.SetTypeface(null, TypefaceStyle.Bold);

            txtSlash.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtSlash);

            TextView txtInProgressTotal = new TextView(this);
            txtInProgressTotal.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtInProgressTotal.Text = "5000";
            txtInProgressTotal.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtInProgressTotal.SetTypeface(null, TypefaceStyle.Bold);

            UIControl.AddControl(this, txtInProgressTotal, "txtInProgressTotalOnline_" + equipment);

            txtInProgressTotal.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtInProgressTotal);

            TextView txtFiller = new TextView(this);
            txtFiller.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtFiller.Text = " [ ";
            txtFiller.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtFiller.SetTypeface(null, TypefaceStyle.Bold);

            txtFiller.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtFiller);

            TextView txtPercentage = new TextView(this);
            txtPercentage.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtPercentage.Text = "100%";
            txtPercentage.SetTextColor(Color.ParseColor(UIControl.GetColorCodeStatus("ONLINE")));
            txtPercentage.SetTypeface(null, TypefaceStyle.Bold);

            UIControl.AddControl(this, txtPercentage, "txtPercentageOnline_" + equipment);

            txtPercentage.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtPercentage);

            TextView txtFiller2 = new TextView(this);
            txtFiller2.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtFiller2.Text = " ]";
            txtFiller2.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));
            txtFiller2.SetTypeface(null, TypefaceStyle.Bold);

            txtFiller2.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent) { };

            linearInProgress.AddView(txtFiller2);
        }

        private void createOffline(LinearLayout LinearParent, string equipment, bool isVisible)
        {
            LinearLayout linearDetails = new LinearLayout(this);
            linearDetails.Orientation = Orientation.Vertical;

            if (isVisible == true)
            {
                linearDetails.Visibility = ViewStates.Visible;
            }
            else
            {
                linearDetails.Visibility = ViewStates.Gone;
            }

            UIControl.AddControl(this, linearDetails, "linearOffline_" + equipment);

            linearDetails.LayoutParameters =
            new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent)
            {
                LeftMargin = Common.convertDPtoPixel(5),
                BottomMargin = Common.convertDPtoPixel(5),
                Weight = Common.convertDPtoPixel(100)
            };

            LinearParent.AddView(linearDetails);

            TextView txtLot = new TextView(this);

            txtLot.Text = "N / A";
            txtLot.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtLot.SetTypeface(null, TypefaceStyle.Bold);
            txtLot.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            txtLot.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                {
                    LeftMargin = Common.convertDPtoPixel(5),
                    TopMargin = Common.convertDPtoPixel(5)
                };

            linearDetails.AddView(txtLot);

            LinearLayout linearOffline = new LinearLayout(this);
            linearOffline.Orientation = Orientation.Horizontal;
            linearOffline.LayoutParameters =
                new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent)
                {
                    TopMargin = Common.convertDPtoPixel(25)
                };

            linearDetails.AddView(linearOffline);

            ImageView imgView = new ImageView(this);
            imgView.LayoutParameters =
                new LinearLayout.LayoutParams(Common.convertDPtoPixel(74), Common.convertDPtoPixel(100))
                {
                    LeftMargin = Common.convertDPtoPixel(10)
                };

            imgView.SetScaleType(ImageView.ScaleType.FitCenter);
            imgView.SetImageResource(Resource.Drawable.unplugged);

            linearOffline.AddView(imgView);

            TextView txtContent = new TextView(this);
            txtContent.SetTextAppearance(this, Android.Resource.Style.TextAppearanceMedium);
            txtContent.Text = "This machine is offline. If you wish to turn it on, please call a technician.";
            txtContent.SetTextColor(Color.ParseColor(UIControl.GetColorCodePie()));

            txtContent.LayoutParameters = new LinearLayout.LayoutParams(Common.convertDPtoPixel(195), ViewGroup.LayoutParams.MatchParent)
            {
                LeftMargin = Common.convertDPtoPixel(10)
            };

            txtContent.Gravity = GravityFlags.Center;

            linearOffline.AddView(txtContent);
        }

        private void GoToAlarmPage(string equipment)
        {
            Toast.MakeText(this, "Equipment: " + equipment, ToastLength.Short).Show();
            //redirect to alarm page code here
        }

        private void GoToEquipmentPage(string equipment)
        {
            int ID = UIControl.GetControlID(this, "linearIdle_" + equipment);
            LinearLayout linearIdle = FindViewById<LinearLayout>(ID);

            ID = UIControl.GetControlID(this, "linearOnline_" + equipment);
            LinearLayout linearOnline = FindViewById<LinearLayout>(ID);

            if (linearOnline.Visibility == ViewStates.Visible)
            {
                Intent myIntent = new Intent(this, typeof(Online));
                myIntent.PutExtra("Equipment", equipment);
                Finish();
                StartActivity(myIntent);
            }
            else if (linearIdle.Visibility == ViewStates.Visible)
            {
                Intent myIntent = new Intent(this, typeof(Idle));
                myIntent.PutExtra("Equipment", equipment);
                Finish();
                StartActivity(myIntent);
            }
        }
    }
}

