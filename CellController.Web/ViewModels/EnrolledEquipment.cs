﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.ViewModels
{
    public class EnrolledEquipment
    {
        public int ID { get; set; }
        public string Equipment { get; set; }
        public int TypeCode { get; set; }
        public string Type { get; set; }
        public bool isSECSGEM { get; set; }
        public string Port { get; set; }
        public string HostID { get; set; }
    }
}