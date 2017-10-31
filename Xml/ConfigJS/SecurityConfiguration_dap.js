DUI.profile.SecurityConfiguration = {
    divId: "",
    authId: "SecurityConfiguration_dot11Authentication_dot11SecuritiesEntry_PageData",
    encryptionId: "SecurityConfiguration_dot11Encryption_dot11SecuritiesEntry_PageData",
    security: "None",
    authentication: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "SecurityConfiguration") {
            return;
        }
        DUI.profile.SecurityConfiguration.divId = divId;
        //bind event
        if (isBindEvent($("#" + divId).find("#wepKeySize"))) {//判断是否已经绑定方法，否则不需再绑定
            $("#" + divId).find("#wepKeySize").bind("change", function () {
                DUI.profile.SecurityConfiguration.wepKeySizeChange($(this));
            });
            $("#" + divId).find("#SecurityConfiguration_dot11WepKeyEntryMethod_dot11WepKeyEntry_PageData").bind("change", function () {
                DUI.profile.SecurityConfiguration.wepKeySizeChange($(this));
            });
        }
        DUI.profile.SecurityConfiguration.wepKeySizeChange();

        $("#" + divId).find("[name='SecurityConfiguration_dot11wepKeyIndex_dot11WepKeyEntry_PageData']").each(function () {
            DUI.profile.SecurityConfiguration.wepKeyIndexChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SecurityConfiguration.wepKeyIndexChange($(this)); });
        });

        $("#" + divId).find("#SecuritySetting").each(function () {
            DUI.profile.SecurityConfiguration.SecurityChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SecurityConfiguration.SecurityChange($(this)); });
        });
        $("#" + divId).find("#WPAModeSetting").each(function () {
            DUI.profile.SecurityConfiguration.wpaModeChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SecurityConfiguration.wpaModeChange($(this)); });
        });
        $("#" + divId).find("#WepAuthSetting").each(function () {
            DUI.profile.SecurityConfiguration.wepAuthChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.SecurityConfiguration.wepAuthChange($(this)); });
        });
    },
    wepKeySizeChange: function () {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var keyTypeID = "SecurityConfiguration_dot11WepKeyEntryMethod_dot11WepKeyEntry_PageData";
        var text = $(divId).find("#wepKeySize").find("option:selected").text(); //64 128
        var keyType = $(divId).find("#SecurityConfiguration_dot11WepKeyEntryMethod_dot11WepKeyEntry_PageData").find("option:selected").text(); //ASCII HEX
        var keyVal = $(divId).find("#SecurityConfiguration_dot11WepKey_dot11WepKeyEntry_PageData");
        var keySize = 0;
        if (text == 64) {
            if (keyType == "ASCII") {
                keySize = 5;
            } else if (keyType == "HEX") {
                keySize = 10;
            }
        } else if (text == 128) {
            if (keyType == "ASCII") {
                keySize = 13;
            } else if (keyType == "HEX") {
                keySize = 26;
            }
        }
        keyVal.attr("class", "validate[required,onlySize[" + keySize + "]]");
        keyVal.attr("maxlength", keySize);
        $(divId).find("#keyValueTip").text(keySize);
    },
    model: ["Static WEP,Open System", "None", "Static WEP,Share Key", "缺损值", "WPA Personal,WPA", "WPA Enterprise,WPA",
         "WPA Personal,WPA2", "WPA Enterprise,WPA2", "WPA Personal,AUTO", "WPA Enterprise,AUTO", "WEP IEEE802.1x"],
    SecurityChange: function (control) {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var text = $(control).find("option:selected").text();
        DUI.profile.SecurityConfiguration.security = text;
        var wep = $(divId).find("li[mp='wep']");
        var wpaPer = $(divId).find("li[mp='wpaPer']");
        var wpa = $(divId).find("li[mp='wpa']");
        var wpaEnt = $(divId).find("li[mp='wpaEnt']");
        var ieee802x = $(divId).find("li[mp='ieee802x']");
        var priRadius = $(divId).find("li[mp='priRadius']");
        var setText = $(divId).find("#SettingText");
        controlDisplay(mergeArray(wep, wpa, wpaPer, wpaEnt, ieee802x, priRadius), "none");
        controlDisplay($(setText).closest("li"), "");
        var authId = "#" + DUI.profile.SecurityConfiguration.authId;
        var encryptionId = "#" + DUI.profile.SecurityConfiguration.encryptionId; //1 enable 0 disable
        if (text == "Static WEP") {
            controlDisplay(mergeArray(wep), "");
            setText.text("Key Settings");
            DUI.profile.SecurityConfiguration.authentication = $(divId).find("#WepAuthSetting option:selected").text();
        } else if (text == "WEP IEEE802.1x") {
            controlDisplay(mergeArray(ieee802x, priRadius), "");
            setText.text("Primary RADIUS Server Settings");
        } else if (text == "WPA Personal") {
            controlDisplay(mergeArray(wpa, wpaPer), "");
            setText.text("PassPhrase Settings");
            DUI.profile.SecurityConfiguration.authentication = $(divId).find("#WPAModeSetting option:selected").text();
        } else if (text == "WPA Enterprise") {
            controlDisplay(mergeArray(wpa, wpaEnt, priRadius), "");
            setText.text("Primary RADIUS Server Settings");
            DUI.profile.SecurityConfiguration.authentication = $(divId).find("#WPAModeSetting option:selected").text();
        } else {//None
            controlDisplay($(setText).closest("li"), "none");
        }
        DUI.profile.SecurityConfiguration.setSecurityVal(DUI.profile.SecurityConfiguration.security, DUI.profile.SecurityConfiguration.authentication);
    },
    wpaModeChange: function (control) {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var authId = "#" + DUI.profile.SecurityConfiguration.authId;
        var encryptionId = "#" + DUI.profile.SecurityConfiguration.encryptionId; //1 enable 0 disable
        var text = $(control).find("option:selected").text();
        DUI.profile.SecurityConfiguration.authentication = text;

        DUI.profile.SecurityConfiguration.setSecurityVal(DUI.profile.SecurityConfiguration.security, DUI.profile.SecurityConfiguration.authentication);
    },
    wepAuthChange: function (control) {
        //Open System /Share Key
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var authId = "#" + DUI.profile.SecurityConfiguration.authId;
        var encryptionId = "#" + DUI.profile.SecurityConfiguration.encryptionId;
        var text = $(control).find("option:selected").text();
        DUI.profile.SecurityConfiguration.authentication = text;

        DUI.profile.SecurityConfiguration.setSecurityVal(DUI.profile.SecurityConfiguration.security, DUI.profile.SecurityConfiguration.authentication);
    },
    setSecurityVal: function (security, authentication) {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var authId = $(divId).find("#" + DUI.profile.SecurityConfiguration.authId);
        var encryptionId = $(divId).find("#" + DUI.profile.SecurityConfiguration.encryptionId); //1 enable 0 disable 
        var model = DUI.profile.SecurityConfiguration.model;
        var intVal = "1";
        if (model.in_array(security) != -1) {
            intVal = model.in_array(security);
        } else if (model.in_array(security + "," + authentication) != -1) {
            intVal = model.in_array(security + "," + authentication);
        }
        authId.val((intVal == "0") ? "1" : intVal);
        encryptionId.val((intVal == "2" || intVal == "0") ? "1" : "0");
    },
    //index变化引起另一个引用的index变化
    wepKeyIndexChange: function (control) {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var index = "#SecurityConfiguration_dot11KeyIndex_dot11SecuritiesEntry_PageData";
        $(divId).find(index).val($(control).find("option:selected").text());
    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        if (isResult == "True") {
            //controlisEnableTable($(divId).find("#wepKeySize"), true);
            $(divId).find("[name='otherControl']").attr("disabled", true);
        }
        //特殊值处理
        var authVal = $(divId).find("#" + DUI.profile.SecurityConfiguration.authId).val();
        var encVal = $(divId).find("#" + DUI.profile.SecurityConfiguration.encryptionId).val();
        DUI.profile.SecurityConfiguration.setSecurityStatus(authVal, encVal);

        var len = $(divId).find("#SecurityConfiguration_dot11WepKey_dot11WepKeyEntry_PageData").val().toString().length;//5,10-64
        $(divId).find("#wepKeySize").val((len == 5 || len == 10)?"64":"128");
    },
    setSecurityStatus: function (intVal, encVal) {
        var model = DUI.profile.SecurityConfiguration.model;
        var divId = "#" + DUI.profile.SecurityConfiguration.divId;
        var security = $(divId).find("#SecuritySetting");
        var wepAuth = $(divId).find("#WepAuthSetting");
        var wpaMode = $(divId).find("#WPAModeSetting");
        if (model[parseInt(intVal)]) {
            intVal = (encVal == "1" && intVal == "1") ? "0" : intVal;
            var val = model[parseInt(intVal)].split(",");
            if (intVal == "1" || intVal == "10") {
                security.val(val[0]);
            } else {
                security.val(val[0]);
                wepAuth.val(val[1]);
                wpaMode.val(val[1]);
            }
            autoAction(security);
            autoAction(wepAuth);
            autoAction(wpaMode);
        }
    }

}


