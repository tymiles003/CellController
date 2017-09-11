using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class UserObject
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string UserModeCode { get; set; }
        public string ThumbnailPhoto { get; set; }
    }
}