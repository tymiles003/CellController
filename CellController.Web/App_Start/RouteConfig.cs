using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CellController.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "UserAccountRoute",
                url: "Admin/UserAccount",
                defaults: new { controller = "UserAccount", action = "Index" }
            );

            routes.MapRoute(
                name: "EquipmentRoute",
                url: "Equipment/ManageEquipment",
                defaults: new { controller = "ManageEquipment", action = "Index" }
            );

            routes.MapRoute(
                name: "EquipmentGroupRoute",
                url: "Equipment/EquipmentGroup",
                defaults: new { controller = "EquipmentGroup", action = "Index" }
            );

            routes.MapRoute(
                name: "EnrollEquipmentRoute",
                url: "Equipment/EnrollEquipment",
                defaults: new { controller = "EnrollEquipment", action = "Index" }
            );

            routes.MapRoute(
                name: "EnrollGroupEquipmentRoute",
                url: "Equipment/GroupEnrollment",
                defaults: new { controller = "GroupEnrollment", action = "Index" }
            );

            routes.MapRoute(
                name: "AccessRightsRoute",
                url: "Admin/AccessRights",
                defaults: new { controller = "AccessRights", action = "Index" }
            );

            routes.MapRoute(
                name: "AuditRoute",
                url: "Admin/Audit",
                defaults: new { controller = "Audit", action = "Index" }
            );

            routes.MapRoute(
                name: "ConfigurationRoute",
                url: "Admin/Configuration",
                defaults: new { controller = "Configuration", action = "Index" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
