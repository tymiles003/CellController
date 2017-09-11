var confirm_branded2 = 0;
var identifier = 1;

function Init()
{
    var isSignalR;

    //get the cookie
    try {
        isSignalR = getCookie("isSignalR");
    }
    catch (e) {
        isSignalR = "False";
    }

    try {
        if (isSignalR == "True") {
            var hubUrl = getCookie("SignalRHub");
            $.connection.hub.url = hubUrl;

            // Declare a proxy to reference the hub.
            var hub = $.connection.MessagesHub;

            // Start the connection.
            $.connection.hub.start().done(function () {

            }).fail(function (e) {
                if (isSignalR == "True") {
                    notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
                    identifier++;
                }
            });

            //signalr update for machine status
            //hub.client.MachineStatus = function (equip, status) {
            //    SetStatus(equip, status);
            //};

            //signalr update for alarms
            //hub.client.Alarm = function (messageId, user, equip, message, readNotification, transactionId) {
            //    SetAlarm(equip, user);
            //};

            hub.client.TCPListen = function (equip, type, message) {

                var username = getCookie("Username");

                $.ajax({
                    url: '/Listener/GetEquipmentForUser',
                    data: { username: username },
                    method: 'GET'
                }).success(function (result) {

                    if (result.includes(equip)) {

                        if (message.includes("ACTUAL_QTY"))
                        {
                            if (parseInt(getCookie(equip + "_isTrigger")) == 1)
                            {
                                var count = message.replace("ACTUAL_QTY", "").replace("=", "").replace(";", "").replace("<C>", "").replace("</C>", "").replace("<c>", "").replace("</c>", "");

                                setCookie(equip + "_isTrigger", 0, 30);

                                if (document.location.href.includes("/TrackIn"))
                                {
                                    $('#' + getCookie(equip + "_parentModal")).modal("hide");
                                    notification_modal_confirm_LM_prompt(equip, type, count);
                                }
                            }
                        }
                    }
                });
            };

            //signalr update for recipe
            //hub.client.Recipe = function (equip, recipeFilePath) {
            //    var equipments = getCookie("Equipments");
            //    var check = equipments.includes(equip);
            //    if (check == true) {
            //        notification_modal_dynamic("Recipe Uploaded", "A recipe file has been uploaded for Equipment: " + equip + " at Server (" + recipeFilePath + ")", "success", identifier);
            //        identifier++;
            //    }
            //};
        }
    }
    catch (e) {
        if (isSignalR == "True") {
            notification_modal_signalr("SignalR Error", "Can't connect to SignalR Server", "danger", identifier);
            identifier++;
        }
    }
}

