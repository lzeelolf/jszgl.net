//基础js文件用来定义公用方法及变量
//以下这些部门人员较少，直接面向教育科，由教育科负责审核
var straightJYK = ['安全生产指挥中心', '技术科', '综合分析室', '安全科', '职工教育科', '统计信息科'];

//权限变量
var jykPower = 'V';
var cjPower = '1';
var cwyPower = '0';
//取公用参数信息
var csData = getCs();
function getCs() {
    var csData = {};
    $.ajax({
        url: "./index.ashx?Method=getCs",
        type: "POST",
        async: false,
        dataType: 'JSON',
        success: function (data) {
            for (var i in data) {
                var obj = {};
                csData[data[i]['lb'] + "-" + data[i]['name']] = Object.assign({}, data[i]);
            }
            console.log(csData);
            return csData
        }
    });
    return csData;
}
//初始化视窗
function initialScreen(){
    $("body").css({'width':screen.width,'height':screen.height});
    if(screen.width < 1024){
        alert('为了更好地显示页面,请至少将分辨率设置为1024*768');
    }
}

//session存储函数,参数为：键名，值名
function sessionSet(key,value){
    sessionStorage.setItem(key,value);
}

//session查询函数
function sessionGet(key){
    return sessionStorage.getItem(key);
}

//session删除函数
function sessionRemove(key){
    sessionStorage.removeItem(key)
}

//session清空函数
function sessionClear(){
    sessionStorage.clear()
}

//用户等待时，显示‘请稍候’图层
function loadingPicOpen(){
    $("#loadingPic").css('display','block');
}

//关闭图层
function loadingPicClose(){
    $("#loadingPic").css('display','none');
}

//获取数据集的列数
function getHowManyColumns(data){
    for(var q in data){
        var t =0;
        for(var p in data[q]){
            t++
        }
    }
    return t;
}


//检查arr数组中是否含有值为字符串str的元素，
function checkIfInArray(str,arr){
    for(var i =0;i<arr.length;i++){
        if(arr[i] === str){
            return true
        }
    }
    return false
}
//检查登录状态和用户名
function loginStatus(){
    if(sessionGet('user')){
        $(".navbar-inverse .name").text(sessionGet('user'))
    }else{
        alert('请先登录！');
        window.location.href = 'login.aspx';
    }
}

//生成excel函数
function htmlToXls(data,name,filterArray,headerArray){
    var option={};
    option.fileName = name;
    var arr =[];
    var j =0;
    for(var i in data){
        arr[j] = data[i];
        j++;
    }
    option.datas=[
        {
            //sheetData要求是数组类型
            sheetData:arr,
            sheetName:'sheet',
            sheetFilter:filterArray,
            sheetHeader:headerArray
        }
    ];
    var toExcel=new ExportJsonExcel(option);
    toExcel.saveExcel();
}
function boundOutputExcel(){
    //生成excel文件
    $("#toolBar #exportButton").off('click').on('click', function () {
        var data = $('#queryTable').bootstrapTable('getData', false)
        var arr = [];
        var a = document.getElementById('queryTable').getElementsByTagName('th');
        for (var i = 0; i < a.length; i++) {
            arr.push(a[i].className)
        }
        for (var i in data) {
            for (var j in data[i]) {
                if (!checkIfInArray(j, arr)) {
                    delete data[i][j];
                }
            }
            
        }
        
        if(confirm('是否要将查询结果生成Excel文件？')){
            var filterArray = arr;
            var headerArray =[];
            var thArr = $("#queryTable th");
            console.log(thArr)
            for (var i = 0; i < thArr.length; i++){
                headerArray.push($(thArr[i]).find('.th-inner').text());
            }
            console.log(headerArray)
            htmlToXls(data,'机车驾驶证统计信息表',filterArray,headerArray)
        }
        
    })
}
//记住登陆时的session状态，以免用户更改权限
function rememberSession(user,power,department,payId){
    var userInfo = {};
    userInfo.user = sessionGet(user);
    userInfo.power = sessionGet(power);
    userInfo.department = sessionGet(department);
    userInfo.payId = sessionGet(payId);
    return userInfo;
}
//测试session是否被更改过
function testSession(obj){
    //2018.8.24
    $.ajax({
        url: "./index.ashx?Method=testSession&payId="+obj.payId,
        type:"POST",
        timeout:8000,
        dataType:'text',
        success: function (data) {
            data = JSON.parse(data);
            if(data.length>0){
                if(data[0]['power'] === obj.power && data[0]['uName'] === obj.user ){

                }else{
                    alert('用户信息发生变化，请重新登录')
                    //window.location  = 'login.aspx'
                }
            }else{
                alert('网络环境发生变化，请重新登录')
                //window.location = 'login.aspx'
            }

        }
    })

    if(obj.user ===sessionGet('user') && obj.power ===sessionGet('power') && obj.department === sessionGet('department') && obj.payId === sessionGet('payId')){
    }else{
        alert('用户信息发生变化，请重新登录3');
        //window.location.href = 'login.html'
    }
}

//向表格中输入数据，参数：table是表格jq对象，page是分页器jq对象,data是数据集
//extra针对最后一列是按钮的表格，是字符串，若无，传空字符串
//eventFunction是绑定事件的函数名
function commonAppendToTable(table, page, data, thText, extra, eventFunction) {
    if (eventFunction) { } else {
        eventFunction = function () {

        }
    }
    var html = thText;          //字符串
    var count = data.length?data.length:1;
    for (var i in data) {
        if (data[i]['department']) {
            data[i]['department'] = data[i]['department'].split(',')[1] ? data[i]['department'].split(',')[0] : data[i]['department'];
        }
    }
    if (page) {
        if (count < 11) {
            $(page).css('display', 'none')
            for (var i in data) {
                html += '<tr>';
                for (var j in data[i]) {
                    html += '<td>' + data[i][j] + '</td>';
                }
                if (eventFunction === boundBackEvent) {
                    var my = new Date();
                    var today = new Date();
                    my.setFullYear(parseInt(data[i]['lotNumber'].split('-')[0]), parseInt(data[i]['lotNumber'].split('-')[1]) - 1, parseInt(data[i]['lotNumber'].split('-')[2]))
                    if ((today - my) / (1000 * 60 * 60 * 24) < csData['chqx-dc']['nr2']) {
                        html += extra;
                    } else {
                        html += '<td>超过撤回期限</td>'
                    }
                } else {
                    html += extra;
                }
                html += '</tr>'
            }
            $(table).empty().append(html);
            eventFunction(data, csData)
            //空白tr补齐表格
            if ($(table).children('tbody').children('tr').length < 11) {
                html = '';
                var c = 11 - $(table).children('tbody').children('tr').length;
                var columns = $(table).children('tbody').children('tr:first-child').children('th').length;
                for (var m = 0; m < c; m++) {
                    html += '<tr>';
                    for (var n = 0; n < columns; n++) {
                        html += "<td>&nbsp</td>";
                    }
                    html += "</tr>";
                }
                $(table).children('tbody').append(html);
            }
        }
        else {
            var q = 0;
            var cur = 1;
            var total = Math.ceil(count / 10);
            $(page).css("display", 'block');
            for (var i in data) {
                html += '<tr>';
                for (var j in data[i]) {
                    html += '<td>' + data[i][j] + '</td>';
                }
                html += extra;
                html += '</tr>';
                q += 1;
                if (q > 9) {
                    break
                }
            }
            $(table).empty().append(html);
            eventFunction(data, csData)
            $(page).children('.cur').text(cur);
            $(page).children('.total').text(total);
            $(page).children('.next').off('click').on('click', function () {
                if (cur < total) {
                    var j = 0;
                    var html = thText;
                    for (var i in data) {
                        if (j > 10 * cur - 1 && j < 10 * (cur + 1) && i) {
                            j++;
                            html += '<tr>';
                            for (var m in data[i]) {
                                html += '<td>' + data[i][m] + '</td>';
                            }
                            html += extra;
                            html += '</tr>'
                        } else {
                            j++;
                        }
                    }
                    $(table).empty().append(html);
                    eventFunction(data, csData)
                    //空白tr补齐表格
                    if ($(table).children('tbody').children('tr').length < 11) {
                        html = '';
                        var count = 11 - $(table).children('tbody').children('tr').length;
                        var columns = $(table).children('tbody').children('tr:first-child').children('th').length;
                        for (var m = 0; m < count; m++) {
                            html += '<tr>';
                            for (var n = 0; n < columns; n++) {
                                html += "<td>&nbsp</td>";
                            }
                            html += "</tr>";
                        }
                        $(table).children('tbody').append(html);
                    }
                    cur += 1;
                    $(page).children('.cur').text(cur);
                }
            })
            $(page).children('.prev').off('click').on('click', function () {
                if (cur > 1) {
                    var j = 0;
                    var html = thText;
                    for (var i in data) {
                        if (j > 10 * (cur - 2) - 1 && j < 10 * (cur - 1) && i) {
                            j++;
                            html += '<tr>';
                            for (var m in data[i]) {
                                html += '<td>' + data[i][m] + '</td>';
                            }
                            html += extra;
                            html += '</tr>'
                        } else {
                            j++;
                        }
                    }
                    $(table).empty().append(html);
                    eventFunction(data, csData)
                    cur -= 1;
                    $(page).children('.cur').text(cur);
                }
            })
        }
    } else {
        for (var i in data) {
            html += '<tr>';
            for (var j in data[i]) {
                html += '<td>' + data[i][j] + '</td>';
            }
            if (eventFunction === boundBackEvent) {
                var my = new Date();
                var today = new Date();
                my.setFullYear(parseInt(data[i]['lotNumber'].split('-')[0]), parseInt(data[i]['lotNumber'].split('-')[1]) - 1, parseInt(data[i]['lotNumber'].split('-')[2]))
                if ((today - my) / (1000 * 60 * 60 * 24) < csData['chqx-dc']['nr2']) {
                    html += extra;
                } else {
                    html += '<td>超过撤回期限</td>'
                }
            } else {
                html += extra;
            }
            html += '</tr>'
        }
        $(table).empty().append(html);
        eventFunction(data, csData)
    }
    
}

