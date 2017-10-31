DUI.profile.WirelessConfiguration = {
    item1: "",
    item2: "",
    oids: "",
    divId: "",
    InitProfileHtmlPage: function (oids, divId, moduleName, operation) {
        if (moduleName != "WirelessConfiguration") {
            return;
        }
        var dap2553 = DUI.profile.DAP.dap2553;
        var dap2553C = DUI.profile.DAP.dap2553C;
        var dap2590 = DUI.profile.DAP.dap2590;
        var dap3520 = DUI.profile.DAP.dap3520;
		
        var dap2690 = DUI.profile.DAP.dap2690;
        var dap2690B = DUI.profile.DAP.dap2690B;
		var dap3690 = DUI.profile.DAP.dap3690;
		var dap2660 = DUI.profile.DAP.dap2660;
		var dap2695 = DUI.profile.DAP.dap2695;
		var dap3662 = DUI.profile.DAP.dap3662;
		
        var dap2360A = DUI.profile.DAP.dap2360A;
        var dap2360B = DUI.profile.DAP.dap2360B;      
        var dap2310 = DUI.profile.DAP.dap2310;
        var dap2310A = DUI.profile.DAP.dap2310A;
        var dap2310B = DUI.profile.DAP.dap2310B;
		var dap2330 = DUI.profile.DAP.dap2330;
						
        //var dot24 = DUI.profile.DAP.getDot24();
        var band24Id = "WirelessConfiguration_dot11Band-Item1_dot11ParametersEntry_PageData";
        var band5Id = "WirelessConfiguration_dot11Band-Item2_dot11ParametersEntry_PageData";
        var channel24Id = "WirelessConfiguration_dot11Channel-Item1_dot11ParametersEntry_PageData";
        var channel5Id = "WirelessConfiguration_dot11Channel-Item2_dot11ParametersEntry_PageData";
        var dataRate24Id = "WirelessConfiguration_dot11DataRate-Item1_dot11ParametersEntry_PageData";
        var dataRate5Id = "WirelessConfiguration_dot11DataRate-Item2_dot11ParametersEntry_PageData";
        DUI.profile.WirelessConfiguration.divId = divId;
        DUI.profile.WirelessConfiguration.oids = oids; //Device　OID   
        $("#" + divId).find("[name='WirelessConfiguration_dot11Band-Item_dot11ParametersEntry_PageData']").each(function () {
            DUI.profile.WirelessConfiguration.dotBandChange($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () {
                    DUI.profile.WirelessConfiguration.dotBandChange($(this));
                });
        });
        var channel24 = $("#" + divId).find("#" + channel24Id);
        var channel5 = $("#" + divId).find("#" + channel5Id);
        var dataRate24 = $("#" + divId).find("#" + dataRate24Id);
        var dataRate5 = $("#" + divId).find("#" + dataRate5Id);
        //2.4Ghz Channel
        if (oids.indexOf(dap2310) != -1 
			|| oids.indexOf(dap2310A) != -1 
			|| oids.indexOf(dap2310B) != -1
            || oids.indexOf(dap2590) != -1) {
            DUI.profile.WirelessConfiguration.ShowSelectOption(channel24, new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13));
        } 
		if (oids.indexOf(dap2360A) != -1 
			|| oids.indexOf(dap2360B) != -1 
			|| oids.indexOf(dap3690) != -1 
			|| oids.indexOf(dap3520) != -1
			|| oids.indexOf(dap2690) != -1 
			|| oids.indexOf(dap2690B) != -1 
			|| oids.indexOf(dap2553) != -1 
			|| oids.indexOf(dap2553C) != -1
			|| oids.indexOf(dap2330) != -1
			|| oids.indexOf(dap3662) != -1) {
            DUI.profile.WirelessConfiguration.ShowSelectOption(channel24, new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11));
        }
        //5.0GHz Channel
        if (oids.indexOf(dap2690) != -1) {
            DUI.profile.WirelessConfiguration.ShowSelectOption(channel5, new Array(52, 56, 60, 64, 149, 153, 157, 161, 165));
        } 
		if(oids.indexOf(dap2690B) != -1
			|| oids.indexOf(dap2660) != -1
			|| oids.indexOf(dap2695) != -1){
			DUI.profile.WirelessConfiguration.ShowSelectOption(channel5, new Array(36,40,44,48,149,153,157,161,165));
		}
		if (oids.indexOf(dap3520) != -1 
				|| oids.indexOf(dap3690) != -1 
				|| oids.indexOf(dap2590) != -1
                || oids.indexOf(dap2553) != -1 
				|| oids.indexOf(dap2553C) != -1
				|| oids.indexOf(dap3662) != -1) {
            DUI.profile.WirelessConfiguration.ShowSelectOption(channel5, new Array(149, 153, 157, 161, 165));
        }		
			
        //dataRate
        if (oids.indexOf(dap3520) != -1) {
            DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate24, new Array(6, 9, 12, 18, 24, 36, 48, 54));
            DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate5, new Array(6, 9, 12, 18, 24, 36, 48, 54));
        } 
		else if(oids.indexOf(dap3662) != -1 || oids.indexOf(dap2690B) != -1){
			DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate24, new Array(1,2,5.5,6,9,11,12,18,24,36,48,54));
            DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate5, new Array(6, 9, 12, 18, 24, 36, 48, 54));
		}
		else {
            DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate24, new Array(1, 2, 5.5, 11, 6, 9, 12, 18, 24, 36, 48, 54));
            DUI.profile.WirelessConfiguration.ShowSelectOption(dataRate5, new Array(1, 2, 5.5, 11, 6, 9, 12, 18, 24, 36, 48, 54));
        }
		
		var cw1 = "WirelessConfiguration_dot11ChannelWidth-Item1_dot11ParametersEntry_PageData";
		var cw2 = "WirelessConfiguration_dot11ChannelWidth-Item2_dot11ParametersEntry_PageData";
		$("#" + divId).find("#" + cw1).find("option[text='Auto 20/40/80MHz']").remove();
		if(oids.indexOf(dap3662) == -1){
			$("#" + divId).find("#" + cw2).find("option[text='Auto 20/40/80MHz']").remove();
		}

        DUI.profile.WirelessConfiguration.item1 = $("#" + divId).find("[name*='-Item1']");
        DUI.profile.WirelessConfiguration.item2 = $("#" + divId).find("[name*='-Item2']");
        //if (oids.indexOf(dap2360) != -1 || oids.indexOf(dap2310) != -1) {//只支持2.4GHz 2360 2310 
            //$("#band5ghz").hide();//此处在ProfileModuleManaged文件里控制
        ///}
        controlDisplay(DUI.profile.WirelessConfiguration.item2, "none"); //隐藏控件
        $("#" + divId).find("[id^='WirelessConfiguration_dot11AutoChannelScan']").each(function () {
            DUI.profile.WirelessConfiguration.autoChannelChange($(this));
            if (isBindEvent($(this)))//判断是否已经绑定方法，否则不需再绑定
                $(this).bind("change", function () { DUI.profile.WirelessConfiguration.autoChannelChange($(this)); });
        });
    },
    //控制控件是否可用 ControlisEnable(control, trueOrFalse)
    autoChannelChange: function (control) {
        var divId = "#" + DUI.profile.WirelessConfiguration.divId;
        var channel1 = $(divId).find("#WirelessConfiguration_dot11Channel-Item1_dot11ParametersEntry_PageData");
        var channel2 = $(divId).find("#WirelessConfiguration_dot11Channel-Item2_dot11ParametersEntry_PageData");
        var name = $(control).attr("id");
        var value = $(control).find("option:selected").text();
        controlisEnable((name.indexOf("Item1") != -1) ? channel1 : channel2, (value == "Enable") ? true : false);

    },
    dotBandChange: function (control) {
        var value = $(control).find("option:selected").text();
        controlDisplay(DUI.profile.WirelessConfiguration.item1, (value == "2.4GHz") ? "" : "none"); //隐藏控件
        controlDisplay(DUI.profile.WirelessConfiguration.item2, (value == "2.4GHz") ? "none" : "");

    },
    //Select 下拉框中删除不显示的项
    ShowSelectOption: function (control, optionsArr) {
        var count = $(control).find("option").length;
        var flag = true;
        $(control).find("option").each(function () {
            flag = true;
            for (var i = 0; i < optionsArr.length; i++) {
                if (optionsArr[i] == $(this).text()) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                $(this).remove();
            }
        });
    }
}