function notification_modal_confirm_LM_prompt(equipment, type, quantity) {

    confirm_branded2 = 0;

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Job Process Ended for " + equipment + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Processed Quantity: " + quantity;
    modal += '<div>&nbsp</div>';
    modal += '<div><label for="txtBrandedQuantity">Branded Quantity:</label><input type="text" class="form-control" id="txtBrandedQuantity" placeholder="Branded Quantity"></div><br />';
    modal += '<div><label for="txtBrandedToleranceQuantity">Branded Tolerance Quantity <label id="lblBrandedTolerancePercent"></label>:</label><div class="input-group"><input type="text" class="form-control" id="txtBrandedToleranceQuantity" disabled="disabled" placeholder="Tolerance Quantity"><span class="input-group-btn" title="Tolerance" data-toggle="tooltip"><button class="btn btn-default" type="button" disabled="disabled"><span style="font-weight:bold;">&plusmn;</span></button></span></div></div>';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="notification_modal_confirm_branded_prompt(' + "'" + equipment + "'" + "," + "'" + type + "'" + ');">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    var js = "$('#txtBrandedQuantity').keypress(function (event) {var keycode = (event.keyCode ? event.keyCode : event.which);if (keycode == 13) {setToleranceBranded();}});";
    var js2 = "$('#txtBrandedQuantity').keydown(function (e) {if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||(e.keyCode >= 35 && e.keyCode <= 40)) {return;}if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {e.preventDefault();}});";
    var js3 = "$('#txtBrandedQuantity').blur(function () {if($('#txtBrandedQuantity').val() == '' || $('#txtBrandedQuantity').val().trim() == ''){$('#txtBrandedToleranceQuantity').val('0');setTolerancePercent('lblBrandedTolerancePercent');return;}else{setToleranceBranded();}});";
    var js4 = "setTolerancePercent('lblBrandedTolerancePercent');";
    var js5 = "$('[data-toggle=" + '"' + 'tooltip' + '"' + "]').tooltip();";
    var js6 = "$('#txtBrandedQuantity').on('input', function() {if($('#txtBrandedQuantity').val() == '' || $('#txtBrandedQuantity').val().trim() == ''){$('#txtBrandedToleranceQuantity').val('0');setTolerancePercent('lblBrandedTolerancePercent');return;}else{setToleranceBranded();}});";
    var js7 = "$('#txtBrandedQuantity').val('0');$('#txtBrandedToleranceQuantity').val('0');";
    modal += '$(document).ready(function (e){ ' + js + js2 + js3 + js4 + js5 + js6 + js7 + '});';
    modal += '</script>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//notification modal for confirmation of branded quantity for laser mark test
function notification_modal_confirm_branded_prompt(equipment, type) {

    if ($('#txtBrandedQuantity').val() == null || $('#txtBrandedQuantity').val() == "") {
        notification_modal_dynamic_super("Notification", "Branded Quantity is required", 'danger', 'modal_div', identifier);
        identifier++;
        return;
    }

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div_branded" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
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
    modal += '<button type="button" class="btn btn-success" onclick="proceed(' + "'" + equipment + "'" + "," + "'" + type + "'" + ');">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#modal_div").modal("hide");
    $("#notification_modal2").html(modal);
    $("#modal_div_branded").modal("show");
    $("#modal_div_branded").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div_branded").on("hidden.bs.modal", function () {
        if (confirm_branded2 == 0) {
            $("#modal_div").modal("show");
        }
        else {
            $("#modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        confirm_branded2 = 0;

    });

}

function proceed(equipment, type) {

    confirm_branded2 = 1;

    $('#modal_div_branded').modal("hide");

    var command = "";
    
    command += "TTYPE=" + getCookie(equipment + "_tempTType") + ";";
    command += "LOT=" + getCookie(equipment + "_tempLOT") + ";";
    command += "PRODUCT=" + getCookie(equipment + "_tempProd") + ";";
    command += "PARTNUM=" + getCookie(equipment + "_tempPartNo") + ";";

    var tempQuantity = $('#txtBrandedQuantity').val();
    command += "QUANTITY=" + tempQuantity + ";";

    var tempTolerance = $('#txtBrandedToleranceQuantity').val();
    command += "TOLERANCE=" + tempTolerance + ";";

    var markReq = "";
    if (tempQuantity == 0) {
        markReq = "YES";
    }
    else {
        markReq = "NO";
    }

    command += "MARKREQ=" + markReq + ";";

    if (markReq.toUpperCase() == "YES") {
        command += "TEMPLATE=" + getCookie(equipment + "_tempTemplate") + ";";

    }
    else {
        command += "TEMPLATE=" + getCookie(equipment + "_tempNoMarkTemplate") + ";";
    }

    command += "PKG_TEMP=" + getCookie(equipment + "_tempPKGTemp") + ";";
    command += "NUMLINE=" + getCookie(equipment + "_tempNumLine") + ";";

    if (getCookie(equipment + "_tempLine") != "" && getCookie(equipment + "_tempLine") != null)
    {
        command += getCookie(equipment + "_tempLine");
    }

    var temp_identifier = 0;

    $.ajax({
        url: '/TrackIn/OPCSendCommand',
        data: { Equipment: equipment, Command: command, Type: type },
        method: 'POST',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Processing Request. Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (opcResult) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");
        $("#btnTrackIn").removeAttr("disabled");

        if (opcResult != null) {

            //for forcing command success (testing)
            //opcResult.Error = false;

            if (opcResult.Error == false) {
                label = 'Send Command to Machine:&nbsp;<label style="color:green;">Success</label>';
                notification_modal_dynamic("Notification", label, 'success', identifier);
                identifier++;
            }
            else {
                label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';

                setCookie(equipment + "_parentModal", "modal_div" + identifier, 30);

                if (tempQuantity == 0)
                {
                    setCookie(equipment + "_isTrigger", 0, 30);
                }
                else
                {   
                    setCookie(equipment + "_isTrigger", 1, 30);
                }

                notification_modal_dynamic("Notification", label, 'warning', identifier);
                identifier++;
            }
        }
        else {
            label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
            notification_modal_dynamic("Notification", label, 'warning', identifier);
            identifier++;
        }

    }).error(function (xhr, status, error) {
        $("#btnTrackIn").removeAttr("disabled");
        label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
        notification_modal_dynamic("Notification", label, 'warning', identifier);
        identifier++;
    });

}

function setTolerancePercent(labelName) {
    $.ajax({
        url: '/Listener/GetTolerancePercent',
        method: 'GET'
    }).success(function (val) {
        $('#' + labelName).text("(" + val + "%)");

    });
}

//setting the branded tolerance
function setToleranceBranded() {

    if ($("#txtBrandedQuantity").val() != null && $("#txtBrandedQuantity").val() != "") {
        $.ajax({
            url: '/Listener/GetTolerance',
            data: { quantity: $("#txtBrandedQuantity").val() },
            method: 'GET'
        }).success(function (val) {

            $("#txtBrandedToleranceQuantity").val(val);

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Invalid Quantity", 'danger', 'modal_div', identifier);
            identifier++;
            $("#txtBrandedQuantity").val(0);
            $("#txtBrandedToleranceQuantity").val(0);
        });
    }
    else {

        //$("#txtBrandedQuantity").val(0);
        $("#txtBrandedToleranceQuantity").val(0);
    }

    setTolerancePercent('lblBrandedTolerancePercent');
}



Init();

//var myVar = null;

//function startListen()
//{
//    var username = getCookie("Username");

//    $.ajax({
//        url: '/Listener/GetEquipmentForUser',
//        data: { username: username },
//        method: 'GET'
//    }).success(function (result) {

//        alert(result);

//        //if (result.Error == false) {
//        //    alert(result.Result);
//        //}
//    });

//    //alert(equipment + "/" + port);

//    //myVar = setInterval(function ()
//    //{

//    //    //clearInterval(myVar);
//    //}, 5000);

//}

//function call()
//{
//    $.ajax({
//        url: '/Listener/ListenToMachine',
//        data: { Equipment: equipment },
//        method: 'GET'
//    }).success(function (result) {

//        if (result.Error == false) {
//            alert(result.Result);
//        }
//    });
//}

//function stopListen()
//{
//    clearInterval(myVar);
//}


//startListen();