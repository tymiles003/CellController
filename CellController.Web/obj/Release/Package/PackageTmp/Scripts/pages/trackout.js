var identifier = 1;
var stack = [];
var equipmentQueryString = "";
var lotQueryString = "";
var userQueryString = "";
var processQueryString = "";
var trackOutValue_old = "";
var trackOutValue_new = "";
var global_obj = null;
var global_obj2 = null;
var confirm_lossreason = 0;
var lstEquipmentText = [];
var lstEquipmentVal = [];

$(document).ready(function (e) {

    equipmentQueryString = getParameterByName("Equipment");
    lotQueryString = getParameterByName("Lot");
    userQueryString = getParameterByName("UserID");
    processQueryString = getParameterByName("Process");

    appendGroupEquipment();

    $('#btnCheckLot').click(function (event) {
        getLotInfo(false);
    });

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
                    getLotInfo(false);
                }
            });
        }
    });

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {

            $("#txtLotNumber").val(code);
            getLotInfo(false);
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

    //for user access to eproc
    var username = getCookie("Username");

    $('#spanEProc').hide();
    $('#spanWIPData').hide();

    $.ajax({
        url: '/TrackOut/getUserRights',
        data: { username: username },
        method: 'GET'
    }).success(function (result) {
        if (result != null) {
            for (var x = 0; x < result.length; x++) {
                if (result[x] == "EProcedure") {
                    $('#spanEProc').show();
                    
                }
                if (result[x] == "Data Collection") {
                    $('#spanWIPData').show();

                }
            }
        }
    });

    $('#btnEProcedure').click(function (event) {
        gotoEProc();
    });

    $('#btnWIPData').click(function (event) {
        gotoWIPData();
    });

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

    if (userQueryString != null && userQueryString != "") {
        $("#txtOperator").val(userQueryString);
    }
    else {
        $("#txtOperator").val(EmployeeNumber);
        //$("#txtOperator").val(uname);
    }

    $("#txtMaxInProcessQuantity").attr("disabled", "disabled");
    $("#txtScrapQuantity").val("0");
    $("#txtScrapQuantity").attr("disabled", "disabled");
    $("#divList").hide();

    $('#txtTrackOutQuantity').focus(function ()
    {
        trackOutValue_old = $('#txtTrackOutQuantity').val();
    });

    //blur handler to trackout quantity textbox
    $('#txtTrackOutQuantity').blur(function () {
        trackOutValue_new = $('#txtTrackOutQuantity').val();

        if (trackOutValue_old != trackOutValue_new)
        {
            if (stack.length != 0)
            {
                notification_modal_confirm_clear(trackOutValue_old, trackOutValue_new);
            }
        }
    });

    //restrict textbox to number only inputs
    $('#txtMaxInProcessQuantity' + ',' + '#txtTrackOutQuantity' + ',' + '#txtScrapQuantity').keydown(function (e) {

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

    //click handler for trackout
    $('#btnTrackOut').click(function () {
        TrackOut();
    });

    $('#ddEquipment').change(function () {
        // no method here
    });

    var ddCount = $('#ddEquipment > option').length;
    
    //if (equipmentQueryString != null && equipmentQueryString != "") {
    //    $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
    //    $("#ddEquipment").trigger("change");
    //    $("#ddEquipment").attr("disabled", "disabled");
    //}
    //else {
    //    if (ddCount > 1) {
    //        //$("#ddEquipment").prop('selectedIndex', 1);
    //        //$("#ddEquipment").trigger("change");
    //    }
    //}

    //if (equipmentQueryString == null || equipmentQueryString == "") {
    //    $("#ddEquipment option").each(function () {
    //        if ($(this).index() != 0) {
    //            lstEquipmentVal.push($(this).val());
    //            lstEquipmentText.push($(this).text());

    //            $(this).remove();
    //        }
    //    });
    //}
    //appendGroupEquipment();

    if (lotQueryString != null && lotQueryString != "") {

        $('#txtLotNumber').val(lotQueryString);
        $("#txtLotNumber").attr('disabled', 'disabled');
        $("#btnCheckLot").attr('disabled', 'disabled');
        $("#btnFocusLotNumber").attr('disabled', 'disabled');

        if (processQueryString != null && processQueryString != "") {
            
            if (processQueryString == "fromInbox")
            {
                getLotInfo(true);
            }
        }
        else
        {
            getLotInfo(false);
            HideLoading();
        }
    }
    else
    {
        HideLoading();
    }

});

function BroadcastEquipment(equipment)
{
    var isSignalR;

    //get the cookie
    try {
        isSignalR = getCookie("isSignalR");
    }
    catch (e) {
        isSignalR = "False";
    }

    try
    {
        if (isSignalR == "True") {
            var hubUrl = getCookie("SignalRHub");
            $.connection.hub.url = hubUrl;

            // Declare a proxy to reference the hub.
            var hub = $.connection.MessagesHub;

            // Start the connection.
            $.connection.hub.start().done(function () {
                hub.server.SendEquipmentBroadcast(equipment);
            }).fail(function (e) {
                if (isSignalR == "True") {
                    notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
                    identifier++;
                }
            });
        }
    }
    catch (e) {
        if (isSignalR == "True") {
            notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
            identifier++;
        }
    }
}

function appendGroupEquipment() {

    $.ajax({
        url: '/TrackOut/GetGroupIDConnection',
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

            if (equipmentQueryString == null || equipmentQueryString == "") {
                $("#ddEquipment option").each(function () {
                    if ($(this).index() != 0) {
                        lstEquipmentVal.push($(this).val());
                        lstEquipmentText.push($(this).text());

                        $(this).remove();
                    }
                });
            }

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

function setTrackOutTotal(equipment, ID)
{
    $.ajax({
        url: '/TrackIn/getProcessedQTY',
        data: { equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (processedQTY) {
       
        $.ajax({
            url: '/TrackIn/GetEquipmentTypeJoin',
            data: { ID: ID },
            method: 'GET'
        }).success(function (type) {

            type = type.toUpperCase();

            if (type == "LASER MARK TEST")
            {

                $.ajax({
                    url: '/TrackOut/getReel',
                    data: { EquipID: equipment },
                    method: 'GET'
                }).success(function (obj) {

                    var currentReel = 0;
                    try
                    {
                        currentReel = obj.CurrentReel;
                    }
                    catch (e)
                    {
                        currentReel = 0;
                    }

                    var reelQty = 0;
                    try
                    {
                        reelQty = obj.ReelQty;
                    }
                    catch (e)
                    {
                        reelQty = 0;
                    }
                    
                    if (parseInt(currentReel) == 0 || parseInt(reelQty) == 0)
                    {
                        $('#txtTrackOutQuantity').val(processedQTY);
                    }
                    else
                    {
                        var minus = parseInt(currentReel) * parseInt(reelQty);
                        var overall = parseInt(processedQTY) - parseInt(minus);
                        $('#txtTrackOutQuantity').val(overall);
                    }

                    $.ajax({
                        url: '/TrackIn/getTrackInUser',
                        data: { equipment: equipment },
                        contentType: 'application/json',
                        dataType: 'json',
                        method: 'GET'
                    }).success(function (user) {
                        $('#txtOperator').val(user);
                        HideLoading();
                    });
                });
            }
            else
            {
                $.ajax({
                url: '/TrackIn/getTrackInUser',
                data: { equipment: equipment },
                contentType: 'application/json',
                dataType: 'json',
                method: 'GET'
                }).success(function (user) {
                    $('#txtOperator').val(user);
                    HideLoading();
                });
            }

            
        });
    });
}

//function for redirecting to eproc
function gotoEProc()
{
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (index == 0 || index == -1) {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    if (lot == "" || lot == null)
    {
        notification_modal_dynamic("Notification", "Please enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/TrackOut/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/TrackOut/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    //notification_modal_confirm_eproc(equipment, lot);
                    redirect(equipment, lot);
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

//function for redirecting to wip data
function gotoWIPData() {
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (index == 0 || index == -1) {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    if (lot == "" || lot == null) {
        notification_modal_dynamic("Notification", "Please enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/TrackOut/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/TrackOut/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    //notification_modal_confirm_wipdata(equipment, lot);
                    redirect_wipdata(equipment, lot);
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

//notification modal to confirm going to set quantity
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
    modal += "You are about to change the Track Out Quantity, this will reset all rejects. Do you want to continue?";
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

function setQuantity(val, isShown)
{
    $('#txtTrackOutQuantity').val(val);

    if (isShown.toUpperCase() == "TRUE")
    {
        stack = [];
        $("#divList").hide();
        $("#ddDefectCategory").prop('selectedIndex', 0);
        $("#ddLossReason").prop('selectedIndex', 0);
        $('#txtLossReasonQuantity').val("");
        $('#txtDefectCause').val("");
        $('#txtRejectComment').val("");
        $('#txtScrapQuantity').val("0");
        $("#divStack").empty();
    }
}

function redirect(equipment, lot)
{
    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackOut" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackOut" + "&UserID=" + operator;
    }
}

function redirect_wipdata(equipment, lot)
{
    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "")
    {
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackOut" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else
    {
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackOut" + "&UserID=" + operator;
    }
}

//notification modal to confirm going to eproc
function notification_modal_confirm_eproc(equipment, lot) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to proceed to EProcedure?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="redirect(' + "'" + equipment + "'" + "," + "'" + lot + "'" + ');">OK</button>';
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

//notification modal to confirm going to eproc
function notification_modal_confirm_wipdata(equipment, lot) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to proceed to WIP Data Setup?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="redirect_wipdata(' + "'" + equipment + "'" + "," + "'" + lot + "'" + ');">OK</button>';
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

//modal for loss reason
function ShowScrap()
{
    var trackInQuantity = $('#txtMaxInProcessQuantity').val();
    var trackOutQuantity = $('#txtTrackOutQuantity').val();

    if (trackOutQuantity == null || trackOutQuantity == "") {
        notification_modal_dynamic("Notification", "Please specify Track Out Quantity first", "danger", identifier);
        identifier++;
        return;
    }

    if (parseInt(trackOutQuantity) > parseInt(trackInQuantity)) {
        notification_modal_dynamic("Notification", "Track Out Quantity is greater than Max In Process Quantity", "danger", identifier);
        identifier++;
        return;
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
            modal += '<div><label for="ddDefectCategory">Defect Category:</label><select id="ddDefectCategory" class="form-control"><option selected disabled>Select Defect Category</option><option value="EQUIPMENT" style="display:none;">EQUIPMENT</option><option value="INCIDENT" style="display:none;">INCIDENT</option><option value="MATERIAL" style="display:none;">MATERIAL</option><option value="OTHERS" style="display:none;">OTHERS</option><option value="" selected="selected">N/A</option></select></div><br/>';
            modal += '<div><label for="txtDefectCause">Defect Cause:</label><input type="text" class="form-control" id="txtDefectCause" placeholder="Defect Cause"></div><br/>';
            modal += '<div><label for="txtRejectComment">Comment:</label><textarea class="form-control" rows="4" id="txtRejectComment" placeholder="Comment"></textarea></div><br/>';
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
function setup_lossreason()
{
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

    var len = global_obj.length;

    if (len > 0)
    {
        for (var i = 0; i < len; i++) {

            var lossreason = global_obj[i].LossReason;
            var id = global_obj[i].ID;
            var defaultSelected = false;
            var nowSelected = false;
            $('#ddLossReason').append(new Option(lossreason, id, defaultSelected, nowSelected));
        }
    }

    //click handler for add loss reason
    $('#btnAddLossReason').click(function () {
        AddLossReason();
    });

}

//notification modal to confirm adding loss reason
function notification_modal_confirm_lossreason(tempQuantity, quantity) {

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
    modal += '<button type="button" class="btn btn-success" onclick="goLossReason(' + "'" + tempQuantity + "'" + ',' + "'" + quantity + "'" + ');">OK</button>';
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

//function for verifying loss reason before adding to list
function AddLossReason() {

    var trackOutQuantity = $('#txtTrackOutQuantity').val();

    if (trackOutQuantity == null || trackOutQuantity == "") {
        notification_modal_dynamic_super("Notification", "Please specify Track Out Quantity first", "danger", 'modal_div', identifier);
        identifier++;
        return;
    }

    var quantity = $('#txtLossReasonQuantity').val();
    var defectCause = $('#txtDefectCause').val();
    var index = $("#ddLossReason option:selected").index();
    var index2 = $("#ddDefectCategory option:selected").index();
    var comment = $('#txtRejectComment').val().replace(/\r\n|\r|\n/g, " ");

    var lossReason = $("#ddLossReason option:selected").text();
    var lossReasonID = $("#ddLossReason option:selected").val();
    var defectCategory = $("#ddDefectCategory option:selected").val();

    if (quantity == "" || index == 0 || index2 == 0) {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (index == 0) {
            msg += "Loss Reason<br/>";
        }
        if (quantity == "") {
            msg += "Quantity<br/>";
        }
        if (index2 == 0) {
            msg += "Defect Category<br/>";
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
        var obj = {
            ID: lossReasonID,
            LossReason: lossReason,
            RejectQuantity: quantity,
            DefectCategory: defectCategory,
            DefectCause: defectCause,
            Comment: comment
        };

        var result = $.grep(stack, function (e) { return e.ID == lossReasonID; });

        if (result == "" || result == null) {

            var tempQuantity = trackOutQuantity - quantity;

            if (tempQuantity < 0) {
                notification_modal_dynamic_super("Notification", "Cannot add more than the Track Out Quantity", "danger", 'modal_div', identifier);
                identifier++;
                return;
            }

            global_obj2 = null;
            global_obj2 = obj;

            $("#modal_div").modal("hide");
            notification_modal_confirm_lossreason(tempQuantity, quantity);
        }
        else {
            notification_modal_dynamic_super("Notification", "Cannot add duplicate reason", "danger", 'modal_div', identifier);
            identifier++;
        }
    }
}

//function for adding lossreason to list
function goLossReason(tempQuantity, quantity)
{
    confirm_lossreason = 1;

    $('#txtTrackOutQuantity').val(tempQuantity);

    var tempScrapQuantity = 0;
    try {
        var temp = $('#txtScrapQuantity').val();
        tempScrapQuantity = parseInt(temp);
    }
    catch (e) {
        tempScrapQuantity = 0
    }

    var total = parseInt(tempScrapQuantity) + parseInt(quantity);

    $('#txtScrapQuantity').val(total);

    stack.push(global_obj2);

    var div = $("#divStack");

    div.append('<div id="divBase_' + global_obj2.ID + '" style="text-align:right;"><button id="btnRemoveLossReason_' + global_obj2.ID + '" onclick="notification_modal_confirm(' + global_obj2.ID + ');" class="btn btn-danger" style="text-align:center;"><span class="glyphicon glyphicon-remove"></span></button></div>');

    div.append('<div id="divLossReason_' + global_obj2.ID + '" class="style-1 scrollbar">'
        + '<br/>&nbsp;<b>Loss Reason:</b> ' + global_obj2.LossReason + '<br/>'
        + '&nbsp;<b>Reject Quantity:</b> ' + global_obj2.RejectQuantity + '<br/>'
        + '&nbsp;<b>Defect Category:</b> ' + global_obj2.DefectCategory + '<br/>'
        + '&nbsp;<b>Defect Cause:</b> ' + global_obj2.DefectCause + '<br/>'
        + '&nbsp;<b>Comment:</b> ' + global_obj2.Comment + '<br/><br/>'
        + '</div><br id="brFiller_' + global_obj2.ID + '" />');

    $("#divList").show();
    $("#modal_div_lossreason").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

}

//function for getting lot info
function getLotInfo(check) {

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val().trim();
    
    //if (user == "" || lot == "")
    if (lot == "")
    {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        //if (user == "") {
        //    msg += "Operator<br/>";
        //}
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
    global_obj = null;

    $('#txtTrackOutQuantity').val("");
    $('#txtScrapQuantity').val("0");

    $("#divList").hide();
    $("#ddDefectCategory").prop('selectedIndex', 0);
    $('#txtLossReasonQuantity').val("");
    $('#txtDefectCause').val("");
    $('#txtRejectComment').val("");
    $("#divStack").empty();
    stack = [];


    $.ajax({
        url: '/TrackOut/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {
        
        if (result.ContainerName != null && result.ContainerName != "") 
        {
            var location = "";

            $("#txtMaxInProcessQuantity").val(result.MaxInProcessQty);
            $("#txtTrackOutQuantity").val(result.MaxInProcessQty);
            location = result.ProcessSpecObjectCategory;

            if (equipmentQueryString == null || equipmentQueryString == "") {
                
                if (user == "")
                {
                    notification_modal_dynamic("Notification", "Enter Operator", "danger", identifier);
                    identifier++;
                    return;
                }
                $.ajax({
                    url: '/TrackOut/GetTrackOutEquipment',
                    data: { LotNo: lot, UserID: user, Location: location },
                    contentType: 'application/json',
                    dataType: 'json',
                    method: 'GET'
                }).success(function (trackEquip) {
                    
                    var lst = trackEquip.Equipment;

                    if (lst != null)
                    {
                        if (lst.length > 0)
                        {
                            $('#ddEquipment').empty();
                            $('#ddEquipment').append($('<option></option>').val('Select Machine').html('Select Machine'));

                            for (var i = 0; i < lstEquipmentText.length; i++) {
                                if (lst.includes(lstEquipmentText[i])) {
                                    $('#ddEquipment').append($('<option></option>').val(lstEquipmentVal[i]).html(lstEquipmentText[i]));
                                }
                            }

                            $("#ddEquipment").prop('selectedIndex', 1);
                            
                            if (check == true) {
                                var temp_equip = $("#ddEquipment option:selected").text();
                                var temp_id = $("#ddEquipment option:selected").val();
                                setTrackOutTotal(temp_equip, temp_id);
                            }

                            //populateLossReason();

                            $.ajax({
                                url: '/TrackOut/FirstInsert',
                                data: { userID: user, lotNo: lot, location: location},
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
                        else
                        {
                            $("#ddEquipment").prop('selectedIndex', 0);
                        }
                    }
                    else
                    {
                        $("#ddEquipment").prop('selectedIndex', 0);
                    }

                });
            }
            else
            {
                if (check == true) {
                    
                    setTimeout(function () {
                        var temp_equip = $("#ddEquipment option:selected").text();
                        var temp_id = $("#ddEquipment option:selected").val();
                        setTrackOutTotal(temp_equip, temp_id);
                    }, 2000);
                }

                //removed/commented populate reason on load
                //populateLossReason();
                $("#btnAddScrap").removeAttr("disabled");
                $("#btnClearScrap").removeAttr("disabled");

                //$.ajax({
                //    url: '/TrackOut/FirstInsert',
                //    data: { userID: user, lotNo: lot, location: location},
                //    method: 'POST'
                //}).success(function (val) {

                //    if (val.toUpperCase().includes("ERROR")) {
                //        var temp = val.replace("ERROR:", "").replace("Error:", "");
                //        notification_modal_dynamic("Notification", temp, "danger", identifier);
                //        identifier++;
                //    }
                //    else {

                //        populateLossReason();
                //    }

                //}).error(function (e) {
                //    notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
                //    identifier++;
                //});
            }
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

function populateLossReason(callback)
{
    var isLossReason = false;

    var processType = 'NORMAL'

    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    //if (user == "" || lot == "" || index == 0)
    if (lot == "" || index == 0)
    {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        //if (user == "") {
        //    msg += "Operator<br/>";
        //}
        if (index == 0) {
            msg += "Machine<br/>";
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

    $.ajax({
        url: '/TrackOut/GetAllLossReason',
        contentType: 'application/json',
        data: { lotNo: lot, equipment: equipment, processType: processType.toUpperCase(), UserID: user },
        dataType: 'json',
        method: 'GET',
        beforeSend: function () {
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

            $("#btnAddScrap").removeAttr("disabled");
            $("#btnClearScrap").removeAttr("disabled");

            isLossReason = true;
            try {
                callback(isLossReason);
            }
            catch (e) { }
        }
        else {
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
        $('#btnAddScrap').removeAttr('disabled');
        $('#btnClearScrap').removeAttr('disabled');

        isLossReason = false;
        try {
            callback(isLossReason);
        }
        catch (e) { }
    });
}

//function for validating trackout inputs before submitting
function TrackOut() {

    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtMaxInProcessQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var trackOutQuantity = $('#txtTrackOutQuantity').val();
    var scrapQuantity = $('#txtScrapQuantity').val();

    var equipment = $("#ddEquipment option:selected").text();

    if (operator == "" || lotNo == "" || trackOutQuantity == "" || quantity == "" || index == 0 || index == -1) {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (operator == "") {
            msg += "Operator<br/>";
        }
        if (index == 0 || index == -1) {
            msg += "Machine<br/>";
        }
        if (lotNo == "") {
            msg += "Lot Number<br/>";
        }
        if (quantity == "") {
            msg += "Max In Process Quantity<br/>";
        }
        if (trackOutQuantity == "") {
            msg += "Track Out Quantity<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)", "");

        notification_modal_dynamic("Notification", msg, "danger", identifier);
        identifier++;
    }
    else
    {
        if(parseInt(trackOutQuantity) > parseInt(quantity))
        {
            notification_modal_dynamic("Notification", "Cannot Track Out more than the Track In Quantity", "danger", identifier);
            identifier++;
        }
        else
        {
            notification_modal_confirm_trackOut(lotNo, equipment, trackOutQuantity, scrapQuantity, comment, operator);
        }
    }
}

//build confirmation modal trackout
function notification_modal_confirm_trackOut(lotNo, equipment, trackOutQuantity, scrapQuantity, comment, userID) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to Track Out?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="SubmitTrackOut(' + "'" + lotNo + "'" + ',' + "'" + equipment + "'" + ',' + "'" + trackOutQuantity + "'" + ',' + "'" + scrapQuantity
        + "'" + ',' + "'" + comment + "'" + ',' + "'" + userID + "'" + ');">OK</button>';
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

//function for executing trackout
function SubmitTrackOut(lotNo, equipment, trackOutQuantity, scrapQuantity, comment, userID) {

    $("#modal_div").modal("hide");

    var ProcessType = 'NORMAL';

    var temp_identifier = 0;

    $.ajax({
        url: '/TrackOut/GetLotInfo',
        data: { LotNo: lotNo },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET',
        beforeSend: function ()
        {
            notification_modal_dynamic_loading("Notification", 'Tracking Out... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;

            $("#btnTrackOut").attr("disabled", "disabled");
        }
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {
            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/TrackOut/FirstInsert',
                data: { userID: userID, lotNo: lotNo, location: location },
                method: 'POST'
            }).success(function (returnval) {
                
                if (returnval != "" && returnval != null)
                {
                    if (returnval.toUpperCase().includes("ERROR"))
                    {

                        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                        $("#modal_div" + temp_identifier).modal("hide");

                        var temp = returnval.replace("ERROR:", "").replace("Error:", "");
                        notification_modal_dynamic("Notification", temp, 'danger', identifier);
                        identifier++;
                    }
                    else
                    {
                        //start reset reject

                        $.ajax({
                            url: '/TrackOut/ResetRejects',
                            data: { userID: userID, lotNo: lotNo, equipment: equipment, ProcessType: ProcessType.toUpperCase() },
                            method: 'POST'
                        }).success(function (val) {

                            //for forcing success (testing)
                            //val = "Success";
                            
                            if (val.toUpperCase().includes("ERROR") || val.toUpperCase().includes("FAILED"))
                            {
                                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                                $("#modal_div" + temp_identifier).modal("hide");

                                $("#btnTrackOut").removeAttr("disabled");
                                notification_modal_dynamic("Notification", val, 'danger', identifier);
                                identifier++;
                            }
                            else {
                                var lossreasonList = [];
                                var quantityList = [];
                                var categoryList = [];
                                var causeList = [];
                                var commentList = [];

                                for (var i = 0; i < stack.length; i++) {
                                    lossreasonList.push(stack[i].LossReason);
                                    quantityList.push(stack[i].RejectQuantity);
                                    categoryList.push(stack[i].DefectCategory);
                                    causeList.push(stack[i].DefectCause);
                                    commentList.push(stack[i].Comment);
                                }

                                var rejectLen = 0;
                                try
                                {
                                    rejectLen = stack.length;
                                }
                                catch (e) {
                                    rejectLen = 0;
                                }

                                if (rejectLen > 0)
                                {
                                    GoLotReject(userID, lotNo, equipment, lossreasonList, quantityList, categoryList, causeList, commentList, trackOutQuantity, scrapQuantity, comment, location, temp_identifier);
                                }
                                else
                                {
                                    GoTrackOut(userID, lotNo, equipment, trackOutQuantity, scrapQuantity, comment, location, temp_identifier);
                                }
                            }

                        }).error(function (e) {

                            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                            $("#modal_div" + temp_identifier).modal("hide");

                            $("#btnTrackOut").removeAttr("disabled");
                            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                            identifier++;
                        });
                    }
                }

            }).error(function (e) {

                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });
        }
        else
        {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            $("#btnTrackOut").removeAttr("disabled");
            notification_modal_dynamic("Notification", "Invalid Lot Number", 'danger', identifier);
            identifier++;
        }

    }).error(function (e) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        $("#btnTrackOut").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}


function GoLotReject(userID, lotNo, equipment, lossreasonList, quantityList, categoryList, causeList, commentList, trackOutQuantity, scrapQuantity, comment, location, ident)
{
    $.ajax({
        url: '/TrackOut/LotRejects',
        data: { userID: userID, lotNo: lotNo, equipment: equipment, lstLossReason: lossreasonList, lstLossQuantity: quantityList, lstCategory: categoryList, lstCause: causeList, lstComment: commentList },
        method: 'POST'
    }).success(function (retval) {

        //for forcing success (testing)
        //retval = "Success";

        if (retval.toUpperCase().includes("ERROR") || retval.toUpperCase().includes("FAILED")) {

            $("#notification_modal_dynamic_loading" + ident).modal("hide");
            $("#modal_div" + ident).modal("hide");

            $("#btnTrackOut").removeAttr("disabled");
            notification_modal_dynamic("Notification", retval, 'danger', identifier);
            identifier++;
        }
        else {
            GoTrackOut(userID, lotNo, equipment, trackOutQuantity, scrapQuantity, comment, location, ident);
        }

    }).error(function (e) {

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        $("#btnTrackOut").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;

    });
}

function GoTrackOut(userID, lotNo, equipment, trackOutQuantity, scrapQuantity, comment, location, ident)
{
    var isRemainInEquipment = $('#' + "chkRemainInEquipment").is(":checked");
    var isRemainInEquipmentIfPossible = $('#' + "chkRemainInEquipmentIfPossible").is(":checked");

    $.ajax({
        url: '/TrackOut/TrackOut',
        data: { userID: userID, lotNo: lotNo, equipment: equipment, TrackOutQty: trackOutQuantity, TotalScrapQty: scrapQuantity, comment: comment, location: location, remainInEquipment: isRemainInEquipment.toString(), remainInEquipmentifPossible: isRemainInEquipmentIfPossible.toString()},
        method: 'POST'
    }).success(function (trackoutResult) {

        //for forcing success (testing)
        //trackoutResult = "Success";

        $("#btnTrackOut").removeAttr("disabled");

        if (trackoutResult.toUpperCase().includes("ERROR")) {

            $("#notification_modal_dynamic_loading" + ident).modal("hide");
            $("#modal_div" + ident).modal("hide");
            var trackouttemp = trackoutResult.replace("ERROR:", "").replace("Error:", "");
            notification_modal_dynamic("Notification", trackouttemp, 'danger', identifier);
            identifier++;
        }
        else {

            BroadcastEquipment(equipment);

            if (processQueryString != null && processQueryString != "") {

                if (processQueryString == "fromInbox") {
                    var msgID = getCookie("EquipmentNotificationMessageID_" + equipment);
                    markAsReadTrackOut(msgID, trackoutResult, ident);
                }
            }
            else
            {
                $("#notification_modal_dynamic_loading" + ident).modal("hide");
                $("#modal_div" + ident).modal("hide");

                notification_modal_dynamic_redirect("Notification", trackoutResult, 'success', identifier);
                identifier++;
            }
        }

    }).error(function () {

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        $("#btnTrackOut").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

function markAsReadTrackOut(id, msg, ident) {

    $.ajax({
        url: '/Home/markAsRead',
        data: { ID: id },
        method: 'POST'
    }).success(function () {

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        notification_modal_dynamic_redirect("Notification", msg, 'success', identifier);
        identifier++;

    }).error(function () {
        
        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

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

    $("#modal_div" + ident).on("hidden.bs.modal", function () {

        document.location.href = '/' + "Home";
    });

}

//build notification modal for adding loss reason
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
function removeLossReason(id)
{
    var index = stack.findIndex(x => x.ID == id);
    var quantity = stack[index].RejectQuantity;
    stack.splice(index, 1);

    $("#divBase_" + id).remove();
    $("#divLossReason_" + id).remove();
    $("#brFiller_" + id).remove();

    try
    {
        var scrap = parseInt($('#txtScrapQuantity').val());
        scrap = parseInt(scrap) - parseInt(quantity);
        var total_quantity = parseInt($('#txtTrackOutQuantity').val())
        total_quantity = parseInt(total_quantity) + parseInt(quantity);

        $('#txtScrapQuantity').val(scrap);
        $('#txtTrackOutQuantity').val(total_quantity);
    }
    catch (e) { }

    if (stack.length > 0)
    {
        $("#divList").show();
    }
    else
    {
        $("#divList").hide();
    }

    $("#modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//confirmation modal for clearing scrap
function notification_modal_clear_scrap()
{
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

//function for clearing scrap
function ClearScrap()
{
    stack = [];
    $("#divStack").empty();
    $("#divList").hide();
    var temp = $('#txtScrapQuantity').val();
    $('#txtScrapQuantity').val("0");
    var temp2 = $('#txtTrackOutQuantity').val();

    if (temp2 != "")
    {
        var temp3 = parseInt(temp) + parseInt(temp2);
        $('#txtTrackOutQuantity').val(temp3);
    }

    $("#modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}


