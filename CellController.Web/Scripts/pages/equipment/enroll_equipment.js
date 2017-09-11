var mCode;
var datatable, datatableContact;
var index, indexContact;
var identifier = 1;
var modal_checker = 0;


$(document).ready(function (e) {

    //assign create button onclick function
    $("#cmdAddNew").click(function () {
        showform.equipment_enrollment('add');
        $('.modal-title').text('Add Enrollment');
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

    //assign click function for edit
    $(document).delegate(".UserEquipmentGrid_Edit", "click", function () {
        showform.equipment_enrollment('edit', index);
        $('.modal-title').text('Update Enrollment');
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

    //assign keyup function for search
    $(document).delegate("#UserEquipmentGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#UserEquipmentGrid_searchField').val();

        //assign columns to be queried
        var columns = ["equipment_id_string", "username_string", "type_string", "host_id_string"];

        //pass the criteria to be searched
        generalSearch(search, "UserEquipmentGrid", columns, e);
    });

    HideLoading();

});

//function for building the html of the add/edit page
var showform = {

    equipment_enrollment: function (operation, boundIndex) {
        var id = '';
        var equipid = '';
        var username = '';
        var hostid = '';

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#UserEquipmentGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#UserEquipmentGrid").jqxGrid('getrowdatabyid', rowID);

            id = data.id_number;
            equipid = data.equipment_id_string;
            username = data.username_string;
            hostid = data.host_id_string;
            if (hostid == null)
            {
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
        modal += '  <label for="ddEquipment">Machine:</label>';
        modal += '  <select id="ddEquipment" class="form-control"><option selected disabled>Select Machine</option></select>';
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
        if (operation.toUpperCase() == "ADD")
        {
            modal += '  <input type="text" id="txtHostID" class="form-control inputtext" placeholder="Host ID" style="text-transform:uppercase;"/>';
        }
        else
        {
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
            modal += '$(document).ready(function () {setup("' + operation + '","' + equipid + '");});';
        }
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
        url: '/EnrollEquipment/GetAllEquipment',
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

//build html modal confirmation for adding
function notification_modal_confirm_add_enrollment(username, equipment, host) {

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
    modal += '<button type="button" class="btn btn-success" onclick="insertRecord(' + "'" + username + "'" + ',' + "'" + equipment + "'" + ',' + "'" + host + "'" + ');">OK</button>';
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
        
        if (modal_checker == 0)
        {
            $("#form_modal_div").modal("show");
        }
        else
        {
            $("#form_modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        modal_checker = 0;
    });
}

//build html modal confirmation for updating
function notification_modal_confirm_update_enrollment(id, username, equipment, host) {

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
    modal += '<button type="button" class="btn btn-success" onclick="updateRecord(' + "'" + id + "'" + ',' + "'" + username + "'" + ',' + "'" + equipment + "'" + ',' + "'" + host + "'" + ');">OK</button>';
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

//function for adding/updating
function Save(type, id) {

    var username = $('#txtUsername').val().trim();
    var equipment = $('#ddEquipment').val();
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

                //old logic
                //$.ajax({
                //    url: '/EnrollEquipment/ValidateEntry',
                //    method: 'get',
                //    data: { username: username, equipment: equipment }
                //}).success(function (val) {

                //    if (val == 0)
                //    {
                //        notification_modal_confirm_add_enrollment(username, equipment, host);
                //    }
                //    else {
                //        alert('123');
                //        notification_modal_dynamic_super("Notification", "Enrollment already exists", 'danger', 'form_modal_div', identifier);
                //        identifier++;
                //    }
                //}).error(function (e) {
                //    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
                //    identifier++;
                //});

                $.ajax({
                    url: '/EnrollEquipment/ValidateEntryWithHost',
                    method: 'get',
                    data: { username: username, equipment: equipment, host: host }
                }).success(function (val) {

                    if (val == 0)
                    {
                        notification_modal_confirm_add_enrollment(username, equipment, host);
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
            else
            {
                //old logic
                //$.ajax({
                //    url: '/EnrollEquipment/ValidateEntryForUpdate',
                //    method: 'get',
                //    data: { username: username, equipment: equipment, ID: id }
                //}).success(function (val) {

                //    if (val == 0) {

                //        notification_modal_confirm_update_enrollment(id, username, equipment, host);
                //    }
                //    else {
                //        notification_modal_dynamic_super("Notification", "Enrollment already exists", 'danger', 'form_modal_div', identifier);
                //        identifier++;
                //    }
                //}).error(function (e) {
                //    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
                //    identifier++;
                //});

                $.ajax({
                    url: '/EnrollEquipment/ValidateEntryForUpdateWithHost',
                    method: 'get',
                    data: { username: username, equipment: equipment, ID: id, host: host }
                }).success(function (val) {

                    if (val == 0) {

                        notification_modal_confirm_update_enrollment(id, username, equipment, host);
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

//function for setting up controls onload
function setup(type, equipment) {

    populateEquipment(type, equipment);

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

//function for inserting to table
function insertRecord(username, equipment, host) {
    
    $.ajax({
        url: '/EnrollEquipment/AddEnrollment',
        data: { username: username, equipment: equipment, hostID: host },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
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

//function for updating the table
function updateRecord(id, username, equipment, host) {
    
    $.ajax({
        url: '/EnrollEquipment/UpdateEnrollment',
        data: { ID: id, username: username, equipment: equipment, hostID: host },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
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

//function for deleting from the table
function deleteRecord(id) {
    
    $.ajax({
        url: '/EnrollEquipment/DeleteEnrollment',
        data: { ID: id },
        method: 'post'
    }).success(function (val) {

        if (val == "True") {
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserEquipmentGrid').jqxGrid('updatebounddata');
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