//从全员信息库中取申请表要用的信息
function getUserinfo(payId, changeType) {
    var columns = ' uname,sex,birthdate,cardid,phone1,address,archivesId  ';
    var table = 'userinfo1';
    var where = ' where payid = \'' + payId + '\'';
    var order = '';
    var db = 'baseInfo';
    var ajaxTimeOut = $.ajax({
        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
        type: "POST",
        timeout: 8000,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var columns = ' * ';
                var table = 'jbxx';
                var where = ' where payid = \'' + payId + '\'';
                var order = '';
                var db = 'jszglInfo';
                $.ajax({
                    url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                    type: "POST",
                    dataType: 'json',
                    success: function (cardData) {
                        if (cardData.length > 0) {
                            fillInTable(data[0], cardData[0], changeType);
                        }
                    }
                });
            }
        },
        beforeSend: function () {
            //在where字段后加入用户选择的车间范围
            testSession(userSessionInfo);
            loadingPicOpen();
        },
        complete: function (XMLHttpRequest, status) {
            loadingPicClose();
            if (status === 'timeout') {
                ajaxTimeOut.abort();    // 超时后中断请求
                $("#alertModal").modal('show')
                $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
            }
        }
    })
}
//用取回的信息渲染补证申请表
function fillInTable(data, cardData, changeType) {
    console.log(cardData)
    var cardId = [];
    var payId = cardData['PayId'] ? cardData['PayId'] : cardData['payId'];
    //用从全员信息库取出的数据填写基本信息
    for (var i = 0; i < data['cardid'].length; i++) {
        cardId[i] = data['cardid'][i];
        $(".cardIdInTable:eq(" + i + ")").text(cardId[i]);
    }
    //公共信息
    $("#nameInTable").text(data['uname']);
    $("#sexInTable").text(data['sex']);
    $("#birthYearInTable").text(data['birthdate'].split('-')[0]);
    $("#birthMonthInTable").text(data['birthdate'].split('-')[1]);
    $("#birthDateInTable").text(data['birthdate'].split('-')[2]);
    $("#mobilePhoneInTable").text(data['phone1']);
    $("#companyInTable").text('郑州局集团');
    $("#addressInTable").val(data['address']);
    $("#mailInTable").val();
    //填写驾驶证信息

    if (cardData['sjDriveCode']) {
        if (cardData['sjDriveCode'] === 'A' || cardData['sjDriveCode'] === 'B' || cardData['sjDriveCode'] === 'C') {
            $("#originOther").prop({ 'checked': true, 'disabled': true }).siblings('input').prop({ 'checked': false, 'disabled': true })
            $("#originOtherInput").prop({
                'disabled': true
            }).val(cardData['sjDriveCode'])
            if (cardData['sjDriveCode'] === csData['zjlx-A']['name']) {
                $("#applyJ4").attr({
                    'checked': 'checked',
                    'disabled': true
                }).siblings('input').attr('disabled', true);
            } else if (cardData['sjDriveCode'] === csData['zjlx-B']['name']) {
                $("#applyJ5").attr({
                    'checked': 'checked',
                    'disabled': true
                }).siblings('input').attr('disabled', true);
            } else if (cardData['sjDriveCode'] === csData['zjlx-C']['name']) {
                $("#applyJ6").attr({
                    'checked': 'checked',
                    'disabled': true
                }).siblings('input').attr('disabled', true);
            }
        } else {
            console.log($("#apply" + cardData['sjDriveCode']))
            $("#apply" + cardData['sjDriveCode']).attr({
                'checked': 'checked',
                'disabled': true
            }).siblings('input').attr('disabled', true);
        }
        $("#origin" + cardData['sjDriveCode']).attr({
            'checked': 'checked',
            'disabled': true
        }).siblings('input').attr('disabled', true);
        if (changeType === csData['czlb-fyxqmhz']['name']) {
            if (cardData['applyDriveCode']) {
                //审核界面非有效期满
                $("#apply" + cardData['applyDriveCode']).attr({
                    'checked': 'checked',
                    'disabled': true
                }).siblings('input').attr({ 'disabled': true, 'checked': false });
                if (cardData['changeReason'] && changeType === csData['czlb-fyxqmhz']['name']) {
                    $(".reason input").prop({
                        'disabled': true,
                        'checked': false
                    })
                    if (cardData['changeReason'] === csData['hzyy-jdzjjx']['nr2']) {
                        $("#reasonLower").prop({ 'checked': 'checked' })
                    } else if (cardData['changeReason'] === csData['hzyy-nrbh']['nr2']) {
                        $("#reasonContChange").prop({ 'checked': 'checked' })
                    } else {
                        $("#otherReason").prop({ 'checked': 'checked' })
                        console.log(cardData['changeReason'])
                        $("#otherReasonText").val(cardData['changeReason'])
                    }
                }
            } else {
                //申请界面非有效期满
                $(".apply input").prop({
                    'disabled': false,
                    'checked': false
                })
                $('.apply input').off('change').on('change', function () {
                    $(this).siblings('input').prop('checked', false)
                    if ($('.origin input:checked').attr('id') === 'originOther') {
                        var origin = $('#originOtherInput').val()
                    } else {
                        var origin = $('.origin input:checked').next('label').text()
                    }
                    if (csData['zjlx-' + $(this).next('label').text()]['nr2'] > csData['zjlx-' + origin]['nr2']) {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('不能选择比原证等级高的类型')
                        $(this).prop('checked', false)
                    }
                })
                $(".reason div input").prop({
                    'disabled': true,
                    'checked': false
                })
                $(".fyxqmhz").prop({
                    'disabled': false
                })
                $('.fyxqmhz').off('click').on('click', function () {
                    $(this).parent().siblings('div').children('input').prop('checked', false);
                    $("#otherReasonText").prop('disabled', true);
                    if ($(this).prop('id') === 'otherReason') {
                        $("#otherReasonText").prop('disabled', false).focus();
                    }
                })
            }
            $("#fixCheckBox").prop({ "disabled": true, 'checked': false });
            $("#changeCheckBox").prop({ "disabled": true, "checked": "checked" });
        } else if (changeType === csData['czlb-yxqmhz']['name']) {
            if (cardData['applyDriveCode']) {

            } else {

            }
            $("#fixCheckBox").prop({ "disabled": true, 'checked': false });
            $("#changeCheckBox").prop({ "disabled": true, "checked": "checked" });
            $("#reasonDeadline").prop({
                'checked': 'checked',
                'disabled': true
            }).parent('div').siblings('div').children('input').prop({ 'disabled': true, 'checked': false });
        } else if (changeType === csData['czlb-bz']['name']) {
            if (cardData['applyDriveCode']) {
                $("#apply" + cardData['applyDriveCode']).attr({
                    'checked': 'checked',
                    'disabled': true
                }).siblings('input').attr('disabled', true);
            } else {

            }
            $("#changeCheckBox").prop({ "disabled": true, 'checked': false });
            $("#fixCheckBox").prop({ "disabled": true, "checked": "checked" });
            $("#cardLost").prop({
                'checked': 'checked',
                'disabled': true
            }).parent('div').siblings('div').children('input').prop({ 'disabled': true, 'checked': false });
        }
    } else {
        $("#alertModal").modal('show')
        $("#alertModal .text-warning").empty().text('您的证件准驾机型为空，请完善信息')
        return false;
    }
    $("#phyOk").attr({ 'checked': 'checked', 'disabled': true }).siblings('input').attr('disabled', true);
    $("#originYearInTable").text(cardData['sjDate'].split('-')[0]);
    $("#originMonthInTable").text(cardData['sjDate'].split('-')[1]);
    $("#originDateInTable").text(cardData['sjDate'].split('-')[2]);
    //添加提交事件
    $("#applySubmit").off('click').on('click', function () {
        if ($('.apply input:checked').length < 1 || $(".reason div input:checked").length < 1) {
            $("#alertModal").modal('show')
            $("#alertModal .text-warning").empty().text('请完整填写表格')
        } else if ($("#otherReason").prop('checked') && $("#otherReasonText").val().length < 1) {
            $("#alertModal").modal('show')
            $("#alertModal .text-warning").empty().text('请填写换证原因')
        } else {
            if (confirm('请确认提交内容真实有效且正确无误！提交请点“确定”，返回请点“取消”')) {
                appendApply(data, cardData, csData, changeType);
            }
        }

    })
    $("#print").off('click').on('click', print);
    //打印
    function print() {
        var html = $("#applyContainer #fixTable");
        $("body").empty().append(html);
        alert('请根据您的分辨率调整页面大小及页边距以获得更好的打印效果');
        window.print()
        location.reload()
    }
}   
//用户提交换补申请，发ajax更新bgxx表,
// 根据changeType，如果是补证，在jbxx表中将此人证件的status改为丢失或损毁。换证不用
//并在sqxx表中插入该条申请的信息
function appendApply(data, cardData, csData, changeType) {
    changeType = csData['czlb-' + changeType]['nr3'];
    var payId = sessionGet('payId');
    var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
    var UName = sessionGet('user');
    var cardId = data['cardid'];
    var archivesId = data['archivesId'];
    var sex = data['sex'];
    var birthDate = data['birthdate'];
    var startDate = cardData['startdate'];
    var deadline = cardData['deadline'];
    var sjRemark = cardData['sjRemark'];
    //以下变量用来更新jbxx表
    var status = '';
    var where = ' where payid = \'' + payId + '\'';
    var changeReason = '';
    var needed = '';
    if (changeType === csData['czlb-bz']['nr3']) {
        for (var i in csData) {
            if (csData[i]['lb'] === 'bzsxcl') {
                needed += csData[i]['nr2'];
                needed += ','
            }
        }
        needed = needed.substring(0, needed.length - 1);
    } else if (changeType === csData['czlb-yxqmhz']['nr3'] || changeType === csData['czlb-fyxqmhz']['nr3']) {
        for (var i in csData) {
            if (csData[i]['lb'] === 'hzsxcl') {
                needed += csData[i]['nr2'];
                needed += ','
            }
        }
        needed = needed.substring(0, needed.length - 1);
    }
    //根据用户勾选，取变更原因
    if ($("#cardLost").prop('checked')) {
        changeReason = csData['bzyy-jszds']['nr2'];
        status = csData['zjzt-ds']['nr2'];
    } else if ($("#cardBreak").prop('checked')) {
        changeReason = csData['bzyy-jszsh']['nr2'];
        status = csData['zjzt-sh']['nr2'];
    } else if ($("#reasonDeadline").prop('checked')) {
        changeReason = csData['hzyy-yxqm']['nr2'];
        status = csData['zjzt-hzz']['nr2'];
    } else if ($("#reasonContChange").prop('checked')) {
        changeReason = csData['hzyy-nrbh']['nr2'];
        status = csData['zjzt-hzz']['nr2'];
    } else if ($("#reasonLower").prop('checked')) {
        changeReason = csData['hzyy-jdzjjx']['nr2'];
        status = csData['zjzt-hzz']['nr2'];
    } else if ($("#otherReason").prop('checked')) {
        changeReason = $("#otherReasonText").val();
        status = csData['zjzt-hzz']['nr2'];
    }
    var driveCode = $(".origin input:checked").next('label').text();
    if (driveCode === '其他（') {
        driveCode = $("#originOtherInput").val()
    }
    if (!driveCode) {
        $("#alertModal").modal('show')
        $("#alertModal .text-warning").empty().text('请勾选原证准驾类型，老证请选“其他”并在后面输入准驾代码')
    } else {
        var drive = csData['zjlx-' + driveCode]['nr1'];
        var applyDriveCode = $(".apply input:checked").next('label').text();
        var phyTest = $(".phyCheck input:checked").next('label').text();
        var checkStatus = '';
        if (checkIfInArray(department, straightJYK)) {
            checkStatus = csData['checkStatus-jykshz']['nr2'];
        } else {
            checkStatus = csData['checkStatus-cjshz']['nr2'];
        }
        var lotNumber = new Date();
        lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
        lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
        lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;
        var tableBgxx = ' bgxx ';
        var columnStrBgxx = 'lotNumber,Department,payId,archivesId,UName,cardId,changeType,changeReason,driveCode,drive,phyTest,needed,checkStatus,applyDriveCode,sex,birthDate,startDate,deadline,sjRemark';
        var valueStrBgxx = '\'' + lotNumber + '\',\'' + department + '\',\'' + payId + '\',\'' + archivesId + '\',\'' + UName + '\',\'' + cardId + '\',\'' + changeType + '\',\'' + changeReason + '\',\'' + driveCode + '\',\'' + drive + '\',\'' + phyTest + '\',\'' + needed + '\',\'' + checkStatus + '\',\'' + applyDriveCode + '\',\'' + sex + '\',\'' + birthDate + '\',\'' + startDate + '\',\'' + deadline + '\',\'' + sjRemark + '\''
        var bgxxSql = 'INSERT INTO' + tableBgxx + "(" + columnStrBgxx + ") VALUES (" + valueStrBgxx + ")";

        var tableJbxx = ' jbxx ';
        var setStrJbxx = 'status=\'' + status + '\'';
        var whereJbxx = ' where archivesId=\'' + archivesId + '\'';
        var jbxxSql = 'UPDATE ' + tableJbxx + 'SET ' + setStrJbxx + whereJbxx;

        var sex = $("#sexInTable").text();
        var fixedPhone = $("#fixedPhoneInTable").val();
        var mobilePhone = $("#mobilePhoneInTable").text();
        var company = $("#companyInTable").text();
        var address = $("#addressInTable").val();
        var mail = $("#mailInTable").val();
        var sjDate = $("#originYearInTable").text() + '-' + $("#originMonthInTable").text() + '-' + $("#originDateInTable").text();

        var tableSqxx = ' sqxx ';
        var columnStrSqxx = 'date,Department,payId,UName,sex,cardId,changeType,changeReason,sjDriveCode,applyDriveCode,phyTest,fixedPhone,mobilePhone,company,address,mail,sjDate';
        var valueStrSqxx = '\'' + lotNumber + '\',\'' + department + '\',\'' + payId + '\',\'' + UName + '\',\'' + sex + '\',\'' + cardId + '\',\'' + changeType + '\',\''
            + changeReason + '\',\'' + driveCode + '\',\'' + applyDriveCode + '\',\'' + phyTest + '\',\'' + fixedPhone + '\',\'' + mobilePhone + '\',\'' + company
            + '\',\'' + address + '\',\'' + mail + '\',\'' + sjDate + '\''
        var sqxxSql = 'INSERT INTO' + tableSqxx + "(" + columnStrSqxx + ") VALUES (" + valueStrSqxx + ")";
        var type = '添加' + changeType + '申请';
        var ajaxTimeOut = $.ajax({
            url: "./index.ashx?Method=execTran&type=" + escape(type) + "&sqlStr=" + escape(jbxxSql) + "¿" + escape(bgxxSql) + "¿" + escape(sqxxSql),
            type: "POST",
            timeout: 8000,
            dataType: 'text',
            success: function (ret) {
                if (ret === 'success') {
                    if (changeType === csData['czlb-bz']['nr3']) {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-success").empty().text('您的补证申请提交成功，请联系车间开具《驾驶证丢失证明》')
                        tzEvent(csData, csData['dxnr-bz']['name'], archivesId,$('#applySubmit'))
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-success").empty().text('您的换证申请提交成功，请留意审核状态')
                        tzEvent(csData, csData['dxnr-hz']['name'], archivesId, $('#applySubmit'))
                    }
                }
            },
            beforeSend: function () {
                //在where字段后加入用户选择的车间范围
                testSession(userSessionInfo);
                loadingPicOpen();
            },
            complete: function (XMLHttpRequest, status) {
                loadingPicClose();
                if (status === 'timeout') {
                    ajaxTimeOut.abort();    // 超时后中断请求
                    $("#alertModal").modal('show')
                    $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                }
            }
        })
    }
}

