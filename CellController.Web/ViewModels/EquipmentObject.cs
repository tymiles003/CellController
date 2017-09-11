using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class EquipmentObject
    {
        public int ID { get; set; }
        public string EquipID { get; set; }
        public string EquipModel { get; set; }
        public string EquipSerialNum { get; set; }
        public DateTime TimeStamp { get; set; }
        public string EquipIP { get; set; }
        public string EquipPort { get; set; }
        public string HostID { get; set; }
        public string DeviceID { get; set; }
        public int EquipType { get; set; }
        public string Process { get; set; }
    }
}