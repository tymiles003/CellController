var mCode;
var datatable, datatableContact, datatable_equip;
var index, indexContact, index_equip;
var identifier = 1;

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
    $("#cmdAddNew").click(function () {
        showform.equipment_enrollment('add');
        $('.modal-title').text('Add Enrollment');
    });

    $("#cmdAddNewEquipment").click(function () {
        showform.equipment('add');
        $('.modal-title').text('Add Equipment');
    });

    $('#UserEquipmentGrid').on('rowclick', function (event) {
        var args = event.args;
        // row's bound index.
        var boundIndex = args.rowindex;
        // row's visible index.
        var visibleIndex = args.visibleindex;
        // right click.
        var rightclick = args.rightclick;
        // original event.
        var ev = args.originalEvent;

        //get row id from grid
        var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', boundIndex);

        //get data based on row id
        var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        datatable = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        index = boundIndex;
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
    $(document).delegate(".UserEquipmentGrid_Edit", "click", function () {
        showform.equipment_enrollment('edit', index);
        $('.modal-title').text('Update Enrollment');
    });

    //assign click function for edit
    $(document).delegate(".EquipmentGrid_Edit", "click", function () {
        showform.equipment('edit', index_equip);
        $('.modal-title').text('Update Equipment');
    });

    //assign click function for delete
    $(document).delegate(".UserEquipmentGrid_Delete", "click", function () {
        //get the row id
        var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', index);
        //get the data
        var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.id_number;

        //pass the id to be deleted
        notification_modal_confirm_delete_enrollment(id);
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
    $(document).delegate("#UserEquipmentGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#UserEquipmentGrid_searchField').val();

        //assign columns to be queried
        var columns = ["equipment_id_string", "username_string", "type_string"];

        //pass the criteria to be searched
        generalSearch(search, "UserEquipmentGrid", columns, e);
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

    equipment_enrollment: function (operation, boundIndex) {
        var id = '';
        var equipid = '';
        var username = '';

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

            id = data.id_number;
            equipid = data.equipment_id_string;
            username = data.username_string;
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
        modal += '  <label for="ddEquipment">Equipment:</label>';
        modal += '  <select id="ddEquipment" class="form-control"><option selected disabled>Select Equipment</option></select>';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtUsername">Username:</label>';

        modal += '<div></div>';

        if (operation.toUpperCase() == "ADD") {
            modal += ' <input type="text" class="form-control inputtext" placeholder="Username" id="txtUsername" list="UserAutoCompleteList" /><datalist id="UserAutoCompleteList"></datalist>';
        }
        else {
            //modal += '  <input type="text" class="form-control inputtext" placeholder="Username" id="txtUsername" autocomplete="off" value="' + username + '">';
            modal += ' <input type="text" class="form-control inputtext" placeholder="Username" id="txtUsername" value="' + username + '" list="UserAutoCompleteList" /><datalist id="UserAutoCompleteList"></datalist>';
        }

        modal += '</div>';

        modal += '</div>';

        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';

        if (operation.toUpperCase() == "ADD") {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="Save(' + "'add'" + ",'" + id + "'" + ');">Add</button>';
        }
        else {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="Save(' + "'update'" + ",'" + id + "'" + ');">Update</button>';
        }

        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        modal += '<script>';
        if (operation.toUpperCase() == "ADD") {
            modal += '$(document).ready(function () {setup("' + operation + '","");});';
        }
        else {
            modal += '$(document).ready(function () {setup("' + operation + '","' + equipid + '");});';
        }
        modal += '</script>';

        $("#form_modal").html(modal);
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    },

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
        modal += '  <input type="text" class="form-control inputtext" placeholder="Equipment ID" id="txtEquipmentID" autocomplete="off">';
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
        modal += '  <input type="text" class="form-control inputtext" placeholder="Host ID" id="txtHostID" autocomplete="off">';
        modal += '</div>';

        //modal += '<div class="form-group col-md-12">';
        //modal += '  <label for="txtHostID">Host ID:</label>';
        //modal += '  <input type="text" class="form-control inputtext" placeholder="Host ID" id="txtHostID" autocomplete="off">';
        //modal += '</div>';

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

//function to populate the equipment dropdown
function populateEquipment(type, equipment) {

    //ajax call to the controller that will return list of equipments
    $.ajax({
        url: '/GenericEquipment/GetAllEquipment',
        method: 'get'
    }).success(function (val) {
        var json = JSON.parse(val);
        for (var i = 0; i < json.length; i++) {

            $('#ddEquipment').append($('<option></option>').val(json[i].ID).html(json[i].EquipID));
        }

        if (type.toUpperCase() == "EDIT") {
            $("#ddEquipment").find("option:contains('" + equipment + "')").each(function () {
                if ($(this).text() == equipment) {
                    $(this).attr("selected", "selected");
                }
            })
        }
    });
}

//function to populate data
function populate(transaction) {

    $.ajax({
        url: '/GenericEquipment/GetEquipmentType',
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
function notification_modal_confirm_add_enrollment(username, equipment) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to add this enrollment?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="insertRecord(' + "'" + username + "'" + ',' + "'" + equipment + "'" + ');">OK</button>';
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
    modal += "Are you sure you want to add this equipment?";
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

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//build html modal confirmation for updating
function notification_modal_confirm_update_enrollment(id, username, equipment) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to update this enrollment?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="updateRecord(' + "'" + id + "'" + ',' + "'" + username + "'" + ',' + "'" + equipment + "'" + ');">OK</button>';
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
    modal += "Are you sure you want to update this equipment?";
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

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//build html modal for deleting
function notification_modal_confirm_delete_enrollment(id) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to delete this enrollment?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="deleteRecord(' + "'" + id + "'" + ');">OK</button>';
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
    modal += "Are you sure you want to delete this equipment?";
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

//function for adding/updating
function Save(type, id) {

    var username = $('#txtUsername').val().trim();
    var equipment = $('#ddEquipment').val();
    var index = $("#ddEquipment option:selected").index();

    //validate the fields
    if (username == "" || index == 0) {
        notification_modal_dynamic("Notification", "All fields are required", 'danger', identifier);
        identifier++;
        return;
    }

    //if all fields contains values proceed to ajax call from controller to
    //check if the user exists in the table
    $.ajax({
        url: '/GenericEquipment/CheckUser',
        method: 'get',
        data: { username: username }
    }).success(function (result) {

        //if the validation of user is successful proceed
        //to ajax call

        if (result == "True") {
            //ajax call for validating if the equipment already exists in the table

            if (type.toUpperCase() == "ADD") {
                $.ajax({
                    url: '/GenericEquipment/ValidateEntry',
                    method: 'get',
                    data: { username: username, equipment: equipment }
                }).success(function (val) {

                    if (val == 0)
                    {

                        notification_modal_confirm_add_enrollment(username, equipment);
                    }
                    else {
                        notification_modal_dynamic("Notification", "Enrollment already exists", 'danger', identifier);
                        identifier++;
                    }
                }).error(function (e) {
                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                    identifier++;
                });
            }
            else
            {
                $.ajax({
                    url: '/GenericEquipment/ValidateEntryForUpdate',
                    method: 'get',
                    data: { username: username, equipment: equipment, ID: id }
                }).success(function (val) {

                    if (val == 0) {

                        notification_modal_confirm_update_enrollment(id, username, equipment);
                    }
                    else {
                        notification_modal_dynamic("Notification", "Enrollment already exists", 'danger', identifier);
                        identifier++;
                    }
                }).error(function (e) {
                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                    identifier++;
                });
                
            }
        }
        else {
            notification_modal_dynamic("Notification", "Username does not exists", 'danger', identifier);
            identifier++;
        }

    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

//function for adding/updating
function Save_Equip(transaction) {

    id = $('#txtEquipmentID').val().trim();
    model = $('#txtModel').val().trim();
    serial = $('#txtSerialNumber').val().trim();
    ip = $('#txtIP').val().trim();
    port = $('#txtPort').val().trim();
    deviceid = $('#txtDeviceID').val().trim();
    hostid = $('#txtHostID').val().trim();
    type = $('#ddType').val();
    var index = $("#ddType option:selected").index();

    //validate the fields
    //if (id == "" || model == "" || serial == "" || ip == "" || port == "" || deviceid == "" || index == 0 || hostid == "")
    if (id == "" || model == "" || serial == "" || ip == "" || port == "" || deviceid == "" || index == 0)
    {
        notification_modal_dynamic("Notification", "All fields are required", 'danger', identifier);
        identifier++;
        return;
    }

    //check if the equipment already exists
    if (transaction.toUpperCase() == "ADD") {
        $.ajax({
            url: '/GenericEquipment/CheckEquipment',
            method: 'get',
            data: { equipment: id }
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_add();
            }
            else {
                notification_modal_dynamic("Notification", "Equipment already exists", 'danger', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        });
    }
    else {
        
        $.ajax({
            url: '/GenericEquipment/CheckEquipmentForUpdate',
            method: 'get',
            data: { equipment: id , ID: uID}
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_update();
            }
            else {
                notification_modal_dynamic("Notification", "Equipment already exists", 'danger', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        });
    }
}

//function for setting up controls onload
function setup(type, equipment) {

    populateEquipment(type, equipment);

    $.ajax({
        url: '/GenericEquipment/GetAllUser',
        method: 'GET'
    }).success(function (val) {
        var json = JSON.parse(val);
        for (var i = 0; i < json.length; i++) {
            $('#UserAutoCompleteList').append('<option value="' + json[i].Username + '" />');
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    if (type.toUpperCase() != "ADD") {
        //for disabling the textbox
        $("#txtUsername").attr("disabled", "disabled");
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

    if (transaction.toUpperCase() != "ADD") {
        $("#txtEquipmentID").attr("disabled", "disabled");
    }
}

//function for inserting to table
function insertRecord(username, equipment) {
    
    $.ajax({
        url: '/GenericEquipment/AddEnrollment',
        data: { username: username, equipment: equipment },
        method: 'POST'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Added", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

//function for inserting to table
function insertRecord_Equip() {

    $.ajax({
        url: '/GenericEquipment/AddEquipment',
        data: { equipmentID: id, model: model, serialNumber: serial, ip: ip, port: port, deviceID: deviceid, type: type, hostID : hostid},
        method: 'POST'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Equipment Added", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });
}

//function for updating the table
function updateRecord(id, username, equipment) {
    
    $.ajax({
        url: '/GenericEquipment/UpdateEnrollment',
        data: { ID: id, username: username, equipment: equipment },
        method: 'POST'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Updated", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}

//function for updating the table
function updateRecord_Equip() {

    $.ajax({
        url: '/GenericEquipment/UpdateEquipment',
        data: { equipmentID: id, model: model, serialNumber: serial, ip: ip, port: port, deviceID: deviceid, type: type, hostID: hostid, ID: uID },
        method: 'POST'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Equipment Updated", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}

//function for deleting from the table
function deleteRecord(id) {
    
    $.ajax({
        url: '/GenericEquipment/DeleteEnrollment',
        data: { ID: id },
        method: 'POST'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Deleted", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}

//function for deleting from the table
function deleteRecord_Equip(equipId) {

    $.ajax({
        url: '/GenericEquipment/DeleteEquipment',
        data: { equipmentID: equipId },
        method: 'POST'
    }).success(function (val) {
        
        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Equipment Deleted", 'success', identifier);
            identifier++;
        }
        else {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    }).error(function (e) {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

}


//#region SampleCodeFromGatePass



//$("#UserEquipmentGrid").on('rowdoubleclick', function (event) {
//    var args = event.args;
//    // row's bound index.
//    var boundIndex = args.rowindex;
//    // row's visible index.
//    var visibleIndex = args.visibleindex;
//    // right click.
//    var rightclick = args.rightclick;
//    // original event.
//    var ev = args.originalEvent;

//    //showform.equipment('edit', boundIndex);
//});


$(document).delegate("#SupplierGrid_Export_to_Excel", "click", function () {
    $("#SupplierGrid").jqxGrid('exportdata', 'xls', 'Supplier_Details');
    $.ajax({
        url: '/Supplier/export',
        type: 'get',
        dataType: 'json',
        data: {
            operation: 'Export_Supplier',
            table: 'tblSuppliers'
        }
    });
});

$(document).delegate("#SupplierGrid_Clear_Filter", "click", function () {
    $('#SupplierGrid').jqxGrid('clearselection');
    $('#ContactPersonGrid').jqxGrid('clearfilters');
    $('#cmdAddContact').css("display", "none");
});

$(document).delegate("#SupplierGrid_Upload_Excel_File", "click", function () {
    showform.upload();
});

$(document).delegate("#btnProceedUpload", "click", function () {
    //dbaseOperations.upload();
    if ($("#inpt_file").val() != "") {
        dbaseOperations.upload();
        $.ajax({
            url: '/Supplier/upload',
            type: 'get',
            dataType: 'json',
        });
    }
});

$(document).delegate("#ContactPersonGrid_Export_to_Excel", "click", function () {
    $("#ContactPersonGrid").jqxGrid('exportdata', 'xls', 'ContactPerson_Details');
    $.ajax({
        url: '/Supplier/export',
        type: 'get',
        dataType: 'json',
        data: {
            operation: 'Export_ContactPerson',
            table: 'tblContactPerson'
        }
    });
});



$("#cmdAddContact").click(function () {
    showform.ContactPerson('add');
});

$("#SupplierGrid").on('rowdoubleclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    //showform.supplier('edit', boundIndex);
});

$("#ContactPersonGrid").on('rowdoubleclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;


    // showform.ContactPerson('edit', boundIndex);
});

$("#ContactPersonGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#ContactPersonGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);
    datatableContact = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);
    indexContact = boundIndex;
});

$('#SupplierGrid').on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#SupplierGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);
    datatable = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);
    index = boundIndex;
    console.log(data.code_string);
    applyFilter('supplier_key_string', $(this).attr('grid-child'), data.code_string);
    document.getElementById('cmdAddContact').style.display = 'inline';
    mCode = data.code_string;
});

$(document).delegate("#AddItemSaveButton", "click", function () {
    dbaseOperations.save('add', '');
});

$(document).delegate("#AddItemUpdateButton", "click", function () {
    //if ($("#chkIsAcive").is(":checked")) {
    //    IsActive = 1;
    //}
    dbaseOperations.save('edit', $(this).attr("data-recid"));
});

$(document).delegate("#cmdAddItemContact", "click", function () {
    dbaseOperations.SaveContactPerson('add', '');
});

$(document).delegate("#cmdUpdateContactPerson", "click", function () {
    dbaseOperations.SaveContactPerson('edit', $(this).attr("data-recid"));
});

$(document).delegate(".SupplierGrid_Inactive", "click", function (event) {
    showform.deactivate(datatable.id_number, datatable.code_string, 'Supplier')
});



$(document).delegate("#btnProceedDeactivate", "click", function () {
    dbaseOperations.deactivate($(this).attr('data-source'), $(this).attr('data-id'), $(this).attr('itemID'))
});

$(document).delegate(".ContactPersonGrid_Inactive", "click", function (event) {
    showform.deactivate(datatableContact.id_number, datatableContact.code_string, 'Contact')
    //showform.deactivate(datatable.code_string, 'Supplier')
});

$(document).delegate(".ContactPersonGrid_Edit", "click", function () {
    showform.ContactPerson('edit', indexContact);
});

//$(document).delegate("#txtGenSearch", "keyup", function () {
//    $("#SupplierGrid").clone().appendTo("#mainGridContainer");
//    $("#SupplierGrid").remove();
//    dbaseOperations.search();
//});

$(document).delegate("#SupplierGrid_searchField", "keyup", function (e) {
    var columns = ["contact_number_string", "name_string", "email_string",
                   "unit_string", "street_name_string", "municipality_string", "city_string", "country_string", "zip_string"];
    generalSearch($('#SupplierGrid_searchField').val(), "SupplierGrid", columns, e);
});

$(document).delegate("#ContactPersonGrid_searchField", "keyup", function (e) {
    var columns = ["Contact_Number_string", "Email_string", "Department_string",
                   "First_Name_string", "Last_Name_string", "Middle_Name_string"];
    generalSearch($('#ContactPersonGrid_searchField').val(), "ContactPersonGrid", columns, e);
});

//var showform = {

//    equipment: function (operation, boundIndex) {
//        var id = '';
//        var code = '';
//        var name = '';
//        var email = '';
//        var contactNumb = '';
//        var unitNum = '';
//        var street = '';
//        var municipality = '';
//        var city = '';
//        var country = '';
//        var zip = '';
//        var IsActive = '';

//        if (operation != "add") {

//            var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', boundIndex);
//            var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

//            id = data.id_number;
//            code = data.code_string;
//            name = data.name_string;
//            email = data.email_string;
//            contactNumb = data.contact_number_string;
//            unitNum = data.unit_string;
//            street = data.street_name_string;
//            municipality = data.municipality_string;
//            city = data.city_string;
//            country = data.country_string;
//            zip = data.zip_string;
//            if (data.active_bool) {
//                IsActive = 'checked = "checked"';
//                var IsActive2 = 1;
//            }
//        }

//        try
//        {
//            var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', boundIndex);
//            var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);
//            alert(boundIndex);

//        }catch(e){}

//        var modal = '<style>';
//        modal += ' .textstyle {';
//        modal += '      background-color: transparent;';
//        modal += '      outline: none;';
//        modal += '      outline-style: none;';
//        modal += '      outline-offset: 0;';
//        modal += '      border-top: none;';
//        modal += '      border-left: none;';
//        modal += '      border-right: none;';
//        modal += '      border-bottom: 1px solid #e5e5e5;';
//        modal += '      padding: 3px 10px;';
//        modal += '}';
//        modal += ' .form-control:focus {';
//        modal += '      border-top: 0;';
//        modal += '      border-left: 0;';
//        modal += '      border-right: 0;';
//        modal += '      border-bottom: 1px solid #e5e5e5;';
//        modal += '}';
//        modal += '</style>';

//        modal += '<div class="modal fade" id="modal123" role="dialog" >';
//        modal += '<div class="modal-dialog">';
//        modal += '<div class="modal-content">';

//        modal += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
//        modal += '<h4 class="modal-title"></h4>';
//        modal += '</div>';
//        modal += '<div class="modal-body" style="margin-top:3%;">';
//        modal += '<div class="row">';
//        modal += '<div class="col-md-12">';
//        modal += '<div class="col-md-12">';
//        modal += '<div class="form-group">';
//        //modal += '<label class="control-label">';
//        //modal += 'Company</label>';
//        modal += '<input id="CompanyName" type="text" placeholder="*Company Name" class="form-control companyrequired textstyle" value="' + name + '"/>';
//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-12">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Email Address</label>';
//        modal += '              <input id="EmailAddress" type="text"  placeholder="*Email" class="form-control companyrequired textstyle"  value="' + email + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Contact Number</label>';
//        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-12">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Email Address</label>';
//        modal += '              <input id="ContactNumber" type="text" placeholder="*Contact Number" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Contact Number</label>';
//        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        modal += '              <input id="ComUnitCode" type="text" placeholder="*Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                 Bldg/Street Name</label>';
//        modal += '              <input id="ComBldgName" type="text" placeholder="*Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Municipality</label>';
//        //modal += '              <input id="ComMunicipality" type="text" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  City</label>';
//        //modal += '              <input id="ComCity" type="text" class="form-control companyrequired textstyle" value="' + city + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        //modal += '      <div class="col-md-6">';
//        //modal += '          <div class="form-group">';
//        ////modal += '              <label class="control-label">';
//        ////modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" placeholder="Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-6">';
//        //modal += '          <div class="form-group">';
//        ////modal += '              <label class="control-label">';
//        ////modal += '                 Bldg/Street Name</label>';
//        //modal += '              <input id="ComBldgName" type="text" placeholder="Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Municipality</label>';
//        modal += '              <input id="ComMunicipality" type="text" placeholder="*Municipality" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  City</label>';
//        modal += '              <input id="ComCity" type="text" placeholder="*City" class="form-control companyrequired textstyle" value="' + city + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                 Country</label>';
//        modal += '              <input id="ComCountry" type="text" placeholder="*Country" class="form-control companyrequired textstyle" value="' + country + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Zip Code</label>';
//        modal += '              <input id="ComZipCode" type="text" placeholder="*Zip" class="form-control companyrequired textstyle" value="' + zip + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //if (operation == "edit") {
//        //    modal += '      <div class="col-md-4">';
//        //    modal += '          <div class="form-group">';
//        //    modal += '              <div class="checkbox">';
//        //    modal += '                   <label >';
//        //    modal += '                      <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" style="margin-top:.55cm;"> <br/>Activate';
//        //    modal += '                  </label>';        
//        //    modal += '              </div>';    
//        //    //modal += '              <label class="control-label">';
//        //    //modal += '                  Activate</label>';
//        //    //modal += '                  <br/>';
//        //    //modal += '              <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" >Activate';
//        //    modal += '          </div>';
//        //    modal += '      </div>';
//        //}
//        modal += '  </div>';
//        modal += '</div>';


//        modal += '<div class="modal-footer">';
//        modal += '<div class="row">';
//        modal += '<button class="btn btn-success" data-recid="' + id + '" id="' + ((operation == 'add') ? 'AddItemSaveButton' : 'AddItemUpdateButton') + '"';
//        modal += 'style="width: 100px;">';
//        modal += 'SAVE</button>';
//        modal += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '</div>';

//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';



//        $("#form_modal").html(modal);
//        $("#modal123").modal("show");
//        $("#modal123").css('z-index', '1000000');
//    },

//    supplier: function (operation, boundIndex) {
//        var id = '';
//        var code = '';
//        var name = '';
//        var email = '';
//        var contactNumb = '';
//        var unitNum = '';
//        var street = '';
//        var municipality = '';
//        var city = '';
//        var country = '';
//        var zip = '';
//        var IsActive = '';

//        if (operation != "add") {

//            var rowID = $("#SupplierGrid").jqxGrid('getrowid', boundIndex);
//            var data = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);

//            id = data.id_number;
//            code = data.code_string;
//            name = data.name_string;
//            email = data.email_string;
//            contactNumb = data.contact_number_string;
//            unitNum = data.unit_string;
//            street = data.street_name_string;
//            municipality = data.municipality_string;
//            city = data.city_string;
//            country = data.country_string;
//            zip = data.zip_string;
//            if (data.active_bool) {
//                IsActive = 'checked = "checked"';
//                var IsActive2 = 1;
//            }
//        }

//        var modal = '<style>';
//        modal += ' .textstyle {';
//        modal += '      background-color: transparent;';
//        modal += '      outline: none;';
//        modal += '      outline-style: none;';
//        modal += '      outline-offset: 0;';
//        modal += '      border-top: none;';
//        modal += '      border-left: none;';
//        modal += '      border-right: none;';
//        modal += '      border-bottom: 1px solid #e5e5e5;';
//        modal += '      padding: 3px 10px;';
//        modal += '}';
//        modal += ' .form-control:focus {';
//        modal += '      border-top: 0;';
//        modal += '      border-left: 0;';
//        modal += '      border-right: 0;';
//        modal += '      border-bottom: 1px solid #e5e5e5;';
//        modal += '}';
//        modal += '</style>';

//        modal += '<div class="modal fade" id="modal123" role="dialog" >';
//        modal += '<div class="modal-dialog">';
//        modal += '<div class="modal-content">';

//        modal += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
//        modal += '<h4 class="modal-title"></h4>';
//        modal += '</div>';
//        modal += '<div class="modal-body" style="margin-top:3%;">';
//        modal += '<div class="row">';
//        modal += '<div class="col-md-12">';
//        modal += '<div class="col-md-12">';
//        modal += '<div class="form-group">';
//        //modal += '<label class="control-label">';
//        //modal += 'Company</label>';
//        modal += '<input id="CompanyName" type="text" placeholder="*Company Name" class="form-control companyrequired textstyle" value="' + name + '"/>';
//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-12">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Email Address</label>';
//        modal += '              <input id="EmailAddress" type="text"  placeholder="*Email" class="form-control companyrequired textstyle"  value="' + email + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Contact Number</label>';
//        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-12">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Email Address</label>';
//        modal += '              <input id="ContactNumber" type="text" placeholder="*Contact Number" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Contact Number</label>';
//        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Unit Number</label>';
//        modal += '              <input id="ComUnitCode" type="text" placeholder="*Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                 Bldg/Street Name</label>';
//        modal += '              <input id="ComBldgName" type="text" placeholder="*Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Municipality</label>';
//        //modal += '              <input id="ComMunicipality" type="text" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-4">';
//        //modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  City</label>';
//        //modal += '              <input id="ComCity" type="text" class="form-control companyrequired textstyle" value="' + city + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        //modal += '      <div class="col-md-6">';
//        //modal += '          <div class="form-group">';
//        ////modal += '              <label class="control-label">';
//        ////modal += '                  Unit Number</label>';
//        //modal += '              <input id="ComUnitCode" type="text" placeholder="Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        //modal += '      <div class="col-md-6">';
//        //modal += '          <div class="form-group">';
//        ////modal += '              <label class="control-label">';
//        ////modal += '                 Bldg/Street Name</label>';
//        //modal += '              <input id="ComBldgName" type="text" placeholder="Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
//        //modal += '          </div>';
//        //modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Municipality</label>';
//        modal += '              <input id="ComMunicipality" type="text" placeholder="*Municipality" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  City</label>';
//        modal += '              <input id="ComCity" type="text" placeholder="*City" class="form-control companyrequired textstyle" value="' + city + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '  </div>';
//        modal += '</div>';

//        modal += '<div class="row">';
//        modal += '  <div class="col-md-12">';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                 Country</label>';
//        modal += '              <input id="ComCountry" type="text" placeholder="*Country" class="form-control companyrequired textstyle" value="' + country + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        modal += '      <div class="col-md-6">';
//        modal += '          <div class="form-group">';
//        //modal += '              <label class="control-label">';
//        //modal += '                  Zip Code</label>';
//        modal += '              <input id="ComZipCode" type="text" placeholder="*Zip" class="form-control companyrequired textstyle" value="' + zip + '"/>';
//        modal += '          </div>';
//        modal += '      </div>';
//        //if (operation == "edit") {
//        //    modal += '      <div class="col-md-4">';
//        //    modal += '          <div class="form-group">';
//        //    modal += '              <div class="checkbox">';
//        //    modal += '                   <label >';
//        //    modal += '                      <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" style="margin-top:.55cm;"> <br/>Activate';
//        //    modal += '                  </label>';        
//        //    modal += '              </div>';    
//        //    //modal += '              <label class="control-label">';
//        //    //modal += '                  Activate</label>';
//        //    //modal += '                  <br/>';
//        //    //modal += '              <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" >Activate';
//        //    modal += '          </div>';
//        //    modal += '      </div>';
//        //}
//        modal += '  </div>';
//        modal += '</div>';


//        modal += '<div class="modal-footer">';
//        modal += '<div class="row">';
//        modal += '<button class="btn btn-success" data-recid="' + id + '" id="' + ((operation == 'add') ? 'AddItemSaveButton' : 'AddItemUpdateButton') + '"';
//        modal += 'style="width: 100px;">';
//        modal += 'SAVE</button>';
//        modal += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '</div>';

//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';



//        $("#form_modal").html(modal);
//        $("#modal123").modal("show");
//        $("#modal123").css('z-index', '1000000');
//    },

//    deactivate: function (id, code, source) {
//        var modal = '<div class="modal fade" id="modalDeactivate" role="dialog" >';
//        modal += '<div class="modal-dialog modal-sm">';
//        modal += ' <div class="modal-content">';

//        modal += '<div class="modal-header" style="background-color:#F25656; color:#ffffff">';
//        modal += '<h4 class="modal-title">Inactive Record</h4>';
//        modal += '</div>';
//        // modal += '<br/>';

//        modal += '<div class="modal-body" style="margin-top:4%">';
//        modal += '<p>Are you sure you want to be inactive this record?</p>';
//        modal += '</div>';

//        modal += '<div class="modal-footer">';
//        modal += '<div class="row">';
//        modal += '<button class="btn btn-danger" id="btnProceedDeactivate"';
//        modal += 'data-source="' + source + '" data-id="' + code + '" itemID="' + id + '">';
//        modal += 'YES</button>';
//        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">NO</button> &nbsp ';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';

//        $("#form_modal").html(modal);
//        $("#modalDeactivate").modal("show");
//        $("#modalDeactivate").css('z-index', '1000000');
//    },

//    ContactPerson: function (operation, boundIndex) {
//        var id = '';
//        var firstname = '';
//        var middlename = '';
//        var lastname = '';
//        var email = '';
//        var contactnumber = '';
//        var department = '';
//        //var IsActive;
//        var code;

//        if (operation != "add") {

//            var rowID = $("#ContactPersonGrid").jqxGrid('getrowid', boundIndex);
//            var data = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);

//            id = data.id_number;
//            firstname = data.First_Name_string;
//            middlename = data.Middle_Name_string;
//            lastname = data.Last_Name_string;
//            email = data.Email_string;
//            contactnumber = data.Contact_Number_string;
//            department = data.Department_string;
//            code = data.code_string;
//            //if (data.isactive_string) {
//            //    IsActive = 'checked = "checked"';
//            //    var IsActive2 = 1;
//            //}
//        }

//        var modal2 = '<style>';
//        modal2 += ' .textstyle {';
//        modal2 += '      background-color: transparent;';
//        modal2 += '      outline: none;';
//        modal2 += '      outline-style: none;';
//        modal2 += '      outline-offset: 0;';
//        modal2 += '      border-top: none;';
//        modal2 += '      border-left: none;';
//        modal2 += '      border-right: none;';
//        modal2 += '      border-bottom: solid 1px;';
//        modal2 += '      padding: 3px 10px;';
//        modal2 += '}';
//        modal2 += ' .form-control:focus {';
//        modal2 += '      border-top: 0;';
//        modal2 += '      border-left: 0;';
//        modal2 += '      border-right: 0;';
//        modal2 += '      border-bottom: solid 1px;';
//        modal2 += '}';
//        modal2 += '</style>';

//        modal2 += '<div class="modal fade" id="modalContactPerson" role="dialog" >';
//        modal2 += '<div class="modal-dialog">';
//        modal2 += ' <div class="modal-content">';

//        modal2 += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
//        modal2 += '<h4 class="modal-title">Add Contact Person</h4>';
//        modal2 += '</div>';
//        modal2 += '<div class="modal-body" style="margin-top:3%;">';

//        modal2 += '<div class="row">';
//        modal2 += '  <div class="col-md-12">';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                 Email</label>';
//        modal2 += '              <input id="Email" type="text" placeholder="*E-mail" class="form-control companyrequired textstyle" value= "' + email + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                  Contact Number</label>';
//        //modal2 += '              <div id="numericInput"></div>';
//        modal2 += '              <input id="ContactNumber" type="text" placeholder="*Contact Number" class="form-control companyrequired textstyle" value= "' + contactnumber + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                  Department</label>';
//        modal2 += '              <input id="Department" type="text" placeholder="*Department" class="form-control companyrequired textstyle" value= "' + department + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '  </div>';
//        modal2 += '</div>';

//        modal2 += '<div class="row">';
//        modal2 += '  <input id="Code" type="hidden" value="' + code + '" />';
//        modal2 += '  <div class="col-md-12">';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                  First Name</label>';
//        modal2 += '              <input id="FirstName" type="text" placeholder="*First Name" class="form-control companyrequired textstyle" value= "' + firstname + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                  Middle Name</label>';
//        modal2 += '              <input id="MiddleName" type="text" placeholder="*Middle Name" class="form-control companyrequired textstyle" value= "' + middlename + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '      <div class="col-md-4">';
//        modal2 += '          <div class="form-group">';
//        //modal2 += '              <label class="control-label">';
//        //modal2 += '                  Last Name</label>';
//        modal2 += '              <input id="LastName" type="text" placeholder="*Last Name" class="form-control companyrequired textstyle" value= "' + lastname + '"/>';
//        modal2 += '          </div>';
//        modal2 += '      </div>';
//        modal2 += '  </div>';
//        modal2 += '</div>';

//        //if (operation == "edit") {
//        //modal2 += '<div class="row">';
//        //modal2 += '  <div class="col-md-12">';
//        //modal2 += '      <div class="col-md-4">';
//        //modal2 += '          <div class="form-group">';
//        //modal2 += '              <div class="checkbox">';
//        //modal2 += '                   <label >';
//        //modal2 += '                      <input type="checkbox" value="'+ IsActive2 +'" '+ IsActive +' id="chkIsActive">Activate';
//        //modal2 += '                  </label>';
//        //modal2 += '              </div>';
//        //modal2 += '          </div>';
//        //modal2 += '      </div>';
//        //modal2 += '  </div>';
//        //modal2 += '</div>';
//        //}
//        modal2 += '<div class="modal-footer">';
//        modal2 += '<div class="row">';
//        modal2 += '<button class="btn btn-success" data-recid="' + id + '" id="' + ((operation == 'add') ? 'cmdAddItemContact' : 'cmdUpdateContactPerson') + '"';
//        modal2 += 'style="width: 100px;">';
//        modal2 += 'SAVE</button>';
//        modal2 += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
//        modal2 += '</div>';
//        modal2 += '</div>';

//        modal2 += '</div>';

//        modal2 += '</div>';
//        modal2 += '</div>';
//        modal2 += '</div>';

//        $("#form_modal").html(modal2);
//        $("#modalContactPerson").modal("show");
//        $("#modalContactPerson").css('z-index', '1000000');

//        $("#numericInput").jqxNumberInput({ width: '154px', height: '31px', inputMode: 'simple', decimalDigits: 0 });
//    },

//    upload: function () {
//        var modal = '<style>';
//        modal += '.loader{';
//        modal += 'border:2px solid #E5E5E5;';
//        modal += 'border-radius: 50%;';
//        modal += 'border-top: 5px solid #76cad4;';
//        modal += 'width: 30px;';
//        modal += 'height: 30px;';
//        modal += '-webkit-animation: spin 2s linear infinite;';
//        modal += 'animation: spin 2s linear infinite;';
//        modal += '}';
//        modal += '@-webkit-keyframes spin {';
//        modal += '0% { -webkit-transform: rotate(0deg); }';
//        modal += '100% { -webkit-transform: rotate(360deg); }';
//        modal += '}';
//        modal += '@keyframes spin {';
//        modal += '0% { transform: rotate(0deg); }';
//        modal += '100% { transform: rotate(360deg); }';
//        modal += '}';
//        //modal += 'div.absolute {';
//        //modal += 'position: absolute;';
//        //modal += 'top: 63px;';
//        //modal += 'right: 115px;';
//        //modal += '}';
//        modal += '</style>';
//        modal += '<div class="modal fade" id="modalUpload" role="dialog" >';
//        modal += '<div class="modal-dialog modal-sm">';
//        modal += ' <div class="modal-content">';

//        modal += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
//        modal += '<h4 class="modal-title">File Upload</h4>';
//        modal += '<div class="loader"  style="float:right; top:-26px; position:relative; display:none"></div>';
//        modal += '</div>';
//        //modal += '<div class="progress absolute" hidden="hidden">';
//        //modal += '<div class="loader" ></div>';
//        //modal += '</div>';
//        modal += '<div class="modal-body" style="margin-top:8%;">';
//        modal += '<input type="file" id="inpt_file" name="inpt_file" accept="application/vnd.ms-excel" style="color:#F25656; font-weight:bold; font-size:1.1em;" />';
//        modal += '</div>';

//        modal += '<div class="modal-footer">';
//        modal += '<div class="row">';
//        modal += '<button class="btn btn-success" id="btnProceedUpload"';
//        modal += 'style="width: 80px;">';
//        modal += 'UPLOAD</button>';
//        modal += '<button id="btnCancel" "type="button" style="width: 80px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
//        modal += '</div>';
//        modal += '</div>';

//        modal += '</div>';
//        modal += '</div>';
//        modal += '</div>';

//        $("#form_modal").html(modal);
//        $("#modalUpload").modal("show");
//        $("#modalUpload").css('z-index', '1000000');
//    },
//};

var dbaseOperations = {
    save: function (operation, trans_id) {
        //for validation if textbox is empty
        var elements = ["#CompanyName", "#EmailAddress", "#ContactNumber", "#ComUnitCode", "#ComBldgName",
                                                "#ComMunicipality", "#ComCity", "#ComCountry", "#ComZipCode"];
        var ctr = 0;
        for (var i = 0; i <= 8; i++) {
            if ($(elements[i]).val() == "") {
                $(elements[i]).css("border-color", "red");
            }
            else {
                $(elements[i]).css("border-color", "#e5e5e5");
                ctr++;
            }
        }

        //if all textbox is filled
        if (ctr == 9) {
            var url = '';
            var msg = '';
            //var IsActive = false;
            if (operation == 'add') {
                url = '/Supplier/AddSupplier';
                msg = 'New record successfully added';
                title = 'Add Record';
            } else {
                url = '/Supplier/UpdateSupplier';
                msg = 'Record successfully updated!';
                title = 'Update Record';
            }
            //if ($("#chkIsActive").is(":checked")) {
            //    IsActive = true;
            //}
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                data: {
                    id: trans_id,
                    code: $("#Code").val(),
                    Name: $("#CompanyName").val(),
                    Email: $("#EmailAddress").val(),
                    ContactNbr: $("#ContactNumber").val(),
                    UnitNbr: $("#ComUnitCode").val(),
                    StreetName: $("#ComBldgName").val(),
                    Municipality: $("#ComMunicipality").val(),
                    City: $("#ComCity").val(),
                    Country: $("#ComCountry").val(),
                    Zip: $("#ComZipCode").val(),
                    //isactive: IsActive
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    $("#modal123").modal("hide");
                    if (response.success) {
                        notification_modal(title, msg, "success");
                        $('#SupplierGrid').jqxGrid('updatebounddata');
                    } else {
                        notification_modal("Addition failed!", response.message, "danger");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }

    },

    SaveContactPerson: function (operation, trans_id) {
        //for validation if textbox is empty
        var elements = ["#FirstName", "#MiddleName", "#LastName", "#Email", "#ContactNumber", "#Department"]
        var ctr = 0;
        for (var i = 0; i <= 5; i++) {
            if ($(elements[i]).val() == "") {
                $(elements[i]).css("border-color", "red");
            }
            else {
                $(elements[i]).css("border-color", "#e5e5e5");
                ctr++;
            }
        }

        //if all textbox is filled
        if (ctr == 6) {
            var url = '';
            var msg = '';
            //var IsActive = false;
            if (operation == 'add') {
                url = '/ContactPerson/AddContactPerson';
                msg = 'New record successfully added!';
                title = 'Add Record';
            } else {
                url = '/ContactPerson/UpdateContactPerson';
                msg = 'Record successfully updated!';
                title = 'Update Record';
            }
            //if ($("#chkIsActive").is(":checked")) {
            //    IsActive = true;
            //}
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                data: {
                    id: trans_id,
                    Code: $("#Code").val(),
                    SupplierKey: mCode,
                    FirstName: $("#FirstName").val(),
                    MiddleName: $("#MiddleName").val(),
                    LastName: $("#LastName").val(),
                    Email: $("#Email").val(),
                    ContactNumber: $("#ContactNumber").val(),
                    Department: $("#Department").val(),
                    //IsActive: IsActive
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.success) {
                        $("#modalContactPerson").modal("hide");
                        notification_modal(title, msg, "success");
                        $('#ContactPersonGrid').jqxGrid('updatebounddata');
                    } else {
                        notification_modal("Addition failed!", response.message, "danger");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    },

    deactivate: function (source, code, id) {
        var url = '';
        var msg = '';
        if (source == "Supplier") {
            url = '/Supplier/DeactivateSupplier';
            msg = 'Record successfully inactive!';
        } else if (source == "Contact") {
            url = '/ContactPerson/DeactivateContact';
            msg = 'Record successfully inactive!';
        }
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            data: {
                Id: id,
                code: code,
                isactive: false
            },
            beforeSend: function () {

            },
            success: function (response) {
                if (response.success) {
                    $("#modalDeactivate").modal("hide");
                    notification_modal("Inactive Record", msg, "success");
                    if (source == "Supplier")
                        $('#SupplierGrid').jqxGrid('updatebounddata');
                    else if (source == "Contact")
                        $('#ContactPersonGrid').jqxGrid('updatebounddata');
                } else {
                    notification_modal("Deactivation Failed!", response.message, "danger");
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    },

    upload: function () {
        var formData = new FormData();
        formData.append('inpt_file', $('input[name="inpt_file"]')[0].files[0]);
        //formData.append('override', $('#chk_override').is(":checked") ? true : false);
        $.ajax({
            url: '/Supplier/TargetUpload',
            type: 'post',
            dataType: 'json',
            //async: false,
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $(".loader").css('display', 'inline');
                $("#btnProceedUpload").attr("disabled", true);
                $("#btnCancel").attr("disabled", true);
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                //$(".loader").css('display', 'none');
                if (response.success) {
                    $("#modalUpload").modal("hide");
                    $('#SupplierGrid').jqxGrid('updatebounddata');
                    notification_modal(response.message.title, response.message.body, response.message.type);
                }
                else {
                    $("#modalUpload").modal("hide");
                    notification_modal("Unable to upload file!", "Please contact your system administrator.", "danger");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    },
};

var applyFilter = function (datafield, childgrid, _code) {
    if (typeof childgrid == "undefined" || childgrid == '' || typeof childgrid == "null") {
        console.log("Child grid not set!");
    } else {
        //static counter to prevent infinite looping
        var ctr = 0;
        $("#" + childgrid).jqxGrid('clearfilters');
        var filtertype = 'stringfilter';
        var filtergroup = new $.jqx.filter();

        var filter_or_operator = 0;
        var filtervalue = "'" + _code + "'";
        var filtercondition = 'equal';
        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);

        $("#" + childgrid).on("bindingcomplete", function (event) {
            if (ctr == 0) {
                $("#" + childgrid).jqxGrid('addfilter', datafield, filtergroup);
                $("#" + childgrid).jqxGrid('applyfilters');
            }
            ctr = 1;
        });
    }
}

//#endregion

