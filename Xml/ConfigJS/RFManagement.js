DUI.profile.RFManagement = {
    divId: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "RFManagement") {
            return;
        }
        DUI.profile.RFManagement.divId = divId;
        DUI.profile.common.currenModule = moduleName;
        $("#" + divId).find("[name^='RFManagement_wsChannelPlanMode']").each(function () {
            DUI.profile.RFManagement.PlanModeDisable($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.RFManagement.PlanModeDisable($(this)); });
        });
        $("#" + divId).find("[name='RFManagement_wsPowerAdjustmentMode_PageData']").each(function () {
            DUI.profile.RFManagement.PowerAdjustmentMode($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.RFManagement.PowerAdjustmentMode($(this)); });
        });
    },
    PlanModeDisable: function (control) {
        var divId = "#" + DUI.profile.RFManagement.divId;
        var Hours = $(divId).find("#RFManagement_wsChannelPlanInterval_wsChannelPlanEntry_PageData");
        var Seconds = $(divId).find("#RFManagement_wsChannelPlanTime_wsChannelPlanEntry_PageData");
        //var value = $(control).next().text();
        var value = $(control).find("option:selected").text();
        if (value == "Manual") {
            controlisEnable(Hours, true); //控制控件是否可用
            controlisEnable(Seconds, true);
        }
        else if (value == "Interval") {
            controlisEnable(Hours, false);
            controlisEnable(Seconds, true);
        }
        else if (value == "Fixed Time") {
            controlisEnable(Hours, true);
            controlisEnable(Seconds, false);
        }
    },
    PowerAdjustmentMode: function (control) {
        var divId = "#" + DUI.profile.RFManagement.divId;
        var Interval = $(divId).find("#RFManagement_wsPowerAdjustmentInterval_PageData");
        var value = $(control).find("option:selected").text();
        controlisEnable(Interval, (value == "Manual") ? true : false);

    }
}

//var Role = Role || {
//    level: {//级别划分
//        red: "3", //最高级
//        orange: "2",
//        yellow: "1", //默认级别
//        blue: "0"
//    }
//}


