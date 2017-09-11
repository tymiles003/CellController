using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace CellController.Web.Helpers
{
    public class SignalRHelper
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string SignalRHub = ConfigurationManager.AppSettings[env + "_" + "SignalRServer"].ToString();
    }
}