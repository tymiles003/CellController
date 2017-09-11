using System;

namespace SignalRWindowsService.Classes
{
    public class Alarm
    {
        public string MessageId { get; set; }
        public string Equipment { get; set; }
        public string Message { get; set; }
        public string MessageType { get; set; }
        public string TransactionId { get; set; }
        public string ReadNotification { get; set; }
        public DateTime Date { get; set; }
    }
}
