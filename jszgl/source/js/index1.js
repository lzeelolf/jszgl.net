$(document).ready(function() {
    initialScreen();
    loginStatus();
    //记住登录时的session
    userSessionInfo = rememberSession('user', 'power', 'department','payId');
    //证件查询按钮的事件,调用displayQueryForm函数
    testSession(userSessionInfo)
    //---------------初始化---------------        
    initial()
    function initial() {
        var power = sessionGet('power')
        //根据用户的权限来显示左边的li内容
        appendLi(power,csData)
        //给左边的按钮添加事件，更新右边容器的内容
        $("#buttonList li").each(function () {
            $(this).on('click',displayContainer);
        });
        if (power === jykPower) {
            jykInit()
        }
        else if (power === '1') {
            cjInit()
        }
        else {
            cwyInit(csData);            
        }
        $('#foldButton').off('click').on('click', fold);
        appendModal();
        appendToolTip()
    }
    function appendToolTip(){
        //初始化tooltips
        console.log('tool')
        $(".question").tooltip({
            'placement':'bottom'
        })
        $(".pass").tooltip({
            'placement': 'left',
            'title':'通过申请'
        })
    }
    function appendModal(){
        $('#drInfo').modal({
            'show':false
        })
        $('#selectPC').modal({
            'show':false
        })
        $("#inputArchivesId").modal({
            'show':false,
            'backdrop':'static',
            'keyboard':false
        })
        $('#tsSuccess').modal({
            'show':false
        })
        $('#appendSubmit').modal({
            'show':false
        })
        $('#rejectModal').modal({
            'show':false
        })
        $('#uploadImage').modal({
            'show':false
        })
        $("#improveAlert").modal({
            'show':false
        })
        $("#paramOption").modal({
            'backdrop':'static',
            'show':false
        })
        $("#alertModal").modal({
            'backdrop':'static',
            'show':false
        })
        $('#alertModal').on('hidden', function () {
            $('#alertModal p').empty()
        })
        $('#queryFilter').modal({
            'backdrop': 'static',
            'show': false
        })
        $('#displayImage').modal({
            'show': false
        })
    }
    //主页面单击左边li显示右边内容的函数，注销功能也在这里实现
    function displayContainer(){
        testSession(userSessionInfo)
        $(this).addClass('cur');
        $(this).siblings().removeClass('cur')
        if($(this).hasClass('appendButton')){
            appendAppend(csData)
            $("#appendContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('drdcButton')){
            appendDrdc(csData)
            $('.drdcButton .redPoint').remove();
            $("#drdcContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('deleteButton')){
            $("#deleteContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('queryButton')){
            appendQuery()
            $("#queryCardContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('dataButton')){
            appendTJxx(csData);
            $("#dataContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if ($(this).hasClass('exchangeButton')) {
            $("#exchangeContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('alertButton')){
            appendAlert(csData);
            $('.alertButton .redPoint').remove();
            $("#alertContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('fixButton')){
            $("#fixContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('editButton')){
            $("#editContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('summaryButton')){
            $("#summaryContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('yearlyButton')){
            $("#yearlyContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('informationButton')){
            $("#informationContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('applyButton')){
            $("#applyContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('statusButton')){
            $("#statusContainer").css('display', 'block').siblings().css('display', 'none');
        }
        if($(this).hasClass('logOutButton')){
            if(confirm("确定要退出系统？")){
                sessionClear();
                window.location.href = './login.aspx'
            }
        }
    }
    function appendLi(power,csData) {
        var html = '';
        if (power === jykPower) {
            //这里填管理员的权限
            html = '<li class="alertButton">预警信息<span class="redPoint"></span></li><li class="queryButton">证件查询</li><li class="appendButton">提升司机</li><li class="drdcButton">调入调出<span class="redPoint"></span></li><li class="exchangeButton">换证</li>' +
                '<li class="fixButton">补证</li><li class="deleteButton">注销</li><li class="editButton">证件信息修改</li><li class="summaryButton">汇总表格</li><li class="logOutButton">退出系统</li>'
            $("#buttonList").append(html);
        } else if (power === '1') {
            //这里填车间管理人员的权限
            html = '<li class="alertButton">预警信息<span class="redPoint"></span></li><li class="queryButton">证件查询</li><li class="exchangeButton">换证</li>' +
                '<li class="fixButton">补证</li><li class="dataButton">历史记录</li><li class="yearlyButton">完善信息</li><li class="logOutButton">退出系统</li>';
            $("#buttonList").append(html);
            //车间管理人员没有添加和注销功能，移除相应区域
            $("#appendContainer").remove();
            $("#cancelContainer").remove();
        } else if (power === cwyPower) {
            //这里填普通人员的权限
            html = '<li class=\"informationButton\">证件信息</li><li class=\"applyButton\">换补申请</li><li class=\"statusButton\">证件状态</li>' +
                '<li class="logOutButton">退出系统</li>';
            $("#buttonList").empty().append(html);
        }
    }
    
    function fold(){
        if($(this).hasClass('foldOpen')){
            $(this).removeClass('foldOpen')
            $('#leftContent').animate({
                'left':'0'
            },200)
            $('#rightContent').animate({
                'width':'86%',
                'left':'14%'
            },200)
            $('#foldButton i').removeClass('icon-zhedie').addClass('icon-zhedieleft')
        }else{
            $(this).addClass('foldOpen')
            $('#leftContent').animate({
                'left':'-12%'
            },200)
            $('#rightContent').animate({
                'width':'100%',
                'left':0
            },200)
            $('#foldButton i').removeClass('icon-zhedieleft').addClass('icon-zhedie')
        }
    }
    //--------------共用函数完--------------        
})