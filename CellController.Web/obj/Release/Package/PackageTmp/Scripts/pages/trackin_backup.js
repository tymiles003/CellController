var identifier = 1;
var random = "";
var global_type = "";
var equipmentQueryString = "";
var confirm_branded = 0;
var isTemplate = false;
var global_lotNumber = "";
var global_old_type = "";

$(document).ready(function (e) {
    
    equipmentQueryString = getParameterByName("Equipment");

    $('#divTolerance').hide();
    $("#txtQuantity").val("0");

    $('#txtLotNumber').keypress(function (event)
    {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 13)
        {
            ProcessLot();
        }
    });

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
    $("#txtQuantity").blur(function () {

        setTolerance();
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

    //if (EmployeeNumber.length > 4) {
    //    EmployeeNumber = EmployeeNumber.slice(-4);
    //    $("#txtOperator").attr("disabled", "disabled");
    //}

    var uname = getCookie("Username");
    if (uname != null && uname != "")
    {
        $("#txtOperator").attr("disabled", "disabled");
    }
    

    //$("#txtOperator").val(EmployeeNumber);
    $("#txtOperator").val(uname);
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

            var lot = $('#txtLotNumber').val();

            if (lot != "" && lot != global_lotNumber)
            {
                ProcessLot();
            }

            if (lot != "" && global_type != global_old_type) {
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

        notification_modal_brandedQuantity();

        //$.ajax({
        //    url: '/Global/AddGlobal',
        //    data: { key: "MyKey", value: getCookie("Username") },
        //    method: 'POST'
        //}).success(function (result)
        //{
        //    alert(result);

        //});
    });

    $('#btnGet').click(function () {

        //notification_modal_brandedQuantity();

        //$.ajax({
        //    url: '/Global/GetGlobal',
        //    method: 'GET'
        //}).success(function (result) {
        //    alert(result);

        //});
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
    
    //if the url has query string select the equipment from dropdown
    if (equipmentQueryString != null && equipmentQueryString != "") {
        $("#ddEquipment option:contains(" + equipmentQueryString + ")").attr('selected', 'selected');
        $("#ddEquipment").trigger("change");
        $("#ddEquipment").attr("disabled", "disabled");
    }
    else
    {
        if (ddCount > 1) {
            $("#ddEquipment").prop('selectedIndex', 1);
            $("#ddEquipment").trigger("change");
        }
    }

    setTolerancePercent('lblTolerancePercent');
    HideLoading();

});

function ProceedCommand() {

    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();
    var command = '';

    confirm_branded = 1;
    $("#modal_div_branded").modal("hide");

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    var numberLine = $('#txtNumLine').val();

    if (numberLine == "" || numberLine == null) {
        numberLine = 0;
    }

    //build the command

    //command += "TTYPE=" + $('#txtTType').val() + ";";
    if ($('#txtTType').val() == "" || $('#txtTType').val() == null) {
        command += "TTYPE=" + "0" + ";";

        setCookie(equipment + "_tempTType", 0, 30);
    }
    else {
        command += "TTYPE=" + $('#txtTType').val() + ";";
        
        setCookie(equipment + "_tempTType", $('#txtTType').val(), 30);
    }

    command += "LOT=" + $('#txtLotNumber').val() + ";";
    setCookie(equipment + "_tempLOT", $('#txtLotNumber').val(), 30);

    command += "PRODUCT=" + $('#txtProductName').val() + ";";
    setCookie(equipment + "_tempProd", $('#txtProductName').val(), 30);

    command += "PARTNUM=" + $('#txtPartNo').val() + ";";
    setCookie(equipment + "_tempPartNo", $('#txtPartNo').val(), 30);

    command += "QUANTITY=" + $('#txtBrandedQuantity').val() + ";";
    setCookie(equipment + "_tempQuantity", $('#txtBrandedQuantity').val(), 30);

    command += "TOLERANCE=" + $('#txtBrandedToleranceQuantity').val() + ";";
    setCookie(equipment + "_tempTolerance", $('#txtBrandedToleranceQuantity').val(), 30);

    //command += "ACTUAL_QTY=" + "1000" + ";"; //not used

    //var markReq = $("#ddMarkReq option:selected").val().toUpperCase();
    var markReq = "";

    var brandedQuantity = parseInt($('#txtBrandedQuantity').val());
    if (brandedQuantity == 0) {
        markReq = "YES";
    }
    else {
        markReq = "NO";
    }

    command += "MARKREQ=" + markReq + ";";
    setCookie(equipment + "_tempMarkReq", markReq, 30);

    var NoMarkTemplate = "";
    //command += "TEMPLATE=" + $('#txtTemplate').val() + ";";
    if (markReq.toUpperCase() == "YES") {
        command += "TEMPLATE=" + $('#txtTemplate').val() + ";";

    }
    else {
        NoMarkTemplate = "NOMARK.tpl";
        command += "TEMPLATE=" + NoMarkTemplate + ";";
    }

    setCookie(equipment + "_tempTemplate", $('#txtTemplate').val(), 30);
    setCookie(equipment + "_tempNoMarkTemplate", NoMarkTemplate, 30);

    command += "PKG_TEMP=" + $('#txtPkgTemp').val() + ";";
    setCookie(equipment + "_tempPKGTemp", $('#txtPkgTemp').val(), 30);

    command += "NUMLINE=" + numberLine + ";";
    setCookie(equipment + "_tempNumLine", numberLine, 30);

    var tempLine = "";

    for (var a = 1; a <= numberLine; a++) {
        command += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
        tempLine += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
    }

    setCookie(equipment + "_tempLine", tempLine, 30);

    //alert('command: ' + command); return;
    //for forcing command values (testing)
    //int data type: TTYPE, QUANTITY, TOLERANCE, NUMLINE
    //command = 'TTYPE=222;LOT=1234567DDAA;PRODUCT=9146TSG-TN9146TN;PARTNUM=79810001;QUANTITY=1000;TOLERANCE=20;MARKREQ=YES;TEMPLATE=TRB-020_NX16-9146TSG-TN9146TN.XXX;PKG_TEMP=PCER150C;NUMLINE=3;LINE1=asd;LINE2=1234;LINE3=1111';

    var temp_identifier = 0;

    //for sending the opc command
    $.ajax({
        url: '/TrackIn/OPCSendCommand',
        data: { Equipment: equipment, Command: command, Type: global_type },
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
                var label = 'Send Command to Machine:&nbsp;<label style="color:green;">Success</label>';
                notification_modal_dynamic("Notification", label, 'success', identifier);
                identifier++;
            }
            else {
                parentModal = "modal_div" + identifier;
                if (brandedQuantity == 0) {
                    setCookie(equipment + "_isTrigger", 0, 30);
                }
                else {
                    setCookie(equipment + "_isTrigger", 1, 30);
                }

                var label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
                notification_modal_dynamic("Warning", label, 'warning', identifier);
                identifier++;
            }
        }
        else {
            var label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
            notification_modal_dynamic("Warning", label, 'warning', identifier);
            identifier++;
        }

    }).error(function (xhr, status, error) {
        var label = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
        notification_modal_dynamic("Warning", label, 'warning', identifier);
        identifier++;
    });
    
}

