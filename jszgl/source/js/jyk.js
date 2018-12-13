function jykInit() {
    var power = sessionGet('power');
    options()
    appendEditAndLogOut(csData)
    appendAlert(csData)
    appendDrdc(csData)
    appendApplyCheck(power, csData);
    appendSummary(csData)
}
//撤回事件
function boundBackEvent() {
    $(".back").off('click').on('click', function () {
        var _this = $(this);
        var id = $(this).parent().siblings('td:first-child').text();
        var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
        var type = $(this).parent().siblings('td:nth-child(6)').text();
        if (confirm('该操作将把该驾驶证恢复到正常状态，是否确定？')) {
            //撤回操作共需三步：更新bgxx表；取jbxx表中数据，在dbsx中新增一条；更新jbxx和tjxx
            var where = ' where id =\'' + id + '\'';
            var setStr = '';
            var text = '';               //text用于update:tjxx表
            switch (type) {
                case csData['czlb-dc']['nr3']:
                    text = csData['czlb-dc']['name']
                    setStr = 'changeType =\'' + csData['czlb-chdc']['nr3'] + '\'';
                    break;
                case csData['czlb-zx']['nr3']:
                    text = _this.parent().siblings('td:nth-child(7)').text();
                    setStr = 'changeType =\'' + csData['czlb-chzx']['nr3'] + '\''
                    for (var i in csData) {
                        if (csData[i]['nr2'] === text) {
                            text = csData[i]['name'];
                        }
                    }
            }
            var columns = ' payId,archivesId,uName,department,cardId,sjDate,sjDriveCode,sex,birthDate,txrq';
            var table = ' jbxx ';
            var where = ' where archivesId = \'' + archivesId + '\'';
            var order = '';
            var db = 'jszglInfo';
            $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var payId = data[0]['payId'];
                        var archivesId = data[0]['archivesId'];
                        var birthDate = data[0]['birthDate'];
                        var cardId = data[0]['cardId'];
                        var department = data[0]['department'].split(',')[1] ? data[0]['department'].split(',')[0] : data[0]['department'];
                        var sex = data[0]['sex'];
                        var sjDate = data[0]['sjDate'];
                        var sjDriveCode = data[0]['sjDriveCode'];
                        var txrq = data[0]['txrq'];
                        var uName = data[0]['uName'];
                        var tableBgxx = ' bgxx ';
                        var setStrBgxx = setStr;
                        var whereBgxx = where;
                        var bgxxSql = 'UPDATE ' + tableBgxx + ' SET ' + setStrBgxx + whereBgxx;

                        var whereJbxx = ' where archivesId =\'' + archivesId + '\'';
                        var setStrJbxx = 'status =\'' + csData['zjzt-zc']['nr2'] + '\'';
                        var tableJbxx = ' jbxx ';
                        var jbxxSql = 'UPDATE ' + tableJbxx + ' SET ' + setStrJbxx + whereJbxx;

                        var columnStrDbsx = ' payId,archivesId,uName,birthDate,txrq,department,sjDate,sjDriveCode,type,sex,cardId';
                        var valueStrDbsx = '\'' + payId + '\',\'' + archivesId + '\',\'' + uName + '\',\'' + birthDate + '\',\'' + txrq + '\',\'' + department + '\',\'' + sjDate + '\',\'' + sjDriveCode + '\',\'' + csData['czlb-lz']['nr3'] + '\',\'' + sex + '\',\'' + cardId + '\''
                        console.log(valueStrDbsx)
                        var tableDbsx = ' dbsx ';
                        var dbsxSql = 'INSERT INTO' + tableDbsx + '(' + columnStrDbsx + ') VALUES (' + valueStrDbsx + ")";

                        $.ajax({
                            url: "./index.ashx?Method=execTran&type=" + escape(type) + "&sqlStr=" + escape(bgxxSql) + "¿" + escape(jbxxSql) + "¿" + escape(dbsxSql),
                            type: "POST",
                            dataType: 'text',
                            success: function (ret) {
                                if (ret === 'success') {
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-success").empty().text('撤回成功，' + uName + '师傅的驾驶证目前是' + csData['zjzt-zc']['nr2'] + '状态')
                                    _this.remove()
                                }
                            }
                        })
                    }

                }
            })
        }
    })
}

