using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class EquipmentGroupObject
    {
        public int ID { get; set; }
        public string GroupName { get; set; }
        public bool isEnabled { get; set; }
    }
}