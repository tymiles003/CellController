var identifier = 1;
var stack = [];
var equipmentQueryString = "";
var lotQueryString = "";
var userQueryString = "";
var processQueryString = "";
var mode = "";
var arrRejectQuantity = [];
var arrRejectCode = [];
var global_obj = null;
var global_obj2 = null;
var inspected_old = "";
var inspected_new = "";
var confirm_lossreason = 0;
var step = "";


$(document).ready(function (e) {
    
    equipmentQueryString = getParameterByName("Equipment");
    lotQueryString = getParameterByName("Lot");
    userQueryString = getParameterByName("UserID");
    processQueryString = getParameterByName("Process");

    appendGroupEquipment();

    var EmployeeNumber = getCookie("EmployeeNumber");

    if (EmployeeNumber.length > 4) {
        EmployeeNumber = EmployeeNumber.slice(-4);
        $("#txtOperator").attr("disabled", "disabled");
        $("#btnFocusOperatorID").hide();
        $("#divOper").removeClass('input-group');
    }

    var uname = getCookie("Username");
    if (uname != null && uname != "") {
        //$("#txtOperator").attr("disabled", "disabled");
    }

    if (userQueryString != null && userQueryString != "")
    {
        $("#txtOperator").val(userQueryString);
    }
    else
    {
        $("#txtOperator").val(EmployeeNumber);
        //$("#txtOperator").val(uname);
    }

    $('#btnCheckLot').click(function (event) {
        getLotInfo();
    });

    $('#txtUnitInspected').focus(function () {
        inspected_old = $('#txtUnitInspected').val();
    });

    //blur handler to unit inspected quantity textbox
    $('#txtUnitInspected').blur(function () {
        inspected_new = $('#txtUnitInspected').val();

        if (inspected_old != inspected_new) {
            //stack = [];
            //$("#divList").hide();
            //$("#divStack").empty();
            //$('#txtUnitRejected').val("0");

            if (stack.length != 0) {
                notification_modal_confirm_clear(inspected_old, inspected_new);
            }
        }
    });

    $('#btnBack').click(function () {

        var from = getParameterByName("from");

        if(from == "Home")
        {
            document.location.href = '/' + from;
        }
        else
        {
            if (processQueryString != null && processQueryString != "") {
                document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString + "&UserID=" + userQueryString + "&Process=" + "fromInbox";
            }
            else {
                if (userQueryString != null && userQueryString != "") {
                    document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString + "&UserID=" + userQueryString;
                }
                else {
                    document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString;
                }
            }
        }
        
    });
    
    $("#txtUnitRejected").val("0");

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
                    getLotInfo();
                }
            });
        }
    });

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {

            $("#txtLotNumber").val(code);
            getLotInfo();
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

    $("#divList").hide();

    //blur handler for unit rejected textbox
    $('#txtUnitRejected').blur(function () {
        if ($('#txtUnitRejected').val() == "")
        {
            $('#txtUnitRejected').val("0");
        }
    });

    //onchange handler for dropdown mode
    $('#ddMode').change(function () {
        mode = $("#ddMode option:selected").text();
        
        if (mode == "Attribute Monitoring")
        {
            stack = [];
            $("#divStack").empty();
            $("#divList").hide();
            $('#divInspectionResult').hide();
            $('#divFailedMonitoring').show();
        }
        else if (mode == "Inspection Result")
        {
            stack = [];
            $("#divStack").empty();
            $("#divList").hide();
            $('#divInspectionResult').show();
            $('#divFailedMonitoring').hide();
            $("#ddRequalPass").prop('selectedIndex', 0);
            $("#ddContainment").prop('selectedIndex', 0);
            $("#txtUnitRejected").val("0");
            $('#txtUnitInspected').val("");
        }
    });

    //restrict textbox to numeric inputs only
    $('#txtUnitInspected' + ',' + '#txtUnitRejected').keydown(function (e) {

        // Allow: backspace, delete, tab, escape, enter and .
        //if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||

        // Allow: backspace, delete, tab, escape, and enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    //click handler for submit eprocedure button
    $('#btnSubmit').click(function () {
        EProcedure();
    });

    var ddCount = $('#ddEquipment > option').length;

    //if (equipmentQueryString != null && equipmentQueryString != "") {
    //    $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
    //    $("#ddEquipment").trigger("change");
    //    $("#ddEquipment").attr("disabled", "disabled");
    //}
    //else {
    //    if (ddCount > 1) {
    //        $("#ddEquipment").prop('selectedIndex', 1);
    //        $("#ddEquipment").trigger("change");
    //    }
    //}
    //appendGroupEquipment();

    if (lotQueryString != null && lotQueryString != "")
    {
        $('#btnBack').show();
        $('#txtLotNumber').val(lotQueryString);
        $("#btnFocusLotNumber").attr("disabled", "disabled");
        $("#btnCheckLot").attr("disabled", "disabled");
        $("#txtLotNumber").attr("disabled", "disabled");
        getLotInfo();
    }

    HideLoading();

});

function appendGroupEquipment() {

    $.ajax({
        url: '/EProcedure/GetGroupIDConnection',
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

            //if (equipmentQueryString == null || equipmentQueryString == "") {
            //    $("#ddEquipment option").each(function () {
            //        if ($(this).index() != 0) {
            //            lstEquipmentVal.push($(this).val());
            //            lstEquipmentText.push($(this).text());

            //            $(this).remove();
            //        }
            //    });
            //}

            //if the url has query string select the equipment from dropdown
            if (equipmentQueryString != null && equipmentQueryString != "") {
                $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
                $("#ddEquipment").trigger("change");
                $("#ddEquipment").attr("disabled", "disabled");
            }
            else {
                //if (ddCount > 1) {
                //    //$("#ddEquipment").prop('selectedIndex', 1);
                //    //$("#ddEquipment").trigger("change");
                //}
            }
        }
    });
}

