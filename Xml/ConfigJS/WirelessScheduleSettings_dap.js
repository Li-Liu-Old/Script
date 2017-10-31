DUI.profile.WirelessScheduleSettings = DUI.profile.WirelessScheduleSettings || {
    controls: null, //所有控件,除了status
    weekDays: null, //时间控件
    divId: "",
    moduleName: "",
    stateJson: null,
    jsonArr: null, //存放页面json对象
    talArr: new Array(), //存放页面临时对象
    DaysValueID: "WirelessScheduleSettings_dot11ScheduleDaysSelect_ScheduleRuleSetting_PageData", //星期ID
    SSIDIndexID: "WirelessScheduleSettings_dot11ScheduleSSIDIndex_ScheduleRuleSetting_PageData", //SSID Index ID
    startTime: "WirelessScheduleSettings_dot11ScheduleRuleStartTime_ScheduleRuleSetting_PageData",
    endTime: "WirelessScheduleSettings_dot11ScheduleRuleEndTime_ScheduleRuleSetting_PageData",
    allDaySelect: "WirelessScheduleSettings_dot11ScheduleAllDaySelect_ScheduleRuleSetting_PageData",
    statusId: "WirelessScheduleSettings_dot11ScheduleStatus_PageData",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "WirelessScheduleSettings") {
            return;
        }
        $("#dateMsg").text(DUI.lang.CfgProfile.oneDay);
        if (operation == DUI.profile.common.operation.isFirst) {//DUI.profile.WirelessScheduleSettings.divId == divId && 
            DUI.profile.WirelessScheduleSettings.jsonArr = null;
        }
        DUI.profile.WirelessScheduleSettings.moduleName = moduleName;
        DUI.profile.WirelessScheduleSettings.divId = divId;

        $(document).ready(function () {
            //获取PageData控件
            DUI.profile.WirelessScheduleSettings.controls = $("#" + divId).find("[name$='ScheduleRuleSetting_PageData']");
            DUI.profile.WirelessScheduleSettings.weekDays = $("#" + divId).find("input[name*='WeekDaysSelect']"); //星期控件
            //功能开启关闭控制
            $("#" + divId).find("[name*='WirelessScheduleSettings_dot11ScheduleStatus_PageData']").each(function () {
                if (oids != null) DUI.profile.WirelessScheduleSettings.ScheduleStatusClick($(this));
                if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                    $(this).bind("change", function () { DUI.profile.WirelessScheduleSettings.ScheduleStatusClick($(this)); });
            });
            //全周 或者 日期设置 
            $("#" + divId).find("[name='WeekDaysSelectControl']").each(function () {
                DUI.profile.WirelessScheduleSettings.WeekOrDayChange($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.WirelessScheduleSettings.WeekOrDayChange($(this)); });
            });
            //星期一到星期天 
            $("#" + divId).find("[name='WeekDaysSelect']").each(function () {
                if (isBindEvent($(this)))
                    $(this).bind("click", function () { DUI.profile.WirelessScheduleSettings.WeekDayChange($(this)); });
            });
            //全天 或者 时间设置 
            $("#" + divId).find("[id='WirelessScheduleSettings_dot11ScheduleAllDaySelect_ScheduleRuleSetting_PageData']").each(function () {
                DUI.profile.WirelessScheduleSettings.AllDayOrTimeChange($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.WirelessScheduleSettings.AllDayOrTimeChange($(this)); });
            });
            //日期值
            $("#" + divId).find("[id='WirelessScheduleSettings_dot11ScheduleDaysSelect_ScheduleRuleSetting_PageData']").each(function () {
                if (isBindEvent($(this)))
                    $(this).bind("change", function () {
                        //DUI.profile.WirelessScheduleSettings.DaysValChange($(this));
                    });
            });
            //时间控件
            setTimeControl("#WirelessScheduleSettings_dot11ScheduleRuleStartTime_ScheduleRuleSetting_PageData", "#WirelessScheduleSettings_dot11ScheduleRuleEndTime_ScheduleRuleSetting_PageData");
        });

    },
    //_jsonArr: null,
    //获取JSON数据
    getJSON: function (module) {
        HideAllValidate(); //去掉JQUERY验证红色框
        var result = false;
        if (module == DUI.profile.WirelessScheduleSettings.moduleName) {
            var jsonArr = DUI.profile.WirelessScheduleSettings.toJSON(DUI.profile.WirelessScheduleSettings.jsonArr);
            if (isEffective(jsonArr) && jsonArr.length > 0) {
                sendJson(jsonArr);
                result = true;
            }
        }
        return result;
    },
    toJSON: function (jsonArr) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var statusId = DUI.profile.WirelessScheduleSettings.statusId;
        var status = $(divId).find("#" + statusId).find("option:selected").text();
        var arr = [];
        if (status == "Disable") {
            var str = new StringBuilder();
            str.append("{\"").append(statusId).append("\":\"").append(status).append("\"}");
            arr.push(JSON.parse(str.toString()));
        } else {
            arr = (jsonArr != null) ? jsonArr.concat() : null;
            window._jsonArr = (jsonArr != null) ? jsonArr.concat() : null;
        }
        return arr;
    },
    //恢复临时数据
    toRestoreData: function (jsonBack, isResult, divId) {
        if (!isEffective(jsonBack)) {
            return;
        }
        var talArr = new Array();
        var statusId = DUI.profile.WirelessScheduleSettings.statusId;
        if (jsonBack.length == 1 && jsonBack[0][statusId] == "Disable") {
            $("#" + divId).find("#" + statusId).val("Disable"); //给状态赋值
            if (isResult == "True") {
                //controlisEnableTable($("#" + divId).find("#InputTable"), true); //不可用控件                
                $("#" + divId).find("#StatusTable").css("display", "none"); //隐藏StatusTable  
                $("#" + divId).find("input[value='Add']").hide();
            }
        } else {
            //talArr = new Array();
            for (var i = 0; i < jsonBack.length; i++) {
                var tjson = jsonBack[i];
                talArr[i] = DUI.profile.WirelessScheduleSettings.jsonToObj(tjson);
            }
            for (var i = 0; i < talArr.length; i++) {
                DUI.profile.WirelessScheduleSettings.addNewRow(talArr[i], true);
            }

            DUI.profile.WirelessScheduleSettings.jsonArr = (window._jsonArr != undefined) ? window._jsonArr.concat() : jsonBack;
            DUI.profile.WirelessScheduleSettings.talArr = talArr;
            window._jsonArr = null;
            return true;
        }
    },
    _json: null,
    _data: null,
    addNew: function () {
        if (!isEffective(DUI.profile.WirelessScheduleSettings.jsonArr)) {
            DUI.profile.WirelessScheduleSettings.jsonArr = new Array();
        }
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        if (!Submit()) {
            if ($(divId).find("#" + DUI.profile.WirelessScheduleSettings.DaysValueID).val() == 0) {
                validateSubmit($(divId).find("#dateDiv"), $(divId).find("#dateMsg"), true); //添加红色框显示
                return;
            }
            return;
        }
        var json = tableDataToJson($(divId).find("#dataTable"));
        var data = DUI.profile.WirelessScheduleSettings.jsonToObj(json); //json to data
        var num = DUI.profile.WirelessScheduleSettings.isExistJson(json[DUI.profile.WirelessScheduleSettings.SSIDIndexID]);
        var flag = true;
        if (num != -1) {//如果已经存在就替换原来数据
            flag = true;
            DUI.profile.WirelessScheduleSettings._json = json;
            DUI.profile.WirelessScheduleSettings._data = data;
            ShowMsg(DUI.lang.CfgProfile.existSiMsg, "", "sure", "DUI.profile.WirelessScheduleSettings.toAction(" + num + "," + flag + ");");
        } else {//不存在则新增加数据
            DUI.profile.WirelessScheduleSettings.talArr.push(data);
            DUI.profile.WirelessScheduleSettings.jsonArr.push(json);
            flag = false;
            DUI.profile.WirelessScheduleSettings.addNewRow(data, flag); //新增加一行显示数据
            //ClearForm(divId); //清空表单数据
            clearDataTable($(divId).find("#dataTable"));
        }
    },
    toAction: function (num, flag) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        DUI.profile.WirelessScheduleSettings.jsonArr[num] = DUI.profile.WirelessScheduleSettings._json;
        DUI.profile.WirelessScheduleSettings.talArr[num] = DUI.profile.WirelessScheduleSettings._data;
        DUI.profile.WirelessScheduleSettings.addNewRow(DUI.profile.WirelessScheduleSettings._data, flag); //新增加一行显示数据
        DUI.profile.WirelessScheduleSettings._data = null;
        DUI.profile.WirelessScheduleSettings._json = null;
        //ClearForm(divId); //清空表单数据
        clearDataTable($(divId).find("#dataTable"));
    },
    jsonToObj: function (json) {
        var SSIDIndexID = DUI.profile.WirelessScheduleSettings.SSIDIndexID;
        var DaysValueID = DUI.profile.WirelessScheduleSettings.DaysValueID;
        var startTime = DUI.profile.WirelessScheduleSettings.startTime;
        var endTime = DUI.profile.WirelessScheduleSettings.endTime;
        var allDaySelect = DUI.profile.WirelessScheduleSettings.allDaySelect;
        var data = new Object();
        data.Name = unescape(json["WirelessScheduleSettings_dot11ScheduleRuleName_ScheduleRuleSetting_PageData"]);
        if (data.Name == undefined) data.Name = "";
        data.SSIDIndex = unescape(json[SSIDIndexID]); //ssidindex
        if (data.SSIDIndex == undefined) data.SSIDIndex = "";
        data.Days = DUI.profile.WirelessScheduleSettings.getDaysByVal(parseFloat(json[DaysValueID]), "");
        if (data.Days == undefined) data.Days = "";
        var sTime = unescape(json[startTime]);
        if (sTime == undefined) sTime = "";
        var eTime = unescape(json[endTime]);
        if (eTime == undefined) eTime = "";
        var allDays = json[allDaySelect];
        if (allDays == undefined) allDays = "";
        var str = "";
        if (allDays == "Enable") {//Enable
            str = "AllDay(s)";
        } else if (allDays == "Disable") {
            str = sTime + "-" + eTime;
        } else {
            str = "";
        }
        data.TimeFrame = str;
        data.Wireless = "on";
        return data;
    },
    // All week 0 Sun 1 Mon 2 Tue 4 Wed 8 Thu 16 Fri 32 Sat 64  127
    week: ["All Week", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    getDaysByVal: function (dv, str) {
        var s = null;
        var week = DUI.profile.WirelessScheduleSettings.week;
        if (typeof (dv) != "number") {
            $.error("gerDayByVal param error:" + dv);
        }
        if (dv == 127) {
            return DUI.profile.WirelessScheduleSettings.week[0].toString();
        } else if (dv == 0) {
            s = str.substring(0, str.lastIndexOf(","));
            return s;
        } else if (dv >= 64) {
            str += week[7] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 64, str);
        } else if (dv >= 32) {
            str += week[6] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 32, str);
        } else if (dv >= 16) {
            str += week[5] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 16, str);
        } else if (dv >= 8) {
            str += week[4] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 8, str);
        } else if (dv >= 4) {
            str += week[3] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 4, str);
        } else if (dv >= 2) {
            str += week[2] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 2, str);
        } else if (dv >= 1) {
            str += week[1] + ",";
            return DUI.profile.WirelessScheduleSettings.getDaysByVal(dv - 1, str);
        }
    },
    //存在判断
    isExistJson: function (ssidIndex) {
        var jsonArr = DUI.profile.WirelessScheduleSettings.jsonArr;
        var SSIDIndexID = DUI.profile.WirelessScheduleSettings.SSIDIndexID;
        if (!isEffective(jsonArr)) {
            return -1;
        }
        if (ssidIndex) ssidIndex = ssidIndex.replace(/\%20/g, "").replace(/\./g, "");
        var type = typeof ssidIndex;
        if (type == 'string' || type == 'number') {
            for (var i = 0; i < jsonArr.length; i++) {
                var json = jsonArr[i];
                if (typeof (json) == "undefined") continue;
                if (ssidIndex == (json[SSIDIndexID]).replace(/\%20/g, "").replace(/\./g, "")) {//去掉所有空格
                    return i;
                }
            }
        }
        return -1;
    },
    addNewRow: function (data, flag) {
        if (!isEffective(data)) {
            $.error("addNewRow param error:" + data + "," + data.SSIDIndex);
            return;
        }
        var id = data.SSIDIndex.toString().replace(/ /g, "").replace(".", ""); //去掉空格
        var valueList = new Array(data.SSIDIndex, data.Name, data.Days, data.TimeFrame, data.Wireless);
        var paramList = new Array(data.SSIDIndex);
        tableAddRow("#" + DUI.profile.WirelessScheduleSettings.divId, "StatusTable", "StatusData_" + id, valueList, paramList)
    },
    EditData: function (divId, ssidIndex) {//编辑已保存的临时数据
        var num = DUI.profile.WirelessScheduleSettings.isExistJson(ssidIndex);
        if (num == -1) {//不存在
            return;
        }
        $("#" + DUI.profile.WirelessScheduleSettings.divId).find("#WirelessScheduleSettings_dot11ScheduleRuleStartTime_ScheduleRuleSetting_PageData").val("");
        $("#" + DUI.profile.WirelessScheduleSettings.divId).find("#WirelessScheduleSettings_dot11ScheduleRuleEndTime_ScheduleRuleSetting_PageData").val("");
        var json = DUI.profile.WirelessScheduleSettings.jsonArr[num];
        jsonToTableData($("#" + DUI.profile.WirelessScheduleSettings.divId).find("#dataTable"), json);
        DUI.profile.WirelessScheduleSettings.dayValControlSelect(parseFloat(json[DUI.profile.WirelessScheduleSettings.DaysValueID])); //日期值联动控制

    },
    //日期值联动控制
    dayValControlSelect: function (daysVal) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var days = DUI.profile.WirelessScheduleSettings.getDaysByVal(daysVal, "").split(",");
        //WeekDaysSelectControl
        $(divId).find("[name='WeekDaysSelectControl']").val((daysVal == '127') ? '127' : '0');
        //WeekDaysSelect
        $(divId).find("[name='WeekDaysSelect']").each(function () {
            var text = $(this).next("span").text();
            $(this).attr("checked", (daysVal == "127") ? true : days.contains(text));
        });
    },
    _control: null,
    _ssidIndex: null,
    DeleteRow: function (control, ssidIndex) {
        DUI.profile.WirelessScheduleSettings._control = control;
        DUI.profile.WirelessScheduleSettings._ssidIndex = ssidIndex;
        ShowMsg(DUI.lang.CfgProfile.delRowMsg, "", "sure", "DUI.profile.WirelessScheduleSettings.DeleteRow1()");
    },
    DeleteRow1: function DeleteRow1() {//删除当前一行数据
        var control = DUI.profile.WirelessScheduleSettings._control;
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var ssidIndex = DUI.profile.WirelessScheduleSettings._ssidIndex;
        var talArr = DUI.profile.WirelessScheduleSettings.talArr;
        $(control).parent().parent().remove();
        var num = DUI.profile.WirelessScheduleSettings.isExistJson(escape(ssidIndex));
        if (num != -1) {
            //DUI.profile.WirelessScheduleSettings.jsonArr.splice(num, 1);
            DUI.profile.WirelessScheduleSettings.jsonArr.removeAt(num);
        }
        if (isEffective(talArr) && talArr.length > 0) {
            for (var i = 0; i < talArr.length; i++) {
                var data = talArr[i];
                if (data.SSIDIndex == ssidIndex) {
                    //talArr.splice(i, 1);
                    talArr.removeAt(i);
                }
            }
        }
        checkNoData(divId, "StatusTable"); //检查NoData的情况
        DUI.profile.WirelessScheduleSettings._control = null;
        DUI.profile.WirelessScheduleSettings._ssidIndex = null;
    },
    //WirelessSchedule功能控制控件显示隐藏   
    ScheduleStatusClick: function (control) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var text = $(control).find("option:selected").text();
        var items = mergeArray(DUI.profile.WirelessScheduleSettings.controls, DUI.profile.WirelessScheduleSettings.weekDays, $(divId).find("#WeekDaysSelectControl"));
        controlisEnableTable(items, (text == "Enable") ? false : true);
        $(divId).find("#profileAddBtn").css("display", (text == "Enable") ? "" : "none");
        $(divId).find("#StatusTable").css("display", (text == "Enable") ? "" : "none");
        if (text == "Enable") {//enable
            if ($(divId).find("#WeekDaysSelectControl").val() == "127")
                controlisEnableTable($(divId).find("[name='WeekDaysSelect']"), true);
            if ($(divId).find("#" + DUI.profile.WirelessScheduleSettings.allDaySelect).val() == "Enable") {
                controlisEnableTable(mergeArray($(divId).find("#" + DUI.profile.WirelessScheduleSettings.startTime), $(divId).find("#" + DUI.profile.WirelessScheduleSettings.endTime)), true);
            }
        } else {
            HideAllValidate(); ClearTableValidate(); //去掉所有验证红色框
            validateSubmit($(divId).find("#dateDiv"), $(divId).find("#dateMsg"), false); //去掉红色框显示
        }
    },
    //时间选择控制函数  
    WeekOrDayChange: function (control) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var value = $(control).find("option:selected").val();
        var wds = $(divId).find("[name='WeekDaysSelect']");
        wds.attr("checked", (value == "127") ? true : false); //127 allweek       
        controlisEnableTable(wds, (value == "127") ? true : false);
        $(divId).find("#" + DUI.profile.WirelessScheduleSettings.DaysValueID).val(value);
    },
    //星期选择控制
    WeekDayChange: function (control) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var value = 0;
        $(divId).find("[name='WeekDaysSelect']").each(function () {
            if ($(this).is(":checked")) {
                value += parseFloat($(this).val());
            }
        });
        $(divId).find("#" + DUI.profile.WirelessScheduleSettings.DaysValueID).val(value); //给星期控件赋值
        validateSubmit($(divId).find("#dateDiv"), $(divId).find("#dateMsg"), (value == 0) ? true : false); //验证日期选择
    },
    //全天时间选择控制
    AllDayOrTimeChange: function (control) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        var value = $(control).val();
        var sTime = $(divId).find("#" + DUI.profile.WirelessScheduleSettings.startTime);
        var eTime = $(divId).find("#" + DUI.profile.WirelessScheduleSettings.endTime);
        var items = new Array(sTime, eTime);
        controlisEnableTable(items, (value == "Enable") ? true : false); //控件是否可用控制
    },
    DaysValChange: function (control) {
        //        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        //        var value = $(control).val();
        //        if (value == 0) {
        //            //WeekDaysSelectControl
        //            $(divId).find("input[name='WeekDaysSelectControl'][value='0']").attr("checked", true);
        //            DUI.profile.WirelessScheduleSettings.WeekOrDayChange($(divId).find("[name='WeekDaysSelectControl']"));
        //        }
    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.WirelessScheduleSettings.divId;
        if (isResult == "True") {
            controlisEnableTable($(divId).find("#WeekDaysSelectControl"), true);
            setReadOnlyToControl(divId);
        }
    }
}