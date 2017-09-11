using System.Collections.Generic;
using Android.Content;
using AChartEngine;
using Android.Graphics;
using AChartEngine.Renderers;
using AChartEngine.Models;

namespace CellController.Classes
{
    public class Doughnut
    {
        public static GraphicalView OEE(Context context, int value, int value2, string color1, string color2)
        {
            IList<double[]> values = new List<double[]>();
            values.Add(new double[] { value, value2 });
            IList<string[]> titles = new List<string[]>();
            titles.Add(new string[] { "A", "B" });
            int[] colors = new int[] { Color.ParseColor(color1), Color.ParseColor(color2) };


            DefaultRenderer renderer = BuildCategoryRenderer(colors);
            renderer.BackgroundColor = Color.Transparent;

            renderer.LabelsColor = Color.Gray;
            renderer.PanEnabled = false;
            renderer.ZoomEnabled = false;
            renderer.StartAngle = 270;
            return ChartFactory.GetDoughnutChartView(context, BuildMultipleCategoryDataset("MyDoughnut", titles, values), renderer);
        }

        public static DefaultRenderer BuildCategoryRenderer(int[] colors)
        {
            DefaultRenderer renderer = new DefaultRenderer();
            renderer.LabelsTextSize = 15;
            renderer.LegendTextSize = 15;
            renderer.ShowLabels = false;
            renderer.ShowLegend = false;
            renderer.Scale = (float)1.44;
            renderer.SetMargins(new int[] { 2, 30, 15, 0 });

            foreach (int color in colors)
            {
                SimpleSeriesRenderer r = new SimpleSeriesRenderer();
                r.Color = color;
                renderer.AddSeriesRenderer(r);
            }
            return renderer;
        }

        public static MultipleCategorySeries BuildMultipleCategoryDataset(string title, IList<string[]> titles, IList<double[]> values)
        {
            MultipleCategorySeries series = new MultipleCategorySeries(title);
            int k = 0;
            foreach (double[] value in values)
            {
                series.Add(2007 + k + "", titles[k], value);
                k++;
            }

            return series;
        }
    }
}