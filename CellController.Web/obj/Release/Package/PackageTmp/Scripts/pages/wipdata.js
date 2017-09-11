var identifier = 1;
var equipmentQueryString = "";
var lotQueryString = "";
var userQueryString = "";
var processQueryString = "";

$(document).ready(function (e) {

    equipmentQueryString = getParameterByName("Equipment");
    lotQueryString = getParameterByName("Lot");
    userQueryString = getParameterByName("UserID");
    processQueryString = getParameterByName("Process");

    appendGroupEquipment();

    var username = getCookie("Username");

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

    var ddCount = $('#ddEquipment > option').length;

    //if (equipmentQueryString != null && equipmentQueryString != "") {
    //    $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
    //    //$("#ddEquipment").trigger("change");
    //    $("#ddEquipment").attr("disabled", "disabled");
    //}
    //else {
    //    if (ddCount > 1) {
    //        $("#ddEquipment").prop('selectedIndex', 1);
    //        //$("#ddEquipment").trigger("change");
    //    }
    //}
    //appendGroupEquipment();

    $('#btnWIPData').click(function(){
        WIPData();
    });

    $('#btnCheckLot').click(function (event) {
        getLotInfo();
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

    $("#ddService").prop('selectedIndex', 1);

    $('#ddService').change(function () {
        var service = $('#ddService').val();

        if (service == "LotMoveOut" || service == "TrackInLot")
        {
            $('#divMachine').hide();
        }
        else
        {
            $('#divMachine').show();
        }

        getLotInfo();
    });

    var from = getParameterByName("from");

    if (from != "" && from != null)
    {
        if (from == "TrackIn")
        {
            $("#ddService").prop('selectedIndex', 1);
            $('#divMachine').hide();
        }
        else if (from == "TrackOut")
        {
            $("#ddService").prop('selectedIndex', 2);
            $('#divMachine').show();
        }
        else if (from == "MoveOut") {
            $("#ddService").prop('selectedIndex', 3);
            $('#divMachine').hide();
        }
        else if (from == "Home") {
            $("#ddService").prop('selectedIndex', 2);
            $('#divMachine').hide();
        }

        $('#txtLotNumber').attr("disabled", "disabled");
        $("#ddService").attr("disabled", "disabled");
    }

    $('#btnBack').click(function () {

        if (from == "Home")
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

    $('#btnWIPData').attr("disabled", "disabled");

    if (lotQueryString != null && lotQueryString != "") {
        $('#btnBack').show();
        $('#btnFocusLotNumber').attr("disabled", "disabled");
        $('#btnCheckLot').attr("disabled", "disabled");
        $('#txtLotNumber').val(lotQueryString);
        getLotInfo();
    }

    HideLoading();
});

function appendGroupEquipment() {

    $.ajax({
        url: '/WIPData/GetGroupIDConnection',
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

function getLotInfo() {

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val().trim();
    $('#divDataCollection').empty();

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

    $.ajax({
        url: '/WIPData/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'get'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";

            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/WIPData/FirstInsert',
                data: { userID: user, lotNo: lot, location: location},
                method: 'POST',
                beforeSend: function (xhr) {
                    $('#btnWIPData').attr("disabled", "disabled");
                }
            }).success(function (val) {

                $('#btnWIPData').removeAttr("disabled");

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {
                    var index = $("#ddEquipment option:selected").index();
                    var index2 = $("#ddService option:selected").index();

                    var from = getParameterByName("from");

                    if (index == 0 && from == "TrackOut")
                    {
                        notification_modal_dynamic("Notification", "Please select Equipment", "danger", identifier);
                        identifier++;
                        return;
                    }

                    if (index2 == 0) {
                        notification_modal_dynamic("Notification", "Please select Service Type", "danger", identifier);
                        identifier++;
                        return;
                    }

                    var equipment = $("#ddEquipment option:selected").text();
                    var service = $("#ddService option:selected").val(); 

                    $.ajax({
                        url: '/WIPData/GetWIPColumns',
                        data: { LotNo: lot, Equipment: equipment, ServiceType: service, UserID: user },
                        method: 'GET'
                    }).success(function (json){

                        var obj = JSON.parse(json);

                        if (obj.length > 0)
                        {
                            var txtbox;
                            var label;
                            var div;

                            div = '<div class="form-group col-md-12">WIP Data Collection:</div>';
                            $('#divDataCollection').append(div);

                            for (var i = 0; i < obj.length; i++) {

                                div = '<div id="divObj' + i + '" class="form-group col-md-12">'
                                label = '<label id="lblObj' + i + '" for="txtObj' + i + '">' + obj[i].Field + "</label>";
                                txtbox = '<input type="text" class="form-control" id="txtObj' + i + '" placeholder="' + obj[i].Field + '" value="' + obj[i].Value + '">';
                                div += label + txtbox + '</div>';

                                $('#divDataCollection').append(div);
                            }
                        }
                        else
                        {
                            //notification_modal_dynamic("Notification", "No WIP Data Collection", "danger", identifier);
                            //identifier++;
                        }

                    }).error(function (){
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", "danger", identifier);
                        identifier++;
                    });
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

function WIPData()
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

    var index2 = $("#ddService option:selected").index();

    if (index2 == 0) {
        notification_modal_dynamic("Notification", "Please select Service Type", 'danger', identifier);
        identifier++;
        return;
    }

    var index = $("#ddEquipment option:selected").index();

    var service = $('#ddService').val();
    var isEquip = false;

    if (service == "LotMoveOut" || service == "TrackInLot") {
        isEquip == false;
    }
    else {
        isEquip == true;
    }

    if (index == 0 && isEquip == true) {
        notification_modal_dynamic("Notification", "Please select Machine", 'danger', identifier);
        identifier++;
        return;
    }


    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val().trim();

    $.ajax({
        url: '/WIPData/GetLotInfo',
        data: { LotNo: lot },
        contentType: 'application/json',
        dataType: 'json',
        method: 'get'
    }).success(function (result) {

        if (result.ContainerName != null && result.ContainerName != "") {

            var location = "";

            location = result.ProcessSpecObjectCategory;

            $.ajax({
                url: '/WIPData/FirstInsert',
                data: { userID: user, lotNo: lot, location: location },
                method: 'POST'
            }).success(function (val) {

                if (val.toUpperCase().includes("ERROR")) {
                    var temp = val.replace("ERROR:", "").replace("Error:", "");
                    notification_modal_dynamic("Notification", temp, "danger", identifier);
                    identifier++;
                }
                else {
                    notification_modal_confirm();
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

//build notification modal for adding loss reason
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
    modal += "Are you sure you want to submit WIP Data?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="SubmitWIPData();">OK</button>';
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

function SubmitWIPData()
{
    $("#modal_div").modal("hide");

    var lot = $('#txtLotNumber').val().trim().toUpperCase();
    var user = $('#txtOperator').val().trim();
    var index = $("#ddEquipment option:selected").index();
    var equipment = $("#ddEquipment option:selected").text();
    var service = $("#ddService option:selected").val();

    var divs = [];
    $("#divDataCollection div").each(function () {
        divs.push($(this).attr("id"));
    });
    
    var arrField = [];
    var arrVal = [];

    for (var i = 0; i < divs.length; i++)
    {
        if (divs[i] != undefined && divs[i] != null)
        {
            temp = divs[i].replace('divObj', '');
            var lbl = $('#lblObj' + temp).text();
            var txt = $('#txtObj' + temp).val();

            arrField.push(lbl);
            arrVal.push(txt);
        }
    }

    var temp_identifier = 0;

    if (arrField.length > 0)
    {
        if (index == 0)
        {
            equipment = "";
        }

        $.ajax({
            url: '/WIPData/WIPData',
            data: { LotNo: lot, Equipment: equipment, ServiceType: service, lstField: arrField, lstValue: arrVal, UserID: user },
            method: 'POST',
            beforeSend: function ()
            {
                notification_modal_dynamic_loading("Notification", 'Submitting WIP Data... Please wait.', 'success', identifier);
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
                    notification_modal_dynamic_redirect("Notification", temp, 'success', identifier);
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
    else
    {
        notification_modal_dynamic("Notification", "No WIP Data Collection for this Lot", "danger", identifier);
        identifier++;
    }
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

    if (from != "" && from != null) 
    {
        $("#modal_div" + ident).on("hidden.bs.modal", function () {
            
            if (processQueryString != null && processQueryString != "")
            {
                document.location.href = '/' + from + '?Equipment=' + equipmentQueryString + "&Lot=" + lotQueryString + "&UserID=" + userQueryString + "&Process=" + "fromInbox";
            }
            else
            {
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


