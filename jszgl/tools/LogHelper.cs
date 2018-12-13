using System;
using System.IO;
using System.Reflection;
using System.Text;

namespace jszgl.Tools
{
    public class LogHelper
    {
        private static FileStream _logFile;
        private static readonly string endl = "\r\n";
        private static bool _logAvailable;

        public static bool Init()
        {
            try
            {
                string logPath = AppDomain.CurrentDomain.BaseDirectory + "history.txt";
                _logFile = new FileStream(logPath, FileMode.OpenOrCreate, FileAccess.Write);
                
            }
            catch (Exception)
            {
                return false;
            }
            if (_logFile == null) return false;
            _logAvailable = true;
            return true;
        }

        public static bool WriteException(string comment, Exception e)
        {
            if (!_logAvailable) Init();
            if (!_logAvailable) return false;
            string logInfo = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + endl;
            logInfo += string.Format("{0}:{1}", comment, e.Message) + endl;
            logInfo += string.Format("详情:{0}", e.InnerException) + endl;
            logInfo += e.StackTrace + endl;
            StreamWriter writer = new StreamWriter(_logFile);
            writer.WriteLine(logInfo);
            writer.Flush();
            return true;
        }

        public static bool WriteLog(string comment, string userLog)
        {
            if (!_logAvailable) Init();
            if (!_logAvailable) return false;
            string logInfo = comment + endl;
            logInfo += string.Format("{0}\r\n{1}\r\n", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), userLog);
            byte[] infoByte = Encoding.Default.GetBytes(logInfo);
            _logFile.Write(infoByte, 0, infoByte.Length);
            _logFile.Flush();
            return true;
        }

        public static bool Close()
        {
            if (!_logAvailable) return false;
            _logFile.Close();
            return true;
        }
    }
}
