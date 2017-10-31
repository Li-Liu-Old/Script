DUI.profile.Networks = {
    divId: "",
    moduleName: "",
    jsonArr: null,
    talArr: new Array(), //存放页面临时数据
    wsNetworkId: "Networks_wsNetworkId_wsNetworkEntry,wsNetworkClientQosEntry_PageData", //ID Name
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "Networks") {
            return;
        }
        DUI.profile.Networks.moduleName = moduleName;
        DUI.profile.Networks.divId = divId;
        $(document).ready(function () {
            $("#" + divId).find("[name^='Networks_wsNetworkId_wsNetworkEntry,wsNetworkClientQosEntry_PageData']").each(function () {
                if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                    $(this).bind("change", function () { DUI.profile.Networks.NetworkIDChange($(this)); });
            });
            $("#" + divId).find("[name^='Networks_wsNetworkL3TunnelMode_wsNetworkEntry']").each(function () {
                DUI.profile.Networks.l3TunnelModeClick($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.l3TunnelModeClick($(this)); });
            });
            $("#" + divId).find("[name='Networks_wsNetworkDistTunnelMode_wsNetworkEntry_PageData']").each(function () {
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.l2TunnelModeClick($(this)); });
            });
            $("#" + divId).find("[name^='Networks_wsNetworkRedirectMode_wsNetworkEntry']").each(function () {
                DUI.profile.Networks.redirectModeClick($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.redirectModeClick($(this)); });
            });
            $("#" + divId).find("[name^='Networks_wsNetworkWEPKeyType']").each(function () {
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.WEPKeysTip($(this)); });
            });
            $("#" + divId).find("[name^='Networks_wsNetworkWEPKeyLength']").each(function () {
                DUI.profile.Networks.WEPKeysTip($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.WEPKeysTip($(this)); });
            });
            //WEPKeysTip(null);
            $("#" + divId).find("[name^='Networks_wsNetworkSecurityMode_wsNetworkEntry']").each(function () {
                DUI.profile.Networks.SecurityModeChange($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.SecurityModeChange($(this)); });
            });
            $("#" + divId).find("[name='Networks_wsNetworkUseWEPTransferKeyIndex_wsNetworkEntry_PageData']").each(function () {
                DUI.profile.Networks.WepKeyIndexChange($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.WepKeyIndexChange($(this)); });
            });

            //--------------DWS3026 Networks--------------- 
            $("#" + divId).find("[name^='Networks_wsNetworkUseProfileRadiusConfig_wsNetworkEntry']").each(function () {
                DUI.profile.Networks.UseProfileClick($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () { DUI.profile.Networks.UseProfileClick($(this)); });
            });
        });
        if (operation == DUI.profile.common.operation.isFirst) {
            DUI.profile.Networks.jsonArr = null;
        }
    },
    //获取JSON数据
    getJSON: function (module) {
        HideAllValidate(); //去掉JQUERY验证红色框
        var result = false;
        if (module == DUI.profile.Networks.moduleName) {
            if (isEffective(DUI.profile.Networks.jsonArr) && DUI.profile.Networks.jsonArr.length > 0) {
                sendJson(DUI.profile.Networks.jsonArr);
                result = true;
            }
        }
        return result;
    },
    toRestoreData: function (jsonBack, isResult, divId) {
        //局部刷新页面时恢复临时数据
        if (!isEffective(jsonBack)) {
            return;
        }
        for (var i = 0; i < jsonBack.length; i++) {
            if (typeof (jsonBack[i]) != "undefined") {
                DUI.profile.Networks.addNewRow(jsonBack[i], true);
            }
        }
        DUI.profile.Networks.jsonArr = jsonBack;
        return true;
    },
    DefaultNetworkID: 0, //存放用户当前选择的networkid
    NetworkIDChange: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        DUI.profile.Networks.DefaultNetworkID = $(divId).find("select[name=\'" + DUI.profile.Networks.wsNetworkId + "\']").find("option:selected").text(); //.val();
        clearDataTable($(divId).find("#dataTable"), $(control)); //清空表单数据
        $(divId).find("select[name=\'" + DUI.profile.Networks.wsNetworkId + "\']").val(DUI.profile.Networks.DefaultNetworkID);
    },
    _json: null,
    addNew: function () {//点击事件触发此方法
        if (!isEffective(DUI.profile.Networks.jsonArr)) {
            DUI.profile.Networks.jsonArr = new Array();
        }
        var divId = "#" + DUI.profile.Networks.divId;
        var json = tableDataToJson($(divId).find("#dataTable")); // getJsonText(); //获取当前json对象
        DUI.profile.Networks._json = json;
        var id = parseFloat(json[DUI.profile.Networks.wsNetworkId]);
        var exist = DUI.profile.Networks.idIsExist(id);
        var flag = false;
        if (exist != -1) {//添加已经存在的数据
            flag = true;
            ShowMsg(DUI.lang.CfgProfile.existSsidMsg, "", "sure", "DUI.profile.Networks.toAction(" + flag + "," + exist + ");");
        } else {
            DUI.profile.Networks.jsonArr.push(json); //把json存放到数组中
            DUI.profile.Networks.addNewRow(json, flag); //新增加一行显示数据
            //ClearForm(divId);//清空表单数据
            clearDataTable($(divId).find("#dataTable"));
        }
    },
    toAction: function (flag, exist) {//flag, exist
        var divId = "#" + DUI.profile.Networks.divId;
        DUI.profile.Networks.jsonArr[exist] = DUI.profile.Networks._json;
        DUI.profile.Networks.addNewRow(DUI.profile.Networks._json, flag);
        DUI.profile.Networks._json = null;
        //ClearForm(divId); //清空表单数据
        clearDataTable($(divId).find("#dataTable"));
    },
    //判断新加的ssid数据是不是已经存在
    idIsExist: function (id) {
        var jsonArr = DUI.profile.Networks.jsonArr;
        if (!isEffective(jsonArr)) {
            return -1;
        }
        var type = typeof id;
        if (type == 'string' || type == 'number') {
            for (var i = 0; i < jsonArr.length; i++) {
                var json = jsonArr[i];
                var jsonId = parseFloat(json[DUI.profile.Networks.wsNetworkId]);
                if (jsonId == id) {//exist
                    return i;
                }
            }
        }
        return -1;
    },
    //新增加一行数据
    addNewRow: function (json, flag) {
        var ssidName = "Networks_wsNetworkSSID_wsNetworkEntry_PageData";
        var vlanName = "Networks_wsNetworkDefaultVLANId_wsNetworkEntry_PageData";
        var hidessidName = "Networks_wsNetworkHideSSIDMode_wsNetworkEntry_PageData";
        var securityName = "Networks_wsNetworkSecurityMode_wsNetworkEntry_PageData";
        var networkID = json[DUI.profile.Networks.wsNetworkId];
        if (networkID != undefined) {
            var security = unescape(json[securityName]);
            if (security == "Static WEP") {
                security = json["Networks_wsNetworkStaticWEPAuthenticationMode_wsNetworkEntry_PageData"];
            }
            var valueList = new Array(networkID, unescape(json[ssidName]), json[vlanName], json[hidessidName], unescape(security));
            var paramList = new Array(networkID);
            //tableAddRow(tableID, rowID, valueList, paramList) 
            tableAddRow("#" + DUI.profile.Networks.divId, "StatusTable", "StatusData_" + networkID, valueList, paramList);
        }
    },
    EditData: function (divId, id) {
        var num = DUI.profile.Networks.idIsExist(parseFloat(id));
        if (num == -1) {//不存在
            return;
        }
        var json = DUI.profile.Networks.jsonArr[num];
        jsonToTableData($("#" + divId).find("#dataTable"), json);
    },
    _control: null,
    _id: null,
    DeleteRow: function (control, id) {
        DUI.profile.Networks._control = control;
        DUI.profile.Networks._id = id;
        ShowMsg(DUI.lang.CfgProfile.delRowMsg, "", "sure", "DUI.profile.Networks.DeleteRow1()");
    },
    DeleteRow1: function () {//删除当前一行数据
        var control = DUI.profile.Networks._control;
        var id = DUI.profile.Networks._id;
        $(control).parent().parent().remove();
        var num = DUI.profile.Networks.idIsExist(parseFloat(id));
        if (num != -1) {
            //DUI.profile.Networks.jsonArr.splice(num, 1);
            DUI.profile.Networks.jsonArr.removeAt(num);
        }
        checkNoData("#" + DUI.profile.Networks.divId, "StatusTable"); //检查NoData的情况
        DUI.profile.Networks._control = null;
        DUI.profile.Networks._id = null;
    },
    //-----------------页面动作控制-------------------
    l3TunnelModeClick: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        var value = $(control).find("option:selected").text();
        var DistMode = $(divId).find("#Networks_wsNetworkDistTunnelMode_wsNetworkEntry_PageData");
        var L3IP = $(divId).find("#Networks_wsNetworkL3TunnelSubnetIP_wsNetworkEntry_PageData");
        var L3Mask = $(divId).find("#Networks_wsNetworkL3TunnelSubnetMask_wsNetworkEntry_PageData");
        //controlisEnableTable(DistMode, (value == 'Enable') ? true : false); //控制控件是否可用 true不可用 false可用
        controlisEnableTable(mergeArray(L3Mask, L3IP), (value == 'Enable') ? false : true);
    },
    l2TunnelModeClick: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        var value = $(control).find("option:selected").text();
        var l3TunnelMode = $(divId).find("#Networks_wsNetworkL3TunnelMode_wsNetworkEntry_PageData");
        //l3TunnelMode.find("option[value='Disable']").attr("selected",true);
        //controlisEnableTable(l3TunnelMode, (value == "Enable") ? true : false);
    },
    redirectModeClick: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        //1 none 2 http 可用
        var RedirectURL = $(divId).find("#Networks_wsNetworkRedirectURL_wsNetworkEntry_PageData");
        var value = $(control).find("option:selected").text();
        controlisEnableTable(RedirectURL, (value.toLowerCase() == "http") ? false : true);
    },
    SecurityModeChange: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        var weps = $(divId).find("li[mp='StaticWEP']");
        var BcastKeyRefreshRate = $(divId).find("li[mp='BcastKeyRefreshRate']");
        var wpaKey = $(divId).find("li[mp='WPAKey']");
        var wpaKeyObj = $(divId).find("#Networks_wsNetworkWPAKey_wsNetworkEntry_PageData");
        var wpaVer = $(divId).find("li[mp='WPAVersions']");
        var wpaCipher = $(divId).find("li[mp='WPACipher']");
        var wpaEnterprise = $(divId).find("li[mp='WPAEnterprise']");
        var ie802x = $(divId).find("li[mp='SessionKeyRefreshRate']");
        var value = $(control).find("option:selected").text();
        controlDisplayTable(mergeArray(weps, BcastKeyRefreshRate, wpaKey, wpaVer, wpaCipher, wpaEnterprise, ie802x), "none");
        if (value == "Static WEP") {//static wep weps
            controlDisplayTable(weps, "");
            DUI.profile.Networks.WepKeyIndexChange($(divId).find("#Networks_wsNetworkUseWEPTransferKeyIndex_wsNetworkEntry_PageData")); //WEP Key
        }
        else if (value == "WEP IEEE802.1x") {//WEP IEEE802.1x  3 BcastKeyRefreshRate
            controlDisplayTable(mergeArray(BcastKeyRefreshRate, ie802x), "");
        }
        else if (value == "WPA Personal") {//WPA Personal 4  wpaKey + BcastKeyRefreshRate +wpaVer + wpaCiphers
            controlDisplayTable(mergeArray(BcastKeyRefreshRate, wpaKey, wpaVer, wpaCipher), "");
        }
        else if (value == "WPA Enterprise") {//WPA Enterprise 5 BcastKeyRefreshRate + wpaVer + wpaCiphers
            controlDisplayTable(mergeArray(wpaEnterprise, wpaCipher, wpaVer, BcastKeyRefreshRate, ie802x), "");
        } else {//None
        }
    },
    //WEP Key Type 和 Length 选择时，提示WEP Key 的长度信息
    WEPKeysTip: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        //var value = $(control).find("option:selected").text();//获取txt文本内容
        var wepKeyType = $(divId).find("select[name='Networks_wsNetworkWEPKeyType_wsNetworkEntry_PageData']").find("option:selected").text();
        var wepKeyLength = $(divId).find("select[name='Networks_wsNetworkWEPKeyLength_wsNetworkEntry_PageData']").find("option:selected").text();
        var wepkeytxt = $(divId).find("#wepkeytxt");
        var val = "";
        if (wepKeyLength == "152") {
            val = "16";
        }
        else if (wepKeyLength == "128") {
            if (wepKeyType == "ASCII") {
                val = "13";
            }
            else if (wepKeyType == "HEX") {
                val = "26";
            }
        }
        else if (wepKeyLength == "64") {
            if (wepKeyType == "ASCII") {
                val = "5";
            }
            else if (wepKeyType == "HEX") {
                val = "10";
            }
        }
        wepkeytxt.text(val);
        if (val != "") {
            for (var i = 1; i <= 4; i++) {
                var item = $(divId).find("#Networks_wsNetworkWEPKey" + i + "_wsNetworkEntry_PageData");
                $(item).attr("maxLength", parseInt(val));
                $(item).attr("class", "validate[required,custom[onlyLetterNumber],onlySize[" + val + "]]");
            }
        }
    },
    WepKeyIndexChange: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        //Networks_wsNetworkWEPKey1_wsNetworkEntry_PageData
        var index = $(control).find("option:selected").val().split(" ")[1]; //WEPKey 1
        var isHidden = ($(control).css("display") == "none" || $(control).closest("li").css("display") == "none") ? true : false; //$(control).is(":hidden");
        if (!isHidden) {
            for (var i = 1; i <= 4; i++) {
                var wepkey = $(divId).find("#Networks_wsNetworkWEPKey" + i + "_wsNetworkEntry_PageData").closest("li");
                controlDisplayTable(wepkey, (index != i) ? "none" : "");
            }
        }
    },
    //-------------------DWS3026-----------------------
    //界面控件是否可用控制
    UseProfileClick: function (control) {
        var divId = "#" + DUI.profile.Networks.divId;
        var value = $(control).find("option:selected").text();
        var spans = $(divId).find("[class='userProfile']");
        var objs = spans.find("[name$='_PageData']");
        controlisEnableTable(objs, (value == "Enable") ? true : false); //控制控件是否可用

    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.Networks.divId;
        if (isResult == "True") {
            setReadOnlyToControl(divId);
        }
    }
}