using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CellController.Web.Models
{
    public class DBModel
    {
        public static string env = ConfigurationManager.AppSettings["env"].ToString();
        public static string connStr = ConfigurationManager.ConnectionStrings[env + "_" + "cellcontroller"].ConnectionString;

        //for executing insert,update,delete query
        public static DataTable CustomSelectQuery(string query)
        {
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

        //for executing select query
        public static bool ExecuteCustomQuery(string query)
        {
            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(query, conn);
            //cmd.CommandTimeout = 3600;

            bool result = false;

            try
            {
                conn.Open();
                cmd.ExecuteNonQuery();
                cmd.Dispose();
                conn.Close();
                conn.Dispose();
                result = true;
                SqlConnection.ClearPool(conn);
            }
            catch
            {
                result = false;
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

            return result;
        }
    }
}