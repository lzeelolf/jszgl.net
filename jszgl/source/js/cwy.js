function cwyInit() {
    var payId = sessionGet('payId');
    checkCardStatus(csData)
    //查询证件状态
    function checkCardStatus(csData) {
        var columns = ' uName,status ';
        var table = ' jbxx ';
        var db = 'jszglInfo';
        var where = ' where payId = \'' + payId + '\'';
        var order = '';
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $("#firstName").text(data[0]['uName'][0]);
                    $("#cardStatus").text(data[0]['status']);
                    if (data[0]['status'] === csData['zjzt-yj']['nr2'] || data[0]['status'] === csData['zjzt-gq']['nr2']) {
                        $("#cardStatus").addClass('text-error')
                        $("#alert").text('请及时换证或重新参加考试').addClass('text-error')
                    }//正常
                    else if (data[0]['status'] === csData['zjzt-zc']['nr2']) {
                        $("#cardStatus").addClass('text-success')
                    } else {
                        $("#cardStatus").addClass('text-info')
                        var columns = ' changeType,checkStatus,failedReason,needed,shortage ';
                        var table = ' bgxx ';
                        var db = 'jszglInfo';
                        var where = ' where payId = \'' + payId + '\' AND finishStatus != \'' + csData['finishStatus-ffdgr']['nr2'] + '\'';
                        var order = '';
                        $.ajax({
                            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                            type: "POST",
                            dataType: 'json',
                            success: function (data) {
                                if (data.length > 0) {
                                    var changeType = data[0]['changeType'];
                                    var checkStatus = data[0]['checkStatus'];
                                    if (checkStatus === csData['checkStatus-shwtg']['nr2']) {
                                        var d = {
                                            'use': {}
                                        };
                                        d['use'].failedReason = data[0]['failedReason'];
                                        d['use'].needed = data[0]['needed'].replace(/[,，]/ig, '<br>');
                                        d['use'].shortage = data[0]['shortage'].replace(/[,，]/ig, '<br>');
                                        $("#alert").text(changeType + '申请未通过审核').addClass('text-error');
                                        var table = $("#applyInfoTable");
                                        var page = $("#applyInfoPage");
                                        var extra = '';
                                        var thText = '<tr><th>原因</th><th>所需材料</th><th>缺少材料</th></tr>';
                                        var eventFunction = '';
                                        commonAppendToTable(table, page, d, thText, extra, eventFunction)
                                        $(table).find('tr:not(tr:lt(2))').remove()
                                    } else {
                                        var d = {
                                            'use': {}
                                        };
                                        d['use'].checkStatus = data[0]['checkStatus'];
                                        d['use'].needed = data[0]['needed'].replace(/[,，]/ig, '<br>');
                                        $("#alert").text('有一项尚未完结的' + changeType + '申请').addClass('text-info')
                                        var table = $("#applyInfoTable");
                                        var page = $("#applyInfoPage");
                                        var extra = '';
                                        var thText = '<tr><th>审核状态</th><th>所需材料</th></tr>';
                                        var eventFunction = '';
                                        commonAppendToTable(table, page, d, thText, extra, eventFunction)
                                        $(table).find('tr:not(tr:lt(2))').remove()
                                    }
                                }
                            }
                        })
                    }
                }

                /*
                else {
                    ;
                }
                */
            }
        });
    }
    $("li.statusButton").on('click', function () {
        checkCardStatus(csData);
    })
    normalUser()
    function normalUser() {
        var payId = sessionGet('payId');
        var columns = ' * ';
        var table = ' jbxx ';
        var db = 'jszglInfo';
        var where = ' where payId = \'' + payId + '\'';
        var order = '';
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            timeout:8000,
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $("#cardPicContent img").attr('src', data[0]['cardPath']);
                    $("#cardInfoContent .name").text(data[0]['UName']);
                    $("#cardInfoContent .birth").text(data[0]['birthDate']);
                    $("#cardInfoContent .startDate").text(data[0]['startdate']);
                    $("#cardInfoContent .deadline").text(data[0]['deadline']);
                    $("#cardInfoContent .sjDate").text(data[0]['sjDate']);
                    $("#cardInfoContent .driveType").text(data[0]['sjDriveCode']);
                    $("#cardInfoContent .yearlyCheckDate").text(data[0]['yearlyCheckDate']);
                    $("#cardInfoContent .idCard").text(data[0]['cardId']);
                }                
            }
        })
    }

    //点击补证按钮，生成表格，发送请求
    $("#fixButton").off('click').on('click', function () {
        if (confirm('是否确定要申请补发驾驶证？\u000d请注意，发出申请不可修改，请谨慎操作！')) {
            var payId = sessionGet('payId');
            var columns = ' payId,finishStatus,changeType';
            var table = ' bgxx ';
            var db = 'jszglInfo';
            var where = ' where payId = \'' + payId + '\' AND (finishStatus != \'' + csData['finishStatus-ffdgr']['nr2'] + '\' AND checkStatus != \'' + csData['checkStatus-shwtg']['nr2'] + '\')';
            var order = '';
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    //说明此人有待办的申请，不予新增请求
                    if (data.length > 0) {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('您还有尚未完结的' + data[0]['changeType'] + '申请,不允许重复提交')
                    } else {
                        $("#fixButton").css('display', 'none');
                        $("#yxqmButton").css('display', 'none');
                        $("#fyxqmButton").css('display', 'none');
                        $("#fixTable").css('visibility', 'visible');
                        $("#print").css('visibility', 'visible');
                        $("#applySubmit").css('visibility', 'visible');
                        $("#rightContent").css('width', '84%');
                        $(".operateContent").css('margin', 0);
                        $('#back').css('visibility', 'visible');
                        $('#back').off('click').on('click', function () {
                            if (confirm('确认返回？')) {
                                $("#fixButton").css('display', 'block');
                                $("#yxqmButton").css('display', 'block');
                                $("#fyxqmButton").css('display', 'block');
                                $("#fixTable").css('visibility', 'hidden');
                                $("#print").css('visibility', 'hidden');
                                $("#applySubmit").css('visibility', 'hidden');
                                $("#rightContent").css('width', '80%');
                                $(".operateContent").css('margin-top', '50px');
                                $('#back').css('visibility', 'hidden');
                            }
                        })
                        getUserinfo(payId, csData['czlb-bz']['name']);
                    }
                },
                beforeSend: function () {
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
    })

    //有效期满换证
    $("#yxqmButton").off('click').on('click', function () {
        var payId = sessionGet('payId');
        $("#fixButton").css('display', 'none');
        $("#yxqmButton").css('display', 'none');
        $("#fyxqmButton").css('display', 'none');
        $("#fixTable").css('visibility', 'visible');
        $("#print").css('visibility', 'visible');
        $("#applySubmit").css('visibility', 'visible');
        $("#rightContent").css('width', '84%');
        $(".operateContent").css('margin', 0);
        $('#back').css('visibility', 'visible');
        $('#back').off('click').on('click', function () {
            if (confirm('确认返回？')) {
                $("#fixButton").css('display', 'block');
                $("#yxqmButton").css('display', 'block');
                $("#fyxqmButton").css('display', 'block');
                $("#fixTable").css('visibility', 'hidden');
                $("#print").css('visibility', 'hidden');
                $("#applySubmit").css('visibility', 'hidden');
                $("#rightContent").css('width', '80%');
                $(".operateContent").css('margin-top', '50px');
                $('#back').css('visibility', 'hidden');
            }
        })
        getUserinfo(payId, csData['czlb-yxqmhz']['name']);
    })

    //非有效期满换证
    $("#fyxqmButton").off('click').on('click', function () {
        if (confirm('是否确定要申请换发驾驶证？\u000d请注意，发出申请不可修改，请谨慎操作！')) {
            var payId = sessionGet('payId');
            var columns = ' payId,finishStatus,changeType';
            var table = ' bgxx ';
            var db = 'jszglInfo';
            var where = ' where payId = \'' + payId + '\' AND (finishStatus != \'' + csData['finishStatus-ffdgr']['nr2'] + '\' AND checkStatus != \'' + csData['checkStatus-shwtg']['nr2'] + '\')';
            var order = '';
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    //说明此人有待办的申请，不予新增请求
                    if (data.length > 0) {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-warning").empty().text('您还有尚未完结的' + data[0]['changeType'] + '申请,不允许重复提交')
                    } else {
                        $("#fixButton").css('display', 'none');
                        $("#yxqmButton").css('display', 'none');
                        $("#fyxqmButton").css('display', 'none');
                        $("#fixTable").css('visibility', 'visible');
                        $("#print").css('visibility', 'visible');
                        $("#applySubmit").css('visibility', 'visible');
                        $("#rightContent").css('width', '84%');
                        $(".operateContent").css('margin', 0);
                        $('#back').css('visibility', 'visible');
                        $('#back').off('click').on('click', function () {
                            if (confirm('确认返回？')) {
                                $("#fixButton").css('display', 'block');
                                $("#yxqmButton").css('display', 'block');
                                $("#fyxqmButton").css('display', 'block');
                                $("#fixTable").css('visibility', 'hidden');
                                $("#print").css('visibility', 'hidden');
                                $("#applySubmit").css('visibility', 'hidden');
                                $("#rightContent").css('width', '80%');
                                $(".operateContent").css('margin-top', '50px');
                                $('#back').css('visibility', 'hidden');
                            }
                        })
                        getUserinfo(payId, csData['czlb-fyxqmhz']['name']);
                    }
                },
                beforeSend: function () {
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
    })

    
}