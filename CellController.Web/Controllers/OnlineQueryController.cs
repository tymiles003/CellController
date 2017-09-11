using CellController.Web.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CellController.Web.Controllers
{
    public class OnlineQueryController : Controller
    {
        [HttpGet]
        public JsonResult GetAllQuery()
        {
            var queries = HttpHandler.GetAllOnlineQuery();

            return Json(queries, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetQueryField(string QueryName, string UserID)
        {
            var queries = HttpHandler.GetOnlineQueryField(QueryName, UserID);

            return Json(queries, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOnlineQueryReport(string QueryName, List<string> lstField, List<string> lstValue, string UserID)
        {
            var result = HttpHandler.GetOnlineQueryReport(QueryName, lstField, lstValue, UserID);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}