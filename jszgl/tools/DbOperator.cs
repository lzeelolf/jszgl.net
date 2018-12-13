using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using jszgl.Tools;

namespace jszgl
{
    public class cs
    {
        public string number;
        public string lb;
        public string name;
        public string nr2;
        public string nr1;
        public string nr3;
        public string nr4;
        public string nr5;
        public string nr6;
        public string nr7;
        public string nr8;
        public string nr9;
        public string nr10;
        public string nr11;
        public string nr12;
        public string nr13;
        public string nr14;
        public string nr15;
    }
    
    public class DbOperator
    {
        //连接字段
        public static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["DbConnStr"].ConnectionString;
        public static readonly string LoginString = ConfigurationManager.ConnectionStrings["LoginConnStr"].ConnectionString;
        public static readonly string MessageString = ConfigurationManager.ConnectionStrings["MessageConnStr"].ConnectionString;
        //直接面向教育科的部门

        public static string GiveOut(string id,string payId,string _operator)
        {
            string[] straightJYK = new string[] { "安全生产指挥中心", "技术科", "综合分析室", "安全科", "职工教育科", "统计信息科" };
            List<cs> csList = Cs2();
            //发放动作。先通过id取bgxx的department和changetype，然后做判断  通过payid更新jbxx
            try
            {
                string sqlCmd = "select department,changeType,finishStatus,archivesId from bgxx where id = @id";
                SqlParameter[] para = new SqlParameter[]
                {
                    new SqlParameter("@id", id),
                };
                SqlDataReader sdr = SqlHelper.ExecuteReader(ConnectionString, CommandType.Text, sqlCmd, para);
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        string department = sdr["department"].ToString();
                        string changeType = sdr["changeType"].ToString();
                        string finishStatus = sdr["finishStatus"].ToString();
                        string archivesId = sdr["archivesId"].ToString();
                        string sql1 = "";
                        if (finishStatus == csList.Find(x => x.lb == "finishStatus" && x.name == "ffdcj").nr2)
                        {
                            //车间发放到个人
                            sql1 = " grArriveDate=convert(varchar(10),GETDATE(),120),finishStatus='" + csList.Find(x => x.lb == "finishStatus" && x.name == "ffdgr").nr2 + "',cjOperator='";
                        }else if(Array.IndexOf(straightJYK, department) > -1)
                        {
                            //教育科发放到个人
                            sql1 = " grArriveDate=convert(varchar(10),GETDATE(),120),finishStatus='" + csList.Find(x => x.lb == "finishStatus" && x.name == "ffdgr").nr2 + "',jykOperator='";
                        }
                        else
                        {
                            //教育科发放到车间
                            sql1 = " cjArriveDate=convert(varchar(10),GETDATE(),120), finishStatus='" + csList.Find(x => x.lb == "finishStatus" && x.name == "ffdcj").nr2 + "',jykOperator='";

                        }
                        string sql2 = sql1 + _operator + "'";
                        if (changeType != csList.Find(x => x.lb == "czlb" && x.name == "levelup2").nr2)
                        {
                            string sqlBgxx = "UPDATE BGXX SET" + sql2 +" where id='"+id+"'";
                            string sqlJbxx = "UPDATE JBXX SET status='" + csList.Find(x => x.lb == "zjzt" && x.name == "zc").nr2 + "'";
                            //补证  改finishstatus、操作人 jbxx状态改正常
                            //非有效期满  finishstatus、操作人  jbxx状态改正常
                            //有效期满换证  finishstatus、操作人 并加jbxx有效期、状态改正常
                            if(changeType == csList.Find(x => x.lb == "czlb" && x.name == "yxqmhz").nr3)
                            {
                                sqlJbxx += ",startDate=dateadd(yy," + csList.Find(x => x.lb == "yxq" && x.name == "yxq").nr2 + ",startDate),deadline=dateadd(yy," + csList.Find(x => x.lb == "yxq" && x.name == "yxq").nr2 + ",deadline)";
                            }
                            sqlJbxx += " where payid='" + payId + "'";
                            string[] sqlStr = new string[] { sqlJbxx, sqlBgxx };
                            string exe = ExecTran(sqlStr, changeType);
                            if(exe == "success")
                            {
                                var message = "";
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr1;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr2;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr3;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr4;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr5;
                                ShortMessage(archivesId, message);
                                return "success";

                            }
                            else
                            {
                                return "failed";
                            }
                        }
                        else
                        {
                            //提升  改bgxx的finishstatus、操作人 
                            var str = Update("bgxx", sql2, " where id='" + id + "'");
                            if (str == "success")
                            {
                                var message = "";
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr1;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr2;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr3;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr4;
                                message += csList.Find(x => x.lb == "dxnr" && x.name == "ffdgr").nr5;
                                ShortMessage(archivesId, message);
                                return "success";
                            }
                            else
                            {
                                return "failed";
                            }
                        }
                    }
                }
                else
                {
                    return "数据不存在";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("GiveOut", e);
                return e.ToString();
            }
            return "失败，未知错误";
        }
        
