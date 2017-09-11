var identifier = 1;
var utc = "";
var temp_obj = [];
var isNew = null;
var global_record_sequence = "";

$(document).ready(function (e)
{
    
    appendGroupEquipment();

    getUTC();

    //for barcode
    $.ajax({
        url: '/Configuration/GetIsScanner',
        method: 'GET'
    }).success(function (isScanner) {

        if (isScanner.toString().toUpperCase() == "TRUE") {
            $('#txtLotNumber').attr('readonly', 'readonly');
            $('#txtOperator').attr('readonly', 'readonly');
        }
        else {
            $('#txtLotNumber').keypress(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13) {
                    GetDetails();
                }
            });
        }
    });

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {

            $("#txtLotNumber").val(code);
            GetDetails();
        }
    });

    $("#txtOperator").codeScanner({
        onScan: function ($element, code) {

            $("#txtOperator").val(code);
        }
    });

    $('#btnFocusLotNumber').click(function () {
        $("#txtLotNumber").focus();

        $("#divLot").fadeTo(100, 0.1).fadeTo(200, 1.0);
        $("#txtLotNumber").addClass('focused');

        setTimeout(function () {
            $("#txtLotNumber").removeClass('focused');
        }, 500);
    });

    $('#btnFocusOperatorID').click(function () {

        $("#txtOperator").focus();

        $("#divOper").fadeTo(100, 0.1).fadeTo(200, 1.0);

        $("#txtOperator").addClass('focused');

        setTimeout(function () {
            $("#txtOperator").removeClass('focused');
        }, 500);
    });

    var EmployeeNumber = getCookie("EmployeeNumber");

    if (EmployeeNumber.length > 4) {
        EmployeeNumber = EmployeeNumber.slice(-4);
        $("#txtOperator").attr("disabled", "disabled");
        $("#btnFocusOperatorID").hide();
        $("#divOper").removeClass('input-group');
        $("#txtOperator").val(EmployeeNumber);
    }

    PopulateObjectType();

    $('#ddObjectType').change(function () {

        var objectType = $('#ddObjectType').val();

        PopulateSetup(objectType);

        if(objectType == 'Container')
        {
            $('#divContainer').show();
            $('#divEquipment').hide();
        }
        else
        {
            $('#divEquipment').show();
            $('#divContainer').hide();
        }
    });

    $('#ddWIPDataSetup').change(function () {
        GetRecordSequence();
    });

    $('#ddEquipment').change(function () {
        GetDetails();
    });

    $('#btnCheckLot').click(function () {

        GetDetails();
    });

    //$('#btnRefreshEquipment').click(function () {

    //    GetDetails();
    //});

    $('#btnSubmit').click(function () {

        notification_modal_submit();
    });

    HideLoading();
});