function SendCommnd()
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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedCommand();">OK</button>';
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

function notification_modal_brandedQuantity() {

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
    modal += '<button type="button" class="btn btn-success" onclick="SendCommnd();">OK</button>';
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
function ProcessLot()
{
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

//for getting the lot info
function getLotInfo(callback) {

    var isLotInfo = false;
    var lot = $('#txtLotNumber').val();

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
    var lot = $('#txtLotNumber').val();
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

                        //notification_modal_confirm_LM();
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
    var lot = $("#txtLotNumber").val();
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
    var lotNo = $('#txtLotNumber').val();
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
       getLotInfo_NoQty();
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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedTrackIn();">OK</button>';
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
    modal += '<button type="button" class="btn btn-success" onclick="ProceedTrackIn();">OK</button>';
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

//function for executing track in
function ProceedTrackIn()
{
    var operator = $('#txtOperator').val();
    var lotNo = $('#txtLotNumber').val();
    var quantity = $('#txtQuantity').val();
    var index = $("#ddEquipment option:selected").index();
    var comment = $('#txtComment').val().replace(/\r\n|\r|\n/g, " ");

    var equipment = $("#ddEquipment option:selected").text();
    var command = '';

    //determine equipment type and reset modal
    if (global_type == "LASER MARK TEST")
    {
        confirm_branded = 1;
        $("#modal_div_branded").modal("hide");
    }

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/TrackIn/GetLotLocation',
        data: { LotNo: lotNo },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET',
        beforeSend: function ()
        {
            $("#btnTrackIn").attr("disabled", "disabled");
        }
    }).success(function (result) {

        var location = "";
        location = result.Location;

        $.ajax({
            url: '/TrackIn/FirstInsert',
            data: { userID: operator, lotNo: lotNo, location: location },
            method: 'POST'
        }).success(function (returnval) {

            if (returnval != "" && returnval != null) {
                if (returnval.toUpperCase().includes("ERROR")) {
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
                            $("#btnTrackIn").removeAttr("disabled");
                            var trackintemp = trackinResult.replace("ERROR:", "").replace("Error:", "");
                            notification_modal_dynamic("Notification", trackintemp, 'danger', identifier);
                            identifier++;
                        }
                        else {

                            var trackintemp = trackinResult.replace("RESULT:", "").replace("Result:", "");

                            //determine equipment type and proceed to next process
                            if (global_type == "LASER MARK TEST")
                            {
                                var numberLine = $('#txtNumLine').val();

                                if (numberLine == "" || numberLine == null)
                                {
                                    numberLine = 0;
                                }

                                //build the command

                                //command += "TTYPE=" + $('#txtTType').val() + ";";
                                if ($('#txtTType').val() == "" || $('#txtTType').val() == null)
                                {
                                    command += "TTYPE=" + "0" + ";";
                                    setCookie(equipment + "_tempTType", 0, 30);
                                }
                                else
                                {
                                    command += "TTYPE=" + $('#txtTType').val() + ";";
                                    setCookie(equipment + "_tempTType", $('#txtTType').val(), 30);
                                }
                                
                                
                                command += "LOT=" + $('#txtLotNumber').val() + ";";
                                setCookie(equipment + "_tempLOT", $('#txtLotNumber').val(), 30);

                                command += "PRODUCT=" + $('#txtProductName').val() + ";";
                                setCookie(equipment + "_tempProd", $('#txtProductName').val(), 30);

                                command += "PARTNUM=" + $('#txtPartNo').val() + ";";
                                setCookie(equipment + "_tempPartNo", $('#txtPartNo').val(), 30);

                                command += "QUANTITY=" + $('#txtBrandedQuantity').val() + ";";
                                setCookie(equipment + "_tempQuantity", $('#txtBrandedQuantity').val(), 30);

                                command += "TOLERANCE=" + $('#txtBrandedToleranceQuantity').val() + ";";
                                setCookie(equipment + "_tempTolerance", $('#txtBrandedToleranceQuantity').val(), 30);

                                //command += "ACTUAL_QTY=" + "1000" + ";"; //not used

                                //var markReq = $("#ddMarkReq option:selected").val().toUpperCase();
                                var markReq = "";

                                var brandedQuantity = parseInt($('#txtBrandedQuantity').val());
                                if (brandedQuantity == 0)
                                {
                                    markReq = "YES";
                                }
                                else
                                {
                                    markReq = "NO";
                                }

                                command += "MARKREQ=" + markReq + ";";
                                setCookie(equipment + "_tempMarkReq", markReq, 30);

                                //command += "TEMPLATE=" + $('#txtTemplate').val() + ";";
                                var NoMarkTemplate = "";
                                if (markReq.toUpperCase() == "YES")
                                {
                                    command += "TEMPLATE=" + $('#txtTemplate').val() + ";";
                                    
                                }
                                else
                                {
                                    NoMarkTemplate = "NOMARK.tpl";
                                    command += "TEMPLATE=" + NoMarkTemplate + ";";
                                }

                                setCookie(equipment + "_tempTemplate", $('#txtTemplate').val(), 30);
                                setCookie(equipment + "_tempNoMarkTemplate", NoMarkTemplate, 30);
                                
                                command += "PKG_TEMP=" + $('#txtPkgTemp').val() + ";";
                                setCookie(equipment + "_tempPKGTemp", $('#txtPkgTemp').val(), 30);

                                command += "NUMLINE=" + numberLine + ";";
                                setCookie(equipment + "_tempNumLine", numberLine, 30);

                                var tempLine = "";

                                for (var a = 1; a <= numberLine; a++)
                                {
                                    command += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
                                    tempLine += 'LINE' + a + '=' + $('#txtLine' + a).val() + ";";
                                }

                                setCookie(equipment + "_tempLine", tempLine, 30);

                                //alert('command: ' + command); return;

                                //for forcing command values (testing)
                                //int data type: TTYPE, QUANTITY, TOLERANCE, NUMLINE
                                //command = 'TTYPE=222;LOT=1234567DDAA;PRODUCT=9146TSG-TN9146TN;PARTNUM=79810001;QUANTITY=1000;TOLERANCE=20;MARKREQ=YES;TEMPLATE=TRB-020_NX16-9146TSG-TN9146TN.XXX;PKG_TEMP=PCER150C;NUMLINE=3;LINE1=asd;LINE2=1234;LINE3=1111';
                                
                                var temp_identifier = 0;

                                //for sending the opc command
                                $.ajax({
                                    url: '/TrackIn/OPCSendCommand',
                                    data: { Equipment: equipment, Command: command, Type: global_type },
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
                                            var base = 'All transactions were executed successfully:';
                                            var label1 = 'Lot Track In:&nbsp;<label style="color:green;">Success</label>';
                                            var label2 = 'Send Command to Machine:&nbsp;<label style="color:green;">Success</label>';
                                            notification_modal_dynamic("Notification", base + "<br/ ><br />" + label1 + "<br />" + label2, 'success', identifier);
                                            identifier++;
                                        }
                                        else {
                                            var base = 'Not all transactions were executed successfully:';
                                            var label1 = 'Lot Track In:&nbsp;<label style="color:green;">Success</label>';
                                            var label2 = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
                                            var label3 = 'Error:&nbsp;<label style="color:red;">' + opcResult.Result + '</label>';

                                            parentModal = "modal_div" + identifier;
                                            if (brandedQuantity == 0)
                                            {
                                                setCookie(equipment + "_isTrigger", 0, 30);
                                            }
                                            else
                                            {
                                                setCookie(equipment + "_isTrigger", 1, 30);
                                            }

                                            notification_modal_dynamic("Warning", base + "<br/ ><br />" + label1 + "<br />" + label2 + "<br />" + label3, 'warning', identifier);
                                            identifier++;
                                        }
                                    }
                                    else {
                                        var base = 'Not all transactions were executed successfully:';
                                        var label1 = 'Lot Track In:&nbsp;<label style="color:green;">Success</label>';
                                        var label2 = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
                                        notification_modal_dynamic("Warning", base + "<br/ ><br />" + label1 + "<br />" + label2, 'warning', identifier);
                                        identifier++;
                                    }

                                }).error(function (xhr, status, error) {
                                    $("#btnTrackIn").removeAttr("disabled");
                                    var base = 'Not all transactions were executed successfully:';
                                    var label1 = 'Lot Track In:&nbsp;<label style="color:green;">Success</label>';
                                    var label2 = 'Send Command to Machine:&nbsp;<label style="color:red;">Failed</label>';
                                    notification_modal_dynamic("Warning", base + "<br/ ><br />" + label1 + "<br />" + label2, 'warning', identifier);
                                    identifier++;
                                });
                            }
                            else
                            {
                                $("#btnTrackIn").removeAttr("disabled");
                                notification_modal_dynamic("Notification", trackintemp, 'success', identifier);
                                identifier++;
                            }
                        }

                    }).error(function (e) {
                        $("#btnTrackIn").removeAttr("disabled");
                        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                        identifier++;
                    });
                }
            }
            else {
                $("#btnTrackIn").removeAttr("disabled");
                notification_modal_dynamic("Notification", "Camstar First Insertion Failed on Lot Number: " + lotNo, 'danger', identifier);
                identifier++;
            }

        }).error(function (e) {
            $("#btnTrackIn").removeAttr("disabled");
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        });
    }).error(function (e) {
        $("#btnTrackIn").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}



