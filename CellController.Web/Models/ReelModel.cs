using CellController.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace CellController.Web.Models
{
    public class ReelModel
    {
        public static bool UpdatePrintReelTable(string EquipID, int ReelQty, int CurrentQty, int CurrentReel, int TotalReel, int RemainingReel, int AllowedReel, int InReel)
        {
            bool result = false;

            string query = "Select EquipID from PrintTable where EquipID='" + EquipID + "'";

            DataTable dt = new DataTable();
            try
            {
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                }
                else
                {
                    result = false;
                }
            }
            catch
            {
                result = false;
            }

            if (result == false)
            {
                query = "Insert into PrintTable(EquipID,ReelQty,CurrentReel,TotalReel,RemainingReel,CurrentQty,AllowedReel,InReel) values('" + EquipID + "'," + ReelQty.ToString() + "," + CurrentReel.ToString() + "," + TotalReel.ToString() + "," + RemainingReel.ToString() + "," + CurrentQty.ToString() + "," + AllowedReel.ToString() + "," + InReel.ToString() + ")";
            }
            else
            {
                query = "Update PrintTable set ReelQty=" + ReelQty.ToString() + "," + "CurrentQty=" + CurrentQty.ToString() + "," + "AllowedReel=" + AllowedReel.ToString() + "," + "InReel=" + InReel.ToString() + "," + "CurrentReel=" + CurrentReel.ToString() + "," + "TotalReel=" + TotalReel.ToString() + "," + "RemainingReel=" + RemainingReel.ToString() + " where EquipID='" + EquipID + "'";
            }

            bool output = false;
            try
            {
                output = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                output = false;
            }

            return output;

        }

        public static bool UpdateCounter(string EquipID, int AllowedReel, int CurrentReel, int RemainingReel)
        {
            string query = "";
            query = "Update PrintTable set AllowedReel=" + AllowedReel.ToString() + "," + "CurrentReel=" + CurrentReel.ToString() + "," + "RemainingReel=" + RemainingReel.ToString() + " where EquipID='" + EquipID + "'";

            bool result = false;

            try
            {
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static bool ClearReelTable(string EquipID)
        {
            bool result = false;
            string query = "Update PrintTable set ReelQty=null,CurrentQty=null,CurrentReel=null,TotalReel=null,RemainingReel=null,AllowedReel=null,InReel=null where EquipID='" + EquipID + "'";
            try
            {
                result = DBModel.ExecuteCustomQuery(query);
            }
            catch
            {
                result = false;
            }

            return result;
        }

        public static ReelObject SelectReel(string EquipID)
        {
            string query = "Select ReelQty,CurrentQty,CurrentReel,TotalReel,RemainingReel,AllowedReel,InReel from PrintTable where EquipID='" + EquipID + "'";

            ReelObject obj = new ReelObject();

            DataTable dt = new DataTable();
            try
            {
                dt = DBModel.CustomSelectQuery(query);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        foreach(DataRow dr in dt.Rows)
                        {
                            obj.EquipID = EquipID;
                            obj.ReelQty = Convert.ToInt32(dr["ReelQty"].ToString());
                            obj.CurrentQty = Convert.ToInt32(dr["CurrentQty"].ToString());
                            obj.CurrentReel = Convert.ToInt32(dr["CurrentReel"].ToString());
                            obj.TotalReel = Convert.ToInt32(dr["TotalReel"].ToString());
                            obj.RemainingReel = Convert.ToInt32(dr["RemainingReel"].ToString());
                            obj.AllowedReel = Convert.ToInt32(dr["AllowedReel"].ToString());
                            obj.InReel = Convert.ToInt32(dr["InReel"].ToString());
                        }
                    }
                    else
                    {
                        obj = null;
                    }
                }
                else
                {
                    obj = null;
                }
            }
            catch
            {
                obj = null;
            }

            return obj;
        }

    }
}