//短信
function tzEvent(csData, type, archivesId, button, id) {
    //id是传过来的bgxx表标识,用来唯一确定数据
    //传入type是操作类别的name，例如调入：dr
    var phone = 18538832516;
    var text = "";
    if (type) {
        for (var i in csData['dxnr-' + type]) {
            if (i === 'lb' || i === 'name' || i === 'number') {
                continue;
            } else {
                text += csData['dxnr-' + type][i];
            }
        }
        $.ajax({
            url: "./index.ashx?Method=shortMessage&text=" + escape(text) + "&archivesId=" + escape(archivesId),
            type: "POST",
            dataType: 'text',
            success: function (data) {
                $("#alertModal").modal('show')
                $("#alertModal .text-info").empty().text(data)
                if (type === csData['zjzt-yj']['name']) {
                    var table = 'bgxx';
                    var setStr = ' tzDone = convert(varchar(20),GETDATE(),120)';
                    var where = ' where id=\'' + id + '\'';
                    $.ajax({
                        url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                        type: "POST",
                        dataType: 'text',
                        success: function (ret) {
                            button.removeClass('tz').text('已经通知').off('click')
                        }
                    });
                } else {
                    button.remove()
                }

            }
        })
    }else if (type === csData['czlb-yxqmhz']['nr3'] || type === csData['czlb-fyxqmhz']['nr3']) {
        $.ajax({
            url: "../../../ways.php",
            type: "POST",
            timeout: 8000,
            data: {
                funcName: 'getInfo',
                serverName: '10.101.62.62',
                uid: 'sa',
                pwd: '2huj15h1',
                Database: 'USERINFO',
                tableName: 'userinfo1',
                column: ' uname,phone1 ',
                where: ' where payid = \'' + payId + '\'',
                order: ' '
            },
            dataType: 'json',
            success: function (data) {
                if (data['success'] === 1) {
                    delete data['success'];
                    //var phone = data['row']['phone1'];
                    var uName = data['row']['uname'].replace(/\s*/g, "");
                    var text = uName + csData['dxnr-hz']['nr1'] + csData['dxnr-hz']['nr2'] + csData['dxnr-hz']['nr3'] + csData['dxnr-hz']['nr4'] + csData['dxnr-hz']['nr5'] + csData['dxnr-hz']['nr6'];
                    $.ajax({
                        url: "../../../ways.php",
                        type: "POST",
                        timeout: 8000,
                        data: {
                            funcName: 'insert',
                            serverName: '10.101.62.199',
                            uid: 'wa',
                            pwd: 'sasasa',
                            Database: 'jiaoban',
                            tableName: ' daifaxinxi',
                            column: ' (jieshoujihao,xinxi,jibie)',
                            values: '(\'' + phone + '\',\'' + text + '\',\'' + 1 + '\')'
                        },
                        dataType: 'json',
                        success: function () {

                        }
                    })
                }
            }
        })
    }
    else if (type === csData['czlb-dr']['nr3']) {
        $.ajax({
            url: "../../../ways.php",
            type: "POST",
            timeout: 8000,
            data: {
                funcName: 'getInfo',
                serverName: '10.101.62.62',
                uid: 'sa',
                pwd: '2huj15h1',
                Database: 'USERINFO',
                tableName: 'userinfo1',
                column: ' uname,phone1 ',
                where: ' where payid = \'' + payId + '\'',
                order: ' '
            },
            dataType: 'json',
            success: function (data) {
                if (data['success'] === 1) {
                    delete data['success'];
                    //var phone = data['row']['phone1'];
                    var uName = data['row']['uname'].replace(/\s*/g, "");
                    var text = uName + csData['dxnr-dr']['nr1'] + csData['dxnr-dr']['nr2'] + csData['dxnr-dr']['nr3'] + csData['dxnr-dr']['nr4'] + csData['dxnr-dr']['nr5'] + csData['dxnr-dr']['nr6'];
                    $.ajax({
                        url: "../../../ways.php",
                        type: "POST",
                        timeout: 8000,
                        data: {
                            funcName: 'insert',
                            serverName: '10.101.62.199',
                            uid: 'wa',
                            pwd: 'sasasa',
                            Database: 'jiaoban',
                            tableName: ' daifaxinxi',
                            column: ' (jieshoujihao,xinxi,jibie)',
                            values: '(\'' + phone + '\',\'' + text + '\',\'' + 1 + '\')'
                        },
                        dataType: 'json',
                        success: function () {

                        }
                    })
                }
            }
        })
    }
}

