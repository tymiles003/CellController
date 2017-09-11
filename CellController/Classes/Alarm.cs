using System;

namespace CellController.Classes
{
    public class Alarm
    {
        public string EquipmentId { get; set; }
        public string MessageId { get; set; }
        public string MessageText { get; set; }
        public string MessageType { get; set; }
        public string ReadNotification { get; set; }
        public DateTime Date { get; set; }
        public string TxnID { get; set; }
    }
}