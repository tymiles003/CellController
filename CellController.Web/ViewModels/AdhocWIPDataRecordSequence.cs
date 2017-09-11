using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class AdhocWIPDataRecordSequence
    {
        public string No { get; set; }
        public string RecordSequence { get; set; }
        public string ObjectName { get; set; }
        public string ObjectRevision { get; set; }
        public string CreationTimestamp { get; set; }
        public string CreationUsername { get; set; }
        public string TxnTimestamp { get; set; }
        public string TxnUsername { get; set; }
    }
}