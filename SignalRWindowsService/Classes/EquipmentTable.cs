using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWindowsService.Classes
{
    class EquipmentTable
    {
        public int ID { get; set; }
        public string EquipID { get; set; }
        public string EquipModel { get; set; }
        public string EquipSerialNum { get; set; }
        public string EquipData { get; set; }
        public DateTime TimeStamp { get; set; }
        public string EquipIP { get; set; }
        public string EquipPort { get; set; }
        public string HostID { get; set; }
        public string DeviceID { get; set; }
        public int EquipType { get; set; }
        public bool Process { get; set; }
        public string LotInProcess { get; set; }
        public int TrackInQty { get; set; }
        public int TrackInToleranceQty { get; set; }
        public string LastFeedBackData { get; set; }
        public string LastFeedBackTime { get; set; }
        public string UserInProcess { get; set; }
        public bool IsGrouped { get; set; }
        public string RecipeInProcess { get; set; }
    }
}
