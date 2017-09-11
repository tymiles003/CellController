var mCode;
var datatableContact, datatable_equip;
var indexContact, index_equip;
var identifier = 1;
var modal_checker = 0;

var id = '';
var model = '';
var serial = '';
var ip = '';
var port = '';
var deviceid = '';
var type = '';
var hostid = '';
var uID = "";

$(document).ready(function (e) {

    //assign create button onclick function
    $("#cmdAddNewEquipment").click(function () {
        showform.equipment('add');
        $('.modal-title').text('Add Machine');
    });

    $('#EquipmentGrid').on('rowclick', function (event) {
        var args = event.args;
        // row's bound index.
        var boundIndex = args.rowindex;
        // row's visible index.
        var visibleIndex = args.visibleindex;
        // right click.
        var rightclick = args.rightclick;
        // original event.
        var ev = args.originalEvent;

        var rowID = $("#EquipmentGrid").jqxGrid('getrowid', boundIndex);
        var data = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        datatable_equip = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        index_equip = boundIndex;
    });

    //assign click function for edit
    $(document).delegate(".EquipmentGrid_Edit", "click", function () {
        showform.equipment('edit', index_equip);
        $('.modal-title').text('Update Machine');
    });

    //assign click function for delete
    $(document).delegate(".EquipmentGrid_Delete", "click", function () {
        //get the rowid
        var rowID = $("#EquipmentGrid").jqxGrid('getrowid', index_equip);
        //get the date
        var data = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.id_number;
        //pass the id to be deleted
        notification_modal_confirm_delete(id);
    });

    //assign keyup function for search
    $(document).delegate("#EquipmentGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#EquipmentGrid_searchField').val();

        //assign columns to be queried
        var columns = ["equipment_id_string",
                        "model_string",
                        "serial_number_string",
                        "ip_string",
                        "port_string",
                        //"host_id_string",
                        "device_id_string",
                        "type_string"
        ];

        //pass the criteria to be searched
        generalSearch(search, "EquipmentGrid", columns, e);
    });

    HideLoading();

});

//function for building the html of the add/edit page
var showform = {

    equipment: function (operation, boundIndex) {

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#EquipmentGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);

            uID = data.id_number;
            id = data.equipment_id_string;
            model = data.model_string;
            serial = data.serial_number_string;
            ip = data.ip_string;
            port = data.port_string;
            deviceid = data.device_id_string;
            type = data.type_string;
            hostid = data.host_id_string;
        }

        var modal = "";

        modal += '<div class="modal fade" id="form_modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
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
        modal += '  <label for="txtEquipmentID">Equipment ID:</label>';
        modal += '  <input type="text" class="form-control inputtext" style="text-transform:uppercase;" placeholder="Equipment ID" id="txtEquipmentID" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtModel">Model:</label>';
        modal += '  <input type="text" class="form-control inputtext" placeholder="Model" id="txtModel" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtSerialNumber">Serial Number:</label>';
        modal += '  <input type="text" class="form-control inputtext" placeholder="Serial Number" id="txtSerialNumber" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtIP">IP:</label>';
        modal += '  <input type="text" class="form-control inputtext" placeholder="IP" id="txtIP" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12" style="display:none;">';
        modal += '  <label for="txtHostID">Host ID:</label>';
        modal += '  <input type="text" class="form-control inputtext" style="text-transform:uppercase;" placeholder="Host ID" id="txtHostID" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtPort">Port:</label>';
        modal += '  <input type="text" class="form-control inputtext" placeholder="Port" id="txtPort" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtDeviceID">Device ID:</label>';
        modal += '  <input type="text" class="form-control inputtext" placeholder="Device ID" id="txtDeviceID" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="ddType">Type:</label>';
        modal += '  <select id="ddType" class="form-control"><option selected disabled>Select Type</option></select>';
        modal += '<div></div>';

        modal += '</div>';

        modal += '</div>';

        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';

        if (operation.toUpperCase() == "ADD") {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="Save_Equip(' + "'add'" + ');">Add</button>';
        }
        else {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="Save_Equip(' + "'update'" + ');">Update</button>';
        }

        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        modal += '<script>';
        modal += '$(document).ready(function () {setup_equip("' + operation + '","");});';
        modal += '</script>';

        $("#form_modal").html(modal);
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    }
};

//function to populate data
function populate(transaction) {

    $.ajax({
        url: '/ManageEquipment/GetEquipmentType',
        method: 'get'
    }).success(function (val) {
        var json = JSON.parse(val);

        for (var i = 0; i < json.length; i++) {

            $('#ddType').append($('<option></option>').val(json[i].ID).html(json[i].Type));
        }

        if (transaction.toUpperCase() == "EDIT") {
            $("#txtEquipmentID").val(id);
            $("#txtHostID").val(hostid);
            $("#txtModel").val(model);
            $("#txtSerialNumber").val(serial);
            $("#txtIP").val(ip);
            $("#txtPort").val(port);
            $("#txtDeviceID").val(deviceid);

            $("#ddType").find("option:contains('" + type + "')").each(function () {
                if ($(this).text() == type) {
                    $(this).attr("selected", "selected");
                }
            })
        }
    });
}

