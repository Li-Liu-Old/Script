DUI.profile.SystemConfiguration = {
    divId: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "SystemConfiguration") {
            return;
        }
        DUI.profile.SystemConfiguration.divId = divId;
        $("#" + divId).find("[id='SystemConfiguration_telnet_PageData']").each(function () {
            DUI.profile.SystemConfiguration.consoleProtocolClick($(this), "#SystemConfiguration_ssh_PageData");
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.SystemConfiguration.consoleProtocolClick($(this), "#SystemConfiguration_ssh_PageData"); });
        });
        $("#" + divId).find("[id='SystemConfiguration_ssh_PageData']").each(function () {
            DUI.profile.SystemConfiguration.consoleProtocolClick($(this), "#SystemConfiguration_telnet_PageData");
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SystemConfiguration.consoleProtocolClick($(this), "#SystemConfiguration_telnet_PageData"); });
        });

        $("#" + divId).find("[name='SystemConfiguration_lanIfGetIpAddressFrom_lanIfSettingEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SystemConfiguration.getIpFromChange(this); });
        });
    },
    getIpFromChange: function (control) {
        var divId = "#" + DUI.profile.SystemConfiguration.divId;
        var text = $(control).val();
        var subnet = $(divId).find("#SystemConfiguration_lanIfSubnetMask_lanIfSettingEntry_PageData");
        var gateway = $(divId).find("#SystemConfiguration_lanIfDefaultGateway_lanIfSettingEntry_PageData");
        var items = new Array(subnet, gateway);
        //控制控件是否可用 ControlisEnable(control, trueOrFalse)
        controlisEnable(items, (text == "Static") ? false : true);
    },
    consoleProtocolClick: function (control, id) {
        var divId = "#" + DUI.profile.SystemConfiguration.divId;
        var val = $(control).val(); //$(control).find("option:selected").val();
        var val2 = $(divId).find(id).val();
        var name = $(divId).find(id).attr("name");
        var timeOut = $(divId).find("#SystemConfiguration_timeout_PageData");
        controlisEnable(timeOut, false);
        if (val == "1") {//enable
            $(divId).find(id).val("0");
            $(control).attr("name", $(control).attr("id"));
            $(divId).find(id).attr("name", "Temp");
        } else {//Disable
            $(control).attr("name", "Temp");
            if (val2 == "0") {//Disable
                //$(divId).find(id).attr("name", "Temp");
                controlisEnable(timeOut, true);
            }
        }
    },
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.SystemConfiguration.divId;
        if (isResult == "True") {
            controlisEnable($(divId).find("[id$='_PageData']"), true);
        }
    },
    ResultControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.SystemConfiguration.divId;
        if (isResult == "True") {
            //SystemConfiguration_telnet_PageData  SystemConfiguration_ssh_PageData
            var telnet = "SystemConfiguration_telnet_PageData";
            var ssh = "SystemConfiguration_ssh_PageData";
            $(divId).find("#" + telnet).attr("name", telnet);
            $(divId).find("#" + ssh).attr("name", ssh);
        }
    }
}