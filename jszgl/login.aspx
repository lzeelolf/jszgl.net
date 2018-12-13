<%@ Page Language="C#" AutoEventWireup="true" CodeFile="login.aspx.cs" Inherits="jszgl.Login" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>请登录</title>
    <link rel="stylesheet" href="./source/css/login.css">
    <link rel="stylesheet" href="./source/bootstrap/css/bootstrap.min.css">
</head>
<body>
<div id="loadingPic">
    <p>正在连接,请稍候...</p>
</div>
<div id="banner">
    <h1>洛阳机务段机车驾驶证管理系统</h1>
</div>
<div id="main">
    <div id="loginArea">
        <div id="head">
            <h1 class="text-info">用 户 登 录</h1>
        </div>
        <form id="inputArea" class="form-horizontal">
            <div class="control-group">
                <label class="control-label text-info" for="username">用户名</label>
                <div class="controls">
                     <input type="text" id="username" autocomplete="off" autofocus placeholder="请输入工资号">
                </div>
              </div>
              <div class="control-group">
                <label class="control-label text-info" for="password">密码</label>
                <div class="controls">
                     <input type="password" id="password" autocomplete="off" placeholder="请输入密码">
                </div>
              </div>
        </form>
        <input class="btn btn-info" type="submit" id="login" value="登  录" onclick="login()">
    </div>
</div>
</body>
<script type="text/javascript" src="./source/js/demo.js"></script>
<script type="text/javascript" src="./source/js/jquery-1.11.3.js"></script>
<script type="text/javascript" src="./source/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="./source/js/base_64.js"></script>
<script type="text/javascript" src="./source/js/newFunc.js"></script>
<script type="text/javascript" src="./source/js/login.js"></script>

</html>