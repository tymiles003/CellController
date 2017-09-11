identifier = 1;
var material = [];
var utc = "";

$(document).ready(function (e) {
    
    getUTC();

    appendGroupEquipment();

    var EmployeeNumber = getCookie("EmployeeNumber");

    if (EmployeeNumber.length > 4) {
        EmployeeNumber = EmployeeNumber.slice(-4);
        $("#txtOperator").val(EmployeeNumber);
        $("#txtOperator").attr("disabled", "disabled");
        $("#btnFocusOperatorID").hide();
        $("#divOper").removeClass('input-group');
    }

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
                    getMaterialLotInfo();
                }
            });
        }
    });

    //button click handler
    $('#btnCheckLot').click(function () {
        getMaterialLotInfo();
    });

    $('#btnSubmit').click(function ()
    {
        notification_modal_confirm_submit();
    });

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {

            $("#txtLotNumber").val(code);
            getMaterialLotInfo();
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
    //end of barcode

    //dropdown onchange handler
    $('#ddEquipment').change(function () {

        var equipment = $("#ddEquipment option:selected").text()
        populateMaterial(equipment);
    });

    HideLoading();

});

function appendGroupEquipment() {

    $.ajax({
        url: '/MaterialSetup/GetGroupIDConnection',
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

function populateMaterial(equipment)
{
    material = [];
    $('#divMaterialContent').empty();
    $('#divMaterialInfo').hide();

    var user = $('#txtOperator').val();

    if (user == "")
    {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/MaterialSetup/GetMaterial',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: { Equipment: equipment, UserID: user }
    }).success(function (result) {

        if (result != null)
        {
            if (result.length > 0)
            {

                var html = '<table class="col-md-8" id="tblMaterial" align="left">';
                html += '<tr>';
                html += '<td style="font-weight:bold;padding:10px;">Action</td>';
                html += '<td style="font-weight:bold;padding:10px;">Material Lot</td>';
                html += '<td style="font-weight:bold;padding:10px;">Material Part</td>';
                //html += '<td style="font-weight:bold;padding:10px;">Description</td>';
                //html += '<td style="font-weight:bold;padding:10px;">Revision</td>';
                //html += '<td style="font-weight:bold;padding:10px;">Qty</td>';
                //html += '<td style="font-weight:bold;padding:10px;">Qty 2</td>';
                html += '<td style="font-weight:bold;padding:10px;">Thawing Timestamp</td>';
                html += '<td style="font-weight:bold;padding:10px;">Withdrawal Timestamp</td>';
                html += '<td style="font-weight:bold;padding:10px;">Expiry Timestamp</td>';
                html += '</tr>';

                material = result;

                for (var x = 0; x < result.length; x++) {

                    html += '<tr id="trMaterial_' + result[x].ID + '">';

                    html += '<td style="padding:10px;">';
                    html += '<button title="Remove" data-toggle="tooltip" onclick="removeMaterialLot(' + "'" + result[x].ID + "'" + ');" class="btn btn-danger" style="text-align:center;"><span class="glyphicon glyphicon-remove"></span></button>';
                    html += '</td>';

                    html += '<td style="padding:10px;">';
                    if (result[x].MaterialLotName.toUpperCase() == "NONE")
                    {
                        result[x].MaterialLotName = "";
                    }
                    html += result[x].MaterialLotName;
                    html += '</td>';

                    html += '<td style="padding:10px;">';
                    if (result[x].Name.toUpperCase() == "NONE") {
                        result[x].Name = "";
                    }
                    html += result[x].Name;
                    html += '</td>';

                    //html += '<td style="padding:10px;">';
                    //if (result[x].algMaterialDescription.toUpperCase() == "NONE") {
                    //    result[x].algMaterialDescription = "";
                    //}
                    //html += result[x].algMaterialDescription;
                    //html += '</td>';

                    //html += '<td style="padding:10px;">';
                    //if (result[x].Rev.toUpperCase() == "NONE") {
                    //    result[x].Rev = "";
                    //}
                    //html += result[x].Rev;
                    //html += '</td>';

                    //html += '<td style="padding:10px;">';
                    //if (result[x].Qty.toUpperCase() == "NONE") {
                    //    result[x].Qty = "";
                    //}
                    //html += result[x].Qty;
                    //html += '</td>';

                    //html += '<td style="padding:10px;">';
                    //if (result[x].Qty2.toUpperCase() == "NONE") {
                    //    result[x].Qty2 = "";
                    //}
                    //html += result[x].Qty2;
                    //html += '</td>';

                    html += '<td style="padding:10px;">';
                    if (result[x].ThawingTimestamp.toUpperCase() == "NONE") {
                        result[x].ThawingTimestamp = "";
                    }
                    html += ConvertToStandardTime(result[x].ThawingTimestamp);
                    html += '</td>';

                    html += '<td style="padding:10px;">';
                    if (result[x].WithdrawalTimestamp.toUpperCase() == "NONE") {
                        result[x].WithdrawalTimestamp = "";
                    }
                    html += ConvertToStandardTime(result[x].WithdrawalTimestamp);
                    html += '</td>';

                    html += '<td style="padding:10px;">';
                    if (result[x].ExpiryTimestamp.toUpperCase() == "NONE") {
                        result[x].ExpiryTimestamp = "";
                    }
                    html += ConvertToStandardTime(result[x].ExpiryTimestamp);
                    html += '</td>';

                    html += '</tr>';
                }
                html += '</table>';
                $('#divMaterialContent').append(html);

                $('[data-toggle="tooltip"]').tooltip();

                $('#divNoMaterial').hide();
                $('#divMaterialInfo').show();
            }
            else
            {
                $('#divNoMaterial').show();
                $('#divMaterialInfo').show();
            }
        }
        else
        {
            $('#divNoMaterial').show();
            $('#divMaterialInfo').show();
        }

    }).error(function () {
        $('#divNoMaterial').show();
        $('#divMaterialInfo').show();
    });
    
}

function getMaterialLotInfo()
{
    var MaterialLot = $('#txtLotNumber').val().trim();
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var user = $('#txtOperator').val();
    
    if (index == 0)
    {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    if (MaterialLot == "")
    {
        notification_modal_dynamic("Notification", "Please enter Material Lot", "danger", identifier);
        identifier++;
        return;
    }

    if (user == "") {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/MaterialSetup/GetMaterialInfo',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: { MaterialLot: MaterialLot, UserID: user }
    }).success(function (result) {

        if (result != null)
        {
            if (result.ERROR == null)
            {
                var html = "";

                var isInit = false;

                if(material.length == 0)
                {
                    html = '<table class="col-md-8" id="tblMaterial" align="left">';
                    html += '<tr>';
                    html += '<td style="font-weight:bold;padding:10px;">Action</td>';
                    html += '<td style="font-weight:bold;padding:10px;">Material Lot</td>';
                    html += '<td style="font-weight:bold;padding:10px;">Material Part</td>';
                    //html += '<td style="font-weight:bold;padding:10px;">Description</td>';
                    //html += '<td style="font-weight:bold;padding:10px;">Revision</td>';
                    //html += '<td style="font-weight:bold;padding:10px;">Qty</td>';
                    //html += '<td style="font-weight:bold;padding:10px;">Qty 2</td>';
                    html += '<td style="font-weight:bold;padding:10px;">Thawing Timestamp</td>';
                    html += '<td style="font-weight:bold;padding:10px;">Withdrawal Timestamp</td>';
                    html += '<td style="font-weight:bold;padding:10px;">Expiry Timestamp</td>';
                    html += '</tr>';

                    isInit = true;
                }
                else
                {
                    isInit = false;
                }

                if (material.length > 0)
                {
                    var contains = false;
                    for (var i = 0; i<material.length; i++)
                    {
                        if(material[i].MaterialLotName.toUpperCase() == MaterialLot.toUpperCase())
                        {
                            contains = true;
                        }
                    }

                    if (contains == true)
                    {
                        notification_modal_dynamic("Notification", "Material already in the list", "danger", identifier);
                        identifier++;
                        return;
                    }
                }

                material.push(result);

                html += '<tr id="trMaterial_' + result.ID + '">';

                html += '<td style="padding:10px;">';
                html += '<button title="Remove" data-toggle="tooltip" onclick="removeMaterialLot(' + "'" + result.ID + "'" + ');" class="btn btn-danger" style="text-align:center;"><span class="glyphicon glyphicon-remove"></span></button>';
                html += '</td>';

                html += '<td style="padding:10px;">';
                if (result.MaterialLotName.toUpperCase() == "NONE") {
                    result.MaterialLotName = "";
                }
                html += result.MaterialLotName;
                html += '</td>';

                html += '<td style="padding:10px;">';
                if (result.Name.toUpperCase() == "NONE") {
                    result.Name = "";
                }
                html += result.Name;
                html += '</td>';

                //html += '<td style="padding:10px;">';
                //if (result.algMaterialDescription.toUpperCase() == "NONE") {
                //    result.algMaterialDescription = "";
                //}
                //html += result.algMaterialDescription;
                //html += '</td>';

                //html += '<td style="padding:10px;">';
                //if (result.Rev.toUpperCase() == "NONE") {
                //    result.Rev = "";
                //}
                //html += result.Rev;
                //html += '</td>';

                //html += '<td style="padding:10px;">';
                //if (result.Qty.toUpperCase() == "NONE") {
                //    result.Qty = "";
                //}
                //html += result.Qty;
                //html += '</td>';

                //html += '<td style="padding:10px;">';
                //if (result.Qty2.toUpperCase() == "NONE") {
                //    result.Qty2 = "";
                //}
                //html += result.Qty2;
                //html += '</td>';

                html += '<td style="padding:10px;">';
                if (result.ThawingTimestamp.toUpperCase() == "NONE") {
                    result.ThawingTimestamp = "";
                }
                html += ConvertToStandardTime(result.ThawingTimestamp);
                html += '</td>';

                html += '<td style="padding:10px;">';
                if (result.WithdrawalTimestamp.toUpperCase() == "NONE") {
                    result.WithdrawalTimestamp = "";
                }
                html += ConvertToStandardTime(result.WithdrawalTimestamp);
                html += '</td>';

                html += '<td style="padding:10px;">';
                if (result.ExpiryTimestamp.toUpperCase() == "NONE") {
                    result.ExpiryTimestamp = "";
                }
                html += ConvertToStandardTime(result.ExpiryTimestamp);
                html += '</td>';

                html += '</tr>';

                if (isInit == true)
                {
                    html += '</table>';

                    $('#divMaterialContent').append(html);
                    $('#divNoMaterial').hide();
                    $('#divMaterialInfo').show();
                }
                else
                {
                    $('#tblMaterial').append(html);
                }

                $('[data-toggle="tooltip"]').tooltip();
            }
            else
            {
                notification_modal_dynamic("Notification", "Invalid Material Lot", "danger", identifier);
                identifier++;
                return;
            }
        }
        else
        {
            notification_modal_dynamic("Notification", "Invalid Material Lot", "danger", identifier);
            identifier++;
            return;
        }

    }).error(function(){
        notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
        identifier++;
        return;
    });

}

function getUTC()
{
    $.ajax({
        url: '/MaterialSetup/GetUTC',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
    }).success(function (result) {
        utc = result;
    });
}

function ConvertToUTCTime(strDate)
{
    if (strDate == null || strDate == "") {
        return "";
    }
    else
    {
        var arr = strDate.split(' ');

        var date = "";
        var time = "";
        var am_pm = "";

        for(var i =0; i<arr.length; i++)
        {
            if (i == 0)
            {
                date = arr[i];
            }

            if (i == 1)
            {
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

        for(var i = 0; i<arrDate.length; i++)
        {
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

        if (parseInt(month) < 10)
        {
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
        
        if (am_pm == "PM")
        {
            if (hour != 12)
            {
                hour = parseInt(hour) + 12;
            }
        }
        else if (am_pm == "AM")
        {
            if (parseInt(hour) == 12)
            {
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

function ConvertToStandardTime(strDate)
{
    if (strDate == null || strDate == "")
    {
        return "";
    }
    else
    {
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

            if (parseInt(hour) == 0)
            {
                hour = 12;
            }
            
        }

        if (parseInt(minute) < 10)
        {
            minute = "0" + minute.toString();
        }

        if (parseInt(second) < 10) {
            second = "0" + second.toString();
        }

        var newDate = month + "/" + day + "/" + year + " " + hour + ":" + minute + ":" + second + " " + am_pm;

        return newDate;
    }
}

function removeMaterialLot(ID) {

    var index = material.findIndex(x => x.ID == ID);
    
    material.splice(index, 1);

    var tr = '#trMaterial_' + ID;

    $(tr).remove();

    if(material.length == 0)
    {
        $("#tblMaterial").remove();
        $('#divNoMaterial').show();
    }
    else
    {
        $('#divNoMaterial').hide();
    }
}

function notification_modal_confirm_submit() {

    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var user = $('#txtOperator').val();

    if (index == 0) {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    if (user == "") {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
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
    modal += '<button type="button" class="btn btn-success" onclick="Submit();">OK</button>';
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

function Submit()
{
    var equipment = $("#ddEquipment option:selected").text();
    var user = $('#txtOperator').val();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    $("#modal_div").modal("hide");

    var lstMaterialLot = [];
    var lstDesc = [];
    var lstMaterialPart = [];
    var lstRev = [];
    var lstROR = [];
    var lstQty = [];
    var lstQty2 = [];
    var lstThawingTimestamp = [];
    var lstWithdrawalTimestamp = [];
    var lstExpiryTimestamp = [];

    for (var i =0; i<material.length; i++)
    {
        lstMaterialLot.push(material[i].MaterialLotName);
        lstDesc.push(material[i].algMaterialDescription);
        lstMaterialPart.push(material[i].Name);
        lstRev.push(material[i].Rev);
        lstROR.push(material[i].ROR);
        lstQty.push(material[i].Qty);
        lstQty2.push(material[i].Qty2);
        lstThawingTimestamp.push(material[i].ThawingTimestamp);
        lstWithdrawalTimestamp.push(material[i].WithdrawalTimestamp);
        lstExpiryTimestamp.push(material[i].ExpiryTimestamp);
    }

    var temp_identifier = 0;

    $.ajax({
        url: '/MaterialSetup/SubmitSetup',
        data: { Equipment: equipment, lstMaterialLot: lstMaterialLot, lstDesc: lstDesc, lstMaterialPart: lstMaterialPart, lstRev: lstRev, lstROR: lstROR, lstQty: lstQty, lstQty2: lstQty2, lstThawingTimestamp: lstThawingTimestamp, lstWithdrawalTimestamp: lstWithdrawalTimestamp, lstExpiryTimestamp: lstExpiryTimestamp, Comment: comment, UserID: user },
        method: 'POST',
        beforeSend: function () {
            notification_modal_dynamic_loading("Notification", 'Submitting Material Setup... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (result) {

        setTimeout(function () {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            if (result.toUpperCase().includes("ERROR")) {
                var temp = result.replace("ERROR:", "").replace("Error:", "");
                notification_modal_dynamic("Notification", temp, 'danger', identifier);
                identifier++;
            }
            else {
                var temp = result.replace("RESULT:", "").replace("Result:", "");
                notification_modal_dynamic("Notification", temp, 'success', identifier);
                identifier++;
            }

        }, 1000);

    }).error(function () {

        setTimeout(function () {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;

        }, 1000);
        
    });

}