using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class AccountObject
    {
        public int UserModeCode { get; set; }
        public string UserModeDesc { get; set; }
        public bool isLoginOverride { get; set; }
    }
}