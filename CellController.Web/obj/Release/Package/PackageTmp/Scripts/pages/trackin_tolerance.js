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
var lstEquipmentText = [];
var lstEquipmentVal = [];

$(document).ready(function (e) {
    
    equipmentQueryString = getParameterByName("Equipment");
    lotQueryString = getParameterByName("Lot");
    userQueryString = getParameterByName("UserID");
    processQueryString = getParameterByName("Process");

    $('#divTolerance').hide();
    $("#txtQuantity").val("0");

    //for barcode
    $.ajax({
        url: '/Configuration/GetIsScanner',
        method: 'GET'
    }).success(function (isScanner) {

        if(isScanner.toString().toUpperCase() == "TRUE")
        {
            $('#txtLotNumber').attr('readonly', 'readonly');
            $('#txtOperator').attr('readonly', 'readonly');
        }
        else
        {
            $('#txtLotNumber').keypress(function (event)
            {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == 13)
                {
                    ProcessLot();
                }
            });
        }
    });

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {
           
            $("#txtLotNumber").val(code);
            ProcessLot();
        }
    });

    $("#txtOperator").codeScanner({
        onScan: function ($element, code) {

            $("#txtOperator").val(code);
        }
    });

    $('#btnFocusLotNumber').click(function ()
    {
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
    $('#txtQuantity').blur(function ()
    {
        if ($('#txtQuantity').val() == '' || $('#txtQuantity').val().trim() == '')
        {
            $('#txtToleranceQuantity').val('0');
            setTolerancePercent('lblTolerancePercent');
            return;
        }
        else
        {
            setTolerance();
        }
    });

    $('#txtQuantity').on('input', function ()
    {
        if ($('#txtQuantity').val() == '' || $('#txtQuantity').val().trim() == '')
        {
            $('#txtToleranceQuantity').val('0');
            setTolerancePercent('lblTolerancePercent');
            return;
        }
        else
        {
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
        $("#txtOperator").attr("disabled", "disabled");
        $("#btnFocusOperatorID").hide();
        $("#divOper").removeClass('input-group');
    }

    var uname = getCookie("Username");
    if (uname != null && uname != "")
    {
        //$("#txtOperator").attr("disabled", "disabled");
    }
    
    if (userQueryString != null && userQueryString != "") {
        $("#txtOperator").val(userQueryString);
    }
    else {
        $("#txtOperator").val(EmployeeNumber);
        //$("#txtOperator").val(uname);
    }

    disableQuantity();

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

    //dropdown onchange handler
    $('#ddEquipment').change(function () {

        var equipmentID = $('#ddEquipment').val();

        $.ajax({
            url: '/TrackIn/GetEquipmentTypeJoin',
            data: { ID: equipmentID },
            method: 'GET'
        }).success(function (type) {

            global_type = type.toUpperCase();

            var divTolerance = $('#divTolerance');

            if (global_type == "LASER MARK TEST")
            {
                divTolerance.show();
            }
            else
            {
                divTolerance.hide();
            }

            var lot = $('#txtLotNumber').val().trim().toUpperCase();

            if (lot != "" && lot != global_lotNumber)
            {
                ProcessLot(true);
            }

            if (lot != "" && global_type != global_old_type) {
                ProcessLot(true);
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
        notification_modal_brandedQuantity(msgID);
        //notification_modal_brandedQuantity(null);
    });

    $('#btnEProcedure').click(function (event) {
        gotoEProc();
    });

    $('#btnWIPData').click(function (event) {
        gotoWIPData();
    });

    //for login override
    $('#btnUnlockQuantity').click(function ()
    {
        var isDisabled = $('#txtQuantity').is(':disabled')

        var username = getCookie("Username");

        if (isDisabled == true)
        {
            $.ajax({
                url: '/Account/isSupervision',
                data: { Username: username},
                method: 'GET'
            }).success(function (result) {

                if (result == true)
                {
                    enableQuantity();
                }
                else
                {
                    notification_modal_unlockQuantity();
                }

            }).error(function (e) {
                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });
        }
        else
        {
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

    $("#txtPartNo").attr("disabled", "disabled");
    $("#txtMarkingLayout").attr("disabled", "disabled");
    $("#txtPkgGroup").attr("disabled", "disabled");
    $("#txtCASName").attr("disabled", "disabled");

    $("#txtTType").attr("disabled", "disabled");
    $("#txtTemplate").attr("disabled", "disabled");
    $("#txtPkgTemp").attr("disabled", "disabled");
    $("#txtNumLine").attr("disabled", "disabled");

    var ddCount = $('#ddEquipment > option').length;
    
    ////if the url has query string select the equipment from dropdown
    //if (equipmentQueryString != null && equipmentQueryString != "") {
    //    $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
    //    $("#ddEquipment").trigger("change");
    //    $("#ddEquipment").attr("disabled", "disabled");
    //}
    //else
    //{
    //    if (ddCount > 1) {
    //        //$("#ddEquipment").prop('selectedIndex', 1);
    //        //$("#ddEquipment").trigger("change");
    //    }
    //}

    $('#spanEProc').hide();
    $('#spanWIPData').hide();

    var user = getCookie("Username");

    $.ajax({
        url: '/TrackIn/getUserRights',
        data: { username: user },
        method: 'GET'
    }).success(function (result) {
        if (result != null) {
            for (var x = 0; x < result.length; x++) {
                if (result[x] == "EProcedure") {
                    //$('#spanEProc').show();

                }
                if (result[x] == "Data Collection") {
                    $('#spanWIPData').show();
                }
            }
        }
    });

    setTolerancePercent('lblTolerancePercent');

    $('#divLoadTemplate').hide();

    //if (equipmentQueryString == null || equipmentQueryString == "") {
    //    $("#ddEquipment option").each(function () {
    //        if ($(this).index() != 0) {
    //            lstEquipmentVal.push($(this).val());
    //            lstEquipmentText.push($(this).text());

    //            $(this).remove();
    //        }
    //    });
    //}
    appendGroupEquipment();
    
    if (lotQueryString != null && lotQueryString != "") {

        $('#txtLotNumber').val(lotQueryString);

        if (processQueryString != null && processQueryString != "")
        {
            if (processQueryString.toUpperCase() == "FROMINBOX")
            {
                $('#txtLotNumber').attr("disabled", "disabled");
                $('#btnUnlockQuantity').attr("disabled", "disabled");
                $('#btnTrackIn').attr("disabled", "disabled");
                $('#btnWIPData').attr("disabled", "disabled");
                $('#btnEProcedure').attr("disabled", "disabled");
                $('#divLoadTemplate').show();
                //$('#btnFocusOperatorID').attr("disabled", "disabled");
                $('#btnFocusLotNumber').attr("disabled", "disabled");
                $('#btnCheckLot').attr("disabled", "disabled");
            }
        }
        else
        {
            getLotInfo();
            HideLoading();
        }
    }
    else 
    {
        HideLoading();
    }

});

function appendGroupEquipment() {

    $.ajax({
        url: '/TrackIn/GetGroupIDConnection',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json'
    }).success(function (result) {
        if(result != null)
        {
            if(result.length > 0)
            {
                for(var x =0; x < result.length; x++)
                {
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
            else
            {
                if (ddCount > 1) {
                    //$("#ddEquipment").prop('selectedIndex', 1);
                    //$("#ddEquipment").trigger("change");
                }
            }
        }
    });
}

function getTrackedValues()
{
    $.ajax({
        url: '/TrackIn/getTrackInQty',
        data: { equipment: $("#ddEquipment option:selected").text() },
        method: 'GET'
    }).success(function (TrackInCount) {

        $('#txtQuantity').val(TrackInCount);

        $.ajax({
            url: '/TrackIn/GetTolerancePercent',
            method: 'GET'
        }).success(function (tolerancePercent) {
            var percent = tolerancePercent / 100;
            var val = TrackInCount * percent;
            val = Math.ceil(val);

            $('#txtToleranceQuantity').val(val);

            var msgID = getCookie("EquipmentNotificationMessageID_" + equipmentQueryString);
            notification_modal_brandedQuantity(msgID);

            $.ajax({
                url: '/TrackIn/getTrackInUser',
                data: { equipment: $("#ddEquipment option:selected").text() },
                method: 'GET'
            }).success(function (user) {

                $('#txtOperator').val(user);

                HideLoading();

            }).error(function(){
                HideLoading();
                notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
                identifier++;
            })

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
        url: '/TrackIn/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/TrackIn/FirstInsert',
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
        url: '/TrackIn/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/TrackIn/FirstInsert',
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
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackIn" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/WIPData?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackIn" + "&UserID=" + operator;
    }
}

function redirect(equipment, lot) {

    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackIn" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/EProcedure?Equipment=' + equipment + "&Lot=" + lot + "&from=TrackIn" + "&UserID=" + operator;
    }
}

function LockDiv()
{
    $('#modal_div').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function SendCommand(msgID)
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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedOPC(false, ' + "'" + msgID + "'" + ');">OK</button>';
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

function notification_modal_brandedQuantity(msgID) {

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
    modal += '<button type="button" class="btn btn-success" onclick="SendCommand(' + "'" + msgID + "'" + ');">OK</button>';
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
        url: '/TrackIn/GetEquipmentTypeJoin',
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
function ProcessLot(check)
{
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val().trim();

    var temp = 0;
    if (check != null)
    {
        if (check == true)
        {
            temp = 1;
        }
        else
        {
            temp = 0;
        }
    }
    else
    {
        temp = 0;
    }
    
    if ((equipmentQueryString == null || equipmentQueryString == "") && temp == 0)
    {
        if (user == "")
        {
            notification_modal_dynamic('Notification', 'Enter Operator', 'danger', identifier);
            identifier++;
            return;
        }

        $.ajax({
            url: '/TrackIn/GetLotLocation',
            data: { LotNo: lot },
            contentType: 'application/json',
            dataType: 'json',
            method: 'GET'
        }).success(function (val) {

            $.ajax({
                url: '/TrackIn/GetTrackInEquipment',
                data: { LotNo: lot, UserID: user, Location: val.Location },
                contentType: 'application/json',
                dataType: 'json',
                method: 'GET'
            }).success(function (trackEquip) {

                var lst = trackEquip.Equipment;

                if (lst != null) {
                    if (lst.length > 0)
                    {
                        var hasEquip = false;
                        $('#ddEquipment').empty();
                        $('#ddEquipment').append($('<option></option>').val('Select Machine').html('Select Machine'));

                        for (var i = 0; i < lstEquipmentText.length; i++) {
                            if (lst.includes(lstEquipmentText[i])) {
                                $('#ddEquipment').append($('<option></option>').val(lstEquipmentVal[i]).html(lstEquipmentText[i]));
                                hasEquip = true;
                            }
                        }

                        if (hasEquip == true)
                        {
                            $("#ddEquipment").prop('selectedIndex', 1);

                            var equipmentID = $('#ddEquipment').val();

                            $.ajax({
                                url: '/TrackIn/GetEquipmentTypeJoin',
                                data: { ID: equipmentID },
                                method: 'GET'
                            }).success(function (type) {

                                global_type = type.toUpperCase();
                                var divTolerance = $('#divTolerance');

                                if (global_type == "LASER MARK TEST") {
                                    divTolerance.show();
                                }
                                else {
                                    divTolerance.hide();
                                }
                            });

                            getLotInfo(function (output) {

                                if (global_type == "LASER MARK TEST") {

                                    getTemplateInfo();
                                    $('#divTemplateInfo').show();
                                }
                                else {
                                    $('#divTemplateInfo').hide();
                                }
                            });
                        }
                        else
                        {
                            $("#ddEquipment").prop('selectedIndex', 0);

                            getLotInfo(function (output) {
                                global_type = "";
                                $('#divTemplateInfo').hide();
                            });
                        }
                    }
                    else
                    {
                        $("#ddEquipment").prop('selectedIndex', 0);
                        getLotInfo(function (output) {
                            global_type = "";
                            $('#divTemplateInfo').hide();
                        });
                    }
                }
                else
                {
                    $("#ddEquipment").prop('selectedIndex', 0);
                    getLotInfo(function (output) {
                        global_type = "";
                        $('#divTemplateInfo').hide();
                    });
                }

            });

        });
    }
    else
    {
        if (processQueryString != null && processQueryString != "") {
            if (processQueryString.toUpperCase() == "FROMINBOX") {
                getLotInfo(function (output) {
                    if (global_type == "LASER MARK TEST") {
                        getTemplateInfo();
                        getTrackedValues();
                        $('#divTemplateInfo').show();
                    }
                    else {
                        $('#divTemplateInfo').hide();
                    }
                });
            }
        }
        else {
            getLotInfo(function (output) {

                if (global_type == "LASER MARK TEST") {

                    getTemplateInfo();
                    $('#divTemplateInfo').show();
                }
                else {
                    $('#divTemplateInfo').hide();
                }
            });
        }

    }
    
}

//for getting the lot info
function getLotInfo(callback) {

    var isLotInfo = false;
    var lot = $('#txtLotNumber').val().trim().toUpperCase();

    if (lot == "") {
        notification_modal_dynamic("Notification", "Enter Lot Number", "danger", identifier);
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

    $("#txtProductName").attr("disabled", "disabled");
    $("#txtProductLine").attr("disabled", "disabled");
    $("#txtProcessSpecObjectCategory").attr("disabled", "disabled");
    $("#txtLotStatus").attr("disabled", "disabled");
    $("#txtStep").attr("disabled", "disabled");

    $("#divLotInfo").show();

    $.ajax({
        url: '/TrackIn/GetLotInfo',
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
            $('#divLotResult').show();
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
        url: '/TrackIn/GetLotInfo',
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
            $('#divLotResult').show();
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

            $('#divLotResult').show();

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

        $('#divLotResult').show();

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

    //get the data first from WEB UI database
    $.ajax({
        url: '/TrackIn/GetDataFromDCC',
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
                url: '/TrackIn/GetLineNumber',
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
                        $("#txtLine" + x).attr("disabled", "disabled");
                    }

                    $.ajax({
                        url: '/TrackIn/GetLineText',
                        data: { MarkingInstructionID: markingInstructionID, PartNum: val.PartNo, LotNo: lot, PkgTemp: val.PkgTemp },
                        method: 'GET'
                    }).success(function (customText) {
                        var strArray = customText.split(';');

                        var preview = '<label>Preview:</label><div style="text-align:center;border:5px solid #00ff90;font-weight: bold;">';

                        var lines = "";

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

                            try {
                                $("#txtLine" + lineName).val(lineText);
                                lines += lineText + "<br/>";

                            }
                            catch (e) { }
                        }

                        preview += lines + '</div>';
                        $("#divPreview").append(preview);
                        $("#divPreview").show();

                    });
                }

                $("#divTemplateInfo").show();
                $("#divLotInfo").show();

                $('#lblTemplateResult').text('Template Information Retrieval Success: ' + productName);
                isTemplate = true;
                $('#lblTemplateResult').css("color", "green");
                $('#btnSend').removeAttr("disabled");
                $('#divTemplateResult').show();

            }).error(function (e) {

                if (productName == "")
                {
                    $('#lblTemplateResult').text('No Product Name Associated with Lot Number');
                }
                else
                {
                    $('#lblTemplateResult').text('Template Information Retrieval Failed: ' + productName);
                }

                $('#divTemplateResult').show();
                $("#divTemplateInfo").show();
                $('#lblTemplateResult').css("color", "red");
                $('#btnSend').attr("disabled", "disabled");

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

            $('#divTemplateResult').show();
            $("#divTemplateInfo").show();
            $('#lblTemplateResult').css("color", "red");
            $('#btnSend').attr("disabled", "disabled");

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
        
        $('#divTemplateResult').show();
        $("#divTemplateInfo").show();
        $('#lblTemplateResult').css("color", "red");
        $('#btnSend').attr("disabled", "disabled");

        isTemplate = false;

        try {
            callback(isTemplate);
        }
        catch (e) { }
    });

}

//setting the tolerance
function setTolerance()
{
    if ($("#txtQuantity").val() != null && $("#txtQuantity").val() != "") {
        $.ajax({
            url: '/TrackIn/GetTolerance',
            data: { quantity: $("#txtQuantity").val() },
            method: 'GET'
        }).success(function (val) {

            $("#txtToleranceQuantity").val(val);

        }).error(function (e) {
            notification_modal_dynamic("Notification", "Invalid Quantity", 'danger', identifier);
            identifier++;
            $("#txtQuantity").val(0);
            $("#txtToleranceQuantity").val(0);
        });
    }
    else {
        $("#txtQuantity").val(0);
        $("#txtToleranceQuantity").val(0);
    }

    setTolerancePercent('lblTolerancePercent');
}

function setTolerancePercent(labelName)
{
    $.ajax({
        url: '/TrackIn/GetTolerancePercent',
        method: 'GET'
    }).success(function (val) {
        $('#' + labelName).text("(" + val + "%)");

    });
}

//setting the branded tolerance
function setToleranceBranded() {

    if ($("#txtBrandedQuantity").val() != null && $("#txtBrandedQuantity").val() != "") {
        $.ajax({
            url: '/TrackIn/GetTolerance',
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

    if (operator == "" || lotNo == "" || quantity == "" || index == 0 || index == -1)
    {
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
            url: '/TrackIn/IsEquipmentProcessing',
            data: { equipment: equipment },
            method: 'GET'
        }).success(function (result) {

            if (result == false)
            {
                getLotInfo_NoQty()
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
    ProceedOPC(true, null);
}

function ProceedOPC(isTrackin, msgID) {

    var equipment = $("#ddEquipment option:selected").text();
    var type = global_type;

    if (type == "LASER MARK TEST") {
        confirm_branded = 1;
        $("#modal_div_branded").modal("hide");
    }
    
    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/TrackIn/GetTolerancePercent',
        method: 'GET'
    }).success(function (tolerancePercent) {

        $.ajax({
            url: '/TrackIn/getProcessedQTY',
            data: { equipment: equipment },
            method: 'GET'
        }).success(function (TotalProcessedQTY) {

            $.ajax({
                url: '/TrackIn/getTrackInQty',
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
                        url: '/TrackIn/OPCSendCommand',
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

        var msg = "Template Loaded Successfully";
        markAsBrand(markReq, msg, ident);

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
        url: '/TrackIn/GetLotLocation',
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
            url: '/TrackIn/FirstInsert',
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
                        url: '/TrackIn/TrackIn',
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
        url: '/TrackIn/markAsBrand',
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




