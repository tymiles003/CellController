var identifier = 1;
var currentSelection = "";
var confirm_print = 0;

$(document).ready(function ()
{
    try
    {
        var divEquipments = $('*[id*=divEquipment_]').each(function () { });
        var divEquipmentGroups = $('*[id*=divEquipmentGroup_]').each(function () { });

        for (var i = 0; i < divEquipments.length; i++)
        {
            //for left click
            //$('#' + divEquipments[i].id).click(function ()
            //{
            //    currentSelection = this.id;
            //    var xAxis = event.pageX;
            //    var yAxis = event.pageY;
            //    showContextMenu(currentSelection, xAxis, yAxis);
            //});

            //for right click
            $('#' + divEquipments[i].id).bind("contextmenu", function (event)
            {
                // Avoid the real one
                event.preventDefault();

                currentSelection = this.id;

                var equip = currentSelection;
                equip = equip.replace('divEquipment_', '');
                equip = equip.replace('_Idle', '');
                equip = equip.replace('_Online', '');
                equip = equip.replace('_Offline', '');
                equip = equip.replace('_Warning', '');

                var xAxis = event.pageX;
                var yAxis = event.pageY;

                var _class = $(this).parent('div').attr('class');
                if (_class != undefined && _class != null && _class != "")
                {
                    showContextMenu(currentSelection, xAxis, yAxis);
                }

                //$.ajax({
                //    url: '/Home/IsChildEquipment',
                //    method: 'GET',
                //    data: { equipment: equip }
                //}).success(function (result) {
                    
                //    if (result.toUpperCase() != "TRUE")
                //    {
                //        showContextMenu(currentSelection, xAxis, yAxis);
                //    }
                //});
            });
        }

        for (var i = 0; i < divEquipmentGroups.length; i++)
        {
            //for right click
            $('#' + divEquipmentGroups[i].id).bind("contextmenu", function (event) {

                // Avoid the real one
                event.preventDefault();

                currentSelection = this.id;

                showContextMenuGroup(currentSelection);
            });
        }

        // If the document is clicked somewhere
        $(document).bind("mousedown", function (e) {
            
            if (!$(e.target).parents(".custom-menu").length > 0) {

                // Hide it
                $(".custom-menu").hide(100);
            }
        });

        //if the escape button is pressed, we close the custom context menu
        $(document).keyup(function (e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`

                var check = $(".custom-menu").is(":visible");
                if (check == true)
                {
                    $(".custom-menu").hide(100);
                }
            }
        });

        // If the menu element is clicked
        $(".custom-menu li").click(function () {

            var action = $(this).attr("data-action");

            if (action != "Title")
            {
                // Hide it AFTER the action was triggered
                $(".custom-menu").hide(100);

                var equipment = currentSelection;
                equipment = equipment.replace('divEquipment_', '');
                equipment = equipment.replace('_Idle', '');
                equipment = equipment.replace('_Online', '');
                equipment = equipment.replace('_Offline', '');
                equipment = equipment.replace('_Warning', '');
                
                
                var LotWarning = $("#lblLotName_" + equipment + "_Warning").text();
                var LotOnline = $("#lblLotName_" + equipment + "_Online").text();
                var LotOffline = $("#lblLotName_" + equipment + "_Offline").text();
                var LotIdle = $("#lblLotName_" + equipment + "_Idle").text();

                var lot = LotOnline;

                if (lot == "N/A")
                {
                    if (action == "TrackIn") {
                        document.location.href = '/TrackIn?Equipment=' + equipment;
                    }
                    else if (action == "TrackOut") {
                        document.location.href = '/TrackOut?Equipment=' + equipment;
                    }
                    else if (action == "EProcedure") {
                        document.location.href = '/EProcedure?Equipment=' + equipment;
                    }
                    else if (action == "WIPData") {
                        document.location.href = '/WIPData?Equipment=' + equipment;
                    }
                    else if (action == "Engineer") {
                        document.location.href = '/Engineer?Equipment=' + equipment;
                    }
                }
                else if (lot == "") {
                    
                    $.ajax({
                        url: '/Home/getChildEquipments',
                        method: 'GET',
                        data: { parent: equipment }
                    }).success(function (children) {

                        for (var x = 0; x < children.length; x++) {

                            LotWarning = $("#lblLotName_" + children[x] + "_Warning").text();
                            LotOnline = $("#lblLotName_" + children[x] + "_Online").text();
                            LotOffline = $("#lblLotName_" + children[x] + "_Offline").text();
                            LotIdle = $("#lblLotName_" + children[x] + "_Idle").text();
                        }

                        lot = LotOnline;

                        if (lot == "N/A")
                        {
                            if (action == "TrackIn") {
                                document.location.href = '/TrackIn?Equipment=' + equipment;
                            }
                            else if (action == "TrackOut") {
                                document.location.href = '/TrackOut?Equipment=' + equipment;
                            }
                            else if (action == "EProcedure") {
                                document.location.href = '/EProcedure?Equipment=' + equipment;
                            }
                            else if (action == "WIPData") {
                                document.location.href = '/WIPData?Equipment=' + equipment;
                            }
                            else if (action == "Engineer") {
                                document.location.href = '/Engineer?Equipment=' + equipment;
                            }
                        }
                        else
                        {
                            if (action == "TrackIn") {
                                document.location.href = '/TrackIn?Equipment=' + equipment;
                            }
                            else if (action == "TrackOut") {
                                document.location.href = '/TrackOut?Equipment=' + equipment + "&Lot=" + lot;
                            }
                            else if (action == "EProcedure") {
                                document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot;
                            }
                            else if (action == "WIPData") {
                                document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot;
                            }
                            else if (action == "Engineer") {
                                document.location.href = '/Engineer?Equipment=' + equipment + "&Lot=" + lot;
                            }
                        }
                    });
                }
                else {
                    if (action == "TrackIn") {
                        document.location.href = '/TrackIn?Equipment=' + equipment;
                    }
                    else if (action == "TrackOut") {
                        document.location.href = '/TrackOut?Equipment=' + equipment + "&Lot=" + lot;
                    }
                    else if (action == "EProcedure") {
                        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot;
                    }
                    else if (action == "WIPData") {
                        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot;
                    }
                    else if (action == "Engineer") {
                        document.location.href = '/Engineer?Equipment=' + equipment + "&Lot=" + lot;
                    }
                }
                
                
            }
        });

        var btnPrint = $('*[id*=btnPrint_]').each(function () { });
        for (var i = 0; i < btnPrint.length; i++) {

            var elementID = btnPrint[i].id;
            var equip = elementID;
            equip = equip.replace('btnPrint_', '');
            equip = equip.replace('_Idle', '');
            equip = equip.replace('_Online', '');
            equip = equip.replace('_Offline', '');
            equip = equip.replace('_Warning', '');


            var addOnClick = function (equipment) {
                document.getElementById(elementID).onclick = function () {
                    $.ajax({
                        url: '/TrackIn/getTrackInLot',
                        data: { equipment: equipment },
                        method: 'GET'
                    }).success(function (lot) {

                        PrintLabel(equipment, lot);

                    });
                };
            };
            addOnClick(equip);
        }

        //get the count of enrolled equipments
        var count = 0;
        try
        {
            count = parseInt(getCookie("EquipCount"));
        }
        catch (e)
        {
            count = 0;
        }

        var groupCount = 0;
        try
        {
            groupCount = parseInt(getCookie("GroupCount"));
        }
        catch (e)
        {
            groupCount = 0;
        }

        var overallCount = 0;
        try
        {
            overallCount = count + groupCount;
        }
        catch(e)
        {
            overallCount = 0;
        }

        if (overallCount == 0 || overallCount == null || isNaN(overallCount))
        {
            show('divNoEquipment');
        }
        else
        {
            hide('divNoEquipment');
        }

        var isSignalR;

        //get the cookie
        try
        {
            isSignalR = getCookie("isSignalR");
        }
        catch (e)
        {
            isSignalR = "False";
        }

        try
        {
            if (isSignalR == "True")
            {
                var hubUrl = getCookie("SignalRHub");
                $.connection.hub.url = hubUrl;

                // Declare a proxy to reference the hub.
                var hub = $.connection.MessagesHub;

                // Start the connection.
                $.connection.hub.start().done(function ()
                {

                }).fail(function (e)
                {
                    if (isSignalR == "True")
                    {
                        notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
                        identifier++;
                    }
                });

                //signalr update for machine status
                hub.client.MachineStatus = function (equip, status)
                {
                    SetStatus(equip, status);
                };

                //signalr update for alarms
                hub.client.Alarm = function (messageId, equip, message, readNotification, transactionId, date, messageType)
                {
                    //alert(messageId + "/" + equip);
                    //alert(message + "/" + readNotification);
                    //alert(transactionId);
                    //alert(date + "/" +  messageType);
                    SetAlarm(equip);
                };

                hub.client.ReadAlarm = function (messageId, equip, message, readNotification, transactionId, date, messageType) {
                    SetAlarmRead(equip);
                };

                //hub.client.TCPListen = function (equip, type, message) {
                //    var username = getCookie("Username");
                //    $.ajax({
                //        url: '/Listener/GetEquipmentForUser',
                //        data: { username: username },
                //        method: 'GET'
                //    }).success(function (result) {

                //        if (result.includes(equip))
                //        {
                //            alert('from index: ' + equip + "/" + message);
                //            //alert(equip + "//" + message);
                //        }
                //    });
                //};

                hub.client.ProcessedQTY = function (equipment, processedQty, brandedQty, unbrandedQty) {
                    SetProcess(equipment, processedQty, brandedQty, unbrandedQty);
                };

                hub.client.TCPNotification = function (equipment) {
                    SetAlarmTCP(equipment);
                };

                hub.client.ReadTCPNotification = function (equipment) {
                    SetAlarmTCPRead(equipment);
                };

                //signalr update for recipe
                hub.client.Recipe = function (equip, recipeFilePath)
                {
                    var equipments = getCookie("Equipments");
                    var check = equipments.includes(equip);
                    if (check == true)
                    {
                        notification_modal_dynamic("Recipe Uploaded", "A recipe file has been uploaded for Equipment: " + equip + " at Server (" + recipeFilePath + ")", "success", identifier);
                        identifier++;
                    }
                };

                hub.client.EquipmentUpdate = function (equipment) {
                    //location.reload();

                };

                hub.client.BroadcastEquipmentUpdate = function (equipment) {
                    location.reload();
                };

                hub.client.S6F11FromEquipment = function (equipment, msgID, message) {
                    //alert(equipment);
                    //alert(msgID);
                    //alert(message);
                };

                hub.client.SECSGEMCounter = function (equipment, qty, qty2, multiplier) {
                    //alert(equipment + "/" + qty + "/" + qty2);
                    SetProcessSECSGEM(equipment, qty, qty2, multiplier);
                };

                hub.client.ReelUpdate = function (equipment,  ReelQty, CurrentQty, CurrentReel, TotalReel, RemainingReel, AllowedReel, InReel) {
                    var lblLeftCounterPrintWarning = "lblLeftCounterPrint_" + equipment + "_Warning";
                    var lblLeftCounterPrintOnline = "lblLeftCounterPrint_" + equipment + "_Online";
                    var lblLeftCounterPrintOffline = "lblLeftCounterPrint_" + equipment + "_Offline";
                    var lblLeftCounterPrintIdle = "lblLeftCounterPrint_" + equipment + "_Idle";

                    var lblRightCounterPrintWarning = "lblRightCounterPrint_" + equipment + "_Warning";
                    var lblRightCounterPrintOnline = "lblRightCounterPrint_" + equipment + "_Online";
                    var lblRightCounterPrintOffline = "lblRightCounterPrint_" + equipment + "_Offline";
                    var lblRightCounterPrintIdle = "lblRightCounterPrint_" + equipment + "_Idle";

                    $('#' + lblLeftCounterPrintWarning).text(CurrentReel);
                    $('#' + lblLeftCounterPrintOnline).text(CurrentReel);
                    $('#' + lblLeftCounterPrintOffline).text(CurrentReel);
                    $('#' + lblLeftCounterPrintIdle).text(CurrentReel);

                    $('#' + lblRightCounterPrintWarning).text(TotalReel);
                    $('#' + lblRightCounterPrintOnline).text(TotalReel);
                    $('#' + lblRightCounterPrintOffline).text(TotalReel);
                    $('#' + lblRightCounterPrintIdle).text(TotalReel);

                    var btnPrintWarning = "btnPrint_" + equipment + "_Warning";
                    var btnPrintOnline = "btnPrint_" + equipment + "_Online";
                    var btnPrintOffline = "btnPrint_" + equipment + "_Offline";
                    var btnPrintIdle = "btnPrint_" + equipment + "_Idle";

                    if(parseInt(AllowedReel) > 0)
                    {
                        var btnSpanPrintAllowedWarning = "btnSpanPrintAllowed_" + equipment + "_Warning";
                        var btnSpanPrintAllowedOnline = "btnSpanPrintAllowed_" + equipment + "_Online";
                        var btnSpanPrintAllowedOffline = "btnSpanPrintAllowed_" + equipment + "_Offline";
                        var btnSpanPrintAllowedIdle = "btnSpanPrintAllowed_" + equipment + "_Idle";

                        $("#" + btnSpanPrintAllowedWarning).text(AllowedReel);
                        $("#" + btnSpanPrintAllowedOnline).text(AllowedReel);
                        $("#" + btnSpanPrintAllowedOffline).text(AllowedReel);
                        $("#" + btnSpanPrintAllowedIdle).text(AllowedReel);

                        $('#' + btnPrintWarning).show();
                        $('#' + btnPrintOnline).show();
                        $('#' + btnPrintOffline).show();
                        $('#' + btnPrintIdle).show();
                    }
                    else
                    {
                        $('#' + btnPrintWarning).hide();
                        $('#' + btnPrintOnline).hide();
                        $('#' + btnPrintOffline).hide();
                        $('#' + btnPrintIdle).hide();
                    }

                };
            }
        }
        catch (e)
        {
            if (isSignalR == "True")
            {
                notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
                identifier++;
            }
        }
    }
    catch (e) { }

    //normalizeHeight();

    //$.ajax({
    //    url: '/Home/GetMachineName',
    //    method: 'GET'
    //}).success(function (machineName) {

    //    alert(machineName);
    //});

    HideLoading();

});

function PrintLabel(equipment, lot)
{
   $.ajax({
        url: '/Home/getReel',
        method: 'GET',
        data: {equipment: equipment}
    }).success(function (result) {

        $.ajax({
            url: '/TrackIn/getTrackInUser',
            method: 'GET',
            data: { equipment: equipment }
        }).success(function (val) {

            var reelQty = result.ReelQty;

            var user = val;
            
            ShowPrintForm(equipment, user, lot, reelQty);
        });
    });
}

function ShowPrintForm(equipment, user, lot, reelQty)
{
    confirm_print = 0;

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Label Print" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';

    modal += '<div><label for="txtOperator">Operator ID:</label><div class="input-group" id="divOper"><input type="text" class="form-control" id="txtOperator" placeholder="Operator ID"><span class="input-group-btn" title="Focus" data-toggle="tooltip"><button class="btn btn-default" type="button" id="btnFocusOperatorID"><span class="glyphicon glyphicon-eye-open"></span></button></span></div></div><br/>';
    //modal += '<div><label for="txtLotNumber">Lot Number:</label><input type="text" class="form-control" disabled="disabled" id="txtLotNumber" placeholder="Lot Number"></div><br/>';
    modal += '<div><label for="txtLotNumber">Lot Number:</label><div class="input-group" id="divLot"><input type="text" class="form-control" disabled="disabled" id="txtLotNumber" placeholder="Lot Number"><span id="spanWIPData" class="input-group-btn" title="WIP Data" data-toggle="tooltip"><button class="btn btn-default" type="button" id="btnWIPData"><span class="fa fa-balance-scale"></span></button></span></div></div><br/>';

    modal += '<div><label for="txtTrackOutQuantity">Track Out Quantity:</label><input type="text" class="form-control" disabled="disabled" id="txtTrackOutQuantity" placeholder="Track Out Quantity"></div><br/>';
    modal += '<div><label for="txtRejectQuantity">Reject Quantity:</label><input type="text" class="form-control" disabled="disabled" value="0" id="txtRejectQuantity" placeholder="Reject Quantity"></div><br/>';
    modal += '<div><input type="checkbox" checked="checked" disabled="disabled" id="chkRemainInEquipment" value="RemainInEquipment"> Remain In Equipment<br></div>';
    modal += '<div><input type="checkbox" disabled="disabled" id="chkRemainInEquipmentIfPossible" value="RemainInEquipmentIfPossible"> Remain In Equipment If Possible<br></div><br/>';
    modal += '<div><label for="txtComment">Comment:</label><textarea class="form-control" rows="4" id="txtComment" placeholder="Comment"></textarea></div>';

    modal += '</div>';


    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="notification_modal_confirm_print(' + "'" + equipment + "','" + user + "','" + lot + "','" + reelQty + "');" + '"' + '>OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {populatePrint("' + equipment + '","' + user + '","' + lot + '","' + reelQty + '");});'
    modal += '</script>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

}

function notification_modal_confirm_print(equipment, user, lot, reelQty)
{
    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div_print" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
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
    modal += '<button type="button" class="btn btn-success" onclick="proceedPrint(' + "'" + equipment + "','" + user + "','" + lot + "','" + reelQty + "'" + ');">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#modal_div").modal("hide");
    $("#notification_modal2").html(modal);
    $("#modal_div_print").modal("show");
    $("#modal_div_print").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div_print").on("hidden.bs.modal", function () {

        if (confirm_print == 0) {
            $("#modal_div").modal("show");
        }
        else {
            $("#modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        confirm_print = 0;

    });
}

function proceedPrint(equipment, user, lot, reelQty)
{
    var isRemainInEquipment = $('#' + "chkRemainInEquipment").is(":checked");
    var isRemainInEquipmentIfPossible = $('#' + "chkRemainInEquipmentIfPossible").is(":checked");
    var TotalScrapQty = $('#txtRejectQuantity').val();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    //reelQty = "10";
    
    var temp_identifier = 0;

    $.ajax({
        url: '/Home/GetLotLocation',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        var isRemainInEquipment = $('#' + "chkRemainInEquipment").is(":checked");
        var isRemainInEquipmentIfPossible = $('#' + "chkRemainInEquipmentIfPossible").is(":checked");

        var location = result.Location;

        $.ajax({
            url: '/TrackOut/TrackOut',
            data: { userID: user, lotNo: lot, equipment: equipment, TrackOutQty: reelQty, TotalScrapQty: TotalScrapQty, comment: comment, location: location, remainInEquipment: isRemainInEquipment.toString(), remainInEquipmentifPossible: isRemainInEquipmentIfPossible.toString() },
            method: 'POST',
            beforeSend: function () {
                notification_modal_dynamic_loading("Notification", 'Printing Label... Please wait.', 'success', identifier);
                temp_identifier = identifier;
                identifier++;
            }
        }).success(function (trackoutResult) {

            //trackoutResult = "Success";

            if (trackoutResult.toUpperCase().includes("ERROR")) {

                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");
                var trackouttemp = trackoutResult.replace("ERROR:", "").replace("Error:", "");

                confirm_print = 1;
                notification_modal_dynamic_super("Notification", trackouttemp, 'danger', 'modal_div', identifier);
                identifier++;
                $("#modal_div_print").modal("hide");
            }
            else {
                

                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                confirm_print = 1;
                notification_modal_dynamic("Notification", trackoutResult, 'success', identifier);
                identifier++;
                $("#modal_div_print").modal("hide");
            }

        }).error(function () {

           
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            confirm_print = 1;
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'modal_div', identifier);
            identifier++;
            $("#modal_div_print").modal("hide");
        });

    }).error(function (){
        confirm_print = 1;
        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'modal_div', identifier);
        identifier++;
        $("#modal_div_print").modal("hide");
    });
}

function populatePrint(equipment, user, lot, reelQty)
{
    $('[data-toggle="tooltip"]').tooltip();
    
    var Uname = getCookie("Username");

    $('#spanWIPData').hide();

    $.ajax({
        url: '/TrackOut/getUserRights',
        data: { username: Uname },
        method: 'GET'
    }).success(function (result) {

        var hasRights = false;

        if (result != null) {
            
            for (var x = 0; x < result.length; x++) {
                if (result[x] == "Data Collection") {
                    $('#spanWIPData').show();
                    hasRights = true;
                }
            }
        }

        if (hasRights == false)
        {
            $("#divLot").removeClass('input-group');
        }
    });

    $.ajax({
        url: '/Configuration/GetIsScanner',
        method: 'GET'
    }).success(function (isScanner) {

        
        if (isScanner.toString().toUpperCase() == "TRUE") {
            $('#txtOperator').attr('readonly', 'readonly');
        }

        $("#txtOperator").codeScanner({
            onScan: function ($element, code) {

                $("#txtOperator").val(code);
            }
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
            user = EmployeeNumber;
            $("#txtOperator").attr("disabled", "disabled");
            $("#btnFocusOperatorID").hide();
            $("#divOper").removeClass('input-group');
        }

        $('#txtOperator').val(user);
        $('#txtLotNumber').val(lot);
        $('#txtTrackOutQuantity').val(reelQty);

    });

    $('#btnWIPData').click(function (event) {
        gotoWIPData(equipment);
    });
}

function gotoWIPData(equipment) {
    var operator = $('#txtOperator').val();
    var lot = $('#txtLotNumber').val();
    document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=Home" + "&UserID=" + operator;
}

function normalizeHeight()
{
    var divPanel = $('*[id*=divPanel_]').each(function () { });
    var isProcess = false;
    var lstEquipment = []

    //first get all equipments
    for (var i = 0; i < divPanel.length; i++)
    {
        var id = divPanel[i].id;
        var equipment = id.replace('divPanel_', '').replace('_Online', '').replace('_Offline', '').replace('_Idle', '').replace('_Warning', '');

        if (!lstEquipment.includes(equipment))
        {
            lstEquipment.push(equipment);
        }
    }

    //check if there is processing
    for (var i = 0; i < lstEquipment.length; i++)
    {
        var DivProcessOnline = "divProcessing_" + lstEquipment[i] + "_Online";
        var displayProcess = document.getElementById(DivProcessOnline).style.display;

        if (displayProcess.toString() == "block") {
            isProcess = true;
        }
    }

    if (isProcess == true)
    {
        for (var i = 0; i < divPanel.length; i++)
        {
            var id = divPanel[i].id;
            var equipment = id.replace('divPanel_', '').replace('_Online', '').replace('_Offline', '').replace('_Idle', '').replace('_Warning', '');

            var child = document.getElementById(id).childNodes;

            for (var x = 0; x < child.length; x++) {
                if (child[x].className == "panel-body") {
                    var secondChild = child[x].childNodes;

                    for (var z = 0; z < secondChild.length; z++) {
                        if (secondChild[z].className == "info-box-progress") {

                            var node = document.createElement("div");
                            node.style.display = 'block';

                            var txt = document.createTextNode("\u00A0");

                            var lbl = document.createElement("label");
                            var txt2 = document.createTextNode("\u00A0");
                            lbl.appendChild(txt2);

                            node.appendChild(txt);
                            node.appendChild(lbl);

                            var br = document.createElement("br");

                            node.appendChild(br);

                            var txt3 = document.createTextNode("\u00A0");

                            var lbl2 = document.createElement("label");
                            var txt4 = document.createTextNode("\u00A0");
                            lbl2.appendChild(txt4);

                            node.appendChild(txt3);
                            node.appendChild(lbl2);

                            var QtyDivOnline = "QtyDiv_" + equipment + "_Online";

                            var displayQty = document.getElementById(QtyDivOnline).style.display;

                            if (displayQty.toString() == 'none') {
                                secondChild[z].appendChild(node);
                            }
                        }
                    }
                }
            }
        }
    }
   
}

function showContextMenuGroup(ctxID)
{
    var username = getCookie("Username");
    var parent = ctxID;
    parent = parent.replace('divEquipmentGroup_', '');
    parent = parent.replace('_Idle', '');
    parent = parent.replace('_Online', '');
    parent = parent.replace('_Offline', '');
    parent = parent.replace('_Warning', '');

    var xAxis = event.pageX;
    var yAxis = event.pageY;
    
    $.ajax({
        url: '/Home/getChildEquipments',
        method: 'GET',
        data: { parent: parent }
    }).success(function (children) {

        var isOffline = false;
        for (var x = 0; x < children.length; x++) {

            //check if theres a child offline
            var div = "divEquipment_" + children[x] + "_Offline";
            var isVisible = $('#' + div).is(":visible");
            if (isVisible == true) {
                isOffline = true;
            }
        }

        $('#menuTitle').html(parent);

        $('#menuTrackIn').hide();
        $('#menuTrackOut').hide();
        $('#menuEProc').hide();
        $('#menuWIPData').hide();
        $('#menuEngineer').hide();

        if (isOffline == true) {
            //dont allow transaction
            $('#menuTitle').html('Cannot Transact:<br>' + parent + '. An equipment is Offline');
        }
        else
        {
            $('#menuTitle').html(parent);
            currentSelection = parent;

            $.ajax({
                url: '/Home/getUserRights',
                data: { username: username },
                method: 'GET'
            }).success(function (result) {

                if (result != null) {
                    for (var x = 0; x < result.length; x++) {

                        if (result[x] == "Track Out") {

                            $.ajax({
                                url: '/Home/getChildEquipments',
                                method: 'GET',
                                data: { parent: currentSelection }
                            }).success(function (children) {

                                for (var x = 0; x < children.length; x++) {

                                    $.ajax({
                                        url: '/Home/isProcessing',
                                        data: { Equipment: children[x] },
                                        method: 'GET'
                                    }).success(function (val) {
                                        if (val == true) {
                                            $('#menuTrackOut').show();
                                        }
                                    });
                                }
                            });
                        }

                        if (result[x] == "Track In") {

                            $.ajax({
                                url: '/Home/getChildEquipments',
                                method: 'GET',
                                data: { parent: currentSelection }
                            }).success(function (children) {

                                for (var x = 0; x < children.length; x++) {

                                    $.ajax({
                                        url: '/Home/isProcessing',
                                        data: { Equipment: children[x] },
                                        method: 'GET'
                                    }).success(function (val) {
                                        if (val == false) {
                                            $('#menuTrackIn').show();
                                        }
                                    });
                                }
                            });
                        }

                        if (result[x] == "EProcedure") {
                            $('#menuEProc').show();
                        }

                        if (result[x] == "Data Collection") {
                            $('#menuWIPData').show();
                        }

                        if (result[x] == "Engineering Mode") {
                            $('#menuEngineer').show();
                        }
                    }
                }

                var checkTrackIn = $('#menuTrackIn').is(":visible");
                var checkTrackOut = $('#menuTrackOut').is(":visible");
                var checkEProc = $('#menuEProc').is(":visible");
                var checkWIPData = $('#menuWIPData').is(":visible");

                if (checkTrackIn == false && checkTrackOut == false && checkEProc == false && checkWIPData == false) {
                    $('#menuTitle').html('Cannot Transact:<br>' + 'Insufficient Privilege');
                }
            });
        }

        // Show contextmenu
        $(".custom-menu").finish().toggle(100).

        // In the right position (the mouse)
        css({
            top: yAxis + "px",
            left: xAxis + "px"
        });

    });
}

function showContextMenu(ctxID, xAxis, yAxis) {

    var username = getCookie("Username");
    var equipment = ctxID;
    equipment = equipment.replace('divEquipment_', '');
    equipment = equipment.replace('_Idle', '');
    equipment = equipment.replace('_Online', '');
    equipment = equipment.replace('_Offline', '');
    equipment = equipment.replace('_Warning', '');

    $('#menuTitle').html(equipment);

    $('#menuTrackIn').hide();
    $('#menuTrackOut').hide();
    $('#menuEProc').hide();
    $('#menuWIPData').hide();
    $('#menuEngineer').hide();

    if (ctxID.includes("Offline")) {
        $('#menuTitle').html('Cannot Transact:<br>' + equipment + ' is Offline');
    }
    else
    {
        $('#menuTitle').html(equipment);

        $.ajax({
            url: '/Home/getUserRights',
            data: { username: username },
            method: 'GET'
        }).success(function (result) {

            if (result != null) {
                for (var x = 0; x < result.length; x++) {

                    if (result[x] == "Track Out") {

                        $('#menuTrackOut').show();

                        $.ajax({
                            url: '/Home/isProcessing',
                            data: { Equipment: equipment },
                            method: 'GET'
                        }).success(function (val) {

                            if (val == true) {
                                $('#menuTrackOut').show();
                            }
                            else {
                                $('#menuTrackOut').hide();
                            }
                        });
                    }

                    if (result[x] == "Track In") {

                        //$('#menuTrackIn').show();

                        $.ajax({
                            url: '/Home/isProcessing',
                            data: { Equipment: equipment },
                            method: 'GET'
                        }).success(function (val) {

                            if (val == true) {
                                $('#menuTrackIn').hide();
                            }
                            else {
                                $('#menuTrackIn').show();
                            }
                        });
                    }

                    if (result[x] == "EProcedure") {
                        $('#menuEProc').show();
                    }

                    if (result[x] == "Data Collection") {
                        $('#menuWIPData').show();
                    }

                    if (result[x] == "Engineering Mode") {
                        $('#menuEngineer').show();
                    }
                }
            }

            var checkTrackIn = $('#menuTrackIn').is(":visible");
            var checkTrackOut = $('#menuTrackOut').is(":visible");
            var checkEProc = $('#menuEProc').is(":visible");
            var checkWIPData = $('#menuWIPData').is(":visible");

            if (checkTrackIn == false && checkTrackOut == false && checkEProc == false && checkWIPData == false) {
                $('#menuTitle').html('Cannot Transact:<br>' + 'Insufficient Privilege');
            }
        });

    }
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).

    // In the right position (the mouse)
    css({
        top: yAxis + "px",
        left: xAxis + "px"
    });
}

function SetProcessSECSGEM(equipment, processQty, processQty2, multiplier) {
    var lblLeftCounterWarning = $("#lblLeftCounter_" + equipment + "_Warning");
    var lblLeftCounterOnline = $("#lblLeftCounter_" + equipment + "_Online");
    var lblLeftCounterOffline = $("#lblLeftCounter_" + equipment + "_Offline");
    var lblLeftCounterIdle = $("#lblLeftCounter_" + equipment + "_Idle");

    var lblRightCounterWarning = $("#lblRightCounter_" + equipment + "_Warning");
    var TrackInQtyWarning = lblRightCounterWarning.text();
    var lblRightCounterOnline = $("#lblRightCounter_" + equipment + "_Online");
    var TrackInQtyOnline = lblRightCounterOnline.text();
    var lblRightCounterOffline = $("#lblRightCounter_" + equipment + "_Offline");
    var TrackInQtyOffline = lblRightCounterOffline.text();
    var lblRightCounterIdle = $("#lblRightCounter_" + equipment + "_Idle");
    var TrackInQtyIdle = lblRightCounterIdle.text();
    var ProgressBarWarning = $("#ProgressBar_" + equipment + "_Warning");
    var ProgressBarOnline = $("#ProgressBar_" + equipment + "_Online");
    var ProgressBarOffline = $("#ProgressBar_" + equipment + "_Offline");
    var ProgressBarIdle = $("#ProgressBar_" + equipment + "_Idle");

    var lblUnitWarning = $("#lblUnits_" + equipment + "_Warning");
    var lblUnitOnline = $("#lblUnits_" + equipment + "_Online");
    var lblUnitOffline = $("#lblUnits_" + equipment + "_Offline");
    var lblUnitIdle = $("#lblUnits_" + equipment + "_Idle");

    var totalQty = 0;

    totalQty = parseInt(processQty) + parseInt(processQty2);

    lblUnitWarning.text(totalQty);
    lblUnitOnline.text(totalQty);
    lblUnitOffline.text(totalQty);
    lblUnitIdle.text(totalQty);

    var totalQtyWithMulti = 0;
    totalQtyWithMulti = totalQty * multiplier;

    lblLeftCounterWarning.text(totalQtyWithMulti);
    lblLeftCounterOnline.text(totalQtyWithMulti);
    lblLeftCounterOffline.text(totalQtyWithMulti);
    lblLeftCounterIdle.text(totalQtyWithMulti);

    var trackInQty = TrackInQtyOnline;
    var percentage = (parseFloat(totalQtyWithMulti) / parseFloat(trackInQty)) * 100;

    var ProcessingText = "";
    if (percentage >= 100) {
        ProcessingText = "Done Processing:";
    }
    else {
        ProcessingText = "Processing:";
    }

    ProgressBarWarning.css({ "width": percentage.toString() + "%" });
    ProgressBarOnline.css({ "width": percentage.toString() + "%" });
    ProgressBarOffline.css({ "width": percentage.toString() + "%" });
    ProgressBarIdle.css({ "width": percentage.toString() + "%" });

    var lblProcessWarning = $("#lblProcess_" + equipment + "_Warning");
    var lblProcessOnline = $("#lblProcess_" + equipment + "_Online");
    var lblProcessOffline = $("#lblProcess_" + equipment + "_Offline");
    var lblProcessIdle = $("#lblProcess_" + equipment + "_Idle");

    lblProcessOnline.text(ProcessingText);
    lblProcessOnline.append("&nbsp;");

}

function SetProcess(equipment, processQty, brandedQty, unbrandedQty)
{
    var lblLeftCounterWarning = $("#lblLeftCounter_" + equipment + "_Warning");
    var lblLeftCounterOnline = $("#lblLeftCounter_" + equipment + "_Online");
    var lblLeftCounterOffline = $("#lblLeftCounter_" + equipment + "_Offline");
    var lblLeftCounterIdle = $("#lblLeftCounter_" + equipment + "_Idle");

    var lblRightCounterWarning = $("#lblRightCounter_" + equipment + "_Warning");
    var TrackInQtyWarning = lblRightCounterWarning.text();
    var lblRightCounterOnline = $("#lblRightCounter_" + equipment + "_Online");
    var TrackInQtyOnline = lblRightCounterOnline.text();
    var lblRightCounterOffline = $("#lblRightCounter_" + equipment + "_Offline");
    var TrackInQtyOffline = lblRightCounterOffline.text();
    var lblRightCounterIdle = $("#lblRightCounter_" + equipment + "_Idle");
    var TrackInQtyIdle = lblRightCounterIdle.text();
    var ProgressBarWarning = $("#ProgressBar_" + equipment + "_Warning");
    var ProgressBarOnline = $("#ProgressBar_" + equipment + "_Online");
    var ProgressBarOffline = $("#ProgressBar_" + equipment + "_Offline");
    var ProgressBarIdle = $("#ProgressBar_" + equipment + "_Idle");

    lblLeftCounterWarning.text(processQty);
    lblLeftCounterOnline.text(processQty);
    lblLeftCounterOffline.text(processQty);
    lblLeftCounterIdle.text(processQty);
   
    var trackInQty = TrackInQtyOnline;
    var percentage = (parseFloat(processQty) / parseFloat(trackInQty)) * 100;
    
    var ProcessingText = "";
    if (percentage >= 100)
    {
        ProcessingText = "Done Processing:";
    }
    else
    {
        ProcessingText = "Processing:";
    }
    
    ProgressBarWarning.css({ "width": percentage.toString() + "%" });
    ProgressBarOnline.css({ "width": percentage.toString() + "%" });
    ProgressBarOffline.css({ "width": percentage.toString() + "%" });
    ProgressBarIdle.css({ "width": percentage.toString() + "%" });

    var lblProcessWarning = $("#lblProcess_" + equipment + "_Warning");
    var lblProcessOnline = $("#lblProcess_" + equipment + "_Online");
    var lblProcessOffline = $("#lblProcess_" + equipment + "_Offline");
    var lblProcessIdle = $("#lblProcess_" + equipment + "_Idle");

    lblProcessOnline.text(ProcessingText);
    lblProcessOnline.append("&nbsp;");

    var lblBrandedQtyWarning = $("#lblBranded_" + equipment + "_Warning");
    var lblBrandedQtyOnline = $("#lblBranded_" + equipment + "_Online");
    var lblBrandedQtyOffline = $("#lblBranded_" + equipment + "_Offline");
    var lblBrandedQtyIdle = $("#lblBranded_" + equipment + "_Idle");

    lblBrandedQtyWarning.text(brandedQty);
    lblBrandedQtyOnline.text(brandedQty);
    lblBrandedQtyOffline.text(brandedQty);
    lblBrandedQtyIdle.text(brandedQty);

    var lblUnbrandedQtyWarning = $("#lblUnbranded_" + equipment + "_Warning");
    var lblUnbrandedQtyOnline = $("#lblUnbranded_" + equipment + "_Online");
    var lblUnbrandedQtyOffline = $("#lblUnbranded_" + equipment + "_Offline");
    var lblUnbrandedQtyIdle = $("#lblUnbranded_" + equipment + "_Idle");

    lblUnbrandedQtyWarning.text(unbrandedQty);
    lblUnbrandedQtyOnline.text(unbrandedQty);
    lblUnbrandedQtyOffline.text(unbrandedQty);
    lblUnbrandedQtyIdle.text(unbrandedQty);

}

//this function is used to dynamically build html for equipment alarms
function SetAlarm(equipment)
{
    try
    {
        var onlineCount = "lblAlarm_" + equipment + "_Online";
        var offlineCount = "lblAlarm_" + equipment + "_Offline";
        var idleCount = "lblAlarm_" + equipment + "_Idle";
        var warningCount = "lblAlarm_" + equipment + "_Warning";

        var divOffline = "divAlarm_" + equipment + "_Offline";
        var divOnline = "divAlarm_" + equipment + "_Online"
        var divIdle = "divAlarm_" + equipment + "_Idle"
        var divWarning = "divAlarm_" + equipment + "_Warning"

        var count1 = $("#" + onlineCount).text();
        var txtcount1 = "";
        count1 = count1.replace('+', '');

        try {
            count1 = parseInt(count1);
        }
        catch (e) {
            count1 = 0;
        }
        count1++;

        if (count1 > 999) {
            txtcount1 = count1 + "+";
        }
        else {
            txtcount1 = count1;
        }

        var count2 = $("#" + offlineCount).text();
        var txtcount2 = "";
        count2 = count2.replace('+', '');
        try {
            count2 = parseInt(count2);
        }
        catch (e) {
            count2 = 0;
        }
        count2++;

        if (count2 > 999) {
            txtcount2 = count2 + "+";
        }
        else {
            txtcount2 = count2;
        }

        var count3 = $("#" + idleCount).text();
        var txtcount3 = "";
        count3 = count3.replace('+', '');
        try {
            count3 = parseInt(count3);
        }
        catch (e) {
            count3 = 0;
        }
        count3++;

        if (count3 > 999) {
            txtcount3 = count3 + "+";
        }
        else {
            txtcount3 = count3;
        }

        var count4 = $("#" + warningCount).text();
        var txtcount4 = "";
        count4 = count4.replace('+', '');
        try {
            count4 = parseInt(count4);
        }
        catch (e) {
            count4 = 0;
        }
        count4++;

        if (count4 > 999) {
            txtcount4 = count4 + "+";
        }
        else {
            txtcount4 = count4;
        }

        $("#" + onlineCount).text(txtcount1);
        if (parseInt(txtcount1) == 0) {
            $('#' + divOnline).hide();
        }
        else {
            $('#' + divOnline).show();
        }

        $("#" + offlineCount).text(txtcount2);
        if (parseInt(txtcount2) == 0) {
            $('#' + divOffline).hide();
        }
        else {
            $('#' + divOffline).show();
        }

        $("#" + idleCount).text(txtcount3);
        if (parseInt(txtcount3) == 0) {
            $('#' + divIdle).hide();
        }
        else {
            $('#' + divIdle).show();
        }

        $("#" + warningCount).text(txtcount4);
        if (parseInt(txtcount4) == 0) {
            $('#' + divWarning).hide();
        }
        else {
            $('#' + divWarning).show();
        }
    }
    catch (e) { }
}

function SetAlarmRead(equipment) {
    try {

        var onlineCount = "lblAlarm_" + equipment + "_Online";
        var offlineCount = "lblAlarm_" + equipment + "_Offline";
        var idleCount = "lblAlarm_" + equipment + "_Idle";
        var warningCount = "lblAlarm_" + equipment + "_Warning";

        var divOffline = "divAlarm_" + equipment + "_Offline";
        var divOnline = "divAlarm_" + equipment + "_Online"
        var divIdle = "divAlarm_" + equipment + "_Idle"
        var divWarning = "divAlarm_" + equipment + "_Warning"

        var count1 = $("#" + onlineCount).text();
        var txtcount1 = "";
        count1 = count1.replace('+', '');
        try {
            count1 = parseInt(count1);
        }
        catch (e) {
            count1 = 0;
        }
        count1--;

        if (count1 > 999) {
            txtcount1 = count1 + "+";
        }
        else {
            txtcount1 = count1;
        }

        var count2 = $("#" + offlineCount).text();
        var txtcount2 = "";
        count2 = count2.replace('+', '');
        try {
            count2 = parseInt(count2);
        }
        catch (e) {
            count2 = 0;
        }
        count2--;

        if (count2 > 999) {
            txtcount2 = count2 + "+";
        }
        else {
            txtcount2 = count2;
        }

        var count3 = $("#" + idleCount).text();
        var txtcount3 = "";
        count3 = count3.replace('+', '');
        try {
            count3 = parseInt(count3);
        }
        catch (e) {
            count3 = 0;
        }
        count3--;

        if (count3 > 999) {
            txtcount3 = count3 + "+";
        }
        else {
            txtcount3 = count3;
        }

        var count4 = $("#" + warningCount).text();
        var txtcount4 = "";
        count4 = count4.replace('+', '');
        try {
            count4 = parseInt(count4);
        }
        catch (e) {
            count4 = 0;
        }
        count4--;

        if (count4 > 999) {
            txtcount4 = count4 + "+";
        }
        else {
            txtcount4 = count4;
        }

        $("#" + onlineCount).text(txtcount1);
        if (parseInt(txtcount1) == 0) {
            $('#' + divOnline).hide();
        }
        else {
            $('#' + divOnline).show();
        }

        $("#" + offlineCount).text(txtcount2);
        if (parseInt(txtcount2) == 0) {
            $('#' + divOffline).hide();
        }
        else {
            $('#' + divOffline).show();
        }

        $("#" + idleCount).text(txtcount3);
        if (parseInt(txtcount3) == 0) {
            $('#' + divIdle).hide();
        }
        else {
            $('#' + divIdle).show();
        }

        $("#" + warningCount).text(txtcount4);
        if (parseInt(txtcount4) == 0) {
            $('#' + divWarning).hide();
        }
        else {
            $('#' + divWarning).show();
        }
    }
    catch (e) { }
}

function SetAlarmTCP(equipment) {
    try {
        var onlineCount = "lblAlarm_" + equipment + "_Online";
        var offlineCount = "lblAlarm_" + equipment + "_Offline";
        var idleCount = "lblAlarm_" + equipment + "_Idle";
        var warningCount = "lblAlarm_" + equipment + "_Warning";

        var divOffline = "divAlarm_" + equipment + "_Offline";
        var divOnline = "divAlarm_" + equipment + "_Online"
        var divIdle = "divAlarm_" + equipment + "_Idle"
        var divWarning = "divAlarm_" + equipment + "_Warning"

        var count1 = $("#" + onlineCount).text();
        var txtcount1 = "";
        count1 = count1.replace('+', '');
        try {
            count1 = parseInt(count1);
        }
        catch (e) {
            count1 = 0;
        }
        count1++;

        if (count1 > 999) {
            txtcount1 = count1 + "+";
        }
        else {
            txtcount1 = count1;
        }

        var count2 = $("#" + offlineCount).text();
        var txtcount2 = "";
        count2 = count2.replace('+', '');
        try {
            count2 = parseInt(count2);
        }
        catch (e) {
            count2 = 0;
        }
        count2++;

        if (count2 > 999) {
            txtcount2 = count2 + "+";
        }
        else {
            txtcount2 = count2;
        }

        var count3 = $("#" + idleCount).text();
        var txtcount3 = "";
        count3 = count3.replace('+', '');
        try {
            count3 = parseInt(count3);
        }
        catch (e) {
            count3 = 0;
        }
        count3++;

        if (count3 > 999) {
            txtcount3 = count3 + "+";
        }
        else {
            txtcount3 = count3;
        }

        var count4 = $("#" + warningCount).text();
        var txtcount4 = "";
        count4 = count4.replace('+', '');
        try {
            count4 = parseInt(count4);
        }
        catch (e) {
            count4 = 0;
        }
        count4++;

        if (count4 > 999) {
            txtcount4 = count4 + "+";
        }
        else {
            txtcount4 = count4;
        }

        $("#" + onlineCount).text(txtcount1);
        if (parseInt(txtcount1) == 0) {
            $('#' + divOnline).hide();
        }
        else {
            $('#' + divOnline).show();
        }

        $("#" + offlineCount).text(txtcount2);
        if (parseInt(txtcount2) == 0) {
            $('#' + divOffline).hide();
        }
        else {
            $('#' + divOffline).show();
        }

        $("#" + idleCount).text(txtcount3);
        if (parseInt(txtcount3) == 0) {
            $('#' + divIdle).hide();
        }
        else {
            $('#' + divIdle).show();
        }

        $("#" + warningCount).text(txtcount4);
        if (parseInt(txtcount4) == 0) {
            $('#' + divWarning).hide();
        }
        else {
            $('#' + divWarning).show();
        }
    }
    catch (e) { }
}

function SetAlarmTCPRead(equipment) {
    try {
        var onlineCount = "lblAlarm_" + equipment + "_Online";
        var offlineCount = "lblAlarm_" + equipment + "_Offline";
        var idleCount = "lblAlarm_" + equipment + "_Idle";
        var warningCount = "lblAlarm_" + equipment + "_Warning";

        var divOffline = "divAlarm_" + equipment + "_Offline";
        var divOnline = "divAlarm_" + equipment + "_Online"
        var divIdle = "divAlarm_" + equipment + "_Idle"
        var divWarning = "divAlarm_" + equipment + "_Warning"

        var count1 = $("#" + onlineCount).text();
        var txtcount1 = "";
        count1 = count1.replace('+', '');
        try {
            count1 = parseInt(count1);
        }
        catch (e) {
            count1 = 0;
        }
        count1--;

        if (count1 > 999) {
            txtcount1 = count1 + "+";
        }
        else {
            txtcount1 = count1;
        }

        var count2 = $("#" + offlineCount).text();
        var txtcount2 = "";
        count2 = count2.replace('+', '');
        try {
            count2 = parseInt(count2);
        }
        catch (e) {
            count2 = 0;
        }
        count2--;

        if (count2 > 999) {
            txtcount2 = count2 + "+";
        }
        else {
            txtcount2 = count2;
        }

        var count3 = $("#" + idleCount).text();
        var txtcount3 = "";
        count3 = count3.replace('+', '');
        try {
            count3 = parseInt(count3);
        }
        catch (e) {
            count3 = 0;
        }
        count3--;

        if (count3 > 999) {
            txtcount3 = count3 + "+";
        }
        else {
            txtcount3 = count3;
        }

        var count4 = $("#" + warningCount).text();
        var txtcount4 = "";
        count4 = count4.replace('+', '');
        try {
            count4 = parseInt(count4);
        }
        catch (e) {
            count4 = 0;
        }
        count4--;

        if (count4 > 999) {
            txtcount4 = count4 + "+";
        }
        else {
            txtcount4 = count4;
        }

        $("#" + onlineCount).text(txtcount1);
        if (parseInt(txtcount1) == 0) {
            $('#' + divOnline).hide();
        }
        else
        {
            $('#' + divOnline).show();
        }

        $("#" + offlineCount).text(txtcount2);
        if (parseInt(txtcount2) == 0) {
            $('#' + divOffline).hide();
        }
        else {
            $('#' + divOffline).show();
        }

        $("#" + idleCount).text(txtcount3);
        if (parseInt(txtcount3) == 0) {
            $('#' + divIdle).hide();
        }
        else {
            $('#' + divIdle).show();
        }

        $("#" + warningCount).text(txtcount4);
        if (parseInt(txtcount4) == 0) {
            $('#' + divWarning).hide();
        }
        else {
            $('#' + divWarning).show();
        }
    }
    catch (e) { }
}

//this function is used to dynamically build html for changing equipment status
function SetStatus(id, status) {

    try
    {
        var online = "divEquipment_" + id + "_Online";
        var offline = "divEquipment_" + id + "_Offline";
        var idle = "divEquipment_" + id + "_Idle";
        var warning = "divEquipment_" + id + "_Warning";

        if (status.toUpperCase() == "ONLINE") {
            show(online);
            hide(idle);
            hide(offline);
            hide(warning);
        }
        else if (status.toUpperCase() == "OFFLINE") {
            show(offline);
            hide(online);
            hide(idle);
            hide(warning);
        }
        else if (status.toUpperCase() == "IDLE") {
            show(idle);
            hide(online);
            hide(offline);
            hide(warning);
        }
        else if (status.toUpperCase() == "WARNING") {
            show(warning);
            hide(online);
            hide(offline);
            hide(idle);
        }

    } catch (e) { }
}


