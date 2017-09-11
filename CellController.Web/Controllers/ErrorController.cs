using CellController.Web.Helpers;
using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CellController.Web.Controllers
{
    public class ErrorController : Controller
    {
        private CustomHelper custom_helper = new CustomHelper();

        public ActionResult Index()
        {
            //Check cookie and session variables for retaining login status
            //if true go to page, else return to login page
            if (HttpHandler.CheckSession())
            {
                string username = Session["Username"].ToString();
                string userType = UserModels.GetUserType(username);
                string thumbnailPhoto = UserModels.GetThumbnailPhoto(username);
                try
                {
                    HttpContext.Session.Add("ThumbnailPhoto", thumbnailPhoto);
                    HttpContext.Session.Add("Name", Request.Cookies["Name"].Value.ToString());
                    HttpContext.Session.Add("Position", Request.Cookies["Position"].Value.ToString());
                    HttpContext.Session.Add("EmployeeNumber", Request.Cookies["EmployeeNumber"].Value.ToString());
                }
                catch { }

                //generate the menus
                ViewBag.Menu = custom_helper.GenerateMenu(0, 0, userType);

                string header = "";
                try
                {
                    header = Session["ModuleErrorHeader"].ToString();
                }
                catch { }

                string breadcrumbs = "";
                try
                {
                    breadcrumbs = Session["ModuleErrorBreadCrumbs"].ToString();
                }
                catch { }

                if (header == "" || header == null)
                {
                    header = "Error";
                }

                if (breadcrumbs == "" || breadcrumbs == null)
                {
                    breadcrumbs = "Restricted Access";
                }

                try
                {
                    Session.Remove("ModuleErrorHeader");
                    Session.Remove("ModuleErrorBreadCrumbs");
                }
                catch { }

                ViewBag.Title = "Cell Controller";
                ViewBag.PageHeader = header;
                ViewBag.Breadcrumbs = breadcrumbs;

                return View();
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }
    }
}