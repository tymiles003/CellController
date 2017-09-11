var identifier = 1;
var equipmentQueryString = "";
var processQueryString = "";
var userQueryString = "";
var lotQueryString = "";

$(document).ready(function (e) {

    equipmentQueryString = getParameterByName("Equipment");
    lotQueryString = getParameterByName("Lot");
    userQueryString = getParameterByName("UserID");
    processQueryString = getParameterByName("Process");

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
                    GetLotInfo();
                }
            });
        }
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

    $("#txtLotNumber").codeScanner({
        onScan: function ($element, code) {

            $("#txtLotNumber").val(code);
            GetLotInfo();
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

    //button click handler
    $('#btnCheckLot').click(function () {

        GetLotInfo();
    });

    //make the textbox to accept only numbers
    $('#txtQuantity' + ',' + '#txtScrapQuantity').keydown(function (e) {

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

    $('#btnEProcedure').click(function (event) {
        gotoEProc();
    });

    $('#btnWIPData').click(function (event) {
        gotoWIPData();
    });

    $('#btnMoveOut').click(function (event) {
        MoveOut();
    });

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

    if (lotQueryString != null && lotQueryString != "") {

        $('#txtLotNumber').val(lotQueryString);
        GetLotInfo();
        HideLoading();
    }
    else
    {
        HideLoading();
    }
    
});

function GetLotInfo()
{
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    $('#txtScrapQuantity').val("");

    if (lot != "")
    {
        $.ajax({
            url: '/MoveOut/GetLotLocation',
            data: { LotNo: lot },
            contentType: 'application/json',
            dataType: 'json',
            method: 'GET'
        }).success(function (val) {
            if (val.Location != null) {

                var location = val.Location;

                $.ajax({
                    url: '/MoveOut/GetLotInfo',
                    data: { LotNo: lot },
                    contentType: 'application/json',
                    dataType: 'json',
                    method: 'GET'
                }).success(function (result) {
                   
                    if (result.ContainerName != null && result.ContainerName != "") {
                        $("#txtQuantity").val(result.Qty);
                        $("#txtScrapQuantity").val("0");
                    }
                });
            }
            else
            {
                notification_modal_dynamic("Notification", "Invalid Lot Number", "danger", identifier);
                identifier++;
                return;
            }
        });
    }
    else
    {
        notification_modal_dynamic("Notification", "Enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }
}

function MoveOut()
{
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var scrap = $('#txtScrapQuantity').val();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var user = $('#txtOperator').val();

    if (lot == "") {
        notification_modal_dynamic("Notification", "Enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }

    if (quantity == "") {
        notification_modal_dynamic("Notification", "Enter Move Out Quantity", "danger", identifier);
        identifier++;
        return;
    }

    if (scrap == "") {
        notification_modal_dynamic("Notification", "Enter Scrap Quantity", "danger", identifier);
        identifier++;
        return;
    }

    notification_modal_confirm_moveout();
}

function notification_modal_confirm_moveout() {

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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedMoveOut();">OK</button>';
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

function ProceedMoveOut()
{
    $("#modal_div").modal("hide");

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var quantity = $('#txtQuantity').val();
    var scrap = $('#txtScrapQuantity').val();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");
    var user = $('#txtOperator').val();

    $.ajax({
        url: '/MoveOut/GetLotLocation',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (val) {
        if (val.Location != null) {

            var location = val.Location;

            var temp_identifier = 0;

            $.ajax({
                url: '/MoveOut/MoveOut',
                data: { userID: user, lotNo: lot, moveOutQty: quantity, TotalScrapQty: scrap, comment: comment, location: location },
                method: 'POST',
                beforeSend: function ()
                {
                    notification_modal_dynamic_loading("Notification", 'Moving Out... Please wait.', 'success', identifier);
                    temp_identifier = identifier;
                    identifier++;
                }
            }).success(function (moveOutResult) {

                setTimeout(function () {

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    if (moveOutResult.toUpperCase().includes("ERROR")) {
                        var temp = moveOutResult.replace("ERROR:", "").replace("Error:", "");
                        notification_modal_dynamic("Notification", temp, 'danger', identifier);
                        identifier++;
                    }
                    else {
                        var temp = moveOutResult.replace("RESULT:", "").replace("Result:", "");
                        notification_modal_dynamic("Notification", temp, 'success', identifier);
                        identifier++;
                    }

                }, 1000);

            }).error(function () {

                setTimeout(function () {

                    $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
                    $("#modal_div" + temp_identifier).modal("hide");

                    notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
                    identifier++;

                }, 1000);
            });

        }
        else {
            notification_modal_dynamic("Notification", "Invalid Lot Number", "danger", identifier);
            identifier++;
        }
    });
}

//function for redirecting to wip data
function gotoWIPData() {
    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (lot == "" || lot == null) {
        notification_modal_dynamic("Notification", "Please enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/MoveOut/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/MoveOut/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    redirect_wipdata(lot);
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

function redirect_wipdata(lot) {
    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/WIPData?Lot=' + lot + "&from=MoveOut" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/WIPData?Lot=' + lot + "&from=MoveOut" + "&UserID=" + operator;
    }
}

function gotoEProc() {

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val();

    if (lot == "" || lot == null) {
        notification_modal_dynamic("Notification", "Please enter Lot Number", "danger", identifier);
        identifier++;
        return;
    }

    $.ajax({
        url: '/MoveOut/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";
            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/MoveOut/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {

                    redirect(lot);
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

function redirect(lot) {

    var operator = $('#txtOperator').val();

    if (processQueryString != null && processQueryString != "") {
        document.location.href = '/EProcedure?Lot=' + lot + "&from=MoveOut" + "&UserID=" + operator + "&Process=fromInbox";
    }
    else {
        document.location.href = '/EProcedure?Lot=' + lot + "&from=MoveOut" + "&UserID=" + operator;
    }
}