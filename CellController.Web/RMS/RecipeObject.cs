using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CellController.Web.RMS
{
    public class RecipeObject
    {
        public string RecipeID { get; set; }
        public string RecipeName { get; set; }
        public string RecipeBody { get; set; }
        public string ProductName { get; set; }
        public string EquipID { get; set; }
        public int Counter { get; set; }
        public List<string> GroupName { get; set; }
        public List<string> ParameterName { get; set; }
        public List<string> Min { get; set; }
        public List<string> Max { get; set; }
        public List<string> Value { get; set; }
    }
}