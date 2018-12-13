﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="jszgl.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>洛阳机务段机车驾驶证管理系统</title>
    <link rel="stylesheet" href="./source/font/iconfont.css"/>
    <link rel="stylesheet" href="./source/bootstrap/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="./source/css/index.css"/>
    <link rel="stylesheet" href="./source/bootstraptable/bootstrap-table.css"/>
</head>
<body>
    <div id="loadingPic">
    <p>正在连接,请稍候...</p>
</div>
<div class="navbar-fixed-top navbar-inverse">
    <div class="navbar-inner">
        <p class="welcome float">欢迎</p>
        <a href="#" class="floatR" id="options"><i class="icon-cog icon-white"></i></a>
        <p class="name floatR"></p>
    </div>
</div>

<div id="displayApplyContainer">

</div>
    <!--教育科：提升时选择批次-->
<div id="selectPC" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="selectPCLabel">请选择批次：</h3>
    </div>
    <div class="modal-body">
        <form action="" class="form-horizontal">
            <select name="year" id="year">

            </select>
            <div class="input-prepend input-append">
                <span class="add-on">年第</span>
                <select name="year" id="PCselect">

                </select>
                <span class="add-on">批</span>
            </div>
        </form>


    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">提交</button>
    </div>
</div>
    <!--上传最终报名名单时，若此人没在劳人科名单中，要输入档案号来查找-->
<div id="inputArchivesId" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-body">
        <form action="" class="form-horizontal">
            <fieldset>
                <legend>大名单中查无此人，请输入档案号：</legend>
                <label id="inputArchivesIdName"></label>
                <input id="inputArchivesIdInput" type="text" placeholder="请输入档案号：">
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary">提交</button>
    </div>
</div>
    <!--提升成功-->
<div id="tsSuccess" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="tsSuccessLabel">提升成功</h3>
    </div>
    <div class="modal-body">
        <p id="tsSuccessP"></p>
        <table id="tsSuccessTable" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"></table>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
    </div>
</div>
    <!--重名错名-->
<div id="appendSubmit" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="width: 800px;margin-left:-400px">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="appendSubmitLabel">请确认</h3>
    </div>
    <div class="modal-body">
        <div class="row">
            <p id="appendSubmitP1"></p>
            <div class="span4">
                <table id="appendSubmitTableLeft1" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped" style="visibility: hidden">
                    <thead>
                        <tr><th>姓名</th><th>机型</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="span5">
                <table id="appendSubmitTableRight1" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped" style="visibility: hidden">
                    <thead>
                        <tr><th>档案号</th><th>部门</th><th>姓名</th><th>报考机型</th><th>批次</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <p id="appendSubmitP2"></p>
            <div class="span4">
                <table id="appendSubmitTableLeft2" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped">
                    <thead>
                        <tr><th>姓名</th><th>机型</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="span5">
                <table id="appendSubmitTableRight2" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped">
                    <thead>
                        <tr><th>选择</th><th>档案号</th><th>部门</th><th>姓名</th><th>报考机型</th><th>批次</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <p id="appendSubmitLeftP3"></p>
            <div class="span4">
                <table id="appendSubmitTableLeft3" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped">
                    <thead>
                        <tr><th>姓名</th><th>机型</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="span5">
                <table id="appendSubmitTableRight3" cellpadding="0" cellspacing="0" class="table table-condensed table-bordered table-striped">
                    <thead>
                        <tr><th>选择</th><th>档案号</th><th>部门</th><th>姓名</th><th>报考机型</th><th>批次</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">提交</button>
    </div>
</div>
    <!--调入-->
<div id="drInfo" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="drInfoLabel">填写人员信息</h3>
    </div>
    <div class="modal-body">
        <form action="" class="form-horizontal">
            <div class="control-group">
                <label class="control-label">工资号：</label>
                <input class="payId uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">姓名：</label>
                <input class="name uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">拼音码：</label>
                <input class="pym uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">性别：</label>
                <input class="sex uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">部门：</label>
                <input class="department uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">身份证号：</label>
                <input class="cardId uneditable-input span3" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">出生日期：</label>
                <input class="birthDate uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">退休日期：</label>
                <input class="txrq uneditable-input span2" disabled/>
            </div>
            <div class="control-group">
                <label class="control-label">初次领证日期：</label>
                <input type="date" class="sjDateInput date span2"/>
            </div>
            <div class="control-group">
                <label class="control-label">准驾类型代码：</label>
                <input type="text" class="sjDriveCodeInput span2"/>
            </div>
            <div class="control-group">
                <label class="control-label">有效起始日期：</label>
                <input type="date" class="startDateInput date span2"/>
            </div>
            <div class="control-group">
                <label class="control-label">有效截止日期：</label>
                <input type="date" class="deadlineInput date span2" />
            </div>
        </form>


    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">提交</button>
    </div>
</div>
    <!--驳回申请-->
<div id="rejectModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="rejectModalLabel">选择驳回原因</h3>
    </div>
    <div class="modal-body">
        <form action="" class="form-horizontal">
            <label class="radio">
                <input type="radio" name="rejectReason" id="short" value="short" checked>
                材料不齐全
            </label>
            <label class="radio">
                <input type="radio" name="rejectReason" id="wrong" value="wrong">
                信息有误
            </label>
            <div class="control-group" style="margin-top: 20px">

            </div>
        </form>


    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">提交</button>
    </div>
