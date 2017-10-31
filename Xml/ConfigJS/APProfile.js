DUI.profile.APProfile = {
    //特殊处理赋默认值的问题
    CommonControl: function (xml, isResult, isEdit) {
        //对于特殊的Checkbox特殊处理显示
        if (DUI.profile.APProfile.isDWS3026) {
            DUI.profile.APProfile.csd("RadioSetting", "APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData", "APProfile_wsAPProfileRadioAdvertisedDataMode_wsAPProfileRadioAdvertisedRatesEntry_PageData", xml);
        } else {
            DUI.profile.APProfile.csd("RadioSetting", "APProfile_wsEligibleChannel_wsAPProfileRadioEligibleChannelsEntry_PageData", "RowStatus", xml);
            DUI.profile.APProfile.csd("RadioSetting", "APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData", "APProfile_wsAPProfileRadioBasicDataMode_wsAPProfileRadioBasicRatesEntry_PageData", xml);
            DUI.profile.APProfile.csd("RadioSetting", "APProfile_wsAPRadioMCSIndexValue_wsAPProfileRadioMCSIndexEntry_PageData", "APProfile_wsAPRadioMCSIndexAvailable_wsAPProfileRadioMCSIndexEntry_PageData", xml);
        }
        DUI.profile.APProfile.csd("RadioSetting", "APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData", "APProfile_wsAPProfileRadioSupportedDataMode_wsAPProfileRadioSupportedRatesEntry_PageData", xml);
        DUI.profile.APProfile.csd("SSIDSetting", "APProfile_wsVAPId_wsAPProfileVAPEntry_PageData", "APProfile_wsVAPMode_wsAPProfileVAPEntry_PageData", xml);
        if (isEdit == "True" && isResult == "False") {
            DUI.profile.APProfile.isEnableChangeControl(xml, isResult, isEdit); //控制页面isEnableChange显示
        }
        DUI.profile.APProfile.isResultControl(xml, isResult, isEdit); //结果显示控制 控制Mac显示和赋值
    },
    csd: function (module, name, state, xml) {
        var divId = "#" + DUI.profile.APProfile.divId;
        var talName = DUI.profile.APProfile.getTableName(name);
        var key = getMibKeyByControl(name); //需要赋值的节点
        var ssidHash = new Hashtable();
        var ssidHash2 = new Hashtable();
        $(xml).find(talName).children("Item").each(function () {
            var ifid = $(this).attr("wsAPRadioInterface");
            var val = $(this).attr(key); //值
            var cls = state;
            if (state != "RowStatus") {
                cls = $(this).attr(getMibKeyByControl(state)); //Enable/Disable
            }
            if (ifid == 1)
                ssidHash.add(val, cls); //6 - enable
            if (ifid == 2)
                ssidHash2.add(val, cls);
        });
        for (var i = 1; i <= 2; i++) {
            var hash = (i == '1') ? ssidHash : ssidHash2;
            if (hash.count() > 0) {
                $(divId).find("#" + module + "_" + i).find("[name='" + name + "']").each(function () {
                    var value = hash.item($(this).next().text());
                    if (value == "Enable" || value == "RowStatus") {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
            }
        }
    },
    //根据Name获取Table名字
    getTableName: function (name) {
        var index = name.indexOf("_PageData");
        if (index == -1) {
            return;
        }
        name = name.substring(0, index);
        return name.substring(name.lastIndexOf("_") + 1, name.length);
    },
    divId: "",
    moduleName: "",
    jsonArr: null,
    data: new Object(), //始终只有一个临时对象
    currentModule: "GlobalSetting", //当前页签的ID
    dws3026Oid: "1.3.6.1.4.1.171.10.73.3",
    isDWS3026: false,
    moduleEnum: new Array("GlobalSetting", "SSIDSetting_1", "SSIDSetting_2", "RadioSetting_1", "RadioSetting_2", "QoSSetting_1", "QoSSetting_2", "TSPECSetting_1", "TSPECSetting_2"),
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "APProfile") {
            return;
        }
        $("#approfileMsg").text(DUI.lang.CfgProfile.approfileMsg); //多语言
        $("#basicRatesMsg").text(DUI.lang.CfgProfile.anOption);
        $("#supportedRatesMsg").text(DUI.lang.CfgProfile.anOption);
        $("#advertisedDataRatesMsg").text(DUI.lang.CfgProfile.anOption);
        $("#ssidMsg").text(DUI.lang.CfgProfile.oneSSID);
        DUI.profile.APProfile.isDWS3026 = (oids.indexOf(DUI.profile.APProfile.dws3026Oid) != -1) ? true : false;
        DUI.profile.APProfile.moduleName = moduleName;
        DUI.profile.APProfile.divId = divId;
        //$(document).ready(function () {
        var options = [];
        if (oids.indexOf("1.3.6.1.4.1.171.11.124.1") != -1 || oids.indexOf("1.3.6.1.4.1.171.11.124.2") != -1 || oids.indexOf("1.3.6.1.4.1.171.10.121.1") != -1) {
            //DWS3160系列不支持TSPESetting功能
            $("#" + divId).find("#tspecSettingliId").hide();
            options = ["DWL-6600AP Dual Radio a/b/g/n", "DWL-3600AP Single Radio b/g/n"];
        }
        DUI.profile.APProfile.ControlChannel($("#" + divId).find("#APProfile_wsAPHardwareTypeID_wsAPProfileEntry_PageData"), options);
        //菜单方法
        $("#" + divId).find("[name='OneMenu']").each(function () {
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("click", function () {
                    DUI.profile.APProfile.goForward(this, "1");
                });
        });
        $("#" + divId).find("[name='TwoMenu']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("click", function () {
                    DUI.profile.APProfile.goForward(this, "2");
                });
        });
        $("#" + divId).find("[name='isEnableChange']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.isEnableChange();
                });
        });
        if (DUI.profile.APProfile.isDWS3026) {
            $("#" + divId).find("[name='APProfile_wsAPRadioQOSEDCATemplate_wsAPProfileRadioEntry1_PageData']").closest("li").remove();
        } else {
            $("#" + divId).find("[name='APProfile_wsAPRadioQOSEDCATemplate_wsAPProfileRadioEntry1_PageData']").each(function () {
                if (isBindEvent($(this)))
                    $(this).bind("change", function () {
                        DUI.profile.APProfile.QosEdcaTemplateChange($(this));
                    });
            });
        }
        //----------------Radio----------------------
        // 根据radio动态加载checkbox
        if (DUI.profile.APProfile.isDWS3026) {
            changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData']"), "wsAdvertisedDataRate");
            changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData']"), "wsAdvertisedDataRate");
        } else {
            changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsEligibleChannel_wsAPProfileRadioEligibleChannelsEntry_PageData']"), "wsEligibleChannel");
            changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsEligibleChannel_wsAPProfileRadioEligibleChannelsEntry_PageData']"), "wsEligibleChannel");
            changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData']"), "wsBasicDataRate");
            changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData']"), "wsBasicDataRate");

            changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsAPRadioMulticastTxRate_wsAPProfileRadioEntry_PageData']"), "wsAPRadioMulticastTxRate");
            changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsAPRadioMulticastTxRate_wsAPProfileRadioEntry_PageData']"), "wsAPRadioMulticastTxRate");
        }
        changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']"), "wsSupportedDataRate");
        changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']"), "wsSupportedDataRate");

        changeItemsByField("1-802.11a/n", "apRadioName", $("#" + divId).find("#RadioSetting_1").find("[name='APProfile_wsAPRadioFrequency_wsAPProfileRadioEntry_PageData']"), "wsAPRadioFrequency");
        changeItemsByField("2-802.11b/g/n", "apRadioName", $("#" + divId).find("#RadioSetting_2").find("[name='APProfile_wsAPRadioFrequency_wsAPProfileRadioEntry_PageData']"), "wsAPRadioFrequency");


        $("#" + divId).find("[name='APProfile_wsAPRadioFrequency_wsAPProfileRadioEntry_PageData']").each(function () {
            DUI.profile.APProfile.APRadioFrequencyChange($(this));
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.APRadioFrequencyChange($(this));
                });
        });

        $("#" + divId).find("[name='APProfile_wsAPRadioLoadBalancingMode_wsAPProfileRadioEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.RadioLoadBalancingMode($(this));
                });
        });
        $("#" + divId).find("[name='APProfile_wsAPRadioOtherChannelsScanMode_wsAPProfileRadioEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.RadioOtherChannelsScanMode($(this));
                });
        });
        $("#" + divId).find("[name='APProfile_wsAPRadioSentryScanMode_wsAPProfileRadioEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.RadioSentryScanMode($(this));
                });
        });
        $("#" + divId).find("[name='APProfile_wsAPRadioRateLimitMode_wsAPProfileRadioEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.RadioRateLimitMode($(this));
                });
        });
        //------------------------------dws3026---------------------------------
        $("#" + divId).find("[name='APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.AdvertisedDataRateSet($(this));
                });
        });
        //---------------------------dws4026/3160-----------------------------------
        $("#" + divId).find("[name='APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.BasicRatesSet($(this));
                });
        });
        $("#" + divId).find("[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.SupportedDataRateSet($(this));
                });
        });
        //-------Global---------
        if (isBindEvent($("#" + divId).find("#apRadiusServerSecretEdit"))) {
            $("#" + divId).find("#apRadiusServerSecretEdit").bind("change", function () {
                controlisEnableTable($("#" + divId).find("#text1"), ($(this).is(":checked") == true) ? false : true);
                controlisEnableTable($("#" + divId).find("#APProfile_wsAPRadiusServerSecret_wsAPProfileEntry_PageData"), ($(this).is(":checked") == true) ? false : true);
            });
        }
        if (isBindEvent($("#" + divId).find("#apRadiusBackuponeServerSecretEdit"))) {
            $("#" + divId).find("#apRadiusBackuponeServerSecretEdit").bind("change", function () {
                controlisEnableTable($("#" + divId).find("#APProfile_wsAPRadiusBackuponeServerSecret_wsAPProfileEntry_PageData"), ($(this).is(":checked") == true) ? false : true);
                controlisEnableTable($("#" + divId).find("#text3"), ($(this).is(":checked") == true) ? false : true);
            });
        }
        //HardwareTypeID选择不同 显示内容不同
        $("#" + divId).find("[name='APProfile_wsAPHardwareTypeID_wsAPProfileEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.HardwareTypeChange($(this));
                });
        });
        //SSID选择触发验证事件
        $("#" + divId).find("[name='APProfile_wsVAPId_wsAPProfileVAPEntry_PageData']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.SSIDSelectCheck($(this));
                });
        });

        //------------QoS Setting-------------
        $("#" + divId).find("[name^='APProfile_wsAPEDCAMinContentionWindow_wsAPProfileQOSEntry']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.QosAPEDCACheck($(this));
                });
        });
        $("#" + divId).find("[name^='APProfile_wsAPEDCAMaxContentionWindow_wsAPProfileQOSEntry']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.QosAPEDCACheck($(this));
                });
        });
        //APProfile_wsAPEDCAMinContentionWindow_wsAPProfileQOSEntry_0_PageData
        //APProfile_wsAPEDCAMaxContentionWindow_wsAPProfileQOSEntry_0_PageData
        $("#" + divId).find("[name^='APProfile_wsStationEDCAMinContentionWindow_wsAPProfileQOSEntry']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.QosStationEDCACheck($(this));
                });
        });
        $("#" + divId).find("[name^='APProfile_wsStationEDCAMaxContentionWindow_wsAPProfileQOSEntry']").each(function () {
            if (isBindEvent($(this)))
                $(this).bind("change", function () {
                    DUI.profile.APProfile.QosStationEDCACheck($(this));
                });
        });
        //APProfile_wsStationEDCAMinContentionWindow_wsAPProfileQOSEntry_0_PageData
        //APProfile_wsStationEDCAMaxContentionWindow_wsAPProfileQOSEntry_0_PageData
        //------------------------------------
        if (operation == DUI.profile.common.operation.isFirst) {
            DUI.profile.APProfile.jsonArr = null;
            DUI.profile.APProfile.initApProfile(); //初始化,给隐藏域赋值
        }
        if (operation == DUI.profile.common.operation.isBack && DUI.profile.APProfile._divId == "#" + divId) {
            DUI.profile.APProfile.goForward(DUI.profile.APProfile._control, DUI.profile.APProfile._level);
        } else {
            DUI.profile.APProfile.goForward($("#" + divId).find("#GlobalSetId"), "1");
        }
        //});
    },
    //特殊处理编辑已经保存的Profile,控制isEnableChange
    isEnableChangeControl: function (xml, isResult, isEdit) {
        if (isEdit == "True") {
            var divId = "#" + DUI.profile.APProfile.divId;
            //GlobalSetting wsAPProfileEntry
            $(xml).find("wsAPProfileEntry").each(function () {
                $(divId).find("#GlobalSetting").find("[name='isEnableChange']").each(function () {
                    $(this).val("Enable");
                    DUI.profile.APProfile.htmlisEnableControl("GlobalSetting", ($(this).find("option:selected").text() == "Enable") ? true : false);
                });
            });
            if (DUI.profile.APProfile.isDWS3026) {
                DUI.profile.APProfile.moduleControl(xml, "wsAPProfileQOSEntry", "QoSSetting"); //QoSSetting wsAPProfileQOSEntry
            } else {
                DUI.profile.APProfile.moduleControl(xml, "wsAPProfileRadioEntry1", "QoSSetting"); //QoSSetting wsAPProfileRadioEntry1
                DUI.profile.APProfile.moduleControl(xml, "wsAPProfileRadioTspecEntry", "TSPECSetting"); //TSPECSetting wsAPProfileRadioTspecEntry
            }
            DUI.profile.APProfile.moduleControl(xml, "wsAPProfileRadioEntry", "RadioSetting"); //RadioSetting wsAPProfileRadioEntry
            DUI.profile.APProfile.moduleControl(xml, "wsAPProfileVAPEntry", "SSIDSetting"); //SSIDSetting wsAPProfileVAPEntry
        }
    },
    moduleControl: function (xml, mibEntry, module) {
        var divId = "#" + DUI.profile.APProfile.divId;
        $(xml).find(mibEntry).each(function () {
            var temp = "";
            $(this).children("Item").each(function () {
                temp += $(this).attr("wsAPRadioInterface");
            });
            var rif = ['1', '2'];
            for (var i = 0; i < rif.length; i++) {
                if (temp.indexOf(rif[i]) != -1) {
                    $(divId).find("#" + module + "_" + rif[i]).find("[name='isEnableChange']").each(function () {
                        $(this).val("Enable");
                        DUI.profile.APProfile.htmlisEnableControl(module + "_" + rif[i], ($(this).find("option:selected").text() == "Enable") ? true : false);
                    });
                }
            }
        });
    },
    GetFormData: function () {
        var divId = "#" + DUI.profile.APProfile.divId;
        var moduleEnum = DUI.profile.APProfile.moduleEnum;
        DUI.profile.APProfile.jsonArr = new Array();
        var flag = false;
        var mns = new Array("wsAPProfileRadioEligibleChannelsEntry", "wsAPProfileRadioMCSIndexEntry", "wsAPProfileRadioBasicRatesEntry", "wsAPProfileRadioSupportedRatesEntry");
        if (DUI.profile.APProfile.isDWS3026) {
            mns = new Array("wsAPProfileRadioAdvertisedRatesEntry", "wsAPProfileRadioSupportedRatesEntry");
        }
        for (var i = 0; i < moduleEnum.length; i++) {
            var cm = moduleEnum[i];
            var isEnable = ($(divId).find("#" + cm).find("[name='isEnableChange']").find("option:selected").text() == "Enable") ? true : false;
            if (isEnable) {
                if (cm == moduleEnum[3] || cm == moduleEnum[4]) {//RadioSettings 特殊处理
                    DUI.profile.APProfile.jsonArr.push(tableDataToJson($(divId).find("#" + cm).find("#DataForm")));
                    for (var n = 0; n < mns.length; n++) {
                        DUI.profile.APProfile.jsonArr.push(checkboxToJson($(divId).find("#" + cm).find("#" + mns[n])));
                    }
                } else if (cm == moduleEnum[1] || cm == moduleEnum[2]) {//SSIDSettings
                    DUI.profile.APProfile.jsonArr.push(checkboxToJson($(divId).find("#" + cm).find("#DataForm")));
                } else if (cm == moduleEnum[0]) {//GlobalSettings
                    DUI.profile.APProfile.jsonArr.push(tableDataToJson($(divId).find("#" + cm).find("#DataForm")));
                    if (DUI.profile.APProfile.isDWS3026) {
                        var mj = DUI.profile.APProfile.macToJson(); //补充添加Global的数据
                        if (mj != null) {
                            DUI.profile.APProfile.jsonArr.push(mj);
                        }
                    }
                } else {
                    DUI.profile.APProfile.jsonArr.push(tableDataToJson($(divId).find("#" + cm).find("#DataForm")));
                }
                flag = true;
            }
        }
        if (!flag) {
            DUI.profile.APProfile.jsonArr = null;
            validateSubmit($(divId).find("#approfileDiv"), $(divId).find("#approfileMsg"), true); //添加APProfile红色提示框
        }
    },
    //获取JSON数据
    getJSON: function (module) {
        var result = false;
        if (module == DUI.profile.APProfile.moduleName) {
            if (DUI.profile.APProfile.customCheck()) {
                DUI.profile.APProfile.GetFormData(); //获取Json数据
                if (isEffective(DUI.profile.APProfile.jsonArr) && DUI.profile.APProfile.jsonArr.length > 0) {
                    sendJson(DUI.profile.APProfile.jsonArr);
                    result = true;
                }
            }
        }
        return result;
    },
    //初始化页面给隐藏域赋值
    initApProfile: function () {
        var moduleEnum = DUI.profile.APProfile.moduleEnum;
        var divId = "#" + DUI.profile.APProfile.divId;
        var approfileid = "APProfile_wsAPProfileId_";
        DUI.profile.APProfile.setVal(moduleEnum, approfileid, 1);
        var approfileif = "APProfile_wsAPRadioInterface_";
        var mnArr = new Array(moduleEnum[2], moduleEnum[4], moduleEnum[6], moduleEnum[8]);
        var mnArr1 = new Array(moduleEnum[0], moduleEnum[1], moduleEnum[3], moduleEnum[5], moduleEnum[7]);
        DUI.profile.APProfile.setVal(mnArr1, approfileif, 1);
        DUI.profile.APProfile.setVal(mnArr, approfileif, 2);
        //QoSSetting_1特殊处理
        DUI.profile.APProfile.setVal(new Array(moduleEnum[5], moduleEnum[6]), DUI.profile.APProfile.qosApProfileId, "1,1,1,1");
        DUI.profile.APProfile.setVal(new Array(moduleEnum[5]), DUI.profile.APProfile.qosApRadioIf, "1,1,1,1");
        DUI.profile.APProfile.setVal(new Array(moduleEnum[6]), DUI.profile.APProfile.qosApRadioIf, "2,2,2,2");
        //顺便初始化isEnableChange
        for (var i = 0; i < moduleEnum.length; i++) {
            DUI.profile.APProfile.htmlisEnableControl(moduleEnum[i], ($(divId).find("#" + moduleEnum[i]).find("[name='isEnableChange']").find("option:selected").text() == "Enable") ? true : false);

        }
    },
    setVal: function (modules, name, value) {
        var divId = "#" + DUI.profile.APProfile.divId;
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
            var form = $(divId).find("#" + module);
            form.find("input[name^='" + name + "']").each(function () {
                $(this).val(value);
            });
            form.find("[name='CurrentModuleName']").val(module);
        }
    },
    divNone: function (obj) {
        $(obj).next("div").css("display", "none");
        $(obj).attr("class", "settingListItems listFold");
    },
    divBlock: function (obj) {
        $(obj).next("div").css("display", "block");
        $(obj).attr("class", "settingListItems listUnFold");
    },
    goForward: function (control, level) {
        if (DUI.profile.APProfile.customCheck()) {
            //只有通过自定义验证才能跳转页面
            DUI.profile.APProfile.menuControl(control, level); //左边菜单控制
            //Radio 页面控制
            var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
            if (!DUI.profile.APProfile.isDWS3026 && DUI.profile.APProfile.currentModule == DUI.profile.APProfile.moduleEnum[4]) {
                //APProfile_wsAPRadioPrimaryChannel_wsAPProfileRadioEntry_PageData radio 802.11b/g/n只显示了Lower
                var rpc = $(form).find("[id='APProfile_wsAPRadioPrimaryChannel_wsAPProfileRadioEntry_PageData']");
                $(rpc).find("option").each(function () {
                    if ($(this).text() == "Lower") {
                        $(this).attr("selected", true);
                    } else {
                        $(this).remove();
                    }
                });
            }
        }
    },
    //左边菜单临时对象
    _control: null,
    _level: null,
    _divId: null,
    //左边菜单控制
    menuControl: function (control, level) {
        var divId = "#" + DUI.profile.APProfile.divId;
        if (!control) {
            //如果control是undefined则默认使用GlobalSetting
            control = $(divId).find("#GlobalSetId");
            level = "1";
        }
        DUI.profile.APProfile._control = control;
        DUI.profile.APProfile._level = level;
        DUI.profile.APProfile._divId = divId; //保存临时对象
        var module = $(control).attr("value") || DUI.profile.APProfile.currentModule;
        if (!isEffective(module)) {
            $.error("goForward: module is " + module);
        }
        $(divId).find("[name='TwoMenu']").each(function () {
            $(this).css("color", "#444444"); //还原字体颜色 
        });
        if (level == "1") {//如果是一级菜单，则去掉背景色
            //去掉所有菜单的背景色,隐藏二级菜单
            $(divId).find("[name='OneMenu']").each(function () {
                $(this).parent().css("background", ""); //还原背景色
                if ($(this).attr("id") != "GlobalSetId") {
                    DUI.profile.APProfile.divNone($(this)); //GlobalSetting没有子菜单
                }
            });
            $(control).closest("li").css("background", "#e7e7e7"); //赋背景灰色
            if ($(control).attr("id") != "GlobalSetId") {
                DUI.profile.APProfile.divBlock($(control)); //显示
                if ($(control).next("div").find(".apLeftSubMenu:eq(0)").css("display") != "none") {
                    $(control).next("div").find(".apLeftSubMenu:eq(0)").css("color", "#ed7626"); //给apLeftSubMenu的第一个赋字体颜色
                } else {//3600 2600的情况下只有802.11b/g/n模式
                    module = $(control).next("div").find(".apLeftSubMenu:eq(1)").attr("value");
                    $(control).next("div").find(".apLeftSubMenu:eq(1)").css("color", "#ed7626");
                }
            }
        } else if (level == "2") {//如果是点击二级菜单，添加背景色，添加颜色
            $(control).css("color", "#ed7626");
        }

        if (isEffective(module)) {
            $(divId).find("#d1_right").children("div").each(function () {
                $(this).css("display", "none");
            });
            $(divId).find("#" + module).css("display", "block");
            DUI.profile.APProfile.currentModule = module;
            DUI.profile.APProfile.isEnableChange();
        }
    },
    isEnableChange: function () {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var isEnable = ($(form).find("[name='isEnableChange']").find("option:selected").text() == "Enable") ? true : false;
        DUI.profile.APProfile.customCheck("hiddenAll");
        DUI.profile.APProfile.htmlisEnableControl(DUI.profile.APProfile.currentModule, isEnable);
    },
    //获得是否是Enable然后控制页面是否可用
    htmlisEnableControl: function (module, isEnable) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + module);
        var moduleEnum = DUI.profile.APProfile.moduleEnum;
        var controls = [];
        controlisEnableTable(form.find("[name$='_PageData']"), !isEnable); //所有控件
        if (module == moduleEnum[0] && DUI.profile.APProfile.isDWS3026) {//GlobalSetting
            controls.push(form.find("#" + DUI.profile.APProfile.macId));
            controls.push(form.find("#" + DUI.profile.APProfile.clientNameId));
            //控制Edit显示
            controls.push(form.find("#apRadiusServerSecretEdit"));
            if (form.find("#apRadiusServerSecretEdit").is(":checked") == false) {
                form.find("[name='APProfile_wsAPRadiusServerSecret_wsAPProfileEntry_PageData']").attr("Disabled", true);
            }
            controls.push(form.find("#apRadiusBackuponeServerSecretEdit"));
            if (form.find("#apRadiusBackuponeServerSecretEdit").is(":checked") == false) {
                form.find("[name='APProfile_wsAPRadiusBackuponeServerSecret_wsAPProfileEntry_PageData']").attr("Disabled", true);
            }
            //控制添加按钮
            form.find("input[name='actionBtnAdd']").each(function () {
                controls.push($(this));
                $(this).attr("class", (isEnable == true) ? "bgBtnInput" : "bgBtnInputD");

            });
        } else if (module == moduleEnum[1] || module == moduleEnum[2]) {//SSID
            controls.push(form.find("[name='ssidSelectControl']"));
        }
        controlisEnableTable(mergeArray(controls), !isEnable);
        if (isEnable) {//如果Enable就扫描控件主动触发事件
            form.find("[name$=_PageData]").not("[type=checkbox]").each(function () {
                autoAction($(this));
            });
        }
    },
    //----------------GlobalSettings---------------------
    //var apProfileId = "APProfile_wsAPProfileId_wsAPProfileEntry_PageData";
    apProfileId: "APProfile_wsAPProfileId_wsAPProfileMACAuthenticationListEntry_PageData",
    macId: "APProfile_wsClientMACAddress_wsAPProfileMACAuthenticationListEntry_PageData",
    clientNameId: "APProfile_wsClientNickName_wsAPProfileMACAuthenticationListEntry_PageData",
    //HardwareType选择不同显示内容不同
    HardwareTypeChange: function (control) {
        var divId = "#" + DUI.profile.APProfile.divId;
        var text = $(control).find("option:selected").text();
        var leftMenu = $(divId).find("#d1_left").find(".apLeftSubMenu");
        if (text == "DWL-2600AP Single Radio b/g/n"
        || text == "DWL-3600AP Single Radio b/g/n") {
            $(leftMenu).each(function () {
                if ($(this).text() == "1-802.11a/n") {//2-802.11b/g/n
                    $(this).hide();
                }
            });
        } else {
            $(leftMenu).each(function () {
                if ($(this).text() == "1-802.11a/n" && $(this).is(":hidden")) {
                    $(this).show();
                }
            });
        }
    },
    macToJson: function () {
        var divId = "#" + DUI.profile.APProfile.divId;
        var currentModule = DUI.profile.APProfile.currentModule;
        if ($(divId).find("#" + currentModule).find("[id^='clientMac_']").length > 0) {
            var json = "{\"";
            json += DUI.profile.APProfile.apProfileId + "\":\"" + DUI.profile.APProfile.getjsonStr("clientAPProfile_") + "\",\"";
            json += DUI.profile.APProfile.macId + "\":\"" + DUI.profile.APProfile.getjsonStr("clientMac_") + "\",\"";
            json += DUI.profile.APProfile.clientNameId + "\":\"" + escape(DUI.profile.APProfile.getjsonStr("clientName_")) + "\"";
            json += "}";
            return JSON.parse(json);
        }
        return null;
    },
    getjsonStr: function (name) {
        var divId = "#" + DUI.profile.APProfile.divId;
        var control = $(divId).find("#" + DUI.profile.APProfile.currentModule);
        var str = "";
        $(control).find("[id^='" + name + "']").each(function () {
            str += $(this).text() + ",";
        });
        return str.substring(0, str.lastIndexOf(","));
    },
    addNew: function () {
        var divId = "#" + DUI.profile.APProfile.divId;
        var currentModule = DUI.profile.APProfile.currentModule;
        var data = DUI.profile.APProfile.data;
        var form = $(divId).find("#" + currentModule);
        var proName = "APProfile_wsAPProfileName_wsAPProfileEntry_PageData";
        $(form).find("#" + proName).attr("class", ""); //先去掉profileName的验证
        $(form).find("#" + DUI.profile.APProfile.macId).attr("class", "validate[required,custom[MAC]]");
        $(form).find("#" + DUI.profile.APProfile.clientNameId).attr("class", "validate[required,maxSize[32]]");
        if (Submit()) {
            var control = $(divId).find("#" + currentModule);
            data.approfile = $(control).find("#" + DUI.profile.APProfile.apProfileId).val();
            data.approfileId = "clientAPProfile_" + data.approfile; //clientAPProfileId_1
            data.mac = $(control).find("#" + DUI.profile.APProfile.macId).val();
            data.macId = "clientMac_" + data.mac.replace(/:/g, ""); //clientMac_ 作为删除ID使用
            data.name = $(control).find("#" + DUI.profile.APProfile.clientNameId).val();
            data.nameId = "clientName_" + data.name; //clientName_123

            var obj = $(control).find("#" + data.macId);
            var flag = true;
            if (obj != undefined && obj.length > 0) {//exist
                flag = true;
                ShowMsg(DUI.lang.CfgProfile.existMacMsg, "", "sure", "DUI.profile.APProfile.toAction(" + flag + ");");
            } else {//new
                flag = false;
                DUI.profile.APProfile.addNewRow(data, flag);
            }
        }
        //$(form).find("#" + DUI.profile.APProfile.macId).attr("class", "validate[optional,custom[MAC]]");
        //$(form).find("#" + DUI.profile.APProfile.clientNameId).attr("class", "validate[optional,maxSize[32]]");
        $(form).find("#" + proName).attr("class", "validate[required,maxSize[32]]"); //恢复profileName的验证
    },
    toAction: function (flag) {
        DUI.profile.APProfile.addNewRow(DUI.profile.APProfile.data, flag);
    },
    addNewRow: function (data, flag) {
        var divId = "#" + DUI.profile.APProfile.divId;
        var currentModule = DUI.profile.APProfile.currentModule;
        var form = $(divId).find("#" + currentModule);
        $(form).find("#" + DUI.profile.APProfile.macId).val("");
        $(form).find("#" + DUI.profile.APProfile.clientNameId).val(""); //清空输入框数据
        if (!isEffective(data.macId)) {
            $.error("addNewRow:The ID can't be empty.");
        }
        if (flag) {
            var exist = $(divId).find("#" + currentModule).find("#" + data.macId);
            if (isEffective(exist)) {
                $(exist).parent().parent().remove(); //delete exist data
            }
        }
        var table1 = $(divId).find("#ApProfileStatusTable");
        var firstTr = table1.find('tbody>tr:first');
        var row = $("<tr class='Row'></tr>");
        var td1 = $("<td></td>");
        td1.append($("<span id=\"" + data.macId + "\">" + data.mac + "</span>")); //MAC
        row.append(td1);
        var td2 = $("<td></td>");
        td2.append($("<span id=\"" + data.nameId + "\">" + data.name + "</span>")); //Client Name
        row.append(td2);
        var td3 = $("<td style='display:none'></td>");
        td3.append($("<span id=\"" + data.approfileId + "\">" + data.approfile + "</span>")); //approfileId
        row.append(td3);
        var td4 = $("<td></td>");
        td4.append($("<input  type=\"button\" name=\"actionBtn\" class=\"btnDel\" onClick=\"DUI.profile.APProfile.DeleteRow(this,'" + data.macId + "')\" />"));
        row.append(td4);
        table1.append(row);
        //<input type=\"button\" name=\"actionBtn\" class=\"btnEdit\" onClick=\"EditData('" + json[macId] + "')\" />
        checkNoData(divId, "ApProfileStatusTable"); //检查NoData的情况
    },
    EditData: function (divId, id) {
        //    var n = isExistMac(mac);
        //    var json = "";
        //    if (n != -1) {
        //        json = jsonMacList[n];
        //        $(divId).find("#" + macId).val(json[macId]);
        //        $(divId).find("#" + clientNameId).val(json[clientNameId]);
        //    }
    },
    _control: null,
    _mac: null,
    DeleteRow: function (control, mac) {
        DUI.profile.APProfile._control = control;
        DUI.profile.APProfile._mac = mac;
        ShowMsg(DUI.lang.CfgProfile.delRowMsg, "", "sure", "DUI.profile.APProfile.DeleteRow1()");
    },
    DeleteRow1: function () {
        var divId = "#" + DUI.profile.APProfile.divId;
        $(DUI.profile.APProfile._control).parent().parent().remove(); //delete    
        checkNoData(divId, "ApProfileStatusTable"); //检查NoData的情况
        DUI.profile.APProfile._control = null;
        DUI.profile.APProfile._mac = null;
    },
    //----------------QoSSetings----------------
    qosApProfileId: "APProfile_wsAPProfileId_wsAPProfileQOSEntry_PageData",
    qosApRadioIf: "APProfile_wsAPRadioInterface_wsAPProfileQOSEntry_PageData",
    QosEdcaTemplateChange: function (control) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var tbls = new Array($(form).find("#apEDCA").find("[id$='_PageData']"), $(form).find("#stationEDCA").find("[id$='_PageData']"));
        controlisEnableTable(tbls, $(control).find("option:selected").text() == "Custom" ? false : true);

    },
    //控制cwMin的值始终不大于cwMax的值
    QosAPEDCACheck: function (control) {
        var max = "#APProfile_wsAPEDCAMaxContentionWindow_wsAPProfileQOSEntry_";
        var min = "#APProfile_wsAPEDCAMinContentionWindow_wsAPProfileQOSEntry_"; //"_PageData"
        DUI.profile.APProfile.EDCACheck(control, min, max);
    },
    QosStationEDCACheck: function (control) {
        var max = "#APProfile_wsStationEDCAMaxContentionWindow_wsAPProfileQOSEntry_";
        var min = "#APProfile_wsStationEDCAMinContentionWindow_wsAPProfileQOSEntry_";
        DUI.profile.APProfile.EDCACheck(control, min, max);
    },
    EDCACheck: function (control, min, max) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var val = $(control).val();
        var n = $(control).attr("name").replace(/[^0-9]/ig, "");
        if (n) {
            window._qosControl = control;
            DUI.profile.APProfile.cwMinMax(parseInt(n) + 1, form.find(min + n + "_PageData").val(), form.find(max + n + "_PageData").val());
        }
    },
    cwMinMax: function (row, min, max) {
        if (parseInt(min) > parseInt(max)) {
            var val = ($(window._qosControl).val() == min) ? max : min;
            ShowMsg(DUI.lang.CfgProfile.cwMinMax.format(row), "", "sure", "DUI.profile.APProfile.cwCallBack(" + val + ")");
        }
    },
    cwCallBack: function (val) {
        $(window._qosControl).val(val);
    },
    //----------------RadioSettings----------------
    RadioLoadBalancingMode: function (control) {
        DUI.profile.APProfile.toEnabledOrDisabled($(control), new Array("APProfile_wsAPRadioUtilization_wsAPProfileRadioEntry_PageData"));
    },
    RadioOtherChannelsScanMode: function (control) {
        DUI.profile.APProfile.toEnabledOrDisabled($(control), new Array("APProfile_wsAPRadioOtherChannelsScanInterval_wsAPProfileRadioEntry_PageData", "APProfile_wsAPRadioScanDuration_wsAPProfileRadioEntry_PageData"));
    },
    RadioSentryScanMode: function (control) {
        DUI.profile.APProfile.toEnabledOrDisabled($(control), new Array("APProfile_wsAPRadioSentryScanChannel_wsAPProfileRadioEntry_PageData", "APProfile_wsAPRadioScanDuration_wsAPProfileRadioEntry_PageData"));
    },
    RadioRateLimitMode: function (control) {
        DUI.profile.APProfile.toEnabledOrDisabled($(control), new Array("APProfile_wsAPRadioRateLimit_wsAPProfileRadioEntry_PageData", "APProfile_wsAPRadioRateLimitBurst_wsAPProfileRadioEntry_PageData"));
    },
    toEnabledOrDisabled: function (selectControl, ids) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var controls = [];
        ids = $.merge([], ids);
        for (var i = 0; i < ids.length; i++) {
            controls.push($(form).find("#" + ids[i]));
        }
        controlisEnableTable(controls, ($(selectControl).find("option:selected").text() == "Enable") ? false : true);
    },
    //Basic选中Supported一定选中，Basic取消Supported不取消
    //Supported取消Basic一定取消，Supported选中Basic不选中
    basicFlag: false, //是否有选中的标记
    AdvertisedDataRateSet: function (control) {//DWS3026
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        if (control) {
            var value = $(control).next("span").text();
            if ($(control).is(":checked")) {
                $(form).find("input[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']").each(function () {
                    if ($(this).next().text() == value) {
                        $(this).attr("checked", true);
                        autoAction($(this));
                    }
                });
            }
        }
        //添加验证信息
        var ischecked = $(form).find("input[name='APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData']:checked").length > 0 ? true : false;
        if (ischecked) {//至少一个选取消红色提示框
            validateSubmit($(form).find("#advertisedDataRatesDiv"), $(form).find("#advertisedDataRatesMsg"), false);
        } else {
            validateSubmit($(form).find("#advertisedDataRatesDiv"), $(form).find("#advertisedDataRatesMsg"), true);
        }
        DUI.profile.APProfile.basicFlag = ischecked;
        return ischecked;
    },
    BasicRatesSet: function (control) {//DWS4026/3160
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        if (control) {
            var value = $(control).next("span").text(); //获取对于的值
            if ($(control).is(":checked")) {//选中
                $(form).find("input[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']").each(function () {
                    if ($(this).next().text() == value) {
                        $(this).attr("checked", true);
                        autoAction($(this));
                    }
                });
            }
        }
        //添加验证信息
        var ischecked = $(form).find("input[name='APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData']:checked").length > 0 ? true : false;
        if (ischecked) {//至少一个选取消红色提示框
            validateSubmit($(form).find("#basicRatesDiv"), $(form).find("#basicRatesMsg"), false);
        } else {
            validateSubmit($(form).find("#basicRatesDiv"), $(form).find("#basicRatesMsg"), true);
        }
        DUI.profile.APProfile.basicFlag = ischecked;
        return ischecked;
    },
    SupportedDataRateSet: function (control) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var name = (DUI.profile.APProfile.isDWS3026 == true) ? "APProfile_wsAdvertisedDataRate_wsAPProfileRadioAdvertisedRatesEntry_PageData" : "APProfile_wsBasicDataRate_wsAPProfileRadioBasicRatesEntry_PageData";
        if (control) {
            var value = $(control).next("span").text();
            if (!$(control).is(":checked") && DUI.profile.APProfile.basicFlag) {
                $(form).find("input[name='" + name + "']").each(function () {
                    if ($(this).next().text() == value) {
                        $(this).attr("checked", false);
                        autoAction($(this));
                    }
                });
            }
        }
        //添加验证信息
        var ischecked = $(form).find("input[name='APProfile_wsSupportedDataRate_wsAPProfileRadioSupportedRatesEntry_PageData']:checked").length > 0 ? true : false;
        if (ischecked) {
            validateSubmit($(form).find("#supportedRatesDiv"), $(form).find("#supportedRatesMsg"), false); //取消红色提示框
        } else {
            validateSubmit($(form).find("#supportedRatesDiv"), $(form).find("#supportedRatesMsg"), true);
        }
        return ischecked;
    },
    APRadioFrequencyChange: function (control) {
        var apRCB = "#APProfile_wsAPRadioChannelBandwidth_wsAPProfileRadioEntry_PageData";
        var apRPC = "#APProfile_wsAPRadioPrimaryChannel_wsAPProfileRadioEntry_PageData";
        var apRSGI = "#APProfile_wsAPRadioShortGuardInterval_wsAPProfileRadioEntry_PageData";
        var apRPM = "#APProfile_wsAPRadioProtectionMode_wsAPProfileRadioEntry_PageData";
        var apRSTBCM = "#APProfile_wsAPRadioSTBCMode_wsAPProfileRadioEntry_PageData";
        var apRSAGM = "#APProfile_wsAPRadioSuperAGMode_wsAPProfileRadioEntry_PageData"; //IEEE 802.11a IEEE 802.11b/g 可用
        var limitChannel = "#APProfile_wsAPRadio802dot11aLimitChannelSelection_wsAPProfileRadioEntry_PageData"; //IEEE 802.11a 可用
        //APProfile_wsAPRadioMCSIndexValue_wsAPProfileRadioMCSIndexEntry_PageData dws3160Series:0选中其余全部不选中
        var divId = "#" + DUI.profile.APProfile.divId;
        var currentModule = DUI.profile.APProfile.currentModule;
        var form = $(divId).find("#" + currentModule);
        //IEEE 802.11a  IEEE 802.11b/g
        var text = $(control).find("option:selected").text();
        var isDisable = (text == "IEEE 802.11a" || text == "IEEE 802.11b/g") ? true : false;
        controlisEnableTable([form.find(apRCB), form.find(apRPC), form.find(apRPM), form.find(apRSGI), form.find(apRSTBCM)], isDisable);
        controlisEnableTable(form.find("[name='APProfile_wsAPRadioMCSIndexValue_wsAPProfileRadioMCSIndexEntry_PageData']"), isDisable);
        controlisEnableTable(form.find(apRSAGM), !isDisable);
        controlisEnableTable(form.find(limitChannel), (text == "IEEE 802.11a") ? false : true);
    },
    //----------------SSIDSettings----------------
    vapModeControl: function (obj) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        $(form).find("[name='APProfile_wsVAPId_wsAPProfileVAPEntry_PageData']").attr('checked', $(obj).attr('checked') == 'checked' ? true : false);
        DUI.profile.APProfile.customCheck(); //检查SSID
    },
    SSIDSelectCheck: function (control) {
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        var flag = false;
        var ssidslen = $(form).find("[name='APProfile_wsVAPId_wsAPProfileVAPEntry_PageData']").length;
        var len = $(form).find("input[name='APProfile_wsVAPId_wsAPProfileVAPEntry_PageData']:checked").length;
        var ischeck = (ssidslen == len) ? true : false;
        $(form).find("[name='ssidSelectControl']").attr("checked", ischeck); //全选标记
        if (len > 0) {//至少有一个被选中
            validateSubmit($(form).find("#ssidDiv"), $(form).find("#ssidMsg"), false); //去掉SSID红色提示框
            flag = true;
        } else {
            validateSubmit($(form).find("#ssidDiv"), $(form).find("#ssidMsg"), true); //添加SSID红色提示框
        }
        return flag;
    },
    //给table表单赋值ApProfileDataToForm(control,json)
    macToTable: function () {
        jsonMacList = new Array(); //存放mac对象的数组
    },
    //结果显示控制
    isResultControl: function (xml, isResult, isEdit) {
        var divId = "#" + DUI.profile.APProfile.divId;
        var currentModule = DUI.profile.APProfile.currentModule;
        var data = DUI.profile.APProfile.data;
        if (DUI.profile.APProfile.isDWS3026) {
            $(xml).find("wsAPProfileMACAuthenticationListEntry").children("Item").each(function () {
                data.approfile = $(this).attr("wsAPProfileId");
                data.approfileId = "clientAPProfile_" + data.approfile; //clientAPProfileId_1  
                data.mac = $(this).attr("wsClientMACAddress");
                data.macId = "clientMac_" + data.mac.replace(/:/g, ""); //clientMac_ 作为删除ID使用
                data.name = $(this).attr("wsClientNickName");
                data.nameId = "clientName_" + data.name; //clientName_123        
                DUI.profile.APProfile.addNewRow(data, false);
            });
            if (isEdit == "True") {
                $(divId).find("#" + DUI.profile.APProfile.macId).val("");
                $(divId).find("#" + DUI.profile.APProfile.clientNameId).val("");
            }
            if (isResult == "True") {
                controlisEnableTable(new Array($(divId).find("#apRadiusServerSecretEdit"), $(divId).find("#apRadiusBackuponeServerSecretEdit")), true);
                $(divId).find("#wsAPProfileMACAuthenticationListEntry").hide();
                //删除Action列
                $(divId).find("#ApProfileStatusTable thead tr th").each(function () {
                    if ($.trim($(this).text()) == "Action") {
                        $(this).remove();
                    }
                });
                //删除
                $(divId).find("[name^='actionBtn']").each(function () {
                    $(this).parent().remove();
                });
                var table = $(divId).find("#ApProfileStatusTable tr");
                if (table.length <= 2) {
                    //table.parent("div").remove();
                    table.remove();
                }
            }
        }
        if (isResult == "True") {
            controlisEnableTable($(divId).find("[name='ssidSelectControl']"), true);
            $(divId).find("[name='isEnableChange']").each(function () {
            //modify by lihailong 2014-10-29 写法错误
                //  $(this).find("option[text='Disable']").attr("selected", true);

                $(this).val("Disable").prop("selected", true);
            });
            controlisEnableTable($(divId).find("[name='isEnableChange']"), true);
            setReadOnlyToControl(divId); //控件全部不可用
            $(divId).find("input[name='ssidSelectControl']").each(function () {
                $(this).next("span").remove();
                $(this).remove();
            });
        }
    },
    //页面自定义验证
    customCheck: function (hiddenAll) {
        var moduleEnum = DUI.profile.APProfile.moduleEnum;
        var currentModule = DUI.profile.APProfile.currentModule;
        var form = $("#" + DUI.profile.APProfile.divId).find("#" + DUI.profile.APProfile.currentModule);
        if (isEffective(hiddenAll)) {
            HideAllValidate(); //去掉所有验证红色框
            validateSubmit($("#approfileDiv"), $("#approfileMsg"), false); //去掉APProfile红色提示框
            if (currentModule == moduleEnum[1] || currentModule == moduleEnum[2]) {
                validateSubmit($(form).find("#ssidDiv"), $(form).find("#ssidMsg"), false); //去掉SSID红色提示框
            }
            else if (currentModule == moduleEnum[3] || currentModule == moduleEnum[4]) {
                validateSubmit($(form).find("#supportedRatesDiv"), $(form).find("#supportedRatesMsg"), false); //取消红色提示框
                if (DUI.profile.APProfile.isDWS3026) {
                    validateSubmit($(form).find("#advertisedDataRatesDiv"), $(form).find("#advertisedDataRatesMsg"), false);
                } else {
                    validateSubmit($(form).find("#basicRatesDiv"), $(form).find("#basicRatesMsg"), false);
                }
            }
            return true;
        }
        else if (isEffective(currentModule)) {
            var enableChange = $(form).find("[name='isEnableChange']").find("option:selected").text();
            if (enableChange != "Enable") {
                return true;
            }
            var result;
            if (currentModule == moduleEnum[1] || currentModule == moduleEnum[2]) {
                result = DUI.profile.APProfile.SSIDSelectCheck();
            }
            else if (currentModule == moduleEnum[3] || currentModule == moduleEnum[4]) {
                var result1;
                if (DUI.profile.APProfile.isDWS3026 == true) {
                    result1 = DUI.profile.APProfile.AdvertisedDataRateSet()
                } else {
                    result1 = DUI.profile.APProfile.BasicRatesSet();
                }
                result = (DUI.profile.APProfile.SupportedDataRateSet() && result1);
            }
            else if (currentModule == moduleEnum[0]) {
                $(form).find("#" + DUI.profile.APProfile.macId).attr("class", "validate[optional,custom[MAC]]");
                $(form).find("#" + DUI.profile.APProfile.clientNameId).attr("class", "validate[optional,maxSize[32]]");
                result = true;
            } else {
                result = true;
            }
            return Submit() && result;
        }
    },
    //控制Select选项,隐藏和显示
    ControlChannel: function (control, channelArr) {
        var count = $(control).find("option").length;
        var allShow = (channelArr.length == 0) ? true : false;
        var value = (allShow == true) ? "Any" : channelArr[0];
        $(control).find("option").each(function () {
            if (!allShow) {
                if (channelArr.contains($(this).text())) {
                    channelArr.remove($(this).text());
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });

        $(control).val(value); //设置Select的Value值为()的项选中   
    },
    //加载子页面
    LoadSubModuleHtml: function (divId, subHtmls, callBack) {
        var hash = new Hashtable();
        for (var i = 0; i < subHtmls.length; i++) {
            var key = subHtmls[i].substring(subHtmls[i].indexOf("[") + 1, subHtmls[i].indexOf("]"));
            var value = subHtmls[i].substring(subHtmls[i].indexOf("]") + 1);
            hash.add(key.replace("Sub_APProfile_", "").replace("_dws3026", ""), value);
        }
        var moduleEnums = DUI.profile.APProfile.moduleEnum.concat();
        DUI.profile.APProfile.ScheduleSubHtml(divId, moduleEnums, hash, callBack);
    },
    // 异步遍历子页面
    ScheduleSubHtml: function (divId, moduleEnums, hash, callBack) {
        var module = moduleEnums.shift();
        if (module != undefined && moduleEnums.length >= 0) {
            var moduleKey = module;
            if (moduleKey.indexOf('_') > 0) {
                moduleKey = moduleKey.split('_')[0];
            }

            $("#" + divId).find("#" + module).html(hash._hash[moduleKey]);
            var initPagetimer = setTimeout(function () { DUI.profile.APProfile.ScheduleSubHtml(divId, moduleEnums, hash, callBack) }, 1);
        }
        else {
            window.clearTimeout(initPagetimer);
            callBack();
        }
    }
}

//点击Reset时调用
function ResetControl() {
    var divId = "#" + DUI.profile.APProfile.divId;
    //去掉所有验证信息
    DUI.profile.APProfile.customCheck("hiddenAll");
    //isEnableChange设置为Disable
    $(divId).find("[name='isEnableChange']").each(function () {
        $(this).find("option[value='Disable']").attr("selected", true); ;
        autoAction($(this));
    });
    //恢复到GlobalSetting页面
    DUI.profile.APProfile.goForward($(divId).find("#GlobalSetId"), "1");
}

// 配合海龙写的清空方法
function clearAll() {
    if (initPagetimer) {
        window.clearTimeout(initPagetimer);
    }
}