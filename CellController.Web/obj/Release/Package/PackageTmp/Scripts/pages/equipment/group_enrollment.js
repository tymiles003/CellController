var identifier = 1;
var datatable;
var index;
var modal_checker = 0;


$(document).ready(function (e) {
    
    $("#cmdAddNew").click(function () {
        showform.equipment_enrollment('add');
        $('.modal-title').text('Add Enrollment');
    });

    $('#GroupEquipmentGrid').on('rowclick', function (event) {
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
        var rowID = $("#GroupEquipmentGrid").jqxGrid('getrowid', boundIndex);

        //get data based on row id
        var data = $("#GroupEquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        datatable = $("#GroupEquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        index = boundIndex;
    });

    //assign click function for edit
    $(document).delegate(".GroupEquipmentGrid_Edit", "click", function () {
        showform.equipment_enrollment('edit', index);
        $('.modal-title').text('Update Enrollment');
    });

    //assign click function for delete
    $(document).delegate(".GroupEquipmentGrid_Delete", "click", function () {
        //get the row id
        var rowID = $("#GroupEquipmentGrid").jqxGrid('getrowid', index);
        //get the data
        var data = $("#GroupEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.id_number;

        //pass the id to be deleted
        notification_modal_confirm_delete_enrollment(id);
    });

    //assign keyup function for search
    $(document).delegate("#GroupEquipmentGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#GroupEquipmentGrid_searchField').val();

        //assign columns to be queried
        var columns = ["name_string", "username_string", "host_id_string", "status_string"];

        //pass the criteria to be searched
        generalSearch(search, "GroupEquipmentGrid", columns, e);
    });

    HideLoading();
});

//function for building the html of the add/edit page
var showform = {

    equipment_enrollment: function (operation, boundIndex) {
        var id = '';
        var groupname = '';
        var username = '';
        var hostid = '';

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#GroupEquipmentGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#GroupEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

            id = data.id_number;
            groupname = data.name_string;
            username = data.username_string;
            hostid = data.host_id_string;

            if (hostid == null) {
                hostid = "";
            }
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
        modal += '  <label for="ddEquipment">Machine Group:</label>';
        modal += '  <select id="ddEquipment" class="form-control"><option selected disabled>Select Machine Group</option></select>';
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

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtHostID">Host ID:</label>';
        if (operation.toUpperCase() == "ADD") {
            modal += '  <input type="text" id="txtHostID" class="form-control inputtext" placeholder="Host ID" style="text-transform:uppercase;"/>';
        }
        else {
            modal += '  <input type="text" id="txtHostID" class="form-control inputtext" placeholder="Host ID" value="' + hostid + '" style="text-transform:uppercase;"/>';
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
            modal += '$(document).ready(function () {setup("' + operation + '","' + groupname + '");});';
        }
        modal += '</script>';

        $("#form_modal").html(modal);
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    }
};

//function for setting up controls onload
function setup(type, group) {

    populateGroup(type, group);

    $.ajax({
        url: '/EnrollEquipment/GetAllUser',
        method: 'get'
    }).success(function (val) {
        var json = JSON.parse(val);
        for (var i = 0; i < json.length; i++) {
            $('#UserAutoCompleteList').append('<option value="' + json[i].Username + '" />');
        }
    });

    if (type.toUpperCase() != "ADD") {
        //for disabling the textbox
        $("#txtUsername").attr("disabled", "disabled");
    }
}

//function to populate the equipment dropdown
function populateGroup(type, group) {

    //ajax call to the controller that will return list of group
    $.ajax({
        url: '/GroupEnrollment/GetAllGroup',
        method: 'get'
    }).success(function (val) {

        var json = JSON.parse(val);

        if (json != null)
        {
            for (var i = 0; i < json.length; i++)
            {
                $('#ddEquipment').append($('<option></option>').val(json[i].ID).html(json[i].GroupName));
            }

            if (type.toUpperCase() == "EDIT")
            {
                $("#ddEquipment").find("option:contains('" + group + "')").each(function () {
                    if ($(this).text() == group) {
                        $(this).attr("selected", "selected");
                    }
                })
            }
        }
    });
}

//function for adding/updating
function Save(type, id) {

    var username = $('#txtUsername').val().trim();
    var groupID = $('#ddEquipment').val();
    var index = $("#ddEquipment option:selected").index();
    var host = $('#txtHostID').val().trim().toUpperCase();

    //validate the fields
    if (username == "" || index == 0 || host == "") {
        notification_modal_dynamic_super("Notification", "All fields are required", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    //if all fields contains values proceed to ajax call from controller to
    //check if the user exists in the table
    $.ajax({
        url: '/EnrollEquipment/CheckUser',
        method: 'get',
        data: { username: username }
    }).success(function (result) {

        //if the validation of user is successful proceed
        //to ajax call

        if (result == "True") {
            //ajax call for validating if the equipment already exists in the table

            if (type.toUpperCase() == "ADD") {

                $.ajax({
                    url: '/GroupEnrollment/ValidateEntryWithHost',
                    method: 'get',
                    data: { username: username, groupID: groupID, host: host }
                }).success(function (val) {

                    if (val == 0) {
                        notification_modal_confirm_add_enrollment(username, groupID, host);
                    }
                    else {
                        notification_modal_dynamic_super("Notification", "Enrollment already exists", 'danger', 'form_modal_div', identifier);
                        identifier++;
                    }
                }).error(function (e) {
                    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
                    identifier++;
                });
            }
            else {
                
                $.ajax({
                    url: '/GroupEnrollment/ValidateEntryForUpdateWithHost',
                    method: 'get',
                    data: { username: username, groupID: groupID, ID: id, host: host }
                }).success(function (val) {

                    if (val == 0) {
                        notification_modal_confirm_update_enrollment(id, username, groupID, host);
                    }
                    else {
                        notification_modal_dynamic_super("Notification", "Enrollment already exists", 'danger', 'form_modal_div', identifier);
                        identifier++;
                    }
                }).error(function (e) {
                    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
                    identifier++;
                });
            }
        }
        else {
            notification_modal_dynamic_super("Notification", "Username does not exists", 'danger', 'form_modal_div', identifier);
            identifier++;
        }

    }).error(function (e) {
        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
        identifier++;
    });
}

//build html modal confirmation for adding
function notification_modal_confirm_add_enrollment(username, groupID, host) {

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
    modal += '<button type="button" class="btn btn-success" onclick="insertRecord(' + "'" + username + "'" + ',' + "'" + groupID + "'" + ',' + "'" + host + "'" + ');">OK</button>';
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

//function for inserting to table
function insertRecord(username, groupID, host) {

    $.ajax({
        url: '/GroupEnrollment/AddEnrollment',
        data: { username: username, groupID: groupID, hostID: host },
        method: 'post'
    }).success(function (val) {

        if (val == true)
        {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#GroupEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Added", 'success', identifier);
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

//build html modal confirmation for updating
function notification_modal_confirm_update_enrollment(id, username, groupID, host) {

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
    modal += '<button type="button" class="btn btn-success" onclick="updateRecord(' + "'" + id + "'" + ',' + "'" + username + "'" + ',' + "'" + groupID + "'" + ',' + "'" + host + "'" + ');">OK</button>';
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

//function for updating the table
function updateRecord(id, username, groupID, host) {

    $.ajax({
        url: '/GroupEnrollment/UpdateEnrollment',
        data: { ID: id, username: username, groupID: groupID, hostID: host },
        method: 'post'
    }).success(function (val) {

        if (val == true) {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#GroupEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Updated", 'success', identifier);
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

//function for deleting from the table
function deleteRecord(id) {
    
    $.ajax({
        url: '/GroupEnrollment/DeleteEnrollment',
        data: { ID: id },
        method: 'post'
    }).success(function (val) {

        if (val == true) {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#GroupEquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Enrollment Deleted", 'success', identifier);
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