//添加预警信息
function appendAlert() {
    var power = sessionGet('power');
    if (power === cjPower) {
        var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
        $("#buttonList .alertButton .redPoint").css('display', 'block')
        appendDepartmentAlert(department)
    } else if (power === jykPower) {
        appendAllAlert(csData)
    }
    function appendDepartmentAlert(department) {
        var p = department;
        var power = sessionGet('power');
        if ($("#alertBanner .selectArea select").length > 0) {

        } else {
            $("#alertBanner .selectArea").text(p)
        }
        var columns = 'department,payId,uName,deadline,status,archivesId';
        var table = 'jbxx';
        var where = ' where payId !=\'\' AND  department like \'' + department + '%\' AND DATEDIFF(day,getdate(),deadline) < ' + csData['yjsj-cjyjsj']['nr2'] + ' AND deadline !=\'\'';
        var order = ' order by DATEDIFF(day,getdate(),deadline)';
        var db = 'jszglInfo';
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'JSON',
            success: function (data) {
                if (data.length > 0) {
                    var columns = ' id,lotNumber,payId,uName,tzDone';
                    var table = 'bgxx';
                    var where = ' where payId !=\'\' AND department like \'' + department + '%\' AND changeType=\'' + csData['czlb-yxqmhz']['nr3'] + '\' AND (checkStatus =\'' + csData['checkStatus-cjshz']['nr2'] + '\' OR checkStatus =\'' + csData['checkStatus-jykshz']['nr2'] + '\')';
                    var order = ' ';
                    var db = 'jszglInfo';
                    $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                        type: "POST",
                        dataType: 'JSON',
                        success: function (bgData) {
                            if (data.length > 0) {
                                var alertCount = data.length;
                                $("#alertBanner .p2").empty().append('驾驶证预警人员共' + alertCount + '人：');
                                //处理数据，加入两个属性“是否正在换证”、‘审核状态’
                                var today = new Date();
                                today.month = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
                                today.date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
                                today = today.getFullYear() + '-' + today.month + '-' + today.date;
                                today = new Date(today)
                                var deadline = '';
                                var temp1 = "";
                                var temp2 = "";
                                if (power === cjPower) {
                                    temp1 = '<span class="sq">现在申请</span>'
                                    temp2 = '<span class="tz">短信通知</span>'
                                } else {
                                    temp1 = '否';
                                    temp2 = '尚未通知';
                                }
                                for (var m in data) {
                                    data[m]['status'] = temp1;
                                    data[m]['tzDone'] = temp2;
                                    data[m]['id'] = 0;
                                    for (var n in bgData) {
                                        if (data[m]['payId'] === bgData[n]['payId']) {
                                            data[m]['status'] = bgData[n]['lotNumber'];
                                            if (bgData[n]['tzDone'] !== csData['tzDone-swtz']['nr2']) {
                                                data[m]['tzDone'] = bgData[n]['tzDone'];
                                            }
                                            data[m]['id'] = bgData[n]['id'];
                                        }
                                    }
                                    deadline = new Date(data[m]['deadline']);
                                    data[m]['deadline'] = (deadline - today) / (1000 * 60 * 60 * 24);
                                }
                                var table = $("#alertTable");
                                var page = $("#alertPage");
                                var thText = '<tr><th>所属车间</th><th>工资号</th><th>姓名</th><th>距到期剩余天数</th><th>是否已申请换证</th><th style="display:none">archivesId</th><th>通知</th><th style="display:none">id</th></tr>';
                                var eventFunction = boundAlertEvent;
                                var extra = '';
                                commonAppendToTable(table, page, data, thText, extra, eventFunction)


                            }
                            else {
                                $("#alertTable").empty();
                                $("#alertBanner .p2").text('驾驶证预警人员共0人');
                                $("#alertPage").css('display', 'none')
                            }
                        }
                    })

                } else {
                    $("#buttonList .alertButton .redPoint").css('display', 'none')
                }
            }
        })
    }
    function appendAllAlert(csData) {
        var html = '<select><option>全段</option>';
        for (var i in csData) {
            if (csData[i]['lb'] === 'ssbm') {
                html += '<option>' + csData[i]['nr1'] + '</option>'
            }
        }
        html += '</select>';
        $("#alertBanner .selectArea").empty().append(html);
        var columns = 'department,payId,uName,deadline,status,archivesId';
        var table = 'jbxx';
        var where = ' where payId !=\'\' AND DATEDIFF(day,getdate(),deadline) < ' + csData['yjsj-jykyjsj']['nr2'] + ' AND deadline !=\'\'';
        var order = ' order by DATEDIFF(day,getdate(),deadline)';
        var db = 'jszglInfo';
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'JSON',
            success: function (data) {
                if (data.length > 0) {
                    $("#buttonList .alertButton .redPoint").css('display', 'block')
                    var columns = ' id,lotNumber,payId,uName,tzDone';
                    var table = 'bgxx';
                    var where = ' where changeType=\'' + csData['czlb-yxqmhz']['nr3'] + '\' AND (checkStatus =\'' + csData['checkStatus-cjshz']['nr2'] + '\' OR checkStatus =\'' + csData['checkStatus-jykshz']['nr2'] + '\')';
                    var order = '';
                    var db = 'jszglInfo';
                    $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                        type: "POST",
                        dataType: 'JSON',
                        success: function (bgData) {
                            if (data.length > 0) {
                                var alertCount = data.length;
                                $("#alertBanner .p2").empty().append('驾驶证预警人员共' + alertCount + '人：');
                                //处理数据，加入两个属性“是否正在换证”、‘审核状态’
                                var today = new Date();
                                today.month = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
                                today.date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
                                today = today.getFullYear() + '-' + today.month + '-' + today.date;
                                today = new Date(today)
                                var deadline = '';
                                for (var m in data) {
                                    data[m]['status'] = '否';
                                    data[m]['tzDone'] = '尚未通知';
                                    data[m]['id'] = 0;
                                    for (var n in bgData) {
                                        if (data[m]['payId'] === bgData[n]['payId']) {
                                            data[m]['status'] = bgData[n]['lotNumber'];
                                            if (bgData[n]['tzDone'] !== csData['tzDone-swtz']['nr2']) {
                                                data[m]['tzDone'] = bgData[n]['tzDone'];
                                            }
                                            data[m]['id'] = bgData[n]['id'];
                                        }
                                    }
                                    deadline = new Date(data[m]['deadline']);
                                    data[m]['deadline'] = (deadline - today) / (1000 * 60 * 60 * 24);
                                }
                                var table = $("#alertTable");
                                var page = $("#alertPage");
                                var thText = '<tr><th>所属车间</th><th>工资号</th><th>姓名</th><th>距到期剩余天数</th><th>是否已申请换证</th><th style="display:none">archivesId</th><th>通知</th><th style="display:none">id</th></tr>';
                                var eventFunction = boundAlertEvent;
                                var extra = '';
                                commonAppendToTable(table, page, data, thText, extra, eventFunction)
                            }
                            else {
                                $("#alertTable").empty();
                                $("#alertBanner .p2").text('驾驶证预警人员共0人');
                                $("#alertPage").css('display', 'none')
                            }
                        }
                    })
                }
            }
        })

        $("#alertBanner select").off('change').on('change', function () {
            if ($(this).val() === '全段') {
                appendAllAlert(csData)
            } else {
                appendDepartmentAlert($(this).val())
            }
        })
    }
    function boundAlertEvent() {
        $('#alertTable .tz').off('click').on('click', function () {
            if (confirm('将通知' + $(this).parent().siblings('td:nth-child(3)').text().replace(/\s*/g, "") + '师傅到车间申请换证，确定?')) {
                var archivesId = $(this).parent().siblings('td:nth-child(6)').text();
                var type = 'yj';            //type传入参数表中dxnr-后面的字母
                tzEvent(csData, csData['zjzt-yj']['name'], archivesId, $(this), $(this).parent().siblings('td:last-child').text())
            }
        })
        $("#alertTable .sq").off('click').on('click', function () {
            //这里待添加一部分代码，用来让车间管理人员可以替乘务员申请换证
            //写个webservice，把需要改成事务的嵌套ajax全调用事务  待办1
        })
    }
}

