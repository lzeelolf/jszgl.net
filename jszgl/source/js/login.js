$(document).ready(function(){
    //一来到登录界面，首先清session中的登录信息
    sessionRemove('user');
    sessionRemove('token');
    sessionRemove('power');
    sessionRemove('department')
    sessionRemove('payId')
    //登录按钮
    var loginBtn = document.getElementById('login');
    loginBtn.onclick = login;
    //登录函数,ajax向php发送请求，调用php的sqlsrv模块查询数据库，login.html
    function login() {
        var payId = $("#username").val();
        var pwd = $("#password").val();
        if (payId && pwd) {
            //payId = (Array(5).join('0') + payId).slice(-5);
            var ajaxTimeOut = $.ajax({
                url: "./login.ashx?Method=login&payId=" + payId +"&pwd="+pwd,
                type: "POST",
                timeout: 8000,
                dataType:'text',
                success: function (data) {
                    console.log(JSON.parse(data))
                    data = JSON.parse(data);
                    if (data.length > 0) {
                        sessionSet('power', data[0]["power"]);
                        sessionSet('user', data[0]["uName"]);
                        sessionSet('department', data[0]["department"]);
                        sessionSet('payId', data[0]["payId"]);
                        userSessionInfo = rememberSession('user', 'power', 'department', 'payId');
                        alert('欢迎，' + data[0]["uName"]);
                        window.location.href = 'index.aspx'
                        return userSessionInfo
                    } else {
                        alert('用户名或密码错误！')
                    }
                },
                beforeSend: loadingPicOpen(),
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        alert('网络超时，请检查网络连接');
                        window.location.reload();
                    }
                }
            });
        } else {
            alert('用户名和密码不能为空！');
        }
    }
    //绑定登录事件
    $("#username").keyup(function(event){
        if(event.keyCode ===13){
            login()
        }
    });
    $("#password").keyup(function(event){
        if(event.keyCode ===13){
            login()
        }
    });
});