//notification modal to confirm going to quantity
function notification_modal_confirm_clear(oldVal, newVal) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "You are about to change the Units Inspected, this will reset all rejects. Do you want to continue?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="setQuantity(' + "'" + newVal + "'" + ',' + "'" + 'true' + "'" + ');" data-dismiss="modal"">OK</button>';
    modal += '<button type="button" class="btn btn-default" onclick="setQuantity(' + "'" + oldVal + "'" + ',' + "'" + 'false' + "'" + ');" data-dismiss="modal">Cancel</button>';

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

function setQuantity(val, isShown) {

    $('#txtUnitInspected').val(val);

    if (isShown.toUpperCase() == "TRUE") {
        stack = [];
        $("#divList").hide();
        $("#divStack").empty();
        $('#txtUnitRejected').val("0");
    }
}

//function for validating inputs before submitting 
function EProcedure()
{
    if ($('#txtLotNumber').val().trim() == "") {
        notification_modal_dynamic("Notification", "Please enter Lot Number", 'danger', identifier);
        identifier++;
        return;
    }

    if ($('#txtOperator').val().trim() == "") {
        notification_modal_dynamic("Notification", "Please enter Operator ID", 'danger', identifier);
        identifier++;
        return;
    }

    var index = $("#ddEquipment option:selected").index();

    if (index == 0) {
        notification_modal_dynamic("Notification", "Please select Machine", 'danger', identifier);
        identifier++;
        return;
    }

    var index2 = $("#ddMode option:selected").index();

    if (index2 == 0) {
        notification_modal_dynamic("Notification", "Please select Mode", 'danger', identifier);
        identifier++;
        return;
    }

    var temp_mode = '';

    if (mode == "Inspection Result")
    {
        var tempCount = 0;

        for (i = 0; i < stack.length; i++) {
            tempCount += parseInt(stack[i].RejectQuantity);
        }

        if (tempCount > parseInt($('#txtUnitRejected').val())) {
            notification_modal_dynamic("Notification", "Total Loss Reason Quantity is greater than the Unit Rejected", 'danger', identifier);
            identifier++;
            return;
        }
        else if (tempCount < parseInt($('#txtUnitRejected').val())) {
            notification_modal_dynamic("Notification", "Total Loss Reason Quantity is less than the Unit Rejected", 'danger', identifier);
            identifier++;
            return;
        }

        if ($('#txtUnitRejected').val().trim() == "") {
            notification_modal_dynamic("Notification", "Please enter Unit Rejected", 'danger', identifier);
            identifier++;
            return;
        }

        if ($('#txtUnitInspected').val().trim() == "") {
            notification_modal_dynamic("Notification", "Please enter Unit Inspected", 'danger', identifier);
            identifier++;
            return;
        }

        temp_mode = 'Inspection Data';
    }
    else if (mode == "Attribute Monitoring")
    {
        temp_mode = 'Attribute Monitoring';

        //if (stack.length == 0)
        //{
        //    notification_modal_dynamic("Notification", "Please enter Loss Reason", 'danger', identifier);
        //    identifier++;
        //    return;
        //}
    }


    var equipment = $("#ddEquipment option:selected").text();
    var lotno = $('#txtLotNumber').val().trim().toUpperCase();

    var unitInspected = $('#txtUnitInspected').val();
    var unitRejected = $('#txtUnitRejected').val();
    var containmentDone = $("#ddContainment option:selected").val();
    var requalPass = $("#ddRequalPass option:selected").val();
    var userID = $('#txtOperator').val();
    var attrMon = $("#ddAttrMon option:selected").val();

    arrRejectQuantity = [];
    arrRejectCode = [];
    
    for (i = 0; i < stack.length; i++)
    {
        arrRejectQuantity.push(parseInt(stack[i].RejectQuantity));
        arrRejectCode.push(stack[i].LossReason);
    }

    if (mode == "Attribute Monitoring")
    {
        unitInspected = "0";
    }

    notification_modal_confirm_eproc(lotno, equipment, temp_mode, unitInspected, unitRejected, containmentDone, requalPass, attrMon, userID);
}

