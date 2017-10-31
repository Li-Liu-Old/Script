DUI.profile.GlobalConfiguration = {
    divId: "",
    httpPort: "GlobalConfiguration_cpAdditionalHttpPort_PageData",
    httpSecurePort: "GlobalConfiguration_cpAdditionalHttpSecurePort_PageData",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        DUI.profile.GlobalConfiguration.divId = divId;
        var httpPort = DUI.profile.GlobalConfiguration.httpPort;
        var httpSecurePort = DUI.profile.GlobalConfiguration.httpSecurePort;
        $("#" + divId).find("[name='" + httpPort + "']").each(function () {
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.GlobalConfiguration.httpPortControl($(this), httpSecurePort); });
        });
        $("#" + divId).find("[name='" + httpSecurePort + "']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.GlobalConfiguration.httpPortControl($(this), httpPort); });
        });
        if (operation == DUI.profile.common.operation.isFirst) {

        }
    },
    httpPortControl: function (control, id) {
        var divId = "#" + DUI.profile.GlobalConfiguration.divId;
        var val = $(control).val();
        window._control = control;
        var port = $(divId).find("#" + id);
        if (parseInt(val) > 0 && val == port.val() && !port.is(":hidden")) {
            ShowMsg(DUI.lang.CfgProfile.existPort.format(val), "", "sure", "DUI.profile.GlobalConfiguration.toAction();");
        }
    },
    toAction: function () {
        var divId = "#" + DUI.profile.GlobalConfiguration.divId;
        //$(divId).find("#" + pid).val("");
        $(window._control).val("");
    }
}