#!/bin/sh

# 02/02/2017:
# replace   ".9" to ".70.3.2.0.2"
# example:   .1.3.6.1.4.1.171.9.         1.3.1.0
#            .1.3.6.1.4.1.171.70.3.2.0.2.1.3.1.0


host="172.18.190.222"

printf "\n### DWM-312's Enterprise MIB (171) ### \n"
printf "############ Device ########### \n\n"

echo "Device Model Name"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.1.0
printf "\n"

echo "Device HW version"
snmpget -v 2c -c public $host .1.3.6.1.2.1.16.19.3.0
printf "\n"

echo "Device IP address"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.1.2.0
printf "\n"

echo "Device MAC address"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.1.7.0
printf "\n"

echo "Device Uptime"
snmpget -v 2c -c public $host .1.3.6.1.2.1.1.3.0
printf "\n"

echo "Device FW version"
snmpget -v 2c -c public $host .1.3.6.1.2.1.16.19.2.0
printf "\n"

echo "Enterprise/Vendor ID"
snmpget -v 2c -c public $host .1.3.6.1.2.1.1.2.0
printf "\n"

echo "Device Mode {0:RouterMode | 1:BridgeMode}"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.7.1.0
printf "\n"

echo "Contact"
snmpget -v 2c -c public $host .1.3.6.1.2.1.1.4.0
printf "\n"

echo "Name"
snmpget -v 2c -c public $host .1.3.6.1.2.1.1.5.0
printf "\n"

echo "Location"
snmpget -v 2c -c public $host .1.3.6.1.2.1.1.6.0
printf "\n"

echo "FOTA Upgrade Error Status"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.3.6.0
printf "\n"

echo "CPU usage"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.3.9.0
printf "\n"

echo "Memory usage"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.3.10.0
printf "\n"

printf "\n############ Modem ########### \n\n"

echo "Modem IMEI"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.26.1
printf "\n"

echo "Modem Model Name"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.2.1
printf "\n"

echo "Modem FW version"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.25.1
printf "\n"

echo "Date/Time"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.5.1.1.2.0
printf "\n"

echo "Time Zone"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.7.2.0
printf "\n"

echo "Modem Tempterature"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.14.0
printf "\n"

echo "Modem GPS Location"           # (.1.3.6.1.4.1.171.9.         1.3.1.0)
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.3.1.0
printf "\n"

printf "\n############ SIM ########### \n\n"

echo "SIM IMSI"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.19.1
printf "\n"

echo "SIM SMSC"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.20.1
printf "\n"

echo "Working SIM  {0:NoSIM | 1:SIM1 | 2:SIM2}"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.1.0
printf "\n"

echo "SIM Status {0:LockedByPINcode | 1:Ready | 2:SIMAbsent | 3:PINCodeIncorrect "
echo "            4:PINCodeAbsent   | 5:LockedByPUKcode | 6:InvalidSIMCard      }"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.22.1
printf "\n"

printf "\n############ Service ########### \n\n"

echo "Service MCC"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.9.1
printf "\n"

echo "Service MNC"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.10.1
printf "\n"

echo "Operator Name"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.2.0
printf "\n"

echo "Service Type: {0:2G | 1:None | 2:3G | 7:4G}"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.6.1
printf "\n"

echo "TAC"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.12.1
printf "\n"

echo "LAC"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.11.1
printf "\n"

echo "Cell ID"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.13.1
printf "\n"

echo "Signal (%)"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.4.1
printf "\n"

echo "RSSI"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.14.1
printf "\n"

echo "RSRP"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.27.1
printf "\n"

echo "RSRQ"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.5.1.1.28.1
printf "\n"

echo "Service Register Status {0:Idel | 1:Registered | 2: Search | 3:Roaming}"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.9.0
printf "\n"

echo "Modem Supporting Bands(4G LTE)"
printf "  N/A"
printf "\n"

echo "Modem Supporting Bands(3G)"
printf "  N/A"
printf "\n"

echo "Modem Supporting Bands(2G)"
printf "  N/A"
printf "\n"

echo "Modem Current Band"
printf "  N/A"
printf "\n"

printf "\n############ Traffice ########### \n\n"

echo "Traffice Upload"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.8.0
printf "\n"

echo "Traffice Download"
snmpget -v 2c -c public $host .1.3.6.1.4.1.171.70.3.2.0.2.1.1.6.7.0
printf "\n"

printf "\n############ Misc. ########### \n\n"
# echo "FOTA Address"
printf "  N/A\n"
printf "\n"


# echo "FOTA command (Set, 0/1:Check Update/2: Update)"
# printf "\n"
