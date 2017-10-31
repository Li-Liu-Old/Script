//var DUI = DUI || {};
//DUI.profile = {};
DUI.profile.MultiSSIDConfiguration = {
    controls: "", //页面控件
    divId: "",
    moduleName: "",
    bandName: "MultiSSIDConfiguration_radioIndex_dot11MssidEntry,dot11MssidRADIUSEntry_PageData",
    ssidIndexName: "MultiSSIDConfiguration_dot11MssidIndex_dot11MssidEntry,dot11MssidRADIUSEntry_PageData",
    stateId: "MultiSSIDConfiguration_dot11MssidState_dot11MssidStateEntry_PageData",
    jsonArr: null,
    _jsonArr: null,
    _jsonResult: null,
    authId: "MultiSSIDConfiguration_dot11MssidAuthentication_dot11MssidEntry_PageData",
    encryptionId: "MultiSSIDConfiguration_dot11MssidEncryption_dot11MssidEntry_PageData",
    security: "None",
    authentication: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "MultiSSIDConfiguration") {
            return;
        }
        DUI.profile.MultiSSIDConfiguration.moduleName = moduleName;
        DUI.profile.MultiSSIDConfiguration.divId = divId;
        var dot24 = DUI.profile.DAP.getDot24();
        var dot5 = DUI.profile.DAP.getDot5();
        var dor24or5 = DUI.profile.DAP.getDot24or5();
        //if ((oids.indexOf(DUI.profile.DAP.dap2310) != -1 || oids.indexOf(DUI.profile.DAP.dap2360) != -1 || oids.indexOf(DUI.profile.DAP.dap2553) != -1
        // || oids.indexOf(DUI.profile.DAP.dap2590) != -1 || oids.indexOf(DUI.profile.DAP.dap3520) != -1)) {
        if(inArray(dot24,oids) || inArray(dor24or5,oids)){
            //if ((oids.indexOf(DUI.profile.DAP.dap2690) != -1 || oids.indexOf(DUI.profile.DAP.dap2690B) != -1 || oids.indexOf(DUI.profile.DAP.dap3690) != -1)) {
            if(inArray(dot5,oids)){
                //RADIUA Server 没有radioIndex
                $("#" + divId).find("#SecuritySetting option[value='WEP IEEE802.1x']").remove();
            }
            var radioIndex = "MultiSSIDConfiguration_radioIndex_dot11MssidEntry_PageData";
            $("#" + divId).find("#dot11MssidState").attr("name", radioIndex);
            DUI.profile.MultiSSIDConfiguration.bandName = radioIndex;
        } else {
            var oid = oids;
            DUI.profile.MultiSSIDConfiguration.bandName = "MultiSSIDConfiguration_radioIndex_dot11MssidEntry,dot11MssidRADIUSEntry_PageData";
        }
        $("#" + divId).find("[name='MultiSSIDConfiguration_dot11MssidState_dot11MssidStateEntry_PageData']").each(function () {
            DUI.profile.MultiSSIDConfiguration.SsidStateControl($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.MultiSSIDConfiguration.SsidStateControl($(this)); });
        });
        $("#" + divId).find("[name='MultiSSIDConfiguration_dot11MssidIndex_dot11MssidEntry,dot11MssidRADIUSEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.MultiSSIDConfiguration.SsidIndexChange($(this)); });
        });
        if (isBindEvent($("#" + divId).find("#wepKeySize"))) {
            $("#" + divId).find("#wepKeySize").bind("change", function () {
                DUI.profile.MultiSSIDConfiguration.wepKeySizeChange($(this));
            });
            $("#" + divId).find("#MultiSSIDConfiguration_dot11MssidKeyType_dot11MssidEntry_PageData").bind("change", function () {
                DUI.profile.MultiSSIDConfiguration.wepKeySizeChange($(this));
            });
        }
        DUI.profile.MultiSSIDConfiguration.wepKeySizeChange();

        $("#" + divId).find("#SecuritySetting").each(function () {
            DUI.profile.MultiSSIDConfiguration.SecurityChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.MultiSSIDConfiguration.SecurityChange($(this)); });
        });
        $("#" + divId).find("#WPAModeSetting").each(function () {
            DUI.profile.MultiSSIDConfiguration.wpaModeChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.MultiSSIDConfiguration.wpaModeChange($(this)); });
        });
        $("#" + divId).find("#WepAuthSetting").each(function () {
            DUI.profile.MultiSSIDConfiguration.wepAuthChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.MultiSSIDConfiguration.wepAuthChange($(this)); });
        });

        if (operation == DUI.profile.common.operation.isFirst) {
            DUI.profile.MultiSSIDConfiguration.jsonArr = null;
        }
    },
    //获取JSON数据
    getJSON: function (module) {
        HideAllValidate(); //去掉JQUERY验证红色框
        var result = false;
        if (module == DUI.profile.MultiSSIDConfiguration.moduleName) {
            var jsonArr = DUI.profile.MultiSSIDConfiguration.toUpdate(DUI.profile.MultiSSIDConfiguration.jsonArr);
            if (isEffective(jsonArr) && jsonArr.length > 0) {
                sendJson(jsonArr);
                result = true;
                if (DUI.profile.MultiSSIDConfiguration.jsonArr)
                    window._jsonArr = DUI.profile.MultiSSIDConfiguration.jsonArr.concat() || null; //临时保存
            }
        }
        return result;
    },
    toUpdate: function (arr) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var stateId = DUI.profile.MultiSSIDConfiguration.stateId;
        var bandId = "MultiSSIDConfiguration_radioIndex_dot11MssidStateEntry_PageData";
        var state = $(divId).find("#" + stateId + " option:selected").text();
        var band = $(divId).find("#dot11MssidState option:selected").text();
        if (!isEffective(band)) {
            $.error("toUpdate band :" + band);
        }
        var jsonArr = [];
        var flag = true;
        if (state == "Enable") {
            jsonArr = (arr != null) ? arr.concat() : [];
            if (jsonArr.length > 0) {
                var bandName = DUI.profile.MultiSSIDConfiguration.bandName; // "MultiSSIDConfiguration_radioIndex_dot11MssidEntry_PageData";
                for (var i = 0, len = jsonArr.length; i < len; i++) {
                    jsonArr[i][bandName] = band;
                }
            } else {
                flag = false;
            }
        }
        if (state == "Disable" || flag) {
            var json = DUI.profile.MultiSSIDConfiguration.toJSON(bandId, band, stateId, state);
            jsonArr.push(json);
        }
        return jsonArr;
    },
    toJSON: function (arg, arg2, arg3, arg4) {
        if (!arg || !arg2 || !arg3 || !arg4) {
            $.error("toJSON:" + arg + "," + arg2 + "," + arg3 + "," + arg4);
        }
        var jsonStr = new StringBuilder();
        jsonStr.append("{");
        jsonStr.append("\"").append(arg).append("\":\"").append(arg2).append("\",");
        jsonStr.append("\"").append(arg3).append("\":\"").append(arg4).append("\",");
        jsonStr.del(1).append("}");
        return JSON.parse(jsonStr.toString());
    },
    //恢复临时数据
    _tableFlag: false,
    toRestoreData: function (jsonBack, isResult, divId) {
        if (!isEffective(jsonBack)) {
            return;
        }
        var stateId = DUI.profile.MultiSSIDConfiguration.stateId;
        if (jsonBack.length == 1 && jsonBack[0][stateId] == "Disable") {
            var bandId = "MultiSSIDConfiguration_radioIndex_dot11MssidStateEntry_PageData";
            var stateId = DUI.profile.MultiSSIDConfiguration.stateId;
            var json = jsonBack[0];
            if (json[bandId] && json[stateId]) {
                $("#" + divId).find("#" + stateId).val(json[stateId]);
                $("#" + divId).find("#dot11MssidState").val(json[bandId]);
            }
            DUI.profile.MultiSSIDConfiguration._tableFlag = true;
            if (isResult == "True") {
                $("#" + divId).find("#StatusTable").hide(); //隐藏StatusTable
                $("#" + divId).find("#disableControls").hide();
                $("#" + divId).find("input[value='Add']").hide();
            }
        } else {
            var flag = -1;
            for (var i = 0; i < jsonBack.length; i++) {
                var json = jsonBack[i];
                if (json && !json[DUI.profile.MultiSSIDConfiguration.stateId]) {
                    DUI.profile.MultiSSIDConfiguration.addNewRow(json, true);
                } else {
                    flag = i;
                }
            }
            if (isResult == "True") {
                DUI.profile.MultiSSIDConfiguration._jsonResult = jsonBack[flag];
            }
            jsonBack.removeAt(flag);
            DUI.profile.MultiSSIDConfiguration.jsonArr = window._jsonArr || jsonBack;
            window._jsonArr = null;
            return true;
        }
    },
    wepKeySizeChange: function () {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var keyTypeID = "MultiSSIDConfiguration_dot11MssidKeyType_dot11MssidEntry_PageData";
        var keyValueID = "MultiSSIDConfiguration_dot11MssidWepKey_dot11MssidEntry_PageData";
        var text = $(divId).find("#wepKeySize").find("option:selected").text(); //64 128
        var keyType = $(divId).find("#" + keyTypeID).find("option:selected").text(); //ASCII HEX
        var keyVal = $(divId).find("#" + keyValueID);
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
    SsidStateControl: function (control) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var text = $(control).find("option:selected").text();
        $(divId).find("#StatusTable").css("display", (text == "Enable") ? "" : "none");
        $(divId).find("#addBtn").attr("disabled", (text == "Enable") ? false : true);
        $(divId).find("#addBtn").attr("class", (text == "Enable") ? "bgBtnInput" : "bgBtnInputD");
        controlisEnableTable($(divId).find("#disableControls").find("[name$='_PageData']"), (text == "Enable") ? false : true); ///控制控件是否可用
        $(divId).find("#wepKeySize").attr("disabled", (text == "Enable") ? false : true); //
        $(divId).find("[name='isResultDisplayControl']").css("display", (text == "Enable") ? "" : "none");
        $(divId).find("[name='otherControl']").attr("disabled", (text == "Enable") ? false : true);
        if (text == "Disable") {
            //去掉所有验证红色框
            HideAllValidate();
            ClearTableValidate();
        }
    },
    SsidIndexChange: function (control) {
        //var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        //var text = $(control).find("option:selected").text();
        //$(divId).find("#MultiSSIDConfiguration_dot11MssidSsid_dot11MssidEntry_PageData").val(text.replace("SSID", "dlink")); //动态赋值 
    },
    /*
    1: opensystem(1) 2: sharedkey(2) 3: opensystem-sharedkey(3) 4: wpa-psk(4) 
    5: wpa-eap(5) 	6: wpa2-psk(6) 	7: wpa2-eap(7) 	8: wpa2-auto-psk(8) 
    9: wpa2-auto-eap(9) 10: dot1x(10) 
    */
    model: ["Static WEP,Open System", "None", "Static WEP,Share Key", "缺损值", "WPA Personal,WPA", "WPA Enterprise,WPA",
         "WPA Personal,WPA2", "WPA Enterprise,WPA2", "WPA Personal,AUTO", "WPA Enterprise,AUTO", "WEP IEEE802.1x"],
    SecurityChange: function (control) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var text = $(control).find("option:selected").text();
        DUI.profile.MultiSSIDConfiguration.security = text;
        var wep = $(divId).find("li[mp='wep']");
        var wpaPer = $(divId).find("li[mp='wpaPer']");
        var wpa = $(divId).find("li[mp='wpa']");
        var wpaEnt = $(divId).find("li[mp='wpaEnt']");
        var ieee802x = $(divId).find("li[mp='ieee802x']");
        var priRadius = $(divId).find("li[mp='priRadius']");
        var setText = $(divId).find("#SettingText");
        controlDisplay(mergeArray(wep, wpa, wpaPer, wpaEnt, ieee802x, priRadius), "none");
        controlDisplay($(setText).closest("li"), "");
        var authId = "#" + DUI.profile.MultiSSIDConfiguration.authId;
        var encryptionId = "#" + DUI.profile.MultiSSIDConfiguration.encryptionId; //1 enable 0 disable
        if (text == "Static WEP") {
            controlDisplay(mergeArray(wep), "");
            setText.text("Key Settings");
            DUI.profile.MultiSSIDConfiguration.authentication = $(divId).find("#WepAuthSetting option:selected").text();
        } else if (text == "WEP IEEE802.1x") {
            controlDisplay(mergeArray(ieee802x, priRadius), "");
            setText.text("Primary RADIUS Server Settings");
        } else if (text == "WPA Personal") {
            controlDisplay(mergeArray(wpa, wpaPer), "");
            setText.text("PassPhrase Settings");
            DUI.profile.MultiSSIDConfiguration.authentication = $(divId).find("#WPAModeSetting option:selected").text();
        } else if (text == "WPA Enterprise") {
            controlDisplay(mergeArray(wpa, wpaEnt, priRadius), "");
            setText.text("Primary RADIUS Server Settings");
            DUI.profile.MultiSSIDConfiguration.authentication = $(divId).find("#WPAModeSetting option:selected").text();
        } else {//None
            controlDisplay($(setText).closest("li"), "none");
        }
        DUI.profile.MultiSSIDConfiguration.setSecurityVal(DUI.profile.MultiSSIDConfiguration.security, DUI.profile.MultiSSIDConfiguration.authentication);
    },
    wpaModeChange: function (control) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var authId = "#" + DUI.profile.MultiSSIDConfiguration.authId;
        var encryptionId = "#" + DUI.profile.MultiSSIDConfiguration.encryptionId; //1 enable 0 disable
        var text = $(control).find("option:selected").text();
        DUI.profile.MultiSSIDConfiguration.authentication = text;

        DUI.profile.MultiSSIDConfiguration.setSecurityVal(DUI.profile.MultiSSIDConfiguration.security, DUI.profile.MultiSSIDConfiguration.authentication);
    },
    wepAuthChange: function (control) {
        //Open System /Share Key
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var authId = "#" + DUI.profile.MultiSSIDConfiguration.authId;
        var encryptionId = "#" + DUI.profile.MultiSSIDConfiguration.encryptionId;
        var text = $(control).find("option:selected").text();
        DUI.profile.MultiSSIDConfiguration.authentication = text;

        DUI.profile.MultiSSIDConfiguration.setSecurityVal(DUI.profile.MultiSSIDConfiguration.security, DUI.profile.MultiSSIDConfiguration.authentication);
    },
    setSecurityVal: function (security, authentication) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var authId = $(divId).find("#" + DUI.profile.MultiSSIDConfiguration.authId);
        var encryptionId = $(divId).find("#" + DUI.profile.MultiSSIDConfiguration.encryptionId); //1 enable 0 disable 
        var model = DUI.profile.MultiSSIDConfiguration.model;
        var intVal = "1"; //None
        if (model.in_array(security) != -1) {
            intVal = model.in_array(security);
        } else if (model.in_array(security + "," + authentication) != -1) {
            intVal = model.in_array(security + "," + authentication);
        }
        authId.val((intVal == "0") ? "1" : intVal);
        encryptionId.val((intVal == "2" || intVal == "0") ? "1" : "0");
    },
    //判断新加的ssid数据是不是已经存在
    ssidIsExist: function (ssidIndex) {
        var jsonArr = DUI.profile.MultiSSIDConfiguration.jsonArr;
        var result = -1;
        var type = typeof ssidIndex;
        if (type == 'string') {
            for (var i = 0; i < jsonArr.length; i++) {
                var json = jsonArr[i];
                if (json[DUI.profile.MultiSSIDConfiguration.ssidIndexName] == ssidIndex) {
                    result = i;
                }
            }
        }
        return result;
    },
    _json: null, //临时变量
    addNew: function () {
        if (!isEffective(DUI.profile.MultiSSIDConfiguration.jsonArr)) {
            DUI.profile.MultiSSIDConfiguration.jsonArr = new Array();
        }
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var bandId = DUI.profile.MultiSSIDConfiguration.bandName;
        var band = $(divId).find("#dot11MssidState option:selected").text();
        var json = tableDataToJson($(divId).find("#disableControls"), "\"" + bandId + "\":\"" + band + "\","); //获取表单数据存为Json数据       
        var exist = DUI.profile.MultiSSIDConfiguration.ssidIsExist(json[DUI.profile.MultiSSIDConfiguration.ssidIndexName]);
        var flag = false;
        if (exist == -1) {//新增加        
            DUI.profile.MultiSSIDConfiguration.jsonArr.push(json);
            DUI.profile.MultiSSIDConfiguration.addNewRow(json, flag);
            clearDataTable($(divId).find("#disableControls")); //清空表单数据
        } else {
            flag = true;
            DUI.profile.MultiSSIDConfiguration._json = json;
            ShowMsg(DUI.lang.CfgProfile.existSobMsg, "", "sure", "DUI.profile.MultiSSIDConfiguration.toAction(" + flag + "," + exist + ");");
        }
    },
    toAction: function (flag, exist) {
        DUI.profile.MultiSSIDConfiguration.jsonArr[exist] = DUI.profile.MultiSSIDConfiguration._json;
        DUI.profile.MultiSSIDConfiguration.addNewRow(DUI.profile.MultiSSIDConfiguration._json, flag);
        DUI.profile.MultiSSIDConfiguration._json = null;
        clearDataTable($("#" + DUI.profile.MultiSSIDConfiguration.divId).find("#disableControls")); //清空表单数据
    },
    addNewRow: function (json, flag) {
        var ssidIndex = json[DUI.profile.MultiSSIDConfiguration.ssidIndexName];
        var ssidVisible = "MultiSSIDConfiguration_dot11MssidSuppress_dot11MssidEntry_PageData";
        var ssidName = "MultiSSIDConfiguration_dot11MssidSsid_dot11MssidEntry_PageData";
        //得到一个int值,需要转换成Security字符串
        var intVal = json[DUI.profile.MultiSSIDConfiguration.authId];
        var encVal = json[DUI.profile.MultiSSIDConfiguration.encryptionId];
        var model = DUI.profile.MultiSSIDConfiguration.model;
        var securityText = model[parseInt((encVal == "1" && intVal == "1") ? "0" : intVal)].split(",");
        if (securityText[0] == "Static WEP") {
            securityText = securityText[1];
        } else {
            securityText = securityText[0];
        }
        var valueList = new Array(ssidIndex, unescape(json[ssidName]), json[ssidVisible], securityText);
        var paramList = new Array(ssidIndex);
        if (!ssidIndex) {
            $.error("addNewRow param error:" + ssidIndex);
        }
        var id = "id_" + ssidIndex; //ID
        tableAddRow("#" + DUI.profile.MultiSSIDConfiguration.divId, "StatusTable", id, valueList, paramList);
    },
    EditData: function (divId, id) {
        var arr = id.split("_"); //id_SSID2
        var num = DUI.profile.MultiSSIDConfiguration.ssidIsExist(arr[1]);
        if (num == -1) {
            return;
        }
        var json = DUI.profile.MultiSSIDConfiguration.jsonArr[num];
        jsonToTableData($("#" + divId).find("#dataTable"), json);
        var bandId = "MultiSSIDConfiguration_radioIndex_dot11MssidStateEntry_PageData";
        var stateId = DUI.profile.MultiSSIDConfiguration.stateId;
        var _json = DUI.profile.MultiSSIDConfiguration._jsonResult;
        if (_json[bandId] && _json[stateId]) {
            $("#" + divId).find("#" + stateId).val(_json[stateId]);
            $("#" + divId).find("#dot11MssidState").val(_json[bandId]);
        }
        //特殊值处理
        var authVal = json[DUI.profile.MultiSSIDConfiguration.authId];
        var encVal = json[DUI.profile.MultiSSIDConfiguration.encryptionId];
        DUI.profile.MultiSSIDConfiguration.setSecurityStatus(authVal, encVal);

        $("#" + divId).find("[name='otherControl']").attr("disabled", true); //不可用
        var val = json["MultiSSIDConfiguration_dot11MssidWepKey_dot11MssidEntry_PageData"]; //5,10-64
        if (val) {
            var len = val.length;
            $("#" + divId).find("#wepKeySize").val((len == 5 || len == 10) ? "64" : "128");
            autoAction($("#" + divId).find("#wepKeySize"));
        }
    },
    _control: null,
    _ssidIndex: null,
    DeleteRow: function (control, ssidIndex) {
        DUI.profile.MultiSSIDConfiguration._control = control;
        DUI.profile.MultiSSIDConfiguration._ssidIndex = ssidIndex;
        ShowMsg(DUI.lang.CfgProfile.delRowMsg, "", "sure", "DUI.profile.MultiSSIDConfiguration.DeleteRow1()");
    },
    DeleteRow1: function () {
        var control = DUI.profile.MultiSSIDConfiguration._control;
        var ssidIndex = DUI.profile.MultiSSIDConfiguration._ssidIndex;
        $(control).parent().parent().remove();
        var num = DUI.profile.MultiSSIDConfiguration.ssidIsExist(ssidIndex);
        if (num != -1) {
            // DUI.profile.MultiSSIDConfiguration.jsonArr.splice(num, 1);
            DUI.profile.MultiSSIDConfiguration.jsonArr.removeAt(num);
        }
        checkNoData("#" + DUI.profile.MultiSSIDConfiguration.divId, "StatusTable"); //检查NoData的情况
        DUI.profile.MultiSSIDConfiguration._control = null;
        DUI.profile.MultiSSIDConfiguration._ssidIndex = null;
    },

    //控制控件是否可用 controlisEnableTable(control, trueOrFalse)
    //控制optenSystem选项下所有控件是否可用
    EncryptionChange: function (control) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        var text = $(control).find("option:selected").text();
        var controls = new Array($(divId).find("#MultiSSIDConfiguration_dot11MssidKeyType_dot11MssidEntry_PageData"),
                                $(divId).find("#MultiSSIDConfiguration_dot11MssidWepKeyIndex_dot11MssidEntry_PageData"),
                                $(divId).find("#MultiSSIDConfiguration_dot11MssidWepKey_dot11MssidEntry_PageData"),
                                $(divId).find("#MultiSSIDConfiguration_dot11MssidWepKeyIndex_dot11MssidEntry_PageData"));
        controlisEnableTable(controls, (text == "Enable") ? false : true);
        $(divId).find("#wepKeySize").attr("disabled", (text == "Enable") ? false : true);

    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
        if (isResult == "True") {
            if (DUI.profile.MultiSSIDConfiguration._tableFlag == true) {
                $(divId).find("#mpResultDiv").show();
                //controlisEnableTable($(divId).find("#mpResultDiv"), true); //不可用控件  
                $(divId).find("#StatusTable").hide(); //隐藏StatusTable
                $(divId).find("#disableControls").hide();
            }
            $(divId).find("#wepKeySize").attr("disabled", true);
            setReadOnlyToControl(divId);
        }
    },
    setSecurityStatus: function (intVal, encVal) {
        var model = DUI.profile.MultiSSIDConfiguration.model;
        var divId = "#" + DUI.profile.MultiSSIDConfiguration.divId;
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