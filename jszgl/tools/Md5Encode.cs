using System;
using System.Security.Cryptography;
using System.Text;

namespace jszgl.Tools
{
    public class Md5Encode
    {
        public static string Encode(string plainText, bool toLower)
        {
            string md5Ext = "basic#Ext@";
            byte[] result = Encoding.Default.GetBytes(plainText + md5Ext);
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(result);
            string md5Fin = BitConverter.ToString(output).Replace("-", "");
            if (toLower) return md5Fin.ToLower();
            return md5Fin;
        }

        public static string Encode(string plainText, bool toLower, string md5Ext)
        {
            byte[] result = Encoding.Default.GetBytes(plainText + md5Ext);
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(result);
            string md5Fin = BitConverter.ToString(output).Replace("-", "");
            if (toLower) return md5Fin.ToLower();
            return md5Fin;
        }
    }
}
