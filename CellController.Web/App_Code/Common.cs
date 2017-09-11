using CellController.Web.Helpers;
using CellController.Web.Models;
using CellController.Web.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web;

public class Common
{
    public static string GetEquipmentStatus(string Equipment)
    {
        string status = HttpHandler.GetEquipmentStatus(Equipment);

        return status;
    }

    public static string GetEquipmentStatusTCP(string Equipment, string Port)
    {
        string status = HttpHandler.GetEquipmentStatusTCP(Equipment, Port);

        return status;
    }

    public static int GetAlarmCount(string Equipment)
    {
        var alarms = HttpHandler.GetAlarms(Equipment);
        int count = 0;
        try
        {
            count = alarms.Count;
        }
        catch
        {
            count = 0;
        }
        return count;
    }

    public static int GetNewAlarmCountTCP(string Equipment)
    {
        int alarms = 0;

        try
        {
            alarms = EquipmentModels.getNewAlarmCountTCP(Equipment);
        }
        catch
        {
            alarms = 0;
        }

        return alarms;
    }

    public static int GetTrackInQty(string Equipment)
    {
        var qty = EquipmentModels.getTrackInQTY(Equipment);

        return qty;
    }

    public static int GetBrandedQty(string Equipment)
    {
        var qty = EquipmentModels.getBrandedQty(Equipment);

        return qty;
    }

    public static int GetUnbrandedQty(string Equipment)
    {
        var qty = EquipmentModels.getUnbrandedQty(Equipment);

        return qty;
    }

    public static int GetProcessedQty(string Equipment)
    {
        var qty = EquipmentModels.getProcessedQTY(Equipment);

        return qty;
    }

    public static int GetSECSGEMProcessedQty(string Equipment)
    {
        var qty = EquipmentModels.getSECSGEMProcessedQTY(Equipment);

        return qty;
    }

    public static int GetSECSGEMProcessedQtyInUnits(string Equipment)
    {
        var qty = EquipmentModels.getSECSGEMProcessedQTYInUnits(Equipment);

        return qty;
    }

    public static ReelObject GetReel(string Equipment)
    {
        var reel = ReelModel.SelectReel(Equipment);

        return reel;
    }
    
    public static DataTable CustomQuery(string query)
    {
        DataTable dt = new DataTable();

        dt = CellController.Web.Library.ConnectionString.returnCon.executeSelectQuery(query, CommandType.Text);

        return dt;
    }

    public static bool isSignalR()
    {
        return HttpHandler.isSignalR;
    }

    public static string GetLotInProcess(string equipment)
    {
        var lot = EquipmentModels.getLotInProcess(equipment);
        return lot;
    }

    public static List<EquipmentGroupObject> GetEnrolledGroup()
    {
        var result = GroupEquipmentModels.GetEnrolledGroup();

        return result;
    }

    public static bool GroupHasChild(string groupID)
    {
        var result = GroupEquipmentModels.hasChildGroup(groupID);

        return result;
    }

    public static List<EnrolledEquipment> GetChildEquipment(string groupID, string userID)
    {
        var result = GroupEquipmentModels.GetChildEquipment(groupID, userID);
        return result;
    }
}