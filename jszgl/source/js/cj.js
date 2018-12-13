function cjInit() {
    var power = sessionGet('power');
    appendAlert(csData)
    appendImproveAlert()
    appendApplyCheck(power, csData);
    appendTJxx(csData)
    //车间年鉴体检
    $('.yearlyBanner .queryInput').keyup(function (event) {
        if (event.keyCode === 13) {
            displayYearly()
        }
    })
    $(".yearlyBanner .queryButton").off('click').on('click', function () {
        displayYearly()
    })
}
//呈现车间级完善信息
function displayYearly() {
    if (sessionGet('power') === cjPower) {
        $("#yearlyContainer .queryInfoContent img").prop('src', '')
        if ($(".yearlyBanner .queryInput").val().match(/^[0-9]{1,5}$/)) {
            var payId = $(".yearlyBanner .queryInput").val();
            payId = (Array(5).join('0') + payId).slice(-5);
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            var columns = ' archivesId,payId,uName,department,startDate,deadline,phyTest,yearlyCheckDate,cardPath,photoPath,sfzPath';
            var table = ' jbxx ';
            var db = 'jszglInfo';
            var where = ' where payId = \'' + payId + '\'';
            var order = '';
            var ajaxTimeOut = $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                timeout: 8000,
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        $('#yearlyContainer .queryInfo>div>div').css('backgroundColor', 'inherit')
                        $('#yearlyContainer .queryInfoContent').css('display', 'block')
                        $('#yearlyContainer .queryInfoContent .queryPicInfo #jszPic').prop('src', data[0]['cardPath'] ? data[0]['cardPath'] : './source/images/broken.png');
                        $('#yearlyContainer .queryInfoContent .queryPicInfo #sfzPic').prop('src', data[0]['sfzPath'] ? data[0]['sfzPath'] : './source/images/broken.png');
                        $('#yearlyContainer .queryInfoContent .queryPicInfo #photoPic1').prop('src', data[0]['photoPath'] ? data[0]['photoPath'] : './source/images/broken.png');
                        $('#yearlyContainer .queryInfoContent .queryInfo .payId').text(data[0]['payId']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .name').text(data[0]['uName']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .department').text(data[0]['department']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .yearlyCheckDateInput').val(data[0]['yearlyCheckDate']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .startDate').text(data[0]['startDate']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .deadline').text(data[0]['deadline']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .phyTest').text(data[0]['phyTest']);
                        $('#yearlyContainer .queryInfoContent .queryInfo .yearlyCheckDateInput').val(data[0]['yearlyCheckDate']);
                        $("#yearlyContainer .queryInfoContent .queryInfo input").prop('disabled', true).css('backgroundColor', 'inherit')
                        $('#uploadImage input').val('')
                        $('#uploadImage img').prop('src', './source/images/broken.png').css({ 'width': '73px', 'height': '64px' })
                        boundYearEvent(data[0])
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('您查询的信息不存在')
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
        } else {
            $("#alertModal").modal('show')
            $("#alertModal .text-warning").empty().text('请输入正确的工资号')
            $(".yearlyBanner .queryInput").focus().css('backgroundColor', '#ffcccc');
        }
    }
}
function boundYearEvent(data) {
    //体检合格
    $('.yearlyButtonBanner .phyTestOk').off('click').on('click', function () {
        if (confirm(data['uName'] + '师傅的体检结论合格，确定？')) {
            var table = ' jbxx ';
            var setStr = 'phyTest = \'' + csData['tjjl-hg']['nr2'] + '\'';
            var where = ' where payId = \'' + data['payId'] + '\'';
            $.ajax({
                url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                type: "POST",
                dataType: 'text',
                success: function (data) {
                    if (data === 'success') {
                        $('#yearlyContainer .queryInfoContent .phyTest').text(csData['tjjl-hg']['nr2'])
                    }
                }
            })
        }
    })
    //体检不合格
    $('.yearlyButtonBanner .phyTestNo').off('click').on('click', function () {
        if (confirm(data['uName'] + '师傅的体检结论不合格，确定？')) {
            var table = ' jbxx ';
            var setStr = 'phyTest = \'' + csData['tjjl-bhg']['nr2'] + '\'';
            var where = ' where payId = \'' + data['payId'] + '\'';
            $.ajax({
                url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                type: "POST",
                dataType: 'text',
                success: function (data) {
                    if (data === 'success') {
                        $('#yearlyContainer .queryInfoContent .phyTest').text(csData['tjjl-bhg']['nr2'])
                    }
                }
            })
        }
    })
    //年鉴
    $('.yearlyButtonBanner .yearlyCheck').off('click').on('click', function () {
        if ($(this).text() === '年鉴') {
            $(this).text('确定').css({
                'color': 'green',
                'fontWeight': 'bold'
            })
            var lotNumber = new Date();
            lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
            lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
            lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;
            $('#yearlyContainer .queryInfoContent .yearlyCheckDateInput').prop('disabled', false).val(lotNumber).css('backgroundColor', 'white')
        } else if (confirm(data['uName'] + '师傅的最近一次年鉴时间为' + $('#yearlyContainer .queryInfoContent .yearlyCheckDateInput').val() + '，确定？')) {
            var setDate = $('#yearlyContainer .queryInfoContent .yearlyCheckDateInput').val();
            var table = ' jbxx ';
            var setStr = 'yearlyCheckDate = \'' + setDate + '\'';
            var where = ' where payId = \'' + data['payId'] + '\'';
            $.ajax({
                url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                type: "POST",
                dataType: 'text',
                success: function (data) {
                    if (data === 'success') {
                        $('#yearlyContainer .queryInfoContent .yearlyCheckDateInput').val(setDate).prop('disabled', true).css('backgroundColor', 'inherit')
                        $('.yearlyButtonBanner .yearlyCheck').text('年鉴').css({
                            'color': '#555',
                            'fontWeight': 'normal'
                        })
                        $("#alertModal").modal('show')
                        $("#alertModal .text-success").empty().text('年鉴完成')
                    }
                }
            })

        } else {
            $('#yearlyContainer .queryInfoContent .yearlyCheckDateInput').val(data['yearlyCheckDate']).prop('disabled', true).css('backgroundColor', 'inherit')
            $('.yearlyButtonBanner .yearlyCheck').text('年鉴').css({
                'color': '#555',
                'fontWeight': 'normal'
            })
        }
    })
    $('.yearlyButtonBanner .uploadImg').off('click').on('click', function () {
        uploadImg(data['archivesId'],data['uName'],true)
    })
    
}
//车间级人员登陆时提示本车间未完善信息的人员
function appendImproveAlert() {
    var power = sessionGet('power');
    if (power === cjPower) {
        var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
        var columns = ' payId,uName,cardPath,sfzPath,photoPath';
        var where = ' where department like \'' + department + '%\' AND (cardPath = \'\' OR sfzPath = \'\' OR photoPath = \'\')';
        var table = ' jbxx ';
        var db = 'jszglInfo';
        var order = ' order by payid'
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $('#improveAlert').modal('show');
                    for (var i in data) {
                        data[i]['cardPath'] = data[i]['cardPath'] === '' ? '尚未上传' : '已上传';
                        data[i]['sfzPath'] = data[i]['sfzPath'] === '' ? '尚未上传' : '已上传';
                        data[i]['photoPath'] = data[i]['photoPath'] === '' ? '尚未上传' : '已上传';
                    }
                    var html = '<tr><th>工资号</th><th>姓名</th><th>驾驶证</th><th>身份证</th><th>电子照</th></tr>';
                    var table = $("#improveAlertTable");
                    var page = $("#improveAlertPage");
                    commonAppendToTable(table, page, data, html)
                } else {

                }
            }
        })
    }
}
//添加历史记录
function appendTJxx(csData) {
    var power = sessionGet('power');
    var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
    if (power === '1') {
        var html = '<select class="name"><option>--请选择--</option>';
        for (var i in csData) {
            if (csData[i]['lb'] === 'cjtjxx') {
                html += '<option>' + csData[i]['nr2'] + '</option>'
            }
        }
        html += '</select>';
        $("#dataBanner").empty().append(html);
        $('#dataBanner .name').off('change').on('change', function () {
            appendDataTable($(this).val(), department)
        })
    }
    function appendDataTable(name, department) {
        var table = ' bgxx ';
        var columns = '';
        var where = '';
        var order = '';
        var thText = '';
        var db = 'jszglInfo';
        if (name === '--请选择--') {

        } else if (name === csData['cjtjxx-tsjl']['nr2']) {
            //呈现提升记录表
            thText = '<tr><th>工资号</th><th>部门</th><th>日期</th><th>姓名</th><th>准驾代码</th><th>批次</th></tr>';
            columns = ' payId,department,lotNumber,uName,driveCode,PC';
            where = ' where changeType=\'' + csData['czlb-levelup2']['nr2'] + '\'';
            order = ' order by PC desc';
        } else if (name === csData['cjtjxx-zxjl']['nr2']) {
            //呈现注销记录表
            thText = '<tr><th>工资号</th><th>部门</th><th>日期</th><th>姓名</th><th>准驾代码</th><th>注销原因</th><th>操作人</th></tr>';
            columns = ' payId,department,lotNumber,uName,driveCode,changeReason,jykOperator';
            where = ' where changeType=\'' + csData['czlb-zx']['nr3'] + '\'';
            order = ' order by lotNumber desc';
        } else if (name === csData['cjtjxx-dcjl']['nr2']) {
            //呈现调出记录表
            thText = '<tr><th>工资号</th><th>部门</th><th>日期</th><th>姓名</th><th>准驾代码</th><th>操作人</th></tr>';
            columns = ' payId,department,lotNumber,uName,driveCode,jykOperator';
            where = ' where changeType=\'' + csData['czlb-dc']['nr3'] + '\'';
            order = ' order by lotNumber desc';
        } else if (name === csData['cjtjxx-drjl']['nr2']) {
            //呈现调入记录表
            thText = '<tr><th>工资号</th><th>部门</th><th>日期</th><th>姓名</th><th>准驾代码</th><th>操作人</th></tr>';
            columns = ' payId,department,lotNumber,uName,driveCode,jykOperator';
            where = ' where changeType=\'' + csData['czlb-dr']['nr3'] + '\'';
            order = ' order by lotNumber desc';
        }
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var table = $("#dataTable");
                    var page = $("#dataPage");
                    var eventFunction = '';
                    var extra = '';
                    commonAppendToTable(table, page, data, thText, extra, eventFunction)
                } else {
                    $("#alertModal").modal('show')
                    $("#alertModal .text-info").empty().text('暂无记录信息')

                }
            }
        })
    }
}
