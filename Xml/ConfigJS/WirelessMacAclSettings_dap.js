DUI.profile.WirelessMacAclSettings = {
    divId: "",
    moduleName: "",
    oids: null,
    jsonArr: null,
    _jsonArr: null,
    _data: null, //临时变量
    _control: null, //临时变量
    _isResult: false,
    _hasSsidIndex: false, //判断是否有ssid index这项
    _singleFreq:false,
    band: "WirelessMacAclSettings_radioIndex_dot11MacAccessControlEntry_PageData", //2.4GHz 5.0GHz 
    conList: "WirelessMacAclSettings_dot11MacAccessControl_dot11MacAccessControlEntry_PageData", // Accept  Reject  Disable 
    ssid: "WirelessMacAclSettings_dot11ssidIndex_dot11MacAccessControlEntry_PageData", //SSID
    mac: "WirelessMacAclSettings_dot11MacAccessControlMacAddressAdd_dot11MacAccessControlEntry_PageData", //MAC Address

    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "WirelessMacAclSettings") {
            return;
        }
        var t = DUI.profile.WirelessMacAclSettings;
        t.oids = oids;
        t.moduleName = moduleName;
        t.divId = divId;
		//t._hasSsidIndex = true;
		
		var DAP2oids = {
			dap2660:"1.3.6.1.4.1.171.10.37.52",
			dap2695:"1.3.6.1.4.1.171.10.37.47",
			dap2690B:"1.3.6.1.4.1.171.10.37.45",
			dap3662:"1.3.6.1.4.1.171.10.37.54",
			dap2553B:"1.3.6.1.4.1.171.10.37.48"
		};
		var singleFreq = {
			    dap2230: "1.3.6.1.4.1.171.10.37.56",
      			dap2360B: "1.3.6.1.4.1.171.10.37.50",
      			dap2310B: "1.3.6.1.4.1.171.10.37.49",
      			dap2330: "1.3.6.1.4.1.171.10.37.51",
    			dap3320: "1.3.6.1.4.1.171.10.37.55",
    			dwp2360: "1.3.6.1.4.1.171.10.37.53"
		};
		//oids只要包含其中一个SOID，则为true
		t._hasSsidIndex = t.containsOid(DAP2oids,oids);
		t._singleFreq = t.containsOid(singleFreq,oids);
		
        $("#" + divId).find("[name='" + t.conList + "']").each(function () {
            t.macAccessControl($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    t.macAccessControl($(this));
                });
        });
		if(!t._singleFreq){
	        $("#" + divId).find("[name='" + t.band + "']").each(function () {
	            t.bandControl($(this));
	            if (isBindEvent($(this)))
	                $(this).bind("change", function () {
	                    t.bandControl($(this));
	                });
	        });
       }

        if (t._hasSsidIndex) {
            $("#" + divId).find("[name='" + t.ssid + "']").each(function () {
                t.bandControl($(this));
                if (isBindEvent($(this)))
                    $(this).bind("change", function () {
                        t.bandControl($(this));
                    });
            });
        }

        $("#" + divId).find("[id='" + t.mac + "']").each(function (i, el) {
            var t = DUI.lang.CfgProfile.addMacAclMsg//"You can enter one MAC address for each row,such as"
					+ "\n00:10:AB:11:10:11"
					+ "\n00:10:AB:11:10:11"
					+ "\n00:10:AB:11:10:11";
            this.placeholder = t;
            this.onblur = function () {
                DUI.profile.WirelessMacAclSettings.CheckMacAddr();
            }
        });
        $("#" + divId).find("#ImageTip").attr("title", DUI.lang.CfgProfile.macAclTipMsg);
        $("#" + divId).find("#macAddrListMsg").text("* " + DUI.lang.CfgProfile.macFormatMsg);

        if (operation == DUI.profile.common.operation.isFirst) {
            t._jsonArr = null;
            t._control = null;
        } else if (operation == DUI.profile.common.operation.isBack) {
        }
    },
    //获取JSON数据       
    getJSON: function (module) {
        HideAllValidate(); //去掉JQUERY验证红色框
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        var result = false;
        if (module == t.moduleName) {
            var jsonArr = t.tojsonArr(t._jsonArr);
            if (isEffective(jsonArr) && jsonArr.length > 0) {
                sendJson(jsonArr);
                result = true;
                if (t._jsonArr) window._jsonArr = t._jsonArr.concat() || undefined; //临时保存
                window._control = t._control || undefined; //临时保存
            }
        }
        return result;
    },
    //getJSON 生成JSON对象 
    tojsonArr: function (dataArr) {
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        var jsonArr = [];
        var clArr = [];
        if (dataArr && dataArr.length > 0) {
            //var needIfIndex = DUI.profile.WirelessMacAclSettings.oids.indexOf("1.3.6.1.4.1.171.10.37.52") != -1;           
            var len = dataArr.length;
            for (var i = 0; i < len; i++) {
                var data = dataArr[i];
                var jsonStr = new StringBuilder();
                jsonStr.append("{");
                if(!t._singleFreq)
					jsonStr.append("\"").append(t.band).append("\":\"").append(data.band).append("\",");
                if (t._hasSsidIndex || t._singleFreq)
                    jsonStr.append("\"").append(t.ssid).append("\":\"").append(data.ssid).append("\",");
                jsonStr.append("\"").append(t.mac).append("\":\"").append(data.mac).append("\",");
                jsonStr.del(1).append("}");
                jsonArr.push(JSON.parse(jsonStr.toString()));

                //var id = (data.band + "," + (data.ssid || "SSID")).replace(/\./g, "").replace(/ /g, "");
                var id = t._singleFreq ? ("_id," + data.ssid) : 
                	(t._hasSsidIndex ) ? ("_id," + data.band + "," + data.ssid) : ("_id," + data.band);
                id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
                if ($.inArray(id, clArr) == -1)
                    clArr.push(id);
            }
        }
        var l = clArr.length;
        if (t._control) {
            for (var p in t._control) {
                var data = t._control[p];
                if (!data) continue;
                if ((l > 0 && $.inArray(p, clArr) != -1) || (data.conList == "Disable")) {
                    var jsonStr = new StringBuilder();
                    jsonStr.append("{");
                    if(!t._singleFreq)
						jsonStr.append("\"").append(t.band).append("\":\"").append(data.band).append("\",");
                    if (t._hasSsidIndex || t._singleFreq)
                        jsonStr.append("\"").append(t.ssid).append("\":\"").append(data.ssid).append("\",");
                    jsonStr.append("\"").append(t.conList).append("\":\"").append(data.conList).append("\",");
                    jsonStr.del(1).append("}");
                    jsonArr.push(JSON.parse(jsonStr.toString()));
                }
            }
        }
        return jsonArr;
    },
    //恢复数据显示
    toRestoreData: function (jsonBack, isResult, divId) {
        if (!isEffective(jsonBack)) {
            return;
        }
        var t = DUI.profile.WirelessMacAclSettings;

        var _jsonArr = [];
        var _control = null;
        var datas = {};
        //var _band = [];
        //var _ssid = [];
        for (var i = 0; i < jsonBack.length; i++) {
            var json = jsonBack[i];
            if (json[t.mac]) {
                _jsonArr.push(json);
                var id = t._singleFreq ? ("_id," + json[t.ssid] + "," + json[t.mac]) : 
                	(t._hasSsidIndex) ? ("_id," + json[t.band] + "," + json[t.ssid] + "," + json[t.mac]) : ("_id," + json[t.band] + "," + json[t.mac]);
                id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
                datas[id] = json;
                //if (!datas[id]) datas[id] = json;
                //datas[id][t.mac] = json[t.mac];
            }
            if (json[t.conList]) {
                var id = t._singleFreq ? ("_id," + json[t.ssid]) : 
                	(t._hasSsidIndex ) ? ("_id," + json[t.band] + "," + json[t.ssid]) : ("_id," + json[t.band]);
                id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
                var obj = {};
                obj.conList = json[t.conList];
                if(!t._singleFreq)
                	obj.band = json[t.band];
                if (t._hasSsidIndex || t._singleFreq)
                    obj.ssid = json[t.ssid];
                if (!_control) _control = {};
                _control[id] = obj;
                //datas[id][t.conList] = json[t.conList]; 
                if (json[t.conList] == "Disable") {
                    datas[id] = json;
                }
            }
        }
        var arr = window._jsonArr || _jsonArr; ;
        t._jsonArr = arr.concat();
        t._control = window._control || _control;

        var flag = (t._jsonArr && t._jsonArr.length > 0) || t._control;
        if (flag) {

            for (var p in datas) {
                var data = datas[p];
                var id = p;
                var _id = id.substring(0, id.lastIndexOf(","));
                if (_control && _control[_id]) data[t.conList] = _control[_id].conList;
                var valueList = t._singleFreq? new Array(data[t.ssid], data[t.mac] || "N/A", data[t.conList]) : 
                	(t._hasSsidIndex) ? new Array(data[t.band], data[t.ssid], data[t.mac] || "N/A", data[t.conList]) : 
                	new Array(data[t.band], data[t.mac] || "N/A", data[t.conList]);
                var paramList = new Array(id);
                tableAddRow("#" + divId, "StatusTable", id, valueList, paramList);
            }
        }
        if (isResult == "True") {
            t._isResult = true;
            var div = $("#" + divId);
            div.find("#StatusTable").css("display", flag ? "" : "none");
            div.find("#addMACBtn").hide();
            div.find("#" + t.conList).attr("Disabled", true);
            div.find("#" + t.mac).parent().hide();
        }
    },

    //如果Disable则禁止使用添加json模式 实际还是传JSON数据
    macAccessControl: function (control) {
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        var text = $(control).find("option:selected").text();
        if (!t._jsonArr || t._jsonArr.length == 0) controlDisplayTable($(divId).find("#StatusTable"), (text == "Disable") ? "none" : "");
        $(divId).find("#" + t.mac).attr("disabled", (text == "Disable") ? true : false);
        $(divId).find("#addMACBtn").attr("disabled", (text == "Disable") ? true : false);
        $(divId).find("#addMACBtn").attr("class", (text == "Disable") ? "bgBtnInputD" : "bgBtnInput");
        if (text == "Disable") {//table
            HideAllValidate();
            ClearTableValidate(); //去掉所有验证红色框
        }
        var conList = text;
        var band = $(divId).find("#" + t.band + " option:selected").text();
        var ssid = (t._hasSsidIndex || t._singleFreq) ? $(divId).find("#" + t.ssid + " option:selected").text() : "";
        if (!t._control) t._control = {};
        //var id = ("_id," + band + "," + ssid).replace(/\./g, "").replace(/ /g, "");
        var id = t._singleFreq ? ("_id," + ssid): (t._hasSsidIndex) ? ("_id," + band + "," + ssid) :("_id," + band);
        id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
        var obj = {};
        obj.conList = conList;
        if(!t._singleFreq)
        	obj.band = band;
        if (t._hasSsidIndex || t._singleFreq)
            obj.ssid = ssid;
        t._control[id] = obj;
    },
    bandControl: function (control) {
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        var band = $(divId).find("#" + t.band + " option:selected").text(); //"2.4GHz" 
        //var ctrl = $(divId).find("#" + t.conList + " option:selected").text();
        var ssid = (t._hasSsidIndex == true) ? $(divId).find("#" + t.ssid + " option:selected").text() : "";
        //var id = (band + "," + ssid).replace(/\./g, "").replace(/ /g, "");
        var id = (t._hasSsidIndex == true) ? ("_id," + band + "," + ssid) : ("_id," + band);
        id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
        if (t._control && t._control[id]) {
            //$(".selector").find("option[text='pxx']").attr("selected",true);
            var txt = t._control[id].conList;
            $(divId).find("#" + t.conList).val(txt);
            //$(divId).find("#" + t.conList).find('option[text=\"' + txt + '\"]').attr("selected", true);
            //t.macAccessControl($(divId).find("#" + t.conList));
        } else {
            $(divId).find("#" + t.conList + " option:first").attr("selected", true);
        }
        t.macAccessControl($(divId).find("#" + t.conList));
    },
    ssidIndexControl: function (control) {
//        var t = DUI.profile.WirelessMacAclSettings;
//        var divId = "#" + t.divId;
//        var ssid = $(control).find("option:selected").text();
//        //var ctrl = $(divId).find("#" + t.conList + " option:selected").text();
//        var band = $(divId).find("#" + t.band + " option:selected").text();
//        //var id = (band + "," + ssid).replace(/\./g, "").replace(/ /g, "");
//        var id = (t._hasSsidIndex == true) ? ("_id," + band + "," + ssid) : ("_id," + band);
//        id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
//        if (t._control && t._control[id]) {
//            var txt = t._control[id].conList;
//            //$(divId).find("#" + t.conList).val(txt);
//            $(divId).find("#" + t.conList).find("option[val='" + txt + "']").attr("selected", true);
//            t.macAccessControl($(divId).find("#" + t.conList));
//        } else {
//            $(divId).find("#" + t.conList + " option:first").attr("selected", true);
//        }
    },
    //检查重复MAC
    isExist: function (id) {
        var t = DUI.profile.WirelessMacAclSettings;
        if (t._jsonArr) {
            if (typeof id == "string") {
                var len = t._jsonArr.length;
                for (var i = 0; i < len; i++) {
                    if (t._jsonArr[i].id == id) {
                        return i;
                    }
                }
            }
        }
        return -1;
    },
    //添加新的一条记录   
    addNew: function () {
        //if (!Submit()) return;
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        var mac = t.mac;
        if (!isEffective(t.jsonArr)) {
            t.jsonArr = [];
        }
        if (!isEffective(t._jsonArr)) {
            t._jsonArr = [];
        }
        //检查mac正确性并获取值
        var rs = t.CheckMacAddr();
        if (rs != false) {
            var ssid = (t._hasSsidIndex || t._singleFreq ) ? $(divId).find("#" + t.ssid + " option:selected").text() : "";
            var band = $(divId).find("#" + t.band + " option:selected").text();
            //var acl = $(divId).find("#" + conList + " option:selected").text();
            $(divId).find("#" + mac).val(""); //清空输入数据
            $.each(rs, function (i, val) {
                //var id = ("_id," + ssid + "," + band + "," + val).replace(/:/g, "").replace(/\./g, "").replace(/ /g, ""); // /:/g替换全部的：
                var id = t._singleFreq ? ("_id," + ssid + "," + val) : (t._hasSsidIndex) ? ("_id," + band + "," + ssid + "," + val) :("_id," + band + "," + val);
                id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
                var n = t.isExist(id); //检查mac重复
                if (n == -1) {
                    var data = {};
                    data.id = id;
                    if(!t._singleFreq)
                    	data.band = band;
                    if (t._hasSsidIndex || t._singleFreq)
                        data.ssid = ssid;
                    data.mac = val;
                    t._jsonArr.push(data); //保存临时数据
                    t.addNewRow(data, false);
                }
            });
        }

        var conList = $(divId).find("#" + t.conList + " option:selected").text(); ;
        var band = $(divId).find("#" + t.band + " option:selected").text();
        var ssid = (t._hasSsidIndex || t._singleFreq) ? $(divId).find("#" + t.ssid + " option:selected").text() : "";
        if (!t._control) t._control = {};
        //var id = (band + "," + ssid).replace(/\./g, "").replace(/ /g, "");
        var id = t._singleFreq ? ("_id," + ssid) :(t._hasSsidIndex) ? ("_id," + band + "," + ssid) : ("_id," + band);
        id = id.replace(/:/g, "").replace(/\./g, "").replace(/ /g, "");
        var obj = {};
        obj.conList = conList;
        if(!t._singleFreq)
        	obj.band = band;
        if (t._hasSsidIndex || t._singleFreq)
            obj.ssid = ssid;
        t._control[id] = obj;
    },
    addNewRow: function (data, flag) {
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        if (!isEffective(data)) {
            $.error("addNewRow param error:" + data);
            return;
        }
        //$(divId).find("#" + t.mac).val(""); //清空输入数据
        var id = data.id;
        var valueList = t._singleFreq ? new Array(data.ssid, data.mac) : (t._hasSsidIndex ) ? new Array(data.band, data.ssid, data.mac) : new Array(data.band, data.mac);
        var paramList = new Array(id);
        //tableAddRow(tableID, rowID, valueList, paramList)
        tableAddRow(divId, "StatusTable", id, valueList, paramList);
    },
    //Delete Row Data
    _control2: null, //临时变量
    _id: null, //临时变量
    DeleteRow: function (control, id) {
        if (!control || !id) {
            $.error("DeleteRow param :" + control + "," + id);
        }
        DUI.profile.WirelessMacAclSettings._control2 = control;
        DUI.profile.WirelessMacAclSettings._id = id;
        ShowMsg(DUI.lang.CfgProfile.delRowMsg, "", "sure", "DUI.profile.WirelessMacAclSettings.DeleteRow1()");
    },
    DeleteRow1: function () {
        var t = DUI.profile.WirelessMacAclSettings;
        $(t._control2).parent().parent().remove(); //delete
        var num = t.isExist(t._id);  //band mac
        if (num == -1) {//不存在
            return;
        }
        t._jsonArr.removeAt(num);
        checkNoData("#" + t.divId, "StatusTable"); //检查NoData的情况
    },
    //结果显示控制
    CommonControl: function (xml, isResult, isEdit) {
        var t = DUI.profile.WirelessMacAclSettings;
        var divId = "#" + t.divId;
        if (isResult == "True") {
            t._isResult = true;
            //setReadOnlyToControl(divId);
            //$(divId).find("#StatusTable").parent().width(200);
            $(divId).find("#" + t.conList).parent().hide();
            $(divId).find("#" + t.band).parent().hide();
            if (t._hasSsidIndex || t._singleFreq)
                $(divId).find("#" + t.ssid).parent().hide();
            //删除Action TD列
            $(divId).find("#StatusTable thead tr th").each(function () {
                if ($.trim($(this).text()) == "Action") {
                    $(this).remove();
                }
                if ($.trim($(this).text()) == "MAC Address") {
                    $(this).parent().append($("<th>Access Control<th>"));
                }
            });
            $(divId).find("#StatusTable thead tr th:last").remove();
            //删除TD
            $(divId).find("[name='actionBtn']").each(function () {
                $(this).parent().remove();
            });
        }
        //console.log("CommonControl");
    },
    CheckMacAddr: function () {
        var mac = DUI.profile.WirelessMacAclSettings.mac;
        var divId = "#" + DUI.profile.WirelessMacAclSettings.divId;
        validateSubmit($(divId).find("#" + mac), $(divId).find("#macAddrListMsg"), false);
        var reg_name = /^[A-Fa-f0-9]{2}\:[A-Fa-f0-9]{2}\:[A-Fa-f0-9]{2}\:[A-Fa-f0-9]{2}\:[A-Fa-f0-9]{2}\:[A-Fa-f0-9]{2}$/;
        var macVal = $(divId).find("#" + mac).val();
        var macs = [];
        if (macVal != null && macVal != '') {
            var content = macVal.split("\n");
            for (var i = 0; i < content.length; i++) {
                var val = content[i];
                if (!reg_name.test(val)) {
                    validateSubmit($(divId).find("#" + mac), $(divId).find("#macAddrListMsg"), true);
                    return false;
                } else
                    macs.push(val);
            }
        }
        return macs;
    },
    containsOid:function(obj,str){
    	var arr = str.split(',');
    	if(arr){
	    	for(i in obj){
	    		if(arr.contains(obj[i])){
	    			return true;
	    		}
	    	}
    	}
    	return false;
    }
}