function notification_modal_submit()
{
    var user = $('#txtOperator').val().trim();
    var ObjectType = $("#ddObjectType option:selected").val();
    var AdhocWIPDataSetup = $("#ddWIPDataSetup option:selected").val();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim();
    var objectName = '';

    if (ObjectType == 'Equipment')
    {
        objectName = equipment;
    }
    else
    {
        objectName = lot;
    }

    if (user == '' || user == null)
    {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    if (isNew == null)
    {
        notification_modal_dynamic("Notification", "Please fill in Adhoc WIP Data Setup Details", "danger", identifier);
        identifier++;
        return;
    }
    else
    {
        var RecordSequence = global_record_sequence;
        var lstValue = '';
        var lstField = '';

        objectName = $('#txtObjectName').val();

        for (var i = 0; i < temp_obj.length; i++) {
            lstField += temp_obj[i].WIPDataPrompt;
            lstValue += $('#txt_' + i).val();

            if (i != temp_obj.length - 1) {
                lstField += ',';
                lstValue += ',';
            }
        }

        header_style = 'style="background-color: #1DB198; color: #ffffff;"';

        var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        modal += '<div class="modal-dialog">';
        modal += '<div class="modal-content">';

        modal += '<div class="modal-header" ' + header_style + '>';
        modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
        modal += '</div>';

        modal += '<div class="modal-body"><br />';
        modal += "Are you sure you want to proceed?";
        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';
        modal += '<button type="button" class="btn btn-success" onclick="ProceedSubmit(' + "'" + AdhocWIPDataSetup + "'" + "," + "'" + ObjectType + "'" + "," + "'" + objectName + "'" + "," + "'" + RecordSequence + "'" + "," + "'" + lstField + "'" + "," + "'" + lstValue + "'" + "," + "'" + user + "'" + ');">OK</button>';
        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#notification_modal").html(modal);
        $("#modal_div").modal("show");
        $("#modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    }
}

function ProceedSubmit(AdhocWIPDataSetup, objectType, objectName, RecordSequence, lstField, lstValue, user)
{
    $("#modal_div").modal("hide");

    var temp_identifier = 0;

    $.ajax({
        url: '/AdhocWIPData/AdhocWIPData_Submit',
        data: { AdhocWIPDataSetup: AdhocWIPDataSetup, ObjectName: objectName, ObjectType: objectType, RecordSequence: RecordSequence, lstField: lstField, lstValue: lstValue, UserID: user },
        method: 'POST',
        beforeSend: function () {
            notification_modal_dynamic_loading("Notification", 'Submitting Adhoc WIP Data... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (result) {

        //result = 'Success';

        setTimeout(function () {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            if (result.toUpperCase().includes("ERROR")) {

                var temp = result.replace("ERROR:", "").replace("Error:", "");
                notification_modal_dynamic("Notification", temp, 'danger', identifier);
                identifier++;
            }
            else {

                temp_obj = [];
                isNew = null;
                global_record_sequence = "";

                $("#ddEquipment").prop('selectedIndex', 0);
                $('#txtLotNumber').val("");

                $('#divDetailsDynamic').empty();
                $('#divRecordSequenceDynamic').empty();

                GetRecordSequence();

                var temp = result.replace("RESULT:", "").replace("Result:", "");
                notification_modal_dynamic("Notification", temp, 'success', identifier);
                identifier++;
            }

        }, 1000);

        


    }).error(function (e) {

        setTimeout(function () {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
            identifier++;

        }, 1000);
    });
}

function getUTC() {
    $.ajax({
        url: '/MaterialSetup/GetUTC',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
    }).success(function (result) {
        utc = result;
    });
}

function ConvertToUTCTime(strDate) {
    if (strDate == null || strDate == "") {
        return "";
    }
    else {
        var arr = strDate.split(' ');

        var date = "";
        var time = "";
        var am_pm = "";

        for (var i = 0; i < arr.length; i++) {
            if (i == 0) {
                date = arr[i];
            }

            if (i == 1) {
                time = arr[i];
            }

            if (i == 2) {
                am_pm = arr[i];
            }
        }

        var arrDate = date.split('/');

        var month = "";
        var day = "";
        var year = "";

        for (var i = 0; i < arrDate.length; i++) {
            if (i == 0) {
                month = arrDate[i];
            }

            if (i == 1) {
                day = arrDate[i];
            }

            if (i == 2) {
                year = arrDate[i];
            }
        }

        if (parseInt(month) < 10) {
            month = "0" + month;
        }

        if (parseInt(day) < 10) {
            day = "0" + day;
        }

        var arrTime = time.split(':');

        var hour = "";
        var minute = "";
        var second = "";

        for (var i = 0; i < arrTime.length; i++) {
            if (i == 0) {
                hour = arrTime[i];
            }

            if (i == 1) {
                minute = arrTime[i];
            }

            if (i == 2) {
                second = arrTime[i];
            }
        }

        if (am_pm == "PM") {
            if (hour != 12) {
                hour = parseInt(hour) + 12;
            }
        }
        else if (am_pm == "AM") {
            if (parseInt(hour) == 12) {
                hour = "00";
            }
            else if (parseInt(hour) < 10) {
                hour = "0" + hour;
            }
        }

        newDate = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + utc;

        return newDate;
    }
}

function ConvertToStandardTime(strDate) {
    if (strDate == null || strDate == "") {
        return "";
    }
    else {
        strDate = strDate.replace(utc, "+00:00");

        var date = new Date(strDate);
        var offset = date.getTimezoneOffset();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var year = date.getUTCFullYear();
        var hour = date.getUTCHours();
        var minute = date.getUTCMinutes();
        var second = date.getUTCSeconds();

        var am_pm = "";

        if (parseInt(hour) > 11) {

            am_pm = "PM";

            if (parseInt(hour) > 12) {
                hour = parseInt(hour) - 12;
            }
        }
        else {

            am_pm = "AM";

            if (parseInt(hour) == 0) {
                hour = 12;
            }

        }

        if (parseInt(minute) < 10) {
            minute = "0" + minute.toString();
        }

        if (parseInt(second) < 10) {
            second = "0" + second.toString();
        }

        var newDate = month + "/" + day + "/" + year + " " + hour + ":" + minute + ":" + second + " " + am_pm;

        return newDate;
    }
}

function GetDetails(RecordSequence, ObjectName, ObjectRevision)
{
    temp_obj = [];
    var objTypeIndex = $("#ddObjectType").prop('selectedIndex');
    var WipDataIndex = $("#ddWIPDataSetup").prop('selectedIndex');
    var MachineIndex = $("#ddEquipment").prop('selectedIndex');

    var lot = $('#txtLotNumber').val().toUpperCase();
    var objType = $("#ddObjectType option:selected").val();
    var equipment = $("#ddEquipment option:selected").text();
    var setup = $("#ddWIPDataSetup option:selected").val();
    var user = $('#txtOperator').val().trim();

    if (objTypeIndex == 0)
    {
        notification_modal_dynamic("Notification", "Please select Object Type", "danger", identifier);
        identifier++;
        return;
    }

    if (WipDataIndex == 0) {
        notification_modal_dynamic("Notification", "Please select WIP Data Setup", "danger", identifier);
        identifier++;
        return;
    }

    if (user == "" || user == null)
    {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    var html = "";

    if (RecordSequence == null || RecordSequence == undefined || ObjectName == null || ObjectName == undefined)
    {
        if (objType == "Equipment" && MachineIndex == 0)
        {
            notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
            identifier++;
            return;
        }

        if (objType == "Container" && lot == "") {
            notification_modal_dynamic("Notification", "Please enter Lot Number", "danger", identifier);
            identifier++;
            return;
        }

        var name = "";
        if (objType == "Container")
        {
            name = lot;
        }
        else
        {
            name = equipment;
        }

        html = '<label style="display:none;" for="txtRecordSequence">Record Sequence:</label>';
        html += '<input style="display:none;" type="text" class="form-control" id="txtRecordSequence" value="" disabled="disabled" placeholder="Record Sequence">';

        html += '<label for="txtObjectName">Object Name:</label>';
        html += '<input type="text" class="form-control" id="txtObjectName" value="' + name + '" disabled="disabled" placeholder="Record Sequence">';

        global_record_sequence = "";
        isNew = true;
        $('#divDetailsDynamic').empty();
        $('#divDetailsDynamic').append(html);

        //todo populate here
        $.ajax({
            url: '/AdhocWIPData/GetDetails',
            method: 'POST',
            data: { AdhocWIPDataSetup: setup, ObjectType: objType, ObjectName: name, ObjectRevision: '', RecordSequence: '', UserID: user }
        }).success(function (obj) {

            if (obj != null) {

                if (obj.length > 0) {
                    temp_obj = obj;
                    html = '';
                    for (var i = 0; i < obj.length; i++) {
                        html = '<hr/>';
                        html += '<label>WIP Data Prompt:</label><br/>';
                        html += '<label for="txt_' + i + '" style="font-weight:bold;">' + obj[i].WIPDataPrompt + '</label><br/>';
                        html += '<label for="txtUOM_' + i + '">' + "UOM" + ':' + '</label><br/>';
                        html += '<input type="text" class="form-control" id="txtUOM_' + i + '" value="' + obj[i].UOM + '" disabled="disabled">';
                        html += '<label for="txt_' + i + '">' + 'WIP Data Value:' + '</label>';
                        html += '<input type="text" class="form-control" id="txt_' + i + '" value="' + obj[i].WIPDataValue + '" placeholder="' + obj[i].WIPDataPrompt + '">';
                        $('#divDetailsDynamic').append(html);
                    }
                }
            }
        });
    }
    else
    {
        global_record_sequence = RecordSequence;
        isNew = false;
        $("#ddEquipment").prop('selectedIndex', 0);
        $('#txtLotNumber').val("");
        $('#divDetailsDynamic').empty();

        html = '<label for="txtRecordSequence">Record Sequence:</label>';
        html += '<input type="text" class="form-control" id="txtRecordSequence" value="' + RecordSequence + '" disabled="disabled" placeholder="Record Sequence">';

        html += '<label for="txtObjectName">Object Name:</label>';
        html += '<input type="text" class="form-control" id="txtObjectName" value="' + ObjectName + '" disabled="disabled" placeholder="Record Sequence">';
        $('#divDetailsDynamic').append(html);

        $.ajax({
            url: '/AdhocWIPData/GetDetails',
            method: 'POST',
            data: { AdhocWIPDataSetup: setup, ObjectType: objType, ObjectName: ObjectName, ObjectRevision: ObjectRevision, RecordSequence: RecordSequence, UserID: user }
        }).success(function (obj) {
        
            if (obj != null) {

                if (obj.length > 0)
                {
                    temp_obj = obj;
                    html = '';
                    for (var i = 0; i < obj.length; i++)
                    {
                        html = '<hr/>';
                        html += '<label>WIP Data Prompt:</label><br/>';
                        html += '<label for="txt_' + i + '" style="font-weight:bold;">' + obj[i].WIPDataPrompt + '</label><br/>';
                        html += '<label for="txtUOM_' + i + '">' + "UOM" + ':' + '</label><br/>';
                        html += '<input type="text" class="form-control" id="txtUOM_' + i + '" value="' + obj[i].UOM + '" disabled="disabled">';
                        html += '<label for="txt_' + i + '">' + 'WIP Data Value:' + '</label>';
                        html += '<input type="text" class="form-control" id="txt_' + i + '" value="' + obj[i].WIPDataValue + '" placeholder="' + obj[i].WIPDataPrompt + '">';
                        $('#divDetailsDynamic').append(html);
                    }
                }
            }
        });

    }
}

function GetRecordSequence()
{
    isNew = null;
    var UserID = $('#txtOperator').val();

    if (UserID == null || UserID == "")
    {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    var ObjectType = $('#ddObjectType').val();
    var AdhocWIPDataSetup = $('#ddWIPDataSetup').val();

    $('#divRecordSequenceDynamic').empty();
    $('#divDetailsDynamic').empty();

    $.ajax({
        url: '/AdhocWIPData/GetRecordSequence',
        method: 'POST',
        data: { AdhocWIPDataSetup: AdhocWIPDataSetup, ObjectType: ObjectType, UserID: UserID }
    }).success(function (obj) {
        
        if (obj != null) {

            if (obj.length > 0)
            {
                var html = "";

                html = '<table align="left">'
                html += '<tr>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Action' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'No' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Record Sequence' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Object Name' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Object Revision' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Timestamp' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Username' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Creation Timestamp' + '</td>';
                html += '<td style="padding-bottom:10px;padding-right:10px;font-weight:bold;">' + 'Creation Username' + '</td>';
                html += '</tr>';

                for (var i = 0; i < obj.length; i++)
                {
                    html += '<tr>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + '<input onclick="GetDetails(' + "'" + obj[i].RecordSequence + "'" + "," + "'" + obj[i].ObjectName + "'" + "," + "'" + obj[i].ObjectRevision + "'" + ');' + '" class="btn btn-info" type="button" value="View">' + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].No + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].RecordSequence + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].ObjectName + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].ObjectRevision + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + ConvertToStandardTime(obj[i].TxnTimestamp) + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].TxnUsername + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + ConvertToStandardTime(obj[i].CreationTimestamp) + '</td>';
                    html += '<td style="padding-bottom:10px;padding-right:10px;">' + obj[i].CreationUsername + '</td>';
                    html += '</tr>';
                }
                html += '</table>';

                
                $('#divRecordSequenceDynamic').append(html);
            }
        }
    });
}

function PopulateObjectType() {

    $.ajax({
        url: '/AdhocWIPData/GetObjecTypes',
        method: 'GET'
    }).success(function (obj) {
        if (obj != null) {
            if (obj.length > 0) {
                for (var x = 0; x < obj.length; x++) {
                    var type = obj[x].ObjectType
                    $('#ddObjectType').append($('<option></option>').val(type).html(type));
                }

                //var foption = $('#ddObjectType' + ' option:first');
                //var soptions = $('#ddObjectType' + ' option:not(:first)').sort(function (a, b) {
                //    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                //});
                //$('#ddObjectType').html(soptions).prepend(foption);
            }
        }
    });

}

function PopulateSetup(objectType) {

    isNew = null;
    $("#ddWIPDataSetup").find("option:not(:first)").remove();
    $('#divRecordSequenceDynamic').empty();
    $('#divDetailsDynamic').empty();

    $.ajax({
        url: '/AdhocWIPData/GetSetup',
        method: 'GET',
        data: { objectType: objectType }
    }).success(function (obj) {
        if (obj != null) {
            if (obj.length > 0) {
                for (var x = 0; x < obj.length; x++) {
                    var type = obj[x].Setup
                    $('#ddWIPDataSetup').append($('<option></option>').val(type).html(type));
                }

                //var foption = $('#ddWIPDataSetup' + ' option:first');
                //var soptions = $('#ddWIPDataSetup' + ' option:not(:first)').sort(function (a, b) {
                //    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                //});
                //$('#ddWIPDataSetup').html(soptions).prepend(foption);

                $("#ddWIPDataSetup").prop('selectedIndex', 0);
            }
        }
    });

}

function appendGroupEquipment() {

    $.ajax({
        url: '/AdhocWIPData/GetGroupIDConnection',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json'
    }).success(function (result) {
        if (result != null) {
            if (result.length > 0) {
                for (var x = 0; x < result.length; x++) {
                    var ID = result[x].split(':')[0];
                    var EquipID = result[x].split(':')[1];
                    $('#ddEquipment').append($('<option></option>').val(ID).html(EquipID));
                }
            }

            var foption = $('#ddEquipment' + ' option:first');
            var soptions = $('#ddEquipment' + ' option:not(:first)').sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
            });
            $('#ddEquipment').html(soptions).prepend(foption);
        }
    });
}