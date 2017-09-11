using System;
using System.Configuration;
using System.IO;

namespace SignalRWindowsService.Classes
{
    public class Common
    {
        private static string env = ConfigurationManager.AppSettings["env"].ToString();
        private static string path = ConfigurationManager.AppSettings[env + "_" + "mainDirectory"].ToString();
        private static string filename = ConfigurationManager.AppSettings[env + "_" + "logFileName"].ToString();
        private static string recipePath = ConfigurationManager.AppSettings[env + "_" + "recipeDirectory"].ToString();

        public static void Log(string content)
        {
            try
            {
                FileStream fs = new FileStream(path + "\\" + filename, FileMode.OpenOrCreate, FileAccess.Write);

                //set up a streamwriter for adding text
                StreamWriter sw = new StreamWriter(fs);

                //find the end of the underlying filestream
                sw.BaseStream.Seek(0, SeekOrigin.End);

                //add the text
                sw.WriteLine(content);
                //add the text to the underlying filestream

                sw.Flush();
                //close the writer
                sw.Close();

                Console.WriteLine(content);
            }
            catch (Exception x)
            {
                Console.WriteLine("Error: " + x.Message);
            }
        }

        public static bool createMainDirectory()
        {
            bool exists = false;

            try
            {
                exists = Directory.Exists(path);
            }
            catch (Exception z)
            {
                exists = false;
                Console.WriteLine("Error: " + z.Message);
            }

            bool result = false;

            if (!exists)
            {
                try
                {
                    Directory.CreateDirectory(path);
                    result = true;
                }
                catch (Exception e)
                {
                    result = false;
                    Console.WriteLine("Error: " + e.Message);
                }
            }
            else
            {
                result = true;
            }

            return result;
        }

        public static bool createRecipeDirectory()
        {
            bool exists = false;

            try
            {
                exists = Directory.Exists(recipePath);
            }
            catch (Exception z)
            {
                exists = false;
                Console.WriteLine("Error: " + z.Message);
            }

            bool result = false;

            if (!exists)
            {
                try
                {
                    Directory.CreateDirectory(recipePath);
                    result = true;
                }
                catch (Exception e)
                {
                    result = false;
                    Console.WriteLine("Error: " + e.Message);
                }
            }
            else
            {
                result = true;
            }

            return result;
        }
    }
}