//添加换证补证界面
function appendApplyCheck(power, csData) {
    //激活换证补证的标签页
    $('#exchangeBanner a,#fixBanner a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    //分别定义事件
    //
    $('a[href="#exchangeApplyAppendContent"]').on('shown', function (e) {

    })
    //换证审核
    $('a[href="#exchangeApplyCheckContent"]').on('shown', function (e) {
        $("#exchangePage").css('display', 'none')
        var obj = {};
        obj.column = ' id,archivesId,department,lotNumber,payId,UName,changeType ';
        obj.order = ' order by department,payId ';
        if (power === cjPower) {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            //添加目前正在进行车间审核的换证申请
            obj.where = ' where checkStatus = \'' + csData['checkStatus-cjshz']['nr2'] + '\' AND changeType like \'%' + csData['czlb-yxqmhz']['nr2'] + '\' AND department like\'' + department + '%\'';
            obj.extra = '<td><span class="seeInfo">申请表</span> <span class="seeImage">图片材料</span></td><td><span title="通过申请" data-toggle="tooltip" class="pass"></span><span title="完善信息" data-toggle="tooltip" class="improve"></span><span title="驳回申请" data-toggle="tooltip" class="reject"></span></td>'
            exchangeApplyAjax(obj)
        }
        //这里添加教育科人员的审核申请界面
        if (power === jykPower) {
            obj.where = ' where checkStatus = \'' + csData['checkStatus-jykshz']['nr2'] + '\' AND changeType like \'%' + csData['czlb-yxqmhz']['nr2'] + '\'';
            obj.extra = '<td><span class="seeInfo">申请表</span> <span class="seeImage">图片材料</span></td><td><span title="通过申请" data-toggle="tooltip" class="pass"></span><span title="驳回申请" data-toggle="tooltip" class="reject"></span></td>'
            exchangeApplyAjax(obj)
        }
        function exchangeApplyAjax(obj) {
            var columns = obj.column;
            var table = ' bgxx ';
            var where = obj.where;
            var order = obj.order;
            var db = 'jszglInfo';
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var table = $("#exchangeCheckTable");
                        var page = $("#exchangePage");
                        var thText = '<tr><th>id</th><th>archivesId</th><th>部门</th><th>提交日期</th><th>工资号</th><th>姓名</th><th>申请类型</th><th>详情</th><th>操作</th></tr>';
                        var extra = obj.extra;
                        var eventFunction = boundCheckEvent;
                        commonAppendToTable(table, page, data, thText, extra, eventFunction)
                        $(".pass").tooltip({
                            'placement': 'left'
                        })
                        $(".improve").tooltip({
                            'placement': 'left'
                        })
                        $(".reject").tooltip({
                            'placement': 'left'
                        })
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无换证申请信息')
                        $("#exchangeCheckTable").empty()
                    }
                },
                beforeSend: function () {
                    loadingPicOpen();
                    testSession(userSessionInfo);
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
        }
    })
    //换证发放
    $('a[href="#exchangeApplyGiveOutContent"]').on('shown', function (e) {
        $("#exchangePage").css('display', 'none')
        var changeType = csData['czlb-yxqmhz']['nr3'] + '\' OR changeType=\'' + csData['czlb-fyxqmhz']['nr3']
        var table = $('#exchangeGiveOutTable')
        var page = $('#exchangePage')
        appendGiveOut(csData, changeType, table, page)
    })
    //换证的完成记录
    $('a[href="#exchangeApplyHistoryContent"]').on('shown', function (e) {
        $("#exchangePage").css('display', 'none')
        var changeType = csData['czlb-yxqmhz']['nr3'] + '\' OR changeType=\'' + csData['czlb-fyxqmhz']['nr3']
        var table = $('#exchangeHistoryTable')
        var page = $('#exchangePage')
        appendHistory(csData, changeType, table, page)
    })
    //换证未完成记录
    $('a[href="#exchangeApplyUndoneHistoryContent"]').on('shown', function (e) {
        $("#exchangePage").css('display', 'none')
        var changeType = csData['czlb-yxqmhz']['nr3'] + '\' OR changeType=\'' + csData['czlb-fyxqmhz']['nr3']
        var table = $('#exchangeUndoneHistoryTable')
        var page = $('#exchangePage')
        appendUndoneHistory(csData, changeType, table, page)
    })

    $('a[href="#fixApplyAppendContent"]').on('shown', function (e) {

    })
    //补证审核
    $('a[href="#fixApplyCheckContent"]').on('shown', function (e) {
        $("#fixPage").css('display', 'none')
        var obj = {};
        obj.column = ' id,archivesId,department,lotNumber,payId,UName,changeType ';
        obj.order = ' order by department,payId ';
        if (power === cjPower) {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            //添加目前正在进行车间审核的补证申请
            obj.where = ' where checkStatus = \'' + csData['checkStatus-cjshz']['nr2'] + '\' AND changeType = \'' + csData['czlb-bz']['nr2'] + '\' AND department like \'' + department + '%\'';
            obj.extra = '<td><span class="seeInfo">申请表</span> <span class="seeImage">图片材料</span></td><td><span title="通过申请" data-toggle="tooltip" class="pass"></span><span title="完善信息" data-toggle="tooltip" class="improve"></span><span title="驳回申请" data-toggle="tooltip" class="reject"></span></td>'
            fixApplyAjax(obj)
        }
        if (power === jykPower) {
            obj.where = ' where checkStatus = \'' + csData['checkStatus-jykshz']['nr2'] + '\' AND changeType = \'' + csData['czlb-bz']['nr2'] + '\'';
            obj.extra = '<td><span class="seeInfo">申请表</span> <span class="seeImage">图片材料</span></td><td><span title="通过申请" data-toggle="tooltip" class="pass"></span><span title="驳回申请" data-toggle="tooltip" class="reject"></span></td>'
            fixApplyAjax(obj)
        }
        //这个函数是请求换补证申请，然后添加入页面的函数,传入obj是sql对象，内涵where,column,order三个字段
        function fixApplyAjax(obj) {
            var where = obj.where;
            var order = obj.order;
            var columns = obj.column;
            var table = ' bgxx '
            var db = 'jszglInfo'
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var table = $("#fixCheckTable");
                        var page = $("#fixPage");
                        var thText = '<tr><th>id</th><th>archivesId</th><th>部门</th><th>提交日期</th><th>工资号</th><th>姓名</th><th>申请类型</th><th>申请表详情</th><th>操作</th></tr>';
                        var extra = obj.extra;
                        var eventFunction = boundCheckEvent;
                        commonAppendToTable(table, page, data, thText, extra, eventFunction)
                        $(".pass").tooltip({
                            'placement': 'left'
                        })
                        $(".improve").tooltip({
                            'placement': 'left'
                        })
                        $(".reject").tooltip({
                            'placement': 'left'
                        })
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无补证申请信息')
                        $("#fixCheckTable").empty()
                    }
                },
                beforeSend: function () {
                    loadingPicOpen();
                    testSession(userSessionInfo);
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
        }
    })
    //补证发放
    $('a[href="#fixApplyGiveOutContent"]').on('shown', function (e) {
        $("#fixPage").css('display', 'none')
        var changeType = csData['czlb-bz']['nr3'];
        var table = $('#fixGiveOutTable')
        var page = $('#fixPage')
        appendGiveOut(csData, changeType, table, page)
    })
    //补证的完成记录
    $('a[href="#fixApplyHistoryContent"]').on('shown', function (e) {
        $("#fixPage").css('display', 'none')
        var changeType = csData['czlb-bz']['nr3'];
        var table = $('#fixHistoryTable')
        var page = $('#fixPage')
        appendHistory(csData, changeType, table, page)
    })
    //补证未完成记录
    $('a[href="#fixApplyUndoneHistoryContent"]').on('shown', function (e) {
        $("#fixPage").css('display', 'none')
        var changeType = csData['czlb-bz']['nr3'];
        var table = $('#fixUndoneHistoryTable')
        var page = $('#fixPage')
        appendUndoneHistory(csData, changeType, table, page)
    })
    //添加完成记录
    function appendHistory(csData, changeType, table, page) {
        var power = sessionGet('power');
        var obj = {};
        obj.column = ' payId,department,uName,lotNumber,grArriveDate';
        obj.order = ' order by lotNumber desc';
        if (power === cjPower) {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            //添加目前已经发放到车间的信息
            obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus = \'' + csData['finishStatus-ffdgr']['nr2'] + '\' AND department like \'' + department + '%\'';
            appendHistoryTable(obj, table, page)
        }
        if (power === jykPower) {
            obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
            appendHistoryTable(obj, table, page)
            var html = '<label for="historySelect">选择部门：</label><select name="" id="historySelect"><option>全段</option>';
            for (var i in csData) {
                if (csData[i]['lb'] === 'ssbm') {
                    html += '<option>' + csData[i]['nr1'] + '</option>'
                }
            }
            html += '</select>';
            $(table).prev().empty().append(html);
            $('#historySelect').off('change').on('change', function () {
                if ($(this).val() === '全段') {
                    obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
                    appendHistoryTable(obj, table, page)
                } else {
                    var department = $(this).val()
                    obj.where = ' where department like \'' + department + '%\' AND (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
                    appendHistoryTable(obj, table, page)
                }
            })
        }
        function appendHistoryTable(obj, target, page) {
            var where = obj.where;
            var order = obj.order;
            var table = ' bgxx '
            var columns = obj.column;
            var db = 'jszglInfo'
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {    
                        var thText = '<tr><th>工资号</th><th>部门</th><th>姓名</th><th>发起日期</th><th>发到日期</th></tr>';
                        var eventFunction = '';
                        var extra = ''
                        commonAppendToTable(target, page, data, thText, extra, eventFunction)
                    }
                    else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无发放完成的信息');
                    }
                },
                beforeSend: function () {
                    loadingPicOpen();
                    testSession(userSessionInfo);
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
        }
    }
    //添加发放信息
    function appendGiveOut(csData, changeType, table, page) {
        var power = sessionGet('power');
        var obj = {};
        obj.column = ' id,payId,department,uName,cjArriveDate,grArriveDate';
        obj.order = ' order by department,payId ';
        if (power === cjPower) {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            //添加目前已经发放到车间的信息
            obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus = \'' + csData['finishStatus-ffdcj']['nr2'] + '\' AND department like \'' + department + '%\'';
            appendGiveOutTable(obj, table, page)
        }
        if (power === jykPower) {
            obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdcj']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
            appendGiveOutTable(obj, table, page)
            var html = '<label for="giveOutSelect">选择部门：</label><select name="" id="giveOutSelect"><option>全段</option>';
            for (var i in csData) {
                if (csData[i]['lb'] === 'ssbm') {
                    html += '<option>' + csData[i]['nr1'] + '</option>'
                }
            }
            html += '</select>';
            $(table).prev().empty().append(html);
            $('#giveOutSelect').off('change').on('change', function () {
                if ($(this).val() === '全段') {
                    obj.where = ' where (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdcj']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
                    appendGiveOutTable(obj, table, page)
                } else {
                    var department = $(this).val()
                    obj.where = ' where department like \'' + department + '%\' AND (changeType=\'' + changeType + '\') AND checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdcj']['nr2'] + '\' AND finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
                    appendGiveOutTable(obj, table, page)
                }
            })
        }

        function appendGiveOutTable(obj, table, page) {
            var power = sessionGet('power');
            var text = '';
            if (power === cjPower) {
                text = '发放到个人';
                var extra = '<td><span class="giveOut">' + text + '</span></td>';
            } else if (power === jykPower) {
                text = '发放到车间';
                var extra = '<td><span class="giveOut">' + text + '</span></td>';
            }
            var where = obj.where;
            var order = obj.order;
            var tableN = ' bgxx '
            var columns = obj.column;
            var db = 'jszglInfo'
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(tableN) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        console.log(data)
                        var thText = '<tr><th>id</th><th>工资号</th><th>部门</th><th>姓名</th><th>发到车间日期</th><th>发到个人日期</th><th>操作</th></tr>';
                        var eventFunction = boundGiveOutEvent;
                        commonAppendToTable(table, page, data, thText, extra, eventFunction)
                    }
                    else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无发放信息');
                    }
                },
                beforeSend: function () {
                    loadingPicOpen();
                    testSession(userSessionInfo);
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
            function boundGiveOutEvent(data) {
                for (var i = 0; i < $(".giveOut").length; i++) {
                    var _this = $('.giveOut:eq(' + i + ')');
                    if (checkIfInArray($(_this).parent().prev().prev().prev().prev().text(), straightJYK)) {
                        $(_this).text('发放到个人')
                    }
                }
                var user = sessionGet('user')
                var confirmP = '';
                $("#fixGiveOutTable .giveOut,#exchangeGiveOutTable .giveOut").off('click').on('click', function () {
                    var power = sessionGet('power');
                    var _this = $(this);
                    var id = $(this).parent().siblings('td:first-child').text();
                    var payId = $(this).parent().siblings('td:nth-child(2)').text();
                    var thisName = $(this).parent().siblings('td:nth-child(4)').text().replace(/\s*/g, "");;
                    var where = ''
                    //只传给后台payid和bgxx的id
                    if (power === cjPower) {
                        confirmP = '请确认' + thisName + '师傅的驾驶证已发放到本人';
                    } else if (power === jykPower && $(this).text() === '发放到车间') {
                        confirmP = '请确认' + thisName + '师傅的驾驶证已发放到所属车间';
                    } else if (power === jykPower && $(this).text() === '发放到个人') {
                        confirmP = '请确认' + thisName + '师傅的驾驶证已发放到本人';
                    }
                    if (confirm(confirmP)) {
                        $.ajax({
                            url: "./index.ashx?Method=giveOut&id=" + id + "&payId=" + payId + "&operator=" + user,
                            type: "POST",
                            timeout: 8000,
                            dataType: 'text',
                            success: function (text) {
                                if (text === 'success') {
                                    var today = new Date();
                                    today.month = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
                                    today.date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
                                    today = today.getFullYear() + '-' + today.month + '-' + today.date;

                                    if (confirmP.indexOf('本人') > -1) {
                                        _this.parent().siblings('td:nth-child(6)').text(today)

                                        _this.removeClass('giveOut').text('发放成功').off('click')
                                    } else {
                                        _this.removeClass('giveOut').text('发放成功').off('click')
                                        _this.parent().siblings('td:nth-child(5)').text(today)
                                    }
                                } else {
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-error").empty().text('操作失败')
                                }
                            }
                        })
                    }
                })
            }
        }
    }
    //添加未完成记录
    function appendUndoneHistory(csData, changeType, table, page) {
        var power = sessionGet('power');
        var obj = {};
        obj.column = ' payId,department,uName,lotNumber,changeReason,checkStatus,cjOperator,jykOperator,finishStatus';
        obj.order = ' order by lotNumber desc';
        if (power === cjPower) {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            //添加目前已经发放到车间的信息
            obj.where = ' where (changeType=\'' + changeType + '\') AND (checkStatus != \'' + csData['checkStatus-shtg']['nr2'] + '\' OR finishStatus != \'' + csData['finishStatus-ffdgr']['nr2'] + '\') AND department like \'' + department + '%\'';
            appendUndoneHistoryTable(obj, table, page)
        }
        if (power === jykPower) {
            obj.where = ' where (changeType=\'' + changeType + '\') AND (checkStatus != \'' + csData['checkStatus-shtg']['nr2'] + '\' OR finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
            appendUndoneHistoryTable(obj, table, page)
            var html = '<label for="undoneHistorySelect">选择部门：</label><select name="" id="undoneHistorySelect"><option>全段</option>';
            for (var i in csData) {
                if (csData[i]['lb'] === 'ssbm') {
                    html += '<option>' + csData[i]['nr1'] + '</option>'
                }
            }
            html += '</select>';
            $(table).prev().empty().append(html);
            $('#undoneHistorySelect').off('change').on('change', function () {
                if ($(this).val() === '全段') {
                    obj.where = ' where (changeType=\'' + changeType + '\') AND (checkStatus != \'' + csData['checkStatus-shtg']['nr2'] + '\' OR finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    appendUndoneHistoryTable(obj, table, page)
                } else {
                    var department = $(this).val()
                    obj.where = ' where department like \'' + department + '%\' AND (changeType=\'' + changeType + '\') AND (checkStatus != \'' + csData['checkStatus-shtg']['nr2'] + '\' OR finishStatus !=\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    appendUndoneHistoryTable(obj, table, page)
                }
            })
        }
        function appendUndoneHistoryTable(obj, target, page) {
            var where = obj.where;
            var order = obj.order;
            var table = ' bgxx '
            var columns = obj.column;
            var db = 'jszglInfo'
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var thText = '<tr><th>工资号</th><th>部门</th><th>姓名</th><th>发起日期</th><th>发起原因</th><th>审核状态</th><th>车间审核人</th><th>教育科审核人</th><th>发放状态</th></tr>';
                        var eventFunction = '';
                        var extra = ''
                        commonAppendToTable(target, page, data, thText, extra, eventFunction)
                    }
                    else {
                        if (changeType.indexOf('换证')>-1) {
                            var txt = '换证'
                        } else {
                            var txt = '补证'
                        }
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无未完成的' + txt + '信息');
                    }
                },
                beforeSend: function () {
                    loadingPicOpen();
                    testSession(userSessionInfo);
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
        }
    }
    //审核申请的按钮事件
    function boundCheckEvent() {
        var power = sessionGet('power')
        var payId = '';
        var lotNumber = '';
        var changeType = '';
        var id = '';
        var setStr = '';
        var rejectSetStr = '';
        var where = '';
        var uname = '';
        //获取当天的xxxx-xx-xx形式时间戳
        var today = new Date();
        today.month = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
        today.date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        today = today.getFullYear() + '-' + today.month + '-' + today.date;
        if (power === cjPower) {
            setStr = 'checkStatus = \'' + csData['checkStatus-jykshz']['nr2'] + '\', cjOperator = \'' + sessionGet('user') + '\', cjCheckDate = \'' + today + '\'';
            rejectSetStr = ' ,cjOperator = \'' + sessionGet('user') + '\', cjCheckDate = \'' + today + '\' ';
        } else if (power === jykPower) {
            setStr = 'checkStatus = \'' + csData['checkStatus-shtg']['nr2'] + '\', jykOperator = \'' + sessionGet('user') + '\', jykCheckDate = \'' + today + '\'';
            rejectSetStr = ' ,jykOperator = \'' + sessionGet('user') + '\', jykCheckDate = \'' + today + '\' ';
        }
        $("#fixCheckTable .seeInfo").off('click').on('click', displayTable);
        $("#fixCheckTable .seeImage").off('click').on('click', displayImage);
        $("#fixCheckTable .pass").off('click').on('click', passApply);
        $("#fixCheckTable .reject").off('click').on('click', rejectApply);
        $("#fixCheckTable .improve").off('click').on('click', improveApply);
        $("#exchangeCheckTable .seeInfo").off('click').on('click', displayTable);
        $("#exchangeCheckTable .seeImage").off('click').on('click', displayImage);
        $("#exchangeCheckTable .pass").off('click').on('click', passApply);
        $("#exchangeCheckTable .reject").off('click').on('click', rejectApply);
        $("#exchangeCheckTable .improve").off('click').on('click', improveApply);
        function displayImage() {
            $('#displayImage').modal('show')
            var power = sessionGet('power')
            if (power === jykPower) {
                $('#displayImage .btn-info').css('visibility','hidden')
            }
            //加入显示图片、引入上传图片
            //补证也做相同功能
            var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
            var uName = $(this).parent().siblings('td:nth-child(6)').text();
            var _this = $(this);

            var where = ' where archivesId =\'' + archivesId+'\'';
            var order = '';
            var table = ' jbxx '
            var columns = ' cardPath,photoPath,sfzPath';
            var db = 'jszglInfo'
            $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var photoPath = data[0]['photoPath'] !== '' ? data[0]['photoPath']:'./source/images/broken.png'
                        var sfzPath = data[0]['sfzPath'] !== '' ? data[0]['sfzPath']:'./source/images/broken.png'
                        var cardPath = data[0]['cardPath'] !== '' ? data[0]['cardPath'] :'./source/images/broken.png'
                        $('#displayImage .photo img').prop('src', photoPath);
                        $('#displayImage .sfz img').prop('src', sfzPath);
                        $('#displayImage .card img').prop('src', cardPath);
                        $('#displayImage .img img').on('mouseover', function () {
                            if ($(this).prop('src').indexOf('broken') < 0) {
                                $('#displayImage .zoom img').prop('src', $(this).prop('src'))
                                $('#displayImage .zoom').css({
                                    'display': 'block',
                                })
                            }
                        })
                        $('#displayImage .zoom img').on('mouseover', function () {                            
                            $('#displayImage .zoom').css({
                                'display': 'block',
                            })                            
                        })
                        $('#displayImage .zoom img').on('mouseleave', function () {
                            $('#displayImage .zoom').css({
                                'display': 'none'
                            })
                        })
                        $('#displayImage .img img').on('mouseleave', function () {
                            $('#displayImage .zoom').css({
                                'display': 'none'
                            })
                        })
                        $('#displayImage .btn-info').off('click').on('click', function () {
                            $('#displayImage').modal('hide')
                            uploadImg(archivesId, uName,false)
                        })
                    }
                    else {
                        
                    }
                }
            })
        }
        function improveApply() {
            var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
            var uName = $(this).parent().siblings('td:nth-child(6)').text();
            uploadImg(archivesId, uName,false)
        }
        function displayTable() {
            $("#fixTable").appendTo($("#displayApplyContainer"));
            $("#displayApplyContainer").css('visibility', 'visible').animate({ 'opacity': 0.9 }, 800)
            $("#fixTable").css({ 'visibility': 'visible', 'marginLeft': '200px' }).animate({ 'opacity': 1 }, 800)
            var changeType = ''
            if ($(this).parent().prev().text() === csData['czlb-yxqmhz']['nr3']) {
                changeType = csData['czlb-yxqmhz']['name']
            } else if ($(this).parent().prev().text() === csData['czlb-fyxqmhz']['nr3']) {
                changeType = csData['czlb-fyxqmhz']['name']
            } else if ($(this).parent().prev().text() === csData['czlb-bz']['nr3']) {
                changeType = csData['czlb-bz']['name']
            }
            getSqInfo($(this), $(this).parent().siblings('td:nth-child(5)').text(), changeType)
            $("#displayApplyContainer").off('click').on('click', function () {
                $("#displayApplyContainer").dequeue().animate({ 'opacity': 0 }, 800, function () {
                    $("#displayApplyContainer").css('visibility', 'hidden')
                })
                $("#fixTable").dequeue().animate({ 'opacity': 0 }, 800, function () {
                    $("#fixTable").css({ 'visibility': 'hidden', 'marginLeft': '200px' })
                })
            })
            $(document).keyup(function (event) {
                switch (event.keyCode) {
                    case 27:
                        $("#displayApplyContainer").dequeue().animate({ 'opacity': 0 }, 800, function () {
                            $("#displayApplyContainer").css('visibility', 'hidden')
                        });
                        $("#fixTable").dequeue().animate({ 'opacity': 0 }, 800, function () {
                            $("#fixTable").css({ 'visibility': 'hidden', 'marginLeft': '200px' })
                        });
                }
            });
        }
        function passApply() {
            if (confirm('请认真核对该申请表信息。操作无法撤回。\u000d确定要通过审核请选“确定”。返回请选“取消”')) {
                var power = sessionGet('power')
                id = $(this).parent().siblings('td:nth-child(1)').text();
                payId = $(this).parent().siblings('td:nth-child(5)').text();
                lotNumber = $(this).parent().siblings('td:nth-child(4)').text();
                changeType = $(this).parent().siblings('td:nth-child(7)').text();
                uname = $(this).parent().siblings('td:nth-child(6)').text();
                var _this = $(this);
                var table = ' bgxx ';
                where = ' where id=\'' + id + '\'';
                $.ajax({
                    url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                    type: "POST",
                    timeout: 8000,
                    dataType: 'text',
                    success: function (ret) {
                        if (ret === 'success') {
                            if (power === jykPower) {
                                var table = ' sqxx ';
                                var db = 'jszglInfo'
                                var where = ' where payid=\'' + payId +'\''
                                $.ajax({
                                    url: "./index.ashx?Method=delete&table=" + table  + "&where=" + where,
                                    type: "POST",
                                    timeout: 8000,
                                    dataType: 'text',
                                    success: function (ret) {
                                        if (ret === 'success') {
                                            $("#alertModal").modal('show')
                                            $("#alertModal .text-success").empty().text('操作成功，您已通过了' + uname + '师傅的' + changeType + '申请')
                                            $(_this).next('span').remove();
                                            $(_this).remove();

                                        }
                                    }
                                });
                            }
                            $("#alertModal").modal('show')
                            $("#alertModal .text-success").empty().text('操作成功，您已通过了' + uname + '师傅的' + changeType + '申请')
                            $(_this).next('span').remove();
                            $(_this).remove();

                        }
                    }
                });
            }
        }
        function rejectApply() {
            var failedReason = '';
            var shortage;
            var _thisReject = $(this);
            var changeType = $(this).parent().siblings('td:nth-child(7)').text();
            $('#rejectModal').modal('show')
            $('#rejectModal input').prop('checked', false);
            $('#rejectModal .control-group').empty()
            var html = '';
            if (changeType === csData['czlb-bz']['nr3']) {
                for (var i in csData) {
                    if (csData[i]['lb'] === 'bzsxcl') {
                        html += '<label class="checkbox"><input type="checkbox" value="' + csData[i]['nr2'] + '">缺少' + csData[i]['nr2'] + '</label>';
                    }
                }
            }
            else if (changeType === csData['czlb-yxqmhz']['nr3'] || changeType === csData['czlb-fyxqmhz']['nr3']) {
                for (var i in csData) {
                    if (csData[i]['lb'] === 'hzsxcl') {
                        html += '<label class="checkbox"><input type="checkbox" value="' + csData[i]['nr2'] + '">缺少' + csData[i]['nr2'] + '</label>';
                    }
                }
            }
            $("#short").off('click').on('click', function () {
                $('#rejectModal .control-group').empty().append(html);
            });
            $("#wrong").off('click').on('click', function () {
                $('#rejectModal .control-group').empty()
            });
            $("#rejectModal .btn-primary").off('click').on('click', function () {
                var short = document.getElementById('short').checked;
                var wrong = document.getElementById('wrong').checked;
                if (short && $("#rejectModal .control-group input:checked").length === 0) {
                    $("#alertModal").modal('show')
                    $("#alertModal .text-warning").empty().text('请选择缺少的材料')
                    return false;
                }
                else if (short && $("#rejectModal .control-group input:checked").length > 0) {
                    shortage = '';
                    for (var i = 0; i < $("#rejectModal .control-group input:checked").length; i++) {
                        shortage += $("#rejectModal .control-group input:checked:eq(" + i + ")").val();
                        shortage += ','
                    }
                    shortage = shortage.substring(0, shortage.length - 1);
                    failedReason = '材料不齐全';
                }
                else if (wrong) {
                    failedReason = '信息有误';
                    shortage = '';
                }
                if (confirm('请认真核对该申请表信息。操作无法撤回。\u000d确定要驳回该申请请选“确定”。返回请选“取消”')) {

                    id = $(_thisReject).parent().siblings('td:nth-child(1)').text();
                    payId = $(_thisReject).parent().siblings('td:nth-child(5)').text();
                    lotNumber = $(_thisReject).parent().siblings('td:nth-child(4)').text();
                    changeType = $(_thisReject).parent().siblings('td:nth-child(7)').text();
                    uname = $(_thisReject).parent().siblings('td:nth-child(6)').text();

                    var whereBgxx = ' where id=\'' + id + '\'';
                    var tableBgxx = ' bgxx ';
                    var bgxxSql = 'UPDATE ' + tableBgxx + ' SET ' + ' checkStatus = \'' + csData['checkStatus-shwtg']['nr2'] + '\'' + ' ,shortage = \'' + shortage + '\'' + ' ,failedReason = \'' + failedReason + '\'' + rejectSetStr;
                    var status = '';
                    if (changeType === csData['czlb-yxqmhz']['nr3']) {
                        status = csData['zjzt-yj']['nr2'];
                    } else if (changeType === csData['czlb-fyxqmhz']['nr3']) {
                        status = csData['zjzt-zc']['nr2'];
                    } else if (changeType === csData['czlb-bz']['nr3']) {

                    }
                    var whereJbxx = ' where payId=\'' + payId + '\'';
                    var tablejbxx = ' jbxx ';
                    var jbxxSql = 'UPDATE ' + tablejbxx + ' SET status=\'' + status + '\''

                    var whereSqxx = ' where payId=\'' + payId + '\'';
                    var tableSqxx = ' sqxx ';
                    var sqxxSql = 'DELETE FROM' + tableSqxx + ' where=\'' + where + '\''
                    var type = '驳回申请';

                    $.ajax({
                        url: "./index.ashx?Method=execTran&type=" + type + "&sqlStr=" + escape(jbxxSql) + "¿" + escape(bgxxSql) + "¿" + escape(sqxxSql),
                        type: "POST",
                        dataType: 'text',
                        success: function (ret) {
                            if (ret === 'success') {
                                $("#alertModal").modal('show')
                                $("#alertModal .text-success").empty().text('操作成功，您已驳回了' + uname + '师傅的' + changeType + '申请')
                                $(_thisReject).prev('span').remove();
                                $(_thisReject).remove();
                                $("#rejectModal").modal('hide')
                            }
                        }
                    });
                }
            });
        }
        function getSqInfo(_this, payId, changeType) {
            var columns = ' uname,sex,birthdate,cardid,phone1,address,archivesId ';
            var table = 'userinfo1';
            var where = ' where payid = \'' + payId + '\'';
            var order = '';
            var db = 'baseInfo';
            $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var columns = ' * ';
                        var table = ' sqxx';
                        var where = ' where payid = \'' + payId + '\'';
                        var order = '';
                        var db = 'jszglInfo';
                        $.ajax({
                            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                            type: "POST",
                            timeout: 8000,
                            data: {
                                funcName: 'getInfo', serverName: '10.101.62.73', uid: 'sa', pwd: '2huj15h1', Database: 'jszgl',
                                tableName: 'sqxx', column: ' * ', where: ' where payId = \'' + payId + '\'', order: ' '
                            },
                            dataType: 'json',
                            success: function (cardData) {
                                if (data.length > 0) {
                                    fillInTable(data[0], cardData[0], changeType);

                                }
                            }
                        });
                    }
                },
                beforeSend: function () {
                    //在where字段后加入用户选择的车间范围
                    testSession(userSessionInfo);
                    loadingPicOpen();
                },
                complete: function (XMLHttpRequest, status) {
                    loadingPicClose();
                    if (status === 'timeout') {
                        ajaxTimeOut.abort();    // 超时后中断请求
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                    }
                }
            })
        }
    }
}
//显示上传图片modal
function uploadImg(archivesId, uName, ifyearly) {
    $("#uploadImage img").prop('src', './source/images/broken.png').css({ 'width': '73px', 'height': '64px' })
    $("#uploadImage").modal('show')
    //图片上传功能。
    $("#uploadImage .btn-primary").off('click').on('click', function () {
        //取用户身份证号
        var columns = ' cardId';
        var table = ' userinfo1 ';
        var db = 'baseInfo';
        var where = ' where archivesId = \'' + archivesId + '\'';
        var order = '';
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var cardId = data[0]['cardId'];
                    var fileCard = document.getElementById('cardInput').files[0];
                    var fileSfz = document.getElementById('sfzInput').files[0];
                    var filePhoto = document.getElementById('photoInput').files[0];
                    var formData = new FormData($('#uploadImageForm')[0]);
                    var cardPath = uName + cardId + '驾驶证';
                    var sfzPath = uName + cardId + '身份证';
                    var photoPath = uName + cardId + '电子照';
                    var setStr = '';
                    //该变量是update语句中set后面的句段
                    formData.append("uName", uName);
                    formData.append("cardId", cardId);
                    formData.append("where", ' where archivesId = \'' + archivesId + '\'');
                    var cardFlag = false;
                    var sfzFlag = false;
                    var photoFlag = false;
                    var flag = true;
                    if (!fileCard || fileCard.size <= 0) { } else {
                        cardFlag = true;
                        formData.set("file", fileCard);
                        setStr = 'cardPath = \'./source/images/userPic/' + cardPath + '\'';
                        formData.set("setStr", setStr);
                        formData.set("fileName", cardPath)
                        uploadImage(formData, 'card', archivesId)
                    }
                    if (!fileSfz || fileSfz.size <= 0) { } else {
                        sfzFlag = true;
                        formData.set("file", fileSfz);
                        setStr = 'sfzPath = \'./source/images/userPic/' + sfzPath + '\'';
                        formData.set("fileName", sfzPath)
                        formData.set("setStr", setStr);
                        uploadImage(formData, 'sfz', archivesId)
                    }
                    if (!filePhoto || filePhoto.size <= 0) { } else {
                        photoFlag = true;
                        formData.set("file", filePhoto);
                        setStr = 'photoPath = \'./source/images/userPic/' + photoPath + '\' ';
                        formData.set("fileName", photoPath)
                        formData.set("setStr", setStr);
                        uploadImage(formData, 'photo', archivesId)
                    }
                    if (!cardFlag && !sfzFlag && !photoFlag) {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-warning").empty().text('请至少选择一张图片')
                        return;
                    }
                    function uploadImage(formData, type, archivesId) {
                        $.ajax({
                            url: "./index.ashx?Method=storeImg&type=" + type + "&archivesId=" + archivesId,
                            type: "POST",
                            data: formData,
                            dataType: 'text',
                            processData: false,
                            contentType: false,
                            cache: false,
                            success: function (data) {
                                if (data === 'success') {
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-success").empty().text('上传成功')
                                    if (ifyearly) {
                                        displayYearly()
                                    } else {

                                    }
                                    $('#uploadImage').modal('hide')
                                } else if (data === 'failed') {
                                    $('#uploadImage').modal('hide')
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-error").empty().text('上传失败')
                                } else {
                                    $('#uploadImage').modal('hide')
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-error").empty().text('图片格式错误，请上传jpg\jpeg\png格式的图片')
                                }
                            }
                        })
                    }
                }
            }
        })
    });
}

