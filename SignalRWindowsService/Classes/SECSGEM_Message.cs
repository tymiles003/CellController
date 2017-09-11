using System;

namespace SignalRWindowsService.Classes
{
    public class SECSGEM_Message
    {
        public int ID { get; set; }
        public string Equipment { get; set; }
        public string StreamFunction { get; set; }
        public string Direction { get; set; }
        public string RequestResponse { get; set; }
        public string CommonID { get; set; }
        public int TxID { get; set; }
        public int Reply { get; set; }
        public string Message { get; set; }
        public DateTime TimeSentReceived { get; set; }
    }
}