//调入调出
function appendDrdc(csData) {
    var columns = ' payId,archivesId,uName,department,cardId';
    var table = 'dbsx';
    var where = ' where type = \'' + csData['czlb-lz']['nr3'] + '\'';
    var order = ' ';
    var db = 'jszglInfo';
    $.ajax({
        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
        type: "POST",
        dataType: 'json',
        success: function (ret) {
            if (ret.length > 0) {
                $('#quit .redPoint').css('display', 'block');
                $('.drdcButton .redPoint').css('display', 'block');
                var table = $("#appendLZTable");
                var page = $("#drdcPage");
                var extra = '<td><span class="dc">调出</span><span class="tx">退休</span></td>';
                var thText = '<tr><th>工资号</th><th style="display:none">档案号</th><th>姓名</th><th>部门</th><th>身份证号</th><th>操作</th></tr>';
                var eventFunction = '';
                commonAppendToTable(table, page, ret, thText, extra, eventFunction)
                //调出
                $('#appendLZTable .dc').off('click').on('click', function () {
                    if (confirm('请在确认该职工已调出后进行本操作！')) {
                        var _this = $(this);
                        var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
                        var columns = ' uName,department,sjDriveCode';
                        var where = ' where archivesId =\'' + archivesId + '\'';
                        var order = ' ';
                        var table = ' jbxx ';
                        var db = 'jszglInfo';
                        $.ajax({
                            url: "./index.ashx?Method=select&columns=" + columns + "&table=" + table + "&where=" + where + "&order=" + order + "&db=" + db,
                            type: "POST",
                            dataType: 'json',
                            success: function (data) {
                                if (data.length > 0) {
                                    var uName = data[0]['uName'];
                                    if (data[0]['department'].split(',').length > 1) {
                                        var department = data[0]['department'].split(',')[0];
                                    } else {
                                        var department = data[0]['department'] ? data[0]['department'] : '';
                                    }
                                    var sjDriveCode = data[0]['sjDriveCode'];
                                    //update jbxx,insert bgxx,delete dbsx
                                    var setStrJbxx = 'status =\'' + csData['zjzt-dc']['nr2'] + '\'';
                                    var whereJbxx = ' where archivesId =\'' + archivesId + '\'';
                                    var tableJbxx = 'jbxx';
                                    var jbxxSql = 'UPDATE ' + tableJbxx + ' SET ' + setStrJbxx + whereJbxx;

                                    var lotNumber = new Date();
                                    lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
                                    lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
                                    lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;

                                    var tableBgxx = 'bgxx';
                                    var columnStrBgxx = 'lotNumber,archivesId,UName,department,changeType,driveCode,drive,jykOperator';
                                    var valueStrBgxx = '\'' + lotNumber + '\',\'' + archivesId + '\',\'' + uName + '\',\'' + department + '\',\'' + csData['czlb-dc']['nr3'] + '\',\'' + sjDriveCode + '\',\'' + csData['zjlx-' + sjDriveCode]['nr1'] + '\',\'' + sessionGet('user') + '\'';
                                    var bgxxSql = 'INSERT INTO ' + tableBgxx + ' (' + columnStrBgxx + ') VALUES (' + valueStrBgxx + ')';

                                    var tableDbsx = 'dbsx';
                                    var whereDbsx = ' where archivesId = \'' + archivesId + '\' and type = \'' + csData['czlb-lz']['nr3'] + '\'';
                                    var dbsxSql = 'DELETE FROM ' + tableDbsx + whereDbsx;
                                    var type = '调出'
                                    $.ajax({
                                        url: "./index.ashx?Method=execTran&type=" + type + "&sqlStr=" + jbxxSql + "¿" + bgxxSql + "¿" + dbsxSql,
                                        type: "POST",
                                        dataType: 'text',
                                        success: function (ret) {
                                            if (ret === 'success') {
                                                _this.siblings('.tx').remove();
                                                _this.remove();
                                                $("#alertModal").modal('show')
                                                $("#alertModal .text-success").empty().text('操作成功。该证件的状态目前为：' + csData['zjzt-dc']['nr2'])
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
                //退休
                $('#appendLZTable .tx').off('click').on('click', function () {
                    if (confirm('请在确认该职工已退休后进行本操作！')) {
                        var _this = $(this);
                        var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
                        var columns = ' uName,department,sjDriveCode';
                        var where = ' where archivesId =\'' + archivesId + '\'';
                        var order = ' ';
                        var table = ' jbxx ';
                        var db = 'jszglInfo';
                        $.ajax({
                            url: "./index.ashx?Method=select&columns=" + columns + "&table=" + table + "&where=" + where + "&order=" + order + "&db=" + db,
                            type: "POST",
                            dataType: 'json',
                            success: function (data) {
                                if (data.length > 0) {
                                    var uName = data[0]['uName'];
                                    if (data[0]['department'].split(',').length > 1) {
                                        var department = data[0]['department'].split(',')[0];
                                    } else {
                                        var department = data[0]['department'] ? data[0]['department'] : '';
                                    }
                                    var sjDriveCode = data[0]['sjDriveCode'];
                                    //update jbxx,insert bgxx,delete dbsx
                                    var setStrJbxx = 'status =\'' + csData['zjzt-zx']['nr2'] + '\'';
                                    var whereJbxx = ' where archivesId =\'' + archivesId + '\'';
                                    var tableJbxx = 'jbxx';
                                    var jbxxSql = 'UPDATE ' + tableJbxx + ' SET ' + setStrJbxx + whereJbxx;

                                    var lotNumber = new Date();
                                    lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
                                    lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
                                    lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;

                                    var tableBgxx = 'bgxx';
                                    var columnStrBgxx = 'lotNumber,archivesId,UName,department,changeType,changeReason,driveCode,drive,jykOperator';
                                    var valueStrBgxx = '\'' + lotNumber + '\',\'' + archivesId + '\',\'' + uName + '\',\'' + department + '\',\'' + csData['czlb-zx']['nr3'] + '\',\'' + csData['zxyy-tx']['nr2'] + '\',\'' + sjDriveCode + '\',\'' + csData['zjlx-' + sjDriveCode]['nr1'] + '\',\'' + sessionGet('user') + '\'';
                                    var bgxxSql = 'INSERT INTO ' + tableBgxx + ' (' + columnStrBgxx + ') VALUES (' + valueStrBgxx + ')';

                                    var tableDbsx = 'dbsx';
                                    var whereDbsx = ' where archivesId = \'' + archivesId + '\' and type = \'' + csData['czlb-lz']['nr3'] + '\'';
                                    var dbsxSql = 'DELETE FROM ' + tableDbsx + whereDbsx;
                                    var type = '退休'
                                    $.ajax({
                                        url: "./index.ashx?Method=execTran&type=" + type + "&sqlStr=" + jbxxSql + "¿" + bgxxSql + "¿" + dbsxSql,
                                        type: "POST",
                                        dataType: 'text',
                                        success: function (ret) {
                                            if (ret === 'success') {
                                                _this.siblings('.dc').remove();
                                                _this.remove();
                                                $("#alertModal").modal('show')
                                                $("#alertModal .text-success").empty().text('操作成功。该证件的状态目前为：' + csData['zjzt-zx']['nr2'])
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            } else {
                $('#appendLZTable').empty()
                $(".quitContent").empty().text('暂无待办信息');
                $("#quit .redPoint").remove()
            }
        }
    })
    var column = ' payId,archivesId,uName,department,cardId,phone'
    var where1 = ' where type = \'' + csData['czlb-dr']['nr3'] + '\''
    $.ajax({
        url: "./index.ashx?Method=select&columns=" + escape(column) + "&table=" + escape(table) + "&where=" + escape(where1) + "&order=" + escape(order) + "&db=" + escape(db),
        type: "POST",
        timeout: 8000,
        dataType: 'json',
        success: function (ret) {
            if (ret.length > 0) {
                $('#dr .redPoint').css('display', 'block');
                $('.drdcButton .redPoint').css('display', 'block');
                //同步数据库按钮,这里要改成webservice  18/11/21    待办锚点1
                $("#drContent #updateDr").off('click').on('click', function () {
                    if (confirm('请注意，该功能请不要频繁使用')) {
                        location.reload();
                    }
                })
                var table = $("#appendDRTable");
                var page = $("#drdcPage");
                var extra = '<td><a href="#drInfo" class="dr" data-toggle="modal" role="button">调入</a><span class="tz">短信通知</span></td>';
                var thText = '<tr><th>工资号</th><th style="display:none">档案号</th><th>姓名</th><th>部门</th><th>身份证号</th><th>电话号码</th><th>操作</th></tr>';
                var eventFunction = '';
                commonAppendToTable(table, page, ret, thText, extra, eventFunction)
                //调入短信通知
                $('#appendDRTable .tz').off('click').on('click', function () {
                    var uName = $(this).parent().siblings('td:nth-child(3)').text();
                    var _this = $(this);
                    if (confirm('将向' + uName + '师傅发送短信，提醒他来登记驾驶证')) {
                        var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
                        tzEvent(csData, csData['czlb-dr']['name'], archivesId, _this)
                    }
                })
                //调入：填写驾驶证信息，添加入系统
                $('#appendDRTable .dr').off('click').on('click', function () {
                    var _this = $(this);
                    var archivesId = $(this).parent().siblings('td:nth-child(2)').text();
                    var columns = ' payId,uName,sex,department,cardId,birthDate,txrq,pym';
                    var table = 'userinfo1';
                    var where = ' where archivesId=\'' + archivesId + '\'';
                    var order = '';
                    var db = 'baseInfo';
                    $('#drInfo .sjDateInput').val('')
                    $('#drInfo .sjDriveCodeInput').val('')
                    $('#drInfo .startDateInput').val('')
                    $('#drInfo .deadlineInput').val('')
                    $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                        type: "POST",
                        dataType: 'json',
                        success: function (dataR) {
                            if (dataR[0]['department'].split(',').length > 1) {
                                var department = dataR[0]['department'].split(',')[0];
                            } else {
                                var department = dataR[0]['department'] ? dataR[0]['department'] : '';
                            }
                            $('#drInfo .payId').val(dataR[0]['payId'])
                            $('#drInfo .name').val(dataR[0]['uName'])
                            $('#drInfo .sex').val(dataR[0]['sex'])
                            $('#drInfo .department').val(department)
                            $('#drInfo .cardId').val(dataR[0]['cardId'])
                            $('#drInfo .birthDate').val(dataR[0]['birthDate'])
                            $('#drInfo .txrq').val(dataR[0]['txrq'])
                            $('#drInfo .pym').val(dataR[0]['pym'])
                            $('#drInfo .modal-footer .btn-primary').off('click').on('click', function () {
                                var arr = [];
                                var j = 0;
                                for (var i in csData) {
                                    if (csData[i]['lb'] === 'zjlx') {
                                        arr[j] = csData[i]['name'];
                                        j++;
                                    }
                                }
                                var columns = ' *';
                                var table = ' jbxx';
                                var where = ' where archivesId=\'' + archivesId + '\'';
                                var order = ' ';
                                var db = 'jszglInfo';
                                $.ajax({
                                    url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                                    type: "POST",
                                    dataType: 'json',
                                    success: function (ret) {
                                        if (ret.length > 0) {
                                            $("#drInfo").modal('hide')
                                            $("#alertModal").modal('show')
                                            $("#alertModal .text-warning").empty().text('人员重复，请不要重复操作')
                                        } else {
                                            if ($('#drInfo .sjDateInput').val().match(/^\d{4}-\d{2}-\d{2}$/)) {
                                                if (checkIfInArray($('#drInfo .sjDriveCodeInput').val(), arr)) {
                                                    if ($('#drInfo .startDateInput').val().match(/^\d{4}-\d{2}-\d{2}$/)) {
                                                        if ($('#drInfo .deadlineInput').val().match(/^\d{4}-\d{2}-\d{2}$/)) {
                                                            if (confirm('请确认信息无误，确定后将把该驾驶证插入数据库')) {
                                                                //插入jbxx，插入bgxx，更新tjxx，删除dbsx
                                                                $('#drInfo input').css('backgroundColor', 'white');
                                                                var sjDriveType = csData['zjlx-' + $('#drInfo .sjDriveCodeInput').val()]['nr1']
                                                                var columnStrJbxx = "PayId,ArchivesId,UName,BirthDate,Txrq,Department,sjDate,sjDriveCode,sjDriveType,status,deadline,startDate,sex,cardId,pym";
                                                                var valueStrJbxx = '\'' + $("#drInfo .payId").val() + '\',\'' + archivesId + '\',\'' + $("#drInfo .name").val() + '\',\'' + $("#drInfo .birthDate").val() + '\',\'' + $("#drInfo .txrq").val() + '\',\'' + $("#drInfo .department").val() + '\',\'' + $('#drInfo .sjDateInput').val() + '\',\'' + $('#drInfo .sjDriveCodeInput').val() + '\',\'' + sjDriveType + '\',\'' + csData['zjzt-zc']['nr2'] + '\',\'' + $('#drInfo .deadlineInput').val() + '\',\'' + $('#drInfo .startDateInput').val() + '\',\'' + $("#drInfo .sex").val() + '\',\'' + $("#drInfo .cardId").val() + '\',\'' + $("#drInfo .pym").val() + '\'';
                                                                var tableJbxx = "jbxx";
                                                                var jbxxSql = 'INSERT INTO ' + tableJbxx + ' (' + columnStrJbxx + ') VALUES (' + valueStrJbxx + ')';
                                                                var date = new Date();
                                                                var year = date.getFullYear()
                                                                var lotNumber = new Date();
                                                                lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
                                                                lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
                                                                lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;
                                                                var columnStrBgxx = "lotNumber,Department,payId,archivesId,UName,changeType,driveCode,drive,jykOperator";
                                                                var valueStrBgxx = '\'' + lotNumber + '\',\'' + $("#drInfo .department").val() + '\',\'' + $("#drInfo .payId").val() + '\',\'' + archivesId + '\',\'' + $("#drInfo .name").val() + '\',\'' + csData['czlb-dr']['nr3'] + '\',\'' + $('#drInfo .sjDriveCodeInput').val() + '\',\'' + sjDriveType + '\',\'' + sessionGet('user') + '\''
                                                                var tableBgxx = "bgxx";
                                                                var bgxxSql = 'INSERT INTO ' + tableBgxx + ' (' + columnStrBgxx + ') VALUES (' + valueStrBgxx + ')';

                                                                var tableDbsx = 'dbsx';
                                                                var whereDbsx = ' where archivesId = \'' + archivesId + '\' and type=\'' + csData['czlb-dr']['nr3'] + '\''
                                                                var dbsxSql = 'DELETE FROM ' + tableDbsx + whereDbsx
                                                                var type = '调入';
                                                                var ajaxTimeOut = $.ajax({
                                                                    url: "./index.ashx?Method=execTran&type=" + type + "&sqlStr=" + jbxxSql + "¿" + bgxxSql + "¿" + dbsxSql,
                                                                    type: "POST",
                                                                    timeout: 8000,
                                                                    dataType: 'text',
                                                                    success: function (ret) {
                                                                        console.log(ret)
                                                                        if (ret === "success") {
                                                                            $("#alertModal").modal('show')
                                                                            $("#alertModal .text-success").empty().text('操作已成功')
                                                                        } else {
                                                                            $("#alertModal").modal('show')
                                                                            $("#alertModal .text-error").empty().text('操作失败')
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
                                                                $('#drInfo').modal('hide')
                                                            }
                                                        } else {
                                                            $("#alertModal").modal('show')
                                                            $("#alertModal .text-error").empty().text('有效截止日期格式不正确，应为"xxxx-xx-xx"')
                                                            $('#drInfo input').css('backgroundColor', 'white')
                                                            $('#drInfo .deadlineInput').css('backgroundColor', '#ffcccc').focus()
                                                        }
                                                    } else {
                                                        $("#alertModal").modal('show')
                                                        $("#alertModal .text-error").empty().text('有效起始日期格式不正确，应为"xxxx-xx-xx"')
                                                        $('#drInfo input').css('backgroundColor', 'white')
                                                        $('#drInfo .startDateInput').css('backgroundColor', '#ffcccc').focus()
                                                    }
                                                } else {
                                                    $("#alertModal").modal('show')
                                                    $("#alertModal .text-error").empty().text('准驾类型代码输入不正确')
                                                    $('#drInfo input').css('backgroundColor', 'white')
                                                    $('#drInfo .sjDriveCodeInput').css('backgroundColor', '#ffcccc').focus()
                                                }
                                            } else {
                                                $("#alertModal").modal('show')
                                                $("#alertModal .text-error").empty().text('初次领证日期格式不正确，应为"xxxx-xx-xx"')
                                                $('#drInfo input').css('backgroundColor', 'white')
                                                $('#drInfo .sjDateInput').css('backgroundColor', '#ffcccc').focus()
                                            }
                                        }
                                    }
                                })
                            })
                        }
                    })

                })

            } else {
                $('#appendDRTable').empty()
                $(".appendContent p").empty().append('暂无调入信息');
                $("#dr .redPoint").remove()
            }

        }
    })
    //激活标签页
    $('#appendBanner a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    $('a[href="#quitContent"]').on('shown', function (e) {
        $("#drdcPage").css('display', 'none')
        $(this).find(".redPoint").remove()
    })
    $('a[href="#drContent"]').on('shown', function (e) {
        $("#drdcPage").css('display', 'none')
        $(this).find(".redPoint").remove()
    })
    $('a[href="#drHistoryContent"]').on('shown', function (e) {
        $("#drdcPage").css('display', 'none')
        var table = $('#appendDRHistoryTable');
        var page = $('#drdcPage');
        appendDRHistory(table, page)
    })
    $('a[href="#dcHistoryContent"]').on('shown', function (e) {
        $("#drdcPage").css('display', 'none')
        var table = $('#appendDCHistoryTable');
        var page = $('#drdcPage');
        appendDCHistory(table, page)
    })
    //调出记录表
    function appendDCHistory(target, page) {
        var power = sessionGet('power');
        var obj = {};
        obj.column = ' id,archivesId,department,lotNumber,UName,changeType,jykOperator';
        obj.order = ' order by lotNumber desc';
        if (power === '1') {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            obj.where = ' where department like \'' + department + '%\' AND changeType =\'' + csData['czlb-dc']['nr2'] + '\'';
            appendDCHistoryTable(obj, target, page)
        }
        if (power === jykPower) {
            obj.where = ' where changeType =\'' + csData['czlb-dc']['nr2'] + '\'';
            appendDCHistoryTable(obj, target, page)
            var html = '<label for="dcHistorySelect">选择部门：</label><select name="" id="dcHistorySelect"><option>全段</option>';
            for (var i in csData) {
                if (csData[i]['lb'] === 'ssbm') {
                    html += '<option>' + csData[i]['nr1'] + '</option>'
                }
            }
            html += '</select>';
            $(target).prev().empty().append(html);
            $('#dcHistorySelect').off('change').on('change', function () {
                if ($(this).val() === '全段') {
                    obj.where = ' where changeType =\'' + csData['czlb-dc']['nr2'] + '\'';
                    appendDCHistoryTable(obj, target, page)
                } else {
                    var department = $(this).val()
                    obj.where = ' where department like \'' + department + '%\' AND changeType =\'' + csData['czlb-dc']['nr2'] + '\'';
                    appendDCHistoryTable(obj, target, page)
                }
            })
        }
        function appendDCHistoryTable(obj, target, page) {
            var columns = obj.column;
            var table = ' bgxx ';
            var where = obj.where
            var order = obj.order;
            var db = 'jszglInfo';
            $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var thText = '<tr><th>id</th><th>archivesId</th><th>部门</th><th>日期</th><th>姓名</th><th>操作类别</th><th>教育科经办人</th><th>操作</th></tr>';
                        var eventFunction = boundBackEvent;
                        var extra = '<td><span class="back">撤回</span></td>';
                        commonAppendToTable(target, page, data, thText, extra, eventFunction)
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无调出记录')
                    }
                }
            })
        }
    }
    //调入记录表
    function appendDRHistory(target, page) {
        var power = sessionGet('power');
        var obj = {};
        obj.column = ' payId,department,lotNumber,UName,changeType,jykOperator';
        obj.order = ' order by lotNumber desc';
        if (power === '1') {
            var department = sessionGet('department').split(',')[1] ? sessionGet('department').split(',')[0] : sessionGet('department');
            obj.where = ' where department like \'' + department + '%\' AND changeType =\'' + csData['czlb-dr']['nr2'] + '\'';
            appendDRHistoryTable(obj, target, page)
        }
        if (power === jykPower) {
            obj.where = ' where changeType =\'' + csData['czlb-dr']['nr2'] + '\'';
            appendDRHistoryTable(obj, target, page)
            var html = '<label for="drHistorySelect">选择部门：</label><select name="" id="drHistorySelect"><option>全段</option>';
            for (var i in csData) {
                if (csData[i]['lb'] === 'ssbm') {
                    html += '<option>' + csData[i]['nr1'] + '</option>'
                }
            }
            html += '</select>';
            $(target).prev().empty().append(html);
            $('#drHistorySelect').off('change').on('change', function () {
                if ($(this).val() === '全段') {
                    obj.where = ' where changeType =\'' + csData['czlb-dr']['nr2'] + '\'';
                    appendDRHistoryTable(obj, target, page)
                } else {
                    var department = $(this).val()
                    obj.where = ' where department like \'' + department + '%\' AND changeType =\'' + csData['czlb-dr']['nr2'] + '\'';
                    appendDRHistoryTable(obj, target, page)
                }
            })
        }
        function appendDRHistoryTable(obj, target, page) {
            var columns = obj.column;
            var table = ' bgxx ';
            var where = obj.where
            var order = obj.order;
            var db = 'jszglInfo';
            $.ajax({
                url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        var thText = '<tr><th>工资号</th><th>部门</th><th>日期</th><th>姓名</th><th>操作类别</th><th>教育科经办人</th></tr>';
                        var eventFunction = '';
                        var extra = '';
                        commonAppendToTable(target, page, data, thText, extra, eventFunction)
                    } else {
                        $("#alertModal").modal('show')
                        $("#alertModal .text-info").empty().text('暂无调入记录')
                    }
                }
            })
        }
    }
}

//添加新增证件功能(人员提升标签)
function appendAppend(csData) {
    function boundAppendEvent(data, csData) {
        //data是原始数据
        $('.buttonBanner .float:eq(0)').off('click').on('click', function () {
            $('.uploadExcelContent').css('display', 'block').siblings('.content').css('display', 'none')
            $('.buttonBanner .float:eq(0)').css({ 'background': 'green', 'color': 'white', 'fontWeight': 'bold' })
            $('.buttonBanner .float:eq(1)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $('.buttonBanner .float:eq(2)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $("#appendPage").css('visibility', 'hidden')
        })
        $('.buttonBanner .float:eq(1)').off('click').on('click', function () {
            $('.levelUpTableContent').css('display', 'block').siblings('.content').css('display', 'none')
            $('.buttonBanner .float:eq(1)').css({ 'background': 'green', 'color': 'white', 'fontWeight': 'bold' })
            $('.buttonBanner .float:eq(0)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $('.buttonBanner .float:eq(2)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $("#appendPage").css('visibility', 'visible')
        })
        //查看批次历史记录
        $('.buttonBanner .float:eq(2)').off('click').on('click', function () {
            $('.checkWithPCContent').css('display', 'block').siblings('.content').css('display', 'none')
            $('.buttonBanner .float:eq(2)').css({ 'background': 'green', 'color': 'white', 'fontWeight': 'bold' })
            $('.buttonBanner .float:eq(0)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $('.buttonBanner .float:eq(1)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
            $("#appendPage").css('visibility', 'hidden')
            $.ajax({
                url: "../../../ways.php",
                type: "POST",
                data: {
                    funcName: 'select',
                    serverName: '10.101.62.73',
                    uid: 'sa',
                    pwd: '2huj15h1',
                    Database: 'JSZGL',
                    tableName: ' bgxx ',
                    column: ' distinct pc from dbsx union select distinct pc ',
                    where: ' ',
                    order: ' '
                },
                dataType: 'json',
                success: function (d) {
                    var html = '';
                    delete d['count']
                    delete d['success']
                    for (var i in d) {
                        if (d[i]['pc']) {
                            html += '<option>' + d[i]['pc'] + '</option>';
                        }
                    }
                    $('#checkWithPCSelect').empty().append(html);
                    $('.checkWithPCContent .control-group .btn').off('click').on('click', function () {
                        if ($("#checkWithPCSelect option:selected").val()) {
                            var where = ' where PC =\'' + $("#checkWithPCSelect option:selected").val() + '\''
                            var columnBGXX = ' PC,archivesId,uName,department,lotnumber';
                            var columnDBSX = ' PC,archivesId,uName,department'
                            $.ajax({
                                url: "../../../ways.php",
                                type: "POST",
                                async: false,
                                data: {
                                    funcName: 'select',
                                    serverName: '10.101.62.73',
                                    uid: 'sa',
                                    pwd: '2huj15h1',
                                    Database: 'JSZGL',
                                    tableName: ' dbsx ',
                                    column: columnDBSX,
                                    where: where,
                                    order: ' '
                                },
                                dataType: 'json',
                                success: function (data) {
                                    $.ajax({
                                        url: "../../../ways.php",
                                        type: "POST",
                                        data: {
                                            funcName: 'select',
                                            serverName: '10.101.62.73',
                                            uid: 'sa',
                                            pwd: '2huj15h1',
                                            Database: 'JSZGL',
                                            tableName: ' bgxx ',
                                            column: columnBGXX,
                                            where: where,
                                            order: ' '
                                        },
                                        dataType: 'json',
                                        success: function (ret) {
                                            var passNum = ret['count'] ? ret['count'] : 0;
                                            var notPassNum = data['count'] ? data['count'] : 0;
                                            var totalNum = passNum + notPassNum;
                                            delete data['count']
                                            delete data['sql']
                                            delete data['success']
                                            delete ret['count']
                                            delete ret['sql']
                                            delete ret['success']
                                            var p = $("#checkWithPCSelect option:selected").val() + '，共：' + totalNum + '人,已通过：' + passNum + '人，尚未通过：' + notPassNum + '人';
                                            $('.checkWithPCContent .pcStatus').empty().text(p)
                                            var big = [];
                                            for (var i in data) {
                                                data[i].lotNumber = '';
                                                data[i].status = '尚未通过';
                                                big.push(data[i])
                                            }
                                            for (var m in ret) {
                                                ret[m].status = '已通过'
                                                big.push(ret[m])
                                            }

                                            var table = $("#checkWithPCTable");
                                            var page = $("#checkWithPCPage");
                                            var extra = '';
                                            var thText = '<tr><th>批次</th><th>档案号</th><th>姓名</th><th>部门</th><th>通过时间</th><th>状态</th></tr>';
                                            var eventFunction = '';
                                            commonAppendToTable(table, page, big, thText, extra, eventFunction)
                                        }
                                    })
                                }
                            })
                        } else {
                            $("#alertModal").modal('show')
                            $("#alertModal .text-error").empty().text('请选择批次')
                        }
                    })
                }
            })
        })

        //上传按钮事件，上传具提升司机资格名单
        $(".uploadExcelContent .confirmUpload").off('click').on('click', function () {
            //设置这一批的批次名
            var year = new Date();
            year = year.getFullYear();
            var html = '';
            html += '<option>' + (year - 1) + '</option>';
            html += '<option selected>' + year + '</option>';
            html += '<option>' + (year + 1) + '</option>';
            $("#year").empty().append(html);
            html = '<option selected>1</option>';
            html += '<option>2</option>';
            $("#PCselect").empty().append(html);
            $('#selectPC').modal('show');
            $("#uploadContent tbody tr td").css('background', 'inherit')
            var uploadArr = [];
            var driveTypeArr = [];
            //取准驾机型
            for (var i in csData) {
                if (csData[i]['lb'] === 'zjlx') {
                    driveTypeArr.push(csData[i]['name'])
                }
            }
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;      //身份证正则
            var done = 0;
            //提交按钮
            $("#selectPC .btn-primary").off('click').on('click', function () {
                //逻辑：大名单中的信息在bigArr中，拿小名单中的cardId去比对，比对成功就把信息
                //合并，然后再一起循环发ajax请求新增dbsx
                var flag = true;
                var PC = $('#selectPC #year option:selected').val() + '年第' + $('#selectPC #PCselect option:selected').val() + '批';
                $.each($('#uploadContent table tbody tr'), function (i, val) {
                    var obj = {}
                    obj.uName = $(val).find('.uName').val()
                    obj.sex = $(val).find('.sex').val()
                    if (reg.test($(val).find('.cardId').val())) {
                        obj.cardId = $(val).find('.cardId').val()
                    } else {
                        $(val).find('td').css('background', '#ffcccc')
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('第' + $(val).find('.number').val() + '条身份证号错误')
                        flag = false;
                        return false;
                    }
                    if ($(val).find('.phone').val().match((/^[0-9]{11}$/))) {
                        obj.phone = $(val).find('.phone').val()
                    } else {
                        $(val).find('td').css('background', '#ffcccc')
                        $("#alertModal").modal('show')
                        $("#alertModal .text-error").empty().text('第' + $(val).find('.number').val() + '条电话号码错误')
                        flag = false;
                        return false;
                    }
                    //处理小名单中的准驾类型
                    for (var j = 0; j < driveTypeArr.length; j++) {
                        var reg1 = new RegExp(driveTypeArr[j]);
                        if (reg1.exec($(val).find('.applyType').val())) {
                            obj.sjDriveCode = reg1.exec($(val).find('.applyType').val())[0];
                        }
                    }
                    //比对：身份证号相同并且（名字第一个字或最后一个字相同），然后补全档案号
                    for (var m = 0; m < bigArr.length; m++) {
                        if (obj.cardId === bigArr[m]['cardId'] && (obj.uName[0] === bigArr[m]['uName'][0] || obj.uName[obj.uName.length] === bigArr[m]['uName'][bigArr[m]['uName'].length - 1])) {
                            if (bigArr[m]['archivesId'].match(/^[0-9]{5}$/)) {
                                obj.archivesId = bigArr[m]['archivesId'];
                            } else if (bigArr[m]['archivesId'].match(/^[0-9]{4}$/)) {
                                obj.archivesId = '0' + bigArr[m]['archivesId'];
                            } else if (bigArr[m]['archivesId'].match(/^[0-9]{3}$/)) {
                                obj.archivesId = '00' + bigArr[m]['archivesId'];
                            } else if (bigArr[m]['archivesId'].match(/^[0-9]{2}$/)) {
                                obj.archivesId = '000' + bigArr[m]['archivesId'];
                            } else if (bigArr[m]['archivesId'].match(/^[0-9]{1}$/)) {
                                obj.archivesId = '0000' + bigArr[m]['archivesId'];
                            }
                            break;
                        }
                    }
                    uploadArr[i] = Object.assign(obj);
                })
                for (var m = 0; m < uploadArr.length; m++) {
                    if (!uploadArr[m].archivesId) {
                        //如果没有档案号，说明该条用身份证在两个名单没比对成功（有可能是打错身份证）
                        //还有一种原因：教育科说报名以车间报的为准，劳人科的名单只作参考。所以小名单中
                        //的身份证在大名单中找不到。
                        //那么就用身份证号去62库中比对，但是62表中身份证有错，所以加一层出生日期校验
                        $.ajax({
                            url: "../../../ways.php",
                            type: "POST",
                            async: false,
                            data: {
                                funcName: 'select',
                                serverName: '10.101.62.62',
                                uid: 'sa',
                                pwd: '2huj15h1',
                                Database: 'userinfo',
                                tableName: ' userinfo1 ',
                                column: ' archivesId',
                                where: ' where cardId = \'' + uploadArr[m]['cardId'] + '\' AND charindex(substring(birthdate,1,4)+substring(birthdate,6,2)+substring(birthdate,9,2),cardid) =7',
                                order: ' '
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data['success'] === 1 && data['count'] === 1) {
                                    uploadArr[m]['archivesId'] = data['row1']['archivesId'];
                                }
                            }
                        })
                    }
                }
                //回调函数再次检验uploadArr，这时候如果还有没有档案号的数据，那只能用户输入了
                //为了防止错误，输入后还要去62库比对一下，如果身份证、姓名、电话能对上一种，就予通过

                testUploadArr(uploadArr, csData);
                function testUploadArr(uploadArr, csData) {
                    var flag1 = true;
                    for (var n = 0; n < uploadArr.length; n++) {
                        if (!uploadArr[n].archivesId) {
                            flag1 = false;
                            $("#selectPC").modal('toggle')
                            $("#inputArchivesId").modal('toggle')
                            $("#inputArchivesIdName").text(uploadArr[n]['uName'])
                            $("#inputArchivesId .btn-primary").off('click').on('click', function () {
                                if ($('#inputArchivesIdInput').val().match(/^[0-9]{5}$/)) {
                                    $.ajax({
                                        url: "../../../ways.php",
                                        type: "POST",
                                        async: false,
                                        data: {
                                            funcName: 'select',
                                            serverName: '10.101.62.62',
                                            uid: 'sa',
                                            pwd: '2huj15h1',
                                            Database: 'userinfo',
                                            tableName: ' userinfo1 ',
                                            column: ' cardId,uName,phone1',
                                            where: ' where archivesId = \'' + $('#inputArchivesIdInput').val() + '\'',
                                            order: ' '
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            if (data['success'] === 1 && data['count'] === 1) {
                                                //身份证，姓名，电话号码匹配一项即可
                                                if (data['row1']['cardId'] === uploadArr[n]['cardId'] || data['row1']['uName'] === uploadArr[n]['uName'] || data['row1']['phone1'] === uploadArr[n]['phone']) {
                                                    uploadArr[n]['archivesId'] = $('#inputArchivesIdInput').val();
                                                    $("#inputArchivesId").modal('toggle')
                                                    $("#selectPC").modal('toggle')
                                                    testUploadArr(uploadArr)
                                                } else {
                                                    $("#alertModal").modal('show')
                                                    $("#alertModal .text-error").empty().text('档案号输入错误')
                                                }
                                            } else {
                                                $("#alertModal").modal('show')
                                                $("#alertModal .text-error").empty().text('档案号输入错误')
                                            }
                                        }
                                    })
                                } else {
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-error").empty().text('档案号格式错误')
                                }
                            })
                            break;
                        }
                    }
                    if (flag1) {
                        //没有无档案号的数据了，开始新增dbsx表数据
                        //先去62表中取部门和payId，比对逻辑是档案号加姓名首字或末字（防止之前大名单中有错）
                        $(".uploadExcelContent .progressBar").css('display', 'block')
                        $('#selectPC').modal('hide')
                        var payId = '';
                        var archivesId = '';
                        var uName = '';
                        var department = '';
                        var cardId = '';
                        var type = csData['czlb-levelup2']['nr2']
                        var phone = '';
                        var sjDriveCode = '';
                        var sex = '';
                        var birthDate = '';
                        var txrq = '';
                        for (var i = 0; i < uploadArr.length; i++) {
                            $.ajax({
                                url: "../../../ways.php",
                                type: "POST",
                                async: false,
                                data: {
                                    funcName: 'select',
                                    serverName: '10.101.62.62',
                                    uid: 'sa',
                                    pwd: '2huj15h1',
                                    Database: 'userinfo',
                                    tableName: ' userinfo1 ',
                                    column: ' payId,department,birthDate,txrq',
                                    where: ' where archivesId = \'' + uploadArr[i]['archivesId'] + '\' AND (substring(uName,1,1) =\'' + uploadArr[i]['uName'][0] + '\' OR substring(uName,LEN(uName),1)=\'' + uploadArr[i]['uName'][uploadArr[i]['uName'].length - 1] + '\')',
                                    order: ' '
                                },
                                dataType: 'json',
                                success: function (data) {
                                    if (data['success'] === 1 && data['count'] === 1) {
                                        uName = uploadArr[i]['uName'];
                                        phone = uploadArr[i]['phone'];
                                        cardId = uploadArr[i]['cardId'];
                                        archivesId = uploadArr[i]['archivesId'];
                                        sjDriveCode = uploadArr[i]['sjDriveCode'];
                                        sex = uploadArr[i]['sex'];
                                        payId = data['row1']['payId'] ? data['row1']['payId'] : '';
                                        birthDate = data['row1']['birthDate'] ? data['row1']['birthDate'] : '';
                                        txrq = data['row1']['txrq'] ? data['row1']['txrq'] : '';
                                        if (data['row1']['department'].split(',').length > 1) {
                                            department = data['row1']['department'].split(',')[0];
                                        } else {
                                            department = data['row1']['department'] ? data['row1']['department'] : '';
                                        }
                                    } else {
                                        $("#alertModal").modal('show')
                                        $("#alertModal .text-error").empty().text('没有全部上传成功。出错条目：' + uploadArr[i]['uName'] + '\u000d请更正Excel后重新上传')
                                        done -= 1;
                                    }
                                    $.ajax({
                                        url: "../../../ways.php",
                                        type: "POST",
                                        timeout: 8000,
                                        async: false,
                                        data: {
                                            funcName: 'checkIfExist',
                                            serverName: '10.101.62.73',
                                            uid: 'sa',
                                            pwd: '2huj15h1',
                                            Database: 'JSZGL',
                                            tableName: ' dbsx',
                                            column: ' *',
                                            where: ' where archivesId = \'' + archivesId + '\'',
                                            order: ' '
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            if (data['success'] === 0) {
                                                //未重复，插入
                                                $.ajax({
                                                    url: "../../../ways.php",
                                                    type: "POST",
                                                    timeout: 8000,
                                                    async: false,
                                                    data: {
                                                        funcName: 'insert',
                                                        serverName: '10.101.62.73',
                                                        uid: 'sa',
                                                        pwd: '2huj15h1',
                                                        Database: 'jszgl',
                                                        tableName: ' dbsx',
                                                        column: ' (payId,archivesId,uname,department,cardId,type,birthDate,txrq,sjDriveCode,phone,sex,PC)',
                                                        values: '(\'' + payId + '\',\'' + archivesId + '\',\'' + uName + '\',\'' + department + '\',\'' + cardId + '\',\'' + type + '\',\'' + birthDate + '\',\'' + txrq + '\',\'' + sjDriveCode + '\',\'' + phone + '\',\'' + sex + '\',\'' + PC + '\')'
                                                    },
                                                    dataType: 'json',
                                                    success: function (ret) {
                                                        if (ret['success'] === 1) {
                                                            $(".progressBar .total").html(uploadArr.length)
                                                            done += 1;
                                                            $(".progressBar .done").html(done)
                                                            if (done === uploadArr.length) {
                                                                $("#alertModal").modal('show')
                                                                $("#alertModal .text-success").empty().text('上传成功')
                                                                window.location.reload();
                                                            }
                                                        }
                                                    }
                                                })
                                            } else if (data['success'] === 1) {
                                                //重复，更新
                                                $.ajax({
                                                    url: "../../../ways.php",
                                                    type: "POST",
                                                    timeout: 8000,
                                                    async: false,
                                                    data: {
                                                        funcName: 'update',
                                                        serverName: '10.101.62.73',
                                                        uid: 'sa',
                                                        pwd: '2huj15h1',
                                                        Database: 'jszgl',
                                                        tableName: ' dbsx',
                                                        setStr: ' uname = \'' + uName + '\',payId = \'' + payId + '\',department = \'' + department + '\',cardId = \'' + cardId + '\',birthDate = \'' + birthDate + '\',txrq = \'' + txrq + '\',phone = \'' + phone + '\',sjDriveCode = \'' + sjDriveCode + '\',sex = \'' + sex + '\',type = \'' + csData['czlb-levelup2']['nr2'] + '\'',
                                                        where: ' where archivesId = \'' + archivesId + '\''
                                                    },
                                                    dataType: 'json',
                                                    success: function (data) {
                                                        $(".progressBar .total").html(uploadArr.length)
                                                        done += 1;
                                                        $(".progressBar .done").html(done)
                                                        if (done === uploadArr.length) {
                                                            $("#alertModal").modal('show')
                                                            $("#alertModal .text-success").empty().text('上传成功')
                                                            window.location.reload();
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            })
        })
        //上传excel文件
        //教育科小名单上传
        function handleFile(e) {
            var files = e.target.files;
            var unit = '洛阳机务段';
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheet_name_list = workbook.SheetNames;
                    var result = [];
                    var headItem = [];
                    var dataItem = [];
                    var dataFormulae = [];
                    var dataCsv = [];
                    var headCode = [];
                    var rowNum = 0;
                    sheet_name_list.forEach(function (y) {
                        var worksheet = workbook.Sheets[y];
                        var json = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        var formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        var csv = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        if (json.length > 0) {
                            result = json;
                            dataCsv = csv;
                        }
                    });
                    $.each(dataFormulae, function (j, head) {
                        var headlist = head.split("='")
                        if (/^[A-Z]2$/.test(headlist[0])) {
                            headItem.push(headlist[1])
                        }
                    })
                    $.each(result, function (i, val) {
                        var data = []
                        $.each(headItem, function (k, head) {
                            val[head] != undefined ? data.push(val[head]) : data.push("")
                        })
                        dataItem.push(data)
                    })
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        rowNum = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        headCode.indexOf(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) == -1 ? headCode.push(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) : '';
                    })
                    headCode = headCode.sort();
                    $.each(headCode, function (i, val) {
                        headItem[val] = '';
                    })
                    for (var i = 0; i < Number(rowNum) - 1; i++) {
                        var obj = {};
                        $.each(headCode, function (i, val) {
                            obj[val] = '';
                        })
                        dataItem[i] = obj;
                    }
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        var code = /^([A-Z]+)\d+$/.exec(headlist[0])[1];
                        var row = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        if (row == 2) {
                            headItem[j] = headlist[1]
                        } else if (row > 2) {
                            dataItem[row - 2][code] = headlist[1];
                        }
                    })
                    var headstr = '';
                    var datastr = '';
                    $.each(headItem, function (i, head) {
                        if (i === 0) {

                        } else {
                            headstr = headstr + '<th style="border: 1px solid #cccccc">' + head + '</th>'
                        }

                    })
                    $.each(dataItem, function (i, data) {
                        if (data['C'].indexOf(unit) > 0) {
                            datastr = datastr + '<tr >';
                            var clasS = '';
                            if (i === 0) {

                            } else {
                                $.each(data, function (j, val) {
                                    switch (j) {
                                        //
                                        //按照劳人科给的《具提升资格人员名单》，把每一列和类名意义对应
                                        //需要和劳人科约定规则，不能随意更改
                                        case 'A': clasS = 'number input-mini';
                                            break;
                                        case 'B': clasS = 'company input-large';
                                            break;
                                        case 'C': clasS = 'unit input-xlarge';
                                            break;
                                        case 'D': clasS = 'uName input-mini';
                                            break;
                                        case 'E': clasS = 'sex input-mini';
                                            break;
                                        case 'F': clasS = 'cardId input-medium';
                                            break;
                                        case 'G': clasS = 'minzu input-mini';
                                            break;
                                        case 'H': clasS = 'byyx input-medium';
                                            break;
                                        case 'I': clasS = 'whcd input-mini';
                                            break;
                                        case 'J': clasS = 'phone input-small';
                                            break;
                                        case 'K': clasS = 'mail input-mini';
                                            break;
                                        case 'L': clasS = 'applyType input-small';
                                            break;
                                        case 'M': clasS = 'zj input-mini';
                                            break;
                                        case 'N': clasS = 'cardCheck input-mini';
                                            break;
                                    }
                                    datastr = datastr + '<td style="border: 1px solid #cccccc">' + '<input class="' + clasS + '" style="font-size:13px" type="text" value="' + val + '"></td>'
                                })
                                datastr = datastr + '</tr>';
                            }
                        }

                    })
                    var table = '<table class="table table-bordered table-striped table-condensed"><thead><tr style="font-weight: bold">' + headstr + '</tr></thead><tbody>' + datastr + '</tbody></table>'
                    $('#uploadContent').empty().html($('#uploadContent').html() + table);
                    $("#alertModal").modal('show')
                    $("#alertModal .text-info").empty().text('请检查信息是否有误，确认无误后请点击表格末尾的“上传”按钮')
                    $('.confirmUpload').css('display', 'inline-block')
                };
                reader.readAsBinaryString(f);
            }
        }
        //劳人科大名单上传
        var bigArr = [];
        function handleFile1(e) {
            var files = e.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheet_name_list = workbook.SheetNames;
                    var result = [];
                    var headItem = [];
                    var dataItem = [];
                    var dataFormulae = [];
                    var dataCsv = [];
                    var headCode = [];
                    var rowNum = 0;
                    sheet_name_list.forEach(function (y) {
                        var worksheet = workbook.Sheets[y];
                        var json = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        var formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        var csv = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        if (json.length > 0) {
                            result = json;
                            dataCsv = csv;
                        }
                    });
                    $.each(dataFormulae, function (j, head) {
                        var headlist = head.split("='")
                        if (/^[A-Z]2$/.test(headlist[0])) {
                            headItem.push(headlist[1])
                        }
                    })
                    $.each(result, function (i, val) {
                        var data = []
                        $.each(headItem, function (k, head) {
                            val[head] != undefined ? data.push(val[head]) : data.push("")
                        })
                        dataItem.push(data)
                    })
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        rowNum = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        headCode.indexOf(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) == -1 ? headCode.push(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) : '';
                    })
                    headCode = headCode.sort();
                    $.each(headCode, function (i, val) {
                        headItem[val] = '';
                    })
                    for (var i = 0; i < Number(rowNum) - 1; i++) {
                        var obj = {};
                        $.each(headCode, function (i, val) {
                            obj[val] = '';
                        })
                        dataItem[i] = obj;
                    }
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        var code = /^([A-Z]+)\d+$/.exec(headlist[0])[1];
                        var row = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        if (row == 1) {
                            headItem[j] = headlist[1]
                        } else if (row) {
                            dataItem[row - 2][code] = headlist[1];
                        }
                    })
                    var headstr = '';
                    var datastr = '';
                    $.each(headItem, function (i, head) {
                        headstr = headstr + '<th style="border: 1px solid #cccccc">' + head + '</th>'
                    })
                    $.each(dataItem, function (i, data) {
                        var obj = {};
                        $.each(data, function (j, val) {
                            switch (j) {
                                case 'E': obj.archivesId = val;
                                    break;
                                case 'D': obj.uName = val;
                                    break;
                                case 'K': obj.cardId = val;
                                    break;
                            }
                            bigArr[i] = Object.assign(obj);
                        })
                    })
                    $("#hiddenUpload").css('visibility', 'visible');
                    return bigArr;
                };
                reader.readAsBinaryString(f);
            }
        }
        //铁路局返回名单上传
        function handleFile2(e) {
            var files = e.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheet_name_list = workbook.SheetNames;
                    var result = [];
                    var headItem = [];
                    var dataItem = [];
                    var dataFormulae = [];
                    var dataCsv = [];
                    var headCode = [];
                    var rowNum = 0;
                    sheet_name_list.forEach(function (y) {
                        var worksheet = workbook.Sheets[y];
                        var json = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        var formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        var csv = XLSX.utils.sheet_to_formulae(workbook.Sheets[y]);
                        if (json.length > 0) {
                            result = json;
                            dataCsv = csv;
                        }
                    });
                    $.each(dataFormulae, function (j, head) {
                        var headlist = head.split("='")
                        if (/^[A-Z]1$/.test(headlist[0])) {
                            headItem.push(headlist[1])
                        }
                    })
                    $.each(result, function (i, val) {
                        var data = []
                        $.each(headItem, function (k, head) {
                            val[head] != undefined ? data.push(val[head]) : data.push("")
                        })
                        dataItem.push(data)
                    })
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        rowNum = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        headCode.indexOf(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) == -1 ? headCode.push(/^([A-Z]+)\d+$/.exec(headlist[0])[1]) : '';
                    })
                    headCode = headCode.sort();
                    $.each(headCode, function (i, val) {
                        headItem[val] = '';
                    })
                    for (var i = 4; i < Number(rowNum) - 1; i++) {
                        var obj = {};
                        $.each(headCode, function (i, val) {
                            obj[val] = '';
                        })
                        dataItem[i] = obj;
                    }
                    $.each(dataCsv, function (j, head) {
                        var headlist = head.split("='")
                        var code = /^([A-Z]+)\d+$/.exec(headlist[0])[1];
                        var row = /^[A-Z]+(\d+)$/.exec(headlist[0])[1];
                        if (row == 1) {
                            headItem[j] = headlist[1]
                        } else if (row - 2 >= 0) {
                            dataItem[row - 2][code] = headlist[1];
                        }
                    })
                    var arr = [];
                    $.each(dataItem, function (i, data) {
                        var obj = {};
                        $.each(data, function (j, val) {
                            switch (j) {
                                //按照总公司返回的《XXX等N名取得铁路机车车辆驾驶资格人员名单》（文件名一般是PO+时间戳），把每一列和类名意义对应
                                case 'A': obj.number = val;
                                    break;
                                case 'B': obj.uName = val;
                                    break;
                                case 'C': obj.sex = val;
                                    break;
                                case 'D': obj.cardId = val;
                                    break;
                                case 'E': obj.unit = val;
                                    break;
                                case 'F': obj.sjDriveCode = val;
                                    break;
                                case 'G': obj.startDate = val;
                                    break;
                                case 'H': obj.deadline = val;
                                    break;
                            }
                        })
                        arr.push(Object.assign(obj));
                    })
                    var unit = '洛阳机务段';        //单位名
                    var realArr = [];       //取出的本段人名单
                    $.each(arr, function (m, val) {
                        if (arr[m]['unit'] && arr[m]['unit'].indexOf(unit) > -1) {
                            realArr.push(arr[m])
                        } else {
                            delete arr[m]
                        }
                    })
                    //提升操作
                    var tempArr = [];               //临时
                    var ajaxArr = [];               //即将发请求的数组
                    checkRealArr(realArr);
                    function checkRealArr(realArr) {
                        $('#appendSubmit table tbody').empty()
                        var count = 0;      //计数，跟ajaxArr的长度比对，若少，说明用户没选择完毕
                        $.each(realArr, function (m, val) {
                            //大致思路。用姓名和sjdrivecode去dbsx中匹配，如果有结果并只有一条（理想情况）
                            //就直接新增jbxx和bgxx，删除dbsx
                            //如果有结果并大于一条，说明重名且报的机型也一样，需要人工确认
                            //显示一个模态框，打印出来这几个人的信息，让用户选择。
                            //如果没有结果，应该是返回excel的名字打错或准驾机型错，做模糊匹配
                            //在这里直接把姓名中的字母和数字去掉
                            var person = {};
                            person.sjDriveCode = val['sjDriveCode'];
                            person.uName = val['uName'].replace(/[0-9a-zA-Z]/ig, "");
                            person.startDate = dotTo(val['startDate']);
                            person.deadline = dotTo(val['deadline']);
                            person.sex = val['sex'];
                            var where = ' where uName =\'' + person.uName + '\' AND sjDriveCode=\'' + person.sjDriveCode + '\''
                            var column = ' * ';
                            $.ajax({
                                url: "../../../ways.php",
                                type: "POST",
                                async: false,
                                data: {
                                    funcName: 'select',
                                    serverName: '10.101.62.73',
                                    uid: 'sa',
                                    pwd: '2huj15h1',
                                    Database: 'JSZGL',
                                    tableName: ' dbsx ',
                                    column: column,
                                    where: where,
                                    order: ' '
                                },
                                dataType: 'json',
                                success: function (data) {
                                    person.sjDriveType = csData['zjlx-' + person.sjDriveCode]['nr1'];
                                    person.status = csData['zjzt-zc']['nr2'];
                                    person.phyTest = csData['tjjl-hg']['nr2'];
                                    person.tzDone = csData['tzDone-swtz']['nr2'];
                                    person.sjDate = person.startDate;
                                    var html = '';
                                    $("#appendSubmit").modal('show')
                                    if (data['success'] === 1 && data['count'] === 1) {
                                        //理想情况，找到并只有一个
                                        person.payId = data['row1']['payId'];
                                        person.archivesId = data['row1']['archivesId'];
                                        person.birthDate = data['row1']['birthDate'];
                                        person.cardId = data['row1']['cardId'];
                                        person.department = data['row1']['Department'];
                                        person.txrq = data['row1']['txrq'];
                                        person.PC = data['row1']['PC'];
                                        count += 1;
                                        ajaxArr.push(Object.assign(person))
                                        html = '<tr><td>' + val['uName'] + '</td><td>' + val['sjDriveCode'] + '</td></tr>';
                                        $('#appendSubmitTableLeft1').css('visibility', 'visible')
                                        $('#appendSubmitTableLeft1 tbody').append(html);
                                        html = '<tr><td>' + person.archivesId + '</td><td>' + person.department + '</td><td>' + person.uName + '</td><td>' + person.sjDriveCode + '</td><td>' + person.PC + '</td></tr>';
                                        $('#appendSubmitTableRight1').css('visibility', 'visible');
                                        $('#appendSubmitTableRight1 tbody').append(html);
                                        html = '&nbsp;&nbsp;从文件中提取到以下人员：';
                                        $('#appendSubmitP1').empty().append(html)
                                    }
                                    else if (data['success'] === 1 && data['count'] > 1) {
                                        //找到并很多，说明有重名,显示一个模态框让用户选择
                                        //提升成功依然加入成功数组
                                        delete data['success'];
                                        delete data['count'];
                                        var p = '&nbsp;&nbsp;有重名信息，请在右边选择要提升的人员：';
                                        var text = '';
                                        count += 1;
                                        html += '<tr><td>' + val['uName'] + '</td><td>' + val['sjDriveCode'] + '</td></tr>';
                                        for (var i in data) {
                                            text += '<tr>';
                                            text += '<td><label class="radio"><input type="radio" name=\'group' + m + '\' value=\'' + i + '\'></label></td>'
                                            text += '<td>' + data[i]['archivesId'] + '</td>';
                                            text += '<td>' + data[i]['Department'] + '</td>';
                                            text += '<td>' + data[i]['UName'] + '</td>';
                                            text += '<td>' + data[i]['sjDriveCode'] + '</td>';
                                            text += '<td>' + data[i]['PC'] + '</td>';
                                            text += '</tr>';
                                            person.payId = data[i]['payId'];
                                            person.archivesId = data[i]['archivesId'];
                                            person.birthDate = data[i]['birthDate'];
                                            person.cardId = data[i]['cardId'];
                                            person.department = data[i]['Department'];
                                            person.txrq = data[i]['txrq'];
                                            person.PC = data[i]['PC'];
                                            tempArr.push(Object.assign({}, person))
                                        }
                                        $("#appendSubmitP2").empty().append(p)
                                        $('#appendSubmitTableLeft2').css('visibility', 'visible')
                                        $('#appendSubmitTableLeft2 tbody').append(html);
                                        $('#appendSubmitTableRight2').css('visibility', 'visible');
                                        $('#appendSubmitTableRight2 tbody').append(text);
                                    }
                                    else if (data['success'] === 0) {
                                        //没找到，错名或错机型
                                        //模糊匹配,选取姓名开头或结尾相同的，暂不限制机型
                                        var uNameStart = val['uName'][0];
                                        var uNameOver = val['uName'][val['uName'].length - 1];
                                        count += 1;
                                        where = ' where uName like\'' + uNameStart + '%\' OR uName like \'%' + uNameOver + '\''
                                        $.ajax({
                                            url: "../../../ways.php",
                                            type: "POST",
                                            async: false,
                                            data: {
                                                funcName: 'select',
                                                serverName: '10.101.62.73',
                                                uid: 'sa',
                                                pwd: '2huj15h1',
                                                Database: 'JSZGL',
                                                tableName: ' dbsx ',
                                                column: column,
                                                where: where,
                                                order: ' '
                                            },
                                            dataType: 'json',
                                            success: function (data) {
                                                if (data['success'] === 1) {
                                                    delete data['success'];
                                                    delete data['count'];
                                                    var p = '&nbsp;&nbsp;有查无结果的信息，请在右边选择可能的人员进行提升：';
                                                    var text = '';
                                                    html += '<tr><td>' + val['uName'] + '</td><td>' + val['sjDriveCode'] + '</td></tr>';
                                                    for (var i in data) {
                                                        text += '<tr>';
                                                        text += '<td><label class="radio"><input type="radio" name=\'group' + m + '\' value=\'' + i + '\'></label></td>'
                                                        text += '<td>' + data[i]['archivesId'] + '</td>';
                                                        text += '<td>' + data[i]['Department'] + '</td>';
                                                        text += '<td>' + data[i]['UName'] + '</td>';
                                                        text += '<td>' + data[i]['sjDriveCode'] + '</td>';
                                                        text += '<td>' + data[i]['PC'] + '</td>';
                                                        text += '</tr>';
                                                        person.uName = data[i]['UName'];
                                                        person.payId = data[i]['payId'];
                                                        person.archivesId = data[i]['archivesId'];
                                                        person.birthDate = data[i]['birthDate'];
                                                        person.cardId = data[i]['cardId'];
                                                        person.department = data[i]['Department'];
                                                        person.txrq = data[i]['txrq'];
                                                        person.PC = data[i]['PC'];
                                                        tempArr.push(Object.assign({}, person))
                                                    }
                                                    $("#appendSubmitLeftP3").empty().append(p)
                                                    $('#appendSubmitTableLeft3').css('visibility', 'visible')
                                                    $('#appendSubmitTableLeft3 tbody').append(html);
                                                    $('#appendSubmitTableRight3').css('visibility', 'visible');
                                                    $('#appendSubmitTableRight3 tbody').append(text);
                                                } else {
                                                    $("#alertModal").modal('show')
                                                    $("#alertModal .text-error").empty().text('文件中姓名为' + val['uName'] + '的信息查无此人，请对照批次记录，更正Excel并保存后再上传')
                                                    $('#appendSubmit').modal('hide')
                                                }
                                            }
                                        })
                                    }
                                    $("#appendSubmit .btn-primary").off('click').on('click', function () {
                                        //思路：点提交，先校验用户有没有完整勾选人员，通过数组长度和count比对
                                        //把要提升的人员信息加一个标志位，不能直接移出数组
                                        var checkedArr = $('#appendSubmit table input[type="radio"]:checked')
                                        if (count === ajaxArr.length + checkedArr.length) {
                                            for (var i = 0; i < checkedArr.length; i++) {
                                                for (var j in tempArr) {
                                                    if (tempArr[j]['archivesId'] === $(checkedArr[i]).parent().parent().next('td').text()) {
                                                        ajaxArr.push(tempArr[j])
                                                    }
                                                }
                                            }
                                            var successArr = [];             //成功后展示的数组
                                            $("#appendSubmit").modal('hide')
                                            for (var m in ajaxArr) {
                                                tsAppendAjax(ajaxArr[m], successArr)
                                            }
                                            displaySuccess(successArr)
                                        } else {
                                            $("#alertModal").modal('show')
                                            $("#alertModal .text-info").empty().text('请完整勾选')
                                        }
                                    })
                                }
                            })
                        })
                    }

                    function tsAppendAjax(person, successArr) {
                        $.ajax({
                            url: "../../../ways.php",
                            async: false,
                            type: "POST",
                            timeout: 8000,
                            //若后期连接数据库的接口需求有变化，需要从这里更改数据的键值
                            data: {
                                funcName: 'select', where: ' where archivesId =\'' + person.archivesId + '\'', serverName: '10.101.62.73', uid: 'sa', pwd: '2huj15h1', Database: 'JSZGL',
                                tableName: ' jbxx ', column: ' archivesId', order: ' '
                            },
                            dataType: 'json',
                            success: function (data) {
                                var date = new Date();
                                var year = date.getFullYear()
                                var lotNumber = new Date();
                                lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
                                lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
                                lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;
                                if (data['success'] === 0) {
                                    //insert jbxx
                                    $.ajax({
                                        url: "../../../ways.php",
                                        type: "POST",
                                        async: false,
                                        timeout: 8000,
                                        data: {
                                            funcName: 'insert',
                                            serverName: '10.101.62.73',
                                            uid: 'sa',
                                            pwd: '2huj15h1',
                                            Database: 'jszgl',
                                            tableName: ' jbxx',
                                            column: ' (payId,archivesId,UName,sex,department,birthDate,txrq,cardId,sjDate,' +
                                                'startdate,deadline,sjDriveCode,sjDriveType,status,tzdone,phyTest,PC)',
                                            values: '(\'' + person.payId + '\',\'' + person.archivesId + '\',\'' + person.uName + '\',\'' + person.sex + '\',\'' + person.department + '\',\'' + person.birthDate + '\',\'' + person.txrq + '\',\'' + person.cardId + '\',\''
                                                + person.sjDate + '\',\'' + person.startDate + '\',\'' + person.deadline + '\',\'' + person.sjDriveCode + '\',\'' + person.sjDriveType + '\',\'' + person.status + '\',\'' + person.tzDone + '\',\'' + person.phyTest + '\',\'' + person.PC + '\')'
                                        },
                                        dataType: 'json',
                                        success: function () {
                                            var successObj = {};
                                            successObj.uName = person.uName;
                                            successObj.archivesId = person.archivesId;
                                            successObj.department = person.department;
                                            successArr.push(Object.assign({}, successObj))
                                            //insert bgxx
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'insert',
                                                    serverName: '10.101.62.73',
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' bgxx',
                                                    column: ' (lotNumber,Department,payId,archivesId,UName,changeType,checkStatus,' +
                                                        'driveCode,drive,jykOperator,pc)',
                                                    values: '(\'' + lotNumber + '\',\'' + person.department + '\',\'' + person.payId + '\',\'' + person.archivesId + '\',\'' + person.uName + '\',\'' + csData['czlb-levelup2']['nr2'] + '\',\'' + csData['checkStatus-shtg']['nr2'] +
                                                        '\',\'' + person.sjDriveCode + '\',\'' + person.sjDriveType + '\',\'' + sessionGet('user') + '\',\'' + person.PC + '\')'
                                                },
                                                dataType: 'json',
                                                success: function (ret) {
                                                }
                                            })
                                            //删除DBSX表中数据
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'delete',
                                                    serverName: '10.101.62.73',
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' dbsx',
                                                    where: ' where archivesId =\'' + person.archivesId + '\' AND type=\'' + csData['czlb-levelup2']['nr2'] + '\''
                                                },
                                                dataType: 'json'
                                            })
                                            //更新tjxx表
                                            var setStr1 = 'increaseAmount = increaseAmount + 1,kshg=kshg+1,yearlyAmount = yearlyAmount+1';
                                            var where1 = ' where driveCode = \'' + person.sjDriveCode + '\' AND year = ' + year;
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'update',
                                                    serverName: '10.101.62.73',
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' tjxx',
                                                    setStr: setStr1,
                                                    where: where1
                                                },
                                                dataType: 'json'
                                            })
                                        }
                                    })
                                } else {
                                    //update
                                    var columnArr = ['payId', 'UName', 'department', 'cardId', 'sex', 'birthDate', 'txrq', 'sjDate', 'startDate', 'deadline', 'sjDriveCode', 'sjDriveType', 'status', 'tzDone', 'phyTest', 'pc'];
                                    var valuesArr = [person.payId, person.uName, person.department, person.cardId, person.sex, person.birthDate, person.txrq, person.sjDate, person.startDate, person.deadline, person.sjDriveCode, person.sjDriveType, person.status, person.tzDone, person.phyTest, person.PC];
                                    var setStr = '';
                                    for (var i = 0; i < columnArr.length; i++) {
                                        setStr += columnArr[i] + '=' + '\'' + valuesArr[i] + '\'' + ','
                                    }
                                    setStr = setStr.substring(0, setStr.length - 1);
                                    //更新jbxx
                                    $.ajax({
                                        url: "../../../ways.php",
                                        type: "POST",
                                        timeout: 8000,
                                        data: {
                                            funcName: 'update', async: false, serverName: '10.101.62.73', uid: 'sa', pwd: '2huj15h1', Database: 'jszgl',
                                            tableName: ' jbxx', setStr: setStr, where: ' where archivesId = \'' + person.archivesId + '\''
                                        },
                                        dataType: 'json',
                                        success: function () {
                                            var successObj = {};
                                            successObj.uName = person.uName;
                                            successObj.archivesId = person.archivesId;
                                            successObj.department = person.department;
                                            successArr.push(Object.assign({}, successObj))
                                            //插入bgxx
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'insert',
                                                    serverName: '10.101.62.73',
                                                    async: false,
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' bgxx',
                                                    column: ' (lotNumber,Department,payId,archivesId,UName,changeType,checkStatus,' +
                                                        'driveCode,drive,jykOperator,pc)',
                                                    values: '(\'' + lotNumber + '\',\'' + person.department + '\',\'' + person.payId + '\',\'' + person.archivesId + '\',\'' + person.uName + '\',\'' + csData['czlb-levelup2']['nr2'] + '\',\'' + csData['checkStatus-shtg']['nr2'] +
                                                        '\',\'' + person.sjDriveCode + '\',\'' + person.sjDriveType + '\',\'' + sessionGet('user') + '\',\'' + person.PC + '\')'
                                                },
                                                dataType: 'json',
                                                success: function (ret) {

                                                }
                                            })
                                            //删除DBSX表中数据
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'delete',
                                                    serverName: '10.101.62.73',
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' dbsx',
                                                    where: ' where archivesId =\'' + person.archivesId + '\' AND type=\'' + csData['czlb-levelup2']['nr2'] + '\''
                                                },
                                                dataType: 'json'
                                            })
                                            //更新tjxx表
                                            var date = new Date();
                                            var year = date.getFullYear()
                                            var setStr1 = 'increaseAmount = increaseAmount + 1,kshg=kshg+1,yearlyAmount = yearlyAmount+1';
                                            var where1 = ' where driveCode = \'' + person.sjDriveCode + '\' AND year = ' + year;
                                            $.ajax({
                                                url: "../../../ways.php",
                                                type: "POST",
                                                timeout: 8000,
                                                data: {
                                                    funcName: 'update',
                                                    serverName: '10.101.62.73',
                                                    uid: 'sa',
                                                    pwd: '2huj15h1',
                                                    Database: 'jszgl',
                                                    tableName: ' tjxx',
                                                    setStr: setStr1,
                                                    where: where1
                                                },
                                                dataType: 'json'
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    function displaySuccess(successArr) {
                        //成功提升的模态框
                        console.log(successArr)
                        if (successArr.length > 0) {
                            var html = '<tr><th>档案号</th><th>部门</th><th>姓名</th></tr>';
                            for (var x = 0; x < successArr.length; x++) {
                                html += '<tr><td>' + successArr[x]['archivesId'] + '</td><td>' + successArr[x]['department'] + '</td><td>' + successArr[x]['uName'] + '</td></tr>';
                            }
                            var p = '本次操作成功提升司机' + successArr.length + '名';
                            $('#tsSuccessP').empty().append(p)
                            $('#tsSuccessTable').empty().append(html)
                            $(".modal-backdrop").remove()
                            $('#tsSuccess').modal('show');
                        }
                    }


                    function dotTo(str) {
                        //该函数接收一个'xxxx.x.xx'格式的日期，返回一个'xxxx-xx-xx'格式
                        var strArr = str.split('.');
                        if (strArr[1].length < 2) {
                            strArr[1] = '0' + strArr[1];
                        }
                        if (strArr[2].length < 2) {
                            strArr[2] = '0' + strArr[2];
                        }
                        var _newStr = strArr[0] + '-' + strArr[1] + '-' + strArr[2]
                        return _newStr
                    }
                };
                reader.readAsBinaryString(f);
            }
        }
        $('#uploadExcel').bind('change', handleFile);
        $('#uploadExcel1').bind('change', handleFile1);
        $('#uploadExcel2').bind('change', handleFile2);
    }
    $('a[href="#tsContent"]').on('shown', function (e) {
        $("#appendPage").css('display', 'none')
        var column = ' payId,archivesId,uName,department,cardId,type,PC'
        $.ajax({
            url: "../../../ways.php",
            type: "POST",
            timeout: 8000,
            //若后期连接数据库的接口需求有变化，需要从这里更改数据的键值
            data: {
                funcName: 'select',
                where: ' where type =\'' + csData['czlb-levelup2']['nr2'] + '\'',
                serverName: '10.101.62.73',
                uid: 'sa',
                pwd: '2huj15h1',
                Database: 'JSZGL',
                tableName: ' dbsx ',
                column: column,
                order: ' order by PC'
            },
            dataType: 'json',
            success: function (data) {
                if (data['success'] === 1) {
                    $('#appendContainer .levelUpTableContent').css('display', 'block')
                    $("#appendContainer .uploadExcelContent").css('display', 'none')
                    $('.buttonBanner .float:eq(0)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
                    $('.buttonBanner .float:eq(1)').css({ 'background': 'green', 'color': 'white', 'fontWeight': 'bold' })
                    $("#appendPage").css('visibility', 'visible')
                    var table = $("#appendTSTable");
                    var page = $("#appendPage");
                    var extra = '';
                    var thText = '<tr><th>工资号</th><th>档案号</th><th>姓名</th><th>部门</th><th>身份证号</th><th>操作类别</th><th>批次</th></tr>';
                    var eventFunction = boundAppendEvent;
                    commonAppendToTable(table, page, data, thText, extra, eventFunction)
                }
                else {
                    $("#appendContainer .uploadExcelContent").css('display', 'block')
                    $('#appendContainer .levelUpTableContent').css('display', 'none')
                    $('#appendContainer .checkWithPCContent').css('display', 'none')
                    $('.buttonBanner .float:eq(0)').css({ 'background': 'green', 'color': 'white', 'fontWeight': 'bold' })
                    $('.buttonBanner .float:eq(1)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
                    $('.buttonBanner .float:eq(2)').css({ 'background': 'inherit', 'color': 'inherit', 'fontWeight': 'inherit' })
                    $("#appendPage").css('visibility', 'hidden')
                    boundAppendEvent(data, csData)
                }
            }
        })
    })
}


//证件信息修改以及注销
function appendEditAndLogOut(csData) {
    //添加证件调整的select选择车间和注销原因
    var html = '<option>--请选择--</option>';
    for (var i in csData) {
        if (csData[i]['lb'] === 'zxyy') {
            html += '<option>' + csData[i]['nr2'] + '</option>'
        }
    }
    $("#logOutReason").append(html)
    $('#editBanner .queryInput').keyup(function (event) {
        if (event.keyCode === 13) {
            displayEdit()
        }
    })
    $("#editBanner .queryButton").off('click').on('click', function () {
        displayEdit()
    })
    $('#deleteTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    //分别定义事件
    $('a[href="#deleteOperate"]').on('shown', function (e) {
        $('#deleteBanner .queryInput').keyup(function (event) {
            if (event.keyCode === 13) {
                displayLogOut()
            }
        })
        $("#deleteBanner .queryButton").off('click').on('click', function () {
            displayLogOut()
        })
    })
    $('a[href="#deleteHistory"]').on('shown', function (e) {
        appendHistory()
    })
    function displayEdit() {
        if (sessionGet('power') === jykPower) {
            if ($("#editBanner .queryInput").val().match(/^[a-zA-Z]+$/)) {
                var pym = $("#editBanner .queryInput").val();
                var columns = ' *';
                var table = ' jbxx ';
                var order = ' ';
                var where = ' where pym =\'' + pym + '\'';
                var db = 'jszglInfo';
                var ajaxTimeOut = $.ajax({
                    url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                    type: "POST",
                    timeout: 8000,
                    dataType: 'json',
                    success: function (data) {
                        if (data.length > 0) {
                            $('#editContainer .queryInfoContent').css('display', 'none')
                            $('.editButtonBanner').css('display', 'none')
                            $('#editContainer ul').empty()
                            $(".editButtonBanner").css('display', 'none')
                            if (data.length === 1) {
                                displayEditInfo(data[0])
                            } else {
                                var html = '';
                                for (var i in data) {
                                    html += '<li class="span3"><div class="thumbnail ' + i + '">';
                                    if (data[i]['photoPath']) {
                                        html += '<img src="' + data[i]['photoPath'] + '"/>'
                                    } else {
                                        html += '<img src="./source/images/broken.png"/>'
                                    }
                                    html += '<div><span>工资号：</span><span class="payId">' + data[i]['payId'] + '</span></div>'
                                    html += '<div><span>部门：</span><span class="department">' + data[i]['department'] + '</span></div>'
                                    html += '<div><span>姓名：</span><span class="uName">' + data[i]['UName'] + '</span></div>'

                                }
                                $("#editContainer ul").empty().append(html)
                                $('#editContainer ul .thumbnail').off('click').on('click', function () {
                                    var cla = this.className.split('thumbnail ')[1]         //取到类名，去掉thumbnail和空格
                                    $('#editContainer ul').empty()
                                    displayEditInfo(data[cla])
                                })
                            }


                            function displayEditInfo(data) {
                                $('.infoFix').text('信息更正').css({ 'color': '#333', 'fontWeight': 'normal' })
                                $('.queryInfo>div>div').css('backgroundColor', 'inherit')
                                $('#editContainer .queryInfoContent').css('display', 'block')
                                if (data['cardPath']) {
                                    $('.queryInfoContent .queryPicInfo img').prop('src', data['cardPath']);
                                } else {
                                    $('.queryInfoContent .queryPicInfo img').prop('src', './source/images/broken.png');
                                }
                                $('.queryInfoContent .queryInfo .payIdInput').val(data['payId']);
                                $('.queryInfoContent .queryInfo .name').text(data['UName']);
                                $('.queryInfoContent .queryInfo .department').text(data['department']);
                                $('.queryInfoContent .queryInfo .birth').text(data['birthDate']);
                                $('.queryInfoContent .queryInfo .sjDateInput').val(data['sjDate']);
                                $('.queryInfoContent .queryInfo .sjRemarkInput').val(data['sjRemark']);
                                $('.queryInfoContent .queryInfo .yearlyCheckDateInput').val(data['yearlyCheckDate']);
                                $('.queryInfoContent .queryInfo .driveCodeInput').val(data['sjDriveCode']);
                                $('.queryInfoContent .queryInfo .driveTypeInput').val(data['sjDriveType']);
                                $('.queryInfoContent .queryInfo .startDateInput').val(data['startdate']);
                                $('.queryInfoContent .queryInfo .deadlineInput').val(data['deadline']);
                                $('.queryInfoContent .queryInfo .phyTest').text(data['phyTest']);
                                $(".queryInfoContent .queryInfo input").prop('disabled', true)
                                $(".editButtonBanner").css('display', 'block')
                                boundEditEvent(data)
                            }

                        } else {
                            $("#alertModal").modal('show')
                            $("#alertModal .text-warning").empty().text('您查询的信息不存在')
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
                $("#alertModal .text-warning").empty().text('请输入拼音码（姓名拼音首字母，例如张三的拼音码是zs，不区分大小写）')
            }
        }
    }
    function displayLogOut() {
        if (sessionGet('power') === jykPower) {
            if ($("#deleteBanner .queryInput").val().match(/^[a-zA-Z]+$/)) {
                var pym = $("#deleteBanner .queryInput").val();
                var columns = ' *';
                var table = ' jbxx ';
                var order = ' ';
                var where = ' where pym =\'' + pym + '\'';
                var db = 'jszglInfo';
                var ajaxTimeOut = $.ajax({
                    url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
                    type: "POST",
                    timeout: 8000,
                    dataType: 'json',
                    success: function (data) {
                        if (data.length > 1) {
                            $('#deleteContainer .queryInfoContent').css('display', 'none')
                            $('.deleteButtonBanner').css('display', 'none')
                            $('#deleteContainer ul.thumbnails').empty()
                            $(".deleteButtonBanner").css('display', 'none')
                            if (data.length === 1) {
                                displayDeleteInfo(data[0])
                            } else {
                                var html = '';
                                for (var i in data) {
                                    html += '<li class="span3"><div class="thumbnail ' + i + '">';
                                    if (data[i]['photoPath']) {
                                        html += '<img src="' + data[i]['photoPath'] + '"/>'
                                    } else {
                                        html += '<img src="./source/images/broken.png"/>'
                                    }
                                    html += '<div><span>工资号：</span><span class="payId">' + data[i]['payId'] + '</span></div>'
                                    html += '<div><span>部门：</span><span class="department">' + data[i]['department'] + '</span></div>'
                                    html += '<div><span>姓名：</span><span class="uName">' + data[i]['UName'] + '</span></div>'

                                }
                                $("#deleteContainer ul.thumbnails").empty().append(html)
                                $('#deleteContainer ul.thumbnails .thumbnail').off('click').on('click', function () {
                                    var cla = this.className.split('thumbnail ')[1]         //取到类名，去掉thumbnail和空格
                                    $('#deleteContainer ul.thumbnails').empty()
                                    displayDeleteInfo(data[cla])
                                })
                            }


                            function displayDeleteInfo(data) {
                                $('#deleteContainer .queryInfoContent').css('display', 'block')
                                $('#deleteContainer .queryInfoContent .queryInfo .payId').text(data['payId']);
                                $('#deleteContainer .queryInfoContent .queryInfo .name').text(data['UName']);
                                $('#deleteContainer .queryInfoContent .queryInfo .department').text(data['department']);
                                $('#deleteContainer .queryInfoContent .queryInfo .birthDate').text(data['birthDate']);
                                $('#deleteContainer .queryInfoContent .queryInfo .txrq').text(data['txrq']);
                                $('#deleteContainer .queryInfoContent .queryInfo .status').text(data['status']);
                                $('#deleteContainer .queryInfoContent .queryInfo .pc').text(data['PC']);
                                $('#deleteContainer .queryInfoContent .queryInfo .sjDate').text(data['sjDate']);
                                $('#deleteContainer .queryInfoContent .queryInfo .sjRemark').text(data['sjRemark']);
                                $('#deleteContainer .queryInfoContent .queryInfo .driveCode').text(data['sjDriveCode']);
                                $('#deleteContainer .queryInfoContent .queryInfo .driveType').text(data['sjDriveType']);
                                $('#deleteContainer .queryInfoContent .queryInfo .startDate').text(data['startdate']);
                                $('#deleteContainer .queryInfoContent .queryInfo .deadline').text(data['deadline']);
                                $(".deleteButtonBanner").css('display', 'block')
                                boundDeleteEvent(data)
                            }
                        }
                        else {
                            $("#alertModal").modal('show')
                            $("#alertModal .text-warning").empty().text('您查询的信息不存在')
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
            else {
                $("#alertModal").modal('show')
                $("#alertModal .text-warning").empty().text('请输入拼音码（姓名拼音首字母，例如张三的拼音码是zs，不区分大小写）')
            }
        }
    }
    //证件编辑的按钮事件
    function boundEditEvent(data) {
        var payId = data['payId']
        var flag = true;
        //信息更正按钮
        $('.infoFix').off('click').on('click', function () {
            $(".logOutContent").css('display', 'none')
            var arr = [];
            var j = 0;
            for (var i in csData) {
                if (csData[i]['lb'] === 'zjlx') {
                    arr[j] = csData[i]['name'];
                    j++;
                }
            }
            if (!$(this).hasClass('commit')) {
                $(this).addClass('commit')
                alert('您现在可以对人员部分信息进行更正');
                $(this).text('确认更改').css({ 'color': 'GREEN', 'fontWeight': 'bold' })
                $("#editContainer .queryInfo input").prop('disabled', false).parent().css('backgroundColor', 'white');
                $("#editContainer .queryInfo .driveTypeInput").prop('disabled', true).parent().css('backgroundColor', 'inherit')
                $("#editContainer .queryInfo .payIdInput").focus(function () {
                    $(this).val('')
                })

                //准驾代码失焦，自动对应准驾类型
                $("#editContainer .queryInfo .driveCodeInput").blur(function () {
                    for (var i in csData) {
                        if ($(this).val() === csData[i]['name']) {
                            $('#editContainer .queryInfo .driveTypeInput').val(csData[i]['nr1'])
                        }
                    }
                    if (checkIfInArray($(this).val(), arr)) {
                        $("#editContainer .driveCode").css('backgroundColor', 'white')
                        flag = true;
                    } else {
                        $("#editContainer .driveCode").css('backgroundColor', '#ffcccc')
                        flag = false;
                        return false
                    }
                })
            } else {
                $(this).removeClass('commit')
                checkIfInArray($("#editContainer .queryInfo .driveCodeInput").val(), arr)
                //提交
                if ($("#editContainer .queryInfo .payIdInput").val().match(/^[0-9]{5}$/) && ($('#editContainer .queryInfo .sjDateInput').val().match(/^\d{4}-\d{2}-\d{2}$/) || $('#editContainer .queryInfo .sjDateInput').val() === '') && ($('#editContainer .queryInfo .yearlyCheckDateInput').val().match(/^\d{4}-\d{2}-\d{2}$/) || $('#editContainer .queryInfo .yearlyCheckDateInput').val() === '') && ($('#editContainer .queryInfo .startDateInput').val().match(/^\d{4}-\d{2}-\d{2}$/) || $('#editContainer .queryInfo .startDateInput').val() === '') && ($('#editContainer .queryInfo .deadlineInput').val().match(/^\d{4}-\d{2}-\d{2}$/) || $('#editContainer .queryInfo .deadlineInput').val() === '') && flag) {
                    if (confirm('确认要进行更改吗？')) {
                        var sjDate = $("#editContainer .queryInfo .sjDateInput").val() ? $("#editContainer .queryInfo .sjDateInput").val() : ' ';
                        var startDate = $("#editContainer .queryInfo .startDateInput").val() ? $("#editContainer .queryInfo .startDateInput").val() : ' '
                        var deadline = $("#editContainer .queryInfo .deadlineInput").val() ? $("#editContainer .queryInfo .deadlineInput").val() : ' ';
                        var yearlyCheckDate = $("#editContainer .queryInfo .yearlyCheckDateInput").val() ? $("#editContainer .queryInfo .yearlyCheckDateInput").val() : ' ';
                        var table = 'jbxx';
                        var setStr = 'payid =\'' + $("#editContainer .queryInfo .payIdInput").val() + '\',sjDate =\'' + sjDate + '\',yearlyCheckDate =\'' + yearlyCheckDate + '\',sjDriveCode =\'' + $("#editContainer .queryInfo .driveCodeInput").val() + '\',sjDriveType =\'' + $("#editContainer .queryInfo .driveTypeInput").val() + '\',startDate =\'' + startDate + '\',deadline = \'' + deadline + '\',sjRemark =\'' + $("#editContainer .queryInfo .sjRemarkInput").val() + '\'';
                        var where = ' where payid =\'' + payId + '\'';
                        var ajaxTimeOut = $.ajax({
                            url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                            type: "POST",
                            timeout: 8000,
                            dataType: 'text',
                            success: function (data) {
                                if (data === 'success') {
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-success").empty().text('信息修改成功')
                                    $('.infoFix').text('信息更正').css({ 'color': '#333', 'fontWeight': 'normal' })
                                    $("#editContainer .queryInfo input").prop('disabled', true).parent().css('backgroundColor', 'inherit');
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
                    else {
                        displayEdit()
                    }
                }
                else {
                    $(this).addClass('commit')
                    $("#alertModal").modal('show')
                    $("#alertModal .text-error").empty().text('请检查输入格式！(工资号为5位数字，日期格式为"xxxx-xx-xx")')
                }

            }


        })
        $('.phyTestOk').off('click').on('click', function () {
            var table = 'jbxx';
            var setStr = 'phyTest = \'' + csData['tjjl-hg']['nr2'] + '\'';
            var where = ' where payid =\'' + data['payId'] + '\'';

            if (confirm(data['UName'] + '师傅的体检结论合格，确定？')) {
                $.ajax({
                    url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                    type: "POST",
                    timeout: 8000,
                    dataType: 'text',
                    success: function (data) {
                        if (data === 'success') {
                            $('#editContainer .queryInfoContent .phyTest').text(csData['tjjl-hg']['nr2'])
                        }
                    }
                })
            }
        })
        $('.phyTestNo').off('click').on('click', function () {
            if (confirm(data['UName'] + '师傅的体检结论不合格，确定？')) {
                var table = 'jbxx';
                var setStr = 'phyTest = \'' + csData['tjjl-bhg']['nr2'] + '\'';
                var where = ' where payid =\'' + data['payId'] + '\'';
                $.ajax({
                    url: "./index.ashx?Method=update&table=" + table + "&setStr=" + setStr + "&where=" + where,
                    type: "POST",
                    timeout: 8000,
                    dataType: 'text',
                    success: function (data) {
                        if (data === 'success') {
                            $('#editContainer .queryInfoContent .phyTest').text(csData['tjjl-bhg']['nr2'])
                        }
                    }
                })
            }
        })
    }
    //证件注销的按钮事件
    function boundDeleteEvent(data) {
        var payId = data['payId']
        //证件注销按钮
        $('.logout').off('click').on('click', function () {
            $("#deleteContainer .logOutContent").css('display', 'block');
            $("#logOutReason").off('change').on('change', function () {
                var reason = $(this).val();
                if (data['status'] !== csData['zjzt-dc']['nr2'] && data['status'] !== csData['zjzt-zx']['nr2']) {
                    if ($(this).val() !== '--请选择--') {
                        if (confirm('确定要注销该证件吗？' + '注销原因是：' + $(this).val())) {
                            //update jbxx,insert bgxx
                            var uName = $("#deleteContainer .queryInfo .name").text()
                            var pym = $("#deleteContainer .queryInfo .name").text()
                            var setStr = ' status=\'' + csData['zjzt-zx']['nr2'] + '\'';
                            var where = ' where payid =\'' + payId + '\' AND uName=\'' + uName + '\'';
                            var table = 'jbxx'
                            var jbxxSql = 'UPDATE ' + table + ' SET ' + setStr + where;

                            var lotNumber = new Date();
                            lotNumber.month = lotNumber.getMonth() < 9 ? '0' + (lotNumber.getMonth() + 1) : lotNumber.getMonth() + 1;
                            lotNumber.date = lotNumber.getDate() < 10 ? '0' + lotNumber.getDate() : lotNumber.getDate();
                            lotNumber = lotNumber.getFullYear() + '-' + lotNumber.month + '-' + lotNumber.date;
                            var columnStrBgxx = 'lotNumber,Department,payId,archivesId,UName,changeType,changeReason,driveCode,drive,jykOperator';
                            var valueStrBgxx = '\'' + lotNumber + '\',\'' + data['department'] + '\',\'' + data['payId'] + '\',\'' + data['archivesId'] + '\',\'' + data['UName'] + '\',\'' + csData['czlb-zx']['nr2'] + '\',\'' + reason + '\',\'' + data['sjDriveCode'] + '\',\'' + data['sjDriveType'] + '\',\'' + sessionGet('user') + '\'';
                            var table = ' bgxx ';
                            var bgxxSql = 'INSERT INTO ' + table + '(' + columnStrBgxx + ') VALUES (' + valueStrBgxx + ')';
                            var type = csData['czlb-zx']['nr3'];
                            $.ajax({
                                url: "./index.ashx?Method=execTran&type=" + type + "&sqlStr=" + jbxxSql + "¿" + bgxxSql,
                                type: "POST",
                                timeout: 8000,
                                dataType: 'text',
                                success: function (data) {
                                    if (data === 'success') {
                                        $(".deleteButtonBanner").css('display', 'none')
                                        $(".logOutContent").css('display', 'none')
                                        $("#alertModal").modal('show')
                                        $("#alertModal .text-success").empty().text('已注销该证件')
                                    } else {
                                        $("#alertModal").modal('show')
                                        $("#alertModal .text-error").empty().text('操作未成功')
                                    }
                                }
                            })
                        }
                    }
                } else {
                    $("#alertModal").modal('show')
                    $("#alertModal .text-error").empty().text('该证件已注销或者调出，不能重复操作')
                }

            })
        })
    }
    function appendHistory() {
        var columns = ' id,archivesId,department,lotNumber,uName,changeType,changeReason,jykOperator'
        var where = ' where changeType=\'' + csData['czlb-zx']['nr3'] + '\''
        var order = ' order by lotnumber desc'
        var table = ' bgxx ';
        var db = 'jszglInfo'
        $.ajax({
            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),
            type: "POST",
            timeout: 8000,
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var table = $("#deleteHistoryTable");
                    var page = $("#deleteHistoryPage");
                    var thText = '<tr><th>id</th><th>档案号</th><th>部门</th><th>日期</th><th>姓名</th><th>操作类别</th><th>注销原因</th><th>教育科经办人</th><th>操作</th></tr>';
                    var eventFunction = boundBackEvent;
                    var extra = '<td><span class="back">撤回</span></td>';
                    commonAppendToTable(table, page, data, thText, extra, eventFunction)
                }
                /*
                var table = $("#dataTable");
                        var page = $("#dataPage");
                        var eventFunction = boundBackEvent;
                        commonAppendToTable(table,page,data,thText,extra,eventFunction)
                        $("#dataTable th:first-child,#dataTable td:first-child").css('visibility','hidden')

                */
            }
        })
    }
}


//教育科级配置参数
function options() {
    var power = sessionGet('power');
    if (power === jykPower) {
        $('#options').off('click').on('click', function (e) {
            e.preventDefault();
            $("#paramOption").modal('show');

        })
    }
    function displayCodeParam() {

    }
    displayCodeParam()
}


//添加汇总信息
function appendSummary(csData) {
        var html = '';
        var table1 = '铁路机车车辆驾驶人员资格考试合格人员汇总表';
        var table2 = '铁路机车车辆驾驶证（有效期满）换证申请汇总表';
        var table3 = '铁路机车车辆驾驶证（非有效期满）换证申请汇总表';
        var table4 = '铁路机车车辆驾驶证补证申请汇总表';
        var table5 = '（  ）年度铁路机车车辆驾驶人员聘用情况统计表';
        var table6 = '（      ）年度铁路机车车辆驾驶人员聘用情况汇总表';
        var summaryArr = ['--请选择--', table1, table2, table3, table4, table5, table6];
        for (var i = 0; i < summaryArr.length; i++) {
            html += '<option>' + summaryArr[i] + '</option>'
        }
        $("#summaryContainer .summaryBanner #summarySelect").append(html)
        $("#summarySelect").off('change').on('change', function () {
            if ($(this).val() === '--请选择--') {
                $("#summaryContainer .summaryBanner .htmlToXls").css('display', 'none')
            } else {
                $("#summaryContainer .summaryBanner .htmlToXls").css('display', 'block')
                //有效期满
                if ($(this).val() === table2) {
                    if ($('#yearSelect')) {
                        $('#yearSelect').remove()
                    }
                    var columns = ' uName,sex,cardId,birthDate,applyDriveCode,driveCode,startDate,deadline,sjRemark,phyTest';
                    var table = ' bgxx ';
                    var db = 'jszglInfo';
                    var order = ' order by uName ASC';
                    var where = ' where checkstatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND changeType =\'' + csData['czlb-yxqmhz']['nr3'] + '\' AND (finishStatus =\'' + csData['finishStatus-ffdcj']['nr2'] + '\' OR finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    var ajaxTimeOut1 = $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db),                        type: "POST",
                        timeout: 8000,
                        dataType: 'json',
                        success: function (data) {
                            if (data.length > 0) {
                                var count = data.length
                                var company = '郑州局集团公司';
                                var k = 1;
                                var obj = {}
                                for (var x in data) {
                                    obj.num = k;
                                    k++;
                                    obj.company = company;
                                    data[x] = Object.assign({}, obj, data[x]);
                                    data[x].tips = '';
                                }
                                var _html = '<thead><tr class="title"><td colspan="13">铁路机车车辆驾驶证（有效期满）换证申请汇总表</td></tr><tr class="info"><td colspan="13">(考试中心公章)    审核人：___________ 填报人：___________ 联系电话：___________ 填报日期：        年       月       日</td></tr></thead>'
                                var html = '<tr><th>序号</th><th>单位</th><th>姓名</th><th>性别</th><th>公民身份号码</th><th>出生日期</th><th>申请准驾类型代码</th><th>原证准驾类型代码</th><th>原证初次领证日期</th><th>原证有效截止日期</th><th>原证批准文号(公告号)</th><th>体检结论</th><th>备注</th></tr>';
                                var thText = _html + html;
                                var table = $("#summaryTable");
                                var page = '';
                                var eventFunction = '';
                                var extra = '';
                                commonAppendToTable(table, page, data, thText, extra, eventFunction)
                                $(".summaryBanner .htmlToXls").off('click').on('click', function () {
                                    if (confirm('是否要生成EXCEL表格')) {                                        
                                        $("#summaryTable").table2excel({
                                            exclude: ".excludeThisClass",
                                            name: "sheet1",
                                            filename: table2 
                                        });
                                    }
                                })
                            } else {
                                $("#alertModal").modal('show')
                                $("#alertModal .text-warning").empty().text('暂无有效期满汇总信息')
                            }
                        },
                        beforeSend: function () {
                            loadingPicOpen();
                            testSession(userSessionInfo);
                        },
                        complete: function (XMLHttpRequest, status) {
                            loadingPicClose();
                            if (status === 'timeout') {
                                ajaxTimeOut1.abort();    // 超时后中断请求
                                $("#alertModal").modal('show')
                                $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                            }
                        }
                    })
                }
                //非有效期满
                else if ($(this).val() === table3) {
                    if ($('#yearSelect')) {
                        $('#yearSelect').remove()
                    }                    
                    var columns = ' uName,sex,cardId,birthDate,applyDriveCode,driveCode,startDate,sjRemark,phyTest,changeReason';
                    var table = ' bgxx ';
                    var db = 'jszglInfo';
                    var order = ' order by uName ASC';
                    var where = ' where checkstatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND changeType =\'' + csData['czlb-fyxqmhz']['nr3'] + '\' AND (finishStatus =\'' + csData['finishStatus-ffdcj']['nr2'] + '\' OR finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    var ajaxTimeOut1 = $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db), type: "POST",
                        timeout: 8000,
                        dataType: 'json',
                        success: function (data) {
                            if (data.length > 0) {
                                var count = data.length
                                var company = '郑州局集团公司';
                                var k = 1;
                                var obj = {}
                                for (var x in data) {
                                    obj.num = k;
                                    k++;
                                    obj.company = company;
                                    data[x] = Object.assign({}, obj, data[x]);
                                    data[x].tips = '';
                                }
                                var _html = '<thead><tr class="title"><td colspan="13">铁路机车车辆驾驶证（非有效期满）换证申请汇总表</td></tr><tr class="info"><td colspan="13">(考试中心公章)    审核人：___________ 填报人：___________ 联系电话：___________ 填报日期：        年       月       日</td></tr></thead>'
                                var html = '<tr><th>序号</th><th>单位</th><th>姓名</th><th>性别</th><th>公民身份号码</th><th>出生日期</th><th>申请准驾类型代码</th><th>原证准驾类型代码</th><th>原证初次领证日期</th><th>原证批准文号(公告号)</th><th>体检结论</th><th>换证原因</th><th>备注</th></tr>';
                                var thText = _html + html;
                                var table = $("#summaryTable");
                                var page = '';
                                var eventFunction = '';
                                var extra = '';
                                commonAppendToTable(table, page, data, thText, extra, eventFunction)
                                $(".summaryBanner .htmlToXls").off('click').on('click', function () {
                                    if (confirm('是否要生成EXCEL表格')) {
                                        $("#summaryTable").table2excel({
                                            exclude: ".excludeThisClass",
                                            name: "sheet1",
                                            filename: table3
                                        });
                                    }
                                })
                            } else {
                                $("#alertModal").modal('show')
                                $("#alertModal .text-warning").empty().text('暂无非有效期满汇总信息')
                            }
                        },
                        beforeSend: function () {
                            loadingPicOpen();
                            testSession(userSessionInfo);
                        },
                        complete: function (XMLHttpRequest, status) {
                            loadingPicClose();
                            if (status === 'timeout') {
                                ajaxTimeOut1.abort();    // 超时后中断请求
                                $("#alertModal").modal('show')
                                $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                            }
                        }
                    })
                }
                //补证
                else if ($(this).val() === table4) {
                    if ($('#yearSelect')) {
                        $('#yearSelect').remove()
                    }
                    var columns = ' uName,sex,cardId,birthDate,applyDriveCode,driveCode,startDate,deadline,sjRemark';
                    var table = ' bgxx ';
                    var db = 'jszglInfo';
                    var order = ' order by uName ASC';
                    var where = ' where checkstatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND changeType =\'' + csData['czlb-bz']['nr3'] + '\' AND (finishStatus =\'' + csData['finishStatus-ffdcj']['nr2'] + '\' OR finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    var ajaxTimeOut1 = $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db), type: "POST",
                        timeout: 8000,
                        dataType: 'json',
                        success: function (data) {
                            if (data.length > 0) {
                                var count = data.length
                                var company = '郑州局集团公司';
                                var k = 1;
                                var obj = {}
                                for (var x in data) {
                                    obj.num = k;
                                    k++;
                                    obj.company = company;
                                    data[x] = Object.assign({}, obj, data[x]);
                                    data[x].tips = '';
                                }
                                var _html = '<thead><tr class="title"><td colspan="12">铁路机车车辆驾驶证补证申请汇总表</td></tr><tr class="info"><td colspan="12">(考试中心公章)    审核人：___________ 填报人：___________ 联系电话：___________ 填报日期：        年       月       日</td></tr></thead>'
                                var html = '<tr><th>序号</th><th>单位</th><th>姓名</th><th>性别</th><th>公民身份号码</th><th>出生日期</th><th>申请准驾类型代码</th><th>原证准驾类型代码</th><th>原证初次领证日期</th><th>原证有效截止日期</th><th>原证批准文号(公告号)</th><th>备注</th></tr>';
                                var thText = _html + html;
                                var table = $("#summaryTable");
                                var page = '';
                                var eventFunction = '';
                                var extra = '';
                                commonAppendToTable(table, page, data, thText, extra, eventFunction)
                                $(".summaryBanner .htmlToXls").off('click').on('click', function () {
                                    if (confirm('是否要生成EXCEL表格')) {
                                        $("#summaryTable").table2excel({
                                            exclude: ".excludeThisClass",
                                            name: "sheet1",
                                            filename: table4
                                        });
                                    }
                                })
                            } else {
                                $("#alertModal").modal('show')
                                $("#alertModal .text-warning").empty().text('暂无有效期满汇总信息')
                            }
                        },
                        beforeSend: function () {
                            loadingPicOpen();
                            testSession(userSessionInfo);
                        },
                        complete: function (XMLHttpRequest, status) {
                            loadingPicClose();
                            if (status === 'timeout') {
                                ajaxTimeOut1.abort();    // 超时后中断请求
                                $("#alertModal").modal('show')
                                $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                            }
                        }
                    })
                }
                //聘用统计表
                else if ($(this).val() === table5) {
                    $('#summaryTable').empty()
                    var date = new Date();
                    var yearArr = ['--请选择年份--', date.getFullYear() - 1, date.getFullYear()];
                    var _html = '<select id=\'yearSelect\'>';
                    for (var i = 0; i < yearArr.length; i++) {
                        _html += '<option>' + yearArr[i] + '</option>'
                    }
                    _html += '</select>'
                    if ($('#yearSelect')) {
                        $('#yearSelect').remove()
                    }
                    $("#summaryContainer .summaryBanner").append(_html)
                    $('#summaryContainer .summaryBanner #yearSelect').off('change').on('change', function () {
                        var year = $(this).val()
                        var columns = ' applyDriveCode,driveCode,changeType,changeReason';
                        var table = ' bgxx ';
                        var db = 'jszglInfo';
                        var order = ' ';
                        var where = ' where substring(lotnumber,1,4) =\''+year+'\' AND checkstatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND (finishStatus =\'' + csData['finishStatus-ffdcj']['nr2'] + '\' OR finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                        var ajaxTimeOut1 = $.ajax({
                            url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db), type: "POST",
                            timeout: 8000,
                            dataType: 'json',
                            success: function (bgData) {
                                if (bgData.length > 0) {                                    
                                    var columns = ' sjDriveCode';
                                    var table = ' jbxx ';
                                    var db = 'jszglInfo';
                                    var order = ' ';
                                    var where = ' where status !=\'' + csData['zjzt-dc']['nr2'] + '\' AND status !=\'' + csData['zjzt-zx']['nr2']+'\'';
                                    $.ajax({
                                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db), type: "POST",
                                        timeout: 8000,
                                        dataType: 'json',
                                        success: function (jbData) {
                                            console.log(bgData)
                                            console.log(jbData)
                                            function driveType(code) {
                                                this.code = code;                                                
                                                this.lastYearAmount = 0;
                                                this.yearlyAmount = 0;
                                                this.compare = 0;
                                                this.increase = 0;
                                                this.kshg = 0;
                                                this.dr = 0;
                                                this.jdzjjxIncrease = 0;
                                                this.otherIncrease = 0;
                                                this.decrease = 0;
                                                this.cx = 0;
                                                this.zx = 0;
                                                this.tx = 0;
                                                this.sw = 0;
                                                this.dc = 0;
                                                this.zj = 0;
                                                this.jdzjjxDecrease = 0;
                                                this.otherDecrease = 0;                                                
                                            }
                                            var table = {};
                                            table.J1 = new driveType('J1');
                                            table.J2 = new driveType('J2');
                                            table.J3 = new driveType('J3');
                                            table.crh = new driveType('CRH系列')
                                            table.J4 = new driveType('J4');
                                            table.A = new driveType('A');
                                            table.J5 = new driveType('J5');
                                            table.B = new driveType('B');
                                            table.J6 = new driveType('J6');
                                            table.C = new driveType('C');
                                            table.Jall = new driveType('J类合计');
                                            table.L1 = new driveType('L1');
                                            table.L2 = new driveType('L2');
                                            table.D = new driveType('D');
                                            table.L3 = new driveType('L3');
                                            table.E = new driveType('E');
                                            table.E1 = new driveType('E1');
                                            table.E2 = new driveType('E2');
                                            table.Lall = new driveType('L类合计');
                                            table.all = new driveType('合计');
                                            for (var i in bgData) {
                                                if (bgData[i]['changeType'] === csData['czlb-dc']['nr3']) {
                                                    //调出
                                                    table[bgData[i]['driveCode']].dc += 1;
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-levelup2']['nr2']) {
                                                    //提升
                                                    table[bgData[i]['driveCode']].increase += 1;
                                                    table[bgData[i]['driveCode']].kshg += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-dr']['nr3']) {
                                                    //调入
                                                    table[bgData[i]['driveCode']].increase += 1;
                                                    table[bgData[i]['driveCode']].dr += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-zx']['nr3'] && bgData[i]['changeReason'] === csData['zxyy-cx']['nr2']) {
                                                    //撤销
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                    table[bgData[i]['driveCode']].cx += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-zx']['nr3'] && bgData[i]['changeReason'] === csData['zxyy-qt']['nr2']) {
                                                    //其他减少
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                    table[bgData[i]['driveCode']].otherDecrease += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-zx']['nr3'] && bgData[i]['changeReason'] === csData['zxyy-sw']['nr2']) {
                                                    //死亡
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                    table[bgData[i]['driveCode']].sw += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-zx']['nr3'] && bgData[i]['changeReason'] === csData['zxyy-tx']['nr2']) {
                                                    //退休
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                    table[bgData[i]['driveCode']].tx += 1;
                                                } else if (bgData[i]['changeType'] === csData['czlb-zx']['nr3'] && (bgData[i]['changeReason'] === csData['zxyy-tcsq']['nr2'] || bgData[i]['changeReason'] === csData['zxyy-yxqmwx']['nr2'])) {
                                                    //注销
                                                    table[bgData[i]['driveCode']].decrease += 1;
                                                    table[bgData[i]['driveCode']].zx += 1;
                                                } else if (bgData[i]['driveCode'] !== '' && bgData[i]['applyDriveCode'] !== '') {
                                                    //原机型和新机型都存在，说明是换证补证
                                                    if (csData['zjlx-' + bgData[i]['driveCode']]['nr2'] < csData['zjlx-' + bgData[i]['applyDriveCode']]['nr2']) {
                                                        //原机型级别低于新机型，增驾
                                                        table[bgData[i]['applyDriveCode']].increase += 1;
                                                        table[bgData[i]['applyDriveCode']].kshg += 1;
                                                        table[bgData[i]['driveCode']].decrease += 1;
                                                        table[bgData[i]['driveCode']].zj += 1;
                                                    } else if (csData['zjlx-' + bgData[i]['driveCode']]['nr2'] > csData['zjlx-' + bgData[i]['applyDriveCode']]['nr2']) {
                                                        //原机型级别高于新机型，降低准驾机型
                                                        table[bgData[i]['applyDriveCode']].increase += 1;
                                                        table[bgData[i]['applyDriveCode']].jdzjjxIncrease += 1;
                                                        table[bgData[i]['driveCode']].decrease += 1;
                                                        table[bgData[i]['driveCode']].jdzjjxDecrease += 1;
                                                    } else if (csData['zjlx-' + bgData[i]['driveCode']]['nr2'] === csData['zjlx-' + bgData[i]['applyDriveCode']]['nr2']) {
                                                        //原机型级别等于新机型，
                                                        if (bgData[i]['driveCode'] !== bgData[i]['applyDriveCode']) {
                                                            //级别相等，名称不等，可能是A证换J4或J5换J6，需要更改
                                                            table[bgData[i]['applyDriveCode']].increase += 1;
                                                            table[bgData[i]['applyDriveCode']].otherIncrease += 1;
                                                            table[bgData[i]['driveCode']].decrease += 1;
                                                            table[bgData[i]['driveCode']].otherDecrease += 1;
                                                            //级别相等名称也相等，是有效期满换证或补证，不更改
                                                        }
                                                    }
                                                }
                                            }
                                            for (var j in jbData) {
                                                if (jbData[j]['sjDriveCode']) {
                                                    table[jbData[j]['sjDriveCode']].yearlyAmount += 1; 
                                                }
                                            }
                                            for (var y in table.crh) {
                                                if (y !== 'code') {
                                                    table.crh[y] = table.J1[y] + table.J2[y] + table.J3[y]
                                                }
                                            }
                                            for (var a in table.Jall) {
                                                if (a !== 'code') {
                                                    table.Jall[a] = table.J1[a] + table.J2[a] + table.J3[a] + table.J4[a] + table.A[a] + table.J5[a] + table.B[a] + table.J6[a] + table.C[a];
                                                }
                                            }
                                            for (var b in table.Lall) {
                                                if (b !== 'code') {
                                                    table.Lall[b] = table.L1[b] + table.L2[b] + table.D[b] + table.L3[b] + table.E[b] + table.E1[b] + table.E2[b]
                                                }
                                            }
                                            for (var c in table.all) {
                                                if (c !== 'code') {                                                    
                                                    table.all[c] = table.Jall[c] + table.Lall[c]
                                                }
                                            }
                                            for (var x in table) {
                                                table[x].compare = table[x].increase - table[x].decrease;
                                                table[x].lastYearAmount = table[x].yearlyAmount - table[x].compare; 
                                                console.log(table[x])
                                            }
                                            var _html = '<thead><tr class="title"><td colspan="18">(' + year + ')年度铁路机车车辆驾驶人员聘用情况统计表</td></tr><tr class="info"><td colspan="18">企业：___________ 审核人：___________ 填报人：___________ 联系电话：___________ 填报日期：        年       月       日</td></tr></thead>'
                                            var html = '<tr><th rowspan="3">准驾类型代码</th><th rowspan="3">上年度总数</th><th rowspan="3">统计年度总数</th><th rowspan="3">年度比较</th><th colspan="5">统计年度增加情况</th><th colspan="9">统计年度减少情况</th></tr>'
                                            html += '<tr><th rowspan="2">小计</th><th rowspan="2">考试合格</th><th rowspan="2">调入</th><th rowspan="2">降低准驾机型</th><th rowspan="2">其他</th><th rowspan="2">小计</th><th rowspan="2">撤销</th><th rowspan="2">注销</th><th rowspan="2">退休</th><th rowspan="2">死亡</th><th rowspan="2">调出</th><th rowspan="2">增驾</th><th rowspan="2">降低准驾机型</th><th rowspan="2">其他</th></tr><tr></tr>'
                                            var thText = _html + html;
                                            var target = $("#summaryTable");
                                            var page = '';
                                            var eventFunction = '';
                                            var extra = '';
                                            commonAppendToTable(target, page, table, thText, extra, eventFunction)
                                            $(".summaryBanner .htmlToXls").off('click').on('click', function () {
                                                if (confirm('是否要生成EXCEL表格')) {
                                                    $("#summaryTable").table2excel({
                                                        exclude: ".excludeThisClass",
                                                        name: "sheet1",
                                                        filename: table5.replace('（  ','（'+year)
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                                
                            },
                            beforeSend: function () {
                                loadingPicOpen();
                                testSession(userSessionInfo);
                            },
                            complete: function (XMLHttpRequest, status) {
                                loadingPicClose();
                                if (status === 'timeout') {
                                    ajaxTimeOut1.abort();    // 超时后中断请求
                                    $("#alertModal").modal('show')
                                    $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                                }
                            }
                        })
                    })
                }
                //聘用汇总表
                else if ($(this).val() === table6) {
                    var date1 = new Date();
                    var year = date1.getFullYear()
                    var columns = ' uName,sex,cardId,birthdate,sjDriveCode,sjDate';
                    var table = ' jbxx ';
                    var db = 'jszglInfo';
                    var order = ' ';
                    var where = ' where checkstatus = \'' + csData['checkStatus-shtg']['nr2'] + '\' AND changeType =\'' + csData['czlb-yxqmhz']['nr3'] + '\' AND (finishStatus =\'' + csData['finishStatus-ffdcj']['nr2'] + '\' OR finishStatus =\'' + csData['finishStatus-ffdgr']['nr2'] + '\')';
                    var ajaxTimeOut1 = $.ajax({
                        url: "./index.ashx?Method=select&columns=" + escape(columns) + "&table=" + escape(table) + "&where=" + escape(where) + "&order=" + escape(order) + "&db=" + escape(db), type: "POST",
                        type: "POST",
                        timeout: 8000,
                        dataType: 'json',
                        success: function (data) {
                            /*
                            var count = data.length;
                            var company = csData['dwmc-dwmc']['nr1'];
                            var k = 1;
                            var obj = {};
                            var obj2 = {};
                            for (var x in data) {
                                obj.num = k;
                                k++;
                                obj.company = company;
                                obj2.hireDate = ' ';
                                obj2.ifHire = '是';
                                data[x] = Object.assign({}, obj, data[x]);
                                data[x] = Object.assign({}, data[x], obj2);
                            }
                            var _html = '<thead><tr class="title"><td colspan="12">(' + year + ')年度铁路机车车辆驾驶人员聘用情况汇总表</td></tr><tr class="info"><td colspan="12">企业：___________ 审核人：___________ 填报人：___________ 联系电话：___________ 填报日期：        年       月       日</td></tr></thead>'
                            var th = '<tr><th>序号</th><th>单位</th><th>姓名</th><th>性别</th><th>公民身份号码</th><th>出生日期</th><th>准驾类型代码</th><th>初次领驾\u000d驶证日期</th><th>聘用日期</th><th>是否续聘</th><th>备注</th></tr>'
                            $("#summaryTable").empty().append(_html).append(th);
                            var html = ''
                            var thText = _html + html;
                            var table = $("#summaryTable");
                            var page = '';
                            var eventFunction = '';
                            var extra = '';
                            commonAppendToTable(table, page, data, thText, extra, eventFunction)
                            
                            $(".summaryBanner .htmlToXls").off('click').on('click', function () {
                                if (confirm('是否要生成EXCEL表格')){
                                    var filterArray = ['num', 'company', 'UName', 'sex', 'cardId', 'birthdate', 'sjDriveCode', 'startDate', 'hireDate', 'ifHire'];
                                    var headerArray = ['序号', '单位', '姓名', '性别', '公民身份号码', '出生日期', '准驾类型代码', '初次领驾\u000d驶证日期', '聘用日期', '是否续聘', '备注']
                                    var title = '（' + year + '）'
                                    var index = table6.indexOf('）');
                                    htmlToXls(data, title + table6.substring(index + 1, table6.length), filterArray, headerArray)
                                }
                            })
                            */
                        },
                        beforeSend: function () {
                            loadingPicOpen();
                            testSession(userSessionInfo);
                        },
                        complete: function (XMLHttpRequest, status) {
                            loadingPicClose();
                            if (status === 'timeout') {
                                ajaxTimeOut5.abort();    // 超时后中断请求
                                $("#alertModal").modal('show')
                                $("#alertModal .text-error").empty().text('网络超时，请检查网络连接')
                            }
                        }
                    })
                }
            }
        })    
}