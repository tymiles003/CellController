namespace CellController.Classes
{
    public class Common
    {
        public static int convertDPtoPixel(float dp)
        {
            float scale = Android.App.Application.Context.Resources.DisplayMetrics.Density;
            var pixels = (int)(dp * scale + 0.5f);
            return pixels;
        }
    }
}