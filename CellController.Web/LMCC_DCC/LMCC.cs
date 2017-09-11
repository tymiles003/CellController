using CellController.Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CellController.Web.LMCC_DCC
{
    public class LMCC
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string connStr = ConfigurationManager.ConnectionStrings[env + "_" + "cellcontroller"].ConnectionString;

        //get template data
        public static DataTable getData(string ProductName)
        {
            string query = "";

            //query = "Select a.PartNo,a.PackageType,a.Specs,a.MarkingInstructionID,b.CASName,b.CASLink,a.PkgTemp,a.VLMName,a.EffectiveWorkWeek from PESubmissionTable a left join DCCSubmissionTable b on a.DCCSubmissionID=b.DCCSubmissionID where a.ProductName ='" + ProductName + "' and a.EffectiveWorkWeek<>'' and a.EffectiveWorkWeek is not null order by a.EffectiveWorkWeek desc" ;

            bool isEffectiveDate = SettingModels.isEffectiveDate();

            if (isEffectiveDate == false)
            {
                query = "Select top 1 a.PartNo,a.PackageType,a.Specs,a.MarkingInstructionID,b.CASName,b.CASLink,a.PkgTemp,a.VLMName,a.EffectiveWorkWeek from PESubmissionTable a left join DCCSubmissionTable b on a.DCCSubmissionID=b.DCCSubmissionID where a.ProductName ='" + ProductName + "' and a.EffectiveWorkWeek<>'' and a.EffectiveWorkWeek is not null order by a.EffectiveWorkWeek desc";
            }
            else
            {
                query = "Select top 1 a.PartNo,a.PackageType,a.Specs,a.MarkingInstructionID,b.CASName,b.CASLink,a.PkgTemp,a.VLMName,a.EffectiveWorkWeek from PESubmissionTable a left join DCCSubmissionTable b on a.DCCSubmissionID=b.DCCSubmissionID where a.ProductName ='" + ProductName + "' and a.EffectiveWorkWeek<>'' and a.EffectiveWorkWeek is not null and convert(datetime,a.EffectiveWorkWeek,101)<getdate() order by a.EffectiveWorkWeek desc";
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

        //get number of lines of template
        public static int getNumLine(string MarkingInstructionID)
        {
            string query = "Select Lines from MarkingInstructionTable where MarkingInstructionID='" + MarkingInstructionID + "'";

            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(query, conn);

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

            int numberOfLines = 0;

            foreach (DataRow dr in dt.Rows)
            {
                try
                {
                    numberOfLines = Convert.ToInt32(dr["Lines"].ToString());
                }
                catch
                {
                    numberOfLines = 0;
                }
            }

            return numberOfLines;
        }

        //get custom text of template
        public static string getCustomText(string MarkingInstructionID)
        {
            string query = "Select CustomText from MarkingInstructionTable where MarkingInstructionID='" + MarkingInstructionID + "'";

            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(query, conn);

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

            string customText = "";

            foreach (DataRow dr in dt.Rows)
            {
                try
                {
                    customText = dr["CustomText"].ToString();

                    if (customText == "" || customText == null)
                    {
                        customText = "";
                    }
                }
                catch
                {
                    customText = "";
                }
            }

            return customText;
        }

        //get line text of template
        public static string getLineText(string MarkingInstructionID, string PartNum, string LotNo, string PkgTemp)
        {
            string Lines = "";

            string query = "Select MarkingLineName,DigitNo,Field,Position from MarkingDigitTable where MarkingInstructionID='" + MarkingInstructionID 
                + "' order by MarkingLineName,DigitNo,Position";

            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(query, conn);

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

            int count = 0;
            string temp = "";

            if (dt.Rows.Count > 0)
            {
                string holder = "";
                int index = 0;

                foreach (DataRow dr in dt.Rows)
                {
                    string LineName = dr["MarkingLineName"].ToString();
                    int DigitNo = Convert.ToInt32(dr["DigitNo"].ToString());
                    string Field = dr["Field"].ToString();
                    int Position = Convert.ToInt32(dr["Position"].ToString());

                    index = Position - 1;


                    if (Field == "LC")
                    {
                        try
                        {
                            holder = LotNo.Substring(index, 1);
                        }
                        catch
                        {
                            holder = "";
                        }
                    }
                    else if (Field == "PT")
                    {
                        try
                        {
                            holder = PkgTemp.Substring(index, 1);
                        }
                        catch
                        {
                            holder = "";
                        }
                    }
                    else if (Field == "PC")
                    {
                        try
                        {
                            holder = PartNum.Substring(index, 1);
                        }
                        catch
                        {
                            holder = "";
                        }
                    }
                    else if (Field == "CS")
                    {
                        string customText = getCustomText(MarkingInstructionID);

                        try
                        {
                            holder = customText.Substring(index, 1);
                        }
                        catch
                        {
                            holder = "";
                        }
                    }

                    if (temp != LineName)
                    {
                        if (count > 0)
                        {
                            Lines += ";" + LineName + "=" + holder;
                        }
                        else
                        {
                            Lines += LineName + "=" + holder;
                        }
                    }
                    else
                    {
                        Lines += holder;
                    }

                    temp = LineName;
                    count++;
                }
            }

            return Lines;
        }
    }
}

