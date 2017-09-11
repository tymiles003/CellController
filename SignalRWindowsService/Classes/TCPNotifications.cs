using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWindowsService.Classes
{
    public class TCPNotifications
    {
        public string EquipmentId { get; set; }
        public string MessageId { get; set; }
        public string MessageText { get; set; }
        public int ReadNotification { get; set; }
        public string MessageType { get; set; }
        public DateTime Date { get; set; }
    }
}