//function for validating first the lot before executing eprocedure
function validateFirst(lotno, equipment, temp_mode, unitInspected, unitRejected, containmentDone, requalPass, attrMon, userID)
{
    $("#modal_div").modal("hide");

    var temp_identifier = 0;

    $.ajax({
        url: '/EProcedure/GetLotInfo',
        data: { LotNo: lotno },
        contentType: 'application/json',
        dataType: 'json',
        method: 'get',
        beforeSend: function ()
        {
            notification_modal_dynamic_loading("Notification", 'Submitting EProcedure... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";

            var qty = result.Qty;
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/EProcedure/FirstInsert',
                data: { userID: userID, lotNo: lotno, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, 'danger', identifier);
                    identifier++;
                }
                else
                {
                    SubmitEProcedure(lotno, equipment, temp_mode, unitInspected, unitRejected, containmentDone, requalPass, attrMon, userID, temp_identifier)
                }

            }).error(function (e) {

                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });
        }
        else {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Invalid Lot Number", 'danger', identifier);
            identifier++;
        }

    }).error(function (e) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

//build confirmation modal for eprocedure
function notification_modal_confirm_eproc(lotno, equipment, mode, unitInspected, unitRejected, containmentDone, requalPass, attrMon, userID) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to proceed with the EProcedure?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="validateFirst(' + "'" + lotno + "'" + ',' + "'" + equipment + "'" + ',' + "'" + mode + "'" + ',' + "'" + unitInspected
        + "'" + ',' + "'" + unitRejected + "'" + ',' + "'" + containmentDone + "'" + ',' + "'" + requalPass + "'" + ',' + "'" + attrMon + "'" + ',' + "'" + userID + "'" + ');">OK</button>';
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

//execute eprocedure to camstar
function SubmitEProcedure(lotno, equipment, mode, unitInspected, unitRejected, containmentDone, requalPass, attrMon, userID, ident)
{

    $.ajax({
        url: '/EProcedure/EProcedure',
        data: { LotNo: lotno, Equipment: equipment, Mode: mode, UnitInspected: unitInspected, UnitRejected: unitRejected, ContainmentDone: containmentDone, arrRejectQuantity: arrRejectQuantity, arrRejectCode: arrRejectCode, RequalPass: requalPass, attrMon: attrMon, UserID: userID },
        method: 'post',
        beforeSend: function () {
            $("#btnSubmit").attr("disabled", "disabled");
        }
    }).success(function (result)
    {
        //for forcing success (testing)
        //result = "EProcedure Successful";

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        $("#btnSubmit").removeAttr("disabled");

        if (result.toUpperCase().includes("ERROR:")) {
            result = result.replace("ERROR:", "").replace("Error:", "");
            notification_modal_dynamic("Notification", result, 'danger', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic_redirect("Notification", result, 'success', identifier);
            identifier++;
        }

    }).error(function (e) {

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        $("#btnSubmit").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}

function notification_modal_dynamic_redirect(title, message, type, ident) {

    create_modal_div("notification_modal_dynamic" + ident);

    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div' + ident + '"' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel' + ident + '" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel' + ident + '">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += message;
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    //modal += '<button type="button" class="btn btn-success">Save changes</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#notification_modal_dynamic" + ident).html(modal);
    $("#modal_div" + ident).modal("show");
    $("#modal_div" + ident).css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    var from = getParameterByName("from");

    if (from != "" && from != null) {
        $("#modal_div" + ident).on("hidden.bs.modal", function () {

            if (processQueryString != null && processQueryString != "") {
                document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString + "&UserID=" + userQueryString + "&Process=" + "fromInbox";
            }
            else {
                if (userQueryString != null && userQueryString != "") {
                    document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString + "&UserID=" + userQueryString;
                }
                else {
                    document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString;
                }
            }


        });
    }

}

//function for adding loss reason to list
function AddLossReason() {
    
    var quantity = $('#txtLossReasonQuantity').val();

    var index = $("#ddLossReason option:selected").index();

    var lossReason = $("#ddLossReason option:selected").text();
    var lossReasonID = $("#ddLossReason option:selected").val();

    var inspected = $('#txtUnitInspected').val();
    
    if (quantity == "" || index == 0) {

        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (index == 0) {
            msg += "Loss Reason<br/>";
        }
        if (quantity == "") {
            msg += "Quantity<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)", "");

        notification_modal_dynamic_super("Notification", msg, "danger", 'modal_div', identifier);
        identifier++;
    }
    else if (quantity == "0" || quantity == 0) {
        notification_modal_dynamic_super("Notification", "Cannot add 0 as Reject Quantity", "danger", 'modal_div', identifier);
        identifier++;
    }
    else {

        if (mode == "Inspection Result")
        {
            var total = 0;

            for (i = 0; i < stack.length; i++) {
                total += parseInt(stack[i].RejectQuantity);
            }

            total += parseInt(quantity);

            if (parseInt(total) > parseInt(inspected))
            {
                notification_modal_dynamic_super("Notification", "Cannot add more than the Units Inspected", "danger", 'modal_div', identifier);
                identifier++;
                return;
            }
        }

        if (mode == "Attribute Monitoring") {

            var total = 0;

            for (i = 0; i < stack.length; i++) {
                total += parseInt(stack[i].RejectQuantity);
            }

            total += parseInt(quantity);
            var trackInQuantity = $('#txtMaxInProcessQuantity').val();

            if (parseInt(total) > parseInt(trackInQuantity)) {
                notification_modal_dynamic_super("Notification", "Cannot add more than the Track In Quantity", "danger", 'modal_div', identifier);
                identifier++;
                return;
            }
        }
        
        var obj = {
            ID: lossReasonID,
            LossReason: lossReason,
            RejectQuantity: quantity
        };

        var result = $.grep(stack, function (e) { return e.ID == lossReasonID; });

        if (result == "" || result == null) {

            global_obj2 = null;
            global_obj2 = obj;

            $("#modal_div").modal("hide");
            notification_modal_confirm_lossreason(quantity);
        }
        else {
            notification_modal_dynamic_super("Notification", "Cannot add duplicate reason", "danger", 'modal_div', identifier);
            identifier++;
        }
        
    }
}

//notification modal to confirm adding loss reason
function notification_modal_confirm_lossreason(quantity) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div_lossreason" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to add this Loss Reason?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="goLossReason(' + "'" + quantity + "'" + ');">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#modal_div").modal("hide");
    $("#notification_modal2").html(modal);
    $("#modal_div_lossreason").modal("show");
    $("#modal_div_lossreason").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div_lossreason").on("hidden.bs.modal", function () {

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        if (confirm_lossreason == 0) {
            
            $("#modal_div").modal("show");
        }
        else {
            $("#modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        confirm_lossreason = 0;

    });

}

//function for adding lossreason to list
function goLossReason(quantity) {

    confirm_lossreason = 1;

    stack.push(global_obj2);

    var div = $("#divStack");

    div.append('<div id="divBase_' + global_obj2.ID + '" style="text-align:right;"><button id="btnRemoveLossReason_' + global_obj2.ID + '" onclick="notification_modal_confirm(' + global_obj2.ID + ');" class="btn btn-danger" style="text-align:center;"><span class="glyphicon glyphicon-remove"></span></button></div>');

    div.append('<div id="divLossReason_' + global_obj2.ID + '" class="style-1 scrollbar">'
        + '<br/>&nbsp;<b>Loss Reason:</b> ' + global_obj2.LossReason + '<br/>'
        + '&nbsp;<b>Reject Quantity:</b> ' + global_obj2.RejectQuantity + '<br/><br/>'
        + '</div><br id="brFiller_' + global_obj2.ID + '" />');

    if (mode == "Inspection Result") {

        var tempCount = 0;

        for (i = 0; i < stack.length; i++) {
            tempCount += parseInt(stack[i].RejectQuantity);
        }

        $('#txtUnitRejected').val(tempCount);
    }

    $("#divList").show();
    $("#modal_div_lossreason").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

}

//modal for loss reason
function ShowScrap() {

    var inspected = $('#txtUnitInspected').val();
    var trackInQuantity = $('#txtMaxInProcessQuantity').val();

    if (mode == "Inspection Result") {

        if (inspected == "")
        {
            notification_modal_dynamic("Notification", "Please specify Units Inspected first", 'danger', identifier);
            identifier++;
            return;
        }
        
        if (parseInt(inspected) == 0)
        {
            notification_modal_dynamic("Notification", "Cannot Add Loss Reason when Units Inspected is equal to 0", 'danger', identifier);
            identifier++;
            return;
        }

        if (parseInt(inspected) > parseInt(trackInQuantity)) {
            notification_modal_dynamic("Notification", "Units Inspected is greater than Track In Quantity", "danger", identifier);
            identifier++;
            return;
        }

    }

    populateLossReason(function (output) {

        if (output == false) {
            notification_modal_dynamic("Notification", "Cannot retrieve Loss Reason", "danger", identifier);
            identifier++;
            return;
        }
        else {
            header_style = 'style="background-color: #1DB198; color: #ffffff;"';

            var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
            modal += '<div class="modal-dialog">';
            modal += '<div class="modal-content">';

            modal += '<div class="modal-header" ' + header_style + '>';
            modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            modal += '<h4 class="modal-title" id="myModalLabel">' + "Add Loss Reason" + '</h4>';
            modal += '</div>';

            modal += '<div class="modal-body"><br />';
            modal += '<div><label for="ddLossReason">Loss Reason:</label><select id="ddLossReason" class="form-control"><option selected disabled>Select Loss Reason</option></select></div><br/>';
            modal += '<div><label for="txtLossReasonQuantity">Reject Quantity:</label><input type="text" class="form-control" id="txtLossReasonQuantity" placeholder="Reject Quantity"></div><br/>';
            modal += '</div>';

            modal += '<div class="modal-footer" style="text-align:center;">';
            modal += '<button type="button" id="btnAddLossReason" class="btn btn-success">Add</button>';
            modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

            modal += '</div>';

            modal += '</div>';
            modal += '</div>';
            modal += '</div>';

            modal += '<script>';
            var js = "setup_lossreason();";
            modal += '$(document).ready(function (e){ ' + js + '});';
            modal += '</script>';

            $("#notification_modal").html(modal);
            $("#modal_div").modal("show");
            $("#modal_div").css('z-index', '1000001');

            $("body").css("margin", "0px");
            $("body").css("padding", "0px");
        }

    });
}

//function for setting up loss reason
function setup_lossreason() {

    $('#txtLossReasonQuantity').keydown(function (e) {

        // Allow: backspace, delete, tab, escape, enter and .
        //if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||

        // Allow: backspace, delete, tab, escape, and enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    
    try
    {
        var len = global_obj.length;

        if (len > 0) {
            for (var i = 0; i < len; i++) {

                var lossreason = global_obj[i].LossReason;
                var id = global_obj[i].ID;
                var defaultSelected = false;
                var nowSelected = false;
                $('#ddLossReason').append(new Option(lossreason, id, defaultSelected, nowSelected));
            }
        }
    }
    catch (e) {
        
    }

    

    //click handler for add loss reason
    $('#btnAddLossReason').click(function () {
        AddLossReason();
    });

}

//function for populating loss reason dropdown
function populateLossReason(callback)
{
    var isLossReason = false;

    var processType = 'NORMAL'

    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (user == "" || lot == "" || index == 0) {
        var msgHead = "Please provide details for the following field(s):<br/><br/>";
        var msg = "";

        if (user == "") {
            msg += "Operator<br/>";
        }

        var from = getParameterByName("from");
        var isEquip = true;

        if (from == null || from == "")
        {
            isEquip = true
        }
        else if (from == "TrackIn") {
            isEquip = true
        }
        else if (from == "TrackOut") {
            isEquip = true
        }
        else if (from == "MoveOut") {
            isEquip = false
        }


        if (index == 0 && isEquip == true) {
            msg += "Machine<br/>";
        }


        if (lot == "") {
            msg += "Lot Number<br/>";
        }

        if (msg != "")
        {
            msg = msgHead + msg;
            msg += ")";
            msg = msg.replace("<br/>)", "");

            notification_modal_dynamic("Notification", msg, "danger", identifier);
            identifier++;
            return;
        }
    }

    $.ajax({
        url: '/EProcedure/GetAllLossReason',
        contentType: 'application/json',
        data: { lotNo: lot, equipment: equipment, processType: processType.toUpperCase(), UserID: user },
        dataType: 'json',
        method: 'GET',
        beforeSend: function()
        {
            $('#btnAddScrapMonitoring').attr('disabled' , 'disabled');
            $('#btnClearScrapMonitoring').attr('disabled', 'disabled');
            $('#btnAddScrap').attr('disabled', 'disabled');
            $('#btnClearScrap').attr('disabled', 'disabled');
        }
    }).success(function (returnval) {

        var obj = $.parseJSON(returnval);
        var defaultSelected = false;
        var nowSelected = false;
        var len = 0;
        try {
            len = obj.length;
        }
        catch (e) {
            len = 0;
        }

        global_obj = null;
        $('#ddLossReason').empty();
        $('#ddLossReason').append(new Option('Select Loss Reason', 'Select Loss Reason', true, true));
        $("#ddLossReason option:first").attr('disabled', 'disabled');

        if (len > 0) {

            global_obj = obj;

            $('#btnAddScrapMonitoring').removeAttr('disabled');
            $('#btnClearScrapMonitoring').removeAttr('disabled');
            $('#btnAddScrap').removeAttr('disabled');
            $('#btnClearScrap').removeAttr('disabled');

            isLossReason = true;
            try {
                callback(isLossReason);
            }
            catch (e) { }
        }
        else {
            $('#btnAddScrapMonitoring').removeAttr('disabled');
            $('#btnClearScrapMonitoring').removeAttr('disabled');
            $('#btnAddScrap').removeAttr('disabled');
            $('#btnClearScrap').removeAttr('disabled');
            
            isLossReason = false;
            try {
                callback(isLossReason);
            }
            catch (e) { }
        }

    }).error(function (e) {
        global_obj = null;
        $('#ddLossReason').empty();
        $('#ddLossReason').append(new Option('Select Loss Reason', 'Select Loss Reason', true, true));
        $("#ddLossReason option:first").attr('disabled', 'disabled');
        $('#btnAddScrapMonitoring').removeAttr('disabled');
        $('#btnClearScrapMonitoring').removeAttr('disabled');
        $('#btnAddScrap').removeAttr('disabled');
        $('#btnClearScrap').removeAttr('disabled');
        
        isLossReason = false;
        try {
            callback(isLossReason);
        }
        catch (e) { }
    });
}

//function for clearing scrap
function ClearScrap() {

    stack = [];
    $("#divStack").empty();
    $("#divList").hide();

    $('#txtUnitRejected').val("0");

    $("#modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//function for getting lot info
function getLotInfo() {

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (user == "" || lot == "") {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (user == "") {
            msg += "Operator<br/>";
        }
        if (lot == "") {
            msg += "Lot Number<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)", "");

        notification_modal_dynamic("Notification", msg, "danger", identifier);
        identifier++;
        return;
    }

    $("#btnAddScrap").attr("disabled", "disabled");
    $("#btnClearScrap").attr("disabled", "disabled");
    $("#btnAddScrapMonitoring").attr("disabled", "disabled");
    $("#btnClearScrapMonitoring").attr("disabled", "disabled");

    $("#divList").hide();
    $('#txtUnitRejected').val("0");
    $('#txtUnitInspected').val("");
    $("#divStack").empty();
    stack = [];

    $.ajax({
        url: '/EProcedure/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";

            var qty = result.MaxInProcessQty;
            location = result.ProcessSpecObjectCategory;
            //$('#txtMaxInProcessQuantity').val(qty);
            //$('#txtUnitInspected').val(qty);
            $('#txtMaxInProcessQuantity').val(qty);
            $('#txtUnitInspected').val(qty);

            step = result.Step.substring(0, 4);

            if (parseInt(step) == 2700 || parseInt(step) == 2040)
            {
                $('#divAttrMon').show();
            }
            else if (parseInt(step) == 2850 || parseInt(step) == 2200) {
                $('#divAttrMon').hide();
            }
            else {
                $('#divAttrMon').hide();
            }

            $.ajax({
                url: '/EProcedure/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {
                    populateLossReason();
                }

            }).error(function (e) {
                notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
                identifier++;
            });
        }
        else {
            notification_modal_dynamic("Notification", "Invalid Lot Number", "danger", identifier);
            identifier++;
        }

    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
        identifier++;
    });

}

//build notification modal for removing loss reason
function notification_modal_confirm(id) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to remove this Loss Reason?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="removeLossReason(' + id + ');">OK</button>';
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

//function for removing loss reason from list
function removeLossReason(id) {

    var index = stack.findIndex(x => x.ID == id);
    var quantity = parseInt(stack[index].RejectQuantity);

    stack.splice(index, 1);

    $("#divBase_" + id).remove();
    $("#divLossReason_" + id).remove();
    $("#brFiller_" + id).remove();

    if (mode == "Inspection Result")
    {
        var count = parseInt($('#txtUnitRejected').val());
        var total = count - quantity;

        $('#txtUnitRejected').val(total);
    }

    if (stack.length > 0) {
        $("#divList").show();
    }
    else {
        $("#divList").hide();
    }

    $("#modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//confirmation modal for clearing scrap
function notification_modal_clear_scrap() {

    if (stack.length == 0) {
        notification_modal_dynamic("Notification", "No Loss Reason Added", 'danger', identifier);
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
    modal += "Are you sure you want to clear all Loss Reason?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="ClearScrap();">OK</button>';
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


