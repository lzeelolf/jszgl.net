using System;
using System.Security.Cryptography;
using System.Text;

namespace jszgl.Tools
{
    public class AesEncryption
    {
        public static string Encrypt(string toEncrypt, string key, string iv)
        {
            byte[] keyArray = Encoding.UTF8.GetBytes(key);
            byte[] ivArray = Encoding.UTF8.GetBytes(iv);
            byte[] toEncryptArray = Encoding.UTF8.GetBytes(toEncrypt);

            RijndaelManaged rDel = new RijndaelManaged();
            rDel.Key = keyArray;
            rDel.IV = ivArray;
            rDel.Mode = CipherMode.CBC;
            rDel.Padding = PaddingMode.Zeros;

            ICryptoTransform cTransform = rDel.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }

        public static string EncryptCp(string toEncrypt, string key, string iv)
        {
            byte[] keyArray = Encoding.UTF8.GetBytes(key);
            byte[] ivArray = Encoding.UTF8.GetBytes(iv);
            byte[] toEncryptArray = Encoding.UTF8.GetBytes(toEncrypt);

            RijndaelManaged rDel = new RijndaelManaged();
            rDel.Key = keyArray;
            rDel.IV = ivArray;
            rDel.Mode = CipherMode.CBC;
            rDel.Padding = PaddingMode.Zeros;

            ICryptoTransform cTransform = rDel.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return HexEncode.ToHexString(resultArray);
        }

        public static string EncryptAuto(string toEncrypt, string basicPd)
        {
            string encSeed;
            int sumSeed = 0;
            for (int i = 0; i < basicPd.Length; i++)
            {
                sumSeed += basicPd[i] ^ 0xE5;
            }
            Random rnd = new Random(sumSeed);
            while (true)
            {
                sumSeed = rnd.Next() % 1000000;
                if (sumSeed > 100000) break;
            }
            encSeed = sumSeed.ToString();
            string genPd = Md5Encode.Encode(encSeed, false).Substring(0, 16);
            return Encrypt(toEncrypt, genPd, "1234567812345678");
        }

        public static string EncryptAutoCp(string toEncrypt, string basicPd)
        {
            string encSeed;
            int sumSeed = 0;
            for (int i = 0; i < basicPd.Length; i++)
            {
                sumSeed += basicPd[i] ^ 0xE5;
            }
            Random rnd = new Random(sumSeed);
            while (true)
            {
                sumSeed = rnd.Next() % 1000000;
                if (sumSeed > 100000) break;
            }
            encSeed = sumSeed.ToString();
            string genPd = Md5Encode.Encode(encSeed, false).Substring(0, 16);
            return EncryptCp(toEncrypt, genPd, "1234567812345678");
        }

        public static string Decrypt(string toDecrypt, string key, string iv)
        {
            byte[] keyArray = Encoding.UTF8.GetBytes(key);
            byte[] ivArray = Encoding.UTF8.GetBytes(iv);
            byte[] toEncryptArray = Convert.FromBase64String(toDecrypt);

            RijndaelManaged rDel = new RijndaelManaged();
            rDel.Key = keyArray;
            rDel.IV = ivArray;
            rDel.Mode = CipherMode.CBC;
            rDel.Padding = PaddingMode.Zeros;

            ICryptoTransform cTransform = rDel.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return Encoding.UTF8.GetString(resultArray);
        }

        public static string DecryptCp(string toDecrypt, string key, string iv)
        {
            int invalidStr;
            byte[] keyArray = Encoding.UTF8.GetBytes(key);
            byte[] ivArray = Encoding.UTF8.GetBytes(iv);
            byte[] toEncryptArray = HexEncode.GetBytes(toDecrypt, out invalidStr);

            RijndaelManaged rDel = new RijndaelManaged();
            rDel.Key = keyArray;
            rDel.IV = ivArray;
            rDel.Mode = CipherMode.CBC;
            rDel.Padding = PaddingMode.Zeros;

            ICryptoTransform cTransform = rDel.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return Encoding.UTF8.GetString(resultArray);
        }

        /// <summary>
        /// 简单解密(For SqlConnStr)
        /// </summary>
        /// <param name="toDecrypt"></param>
        /// <param name="basicPd"></param>
        /// <returns></returns>
        public static string DecryptAuto(string toDecrypt, string basicPd)
        {
            int sumSeed = 0;
            for (int i = 0; i < basicPd.Length; i++)
            {
                sumSeed += basicPd[i] ^ 0xE5;
            }
            Random rnd = new Random(sumSeed);
            while (true)
            {
                sumSeed = rnd.Next() % 1000000;
                if (sumSeed > 100000) break;
            }
            var encSeed = sumSeed.ToString();
            string genPd = Md5Encode.Encode(encSeed, false).Substring(0, 16);
            return Decrypt(toDecrypt, genPd, "1234567812345678").TrimEnd('\0');
        }

        public static string DecryptAutoCp(string toDecrypt, string basicPd)
        {
            int sumSeed = 0;
            for (int i = 0; i < basicPd.Length; i++)
            {
                sumSeed += basicPd[i] ^ 0xE5;
            }
            Random rnd = new Random(sumSeed);
            while (true)
            {
                sumSeed = rnd.Next() % 1000000;
                if (sumSeed > 100000) break;
            }
            var encSeed = sumSeed.ToString();
            string genPd = Md5Encode.Encode(encSeed, false).Substring(0, 16);
            return DecryptCp(toDecrypt, genPd, "1234567812345678").TrimEnd('\0');
        }
    }
}
