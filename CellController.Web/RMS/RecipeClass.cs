using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CellController.Web.RMS
{
    public class RecipeClass
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string connStr = ConfigurationManager.ConnectionStrings[env + "_" + "cellcontroller"].ConnectionString;

        //get template data
        public static DataTable getData(string ProductName, string EquipID, string ID)
        {
            string query = "";

            bool isEffectiveDate = SettingModels.isEffectiveDate();

            string type = EquipmentModels.GetEquipmentTypeJoin(Convert.ToInt32(ID));

            if (type == "")
            {
                var child  = EquipmentModels.getChildEquipments(EquipID);
                if (child != null)
                {
                    if (child.Count > 0)
                    {
                        DataTable total_dt = new DataTable();

                        for (int x = 0; x < child.Count; x++)
                        {
                            if (isEffectiveDate == false)
                            {
                                query = "select top 1 a.RecipeID, a.RecipeName, a.RecipeBody, b.ProductName, c.EquipID, a.EffectiveDate, a.RecipeSize from RecipeTable a left join ProductTable b on a.ProductID=b.ProductID left join EquipRecipeTable c on a.RecipeID=c.RecipeID where b.ProductName='" + ProductName + "' and c.EquipID='" + child[x] + "' and a.EffectiveDate is not null and a.DeactivationDate is null order by a.DateApproved desc";
                            }
                            else
                            {
                                query = "select top 1 a.RecipeID, a.RecipeName, a.RecipeBody, b.ProductName, c.EquipID, a.EffectiveDate, a.RecipeSize from RecipeTable a left join ProductTable b on a.ProductID=b.ProductID left join EquipRecipeTable c on a.RecipeID=c.RecipeID where b.ProductName='" + ProductName + "' and c.EquipID='" + child[x] + "' and a.EffectiveDate is not null and convert(datetime,a.EffectiveDate,101)<getdate() and a.DeactivationDate is null order by a.DateApproved desc";
                            }

                            SqlConnection conn = new SqlConnection(connStr);
                            SqlCommand cmd = new SqlCommand(query, conn);
                            //cmd.CommandTimeout = 3600;

                            DataSet ds = new DataSet();
                            DataTable dt = new DataTable();
                            SqlDataAdapter da = new SqlDataAdapter(cmd);

                            try
                            {
                                conn.Open();
                                da.Fill(ds);
                                dt = ds.Tables[0];
                                da.Dispose();
                                cmd.Dispose();
                                conn.Close();
                                conn.Dispose();
                                SqlConnection.ClearPool(conn);
                            }
                            catch
                            {
                                conn.Close();
                                conn.Dispose();
                                SqlConnection.ClearPool(conn);
                            }
                            finally
                            {
                                if (conn.State == ConnectionState.Open)
                                {
                                    conn.Close();
                                    conn.Dispose();
                                    SqlConnection.ClearPool(conn);
                                }
                            }

                            total_dt.Merge(dt);
                            
                        }

                        total_dt.DefaultView.Sort = "EquipID asc";
                        total_dt = total_dt.DefaultView.ToTable();
                        return total_dt;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            else
            {
                if (isEffectiveDate == false)
                {
                    query = "select top 1 a.RecipeID, a.RecipeName, a.RecipeBody, b.ProductName, c.EquipID, a.EffectiveDate, a.RecipeSize from RecipeTable a left join ProductTable b on a.ProductID=b.ProductID left join EquipRecipeTable c on a.RecipeID=c.RecipeID where b.ProductName='" + ProductName + "' and c.EquipID='" + EquipID + "' and a.EffectiveDate is not null and a.DeactivationDate is null order by a.DateApproved desc";
                }
                else
                {
                    query = "select top 1 a.RecipeID, a.RecipeName, a.RecipeBody, b.ProductName, c.EquipID, a.EffectiveDate, a.RecipeSize from RecipeTable a left join ProductTable b on a.ProductID=b.ProductID left join EquipRecipeTable c on a.RecipeID=c.RecipeID where b.ProductName='" + ProductName + "' and c.EquipID='" + EquipID + "' and a.EffectiveDate is not null and convert(datetime,a.EffectiveDate,101)<getdate() and a.DeactivationDate is null order by a.DateApproved desc";
                }

                SqlConnection conn = new SqlConnection(connStr);
                SqlCommand cmd = new SqlCommand(query, conn);
                //cmd.CommandTimeout = 3600;

                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                try
                {
                    conn.Open();
                    da.Fill(ds);
                    dt = ds.Tables[0];
                    da.Dispose();
                    cmd.Dispose();
                    conn.Close();
                    conn.Dispose();
                    SqlConnection.ClearPool(conn);
                }
                catch
                {
                    conn.Close();
                    conn.Dispose();
                    SqlConnection.ClearPool(conn);
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                    {
                        conn.Close();
                        conn.Dispose();
                        SqlConnection.ClearPool(conn);
                    }
                }

                return dt;
            }
            
        }

        public static DataTable getParams(string recipeID)
        {
            string query = "SELECT c.GroupName,d.parametername,d.[min],d.[max],d.value FROM RecipeTable a left join limitsettable b on a.LimitSetID = b.limitsetID left join GroupDetailTable c on b.limitsetid = c.limitsetid left join parameterTable d on c.groupid = d.groupid where a.RecipeID='" + recipeID + "' and c.groupname is not null and d.parametername is not null and d.[min] is not null and d.[max] is not null and d.[value] is not null order by c.GroupName,d.parametername ";
            DataTable dt = new DataTable();

            try
            {
                dt = DBModel.CustomSelectQuery(query);
                return dt;
            }
            catch
            {
                return null;
            }
        }
    }
}