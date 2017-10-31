DUI.profile.ManagedAccessPoint = {
    divId: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "ManagedAccessPoint") {
            return;
        }
        DUI.profile.ManagedAccessPoint.divId = divId;
        $("#" + divId).find("[name='ManagedAccessPoint_apMode_PageData']").each(function () {
            DUI.profile.ManagedAccessPoint.apModeChange($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.ManagedAccessPoint.apModeChange($(this)); });
        });
    },
    apModeChange: function (control) {
        var divId = "#" + DUI.profile.ManagedAccessPoint.divId;
        var items = $(divId).find("[id^='ManagedAccessPoint_apSwitchAddress']");
        var spp = $(divId).find("#ManagedAccessPoint_apSwitchPassPhrase_PageData");
        var text = $(control).find("option:selected").text();
        controlisEnable(mergeArray(items, spp), (text == "Enable") ? false : true);
    },
    CommonControl: function (xml, isResult, isEdit) {
        if (isResult == "True") {
        }
    }
}
