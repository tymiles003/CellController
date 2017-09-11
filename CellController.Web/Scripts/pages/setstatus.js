identifier = 1;

$(document).ready(function (e) {

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
            $('#txtOperator').attr('readonly', 'readonly');
        }
    });

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

    $('#btnSubmit').click(function () {
       notification_modal_confirm_submit();
    });

    //dropdown onchange handler
    $('#ddEquipment').change(function () {

        var equipment = $("#ddEquipment option:selected").text()
        populateStatus(equipment);
    });

    $('#ddStatus').change(function () {

        var statusCode = $("#ddStatus option:selected").text()
        Repopulate(statusCode);
    });

    HideLoading();
});

function appendGroupEquipment() {

    $.ajax({
        url: '/SetStatus/GetGroupIDConnection',
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

function notification_modal_confirm_submit() {

    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var index2 = $("#ddStatus option:selected").index();
    var status = $("#ddStatus option:selected").text();
    var index3 = $("#ddStatusReason option:selected").index();
    var statusReason = $("#ddStatusReason option:selected").text();
    var user = $('#txtOperator').val();

    if (index == 0) {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    if (index2 == 0) {
        notification_modal_dynamic("Notification", "Please select Status", "danger", identifier);
        identifier++;
        return;
    }

    if (index3 == 0) {
        notification_modal_dynamic("Notification", "Please select Status Reason", "danger", identifier);
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

function populateStatus(equipment)
{
    var user = $('#txtOperator').val();

    if (user == "") {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    $("#ddStatus").find("option:not(:first)").remove();
    $("#ddStatusReason").find("option:not(:first)").remove();

    $.ajax({
        url: '/SetStatus/GetCamstarInitialStatus',
        method: 'GET',
        data : {Equipment: equipment, UserID: user}
    }).success(function (result) {

        if(result.ERROR == null)
        {
            //alert(result.StatusReason + "/" + result.StatusCode);

            $.ajax({
                url: '/SetStatus/PopulateCamstarEquipmentStatus',
                method: 'POST',
                data: { Equipment: equipment, UserID: user, Status: result.StatusReason, Type : 'STATUS_CODE' }
            }).success(function (val) {
                
                for(var i = 0; i<val.length; i++)
                {
                    $('#ddStatus').append($('<option></option>').val(val[i].Value).html(val[i].Value));
                }

                if (!$('#ddStatus').find("option:contains('" + result.StatusCode + "')").length) {
                    $('#ddStatus').append($('<option></option>').val(result.StatusCode).html(result.StatusCode));
                }

                $.ajax({
                    url: '/SetStatus/PopulateCamstarEquipmentStatus',
                    method: 'POST',
                    data: { Equipment: equipment, UserID: user, Status: result.StatusCode, Type: 'STATUS_REASON' }
                }).success(function (retVal) {

                    for (var x = 0; x < retVal.length; x++) {
                        $('#ddStatusReason').append($('<option></option>').val(retVal[x].Value).html(retVal[x].Value));
                    }

                    if (!$('#ddStatusReason').find("option:contains('" + result.StatusReason + "')").length) {
                        $('#ddStatusReason').append($('<option></option>').val(result.StatusReason).html(result.StatusReason));
                    }

                    var foption = $('#ddStatus' + ' option:first');
                    var soptions = $('#ddStatus' + ' option:not(:first)').sort(function (a, b) {
                        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                    });
                    $('#ddStatus').html(soptions).prepend(foption);

                    foption = $('#ddStatusReason' + ' option:first');
                    soptions = $('#ddStatusReason' + ' option:not(:first)').sort(function (a, b) {
                        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                    });
                    $('#ddStatusReason').html(soptions).prepend(foption);

                    $("#ddStatus option:contains(" + result.StatusCode + ")").attr('selected', 'selected');

                    $("#ddStatusReason option:contains(" + result.StatusReason + ")").attr('selected', 'selected');

                });

            });
        }
        else {
            $("#ddStatus").prop('selectedIndex', 0);
            $("#ddStatusReason").prop('selectedIndex', 0);
        }

    }).error(function(){
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

function Repopulate(statusCode)
{
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text()
    var user = $('#txtOperator').val();

    if (user == "") {
        notification_modal_dynamic("Notification", "Please enter Operator ID", "danger", identifier);
        identifier++;
        return;
    }

    if (index == 0) {
        notification_modal_dynamic("Notification", "Please select Machine", "danger", identifier);
        identifier++;
        return;
    }

    $("#ddStatusReason").find("option:not(:first)").remove();

    $.ajax({
        url: '/SetStatus/PopulateCamstarEquipmentStatus',
        method: 'POST',
        data: { Equipment: equipment, UserID: user, Status: statusCode, Type: 'STATUS_REASON' }
    }).success(function (retVal) {

        for (var x = 0; x < retVal.length; x++) {
            $('#ddStatusReason').append($('<option></option>').val(retVal[x].Value).html(retVal[x].Value));
        }

        var foption = $('#ddStatusReason' + ' option:first');
        var soptions = $('#ddStatusReason' + ' option:not(:first)').sort(function (a, b) {
            return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
        });
        $('#ddStatusReason').html(soptions).prepend(foption);

        $("#ddStatusReason").prop('selectedIndex', 0);

    });
}

function Submit()
{
    $("#modal_div").modal("hide");

    var equipment = $("#ddEquipment option:selected").text();
    var status = $("#ddStatus option:selected").text();
    var statusReason = $("#ddStatusReason option:selected").text();
    var user = $('#txtOperator').val();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var temp_identifier = 0;

    $.ajax({
        url: '/SetStatus/SubmitCamstarEquipmentStatus',
        data: { Equipment: equipment,statusCode: status, statusReason: statusReason, Comment: comment, UserID: user},
        method: 'POST',
        beforeSend: function () {
            notification_modal_dynamic_loading("Notification", 'Submitting Equipment Status... Please wait.', 'success', identifier);
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

    }).error(function(){

        setTimeout(function () {

            $("#notification_modal_dynamic_loading" + temp_identifier).modal("hide");
            $("#modal_div" + temp_identifier).modal("hide");

            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;

        }, 1000);
    });
}