</div>
    <!--上传图片-->
<div id="uploadImage" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="uploadImageLabel">上传照片</h3>
    </div>
    <div class="modal-body">
        <form class="form-horizontal" id="uploadImageForm" enctype="multipart/form-data">
            <div class="control-group">
                <h5>驾驶证扫描件：</h5>
                <img src="./source/images/broken.png" alt="驾驶证" id="cardPreview"/>
                <span class="btn uploadButton">
                    <span>浏览</span>
                    <input type="file" name="file" id="cardInput" accept="image/*"  onchange="setCardPreview();"/>
                </span>
            </div>
            <div class="control-group">
                <h5>身份证扫描件:</h5>
                <img src="./source/images/broken.png" alt="身份证" id="sfzPreview"/>
                <span class="btn uploadButton">
                    <span>浏览</span>
                    <input type="file" name="file" id="sfzInput" accept="image/*"  onchange="setSfzPreview();" />
                </span>
            </div>
            <div class="control-group">
                <h5>个人照片:</h5>
                <img src="./source/images/broken.png" alt="个人照片" id="photoPreview"/>
                <span class="btn uploadButton">
                    <span>浏览</span>
                    <input type="file" name="file" id="photoInput" accept="image/*"  onchange="setPhotoPreview();"/>
                </span>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">上传</button>
    </div>
</div>
    <!--审核界面显示图片-->
<div id="displayImage" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="displayImageLabel">图片材料</h3>
    </div>
    <div class="modal-body">
        <ul class="thumbnails">
            <li class="zoom"><img src=""/></li>
          <li class="photo">
              <div>
                  <img src="" alt="">
                  <span></span>
              </div>
              <p>个人照片</p>
          </li>          
          <li class="card img">
              <div>
                  <img src="" alt="">
                  <span></span>
              </div>
              <p>驾驶证</p>
          </li>
          <li class="sfz img">
              <div>
                  <img src="" alt="">
                  <span></span>
              </div>
              <p>身份证</p>
          </li>
        </ul>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-info">去上传</button>
    </div>
</div>
    <!--车间级人员登录，提醒预警-->
<div id="improveAlert" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="improveAlertLabel">请注意</h3>
    </div>
    <div class="modal-body">
        <p class="lead text-error">本车间有尚未完善照片（驾驶证扫描件、身份证正反面扫描件、电子照片）的人员</p>
        <table id="improveAlertTable" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"></table>
        <div id="improveAlertPage" class="text-center">
            <span class="prev">上一页</span>
            <span>第</span>
            <span class="cur"></span>
            <span>页&nbsp;/</span>
            <span>共</span>
            <span class="total"></span>
            <span>页</span>
            <span class="next">下一页</span>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">我知道了</button>
    </div>
</div>
    <!--教育科参数配置-->
<div id="paramOption" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="paramOptionLabel">参数设置</h3>
    </div>
    <div class="modal-body">
        <p class="text-info">在现实情况改变的情况下，请编辑参数：</p>
        <div class="accordion" id="accordion">
            <div class="accordion-group">
                <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                        准驾类型编辑
                    </a>
                </div>
                <div id="collapse1" class="accordion-body collapse in">
                    <div class="accordion-inner">
                        <p class="text-warning">准驾类型的等级用于判断是否可以由甲型转乙型，用数字表示（数字越大表示等级越高）。新增机型时，请参照已有的值来进行设置。</p>
                        <table id="paramOptionDriveCodeTable" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"></table>
                        <small>您可以对已有的准驾类型进行编辑或删除，也可以新加准驾类型</small>
                        <p class="lead">新增准驾类型</p>
                        <form class="form-horizontal">
                            <div class="control-group">
                                <label class="control-label" for="inputCode">准驾代码</label>
                                <div class="controls">
                                    <input type="text" id="inputCode" placeholder="例：J1">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="inputType">准驾机型</label>
                                <div class="controls">
                                    <input type="text" id="inputType" placeholder="例：动车组和内燃、电力机车">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="inputLevel">等级</label>
                                <div class="controls">
                                    <input type="text" id="inputLevel" placeholder="例：5">
                                </div>
                            </div>
                            <div class="control-group text-center">
                                <button class="btn btn-inverse">清除</button>
                                <button class="btn btn-primary">提交</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                        更改所需材料
                    </a>
                </div>
                <div id="collapse2" class="accordion-body collapse">
                    <div class="accordion-inner">
                        更改所需材料
                    </div>
                </div>
                <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                        有效期和预警期
                    </a>
                </div>
                <div id="collapse3" class="accordion-body collapse">
                    <div class="accordion-inner">
                        有效期和预警期
                    </div>
                </div>
                <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse4">
                        更改单位名称
                    </a>
                </div>
                <div id="collapse4" class="accordion-body collapse">
                    <div class="accordion-inner">
                        更改单位名称
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
        <button class="btn btn-primary">提交</button>

    </div>
</div>
    <!--公用提示框-->
<div id="alertModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="width: 400px;margin-left: -200px;top:20%;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="alertModalLabel">提示</h3>
    </div>
    <div class="modal-body">
        <p class="text-error"></p>
        <p class="text-info"></p>
        <p class="text-success"></p>
        <p class="text-warning"></p>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
    </div>