//证件查询
function appendQuery() {
    var power = sessionGet('power');
    if (power === '1') {
        var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
        var where = ' where department like \'' + department + '%\''
        queryTable(where)
    } else {
        var where = '';
        queryTable(where)
    }
    $('#toolBar #filterButton').off('click').on('click', function () {
        if ($('#queryFilter').hasClass('hid')) {
            $('#queryFilter').removeClass('hid').addClass('vis')
        } else {
            $('#queryFilter').removeClass('vis').addClass('hid')
        }
        var _new = $('#queryFilter');
        $('#queryFilter').remove()
        $('.fixed-table-toolbar').after(_new)
        var html = '<li class="allOrNo">全选/全不选</li>';
        var html1 = '<li class="allOrNo">全选/全不选</li>';
        var html2 = '<li class="allOrNo">全选/全不选</li>';
        for (var i in csData) {
            if (csData[i]['lb'] === 'ssbm') {
                html += '<li><label class="checkbox"><input type="checkbox"/> <span class="depName">' + csData[i]['nr1'] + '</span></label></li>'
            }
            if (csData[i]['lb'] === 'zjlx') {
                html1 += '<li><label class="checkbox"><input type="checkbox"/> <span class="driveCode">' + csData[i]['name'] + '</span></label></li>'
            }
            if (csData[i]['lb'] === 'zjzt') {
                html2 += '<li><label class="checkbox"><input type="checkbox"/> <span class="status">' + csData[i]['nr2'] + '</span></label></li>'
            }
        }
        $('#queryFilter .filterDepartmentDiv .dropdown-menu').empty().append(html);
        $('#queryFilter .filterSjDriveCodeDiv .dropdown-menu').empty().append(html1);
        $('#queryFilter .filterStatusDiv .dropdown-menu').empty().append(html2);
        if (power === '1') {
            var arr = $('.filterDepartmentDiv .depName')
            $('#queryFilter .filterDepartmentDiv .dropdown-menu input[type=checkbox]').prop('disabled', true)
            for (var i = 0; i < arr.length; i++) {
                if (department.indexOf($(arr[i]).text()) > -1) {
                    $(arr[i]).prev().prop('checked', true);
                }
            }
        }
        $('#queryFilter .multiSelect li').off('click').on('click', function (e) {
            e.stopPropagation();
        })
        $('#queryFilter .multiSelect .allOrNo').off('click').on('click', function (e) {
            e.stopPropagation();
            if (!$(this).hasClass('toggle')) {
                $(this).siblings('li').find('input').prop('checked', true)
                $(this).addClass('toggle')
            } else {
                $(this).removeClass('toggle')
                $(this).siblings('li').find('input').prop('checked', false)
            }
        })
        $("#queryFilter .queryBtn").off('click').on('click', function (e) {
            var whereStr = ' where '
            e.preventDefault();
            var dep = checkDepartmentFilter()
            var age = checkAgeFilter()
            var code = checkSjDriveCodeFilter()
            var status = checkStatusFilter()
            var pc = checkPCFilter()
            var sql = whereStr + dep + age + code + status + pc;
            sql = sql.substring(0, sql.length - 4, sql)
            var columns = ' payId,uName,department,birthDate,txrq,datediff(yy,birthdate,getdate()) AS age,cardId,sjDate,startDate,deadline,sjDriveCode,sjDriveType,sjRemark,status,yearlyCheckDate,pym,phyTest,PC'
            var order = ' order by department ASC';
            var url = './index.ashx?Method=select&table=jbxx&db=jszglInfo&columns=' + columns + "&where=" + sql + "&order=" + order;
            $.ajax({
                url: url,
                type: "POST",
                dataType: 'json',
                success: function (ret) {
                    $('#queryTable').bootstrapTable('load', ret);
                    boundOutputExcel()
                }
            })
        })
        function checkDepartmentFilter() {
            var total = $('.filterDepartmentDiv .dropdown-menu input[type=checkbox]').length;
            var checked = $('.filterDepartmentDiv .dropdown-menu input[type=checkbox]:checked').length;
            var sql = '';
            if (total === checked || checked === 0) {
                return sql
            } else {
                var arr = $('.filterDepartmentDiv .dropdown-menu input[type=checkbox]:checked');
                var html = '(';
                for (var i = 0; i < arr.length; i++) {
                    html += ' department like \'' + $(arr[i]).siblings('.depName').text() + '%\' OR'
                }
                html = html.substring(0, html.length - 3, html);
                html += ') AND ';
                return html;
            }
        }
        function checkAgeFilter() {

            var val1 = $('.filterAgeDiv .value1').val()
            var val2 = $('.filterAgeDiv .value2').val()
            if (val1 && val2) {
                var sql = '(datediff(yy,birthdate,getdate()) between ' + val1 + ' AND ' + val2 + ') AND '
                return sql;
            } else {
                return '';
            }

        }
        function checkPCFilter() {
            var val1 = $('.filterPCDiv .value1').val()
            var val2 = $('.filterPCDiv .value2').val()
            if (val1 && val2) {
                var sql = '(PC =\'' + val1 + '.' + val2 + '\') AND '
                return sql;
            } else {
                return '';
            }
        }
        function checkSjDriveCodeFilter() {
            var total = $('.filterSjDriveCodeDiv .dropdown-menu input[type=checkbox]').length;
            var checked = $('.filterSjDriveCodeDiv .dropdown-menu input[type=checkbox]:checked').length;
            var sql = '';
            if (total === checked || checked === 0) {
                return sql
            } else {
                var arr = $('.filterSjDriveCodeDiv .dropdown-menu input[type=checkbox]:checked');
                var html = '(';
                for (var i = 0; i < arr.length; i++) {
                    html += ' sjDriveCode = \'' + $(arr[i]).siblings('.driveCode').text() + '\' OR'
                }
                html = html.substring(0, html.length - 3, html);
                html += ') AND ';
                return html;
            }
        }
        function checkStatusFilter() {
            var total = $('.filterStatusDiv .dropdown-menu input[type=checkbox]').length;
            var checked = $('.filterStatusDiv .dropdown-menu input[type=checkbox]:checked').length;
            var sql = '';
            if (total === checked || checked === 0) {
                return sql
            } else {
                var arr = $('.filterStatusDiv .dropdown-menu input[type=checkbox]:checked');
                var html = '(';
                for (var i = 0; i < arr.length; i++) {
                    html += ' status = \'' + $(arr[i]).siblings('.status').text() + '\' OR'
                }
                html = html.substring(0, html.length - 3, html);
                html += ') AND ';
                return html;
            }
        }
    })
    function queryTable(where) {
        var columns = ' payId,uName,department,birthDate,txrq,datediff(yy,birthdate,getdate()) AS age,cardId,sjDate,startDate,deadline,sjDriveCode,sjDriveType,sjRemark,status,yearlyCheckDate,pym,phyTest,PC'
        var order = ' order by department ASC';
        var url = './index.ashx?Method=select&table=jbxx&db=jszglInfo&columns=' + columns + "&where=" + where + "&order=" + order;
        $('#queryTable').bootstrapTable({
            url: url,
            method: 'post',
            striped: true,
            cache: false,
            smartDisplay: false,
            pagination: true,
            paginationLoop: false,
            checkbox: false,
            toolbar: '#toolBar',
            sidePagination: "client",
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 50],
            search: true,
            strictSearch: false,
            showColumns: true,
            showRefresh: true,
            minimumCountColumns: 2,
            height: 500,
            uniqueId: "payId",
            showToggle: false,
            cardView: false,
            detailView: false,
            columns: [{
                checkbox: false,
                visible: false
            }, {
                field: 'payId',
                title: '工资号',
                sortable: true,
                class: 'payId'
            }, {
                field: 'uName',
                title: '姓名',
                sortable: true,
                class: 'uName'
            }, {
                field: 'department',
                title: '部门',
                sortable: true,
                class: 'department'
            }, {
                field: 'birthDate',
                title: '出生日期',
                sortable: true,
                class: 'birthDate'
            }, {
                field: 'txrq',
                title: '退休日期',
                sortable: true,
                class: 'txrq'
            }, {
                field: 'age',
                title: '年龄',
                sortable: true,
                class: 'age'
            }, {
                field: 'cardId',
                title: '身份证号',
                sortable: false,
                class: 'cardId'
            }, {
                field: 'sjDate',
                title: '初次领证日期',
                sortable: true,
                class: 'sjDate'
            }, {
                field: 'startDate',
                title: '有效起始日期',
                sortable: true,
                class: 'startDate'
            }, {
                field: 'deadline',
                title: '有效截止日期',
                sortable: true,
                class: 'deadline'
            }, {
                field: 'sjDriveCode',
                title: '准驾代码',
                sortable: true,
                class: 'sjDriveCode'
            }, {
                field: 'sjDriveType',
                title: '准驾机型',
                class: 'sjDriveType'
            }, {
                field: 'sjRemark',
                title: '批号',
                class: 'sjRemark'
            }, {
                field: 'PC',
                title: '批次',
                sortable: true,
                class: 'PC'
            }, {
                field: 'status',
                title: '证件状态',
                sortable: true,
                class: 'status'
            }, {
                field: 'yearlyCheckDate',
                title: '年鉴日期',
                sortable: true,
                class: 'yearlyCheckDate'
            }, {
                field: 'pym',
                title: '拼音码',
                class: 'pym'
            }, {
                field: 'phyTest',
                title: '体检结论',
                sortable: true,
                class: 'phyTest'
            },],
            searchAlign: 'left',
            buttonsAlign: 'left',
        });
        boundOutputExcel()
    }
}  