        public static DataTable Login(string payId, string pwd)
        {
            try
            {
                string sqlCmd = "select uName,substring(power,21,1) AS power,department,payId from userinfo1 where payid = @payid and pwd = @pwd";
                SqlParameter[] para = new SqlParameter[]
                {
                    new SqlParameter("@payid", payId),
                    new SqlParameter("@pwd", pwd),
                };

                DataTable dt = SqlHelper.GetDataTable(LoginString, CommandType.Text, sqlCmd, para);
                //DataTable dt = SqlHelper.GetDataTable(, CommandType.Text, sqlCmd, para);
                return dt;
            }
            catch (Exception e)
            {
                LogHelper.WriteException("Login", e);
            }
            return new DataTable();

        }

        public static string ShortMessage(string archivesId, string text)
        {
            try
            {
                archivesId = "08101";
                string sqlCmd = "select phone1,uname from userinfo1 where archivesId = @archivesId";
                SqlParameter[] para = new SqlParameter[]
                {
                    new SqlParameter("@archivesId", archivesId),
                };
                SqlDataReader sdr = SqlHelper.ExecuteReader(LoginString, CommandType.Text, sqlCmd, para);
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        string phone = sdr["phone1"].ToString();
                        string uName = sdr["uname"].ToString();
                        string info = uName + text;
                        string sqlCmd1 = "insert into daifaxinxi (jieshoujihao,xinxi,jibie) VALUES ('" + phone + "','" + info + "',1)";
                        int ret = SqlHelper.ExecuteNonQuery(MessageString, CommandType.Text,sqlCmd1);
                        if(ret == 1)
                        {
                            return "发送成功";
                        }
                        else
                        {
                            return "发送失败";
                        }
                    }
                }
                else
                {
                    return "发送失败，未找到电话号码";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("Login", e);
                return e.ToString();
            }
            return "发送失败，未知错误";

        }
        //list型参数表
        public static List<cs> Cs2()
        {
            DataTable csTable = GetCs();
            List<cs> csList = new List<cs>();
            if (csTable.Rows.Count > 0)
            {
                for (var r = 0; r < csTable.Rows.Count; r++)
                 {
                    cs cs = new cs();
                    cs.number = csTable.Rows[r][0].ToString();
                    cs.lb = csTable.Rows[r][1].ToString();
                    cs.name = csTable.Rows[r][2].ToString();
                    cs.nr1 = csTable.Rows[r][3].ToString();
                    cs.nr2 = csTable.Rows[r][4].ToString();
                    cs.nr3 = csTable.Rows[r][5].ToString();
                    cs.nr4 = csTable.Rows[r][6].ToString();
                    cs.nr5 = csTable.Rows[r][7].ToString();
                    cs.nr6 = csTable.Rows[r][8].ToString();
                    cs.nr7 = csTable.Rows[r][9].ToString();
                    cs.nr8 = csTable.Rows[r][10].ToString();
                    cs.nr9 = csTable.Rows[r][11].ToString();
                    cs.nr10 = csTable.Rows[r][12].ToString();
                    cs.nr11 = csTable.Rows[r][13].ToString();
                    cs.nr12 = csTable.Rows[r][14].ToString();
                    cs.nr13 = csTable.Rows[r][15].ToString();
                    cs.nr14 = csTable.Rows[r][16].ToString();
                    cs.nr15 = csTable.Rows[r][17].ToString();
                    csList.Add(cs);
                }
            }
            return csList;
        }
        //更改
        public static string Update(string table, string setStr,string where)
        {
            try
            {
                string sqlCmd = "UPDATE "+table+" SET "+setStr+" "+where;
                int ret = SqlHelper.ExecuteNonQuery(ConnectionString, CommandType.Text, sqlCmd);
                if (ret > -1)
                {
                    return "success";
                }
                else
                {
                    return "failed";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("Update", e);
                return "failed";
            }

        }

        //插入
        public static string Insert(string table, string columnStr, string valueStr)
        {
            try
            {
                string sqlCmd = "INSERT INTO " + table + " (" + columnStr + ") VALUES (" + valueStr+")";
                int ret = SqlHelper.ExecuteNonQuery(ConnectionString, CommandType.Text, sqlCmd);
                if (ret > -1)
                {
                    return "success";
                }
                else
                {
                    return "failed";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("Insert", e);
            }
            return "failed";

        }

        //删除
        public static string Delete(string table, string where)
        {
            try
            {
                string sqlCmd = "DELETE FROM " + table + where;
                int ret = SqlHelper.ExecuteNonQuery(ConnectionString, CommandType.Text, sqlCmd);
                if (ret > 0)
                {
                    return "success";
                }
                else
                {
                    return "failed";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("Insert", e);
            }
            return "failed";

        }
        //选取参数
        public static DataTable GetCs()
        {
            try
            {
                string sqlCmd = "select * from csxx ";
                DataTable dt = SqlHelper.GetDataTable(ConnectionString, CommandType.Text, sqlCmd);
                return dt;
            }
            catch (Exception e)
            {
                LogHelper.WriteException("GetCs", e);
            }
            return new DataTable();

        }
        //测试session是否更改
        public static DataTable TestSession(string payId)
        {   
            try
            {
                string sqlCmd = "select substring(power,21,1) AS power,uName from userinfo1 where payId='"+payId+"'";
                DataTable dt = SqlHelper.GetDataTable(LoginString, CommandType.Text, sqlCmd);
                return dt;
            }
            catch (Exception e)
            {
                LogHelper.WriteException("TestSession", e);
            }
            return new DataTable();

        }
       
        //查询
        public static DataTable Select(string columns, string table, string where, string order,string db)
        {
            string conn = "";
            switch (db)
            {
                case "baseInfo":
                    conn = LoginString;
                    break;
                case "jszglInfo":
                    conn = ConnectionString;
                    break;
            }
            try
            {
                string sqlCmd = "select " + columns + " from " + table + where + order;
                DataTable dt = SqlHelper.GetDataTable(conn, CommandType.Text, sqlCmd);
                return dt;
            }

            catch (Exception e)
            {
                LogHelper.WriteException("Select", e);
            }
            return new DataTable();

        }

        //查询驾驶证
        public static DataTable QueryCard(string where)
        {
            string columns = " payId,uName,department,birthDate,txrq,datediff(yy,birthdate,getdate()) AS age,cardId,sjDate,startDate,deadline,sjDriveCode,sjDriveType,sjRemark,status,yearlyCheckDate,pym,phyTest,PC";
            string table = " jbxx ";
            try
            {
                string sqlCmd = "select " + columns + " from " + table+where;
                DataTable dt = SqlHelper.GetDataTable(ConnectionString, CommandType.Text, sqlCmd);
                return dt;
            }

            catch (Exception e)
            {
                LogHelper.WriteException("Select", e);
            }
            return new DataTable();

        }
        //查询共有多少条

        public static int GetCount(string table)
        {
            string sql = "select count(*) count  from"+table;
            DataSet ds = SqlHelper.GetDataSet(ConnectionString, CommandType.Text, sql);
            return Convert.ToInt32(ds.Tables.Count);
        }
        //事务
        public static string ExecTran(string[] sqlStr,string type) {
            SqlConnection conn = new SqlConnection(ConnectionString);
            conn.Open();
            SqlTransaction tran = conn.BeginTransaction(IsolationLevel.ReadUncommitted);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.Transaction = tran;
            try
            {
                int count = sqlStr.Length;
                for (int i = 0; i < count; i++)
                {
                    cmd.CommandText = sqlStr[i];
                    cmd.ExecuteNonQuery();
                }
                tran.Commit();
                return "success";
            }
            catch(Exception e)
            {
                LogHelper.WriteException("type:"+type,e);
                tran.Rollback();
                return "failed";
            }
            finally
            {
                conn.Close();
                tran.Dispose();
            }
        }

        public static string StoreImg(string type, string archivesId,string path)
        {
            string column = type + "Path";
            
            try
            {
                string strCmd = "update jbxx set "+column+"='"+ path +"' where archivesId ='"+archivesId+"'";
                int result = SqlHelper.ExecuteNonQuery(ConnectionString, CommandType.Text, strCmd);
                if (result > -1)
                {
                    return "success";
                }
                else
                {
                    return "failed";
                }
            }
            catch (Exception e)
            {
                LogHelper.WriteException("storeImg", e);
            }
            return "failed";
        }

        public static DataTable UserInfo(string archivesid)
        {
            try
            {
                string sqlCmd = "select uname,department from userinfo1 where archivesid = @archivesid";
                SqlParameter[] para = new SqlParameter[]
                {
                    new SqlParameter("@archivesid", archivesid),
                };
                DataTable dt = SqlHelper.GetDataTable(LoginString, CommandType.Text, sqlCmd, para);
                return dt;
            }
            catch (Exception e)
            {
                LogHelper.WriteException("UserInfo", e);
            }
            return new DataTable();

        }

    }
}