</div>

    <div id="bigContent">
    <div id="leftContent">
        <ul id="buttonList">
        </ul>
        <div id="foldButton"><i class="iconfont icon-zhedieleft"></i></div>
    </div>
    <div id="rightContent">
        <div class="operateContent">
            <!--提升-->
            <div class="jykUse" id="appendContainer">
                <div class="levelUpContent" id="tsContent">
                        <div class="buttonBanner">
                            <div class="float">
                                <p>上传报名名单表</p>
                                <a class="question" data-toggle="tooltip" title data-original-title="每一次提升司机，请先点击该页签，并在下方上传《》录入该批次人员信息">?</a>
                            </div>
                            <span>
                                <img src="./source/images/rightArrow.png" alt="">
                                <img src="./source/images/rightArrow.png" alt="">
                            </span>
                            <div class="float">
                                <p>考试通过</p>
                                <span class="question" data-toggle="tooltip" title data-original-title="考试结果下发后，请点击该页签，上传《》来标识通过考试的人员">?</span>
                            </div>
                            <div class="float">
                                <p>历史记录</p>
                                <span class="question" data-toggle="tooltip" title data-original-title="点此查阅过往批次通过情况">?</span>
                            </div>
                        </div>
                        <div class="uploadExcelContent content">
                            <form action="" class="form-horizontal">
                                <div class="control-group">
                                    <label style="width:auto;margin-left:210px" class="control-label" for="uploadExcel1">请先上传劳人科《具提升资格人员大名单》</label>
                                    <div class="controls">
                                        <input type="file" accept=" application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id="uploadExcel1"/>
                                    </div>
                                </div>
                                <div class="control-group" id="hiddenUpload" style="visibility: hidden;">
                                    <label style="width:auto;margin-left:251px" class="control-label" for="uploadExcel">再上传《司机理论考试信息一览表》</label>
                                    <div class="controls">
                                        <input type="file" accept=" application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id="uploadExcel"/>
                                    </div>
                                </div>
                            </form>

                            <div id="uploadContent"></div>
                            <button class="confirmUpload">上传信息</button>
                            <div class="progressBar">
                            <span class="floatR">
                                <span class="done"></span>
                                /
                                <span class="total"></span>
                            </span>
                            </div>
                        </div>
                        <div class="levelUpTableContent content">
                            <div class="control-group">
                                <input type="file" accept=" application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id="uploadExcel2"/>
                            </div>
                            <table id="appendTSTable" class="table table-bordered table-condensed table-striped"></table>
                        </div>
                        <div class="checkWithPCContent content">
                            <div class="control-group">
                                <select id="checkWithPCSelect" multiple="multiple"></select>
                                <button class="btn">查询</button>
                            </div>
                            <p class="pcStatus"></p>
                            <table id="checkWithPCTable" class="table table-bordered table-condensed"></table>
                            <div id="checkWithPCPage">
                                <span class="prev">上一页</span>
                                <span>第</span>
                                <span class="cur"></span>
                                <span>页&nbsp;/</span>
                                <span>共</span>
                                <span class="total"></span>
                                <span>页</span>
                                <span class="next">下一页</span>
                            </div>
                        </div>
                    </div>
                <div id="appendPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--调入调出-->
            <div class="jykUse" id="drdcContainer">
                <ul id="appendBanner" class="nav nav-tabs">
                    <li id="dr" class="float"><a href="#drContent">人员调入<span class="redPoint"></span></a></li>
                    <li id="quit" class="float"><a href="#quitContent">人员离职<span class="redPoint"></span></a></li>
                    <li id="drHistory" class="float"><a href="#drHistoryContent">调入记录</a></li>
                    <li id="dcHistory" class="float"><a href="#dcHistoryContent">调出记录</a></li>
                </ul>
                <div class="tab-content">
                    <div class="appendContent tab-pane" id="drContent">
                        <a href="Webshell://hello" class="float" id="updateDr">同步数据库</a>
                        <table id="appendDRTable" class="table table-striped table-bordered table-condensed"></table>
                        <p></p>
                    </div>
                    <div class="quitContent tab-pane" id="quitContent">
                        <table id="appendLZTable" class="table table-striped table-bordered table-condensed"></table>
                    </div>
                    <div class="tab-pane" id="drHistoryContent">
                        <div></div>
                        <table id="appendDRHistoryTable" class="table table-striped table-bordered table-condensed"></table>
                    </div>
                    <div class="tab-pane" id="dcHistoryContent">
                        <div></div>
                        <table id="appendDCHistoryTable" class="table table-striped table-bordered table-condensed"></table>
                    </div>
                </div>

                <div id="drdcPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--查询-->
            <div class="jykUse cjUse" id="queryCardContainer">
                <div id="queryCardContent">
                     <div id="toolBar">
                         <button type="button" class="btn btn-default" id="filterButton"><i class="icon icon-filter"></i> 筛选</button><button type="button" class="btn btn-default" id="exportButton"><i class="icon icon-upload"></i> 导出</button>
                     </div>
                    <div id="queryFilter" class="hid">
                        <form class="form-horizontal container" id="queryFilterForm">
                            <div class="row">
                                <div class="filterDepartmentDiv span2 offset3">
                                    <label class="checkbox inline" >
                                        按部门
                                    </label>
                                    <div class="btn-group">
                                        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                                            <b>选择</b> 
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu multiSelect">
                                        </ul>
                                    </div>
                                </div>
                                <div class="span5 filterAgeDiv">
                                <label class="checkbox inline" >
                                    按年龄
                                </label>
                                    <div class="input-append">
                                        <input class="input-mini value1" type="text" value="18"/><span class="add-on" style="border-radius:0;border-right:none">到</span>
                                    </div><div class="input-prepend">
                                        <input class="input-mini value2" type="text" value="65"/>
                                    </div>
                            </div>
                            </div>
                            <div class="row">
                                <div class="span3 offset2 filterSjDriveCodeDiv">
                                    <label class="checkbox inline" >
                                       按准驾代码
                                    </label>
                                    <div class="btn-group">
                                        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                                            <b>选择</b> 
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu multiSelect"></ul>
                                    </div>
                                </div>
                                <div class="span5 filterStatusDiv">
                                    <label class="checkbox inline" >
                                        按证件状态
                                    </label>
                                    <div class="btn-group">
                                        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
                                            <b>选择</b> 
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu multiSelect"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span5 offset3 filterPCDiv">
                                    <label class="checkbox inline" >
                                        按批次
                                    </label>
                                    <div class="input-append">
                                        <input class="input-mini value1" type="text"/>
                                    </div><div class="input-prepend input-append"><span class="add-on" style="border-radius:0;">年第</span><input class="input-mini value2" type="text"/><span class="add-on">批</span></div>
                                </div>
                                <div class="span2">
                                    <button class="btn queryBtn"><i class="icon-search"></i> 查询</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <table id="queryTable"></table>
                </div>
            </div>
            <!--历史记录-->
            <div class="cjUse" id="dataContainer">
                <div id="dataBanner"></div>
                <div id="dataContent" style="overflow: auto">
                    <table id="dataTable" class="table table-bordered table-striped"></table>
                </div>
                <div id="dataPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--换证-->
            <div class="jykUse cjUse" id="exchangeContainer">
                <ul id="exchangeBanner" class="nav nav-tabs">
                    <li class="float"><a href="#exchangeApplyAppendContent">登记换证</a></li>
                    <li class="float"><a href="#exchangeApplyCheckContent">换证审核</a></li>
                    <li class="float"><a href="#exchangeApplyGiveOutContent">换证发放</a></li>
                    <li class="float"><a href="#exchangeApplyHistoryContent">完成记录</a></li>
                    <li class="float"><a href="#exchangeApplyUndoneHistoryContent">未完成记录</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane" id="exchangeApplyAppendContent">
                        <table id="exchangeAppendTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="exchangeApplyCheckContent">
                        <table id="exchangeCheckTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="exchangeApplyGiveOutContent">
                        <div></div>
                        <table id="exchangeGiveOutTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="exchangeApplyHistoryContent">
                        <div></div>
                        <table id="exchangeHistoryTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="exchangeApplyUndoneHistoryContent">
                        <div></div>
                        <table id="exchangeUndoneHistoryTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                </div>

                <div id="exchangePage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--补证-->
            <div class="jykUse cjUse" id="fixContainer">
                <ul id="fixBanner" class="nav nav-tabs">
                    <li class="float"><a href="#fixApplyAppendContent">登记补证</a></li>
                    <li class="float"><a href="#fixApplyCheckContent">补证审核</a></li>
                    <li class="float"><a href="#fixApplyGiveOutContent">补证发放</a></li>
                    <li class="float"><a href="#fixApplyHistoryContent">完成记录</a></li>
                    <li class="float"><a href="#fixApplyUndoneHistoryContent">未完成记录</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane" id="fixApplyAppendContent">
                        <table id="fixAppendTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="fixApplyCheckContent">
                        <table id="fixCheckTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="fixApplyGiveOutContent">
                        <div>

                        </div>
                        <table id="fixGiveOutTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="fixApplyHistoryContent">
                        <div></div>
                        <table id="fixHistoryTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                    <div class="tab-pane" id="fixApplyUndoneHistoryContent">
                        <div></div>
                        <table id="fixUndoneHistoryTable" class="table table-bordered table-striped">

                        </table>
                    </div>
                </div>

                <div id="fixPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--预警-->
            <div class="jykUse cjUse" id="alertContainer">
                <div id="alertBanner">
                    <p class="p1">以下为</p>
                    <div class="selectArea"></div>
                    <p class="p2"></p>
                </div>
                <div id="alertContent">
                        <div id="alertTableContainer">
                            <table id="alertTable" class="table table-bordered table-striped">

                            </table>
                        </div>
                        <div id="alertPage">
                            <span class="prev">上一页</span>
                            <span>第</span>
                            <span class="cur"></span>
                            <span>页&nbsp;/</span>
                            <span>共</span>
                            <span class="total"></span>
                            <span>页</span>
                            <span class="next">下一页</span>
                        </div>
                </div>
            </div>
            <!--年鉴、完善信息-->
            <div class="cjUse" id="yearlyContainer">
                <div class="yearlyBanner">
                    <p class="tip float">请输入乘务员工资号：</p>
                    <input type="text" class="float queryInput">
                    <button class="queryButton float btn">查询</button>
                </div>
                <div class="queryInfoContent row-fluid">
                    <div class="row-fluid">
                        <div class="float queryPicInfo span6">
                            <label class="control-label">驾驶证</label>
                            <img src="" alt="驾驶证" id="jszPic">
                        </div>
                        <div class="float queryPicInfo span6">
                            <label class="control-label">身份证</label>
                            <img src="" alt="身份证" id="sfzPic">
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="span4 queryPicInfo">
                            <img src="" alt="个人照片" id="photoPic1">
                        </div>
                        <div class="span7 offset1">
                            <div class="queryInfo">
                                <div class="control-group">
                                    <p>工资号</p><div class="payId"></div>
                                    <p>姓名</p><div class="name"></div>
                                    <p>部门</p><div class="department"></div>
                                </div>
                                <div class="control-group">
                                    <p>有效起始</p><div class="startDate"></div>
                                    <p>有效截止</p><div class="deadline"></div>
                                </div>
                                <div class="control-group">
                                    <p>体检结论</p><div class="phyTest"></div>
                                    <p>年鉴时间</p><div class="yearlyCheckDate"><input type="date" class="yearlyCheckDateInput date"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="yearlyButtonBanner row-fluid">
                        <button class="phyTestOk btn">体检合格</button>
                        <button class="phyTestNo btn">体检不合格</button>
                        <button class="yearlyCheck btn">年鉴</button>
                        <button class="uploadImg btn">上传图片</button>
                    </div>
                </div>
            </div>
            <!--证件信息修改-->
            <div class="jykUse" id="editContainer">
                <div id="editBanner">
                    <p class="tip float">请输入您要修改信息的乘务员姓名拼音首字母（例：张三（zs））：</p>
                    <input type="text" class="float queryInput">
                    <button class="btn queryButton float">查询</button>
                </div>
                <ul class="thumbnails">
                </ul>
                <div class="queryInfoContent">
                    <div class="float queryPicInfo"><img src="" alt="" style="width: 80%;"></div>

                    <div class="float queryInfo">
                        <div class="control-group">
                            <p>工资号</p><div class="payId"><input type="text" class="payIdInput"></div>
                            <p>姓名</p><div class="name"></div>
                            <p>部门</p><div class="department"></div>
                        </div>
                        <div class="control-group">
                            <p>出生日期</p><div class="birth date"></div>
                            <p>司机领证日期</p><div class="sjDate"><input type="date" class="sjDateInput date"></div>
                        </div>
                        <div class="control-group">
                            <p>批准文号</p><div class="sjRemark"><input type="text" class="sjRemarkInput"></div>

                            <p>年鉴时间</p><div class="yearlyCheckDate"><input type="date" class="yearlyCheckDateInput date"></div>
                        </div>
                        <div class="control-group">
                            <p>准驾类型代码</p><div class="driveCode"><input type="text" class="driveCodeInput"></div>
                            <p>准驾机型</p><div class="driveType"><input type="text" class="driveTypeInput"></div>
                        </div>
                        <div class="control-group">
                            <p>有效起始</p><div class="startDate"><input type="date" class="startDateInput date"></div>
                            <p>有效截止</p><div class="deadline"><input type="date" class="deadlineInput date"></div>
                        </div>
                        <div class="control-group">
                            <p>体检结论</p><div class="phyTest"></div>
                        </div>
                    </div>
                </div>
                <div class="editButtonBanner">
                    <button class="infoFix btn">信息更正</button>
                    <button class="phyTestOk btn">体检合格</button>
                    <button class="phyTestNo btn">体检不合格</button>
                </div>
            </div>
            <!--注销-->
            <div class="jykUse" id="deleteContainer">
                <ul id="deleteTab" class="nav nav-tabs">
                    <li class="float"><a href="#deleteOperate">注销证件</a></li>
                    <li class="float"><a href="#deleteHistory">注销历史</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane" id="deleteOperate">
                        <div id="deleteBanner">
                            <p class="tip float">请输入您要注销证件的乘务员姓名拼音首字母（例：张三（zs））：</p>
                            <input type="text" class="float queryInput">
                            <button class="btn queryButton float">查询</button>
                        </div>
                        <ul class="thumbnails">
                        </ul>
                        <div class="queryInfoContent">
                            <div class="float queryInfo">
                                <div class="control-group">
                                    <p>工资号</p><div class="payId"></div>
                                    <p>姓名</p><div class="name"></div>
                                    <p>部门</p><div class="department"></div>
                                </div>
                                <div class="control-group">
                                    <p>出生日期</p><div class="birthDate"></div>
                                    <p>退休日期</p><div class="txrq"></div>
                                </div>
                                <div class="control-group">
                                    <p>司机领证日期</p><div class="sjDate"></div>
                                    <p>批次</p><div class="pc"></div>
                                </div>
                                <div class="control-group">
                                    <p>准驾类型代码</p><div class="driveCode"></div>
                                    <p>准驾机型</p><div class="driveType"></div>
                                </div>
                                <div class="control-group">
                                    <p>有效起始</p><div class="startDate"></div>
                                    <p>有效截止</p><div class="deadline"></div>
                                </div>
                                <div class="control-group">
                                    <p>批准文号</p><div class="sjRemark"></div>
                                    <p>证件状态</p><div class="status"></div>
                                </div>
                            </div>
                        </div>
                        <div class="deleteButtonBanner">
                            <button class="logout btn">证件注销</button>
                        </div>
                        <div class="logOutContent">
                            <span>请选择注销该证件的原因：</span>
                            <select name="" id="logOutReason"></select>
                        </div>
                    </div>
                    <div class="tab-pane" id="deleteHistory">
                        <table id="deleteHistoryTable" class="table table-bordered table-striped">

                        </table>
                        <div id="deleteHistoryPage">
                            <span class="prev">上一页</span>
                            <span>第</span>
                            <span class="cur"></span>
                            <span>页&nbsp;/</span>
                            <span>共</span>
                            <span class="total"></span>
                            <span>页</span>
                            <span class="next">下一页</span>
                        </div>
                    </div>
                </div>

            </div>
            <!--汇总-->
            <div class="jykUse" id="summaryContainer">
                <div class="summaryBanner">
                    <p>请选择您要查看的汇总信息:</p>
                    <select name="" id="summarySelect"></select>
                    <button class="htmlToXls">导出EXCEL</button>
                </div>
                <div class="summaryContent">
                    <table id="summaryTable"></table>
                </div>
                <div id="summaryPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
            <!--乘务员：个人信息-->
            <div class="sjUse" id="informationContainer">
                <div id="cardPicContent">
                    <img src="" alt="" style="width: 100%;height: 200px">
                </div>
                <div id="cardInfoContent">
                    <div class="control-group">
                        <p>姓名</p><div class="name"></div>
                        <p>出生日期</p><div class="birth"></div>
                    </div>
                    <div class="control-group">
                        <p>身份证号</p><div class="idCard"></div><p>准驾机型</p><div class="driveType"></div>
                    </div>
                    <div class="control-group">
                        <p>有效起始</p><div class="startDate"></div><p>有效截止</p><div class="deadline"></div>
                    </div>
                    <div class="control-group">
                        <p>初次领证日期</p><div class="sjDate"></div><p>年鉴时间</p><div class="yearlyCheckDate"></div>
                    </div>

                </div>
            </div>
            <!--乘务员：发起申请-->
            <div class="sjUse" id="applyContainer">
                <div id="btnArea">
                    <button id="back" class="btn">返回</button>
                    <button id="fixButton" class="btn btn-large btn-primary btn-block">驾驶证不慎遗失，申请补证</button>
                    <button id="yxqmButton" class="btn btn-large btn-primary btn-block">驾驶证有效期将满，申请换证</button>
                    <button id="fyxqmButton" class="btn btn-large btn-primary btn-block">其他原因需要换证</button>
                </div>

                <div id="fixTable">
                    <h1>铁路机车车辆驾驶证换（补）证申请表 </h1>
                    <div id="fixTableArea" class="borderAll">
                        <div class="borderAll">
                            <div class="float width572">
                                <div class="float width68 height35 borderBottom borderRight textCenter">姓名</div>
                                <div id="nameInTable" class="float width503 height35 borderBottom textCenter"></div>
                                <div class="float width68 height35 borderRight textCenter">性别</div>
                                <div id="sexInTable" class="float width125 height35 textCenter borderRight" style="width: 128px"></div>
                                <div class="width125 height35 borderRight float textCenter" style="width: 124px">出生日期</div>
                                <div class="width249 height35 float textCenter">
                                    <span id="birthYearInTable" class="height35"></span>年
                                    <span id="birthMonthInTable" class="height35"></span>月
                                    <span id="birthDateInTable" class="height35"></span>日
                                </div>
                                <div class="width572 float borderTop">
                                    <div class="width122 height35 float">公民身份号码</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                    <div class="cardIdInTable borderLeft width24 height35 float">1</div>
                                </div>
                                <div class="width572 borderTop float">
                                    <div class="width122 float height35">固定电话</div>
                                    <div class="width174 borderLeft float height35">
                                        <div class="width174 height35 noborder" id="fixedPhoneInTable"></div>
                                    </div>
                                    <div class="width99 borderLeft float height35 textCenter">移动电话</div>
                                    <div class="width174 borderLeft float height35">
                                        <div class="width174 height35 noborder" id="mobilePhoneInTable"></div>
                                    </div>
                                </div>
                                <div class="width572 float borderTop">
                                    <div class="width122 float height35 borderRight">所在企业</div>
                                    <div id="companyInTable" class="height35 width449 float textCenter">郑州局集团</div>
                                </div>
                            </div>
                            <div class="floatR width125 borderLeft borderBottom" style="height: 179px;width: 125px;">
                                <br><br>照片位置（供信息管理系统用，个人不贴）
                            </div>
                            <div class="float height35 width122 borderTop">通讯地址</div>
                            <div class="float height35 width449 borderLeft borderTop">
                                <input id="addressInTable" type="text" class="height35 width449 noborder"/>
                            </div>
                            <div class="float height35 width68 borderLeft textCenter">邮编</div>
                            <div class="float height35 borderLeft" style="width: 56px">
                                <input id="mailInTable" type="text" class="height35 width56 noborder"/>
                            </div>
                            <div class="float width122 height35 borderTop">申办类别</div>
                            <div class="float height35 width575 borderTop borderLeft">
                                <input type="checkbox" id="changeCheckBox" class="float" style="margin:10px 0 0 30px"/>
                                <label for="changeCheckBox" class="float height35" style="font-size: 14px;font-family: '仿宋';">换证</label>
                                <input type="checkbox" id="fixCheckBox" class="float" style="margin: 10px 0 0 80px"/>
                                <label for="fixCheckBox" class="float height35" style="font-size: 14px;font-family: '仿宋';">补证</label>
                            </div>
                            <div class="float height54 width122 borderTop">原证准驾<br>类型</div>
                            <div class="float width449 borderTop borderLeft height54 origin">
                                <input type="checkbox" id="originJ1" class="float"/>
                                <label for="originJ1" class="float">J1</label>
                                <input type="checkbox" id="originJ2" class="float"/>
                                <label for="originJ2" class="float">J2</label>
                                <input type="checkbox" id="originJ3" class="float"/>
                                <label for="originJ3" class="float">J3</label>
                                <input type="checkbox" id="originJ4" class="float"/>
                                <label for="originJ4" class="float">J4</label>
                                <input type="checkbox" id="originJ5" class="float"/>
                                <label for="originJ5" class="float">J5</label>
                                <input type="checkbox" id="originJ6" class="float"/>
                                <label for="originJ6" class="float">J6</label><br>
                                <input type="checkbox" id="originL1" class="float"/>
                                <label for="originL1" class="float">L1</label>
                                <input type="checkbox" id="originL2" class="float"/>
                                <label for="originL2" class="float">L2</label>
                                <input type="checkbox" id="originL3" class="float"/>
                                <label for="originL3" class="float">L3</label>
                                <input type="checkbox" id="originOther" class="float"/>
                                <label for="originOther" class="float">其他（</label>
                                <input disabled type="text" id="originOtherInput" class="noborder float" style="background-color:white;width: 40px;margin:1px 0 0 10px;height:16px;line-height: 16px"/>
                                <span class="float" style="font-weight: bold">）</span>
                            </div>
                            <div class="float width125 borderLeft height54 borderTop">
                                原证发证日期：<br>
                                <span id="originYearInTable"></span>年
                                <span id="originMonthInTable"></span>月
                                <span id="originDateInTable"></span>日
                            </div>
                            <div class="float height54 width122 borderTop">申请换（补）<br>证准驾类型</div>
                            <div class="float width575 borderTop borderLeft height54 apply">
                                <input type="checkbox" id="applyJ1" class="float"/>
                                <label for="applyJ1" class="float">J1</label>
                                <input type="checkbox" id="applyJ2" class="float"/>
                                <label for="applyJ2" class="float">J2</label>
                                <input type="checkbox" id="applyJ3" class="float"/>
                                <label for="applyJ3" class="float">J3</label>
                                <input type="checkbox" id="applyJ4" class="float"/>
                                <label for="applyJ4" class="float">J4</label>
                                <input type="checkbox" id="applyJ5" class="float"/>
                                <label for="applyJ5" class="float">J5</label>
                                <input type="checkbox" id="applyJ6" class="float"/>
                                <label for="applyJ6" class="float">J6</label><br>
                                <input type="checkbox" id="applyL1" class="float"/>
                                <label for="applyL1" class="float">L1</label>
                                <input type="checkbox" id="applyL2" class="float"/>
                                <label for="applyL2" class="float">L2</label>
                                <input type="checkbox" id="applyL3" class="float"/>
                                <label for="applyL3" class="float">L3</label>
                            </div>
                            <div class="float width122 height70 borderTop">健康检查结<br>论（换证填<br>选）</div>
                            <div class="float width575 borderTop borderLeft height70 phyCheck">
                                <input type="checkbox" id="phyOk" class="float" style="margin: 29px 0 0 15px"/>
                                <label for="phyOk" class="float height70" style="line-height: 70px">合格</label>
                                <input type="checkbox" id="phyNotOk" class="float" style="margin: 29px 0 0 35px"/>
                                <label for="phyNotOk" class="float height70" style="line-height: 70px">不合格</label>
                            </div>
                            <div class="float width122 height170 borderTop" style="line-height: 150px">申请原因</div>
                            <div class="float width575 height170 borderTop borderLeft reason">
                                <div class="width575 height28">
                                    <input type="checkbox" id="reasonDeadline" class="float"/>
                                    <label for="reasonDeadline" class="float">驾驶证有效期满</label><br>
                                </div>
                                <div class="width575 height28">
                                    <input type="checkbox" id="reasonContChange" class="float fyxqmhz"/>
                                    <label for="reasonContChange" class="float">驾驶证记载内容变化</label><br>
                                </div>
                                <div class="width575 height28">
                                    <input type="checkbox" id="reasonLower" class="float fyxqmhz"/>
                                    <label for="reasonLower" class="float">本人自愿降低准驾机型</label><br>
                                </div>
                                <div class="width575 height28">
                                    <input type="checkbox" id="cardBreak" class="float"/>
                                    <label for="cardBreak" class="float">驾驶证损毁</label><br>
                                </div>
                                <div class="width575 height28">
                                    <input type="checkbox" id="cardLost" class="float"/>
                                    <label for="cardLost" class="float">驾驶证丢失</label><br>
                                </div>
                                <div class="width575 height28">
                                    <input type="checkbox" id="otherReason" class="float fyxqmhz"/>
                                    <label for="otherReason" class="float">其他说明：</label>
                                    <input disabled type="text" class="float noborder" id="otherReasonText" style="background-color: white;height: 20px;line-height: 20px;font-size: 14px;font-family: '仿宋';"/>
                                </div>

                            </div>
                            <div class="float borderTop" style="width: 100%">
                                <div class="height35" style="text-align: left;margin-bottom: 20px">
                                    本人承诺上述填报内容真实有效。若提供虚假信息，本人承担相应法律责任。
                                </div>
                                <div class="floatR height35">
                                    年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日
                                </div>
                                <div class="floatR height35" style="margin-right: 100px">
                                    申请人签名：
                                </div>
                            </div>
                            <div class="width122 float borderTop" style="height: 97px;line-height: 24px">
                                <br>所在企业<br>意&nbsp;&nbsp;&nbsp;&nbsp;见
                            </div>
                            <div class="width575 float borderTop borderLeft">
                                <div style="height: 40px;line-height: 40px;text-align: left;margin-bottom: 20px">所需证明材料齐全，并已存入个人技术档案。</div>
                                <div class="floatR">
                                    ________年_______月________日<br>
                                    （所在企业公章）
                                </div>
                                <div class="floatR" style="margin-right: 80px">
                                    主管人员签名：
                                </div>
                            </div>
                            <div class="float width122 height35 borderTop">备注</div>
                            <div class="float width575 height35 borderTop borderLeft"></div>
                        </div>
                    </div>
                    <div style="text-align: left;text-indent: 8em;font-size: 14px;font-family: '仿宋'">注：此表为A4纸格式</div>
                </div>
                <button id="applySubmit">提交</button>
                <button id="print">打印</button>
            </div>
            <!--乘务员：证件状态-->
            <div class="sjUse" id="statusContainer" style="padding-top: 50px">
                <div>
                    <span id="firstName"></span><span>师傅，您的驾驶证状态为：</span>
                    <span id="cardStatus" style="text-decoration: underline"></span>                
                </div>
                <div id="alert"></div>
                <div id="applyInfo">
                    <table id="applyInfoTable" class="table table-bordered table-striped"></table>
                </div>
                <div id="applyInfoPage">
                    <span class="prev">上一页</span>
                    <span>第</span>
                    <span class="cur"></span>
                    <span>页&nbsp;/</span>
                    <span>共</span>
                    <span class="total"></span>
                    <span>页</span>
                    <span class="next">下一页</span>
                </div>
            </div>
        </div>
    </div>

