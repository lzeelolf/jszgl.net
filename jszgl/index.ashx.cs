using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.IO;
using jszgl.Tools;

namespace jszgl
{
    /// <summary>
    /// index1 的摘要说明
    /// </summary>
    public class index1 : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string method = context.Request.QueryString["Method"];
            switch (method)
            {
                case "getCs":
                    getCs(context);
                    break;
                case "testSession":
                    testSession(context);
                    break;
                case "select":
                    select(context);
                    break;
                case "shortMessage":
                    shortMessage(context);
                    break;
                case "insert":
                    insert(context);
                    break;
                case "delete":
                    delete(context);
                    break;
                case "execTran":
                    execTran(context);
                    break;
                case "update":
                    update(context);
                    break;
                case "giveOut":
                    giveOut(context);
                    break;
                case "queryCard":
                    queryCard(context);
                    break;
                case "storeImg":
                    storeImg(context);
                    break;
                case "exportExcel":
                    exportExcel(context);
                    break;
            }
        }
        private void getCs(HttpContext context)
        {
            DataTable dt = DbOperator.GetCs();
            string result = ConvertJson.DataTableToJson(dt);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void testSession(HttpContext context)
        {
            string payId = context.Request["payId"];
            DataTable dt = DbOperator.TestSession(payId);
            string result = ConvertJson.DataTableToJson(dt);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void select(HttpContext context)
        {
            string columns = context.Request["columns"];
            string table = context.Request["table"];
            string where = context.Request["where"];
            string order = context.Request["order"];
            string db = context.Request["db"];
            DataTable dt = DbOperator.Select(columns,table,where,order,db);
            string result = ConvertJson.DataTableToJson(dt);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void shortMessage(HttpContext context)
        {
            string archivesId = context.Request["archivesId"];
            string text = context.Request["text"];
            string result = DbOperator.ShortMessage(archivesId,text);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void update(HttpContext context)
        {
            string table = context.Request["table"];
            string setStr = context.Request["setStr"];
            string where = context.Request["where"];
            string result = DbOperator.Update(table,setStr, where);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void insert(HttpContext context)
        {
            string table = context.Request["table"];
            string columnStr = context.Request["columnStr"];
            string valueStr = context.Request["valueStr"];
            string result = DbOperator.Insert(table, columnStr, valueStr);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void delete(HttpContext context)
        {
            string table = context.Request["table"];
            string where = context.Request["where"];
            string result = DbOperator.Delete(table, where);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void execTran(HttpContext context)
        {
            //传入一个操作类别和sql语句拼成的数组
            string[] sqlStr = context.Request["sqlStr"].Split('¿');
            string type = context.Request["type"];
            string result = DbOperator.ExecTran(sqlStr,type);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void giveOut(HttpContext context)
        {
            string id = context.Request["id"];
            string payId = context.Request["payId"];
            string _operator = context.Request["operator"];
            string result = DbOperator.GiveOut(id,payId,_operator);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void queryCard(HttpContext context)
        {
            string where = context.Request["where"];
            string table = " jbxx ";
            string result = ConvertJson.DataTableToJson(DbOperator.QueryCard(where));
            string outPut = "{'total':" + DbOperator.GetCount(table) + ",'rows':" + result + "}";
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }
        private void storeImg(HttpContext context)
        {
            string type = context.Request["type"];
            string archivesId = context.Request["archivesId"];
            context.Response.ContentType = "text/html";
            HttpServerUtility server = context.Server;
            HttpPostedFile file = context.Request.Files[0];
            if (file.ContentLength > 0)
            {
                string fileName = context.Request["fileName"];
                string extName = Path.GetExtension(file.FileName);
                string filePath = server.MapPath("./source/images/userPic/");
                string fullName = filePath + Path.GetFileName(fileName)+extName;

                if (!System.IO.Directory.Exists(filePath))
                {
                    System.IO.Directory.CreateDirectory(filePath);
                }
                string imageFilter = ".png|.jpg|.jpeg";// 随便模拟几个图片类型
                if (imageFilter.Contains(extName.ToLower()))
                {
                    file.SaveAs(fullName);
                    string result = DbOperator.StoreImg(type,archivesId, "./source/images/userPic/"+fileName+extName);
                    context.Response.ContentType = "text/plain";
                    context.Response.Write(result);                    
                }
                else
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("error");
                }
            }
        }

        private void exportExcel(HttpContext context)
        {
            string table = context.Request["table"];
            string name = context.Request["name"];
            context.Response.Buffer = true;
            context.Response.ContentType = "application/ms-excel";
            context.Response.Charset = "utf-8";
            context.Response.ContentEncoding = System.Text.Encoding.UTF8;
            context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + name + ".xls");
            context.Response.Write(table);
            context.Response.End();

        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}