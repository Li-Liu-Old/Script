DUI.profile.DhcpDynamicPoolConfiguration = {
    items: null,
    divId: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "DhcpDynamicPoolConfiguration") {
            return;
        }
        window._$ = DUI.profile.common.commonMethod;
        DUI.profile.DhcpDynamicPoolConfiguration.divId = divId;
        DUI.profile.DhcpDynamicPoolConfiguration.items = $("#" + divId).find("[id$='dhcpServerDynamicEntry_PageData']");
        $("#" + divId).find("[name='DhcpDynamicPoolConfiguration_dhcpServerDynamicControl_PageData']").each(function () {
            DUI.profile.DhcpDynamicPoolConfiguration.dhcpControl($(this));
            if (_$("isBindEvent", $(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.DhcpDynamicPoolConfiguration.dhcpControl($(this)); });
        });
        $("#" + divId).find("#DhcpDynamicPoolConfiguration_dynamicIpPoolEnd_dhcpServerDynamicEntry_PageData").each(function () {
            DUI.profile.DhcpDynamicPoolConfiguration.rangeConrol($(this));
            if (_$("isBindEvent", $(this)))
                $(this).bind("change", function () { DUI.profile.DhcpDynamicPoolConfiguration.rangeConrol($(this)); });
        });
        $("#" + divId).find("#DhcpDynamicPoolConfiguration_dynamicGateway_dhcpServerDynamicEntry_PageData").each(function () {
            if (_$("isBindEvent", $(this)))
                $(this).bind("change", function () { DUI.profile.DhcpDynamicPoolConfiguration.ipControl($(this)); });
        });
        $("#" + divId).find("#DhcpDynamicPoolConfiguration_dynamicWins_dhcpServerDynamicEntry_PageData").each(function () {
            if (_$("isBindEvent", $(this)))
                $(this).bind("change", function () { DUI.profile.DhcpDynamicPoolConfiguration.ipControl($(this)); });
        });
        $("#" + divId).find("#DhcpDynamicPoolConfiguration_dynamicDns_dhcpServerDynamicEntry_PageData").each(function () {
            if (_$("isBindEvent", $(this)))
                $(this).bind("change", function () { DUI.profile.DhcpDynamicPoolConfiguration.ipControl($(this)); });
        });
        if (operation == DUI.profile.common.operation.isFirst) {
        }
    },
    dhcpControl: function (control) {
        //        var divId = "#" + DUI.profile.DhcpDynamicPoolConfiguration.divId;
        //        var sIp = $(divId).find("#DhcpDynamicPoolConfiguration_dynamicIpPoolStart_dhcpServerDynamicEntry_PageData");
        //        var eIp = $(divId).find("#DhcpDynamicPoolConfiguration_dynamicIpPoolEnd_dhcpServerDynamicEntry_PageData");
        //        var subnetMask = $(divId).find("#DhcpDynamicPoolConfiguration_dynamicMask_dhcpServerDynamicEntry_PageData");
        //        var leaseTime = $(divId).find("#DhcpDynamicPoolConfiguration_dynamicLeaseTime_dhcpServerDynamicEntry_PageData");
        var value = $(control).find("option:selected").text();
        _$("controlisEnable", DUI.profile.DhcpDynamicPoolConfiguration.items, (value == "Disable") ? true : false);
        if (value == "Disable") {
            HideAllValidate(); //去掉所有验证红色框
        }

    },
    rangeConrol: function (control) {
        var val = parseInt($.trim($(control).val()));
        var divId = "#" + DUI.profile.DhcpDynamicPoolConfiguration.divId;
        var hid = $(divId).find("#Hidden_" + $(control).attr("id"));
        var ipv4 = /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/;
        var sIp = $.trim($(divId).find("#DhcpDynamicPoolConfiguration_dynamicIpPoolStart_dhcpServerDynamicEntry_PageData").val());
        if (ipv4.test(sIp) && val >= 1 && val <= 254) {

            ////sIp = sIp.substring(0, sIp.lastIndexOf(".") + 1) + val;  //modify by mhj 2017.8.23
            var endIp = parseInt(sIp.substring(sIp.lastIndexOf(".") + 1)) + val - 1;
            if (endIp > 254) {
                endIp = 254;
            }
            sIp = sIp.substring(0, sIp.lastIndexOf(".") + 1) + endIp;

            hid.val(sIp);
        }
    },
    ipControl: function (control) {
        var value = $(control).val();
        var id = $(control).attr("id");
        var name = $(control).attr("name");
        var divId = "#" + DUI.profile.DhcpDynamicPoolConfiguration.divId;
        if ($.trim(value) == "" && name.indexOf("_PageData") != -1 && name == id) {
            $(divId).find("#Hidden_" + id).attr("name", name);
            $(control).attr("name", "");
        } else {
            $(divId).find("#Hidden_" + id).attr("name", "");
            $(control).attr("name", id);
        }
    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.DhcpDynamicPoolConfiguration.divId;
        if (isResult == "True") {
            var ipRange = "DhcpDynamicPoolConfiguration_dynamicIpPoolEnd_dhcpServerDynamicEntry_PageData";
            var ip = $.trim($(divId).find("#Hidden_" + ipRange).val());

            ////$(divId).find("#" + ipRange).val(ip.substring(ip.lastIndexOf(".") + 1, ip.length)); //modify by mhj 2017.8.23
            var txtStartIp = "DhcpDynamicPoolConfiguration_dynamicIpPoolStart_dhcpServerDynamicEntry_PageData";
            var txtStartIpVal = $.trim($(divId).find("#" + txtStartIp).val());
            var startIp = parseInt(txtStartIpVal.substring(txtStartIpVal.lastIndexOf(".") + 1));
            var endIp = parseInt(ip.substring(ip.lastIndexOf(".") + 1));
            $(divId).find("#" + ipRange).val(endIp - startIp + 1);

            var gateway = "DhcpDynamicPoolConfiguration_dynamicGateway_dhcpServerDynamicEntry_PageData";
            var gwVal = $(divId).find("#Hidden_" + gateway).val();
            if (gwVal != "0.0.0.0") {
                $(divId).find("#" + gateway).val(gwVal);
            }
            var wins = "DhcpDynamicPoolConfiguration_dynamicWins_dhcpServerDynamicEntry_PageData";
            var winsVal = $(divId).find("#Hidden_" + wins).val();
            if (winsVal != "0.0.0.0") {
                $(divId).find("#" + wins).val(winsVal);
            }
            var dns = "DhcpDynamicPoolConfiguration_dynamicDns_dhcpServerDynamicEntry_PageData";
            var dnsVal = $(divId).find("#Hidden_" + dns).val();
            if (dnsVal != "0.0.0.0") {
                $(divId).find("#" + dns).val(dnsVal);
            }
            controlisEnable($(divId).find("[id$='dhcpServerDynamicEntry_PageData']"), true);
        }
    }
}