</div>
</body>
<script>
    //上传图片
    function setCardPreview()
    {
        var cardInput=document.getElementById("cardInput");
        var cardPreview=document.getElementById("cardPreview");
        if(cardInput.files &&    cardInput.files[0])
        {
            //火狐下，直接设img属性
            cardPreview.style.display = 'block';
            cardPreview.style.width = '150px';
            cardPreview.style.height = '150px';
            //imgObjPreview.src = docObj.files[0].getAsDataURL();
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            cardPreview.src = window.URL.createObjectURL(cardInput.files[0]);
        }
        else
        {
            //IE下，使用滤镜
            cardInput.select();
            var imgSrc = document.selection.createRange().text;
            var cardPic = document.getElementById("cardPic");
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try
            {
                cardPic.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                cardPic.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
            }
            catch(e)
            {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            cardPreview.style.display = 'none';
            document.selection.empty();
        }
        return true;
    }
    function setPhotoPreview()
    {
        var photoInput=document.getElementById("photoInput");
        var photoPreview=document.getElementById("photoPreview");
        if(photoInput.files &&    photoInput.files[0])
        {
            //火狐下，直接设img属性
            photoPreview.style.display = 'block';
            photoPreview.style.width = '150px';
            photoPreview.style.height = '150px';
            //imgObjPreview.src = docObj.files[0].getAsDataURL();
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            photoPreview.src = window.URL.createObjectURL(photoInput.files[0]);
        }
        else
        {
            //IE下，使用滤镜
            photoInput.select();
            var imgSrc = document.selection.createRange().text;
            var cardPic = document.getElementById("cardPic");
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try
            {
                cardPic.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                cardPic.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
            }
            catch(e)
            {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            photoPreview.style.display = 'none';
            document.selection.empty();
        }
        return true;
    }
    function setSfzPreview()
    {
        var sfzInput=document.getElementById("sfzInput");
        var sfzPreview=document.getElementById("sfzPreview");
        if(sfzInput.files &&    sfzInput.files[0])
        {
            //火狐下，直接设img属性
            sfzPreview.style.display = 'block';
            sfzPreview.style.width = '150px';
            sfzPreview.style.height = '150px';
            //imgObjPreview.src = docObj.files[0].getAsDataURL();
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            sfzPreview.src = window.URL.createObjectURL(sfzInput.files[0]);
        }
        else
        {
            //IE下，使用滤镜
            photoInput.select();
            var imgSrc = document.selection.createRange().text;
            var cardPic = document.getElementById("cardPic");
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try
            {
                cardPic.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                cardPic.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
            }
            catch(e)
            {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            sfzPreview.style.display = 'none';
            document.selection.empty();
        }
        return true;
    }

</script>
<script type="text/javascript" src="./source/js/jquery-1.11.3.js"></script>
<script type="text/javascript" src="./source/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="./source/bootstraptable/bootstrap-table.js"></script>
<script type="text/javascript" src="./source/js/jsonExportExcel.min.js"></script>
<script type="text/javascript" src="./source/js/table2excel.js"></script>
<script type="text/javascript" src="./source/js/xlsx.min.js"></script>
<script type="text/javascript" src="./source/js/base_64.js"></script>
<script type="text/javascript" src="./source/js/newFunc.js"></script>
<script type="text/javascript" src="./source/js/jyk.js"></script>
<script type="text/javascript" src="./source/js/cj.js"></script>
<script type="text/javascript" src="./source/js/cwy.js"></script>
<script type="text/javascript" src="./source/js/index1.js"></script>

</html>
