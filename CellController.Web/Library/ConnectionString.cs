using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace CellController.Web.Library
{
    public class ConnectionString
    {
        private static DataLayerLibrary.DataLayer dataLayer = null;

        static ConnectionString()
        {
            if (dataLayer == null)
            {
                dataLayer = new DataLayerLibrary.DataLayer(ConfigurationManager.AppSettings["env"].ToString() + "_cellcontroller");
            }
        }

        public static DataLayerLibrary.DataLayer returnCon
        {
            get
            {
                return dataLayer;
            }
        }
    }
}