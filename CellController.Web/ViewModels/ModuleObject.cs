using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class ModuleObject
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public string ParentName { get; set; }
        public string Description { get; set; }
        public bool IsEnabled { get; set; }
        public bool HasChild { get; set; }
        public int ChildCount { get; set; }
    }
}