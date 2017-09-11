var identifier = 1;
var random = "";
var global_type = "";
var equipmentQueryString = "";
var processQueryString = "";
var userQueryString = "";
var confirm_branded = 0;
var confirm_branded2 = 0;
var isTemplate = false;
var global_lotNumber = "";
var global_old_type = "";
var lotQueryString = "";
var oldNumLine = "";
var newNumLine = "";
var tolerance_percent = null;
var fromLoadTemplate = null;
var obj_recipe = [];
var loadedEquip = null;
var loadedTemplate = null;
var lstLoadedRecipe = [];
var lstLoadedEquip = [];
var globalBase64 = null;
var globalIsCustomRecipe = null;
var globalSize = null;
var globalPPID = null;

$(document).ready(function (e) {
    
    $.ajax({
        url: '/Engineer/GetTolerancePercent',
        method: 'GET'
    }).success(function (percentage)
    {
        tolerance_percent = percentage;

        if (tolerance_percent != null) {
            equipmentQueryString = getParameterByName("Equipment");
            lotQueryString = getParameterByName("Lot");
            userQueryString = getParameterByName("UserID");
            processQueryString = getParameterByName("Process");

            $('#divTolerance').hide();
            $("#txtQuantity").val("0");

            $('#txtLotNumber').keypress(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13) {
                    ProcessLot();
                }
            });

            //for barcode
            $("#txtLotNumber").codeScanner({
                onScan: function ($element, code) {

                    $("#txtLotNumber").val(code);
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

            //$('#txtLotNumber').blur(function (event) {
            //    ProcessLot();
            //});

            //textbox keypress handler
            $('#txtQuantity').keypress(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13) {
                    setTolerance();
                }
            });

            //textbox blur handler to set tolerance
            $('#txtQuantity').blur(function () {
                if ($('#txtQuantity').val() == '' || $('#txtQuantity').val().trim() == '') {
                    $('#txtToleranceQuantity').val('0');
                    setTolerancePercent('lblTolerancePercent');
                    return;
                }
                else {
                    setTolerance();
                }
            });

            $('#txtQuantity').on('input', function () {
                if ($('#txtQuantity').val() == '' || $('#txtQuantity').val().trim() == '') {
                    $('#txtToleranceQuantity').val('0');
                    setTolerancePercent('lblTolerancePercent');
                    return;
                }
                else {
                    setTolerance();
                }
            });

            //textbox keypress handler for enter
            $('#txtBrandedQuantity').keypress(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13) {
                    setToleranceBranded();
                }
            });

            //textbox blur handler to set branded tolerance
            $("#txtBrandedQuantity").blur(function () {
                setToleranceBranded();
            });

            var EmployeeNumber = getCookie("EmployeeNumber");

            if (EmployeeNumber.length > 4) {
                EmployeeNumber = EmployeeNumber.slice(-4);
                //$("#txtOperator").attr("disabled", "disabled");
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

            //disableQuantity();

            $("#txtToleranceQuantity").attr("disabled", "disabled");
            $("#txtBrandedToleranceQuantity").attr("disabled", "disabled");

            //make the textbox to accept only numbers
            $('#txtBrandedQuantity' + ',' + '#txtQuantity' + ',' + '#txtToleranceQuantity' + ',' + '#txtBrandedToleranceQuantity'
                + ',' + '#txtNumLine').keydown(function (e) {

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

            //button click handler
            $('#btnTrackIn').click(function () {

                TrackIn();
            });

            $('#btnTest').click(function () {

                var equip = 'SP-002_DEK';
                TestReport(equip);
            });

            

            //dropdown onchange handler
            $('#ddEquipment').change(function () {

                var equipmentID = $('#ddEquipment').val();

                $.ajax({
                    url: '/Engineer/GetEquipmentTypeJoin',
                    data: { ID: equipmentID },
                    method: 'GET'
                }).success(function (type) {

                    global_type = type.toUpperCase();

                    var divTolerance = $('#divTolerance');

                    if (global_type == "LASER MARK TEST") {
                        divTolerance.show();
                    }
                    else if (global_type == "") {
                        divTolerance.hide();
                        if (lotQueryString != null && lotQueryString != "")
                        {
                            ProcessLot();
                        }
                    }
                    else {
                        divTolerance.hide();
                    }

                    var lot = $('#txtLotNumber').val().trim().toUpperCase();
                    
                    if (lot != "" && lot != global_lotNumber) {
                        ProcessLot();
                    }
                    else if (lot != "" && global_type != global_old_type) {
                        ProcessLot();
                    }
                    else if (lot == global_lotNumber)
                    {
                        ProcessLot();
                    }
                });
            });

            //button click handler
            $('#btnCheckLot').click(function () {

                ProcessLot();
            });

            //button click handler
            $('#btnSend').click(function () {

                var msgID = getCookie("EquipmentNotificationMessageID_" + equipmentQueryString);
                notification_modal_brandedQuantity(msgID, true);
            });

            $('#btnEProcedure').click(function (event) {
                gotoEProc();
            });

            $('#btnWIPData').click(function (event) {
                gotoWIPData();
            });

            //for login override
            $('#btnUnlockQuantity').click(function () {
                var isDisabled = $('#txtQuantity').is(':disabled')

                var username = getCookie("Username");

                if (isDisabled == true) {
                    $.ajax({
                        url: '/Account/isSupervision',
                        data: { Username: username },
                        method: 'GET'
                    }).success(function (result) {

                        if (result == true) {
                            enableQuantity();
                        }
                        else {
                            notification_modal_unlockQuantity();
                        }

                    }).error(function (e) {
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                        identifier++;
                    });
                }
                else {
                    $.ajax({
                        url: '/Account/isSupervision',
                        data: { Username: username },
                        method: 'GET'
                    }).success(function (result) {

                        if (result == true) {
                            disableQuantity();
                        }
                        else {
                            notification_modal_unlockQuantity();
                        }

                    }).error(function (e) {
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                        identifier++;
                    });
                }
            });

            //$("#txtPartNo").attr("disabled", "disabled");
            //$("#txtMarkingLayout").attr("disabled", "disabled");
            //$("#txtPkgGroup").attr("disabled", "disabled");
            //$("#txtCASName").attr("disabled", "disabled");

            //$("#txtTType").attr("disabled", "disabled");
            //$("#txtTemplate").attr("disabled", "disabled");
            //$("#txtPkgTemp").attr("disabled", "disabled");
            //$("#txtNumLine").attr("disabled", "disabled");

            var ddCount = $('#ddEquipment > option').length;

            //if the url has query string select the equipment from dropdown
            //if (equipmentQueryString != null && equipmentQueryString != "") {
            //    $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
            //    $("#ddEquipment").trigger("change");
            //    $("#ddEquipment").attr("disabled", "disabled");
            //}
            //else
            //{
            //    if (ddCount > 1) {
            //        $("#ddEquipment").prop('selectedIndex', 1);
            //        $("#ddEquipment").trigger("change");
            //    }
            //}
            appendGroupEquipment();

            $('#spanEProc').hide();
            $('#spanWIPData').hide();

            var user = getCookie("Username");

            $.ajax({
                url: '/Engineer/getUserRights',
                data: { username: user },
                method: 'GET'
            }).success(function (result) {
                if (result != null) {
                    for (var x = 0; x < result.length; x++) {
                        if (result[x] == "EProcedure") {
                            //$('#spanEProc').show();

                        }
                        if (result[x] == "Data Collection") {
                            //$('#spanWIPData').show();
                        }
                    }
                }
            });

            setTolerancePercent('lblTolerancePercent');

            //$('#divLoadTemplate').hide();

            if (lotQueryString != null && lotQueryString != "") {

                $('#txtLotNumber').val(lotQueryString);

                if (processQueryString != null && processQueryString != "") {
                    if (processQueryString.toUpperCase() == "FROMINBOX") {
                        $('#txtLotNumber').attr("disabled", "disabled");
                        $('#btnUnlockQuantity').attr("disabled", "disabled");
                        $('#btnTrackIn').attr("disabled", "disabled");
                        $('#btnWIPData').attr("disabled", "disabled");
                        $('#btnEProcedure').attr("disabled", "disabled");
                        $('#divLoadTemplate').show();
                    }
                }
                else {
                    getLotInfo();
                    HideLoading();
                }
            }
            else {
                HideLoading();
            }
        }

    });

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

function getTrackedValues()
{
    $.ajax({
        url: '/Engineer/getTrackInQty',
        data: { equipment: $("#ddEquipment option:selected").text() },
        method: 'GET'
    }).success(function (TrackInCount) {

        $('#txtQuantity').val(TrackInCount);

        $.ajax({
            url: '/Engineer/GetTolerancePercent',
            method: 'GET'
        }).success(function (tolerancePercent) {
            var percent = tolerancePercent / 100;
            var val = TrackInCount * percent;
            val = Math.ceil(val);

            $('#txtToleranceQuantity').val(val);

            var msgID = getCookie("EquipmentNotificationMessageID_" + equipmentQueryString);
            notification_modal_brandedQuantity(msgID, false);

            HideLoading();

        }).error(function () {
            HideLoading();
            notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
            identifier++;
        });

    }).error(function () {
        HideLoading();
        notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
        identifier++;
    });
}

function gotoEProc()
{
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (index == 0) {
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
        url: '/Engineer/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/Engineer/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    notification_modal_confirm_eproc(equipment, lot);
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

//function for redirecting to wip data
function gotoWIPData() {
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (index == 0) {
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
        url: '/Engineer/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/Engineer/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    notification_modal_confirm_wipdata(equipment, lot);
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

function redirect_wipdata(equipment, lot) {
    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=Engineer" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=Engineer" + "&UserID=" + operator;
    }
}

function redirect(equipment, lot) {

    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=Engineer" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=Engineer" + "&UserID=" + operator;
    }
}

function LockDiv()
{
    $('#modal_div').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function SendCommand(msgID, isLoadTemplate)
{
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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedOPC(false, ' + "'" + msgID + "'," + isLoadTemplate.toString() + ');">OK</button>';
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
        if (confirm_branded == 0) {
            $("#modal_div").modal("show");
        }
        else {
            $("#modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        confirm_branded = 0;

    });
}

function notification_modal_brandedQuantity(msgID, isLoadTemplate) {

    confirm_branded = 0;

    if (msgID == null || msgID == "")
    {
        msgID = "asd";
    }

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Enter Branded Quantity" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    //modal += "You are about to Track In. Please enter Branded Quantity";
    //modal += '<div>&nbsp</div>';
    modal += '<div><label for="txtBrandedQuantity">Branded Quantity:</label><input type="text" class="form-control" id="txtBrandedQuantity" placeholder="Branded Quantity"></div><br />';
    modal += '<div><label for="txtBrandedToleranceQuantity">Branded Tolerance Quantity <label id="lblBrandedTolerancePercent"></label>:</label><div class="input-group"><input type="text" class="form-control" id="txtBrandedToleranceQuantity" disabled="disabled" placeholder="Tolerance Quantity"><span class="input-group-btn" title="Tolerance" data-toggle="tooltip"><button class="btn btn-default" type="button" disabled="disabled"><span style="font-weight:bold;">&plusmn;</span></button></span></div></div>';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="SendCommand(' + "'" + msgID + "'," + isLoadTemplate.toString() + ');">OK</button>';
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

//sample ajax callback
function callajax(param, callback)
{
    var equipmentID = $('#ddEquipment').val();

    $.ajax({
        url: '/Engineer/GetEquipmentTypeJoin',
        data: { ID: equipmentID },
        method: 'GET',
        success: callback
    });
}

function test(param) {
    callajax(param, doSomething);
}

function doSomething(data)
{
    alert(data);
}
//call test() to execute
//end of sample ajax callback

//function for analyzing lot number
function ProcessLot()
{
    if(processQueryString != null && processQueryString !="")
    {
        if (processQueryString.toUpperCase() == "FROMINBOX") {
            getLotInfo(function (output) {
                if (global_type == "LASER MARK TEST") {
                    getTemplateInfo();
                    getTrackedValues();
                    $('#divTemplateInfo').show();
                    $('#divRecipeInfo').hide();
                }
                else if (global_type == "") {
                    getRecipeInfo();
                    getTrackedValues();
                    $('#divTemplateInfo').hide();
                    $('#divRecipeInfo').show();
                }
                else {
                    $('#divTemplateInfo').hide();
                    $('#divRecipeInfo').hide();
                }
            });
        }
    }
    else
    {
        getLotInfo(function (output) {
            if (global_type == "LASER MARK TEST") {
                getTemplateInfo();
                $('#divTemplateInfo').show();
                $('#divRecipeInfo').hide();
            }
            else if (global_type == "") {
                getRecipeInfo();
                $('#divTemplateInfo').hide();
                $('#divRecipeInfo').show();
            }
            else {
                $('#divTemplateInfo').hide();
                $('#divRecipeInfo').hide();
            }
        });
    }
}

//S1F13 = Establish Communications Request
function InitSECSGEM(equipment) {

    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    //init and send S1F13
    $.ajax({
        url: '/SECSGEM/S1F13',
        data: { Equipment: equipment },
        method: 'GET',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Establishing Communication (S1F13)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {
            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //COMMACK Values:
                    //0 = Accepted. 
                    //1 = Denied, try again.

                    //COMMACK should always be 0 regardless of equipment
                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (COMMACK: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");


                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Establish Communication Request Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");
                    S1F17(equipment);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S1F17 = Request ONLINE
function S1F17(equipment) {

    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S1F17
    $.ajax({
        url: '/SECSGEM/S1F17',
        data: { Equipment: equipment },
        method: 'GET',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Requesting ON-LINE State (S1F17)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {
            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //ONLACK Values:
                    //DEK:
                    //0 = Accepted. 
                    //1 = Not allowed. 
                    //2 = Already On-Line.

                    //HELLER:
                    //0x00 OK. Equipment On-Line transition successful. Equipment Control State transits to either Local or Remote while On-Line as guided by the EC "GemOnlineSubstate".
                    //0x01 On-Line not allowed.
                    //0x02 Equipment already On-Line.

                    //PANASONIC:
                    //0x00 0 Accepted
                    //0x01 1 Not Allowed
                    //0x02 2 Already On-line

                    if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value != 2)) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (ONLACK: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Request ON-LINE Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    TriggerReport(equipment);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

function TestReport(equipment)
{
    var temp_identifier = 0;

    //Trigger Report
    $.ajax({
        url: '/SECSGEM/TriggerReports',
        data: { Equipment: equipment },
        method: 'POST',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Triggering Report... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) 
        {
            if (obj.length > 0) 
            {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var StreamFunction = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++)
                {
                    if (parseInt(obj[x].Value) != 0)
                    {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                        StreamFunction.push(obj[x].StreamFunction);
                    }
                }

                if (EquipmentInvalid.length > 0)
                {
                    alert('fail');
                }
                else
                {
                    alert('success');
                }
            }
        }
    });
}

//Trigger Report
function TriggerReport(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //Trigger Report
    $.ajax({
        url: '/SECSGEM/TriggerReports',
        data: { Equipment: equipment },
        method: 'POST',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Triggering Report... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var StreamFunction = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //DRACK Values:
                    //DEK:
                    //0 = Accepted. 
                    //1 = Denied, no space. 
                    //2 = Denied, bad format. 
                    //3 = Denied, RPTID exists already. 
                    //4 = Denied, unknown VID.

                    //HELLER:
                    //0x00 OK
                    //0x02 Denied. Invalid format.
                    //0x03 Denied. At least one RPTID already defined.
                    //0x04 Denied. At least one VID does not exist.

                    //PANASONIC:
                    //0 Accept
                    //1 Denied. Insufficient space.
                    //2 Denied. Invalid format.
                    //3 Denied. At least one RPTID already defined.
                    //4 Denied. At least one VID does not exist.

                    //LRACK Values:
                    //DEK:
                    //0 = Accepted. 
                    //1 = No Space. 
                    //2 = Invalid format. 
                    //3 = CEID link already exists. 
                    //4 = Undefined CEID. 
                    //5 = Undefined RPTID.

                    //HELLER:
                    //0x00 OK
                    //0x02 Denied. Invalid format.
                    //0x03 Denied. At least one CEID link already defined.
                    //0x04 Denied. At least one CEID does not exist.
                    //0x05 Denied. At least one RPTID does not exist.

                    //PANASONIC:
                    //0 Accepted
                    //1 Denied. Insufficient space.
                    //2 Denied. Invalid format.
                    //3 Denied. At least one CEID link already defined.
                    //4 Denied. At least one CEID does not exist.
                    //5 Denied. At least one RPTID does not exist.

                    //ERACK Values:
                    //DEK:
                    //0 = Accepted. 
                    //1 = Denied, unknown CEID.

                    //HELLER:
                    //0x00 OK
                    //0x02 Denied. At least one CEID does not exist.

                    //PANASONIC:
                    //0 Accepted
                    //1 Denied. At least one CEID does not exist.

                    //DRACK, LRACK, ERACK should always be 0 to ensure event/reports are initiated correctly

                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                        StreamFunction.push(obj[x].StreamFunction);
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {

                        if (StreamFunction[x] == "S2F33_DELETE_REPORT") {
                            tempArr.push(EquipmentInvalid[x] + " (Delete Report DRACK: " + ErrorCode[x] + ")");
                        }
                        else if (StreamFunction[x] == "S2F33_ADD_REPORT") {
                            tempArr.push(EquipmentInvalid[x] + " (Add Report DRACK: " + ErrorCode[x] + ")");
                        }
                        else if (StreamFunction[x] == "S2F35_UNLINK_COLLECTION") {
                            tempArr.push(EquipmentInvalid[x] + " (Unlink Collection LRACK: " + ErrorCode[x] + ")");
                        }
                        else if (StreamFunction[x] == "S2F35_LINK_COLLECTION") {
                            tempArr.push(EquipmentInvalid[x] + " (Link Collection LRACK: " + ErrorCode[x] + ")");
                        }
                        else if (StreamFunction[x] == "S2F37_DISABLE_COLLECTION") {
                            tempArr.push(EquipmentInvalid[x] + " (Disable Collection ERACK: " + ErrorCode[x] + ")");
                        }
                        else if (StreamFunction[x] == "S2F37_ENABLE_COLLECTION") {
                            tempArr.push(EquipmentInvalid[x] + " (Enable Collection ERACK: " + ErrorCode[x] + ")");
                        }
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Triggering Report Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    S7F17(equipment);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S7F17 = Process Program Delete
function S7F17(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S7F17
    $.ajax({
        url: '/SECSGEM/S7F17',
        data: { Equipment: equipment },
        method: 'GET',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Process Program Delete (S7F17)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = []
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //ACKC7 Values:
                    //DEK:
                    //0 = Done.
                    //1 = Permission denied.
                    //2 = Length error.
                    //4 = PPID not found. 
                    //6-63 = Reserved.
                    //64 = Process program parameter error.

                    //HELLER:
                    //0x00 = Normal. All specified PPIDs have been deleted.
                    //0x01 = Permission not granted.
                    //0x04 = At least one specified PPID was not found. However, correct PPIDs have been deleted from the Equipment Library
                    //0x05 = Mode not supported.

                    //PANASONIC:
                    //0 Accepted.
                    //1 Permission not granted.
                    //2 Length error.
                    //4 PPID not found.
                    //6 PPID and MID already exist.
                    //7 PPID and MID do not exist.

                    if (obj[x].EquipmentType.toUpperCase() == "DEK PRINTER") {
                        //Override the ACK7 (1 = permission denied) on dek printer since we cant delete the current loaded program
                        //which will always result in 1 (permission denied)
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 1) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (ACKC7: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Process Program Delete Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {

                    if (globalIsCustomRecipe == true)
                    {
                        S7F1_Custom(equipment);
                    }
                    else
                    {
                        S7F1(equipment);
                    }
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S7F1 = Process Program Load Inquire
function S7F1_Custom(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S7F1
    $.ajax({
        url: '/SECSGEM/S7F1_Custom',
        data: { Equipment: equipment, RecipeSize: globalSize, PPID: globalPPID },
        method: 'GET',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Process Program Load Grant (S7F1)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {


        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //PPGNT Values:
                    //DEK:
                    //0 = Permission granted. 
                    //1 = Already have. 
                    //2 = No space. 
                    //3 = Invalid PPID. 
                    //4 = Busy, try later. 
                    //5 = Will not accept. 
                    //6-63 Reserved

                    //HELLER:
                    //No documentation for S7F1 and PPGNT, however we tested the equipment to return 0 PPGNT

                    //PANASONIC:
                    //0x00 0 OK
                    //0x01 1 Already have
                    //0x02 2 No space
                    //0x03 3 Invalid PPID
                    //0x04 4 Busy, try later
                    //0x05 5 Will not accept
                    //0x40 64 PPID matches an

                    //PPGNT should always be 0 to allow S7F3 which is the next step 
                    //because if S7F1 fails, S7F3 will surely fail as well

                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (PPGNT: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Process Program Load Grant Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    S7F3_Custom(equipment);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S7F1 = Process Program Load Inquire
function S7F1(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S7F1
    $.ajax({
        url: '/SECSGEM/S7F1',
        data: { Equipment: equipment, LotNo: lotNo },
        method: 'GET',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Process Program Load Grant (S7F1)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {


        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //PPGNT Values:
                    //DEK:
                    //0 = Permission granted. 
                    //1 = Already have. 
                    //2 = No space. 
                    //3 = Invalid PPID. 
                    //4 = Busy, try later. 
                    //5 = Will not accept. 
                    //6-63 Reserved

                    //HELLER:
                    //No documentation for S7F1 and PPGNT, however we tested the equipment to return 0 PPGNT

                    //PANASONIC:
                    //0x00 0 OK
                    //0x01 1 Already have
                    //0x02 2 No space
                    //0x03 3 Invalid PPID
                    //0x04 4 Busy, try later
                    //0x05 5 Will not accept
                    //0x40 64 PPID matches an

                    //PPGNT should always be 0 to allow S7F3 which is the next step 
                    //because if S7F1 fails, S7F3 will surely fail as well

                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (PPGNT: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Process Program Load Grant Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    S7F3(equipment);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S7F3 = Process Program Send
function S7F3_Custom(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S7F3
    $.ajax({
        url: '/SECSGEM/S7F3_Custom',
        data: { Equipment: equipment, PPID: globalPPID, PPBODY: globalBase64 },
        method: 'POST',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Process Program Send (S7F3)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {


        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var lstEquip = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //ACKC7 Values:
                    //DEK:
                    //0 = Done.
                    //1 = Permission denied.
                    //2 = Length error.
                    //4 = PPID not found. 
                    //6-63 = Reserved.
                    //64 = Process program parameter error.

                    //HELLER:
                    //0x00 = Normal. Process Program Accepted and stored into Library.
                    //0x01 = Permission Not Granted. Insufficient space in Library.
                    //0x40 = Process Program Format Error.
                    //0x41 = Process Program Data Error (Verify Failed).

                    //PANASONIC:
                    //0 Accepted.
                    //1 Permission not granted.
                    //2 Length error.
                    //4 PPID not found.
                    //6 PPID and MID already exist.
                    //7 PPID and MID do not exist.

                    //ACKC7 should always be 0 to ensure that the recipe is properly loaded

                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }

                    lstEquip.push(obj[x].Equipment);
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (ACKC7: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Process Program Send Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    PPSELECT_Custom(lstEquip);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//S7F3 = Process Program Send
function S7F3(equipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;


    //send S7F3
    $.ajax({
        url: '/SECSGEM/S7F3',
        data: { Equipment: equipment, LotNo: lotNo },
        method: 'POST',
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'Process Program Send (S7F3)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {


        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {

            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var lstEquip = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //ACKC7 Values:
                    //DEK:
                    //0 = Done.
                    //1 = Permission denied.
                    //2 = Length error.
                    //4 = PPID not found. 
                    //6-63 = Reserved.
                    //64 = Process program parameter error.

                    //HELLER:
                    //0x00 = Normal. Process Program Accepted and stored into Library.
                    //0x01 = Permission Not Granted. Insufficient space in Library.
                    //0x40 = Process Program Format Error.
                    //0x41 = Process Program Data Error (Verify Failed).

                    //PANASONIC:
                    //0 Accepted.
                    //1 Permission not granted.
                    //2 Length error.
                    //4 PPID not found.
                    //6 PPID and MID already exist.
                    //7 PPID and MID do not exist.

                    //ACKC7 should always be 0 to ensure that the recipe is properly loaded

                    if (parseInt(obj[x].Value) != 0) {
                        EquipmentInvalid.push(obj[x].Equipment);
                        ErrorCode.push(obj[x].Value);
                    }

                    lstEquip.push(obj[x].Equipment);
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (ACKC7: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Process Program Send Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    
                    PPSELECT(lstEquip);
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//PPSELECT
function PPSELECT(lstEquipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S2F41 (PPSELECT)
    $.ajax({
        url: '/SECSGEM/PPSELECT',
        data: { lstEquipment: lstEquipment, LotNo: lotNo },
        method: 'GET',
        dataType: 'json',
        traditional: true,
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'PP-SELECT (S2F41)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {
            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //HCACK Values:
                    //DEK:
                    //0 = Command will be done. 
                    //1 = Unknown command. 
                    //2 = Cannot do now. 
                    //3 = Invalid parameter. 
                    //4 = Acknowledge, command will be performed with completion signalled by an event. 
                    //64 = Wrong control state. 65 = Wrong process state. 
                    //66 = Consumable not verified

                    //HELLER:
                    //0 = OK. All normal.
                    //1 = Invalid command. Equipment rejects command.
                    //2 = Cannot perform command. Equipment is not online remote.
                    //3 = At least one parameter is invalid. Equipment rejects the command.
                    //5 = Command rejected.

                    //PANASONIC:
                    //0 Acknowledged. Command has been performed.
                    //1 Command does not exist.
                    //2 Cannot perform now.
                    //3 At least one parameter is invalid.
                    //4 Acknowledged. Command will be performed with completion signaled later by an event.
                    //5 Rejected. Already in desired condition.
                    //64 Incorrect CONTROLSTATE. No such object exists.

                    if (obj[x].EquipmentType.toUpperCase() == "DEK PRINTER") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "PANASONIC COMPONENT ATTACH") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "HELLER OVEN") {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (HCACK: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "PP-SELECT Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {

                    START(lstEquipment);

                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//PPSELECT
function PPSELECT_Custom(lstEquipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S2F41 (PPSELECT)
    $.ajax({
        url: '/SECSGEM/PPSELECT_Custom',
        data: { lstEquipment: lstEquipment, PPID: globalPPID },
        method: 'GET',
        dataType: 'json',
        traditional: true,
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'PP-SELECT (S2F41)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {
            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //HCACK Values:
                    //DEK:
                    //0 = Command will be done. 
                    //1 = Unknown command. 
                    //2 = Cannot do now. 
                    //3 = Invalid parameter. 
                    //4 = Acknowledge, command will be performed with completion signalled by an event. 
                    //64 = Wrong control state. 65 = Wrong process state. 
                    //66 = Consumable not verified

                    //HELLER:
                    //0 = OK. All normal.
                    //1 = Invalid command. Equipment rejects command.
                    //2 = Cannot perform command. Equipment is not online remote.
                    //3 = At least one parameter is invalid. Equipment rejects the command.
                    //5 = Command rejected.

                    //PANASONIC:
                    //0 Acknowledged. Command has been performed.
                    //1 Command does not exist.
                    //2 Cannot perform now.
                    //3 At least one parameter is invalid.
                    //4 Acknowledged. Command will be performed with completion signaled later by an event.
                    //5 Rejected. Already in desired condition.
                    //64 Incorrect CONTROLSTATE. No such object exists.

                    if (obj[x].EquipmentType.toUpperCase() == "DEK PRINTER") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "PANASONIC COMPONENT ATTACH") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "HELLER OVEN") {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (HCACK: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "PP-SELECT Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {

                    START(lstEquipment);

                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

//START
function START(lstEquipment) {
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();
    var ID = $("#ddEquipment option:selected").val();

    var temp_identifier = 0;

    //send S2F41 (START)
    $.ajax({
        url: '/SECSGEM/START',
        data: { lstEquipment: lstEquipment },
        method: 'GET',
        dataType: 'json',
        traditional: true,
        beforeSend: function (xhr) {
            notification_modal_dynamic_loading("Notification", 'START (S2F41)... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (obj) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        if (obj != null) {
            if (obj.length > 0) {
                var EquipmentInvalid = [];
                var ErrorCode = [];
                var tempArr = [];
                for (var x = 0; x < obj.length; x++) {

                    //HCACK Values:
                    //DEK:
                    //0 = Command will be done. 
                    //1 = Unknown command. 
                    //2 = Cannot do now. 
                    //3 = Invalid parameter. 
                    //4 = Acknowledge, command will be performed with completion signalled by an event. 
                    //64 = Wrong control state. 65 = Wrong process state. 
                    //66 = Consumable not verified

                    //HELLER:
                    //0 = OK. All normal.
                    //1 = Invalid command. Equipment rejects command.
                    //2 = Cannot perform command. Equipment is not online remote.
                    //3 = At least one parameter is invalid. Equipment rejects the command.
                    //5 = Command rejected.

                    //PANASONIC:
                    //0 Acknowledged. Command has been performed.
                    //1 Command does not exist.
                    //2 Cannot perform now.
                    //3 At least one parameter is invalid.
                    //4 Acknowledged. Command will be performed with completion signaled later by an event.
                    //5 Rejected. Already in desired condition.
                    //64 Incorrect CONTROLSTATE. No such object exists.

                    if (obj[x].EquipmentType.toUpperCase() == "DEK PRINTER") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "PANASONIC COMPONENT ATTACH") {
                        if (parseInt(obj[x].Value) != 0 && parseInt(obj[x].Value) != 4) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else if (obj[x].EquipmentType.toUpperCase() == "HELLER OVEN") {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                    else {
                        if (parseInt(obj[x].Value) != 0) {
                            EquipmentInvalid.push(obj[x].Equipment);
                            ErrorCode.push(obj[x].Value);
                        }
                    }
                }

                if (EquipmentInvalid.length > 0) {

                    for (var x = 0; x < EquipmentInvalid.length; x++) {
                        tempArr.push(EquipmentInvalid[x] + " (HCACK: " + ErrorCode[x] + ")");
                    }

                    var str = tempArr.join(", ");

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "START Failed to Machine: " + str, 'danger', identifier);
                    identifier++;
                }
                else {
                    notification_modal_dynamic("Notification", "Recipe Succesfully Loaded", 'success', identifier);
                    identifier++;
                }
            }
            else {
                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
                identifier++;
            }
        }
        else {
            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
            identifier++;
        }

    }).error(function () {
        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        notification_modal_dynamic("Notification", "Cannot Communicate to Machine", 'danger', identifier);
        identifier++;

    });
}

function LoadRecipeIndividual(EquipID)
{
    var checkDefault = true;

    checkbox = $('#chkOverrideRecipe_' + EquipID);
    var isCheck = checkbox.is(':checked');

    globalBase64 = null;
    globalIsCustomRecipe = false;
    globalSize = null;
    globalPPID = null;

    if (isCheck == true)
    {
        var file = document.getElementById('fileRecipe_' + EquipID).files[0];

        if (file != undefined && file != null && file != 'undefined')
        {
            file.convertToBase64(function (base64) {
                base64 = base64.replace('data:;base64,', '');

                var name = document.getElementById('fileRecipe_' + EquipID).files[0].name;
                var size = document.getElementById('fileRecipe_' + EquipID).files[0].size;
                
                var temp = "";

                if (name.includes('.'))
                {
                    var arr = name.split('.');
                    for (var x = 0; x < arr.length; x++) {
                        temp = arr[x];
                    }

                    name = name.replace('.' + temp, '');
                }

                globalIsCustomRecipe = true;
                globalBase64 = base64;
                globalSize = size;
                globalPPID = name;

                InitSECSGEM(EquipID);

                //var test = 'UEsDBBQAAAAIAA9t+EqoZQgjOREAAACAAQAxAAAAQzpcT3ZlblxSZWNpcGUgRmlsZXNcUF9HVFMyX0dUUzNfVEVNUF9QUk9GSUxFLmpvYu2de2wc13XGv9ldLnf52KUoh5YVWloroqLKth60oiSKbS21JC2qfEikHqWdmOJTpEmRDB+KZbsWHceyE6CtgaJoU7t1EqAo1KJoA8Qp0qSwkbax0QeSFgGa9o86btICcaMUaJHASGptz7l37u7MznK1kbgzEX1+qzs7O+ee8907r9WZuTuEBQwsDc+ODS+MpY6OL6XaD/MivDwbHjkT//rJH1w+u5A+hBeffOn57DO/u+9vLvzFlb1fe+Pvf2/0X77/Vy91/uwzX+ud/9gPP/jH//7iT/e+vfM//6PhM2e+0Pr4gfC33/jiU/0bMx+Of/Ger7924aGxjU/sSv3zE5+Nbf2dd778o8svX/7upyaGfuvtb316+zNnv7H1/e3/9KNvjl/JVr/W+flHm+qu/ODukW+fiAL7d++FIAiCIAiCIAiCsDZYFuT1Ln5Z1ljSsveFEL6aPJ+EIAiCIAiCIAiCIAi/eGRvhJD1b7UcZHMEGIwCcTuoZQeexAwWaH5gA2qxASFAFVBVK6qrGhfnfJ2OFeZFFLkxV0EZYiqG2xBjQ0TpsmGjWlhDVZWhqsDQSIYIG6pzobRhM8WoYUMNzbg1rlrKQ5P3YNVaNtRTMKcHd1sZGiiYK9SibUiq/uYNHcYjQc1zeQxDtyqUE9eGMWpVnA3RXAdbtYdlN9fKeejmRkxz63gbFKxEFaqW1pbT8AhphNkQLliJvBkSyGAOs/QaxyiWqK/t1NglKiNUFmnpLfaScaq5QFM9n196EvPUDT1fg07aX4ZxljybaH5OeUzR51n00vJz9CmCLqofQTfOkzpPO/AoeS+QvUF97iG/MSxTpHHqJS85RtY50onlotSgD59QrV4gr2O0lJVmKQ5Hb0I/1eL5WUyQZ7fq41lsKlg+gEnVxiWKfAIXSGEcT1fzSrdCsLJZOgRm1XRKTe1/DWq/0zylpk+rj5azUsG/DWq3d/qYjas2MB9q/B6JWMaWI29TH/X62+Tps1kzcUT4gNGHGW91tWvH+HhU+3KCd1y189axRe2tNbzb6H2K+xZlUQiCIAiCIAiCsM4IWZcT/N5n6azD5JJmTIBhgFPzSC5haaSqG+0kxeT8EZ3gunNMTletYsknx1k1H4+7M1+dEmcpj42ijdLQHkp/OlUSN6kSwCk7YeWEsYESwxHKeXU6y4lRlNK8LkpXiyZpWcf8d2+J5nvznJqWSsS8SpI0CYIgCIIgCIIgCL+ghKz/quf3+pA72fXc/49RWh7L5f/voapNztyYQxW/XW3pe/5VhYMBaC6s73ybG/Xaowohc2vfbag2t/bzlxLsUFevWjV6+EDIYyh9jaHwfjx7NKKN8vkldV1hBMv27W6+ST2vbrgu0mtK3VCO5W53F97Irsndjt3nmG8tcs2Ab2Qv0Dtfx7CvUHjuPj+mphM0vS0KNRhhnDzyt5FzFNxG3uZR8/asCrdShE1yy1cQBEEQBEEQBGF9E7L+ro7f7w5fM/+vonyXc3gum6nqewvy/9VYdVyAPb69cFyAbfCOVrfT/yrPrwdy6b9V3JC/klBgiHp+oWAbNG5DgrLoUcr7ZyhzPkfZfw3l/QuUR/PogwRNnbYGLOIxNbTevcSZj29XS/rp04TK/nko96jK7J1+q9dyxmrO1ZpRQ/H19YlFTNLcfBnD05uj/LsBYmsHPqn6yz4R9vmfbPaloj63R3nAuCbvEy2psyXKg9GdPqsMg8/Zcr84KWLL4RmZUf66Ln8tyvURQRAEQRAEQRBuaixr0PyUGVvV8//2JX+Y+MPESOL2xHfqf7O+tz5e/9d1F+sO1v249s9qp2t31L5Z82LN6ZrGmn+IPxfPxK/GvhJbiu2JvVX9B7k4giAIgiCsGSmsAQ1YA2JYV0QgVIQQ1oI01oA0bpzC38ReDysQKsQK1oAVCII/pLEGpHFDRKyT9aueplMqvMXfkGn1if/3EFpvX//rmou/wZO+o+eOdh+dPj7NX2EJSy+cOv7w0XODYyPTpwcntCGkDVT3Ybuq8rcu9oyNDAyenL4zrEzKEtOWM9Pnp4/22LWr8svGuh863nNOL47kF0/OHZ8atGtH84u9TalmY0gZ+7rVkjAEQRAEQRAEQRCE6ydifXPV/D8UiTWk0iv8a3ThJuXiiroMTzn4ivrlBuXoK+qOB6XfK/xbCk61V/hp8CalN1l/yFwpCKsrA8+rcJKFC4IgCIIgCIIg3KRErCfrV8vp8vl/fgbCTYWd/zfVmZl6+0JAU619IaApYWaS9hWBpgYzs8G+NNAUNzM19jWCpoiZqTIzUfuqQRPsqwZN5vJBU8jMhO3rCE3VZkYGkwiCIAiCIAiCIPhCxEolJKkXBEEQBEEQBEEQhPUN5/9VEARBEARBEARBEARhPSP5vyAIgiAIgiAIgiCsfyT/FwRBEARBEARBEIT1j2W9WWce7x/Hy8mxZG3y1cR0ojnxWv1EvVUPQRAEQRAEQRCE9cIGfqw1P786aeErb4387Z5f+37avLM9gz70ohNdeAADGMIJtOEwutGBZ194pxpp3KrjHFGve12vg0ihFtk0iVSVElnpodAXsIh+jGMGw1jCFOYwS0smaW6e3i99th3e12EtwL2IlCVwHMsksUBBx1XQD8H7OpAPGi4raButpA4VrhXe1958uFBZ4fowgkeofaO0GspoI9FAgZOhkkHbKeizL+yG93WXq7u8MyTDRUOV2jj3wvs66Op4icDtKugwtXCYgukNsx/eV2s+oFUy4AkVbMYOVbLTIevtqNp/48AgzT2n92YWcNHbQpOW/OcGqkIlMhh11jJ/SSCCMBs4iOUwRGhFKAPvCCGHIUqfomwI5xbpaYx8lCECXYyhzmjwgVXlMDQYjSh0MYZGo1ENXYzhFhMqBl2MYZPxoHWjijFsNq2qgS7GsMUYaqGLMWwzhjroYgw7yGCxga+01DsMvOaURwK6GMMu8lCrXe0ADsNuE4q2iyqeUHywbHAYWk2oRuhiDAdMqI3QxRPqFuhiDAdNqPdAF2O434Rqgi6eUHwCvdVhOGxCbYIuxtBpQt0GXTyhNkMXYzhqQr0XuhhDrwnVDF08oW6HLsbQb0JtgS7GcMps2q3QxRgeNIYUdDGGh43hDuhiDCPGsA26GMOEMbwPuhjDI2bf3Q5djGGW9t1G15fXEE3bKWoXLTmGk/RFdgKDNNdhW4ZorpeW91CcPmUvXauBzqzjdN6ap5PhFOkt0bY6Rl8t4zjvsXBLJumkNEuWJXW2G6e13qOWLNN0htZPRp1UlyjCHH1upjYsqxg8TVFk/toapSnX2VxgbVNfFvq03ODxLFzS5VnSTi0sXNKJnfSFPqUicJtGlQ5/ASzgHM13kJY5ze4oWfOU6iF/8d7lqddDcQbo1UZbKL+O+2m+kw5oXfu0ijSr1uXZEq0op34f7UsT6ltmiQ7/4vVLtcn0tF1t52uvkWL1nG3YVVCvtHY3rbVytFev59Z21yu9LXTd8rfFteu7t0Xx+qXatNP2KWf/LFXTuX8W1iul3+yKwmtxGGPqfzGz9J7yHIf6GOej2/Su8Li8Vo12T43mgs9DrrW6xWN1n2WyWQiCIAjCuxDLGkua+RC+mjyf+yQIgiAIgiAIgiAIwpqQwhpwP24EyxqESfnvwKeTjckXEtsTf1J/oP6VuiN1/1j7YO33amZqfhx/Ml4dfz52W+wL1XdWfyl6X/QbVX1V34kMR94KL4b/L/RMKBH6bStlXUbFaPGsrSrHIIX5NuD1w3o+nXbWMj9uMHXNHzs0t3vthx+k3TGQtpB948tXtrbYt3SZ19u0Q16WacrYHmm8uqVdz8+3adn9hy37PWIv17Irr+RlnTG4mdk3/vy/SXYLTJvnPbKFvX09Y5Zr2ZQtmyoh6+ktQbJ8yzsAWb4FH4AsDwkIQJaHKAQgy0MmApDlIRwByPKQkgBkeYhLALI85CYAWR4CFIAsD0nSzhczXJRsaqVNh3HLvrl2sjxEyiOLPZWW5SFb9krOcNGyw5WW5SFkTtkQf3p1Z6Vl7eG4xEczXHRvj1RQ9pV3SJaH2HlkV05UUFb1Nv8Dy/nDXCyWTYdNxUr976IOprf7M1xC9icdpmK95SGR2rk/w0Wt5PTTlV7JPETTI1v545aHjGrn+zNcQv70loewemTPXKq0LA+p9exS6d5Ky/IQX48s/jStw1RM1h7PT+zKcNEnx2Sle8sOHtmVeKVluaJ25nNJk71tmystywGcspY/ezI7auefHuaiZHHkkA5TMVnGK/tYWoepkOxNlP+35T+keeJT/p9GjrR28EX2EAza6JNs/mqSr7L3weCr7L1w45PsR+Am5I/sQbjxqbcfhuGIY9t+ro3nKyj7oZxzKMOlVG/X7HTagg/CyNZluPgkewBufNq2H4Abn2T3w41PsvfAjU+yrXDjk+w+uLH8kd0LNz71dg/c+HRO3g03PvX2bhg+l9YOvsjeBYOvsnfC4KvsLhh8lf0l5EhrB19kd8KNT7LvhxufZHfAjU+yLXDjk+x2GFYOaQdfZN8Hgzb6JLsNBl9l70CONu3AoSr8/+SbKP8fgenlvGP9ILfEuX7W8F7TMAKRPYNAZIcQiOzDCET2YwhE9qMIRPYhBCL7IAKRHUQgsr+CQGRPIxDZUwhE9iQCkT2BQGQHEIhsPwKRPY5AZI8hENk+BCLbi0BkexCIbDfc+PQf+l+GG59kj8Lga7LWBTc+yR6BG59kH0Age3InApHtQCCy7QhEliMFIMtLfJe9ifL/p3Pzb/KO4deR/kkYfJV9CgZfZVdg0EafZC/C4KvskzD4KvurMPgq+wQMvso+Djc+yT4GNz7JXoAbn2QfhRufZD8BNz7Jnocbn2SX4cYn2SW48Ul2EW58kl2AG59kPw43PsnOw41PsnNw45PsbM6ZK5SWXbP/4rbgHAKRnUEgstMIRPYRBCI7hUBkJxGI7FkEIjuBQGTHEYjsGAKRHUUAspaVSJj8P5LL/yEIgiAIgiAIgiC8C2nBswVLfLpceAlufJJ9BgZfb71+CgYfZS3r0YSp2ogryX9Nvpb8UvLzyV9PPp6cTJ5MHk7uSTYn48mfJL6X+FbiLxN/JNcGBEEQBEEQBEEQhIoSUaksP3D40gt1qKGEtzpiZ7cJPJtfFPHW0jlx1Fkr5K0V8tYKexfxzfLs1aTTkRddpamjFtGQcIfXi1yxKGdPOmMl9SLLW4vDX/r9XK0wO2ZdjmGvY9jrGFJ/Mt5Ry7L+t7r7VJv6hZSFcAyCIAiCILwb6OlvVX+jYwUN6Mc4Po5lTGGB5sbU07UsZW1EBn3oRSe68ACGaNqOOCyL7Vn90Et+Atg2MvTiGE7iBL0Gaa7DrjxEc720vCfnpp4MaqnHpG2n2OxSpmOLcuQ/tdGAAWroEuYxR42epblcpbtVJf47OpsoGvfn/OqV3R2dxDCZB6jCMJXxfLV9qto2mjZTe7jSMk1nkCKnORVxgd5nijv0UWUW52mKmjROlUdp6mrIHuWQounmAoc2qrxE7WadomuiMH4ZlbrKqdRefDUVVurMV7tPVeNnG+7EEWpySm2AOeoAd2OGVtkCztF8B3VlGCO0JL+Osx9RzvyowB0lnU+pNb/s3DxtypWfl3mXx7WH1Abo1Ua7b37X6qd5R8MzKgA/XnS3HeC00ptV+8vZcpr/84XowwS9FtVumWuF/nE5P8C2dZUQZXXGuyLb1UGQup5tUMy1aOMPKVd+iueuAtefu9HdtOmus9Gru16z0W7Xshrt3Oba/YZ2m2uHuOZuUzxEWZ1xHrw6zHUevKWcr3HwFrqW1XDnudapxZtymL7MRsAn7LG8wweUAz/KMeU5eeozOp/L9corw6nrepzaV3dy9sddZaj4DnCPcthO0y0eh1W+n/4fUEsBAhQAFAAAAAgAD234SqhlCCM5EQAAAIABADEAAAAAAAAAAAAAAAAAAAAAAEM6XE92ZW5cUmVjaXBlIEZpbGVzXFBfR1RTMl9HVFMzX1RFTVBfUFJPRklMRS5qb2JQSwUGAAAAAAEAAQBfAAAAiBEAAAAA';
                //if (base64 == test)
                //{
                //    alert(1);
                //}
                //else
                //{
                //    alert(2);
                //}
            })
        }
        else
        {
            notification_modal_dynamic("Notification", "Please browse file", "danger", identifier);
            identifier++;
        }
    }
    else
    {
        globalBase64 = null;
        globalIsCustomRecipe = false;
        globalSize = null;
        globalPPID = null;
        InitSECSGEM(EquipID);
    }
}

function LoadRecipeIndividualNoResult(EquipID) {
    var checkDefault = true;

    globalBase64 = null;
    globalIsCustomRecipe = false;
    globalSize = null;
    globalPPID = null;

    var file = document.getElementById('fileRecipe_' + EquipID).files[0];

    if (file != undefined && file != null && file != 'undefined') {
        file.convertToBase64(function (base64) {
            base64 = base64.replace('data:;base64,', '');

            var name = document.getElementById('fileRecipe_' + EquipID).files[0].name;
            var size = document.getElementById('fileRecipe_' + EquipID).files[0].size;

            var temp = "";

            if (name.includes('.')) {
                var arr = name.split('.');
                for (var x = 0; x < arr.length; x++) {
                    temp = arr[x];
                }

                name = name.replace('.' + temp, '');
            }

            globalIsCustomRecipe = true;
            globalBase64 = base64;
            globalSize = size;
            globalPPID = name;

            InitSECSGEM(EquipID);
        })
    }
    else {
        notification_modal_dynamic("Notification", "Please browse file", "danger", identifier);
        identifier++;
    }
}

File.prototype.convertToBase64 = function (callback) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(this);
};

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        console.log(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


//getting the recipe info
function getRecipeInfo(callback) {
    
    obj_recipe = [];
    var lot = $("#txtLotNumber").val().trim().toUpperCase();
    var productName = $("#txtProductName").val();
    var EquipID = $("#ddEquipment option:selected").text();
    var ID = $("#ddEquipment option:selected").val();
    isRecipe = false;
    isTemplate = false;

    $('#divDynaRecipe').empty();

    loadedTemplate = null;
    lstLoadedRecipe = [];
    loadedEquip = null;
    lstLoadedEquip = [];

    //get the data first from RMS
    $.ajax({
        url: '/TrackIn/GetRecipeData',
        data: { productName: productName, EquipID: EquipID, ID: ID },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (val) {
       
        var lstGroup = [];
        var lstParameter = [];
        var lstMin = [];
        var lstMax = [];
        var lstValue = [];

        if (val != null) {
            if (val.length > 0) {
                var totalCount = val[0].Counter;

                var html = '';
                html = '<div id="divParameters">';
                $('#divDynaRecipe').append(html);

                for (var x = 0; x < val.length; x++) {

                    var EquipID = val[x].EquipID;
                    var RecipeName = val[x].RecipeName;
                    var RecipeID = val[x].RecipeID;

                    lstLoadedRecipe.push(RecipeName);
                    lstLoadedEquip.push(EquipID);

                    html = '<div id="divEquipParamRoot_' + EquipID + '">';
                    $('#divParameters').append(html);

                    if (val[x].GroupName.length > 0) {
                        html = '<label style="font-weight:bold;">Equipment: ' + EquipID + "<br/>Recipe: " + RecipeName + "<br/>Parameter Info:</label><br/><br/>";
                    }
                    else {
                        html = '<label style="font-weight:bold;">Equipment: ' + EquipID + "<br/>Recipe: " + RecipeName + "</label>";
                    }

                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<div id="divEquipParam_' + EquipID + '">';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    //html = '<button class="btn btn-info" id="btnLoadRecipe_' + EquipID + '" onclick="LoadRecipeIndividual(' + "'" + EquipID + "'" + ');"' + '>Load Recipe</button><br/><br/>';
                    //$('#divParameters').append(html);

                    var parent = $("#divEquipParam_" + EquipID);

                    var group = 0;

                    if (val[x].GroupName.length > 0) {
                        var groupMax = 0;
                        for (var y = 0; y < val[x].GroupName.length; y++) {
                            if (val[x].GroupName[y] != null && val[x].GroupName[y] != "") {
                                if (parseInt(val[x].GroupName[y]) > groupMax) {
                                    groupMax = parseInt(val[x].GroupName[y]);
                                }
                            }
                        }

                        for (var y = 0; y < val[x].GroupName.length; y++) {

                            var groupDiv;

                            if (parseInt(group) != parseInt(val[x].GroupName[y])) {
                                if (groupMax > 1) {
                                    html = '<div style="font-weight:bold" id="divGroup_' + val[x].GroupName[y] + '_' + EquipID + '">' + "<i>Group " + val[x].GroupName[y] + "</i>" + "</div><br/>";
                                }
                                else {
                                    html = '<div style="font-weight:bold" id="divGroup_' + val[x].GroupName[y] + '_' + EquipID + '">' + "</div><br/>";
                                }

                                $(parent).append(html);
                                groupDiv = $('#divGroup_' + val[x].GroupName[y] + '_' + EquipID);
                            }

                            var paramName = val[x].ParameterName[y];
                            var min = val[x].Min[y];
                            var max = val[x].Max[y];
                            var value = val[x].Value[y];

                            html = "<table><tr><td>Parameter:</td><td>&nbsp;</td><td>Min:</td><td>&nbsp;</td><td>Max:</td><td>&nbsp;</td><td>Value:</td></tr>";
                            html += '<tr>';
                            //html += '<td>' + '<input type="text" class="form-control" disabled="disabled" id="txtParam_' + RecipeID + '_' + paramName + '" value="' + paramName + '">' + '</td>' + '<td>&nbsp;</td>';
                            //html += '<td>' + '<input type="text" class="form-control" disabled="disabled" id="txtMin_' + RecipeID + '_' + paramName + '" value="' + min + '">' + '</td>' + '<td>&nbsp;</td>';
                            //html += '<td>' + '<input type="text" class="form-control" disabled="disabled" id="txtMax_' + RecipeID + '_' + paramName + '" value="' + max + '">' + '</td>' + '<td>&nbsp;</td>';
                            //html += '<td>' + '<input type="text" class="form-control" disabled="disabled" id="txtValue_' + RecipeID + '_' + paramName + '" value="' + value + '">' + '</td>';
                            html += '<td>' + '<input type="text" class="form-control" id="txtParam_' + RecipeID + '_' + paramName + '" value="' + paramName + '">' + '</td>' + '<td>&nbsp;</td>';
                            html += '<td>' + '<input type="text" class="form-control" id="txtMin_' + RecipeID + '_' + paramName + '" value="' + min + '">' + '</td>' + '<td>&nbsp;</td>';
                            html += '<td>' + '<input type="text" class="form-control" id="txtMax_' + RecipeID + '_' + paramName + '" value="' + max + '">' + '</td>' + '<td>&nbsp;</td>';
                            html += '<td>' + '<input type="text" class="form-control" id="txtValue_' + RecipeID + '_' + paramName + '" value="' + value + '">' + '</td>';
                            html += '</tr>';
                            html += "</table>";

                            groupDiv.append(html);

                            group = parseInt(val[x].GroupName[y]);
                        }
                    }

                    html = '<table>';
                    html += '<tr>';
                    html += '<td>';
                    html += '<label style="font-weight:bold;">Recipe Name:&nbsp;&nbsp;</label>';
                    html += '</td>';
                    html += '<td>';
                    html += '<input type="text" id="txtRecipe_' + EquipID + '" class="form-control">';
                    html += '</td>';
                    html += '<td>&nbsp;&nbsp;</td>';
                    html += '<td>';
                    html += '<button class="btn btn-info" id="btnGetRecipe_' + EquipID + '" onclick="GetRecipeFromMachine(' + "'" + EquipID + "'" + ');"' + '>Get Recipe from Machine</button>';
                    html += '</td>';
                    html += '</tr>';
                    html += '</table>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<br/>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<div><input type="checkbox" id="chkOverrideRecipe_' + EquipID + '"></input> Load Recipe from File</div>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<div><input type="file" id="fileRecipe_' + EquipID + '" /></div>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<br/>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    html = '<button class="btn btn-info" id="btnLoadRecipe_' + EquipID + '" onclick="LoadRecipeIndividual(' + "'" + EquipID + "'" + ');"' + '>Load Recipe</button><br/><br/>';
                    $('#divEquipParamRoot_' + EquipID).append(html);

                    //html = '<hr style="border: 1px solid #EEEEEE">';
                    html = '<hr style="border: 1px solid #000000">';
                    $('#divEquipParamRoot_' + EquipID).append(html);
                }

                if (val.length == totalCount) {
                    obj_recipe = val;

                    isRecipe = true;
                    $("#divRecipeInfo").show();
                    $("#divLotInfo").show();

                    $('#lblRecipeResult').text('Recipe Information Retrieval Success: ' + productName);
                    $('#lblRecipeResult').css("color", "green");
                    //$('#divRecipeResult').show();

                    try {
                        callback(isRecipe);
                    }
                    catch (e) { }
                }
                else {
                    $.ajax({
                        url: '/TrackIn/getChildEquipments',
                        data: { parent: EquipID },
                        contentType: 'application/json',
                        dataType: 'json',
                        method: 'GET'
                    }).success(function (result) {

                        var arr = []
                        for (var i = 0; i < val.length; i++) {
                            var equip = val[i].EquipID;
                            arr.push(equip);
                        }

                        var arr_no_recipe = [];
                        for (var i = 0; i < result.length; i++) {
                            var equip = result[i];
                            check = $.inArray(equip, arr);
                            if (check == -1) {
                                arr_no_recipe.push(equip);
                            }
                        }

                        var str = arr_no_recipe.join(', ');

                        if (productName == "") {
                            $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
                        }
                        else {
                            $('#lblRecipeResult').text('No Recipe for Machine: ' + str);
                        }

                        //$('#divRecipeResult').show();
                        $("#divRecipeInfo").show();
                        $('#lblRecipeResult').css("color", "red");

                        isRecipe = false;

                        try {
                            callback(isRecipe);
                        }
                        catch (e) { }


                    });
                }
            }
            else {

                if (productName == "") {
                    $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
                }
                else {
                    $('#lblRecipeResult').text('Recipe Information Retrieval Failed: ' + productName);
                }

                //$('#divRecipeResult').show();
                $("#divRecipeInfo").show();
                $('#lblRecipeResult').css("color", "red");

                isRecipe = false;

                try {
                    callback(isRecipe);
                }
                catch (e) { }
            }
        }
        else {
            if (productName == "") {
                $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
            }
            else {
                $('#lblRecipeResult').text('Recipe Information Retrieval Failed: ' + productName);
            }

            //$('#divRecipeResult').show();
            $("#divRecipeInfo").show();
            $('#lblRecipeResult').css("color", "red");

            isRecipe = false;

            try {
                callback(isRecipe);
            }
            catch (e) { }
        }

    }).error(function (e) {
        

        $.ajax({
            url: '/Engineer/GetEquipmentTypeJoin',
            data: { ID: ID },
            contentType: 'application/json',
            dataType: 'json',
            method: 'GET'
        }).success(function (type) {
            
            if (type == "")
            {
                $.ajax({
                    url: '/Engineer/getChildEquipment',
                    data: { equipment: EquipID },
                    contentType: 'application/json',
                    dataType: 'json',
                    method: 'GET'
                }).success(function (result) {

                    if (result != null)
                    {
                        if (result.length > 0)
                        {
                            for (var x = 0; x < result.length; x++)
                            {
                                var equip = result[x];
                                
                                var html = "";

                                html = '<label style="font-weight:bold;">' + equip + '</label><br/><br/>';
                                $('#divDynaRecipe').append(html);

                                html = '<table>';
                                html += '<tr>';
                                html += '<td>';
                                html += '<label style="font-weight:bold;">Recipe Name:&nbsp;&nbsp;</label>';
                                html += '</td>';
                                html += '<td>';
                                html += '<input type="text" id="txtRecipe_' + equip + '" class="form-control">';
                                html += '</td>';
                                html += '<td>&nbsp;&nbsp;</td>';
                                html += '<td>';
                                html += '<button class="btn btn-info" id="btnGetRecipe_' + equip + '" onclick="GetRecipeFromMachine(' + "'" + equip + "'" + ');"' + '>Get Recipe from Machine</button>';
                                html += '</td>';
                                html += '</tr>';
                                html += '</table>';

                                $('#divDynaRecipe').append(html);

                                html = '<br/>';
                                $('#divDynaRecipe').append(html);

                                html = '<div><input type="file" id="fileRecipe_' + equip + '" /></div>';
                                $('#divDynaRecipe').append(html);

                                html = '<br/>';
                                $('#divDynaRecipe').append(html);

                                html = '<button class="btn btn-info" id="btnLoadRecipe_' + equip + '" onclick="LoadRecipeIndividualNoResult(' + "'" + equip + "'" + ');"' + '>Load Recipe</button><br/><br/>';
                                $('#divDynaRecipe').append(html);

                                html = '<hr style="border: 1px solid #000000">';
                                $('#divDynaRecipe').append(html);
                            }
                        }
                    }

                    if (productName == "") {
                        $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
                    }
                    else {
                        $('#lblRecipeResult').text('Recipe Information Retrieval Failed: ' + productName);
                    }

                    //$('#divRecipeResult').show();
                    $("#divRecipeInfo").show();
                    $('#lblRecipeResult').css("color", "red");

                    isRecipe = false;

                    try {
                        callback(isRecipe);
                    }
                    catch (e) { }

                });
            }
            else
            {
                var equip = EquipID;

                var html = "";

                html = '<label style="font-weight:bold;">' + equip + '</label><br/><br/>';
                $('#divDynaRecipe').append(html);

                html = '<table>';
                html += '<tr>';
                html += '<td>';
                html += '<label style="font-weight:bold;">Recipe Name:&nbsp;&nbsp;</label>';
                html += '</td>';
                html += '<td>';
                html += '<input type="text" id="txtRecipe_' + equip + '" class="form-control">';
                html += '</td>';
                html += '<td>&nbsp;&nbsp;</td>';
                html += '<td>';
                html += '<button class="btn btn-info" id="btnGetRecipe_' + equip + '" onclick="GetRecipeFromMachine(' + "'" + equip + "'" + ');"' + '>Get Recipe from Machine</button>';
                html += '</td>';
                html += '</tr>';
                html += '</table>';

                $('#divDynaRecipe').append(html);

                html = '<br/>';
                $('#divDynaRecipe').append(html);

                html = '<div><input type="file" id="fileRecipe_' + equip + '" /></div>';
                $('#divDynaRecipe').append(html);

                html = '<br/>';
                $('#divDynaRecipe').append(html);

                html = '<button class="btn btn-info" id="btnLoadRecipe_' + equip + '" onclick="LoadRecipeIndividualNoResult(' + "'" + equip + "'" + ');"' + '>Load Recipe</button><br/><br/>';
                $('#divDynaRecipe').append(html);

                html = '<hr style="border: 1px solid #000000">';
                $('#divDynaRecipe').append(html);



                if (productName == "") {
                    $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
                }
                else {
                    $('#lblRecipeResult').text('Recipe Information Retrieval Failed: ' + productName);
                }

                //$('#divRecipeResult').show();
                $("#divRecipeInfo").show();
                $('#lblRecipeResult').css("color", "red");

                isRecipe = false;

                try {
                    callback(isRecipe);
                }
                catch (e) { }
            }


            //if (productName == "") {
            //    $('#lblRecipeResult').text('No Product Name Associated with Lot Number');
            //}
            //else {
            //    $('#lblRecipeResult').text('Recipe Information Retrieval Failed: ' + productName);
            //}

            ////$('#divRecipeResult').show();
            //$("#divRecipeInfo").show();
            //$('#lblRecipeResult').css("color", "red");

            //isRecipe = false;

            //try {
            //    callback(isRecipe);
            //}
            //catch (e) { }

        });

        
    });

}

//function for getting recipe from machine S7F5
function GetRecipeFromMachine(equipment)
{
    var recipe = $('#txtRecipe_' + equipment).val();

    if (recipe == '')
    {
        notification_modal_dynamic("Notification", "Please enter Recipe Name", "danger", identifier);
        identifier++;
        return;
    }
    else
    {
        $.ajax({
            url: '/SECSGEM/S7F5',
            data: { Equipment: equipment, PPID: recipe },
            dataType: 'json',
            method: 'POST'
        }).success(function (result) {

            if (result != null && result != "")
            {
                var arr = base64ToArrayBuffer(result);
                saveByteArray(recipe, arr);
            }
            else
            {
                notification_modal_dynamic("Notification", "Failed to retrieve Recipe from Machine", 'danger', identifier);
                identifier++;
            }
            

        }).error(function (e) {
           
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;

        });
    }
}

function saveByteArray(filename, byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

//for getting the lot info
function getLotInfo(callback) {

    var isLotInfo = false;
    var lot = $('#txtLotNumber').val().trim().toUpperCase();

    if (lot == "") {
        notification_modal_dynamic("Notification", "No Lot Number Inputted", "danger", identifier);
        identifier++;
        return;
    }

    global_lotNumber = lot;
    var type = global_type;
    global_old_type = type;


    $("#txtQuantity").val("0");
    $("#txtToleranceQuantity").val("0");

    $("#txtComment").val("");

    $("#txtProductName").val("");
    $("#txtProductLine").val("");
    $("#txtProcessSpecObjectCategory").val("");
    $("#txtLotStatus").val("");
    $("#txtStep").val("");

    //$("#txtProductName").attr("disabled", "disabled");
    //$("#txtProductLine").attr("disabled", "disabled");
    //$("#txtProcessSpecObjectCategory").attr("disabled", "disabled");
    //$("#txtLotStatus").attr("disabled", "disabled");
    //$("#txtStep").attr("disabled", "disabled");

    $("#divLotInfo").show();
    $('#divLotResult').hide();

    $.ajax({
        url: '/Engineer/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            $("#txtProductName").val(result.ProductName);
            $("#txtProductLine").val(result.ProductLine);
            //$("#txtQuantity").val(result.Qty);
            $("#txtQuantity").val(result.MaxQtyToProcess);
            $("#txtProcessSpecObjectCategory").val(result.ProcessSpecObjectCategory);
            $("#txtLotStatus").val(result.LotStatus);
            $("#txtStep").val(result.Step);

            setTolerance();

            $('#lblLotResult').text('Lot Information Retrieval Success: ' + lot);
            $('#divLotResult').hide();
            $('#lblLotResult').css("color", "green");

            isLotInfo = true;

            try {
                callback(isLotInfo);
            }
            catch (e) { }
        }
        else {

            //notification_modal_dynamic("Notification", "Invalid Lot Number", 'danger', 'form_modal_div', identifier);
            //identifier++;

            if (lot == "") {
                $('#lblLotResult').text('No Lot Number Inputted');
            }
            else {
                $('#lblLotResult').text('Lot Information Retrieval Failed: ' + lot);
            }

            $("#divDynaLine").empty();
            $("#divPreview").empty();
            $("#divPreview").hide();
            $("#lnkCAS").hide();
            $("#lblNoCAS").hide();

            $("#txtBrandedQuantity").val("");
            $("#txtBrandedToleranceQuantity").val("");
            $("#txtPartNo").val("");
            $("#txtPkgGroup").val("");
            $("#txtMarkingLayout").val("");
            $("#txtCASName").val("");
            $("#lnkCAS").prop("href", "")
            $("#lnkCAS").html("No CAS Link");

            $("#txtTType").val("");
            $("#txtTemplate").val("");
            $("#txtPkgTemp").val("");
            $("#txtNumLine").val("");

            $('#lblLotResult').css("color", "red");

            isLotInfo = false;
            try {
                callback(isLotInfo);
            }
            catch (e) { }
        }

    }).error(function (e) {

        //notification_modal_dynamic("Notification", "Invalid Lot Number", 'danger', 'form_modal_div', identifier);
        //identifier++;

        if (lot == "") {
            $('#lblLotResult').text('No Lot Number Inputted');
        }
        else {
            $('#lblLotResult').text('Lot Information Retrieval Failed: ' + lot);
        }

        $("#divDynaLine").empty();
        $("#divPreview").empty();
        $("#divPreview").hide();
        $("#lnkCAS").hide();
        $("#lblNoCAS").hide();

        $("#txtBrandedQuantity").val("");
        $("#txtBrandedToleranceQuantity").val("");
        $("#txtPartNo").val("");
        $("#txtPkgGroup").val("");
        $("#txtMarkingLayout").val("");
        $("#txtCASName").val("");
        $("#lnkCAS").prop("href", "")
        $("#lnkCAS").html("No CAS Link");

        $("#txtTType").val("");
        $("#txtTemplate").val("");
        $("#txtPkgTemp").val("");
        $("#txtNumLine").val("");

        $('#lblLotResult').css("color", "red");

        isLotInfo = false;
        try {
            callback(isLotInfo);
        }
        catch (e) { }

    });
}

//this function is used to refresh the lot info/template info before proceeding to trackin 
//and not resetting the textbox value when the trackin button is pressed
function getLotInfo_NoQty() {
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var type = global_type;

    $("#txtProductName").val("");
    $("#txtProductLine").val("");
    $("#txtProcessSpecObjectCategory").val("");
    $("#txtLotStatus").val("");
    $("#txtStep").val("");

    $("#txtProductName").attr("disabled", "disabled");
    $("#txtProductLine").attr("disabled", "disabled");
    $("#txtProcessSpecObjectCategory").attr("disabled", "disabled");
    $("#txtLotStatus").attr("disabled", "disabled");
    $("#txtStep").attr("disabled", "disabled");

    $("#divLotInfo").show();

    $.ajax({
        url: '/Engineer/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            $("#txtProductName").val(result.ProductName);
            $("#txtProductLine").val(result.ProductLine);
            $("#txtProcessSpecObjectCategory").val(result.ProcessSpecObjectCategory);
            $("#txtLotStatus").val(result.LotStatus);
            $("#txtStep").val(result.Step);

            setTolerance();

            $('#lblLotResult').text('Lot Information Retrieval Success: ' + lot);
            $('#divLotResult').hide();
            $('#lblLotResult').css("color", "green");

            //detemine equipment type and proceed with next process
            if (type.toUpperCase() == "LASER MARK TEST") {
                getTemplateInfo(function (output) {

                    if (output == true) {
                        notification_modal_confirm_LM();
                    }
                    else {
                        notification_modal_dynamic("Notification", "No Template File", 'danger', identifier);
                        identifier++;
                    }

                });
            }
            else {
                notification_modal_confirm();
            }
        }
        else {
            
            if (lot == "") {
                $('#lblLotResult').text('No Lot Number Inputted');
            }
            else {
                $('#lblLotResult').text('Lot Information Retrieval Failed: ' + lot);
            }

            $('#divLotResult').hide();

            $("#divDynaLine").empty();
            $("#divPreview").empty();
            $("#divPreview").hide();
            $("#lnkCAS").hide();
            $("#lblNoCAS").hide();

            $("#txtBrandedQuantity").val("");
            $("#txtBrandedToleranceQuantity").val("");
            $("#txtPartNo").val("");
            $("#txtPkgGroup").val("");
            $("#txtMarkingLayout").val("");
            $("#txtCASName").val("");
            $("#lnkCAS").prop("href", "")
            $("#lnkCAS").html("No CAS Link");

            $("#txtTType").val("");
            $("#txtTemplate").val("");
            $("#txtPkgTemp").val("");
            $("#txtNumLine").val("");

            $('#lblLotResult').css("color", "red");

            //refresh the template info depending on equipment type
            if (type.toUpperCase() == "LASER MARK TEST") {
                getTemplateInfo();
            }

            notification_modal_dynamic("Notification", "Invalid Lot Number", 'danger', identifier);
            identifier++;
        }

    }).error(function (e) {
        
        if (lot == "") {
            $('#lblLotResult').text('No Lot Number Inputted');
        }
        else {
            $('#lblLotResult').text('Lot Information Retrieval Failed: ' + lot);
        }

        $('#divLotResult').hide();

        $('#lblLotResult').css("color", "red");

        $("#divDynaLine").empty();
        $("#divPreview").empty();
        $("#divPreview").hide();
        $("#lnkCAS").hide();
        $("#lblNoCAS").hide();

        $("#txtBrandedQuantity").val("");
        $("#txtBrandedToleranceQuantity").val("");
        $("#txtPartNo").val("");
        $("#txtPkgGroup").val("");
        $("#txtMarkingLayout").val("");
        $("#txtCASName").val("");
        $("#lnkCAS").prop("href", "")
        $("#lnkCAS").html("No CAS Link");

        $("#txtTType").val("");
        $("#txtTemplate").val("");
        $("#txtPkgTemp").val("");
        $("#txtNumLine").val("");

        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;

    });
}

//getting the template info
function getTemplateInfo(callback) {
    var lot = $("#txtLotNumber").val().trim().toUpperCase();
    var productName = $("#txtProductName").val();

    $("#divDynaLine").empty();
    $("#divPreview").empty();
    $("#divPreview").hide();
    $("#lnkCAS").hide();
    $("#lblNoCAS").hide();

    $('#txtNumLine').focus(function () {
        

        oldNumLine = $('#txtNumLine').val();

        if (oldNumLine == "")
        {
            //oldNumLine = 0;
            oldNumLine = "";
        }
        else
        {
            oldNumLine = parseInt($('#txtNumLine').val());
        }

        $('#txtNumLine').val(oldNumLine);
        
    });

    $('#txtNumLine').blur(function () {

        newNumLine = $('#txtNumLine').val();

        if (newNumLine == "") {
            newNumLine = 0;
        }
        else {
            newNumLine = parseInt($('#txtNumLine').val());
        }

        $('#txtNumLine').val(newNumLine);

        if (oldNumLine != newNumLine) {
            generateTextbox(parseInt($('#txtNumLine').val()));
        }
    });

    //get the data first from WEB UI database
    $.ajax({
        url: '/Engineer/GetDataFromDCC',
        data: { productName: productName },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (val) {

        $("#txtPartNo").val("");
        $("#txtPkgGroup").val("");
        $("#txtTemplate").val("");
        $("#txtPkgTemp").val("");
        $("#txtNumLine").val("");
        $("#txtCASName").val("");

        if (val.Error == false) {
            if (val.PartNo != null && val.PartNo != "" && val.PartNo != "undefined" && val.PartNo != undefined) {
                $("#txtPartNo").val(val.PartNo);
            }
            else {
                $("#txtPartNo").val("");
            }

            var markingInstructionID = val.MarkingInstructionID;

            if (val.PackageType != null && val.PackageType != "" && val.PackageType != "undefined" && val.PackageType != undefined) {
                $("#txtPkgGroup").val(val.PackageType);
            }
            else {
                $("#txtPkgGroup").val("");
            }

            if (val.Specs != null && val.Specs != "" && val.Specs != "undefined" && val.Specs != undefined) {
                $("#txtMarkingLayout").val(val.Specs);
            }
            else {
                $("#txtMarkingLayout").val("");
            }

            if (val.PkgTemp != null && val.PkgTemp != "" && val.PkgTemp != "undefined" && val.PkgTemp != undefined) {
                $("#txtPkgTemp").val(val.PkgTemp);
            }
            else {
                $("#txtPkgTemp").val("");
            }

            if (val.VLMName != null && val.VLMName != "" && val.VLMName != "undefined" && val.VLMName != undefined) {
                $("#txtTemplate").val(val.VLMName);
            }
            else {
                $("#txtTemplate").val("");
            }

            if (val.CASName != null && val.CASName != "" && val.CASName != "undefined" && val.CASName != undefined) {
                $("#txtCASName").val(val.CASName);
            }
            else {
                $("#txtCASName").val("");
            }

            if (val.CASLink != null && val.CASLink != "" && val.CASLink != "undefined" && val.CASLink != undefined) {

                $("#lnkCAS").prop("href", val.CASLink);
                //$("#lnkCAS").html("View Link");
                $("#lnkCAS").html(val.CASLink);
                $("#lnkCAS").show();
                $("#lblNoCAS").hide();
            }
            else {

                $("#lnkCAS").prop("href", "");
                $("#lnkCAS").html("N/A");
                $("#lnkCAS").hide();
                $("#lblNoCAS").show();
            }

            //get the line number
            $.ajax({
                url: '/Engineer/GetLineNumber',
                data: { MarkingInstructionID: markingInstructionID },
                method: 'GET'
            }).success(function (num) {

                var temp = 0;
                try {
                    temp = parseInt(num);
                }
                catch (e) {
                    temp = 0
                }

                $("#txtNumLine").val(temp);

                //build the line number dynamically
                if (temp > 0) {

                    $("#divDynaLine").append("<br />");

                    for (var x = 1; x <= temp; x++) {
                        var html = '<div class="form-group col-md-2" style="margin:0px;padding-left:0px;padding-right:5px;padding-top:0px;padding-bottom:5px;"><label for="txtLine' + x + '">Line ' + x + ':</label><input type="text" class="form-control inputtext" id="txtLine' + x + '" placeholder="Line ' + x + '"></div>';

                        $("#divDynaLine").append(html);
                        $("#txtLine" + x).val("");
                        //$("#txtLine" + x).attr("disabled", "disabled");

                        var content = document.getElementById('txtLine' + x);
                        content.onblur = createBlurHandler(x);
                    }

                    $.ajax({
                        url: '/Engineer/GetLineText',
                        data: { MarkingInstructionID: markingInstructionID, PartNum: val.PartNo, LotNo: lot, PkgTemp: val.PkgTemp },
                        method: 'GET'
                    }).success(function (customText) {
                        var strArray = customText.split(';');

                        var preview = '<label>Preview:</label><div id="divContent" style="text-align:center;border:5px solid #00ff90;font-weight: bold;"></div>';

                        var lines = "";

                        $("#divPreview").append(preview);
                        $("#divPreview").show();

                        for (i = 0; i < strArray.length; i++) {


                            var tempArr = strArray[i].split('=');

                            var lineName = "";
                            try {
                                var lineName = tempArr[0];
                                lineName = lineName.replace("Line", "");
                            }
                            catch (e) {
                                lineName = "";
                            }

                            var lineText = "";
                            try {
                                var lineText = tempArr[1];
                            }
                            catch (e) {
                                lineText = "";
                            }


                            $("#txtLine" + lineName).val(lineText);

                            var temp = i + 1;
                            var lbl = 'lblLine' + temp;
                            var html = '<label id="' + lbl + '">' + lineText + '</label><br/>';
                            $("#divContent").append(html);
                        }
                        

                    });
                }

                $("#divTemplateInfo").show();
                $("#divLotInfo").show();

                $('#lblTemplateResult').text('Template Information Retrieval Success: ' + productName);
                isTemplate = true;
                $('#lblTemplateResult').css("color", "green");
                $('#btnSend').removeAttr("disabled");
                $('#divTemplateResult').hide();

            }).error(function (e) {

                if (productName == "")
                {
                    $('#lblTemplateResult').text('No Product Name Associated with Lot Number');
                }
                else
                {
                    $('#lblTemplateResult').text('Template Information Retrieval Failed: ' + productName);
                }

                $('#divTemplateResult').hide();
                $("#divTemplateInfo").show();
                $('#lblTemplateResult').css("color", "red");
                //$('#btnSend').attr("disabled", "disabled");
                $('#btnSend').removeAttr("disabled");

                isTemplate = false;

            }).done(function () {
                try {
                    callback(isTemplate);
                }
                catch (e) { }
            });
        }
        else {
            
            if (productName == "") {
                $('#lblTemplateResult').text('No Product Name Associated with Lot Number');
            }
            else {
                $('#lblTemplateResult').text('Template Information Retrieval Failed: ' + productName);
            }

            $('#divTemplateResult').hide();
            $("#divTemplateInfo").show();
            $('#lblTemplateResult').css("color", "red");
            //$('#btnSend').attr("disabled", "disabled");
            $('#btnSend').removeAttr("disabled");

            isTemplate = false;

            try {
                callback(isTemplate);
            }
            catch (e) { }
        }

    }).error(function (e) {

        if (productName == "")
        {
            $('#lblTemplateResult').text('No Product Name Associated with Lot Number');
        }
        else
        {
            $('#lblTemplateResult').text('Template Information Retrieval Failed: ' + productName);
        }
        
        $('#divTemplateResult').hide();
        $("#divTemplateInfo").show();
        $('#lblTemplateResult').css("color", "red");
        //$('#btnSend').attr("disabled", "disabled");
        $('#btnSend').removeAttr("disabled");

        isTemplate = false;

        try {
            callback(isTemplate);
        }
        catch (e) { }
    });

}

function generateTextbox(val)
{
    arrLine = [];
    arrLineVal = [];
    arrTxt = [];
    arrTxtVal = [];

    $('label', '#divContent').each(function () {

        var id = $(this).attr('id');
        var txt = $(this).text();

        arrLine.push(id);
        arrLineVal.push(txt);
    });

    $('input', '#divDynaLine').each(function () {

        var id = $(this).attr('id');
        var txt = $(this).val();

        arrTxt.push(id);
        arrTxtVal.push(txt);
    });

    $('#divPreview').empty();

    $('#divDynaLine').empty();

    $("#divDynaLine").append("<br />");

    var preview = '<label>Preview:</label><div id="divContent" style="text-align:center;border:5px solid #00ff90;font-weight: bold;"></div>';

    if (val == 0) {
        $('#divPreview').hide();
    }
    else {
        $("#divPreview").append(preview);
        $('#divPreview').show();
    }

    for (var x = 1; x <= val; x++) {
        var html = '<div class="form-group col-md-2" style="margin:0px;padding-left:0px;padding-right:5px;padding-top:0px;padding-bottom:5px;"><label for="txtLine' + x + '">Line ' + x + ':</label><input type="text" class="form-control inputtext" id="txtLine' + x + '" placeholder="Line ' + x + '"></div>';

        $("#divDynaLine").append(html);
        $("#txtLine" + x).val("");
        
        var lbl = 'lblLine' + x;
        var html = '<label id="' + lbl + '"></label><br/>';
        $("#divContent").append(html);

        var content = document.getElementById('txtLine' + x);
        content.onblur = createBlurHandler(x);
    }

    for (var x = 0; x < arrLine.length; x++)
    {
        $('#' + arrLine[x]).text(arrLineVal[x]);
    }

    for (var x = 0; x < arrTxt.length; x++) {
        $('#' + arrTxt[x]).val(arrTxtVal[x]);
    }
    
}

var createBlurHandler = function (id) {
    return function () {

        var text = $('#txtLine' + id).val();
        $('#lblLine' + id).text(text);
    };
}

//setting the tolerance
function setTolerance()
{
    if ($("#txtQuantity").val() != null && $("#txtQuantity").val() != "") {
        
        //old code
        //$.ajax({
        //    url: '/Engineer/GetTolerance',
        //    data: { quantity: $("#txtQuantity").val() },
        //    method: 'GET'
        //}).success(function (val) {

        //    $("#txtToleranceQuantity").val(val);

        //}).error(function (e) {
        //    notification_modal_dynamic("Notification", "Invalid Quantity", 'danger', identifier);
        //    identifier++;
        //    $("#txtQuantity").val(0);
        //    $("#txtToleranceQuantity").val(0);
        //});

        //new code
        var quantity = $("#txtQuantity").val();
        var percent = tolerance_percent / 100;
        var val = quantity * percent;
        val = Math.ceil(val);
        $('#txtToleranceQuantity').val(val);
    }
    else {
        $("#txtQuantity").val(0);
        $("#txtToleranceQuantity").val(0);
    }

    //setTolerancePercent('lblTolerancePercent');
}

function setTolerancePercent(labelName)
{
    $.ajax({
        url: '/Engineer/GetTolerancePercent',
        method: 'GET'
    }).success(function (val) {
        $('#' + labelName).text("(" + val + "%)");

    });
}

//setting the branded tolerance
function setToleranceBranded() {

    if ($("#txtBrandedQuantity").val() != null && $("#txtBrandedQuantity").val() != "") {
        //old code
        //$.ajax({
        //    url: '/Engineer/GetTolerance',
        //    data: { quantity: $("#txtBrandedQuantity").val() },
        //    method: 'GET'
        //}).success(function (val) {
           
        //    $("#txtBrandedToleranceQuantity").val(val);

        //}).error(function (e) {
        //    notification_modal_dynamic_super("Notification", "Invalid Quantity", 'danger', 'modal_div', identifier);
        //    identifier++;
        //    $("#txtBrandedQuantity").val(0);
        //    $("#txtBrandedToleranceQuantity").val(0);
        //});

        //new code
        var quantity = $("#txtBrandedQuantity").val();
        var percent = tolerance_percent / 100;
        var val = quantity * percent;
        val = Math.ceil(val);
        $('#txtBrandedToleranceQuantity').val(val);
    }
    else {
        
        //$("#txtBrandedQuantity").val(0);
        $("#txtBrandedToleranceQuantity").val(0);
    }

    setTolerancePercent('lblBrandedTolerancePercent');
}

//modal for unlocking the quantity textbox
function notification_modal_unlockQuantity()
{
    //random = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    txtUserID = 'txtUsername';
    txtPasswordID = 'txtPassword';

    var modal = '<div class="modal fade" id="form_modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog modal-md">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" style="background-color: #08A7C3; color:#ffffff;">';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">Authentication Required</h4>';
    modal += '</div>';

    modal += '<div class="modal-body">';
    modal += '<br />';
    modal += '<div class="row">';

    modal += '<div class="form-group col-md-12">';
    modal += '  <label for="txtUsername">Username:</label>';
    modal += '  <input type="text" class="form-control inputtext" placeholder="Username" id="' + txtUserID + '" autocomplete="off">';
    modal += '</div>';

    modal += '<div class="form-group col-md-12">';
    modal += '  <label for="txtPassword">Password:</label>';
    modal += '  <input type="password" class="form-control inputtext" placeholder="Password" id="' + txtPasswordID + '" autocomplete="off">';
    modal += '</div>';

    modal += '</div>';

    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    
    modal += '<button type="button" class="btn btn-success" id="btnLogin" onclick="Login();">Login</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup();});'
    modal += '</script>';

    $("#form_modal").html(modal);
    $("#form_modal_div").modal("show");
    $("#form_modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//for setting the login override handlers
function setup()
{
    var txtUsername = $("#txtUsername");
    var txtPassword = $("#txtPassword");

    $(txtUsername).focus();

    $(txtUsername).keypress(function (e) {
        if (e.which == 13) {
            $("#txtPassword").focus();
        }
    });

    $(txtPassword).keypress(function (e) {
        if (e.which == 13) {
            Login();
        }
    });
}

//function for login override
function Login()
{
    var txtUsername = $("#txtUsername");
    var txtPassword = $("#txtPassword");

    var username = $(txtUsername).val();
    var password = $(txtPassword).val();

    if (username == "" || password == "")
    {
        notification_modal_dynamic_super("Login Failed", "All fields are required", 'danger', 'form_modal_div', identifier);
        identifier++;
    }
    else
    {
        $.ajax({
            url: '/Account/LoginSupervision',
            data: { Username: username, Password: password },
            method: 'POST'
        }).success(function (result) {

            if (result == 1)
            {
                var isDisabled = $('#txtQuantity').is(':disabled');

                if (isDisabled == false)
                {
                    disableQuantity();
                }
                else
                {
                    enableQuantity();
                }
                    
                $("#form_modal_div").modal("hide");
            }
            else if (result == 2)
            {
                notification_modal_dynamic_super("Login Failed", "Insufficient Privilege", 'danger', 'form_modal_div', identifier);
                identifier++;
            }
            else if (result == 3)
            {
                notification_modal_dynamic_super("Login Failed", "Invalid Username and/or Password", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Login Failed", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
}

//disable the quantity textbox
function disableQuantity()
{
    $("#txtQuantity").attr("disabled", true);
}

//enable the quantity textbox
function enableQuantity() {
    $("#txtQuantity").attr("disabled", false);
}

//function for validate trackin values before submitting
function TrackIn()
{
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();

    if (operator == "" || lotNo == "" || quantity == "" || index == 0)
    {
        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (operator == "") {
            msg += "Operator<br/>";
        }
        if (index == 0) {
            msg += "Machine<br/>";
        }
        if (lotNo == "") {
            msg += "Lot Number<br/>";
        }
        if (quantity == "") {
            msg += "Quantity<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)","");

        notification_modal_dynamic("Notification", msg, "danger", identifier);
        identifier++;
    }
    else
    {
        $.ajax({
            url: '/Engineer/IsEquipmentProcessing',
            data: { equipment: equipment },
            method: 'GET'
        }).success(function (result) {

            if (result == false)
            {
                //getLotInfo_NoQty();

                if (global_type == "LASER MARK TEST")
                {
                    notification_modal_confirm_LM();
                }
                else
                {
                    notification_modal_confirm();
                }

               
            }
            else
            {
                notification_modal_dynamic("Notification", "Cannot Track In. Equipment is processing", "danger", identifier);
                identifier++;
            }

        }).error(function () {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
            identifier++;
        });
    }

}

//build html modal track in confirmation for laser mark test
function notification_modal_confirm_LM() {

    confirm_branded = 0;

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Enter Branded Quantity" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    //modal += "You are about to Track In. Please enter Branded Quantity";
    //modal += '<div>&nbsp</div>';
    modal += '<div><label for="txtBrandedQuantity">Branded Quantity:</label><input type="text" class="form-control" id="txtBrandedQuantity" placeholder="Branded Quantity"></div><br />';
    modal += '<div><label for="txtBrandedToleranceQuantity">Branded Tolerance Quantity <label id="lblBrandedTolerancePercent"></label>:</label><div class="input-group"><input type="text" class="form-control" id="txtBrandedToleranceQuantity" disabled="disabled" placeholder="Tolerance Quantity"><span class="input-group-btn" title="Tolerance" data-toggle="tooltip"><button class="btn btn-default" type="button" disabled="disabled"><span style="font-weight:bold;">&plusmn;</span></button></span></div></div>';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="notification_modal_confirm_branded();">OK</button>';
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
function notification_modal_confirm_branded() {
    
    var quantity = $('#txtQuantity').val();

    if (global_type == "LASER MARK TEST") {
        if ($('#txtBrandedQuantity').val() == null || $('#txtBrandedQuantity').val() == "") {
            notification_modal_dynamic_super("Notification", "Branded Quantity is required", 'danger', 'modal_div', identifier);
            identifier++;
            return;
        }

        if (parseInt($('#txtBrandedQuantity').val()) > parseInt(quantity)) {
            notification_modal_dynamic_super("Notification", "Cannot Enter More than the Track In Quantity", 'danger', 'modal_div', identifier);
            identifier++;
            return;
        }
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
    modal += '<button type="button" class="btn btn-success" onclick="OPCBranded();">OK</button>';
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

    $("#modal_div_branded").on("hidden.bs.modal", function ()
    {
        if (confirm_branded == 0) {
            $("#modal_div").modal("show");
        }
        else {
            $("#modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        confirm_branded = 0;

    });

}

//build html modal track in confirmation (default)
function notification_modal_confirm() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to Track In?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="ProceedTrackIn(null);">OK</button>';
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

function OPCBranded()
{
    ProceedOPC(true, null, null);
}

function ProceedOPC(isTrackin, msgID, isLoadTemplate) {

    fromLoadTemplate = isLoadTemplate;

    var equipment = $("#ddEquipment option:selected").text();
    var type = global_type;

    if (type == "LASER MARK TEST") {
        confirm_branded = 1;
        $("#modal_div_branded").modal("hide");
    }
    
    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/Engineer/GetTolerancePercent',
        method: 'GET'
    }).success(function (tolerancePercent) {

        $.ajax({
            url: '/Engineer/getProcessedQTY',
            data: { equipment: equipment },
            method: 'GET'
        }).success(function (TotalProcessedQTY) {

            $.ajax({
                url: '/Engineer/getTrackInQty',
                data: { equipment: equipment },
                method: 'GET'
            }).success(function (TrackInCount) {

                
                $.ajax({
                    url: '/Configuration/GetNoMarkTemplate',
                    method: 'GET'
                }).success(function (resultNoMark) {
                    
                    var command = '';

                    //build the command

                    var TType = $('#txtTType').val();
                    if (TType == "" || TType == null) {
                        TType = "0";
                    }
                    command += "TTYPE=" + TType + ";";

                    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
                    command += "LOT=" + lotNo + ";";

                    var Product = $('#txtProductName').val();
                    command += "PRODUCT=" + Product + ";";

                    var PartNum = $('#txtPartNo').val();
                    command += "PARTNUM=" + PartNum + ";";

                    //var markReq = $("#ddMarkReq option:selected").val().toUpperCase();
                    var markReq = "";
                    var brandedQuantity = parseInt($('#txtBrandedQuantity').val());
                    var Quantity;

                    if (brandedQuantity == 0) {
                        markReq = "YES";
                        //TODO

                        if (parseInt(TrackInCount) == 0) {
                            Quantity = $('#txtQuantity').val();
                        }
                        else {
                            Quantity = TrackInCount;
                        }

                        Quantity = Quantity - TotalProcessedQTY;
                    }
                    else {
                        markReq = "NO";
                        Quantity = brandedQuantity;
                    }

                    command += "QUANTITY=" + Quantity + ";";

                    var percent = tolerancePercent / 100;
                    var val = Quantity * percent;
                    val = Math.ceil(val);

                    var brandedToleranceQuantity;
                    brandedToleranceQuantity = val;
                    command += "TOLERANCE=" + brandedToleranceQuantity + ";";

                    command += "MARKREQ=" + markReq + ";";

                    var NoMarkTemplate = resultNoMark;
                    var realTemplate = $('#txtTemplate').val();
                    var Template = "";
                    var numberLine = $('#txtNumLine').val();

                    if (markReq.toUpperCase() == "YES") {
                        Template = realTemplate;
                    }
                    else {
                        Template = NoMarkTemplate;
                        numberLine = "";
                    }
                    command += "TEMPLATE=" + Template + ";";

                    var checkNOMARK = false;
                    if (numberLine == "" || numberLine == null) {
                        //numberLine = 0;
                        numberLine = 1;
                        checkNOMARK = true;
                    }
                    else {
                        checkNOMARK = false;
                    }

                    numberLine = parseInt(numberLine);

                    var PkgTemp = $('#txtPkgTemp').val();
                    command += "PKG_TEMP=" + PkgTemp + ";";

                    command += "NUMLINE=" + numberLine + ";";

                    var tempLine = "";

                    if (checkNOMARK == false) {
                        for (var a = 1; a <= numberLine; a++) {
                            command += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
                            tempLine += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
                        }
                    }

                    var temp_identifier = 0;

                    //for sending the opc command
                    $.ajax({
                        url: '/Engineer/OPCSendCommand',
                        data: { Equipment: equipment, Command: command, Type: type },
                        method: 'POST',
                        beforeSend: function (xhr) {
                            notification_modal_dynamic_loading("Notification", 'Communicating with Machine... Please wait.', 'success', identifier);
                            temp_identifier = identifier;
                            identifier++;
                        }
                    }).success(function (opcResult) {

                        if (opcResult != null) {

                            //for forcing command success (testing)
                            //opcResult.Error = false;
                            
                            if (opcResult.Error == false) {

                                if (isTrackin == true) {
                                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                                    $("#modal_div" + temp_identifier).modal("hide");

                                    ProceedTrackIn(markReq.toUpperCase());
                                }
                                else {
                                    markAsReadTrackin(msgID, temp_identifier, markReq.toUpperCase());
                                }
                            }
                            else {

                                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                                $("#modal_div" + temp_identifier).modal("hide");
                                $("#btnTrackIn").removeAttr("disabled");
                                notification_modal_dynamic("Notification", "Machine Communication Error:<br/>" + opcResult.Result, 'danger', identifier);
                                identifier++;
                            }
                        }
                        else {

                            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                            $("#modal_div" + temp_identifier).modal("hide");
                            $("#btnTrackIn").removeAttr("disabled");
                            notification_modal_dynamic("Notification", "Cannot communicate with the machine", 'danger', identifier);
                            identifier++;
                        }

                    }).error(function (xhr, status, error) {

                        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                        $("#modal_div" + temp_identifier).modal("hide");
                        $("#btnTrackIn").removeAttr("disabled");
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                        identifier++;

                    });


                }).error(function () {
                    $("#btnTrackIn").removeAttr("disabled");
                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                    identifier++;
                });


            }).error(function () {
                $("#btnTrackIn").removeAttr("disabled");
                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });

        }).error(function () {
            $("#btnTrackIn").removeAttr("disabled");
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        });

    }).error(function () {
        $("#btnTrackIn").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

function markAsReadTrackin(id, ident, markReq) {

    $.ajax({
        url: '/Home/markAsRead',
        data: { ID: id },
        method: 'POST'
    }).success(function () {

        var msg = "Done Processing";

        if (fromLoadTemplate != true)
        {
            markAsBrand(markReq, msg, ident);
        }
        else
        {
            $("#notification_modal_dynamic_loading" + ident).modal("hide");
            $("#modal_div" + ident).modal("hide");

            notification_modal_dynamic_redirect("Notification", msg, 'success', identifier);
            identifier++;
        }

    }).error(function ()
    {
        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;

    });
}

//function for executing track in
function ProceedTrackIn(markReq) {
    
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();

    var temp_identifier = 0;

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/Engineer/GetLotLocation',
        data: { LotNo: lotNo },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET',
        beforeSend: function () {
            $("#btnTrackIn").attr("disabled", "disabled");

            notification_modal_dynamic_loading("Notification", 'Tracking In... Please wait.', 'success', identifier);
            temp_identifier = identifier;
            identifier++;
        }
    }).success(function (result) {

        var location = "";
        location = result.Location;

        $.ajax({
            url: '/Engineer/FirstInsert',
            data: { userID: operator, lotNo: lotNo, location: location },
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
                else {

                    $.ajax({
                        url: '/Engineer/TrackIn',
                        data: { UserID: operator, LotNo: lotNo, Equipment: equipment, TrackInQty: quantity, Comment: comment, Location: location },
                        method: 'POST'
                    }).success(function (trackinResult) {

                        //for forcing trackin success (testing)
                        //trackinResult = "Success";

                        if (trackinResult.toUpperCase().includes("ERROR")) {
                           
                            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                            $("#modal_div" + temp_identifier).modal("hide");

                            var trackintemp = trackinResult.replace("ERROR:", "").replace("Error:", "");

                            $("#btnTrackIn").removeAttr("disabled");
                            notification_modal_dynamic("Notification", trackintemp, 'danger', identifier);
                            identifier++;
                        }
                        else {

                            var trackintemp = trackinResult.replace("RESULT:", "").replace("Result:", "");
                            
                            if (markReq != null && markReq != "")
                            {
                                markAsBrand(markReq, trackintemp, temp_identifier);
                            }
                            else
                            {
                                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                                $("#modal_div" + temp_identifier).modal("hide");

                                $("#btnTrackIn").removeAttr("disabled");
                                notification_modal_dynamic_redirect("Notification", trackintemp, 'success', identifier);
                                identifier++;
                            }
                        }

                    }).error(function (e) {

                        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                        $("#modal_div" + temp_identifier).modal("hide");

                        $("#btnTrackIn").removeAttr("disabled");
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                        identifier++;
                    });
                }
            }
            else {

                $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                $("#modal_div" + temp_identifier).modal("hide");

                $("#btnTrackIn").removeAttr("disabled");
                notification_modal_dynamic("Notification", "Camstar First Insertion Failed on Lot Number: " + lotNo, 'danger', identifier);
                identifier++;
            }

        }).error(function (e) {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            $("#btnTrackIn").removeAttr("disabled");
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        });
    }).error(function (e) {

        $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
        $("#modal_div" + temp_identifier).modal("hide");

        $("#btnTrackIn").removeAttr("disabled");
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

function markAsBrand(markReq, msg, ident) {

    var equipment = $("#ddEquipment option:selected").text();

    if (markReq.toUpperCase() == "YES")
    {
        markReq = "1";
    }
    else
    {
        markReq = "0";
    }

    $.ajax({
        url: '/Engineer/markAsBrand',
        data: { equipment: equipment, isBrand: markReq},
        method: 'POST'
    }).success(function (result) {

        $("#notification_modal_dynamic_loading" + ident).modal("hide");
        $("#modal_div" + ident).modal("hide");

        $("#btnTrackIn").removeAttr("disabled");
        notification_modal_dynamic_redirect("Notification", msg, 'success', identifier);
        identifier++;

    });
}




