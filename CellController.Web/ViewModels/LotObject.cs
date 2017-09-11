using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class LotObject
    {
        public string Owner { get; set; }
        public string ProductName { get; set; }
        public string WorkflowRev { get; set; }
        public string PriorityCode { get; set; }
        public string WIPType { get; set; }
        public string Step { get; set; }
        public string WIPStatus { get; set; }
        public string ProcessSpec { get; set; }
        public string MaxStandbyQty { get; set; }
        public string FactoryName { get; set; }
        public string ProcessSpecObjectType { get; set; }
        public string ReworkReason { get; set; }
        public string ContainerName { get; set; }
        public string Qty { get; set; }
        public string ProductRev { get; set; }
        public string MainQty { get; set; }
        public string MaxQtyToProcess { get; set; }
        public string ProductLine { get; set; }
        public string ProcessSpecObjectCategory { get; set; }
        public string ProcessSpecRev { get; set; }
        public string Workflow { get; set; }
        public string MaxInProcessQty { get; set; }
        public string WIPYieldResult { get; set; }
        public string HoldReason { get; set; }
        public string MaxProcessedQty { get; set; }
        public string StartReason { get; set; }
        public string MfgOrderName { get; set; }
        public string Qty2 { get; set; }
        public string LotStatus { get; set; }
        public string Location { get; set; }
        public string NextStep { get; set; }
    }
}