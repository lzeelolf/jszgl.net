using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using jszgl.Tools;

namespace jszgl
{
    /// <summary>
    /// login1 的摘要说明
    /// </summary>
    public class Login1 : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string method = context.Request.QueryString["Method"];
            switch (method)
            {
                case "login":
                    login(context);
                    break;
            }
        }
        private void login(HttpContext context)
        {
            string payId = context.Request["payId"];
            string pwd = context.Request["pwd"];
            DataTable dt = DbOperator.Login(payId, pwd);
            string result = ConvertJson.DataTableToJson(dt);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
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