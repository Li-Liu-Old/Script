DUI.profile.ModifyRadioSettings = {
    item1: null,
    item2: null,
    oids: "", //存放当前选中设备类型
    divId: "",
    moduleName: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "ModifyRadioSettings") {
            return;
        }
        DUI.profile.ModifyRadioSettings.moduleName = moduleName;
        DUI.profile.ModifyRadioSettings.divId = divId;
        DUI.profile.ModifyRadioSettings.oids = oids.split(","); //split可以用字符或字符串分割
        DUI.profile.ModifyRadioSettings.item1 = $("#" + divId).find("[name*='Item1']");
        DUI.profile.ModifyRadioSettings.item2 = $("#" + divId).find("[name*='Item2']");

        if (oids) {
            //根据动态加载的数据，控制数据的显示隐藏
            var radioMode1 = $("#" + divId).find("#ModifyRadioSettings_apRadioMode-Item1_apRadioTable_PageData");
            var radioMode2 = $("#" + divId).find("#ModifyRadioSettings_apRadioMode-Item2_apRadioTable_PageData");
            var radioChannel1 = $("#" + divId).find('#ModifyRadioSettings_apRadioStaticChannel-Item1_apRadioTable_PageData');
            var radioChannel2 = $("#" + divId).find('#ModifyRadioSettings_apRadioStaticChannel-Item2_apRadioTable_PageData');
            var radioFMRate1 = $("#" + divId).find('#ModifyRadioSettings_apRadioFixedMulticastRate-Item1_apRadioTable_PageData');
            var bandwidth2 = $("#" + divId).find("#ModifyRadioSettings_apRadioChannelBandwidth-Item2_apRadioTable_PageData");
            // 1:5.0GHz 2:2.4GHz
            DUI.profile.ModifyRadioSettings.ControlChannel(radioMode1, ["IEEE 802.11a", "IEEE 802.11a/n", "IEEE 802.11a/n/ac", "IEEE 802.11n/ac"]);
            DUI.profile.ModifyRadioSettings.ControlChannel(radioMode2, ["IEEE 802.11b/g", "IEEE 802.11b/g/n", "2.4GHz IEEE 802.11n"]);

            DUI.profile.ModifyRadioSettings.ControlChannel(radioChannel1, ["Auto", 36, 40, 44, 48, 149, 153, 157, 161, 165]);
            DUI.profile.ModifyRadioSettings.ControlChannel(radioChannel2, ["Auto", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
            DUI.profile.ModifyRadioSettings.ControlChannel(radioFMRate1, ["Auto", 6, 9, 12, 18, 24, 36, 48, 54]);
            DUI.profile.ModifyRadioSettings.ControlChannel(bandwidth2, [20, 40]);
        }

        //Radio1or2切换控制函数
        $("#" + divId).find("[name='ModifyRadioSettings_apRadioName-Item_apRadioTable_PageData']").each(function () {
            DUI.profile.ModifyRadioSettings.btnRadioClick($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.btnRadioClick($(this)); });
        });
        //802.11协议切换控制Channel显示
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioMode']").each(function () {
            DUI.profile.ModifyRadioSettings.btnRadioModeChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.btnRadioModeChange($(this)); });
        });
        //Radio开关控制控件显示隐藏
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioStatus']").each(function () {
            DUI.profile.ModifyRadioSettings.btnRadioStatusChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.btnRadioStatusChange($(this)); });
        });
        //Channel 控制  
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioStaticChannel']").each(function () {
            DUI.profile.ModifyRadioSettings.StaticChannelChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.StaticChannelChange($(this)); });
        });
        //RateLimitEnable
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioRateLimitEnable']").each(function () {
            DUI.profile.ModifyRadioSettings.radioRateLimitEnable($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.radioRateLimitEnable($(this)); });
        });
        //Channel Bandwidth
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioChannelBandwidth']").each(function () {
            DUI.profile.ModifyRadioSettings.radioBandwidthChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.radioBandwidthChange($(this)); });
        });
        //ModifyRadioSettings_apRadioPrimaryChannel
        $("#" + divId).find("[name^='ModifyRadioSettings_apRadioPrimaryChannel']").each(function () {
            DUI.profile.ModifyRadioSettings.radioPrimaryChannelChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () { DUI.profile.ModifyRadioSettings.radioPrimaryChannelChange($(this)); });
        });

        if (operation == DUI.profile.common.operation.isFirst) {
            DUI.profile.ModifyRadioSettings.jsonArr = null;
        }
    },
    jsonArr: null,
    //获取JSON数据
    getJSON: function (module) {
        var result = false;
        if (module == DUI.profile.ModifyRadioSettings.moduleName) {
            DUI.profile.ModifyRadioSettings.jsonArr = DUI.profile.ModifyRadioSettings.GetJsonObj(); //获取表格数据
            if (isEffective(DUI.profile.ModifyRadioSettings.jsonArr)) {
                sendJson(DUI.profile.ModifyRadioSettings.jsonArr);
                result = true;
            }
        }
        return result;
    },
    //Radio应用控制
    btnRadioStatusChange: function (control) {
        var value = $(control).find("option:selected").text();
        var item = (DUI.profile.ModifyRadioSettings.radioMode == "2.4GHz") ? DUI.profile.ModifyRadioSettings.item2 : DUI.profile.ModifyRadioSettings.item1;
        DUI.profile.ModifyRadioSettings.ItemsDisplay(item, (value == "On") ? false : true);
    },
    ItemsDisplay: function (control, flag) {
        var items = $(control);
        var objs = [];
        for (var i = 0, l = items.length; i < l; i++) {
            var name = $(items[i]).attr("name");
            if (name.indexOf("apRadioStatus") == -1) {
                controlisEnableTable($(items[i]), flag); //控制控件是否可用
            }
            if (name.indexOf("apRadioRateLimitEnable") != -1 ||
                name.indexOf("apRadioPrimaryChannel") != -1) {
                objs.push($(items[i]));
            }
        }
        if (!flag) {
            for (var i = 0, len = objs.length; i < len; i++) {
                autoAction($(objs[i])); //主动触发事件
            }
        }
    },
    //页面切换控制
    radioMode: "",
    btnRadioClick: function (control) {
        var value = $(control).find("option:selected").text(); //CheckBox
        DUI.profile.ModifyRadioSettings.radioMode = value; //update
        controlDisplayTable(DUI.profile.ModifyRadioSettings.item1, (value == "5.0GHz") ? "" : "none"); //控制控制显示和隐藏
        controlDisplayTable(DUI.profile.ModifyRadioSettings.item2, (value == "5.0GHz") ? "none" : "");
        DUI.profile.ModifyRadioSettings.StatusControl(value);
    },
    //radio channel 联动控制
    btnRadioModeChange: function (control) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        var value = $(control).find("option:selected").text();
        var radio = ($(control).attr("name").indexOf("-Item1") != -1) ? '1' : '2'; //1:5.0GHz 2:2.4GHz

        var items = [$(divId).find("#ModifyRadioSettings_apRadioChannelBandwidth-Item" + radio + "_apRadioTable_PageData").closest("li"),
                         $(divId).find("#ModifyRadioSettings_apRadioPrimaryChannel-Item" + radio + "_apRadioTable_PageData").closest("li"),
                         $(divId).find("#ModifyRadioSettings_apRadioShortGuardIntervalSupported-Item" + radio + "_apRadioTable_PageData").closest("li"),
                         $(divId).find("#ModifyRadioSettings_apRadioProtection-Item" + radio + "_apRadioTable_PageData").closest("li")];
        controlDisplayTable(items, (value == "IEEE 802.11a" || value == "IEEE 802.11b/g") ? "none" : "");

        if (radio == "1") {
            var bandwidthID = "ModifyRadioSettings_apRadioChannelBandwidth-Item1_apRadioTable_PageData";
            if (value == "IEEE 802.11a/n/ac" || value == "IEEE 802.11n/ac") {
                DUI.profile.ModifyRadioSettings.ControlChannel($(divId).find("#" + bandwidthID), ["20", "40", "80"]);
            } else {
                DUI.profile.ModifyRadioSettings.ControlChannel($(divId).find("#" + bandwidthID), ["20", "40"]);
            }
        }
    },
    radioRateLimitEnable: function (control) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        //ModifyRadioSettings_apRadioRateLimitEnable-Item2_apRadioTable_PageData
        var isDisabled = $(control).find("option:selected").text() == "Off" ? true : false; //On Off
        var name = $(control).attr("id");
        var item = (name.indexOf("-Item1") != -1) ? "-Item1" : "-Item2";
        var rl = "ModifyRadioSettings_apRadioRateLimit", r1 = "_apRadioTable_PageData";
        var rlb = "ModifyRadioSettings_apRadioRateLimitBurst";
        controlisEnableTable([$(divId).find("#" + rl + item + r1), $(divId).find("#" + rlb + item + r1)], isDisabled);
    },
    // 1:5.0GHz 2:2.4GHz
    StaticChannelChange: function (control) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        var text = $(control).find("option:selected").text();
        DUI.profile.ModifyRadioSettings.channelVal = text;
        var item = ($(control).attr("name").indexOf("-Item1") != -1) ? "-Item1" : "-Item2";
        $(divId).find("#ModifyRadioSettings_apRadioChannelPolicy" + item + "_apRadioTable_PageData").val((text == "Auto") ? "2" : "1");
        $(control).attr("name", (text == "Auto") ? item.replace("-", "") : ("ModifyRadioSettings_apRadioStaticChannel" + item + "_apRadioTable_PageData"));
        DUI.profile.ModifyRadioSettings.StatusControl(DUI.profile.ModifyRadioSettings.radioMode);
    },
    radioBandwidthChange: function (control) {
        //var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        //DUI.profile.ModifyRadioSettings.bandwidthVal= $(control).find("option:selected").text(); //20 40 80
        DUI.profile.ModifyRadioSettings.StatusControl(DUI.profile.ModifyRadioSettings.radioMode);
    },
    radioPrimaryChannelChange: function (control) {
        //var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        //DUI.profile.ModifyRadioSettings.primaryChannelVal = $(control).find("option:selected").text(); //Lower Upper
        DUI.profile.ModifyRadioSettings.StatusControl(DUI.profile.ModifyRadioSettings.radioMode);
    },
    // 1:5.0GHz 2:2.4GHz
    StatusControl: function (radioMode) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        var item = (radioMode == "2.4GHz") ? "2" : "1";
        var bandwidth = $(divId).find("#ModifyRadioSettings_apRadioChannelBandwidth-Item{0}_apRadioTable_PageData".format(item));
        var bandwidthVal = bandwidth.val();
        var primaryChannel = $(divId).find("#ModifyRadioSettings_apRadioPrimaryChannel-Item{0}_apRadioTable_PageData".format(item));
        var primaryChannelVal = primaryChannel.val();
        var channel = $(divId).find("#ModifyRadioSettings_apRadioStaticChannel-Item{0}_apRadioTable_PageData".format(item));
        var channelVal = channel.val();
        //-------------------------------------
        var primaryChannelDisable = (channelVal != "Auto" && bandwidthVal == "40") ? false : true;
        controlisEnableTable(primaryChannel, primaryChannelDisable);
        var channels = "";
        if (primaryChannelDisable == false) {
            if (radioMode == "2.4GHz") {
                channels = (primaryChannelVal == "Lower") ? ["Auto", "1", "2", "3", "4", "5", "6", "7"] : ["Auto", "5", "6", "7", "8", "9", "10", "11"];
            } else {
                channels = (primaryChannelVal == "Lower") ? ["Auto", "36", "44", "149", "157"] : ["Auto", "40", "48", "153", "161"];
            }
        } else {
            if (radioMode == "2.4GHz") {
                channels = ["Auto", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            } else {
                channels = ["Auto", 36, 40, 44, 48, 149, 153, 157, 161, 165];
            }
        }
        if (!channels.contains(channelVal))
            channelVal = "Auto";
        DUI.profile.ModifyRadioSettings.ControlChannel(channel, channels);
        channel.val(channelVal);

    },
    //控制Select选项,隐藏和显示
    ControlChannel: function (control, channelArr) {
        var count = $(control).find("option").length;
        var flag = true;
        var value = channelArr[0];
        $(control).find("option").each(function () {
            if (channelArr.contains($(this).text())) {
                channelArr.remove($(this).text());
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $(control).val(value); //设置Select的Value值为()的项选中   
    },
    //获得table数据返回JSON对象
    GetJsonObj: function () {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        var RadioName = "ModifyRadioSettings_apRadioName-Item_apRadioTable_PageData";
        var radio = $(divId).find("#" + RadioName);
        var radioMode = $(radio).find("option:selected").text();
        if (radio && radioMode) {
            var item = (radioMode == "2.4GHz") ? "-Item2" : "-Item1"; //默认为5GHz   
            var controls = mergeArray($(divId).find("[name*='" + item + "']"), radio);
            var str = new StringBuilder();
            str.append("\"").append(RadioName).append("\":\"").append(radioMode).append("\",");
            var json = tableDataToJson(controls, str.toString());
            return json;
        } else {
            $.errror("GetJsonObj :" + radio + "," + radioMode);
        }
    },
    CommonControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        if (isResult == "True") {
            $(divId).find("[id^='ModifyRadioSettings_apRadioStaticChannel']").each(function () {
                $(this).attr("disabled", true);
            });
            var value = $(divId).find("#ModifyRadioSettings_apRadioChannelPolicy-Item1_apRadioTable_PageData").val();
            if (value == 2) {
                $(divId).find("#ModifyRadioSettings_apRadioStaticChannel-Item1_apRadioTable_PageData").val("Auto");
            }
            var value1 = $(divId).find("#ModifyRadioSettings_apRadioChannelPolicy-Item2_apRadioTable_PageData").val();
            if (value1 == 2) {
                $(divId).find("#ModifyRadioSettings_apRadioStaticChannel-Item2_apRadioTable_PageData").val("Auto");
            }
        }
    },
    ResultControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.ModifyRadioSettings.divId;
        $(divId).find("[id^='ModifyRadioSettings_apRadioStaticChannel']").each(function () {
            $(this).attr("name", $(this).attr("id"));
        });
    }
    //    //Select 下拉框中删除不显示的项[弃用]
    //    ShowSelectOption: function (control, optionsArr) {
    //        var count = $(control).find("option").length;
    //        var flag = true;
    //        $(control).find("option").each(function () {
    //            flag = true;
    //            for (var i = 0; i < optionsArr.length; i++) {
    //                if (optionsArr[i] == $(this).text()) {
    //                    flag = false;
    //                    break;
    //                }
    //            }
    //            if (flag) {
    //                $(this).remove();
    //            }
    //        });
    //    }
}