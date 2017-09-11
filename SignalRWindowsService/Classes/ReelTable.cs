using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWindowsService.Classes
{
    class ReelTable
    {
        public string EquipID { get; set; }
        public int ReelQty { get; set; }
        public int CurrentQty { get; set; }
        public int CurrentReel { get; set; }
        public int TotalReel { get; set; }
        public int RemainingReel { get; set; }
        public int AllowedReel { get; set; }
        public int InReel { get; set; }
    }
}
