using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class EquipmentType
    {
        public int ID { get; set; }
        public string Type { get; set; }
        public bool IsEnabled { get; set; }
    }
}