//build html modal confirmation for adding
function notification_modal_confirm_add() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to add this machine?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="insertRecord_Equip();">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000002');

    $("#form_modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div").on("hidden.bs.modal", function () {

        if (modal_checker == 0) {
            $("#form_modal_div").modal("show");
        }
        else {
            $("#form_modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        modal_checker = 0;
    });
}

//build html modal confirmation for updating
function notification_modal_confirm_update() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to update this machine?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="updateRecord_Equip();">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000002');

    $("#form_modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div").on("hidden.bs.modal", function () {

        if (modal_checker == 0) {
            $("#form_modal_div").modal("show");
        }
        else {
            $("#form_modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        modal_checker = 0;
    });
}

//build html modal confirmation for deleting
function notification_modal_confirm_delete(equipID) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to delete this machine?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="deleteRecord_Equip(' + "'" + equipID + "'" + ');">OK</button>';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000002');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function ValidateIPaddress(ipaddress)
{
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true;
    }
    else
    {
        return false;
    }
}

//function for adding/updating
function Save_Equip(transaction) {

    id = $('#txtEquipmentID').val().trim().toUpperCase();
    model = $('#txtModel').val().trim();
    serial = $('#txtSerialNumber').val().trim();
    ip = $('#txtIP').val().trim();
    port = $('#txtPort').val().trim();
    deviceid = $('#txtDeviceID').val().trim();
    hostid = $('#txtHostID').val().trim().toUpperCase();
    type = $('#ddType').val();
    var index = $("#ddType option:selected").index();

    var isIPValid = ValidateIPaddress(ip);

    //validate the fields
    //if (id == "" || model == "" || serial == "" || ip == "" || port == "" || deviceid == "" || index == 0 || hostid == "")
    if (id == "" || model == "" || serial == "" || ip == "" || port == "" || deviceid == "" || index == 0)
    {
        notification_modal_dynamic_super("Notification", "All fields are required", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    if (isIPValid == false)
    {
        notification_modal_dynamic_super("Notification", "Enter a valid IP Address", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    //check if the equipment already exists
    if (transaction.toUpperCase() == "ADD") {
        $.ajax({
            url: '/ManageEquipment/CheckEquipment',
            method: 'get',
            data: { equipment: id }
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_add();
            }
            else {
                notification_modal_dynamic_super("Notification", "Machine already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
    else {
        
        $.ajax({
            url: '/ManageEquipment/CheckEquipmentForUpdate',
            method: 'get',
            data: { equipment: id , ID: uID}
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_update();
            }
            else {
                notification_modal_dynamic_super("Notification", "Machine already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
}

//function for setting up controls onload
function setup_equip(transaction)
{

    populate(transaction);

    $('#txtPort' + ',' + '#txtDeviceID').keydown(function (e) {

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

    $('#txtIP').keydown(function (e) {

        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||

        // Allow: backspace, delete, tab, escape, and enter
        //if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
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

    if (transaction.toUpperCase() != "ADD") {
        $("#txtEquipmentID").attr("disabled", "disabled");
    }
}

//function for inserting to table
function insertRecord_Equip() {
    
    $.ajax({
        url: '/ManageEquipment/AddEquipment',
        data: { equipmentID: id, model: model, serialNumber: serial, ip: ip, port: port, deviceID: deviceid, type: type, hostID : hostid},
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Added", 'success', identifier);
            identifier++;
        }
        else {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
            identifier++;
        }
    }).error(function (e) {
        modal_checker = 1;
        $("#modal_div").modal("hide");
        $("#form_modal_div").modal("hide");
        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
        identifier++;
    });
}

//function for updating the table
function updateRecord_Equip() {

    $.ajax({
        url: '/ManageEquipment/UpdateEquipment',
        data: { equipmentID: id, model: model, serialNumber: serial, ip: ip, port: port, deviceID: deviceid, type: type, hostID: hostid, ID: uID },
        method: 'post'
    }).success(function (val) {
        alert(val);
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Updated", 'success', identifier);
            identifier++;
        }
        else {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
            identifier++;
        }
    }).error(function (e) {
        modal_checker = 1;
        $("#modal_div").modal("hide");
        $("#form_modal_div").modal("hide");
        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
        identifier++;
    });

}

//function for deleting from the table
function deleteRecord_Equip(equipId) {

    $.ajax({
        url: '/ManageEquipment/DeleteEquipment',
        data: { equipmentID: equipId },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Deleted", 'success', identifier);
            identifier++;
        }
        else {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        $("#modal_div").modal("hide");
        $("#form_modal_div").modal("hide");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}


