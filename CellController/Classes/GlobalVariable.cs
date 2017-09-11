using System.Collections.Generic;

namespace CellController.Classes
{
    public class GlobalVariable
    {
        public static List<EnrolledEquipment> myEnrolledEquipment = new List<EnrolledEquipment>();
        public static Dictionary<int, UIControl> myUIControls = new Dictionary<int, UIControl>();
        public static int controlID = 1;
        public static string userID = "";
        public static string currentEquipment = "";
    }
}