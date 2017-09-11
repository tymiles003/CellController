using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWindowsService.Classes
{
    public class MaterialLot
    {
        public string ID { get; set; }
        public string algMaterialDescription { get; set; }
        public string MaterialLotName { get; set; }
        public string Name { get; set; }
        public string Rev { get; set; }
        public string ROR { get; set; }
        public string Qty { get; set; }
        public string Qty2 { get; set; }
        public string ThawingTimestamp { get; set; }
        public string WithdrawalTimestamp { get; set; }
        public string ExpiryTimestamp { get; set; }
        public string ERROR { get; set; }
    }
}
