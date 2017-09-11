using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWindowsService.Classes
{
    public class EquipmentQty
    {
        public string EquipmentID { get; set; }
        public int ProcessedQty { get; set; }
        public int EndQty { get; set; }
        public int TotalQty { get; set; }
        public int BrandedQty { get; set; }
        public int UnbrandedQty { get; set; }
    }
}
