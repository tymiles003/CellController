var identifier = 1;
var datatable;
var index;
var id = '';
var isEnabled = '';
var name = '';
var modal_checker = 0;
var modal_checker2 = 0;
var arrEquip = [];

$(document).ready(function (e) {

    $("#cmdAddNewEquipment").click(function () {
        showform.equipment('add');
        $('.modal-title').text('Add Machine Group');
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
        datatable = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);
        index = boundIndex;
    });

    //assign click function for edit
    $(document).delegate(".EquipmentGrid_Edit", "click", function () {
        showform.equipment('edit', index);
        $('.modal-title').text('Update Machine Group');
    });

    //assign click function for assign
    $(document).delegate(".EquipmentGrid_Assign", "click", function () {
        showform.equipment('assign', index);
        $('.modal-title').text('Assign Machine to Group');
    });

    //assign click function for delete
    $(document).delegate(".EquipmentGrid_Delete", "click", function () {
        //get the rowid
        var rowID = $("#EquipmentGrid").jqxGrid('getrowid', index);
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
        var columns = ["name_string",
                        "status_string"
        ];

        //pass the criteria to be searched
        generalSearch(search, "EquipmentGrid", columns, e);
    });

    HideLoading();
});

//function for building the html of the add/edit page
var showform = {

    equipment: function (operation, boundIndex) {

        if (operation.toUpperCase() != "ASSIGN")
        {
            if (operation.toUpperCase() == "EDIT") {

                var rowID = $("#EquipmentGrid").jqxGrid('getrowid', boundIndex);
                var data = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);

                id = data.id_number;
                isEnabled = data.status_string;
                name = data.name_string;
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
            modal += '  <label for="txtName">Group Name:</label>';
            modal += '  <input type="text" class="form-control inputtext" style="text-transform:uppercase;" placeholder="Group Name" id="txtName" autocomplete="off">';
            modal += '</div>';

            modal += '<div class="form-group col-md-12" style="margin:0px;padding-top:0px;" id="divChk">';
            modal += '<label for="chkEnabled">Status:</label>';

            modal += '<div></div>';

            modal += '</div>';

            modal += '</div>';

            modal += '</div>';

            modal += '<div class="modal-footer" style="text-align:center;">';

            if (operation.toUpperCase() == "ADD") {
                modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="save(' + "'add'" + ');">Add</button>';
            }
            else {
                modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="save(' + "'update'" + ');">Update</button>';
            }

            modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            modal += '</div>';

            modal += '</div>';
            modal += '</div>';
            modal += '</div>';

            modal += '<script>';
            modal += '$(document).ready(function () {setup("' + operation + '","");});';
            modal += '</script>';

            $("#form_modal").html(modal);
            $("#form_modal_div").modal("show");
            $("#form_modal_div").css('z-index', '1000001');

            $("body").css("margin", "0px");
            $("body").css("padding", "0px");
        }
        else
        {
            arrEquip = [];
            $('#lblList').hide();

            if (operation.toUpperCase() == "ASSIGN") {

                var rowID = $("#EquipmentGrid").jqxGrid('getrowid', boundIndex);
                var data = $("#EquipmentGrid").jqxGrid('getrowdatabyid', rowID);

                id = data.id_number;
                isEnabled = data.status_string;
                name = data.name_string;
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
            modal += '  <label for="txtName">Group Name:</label>';
            modal += '  <input type="text" class="form-control inputtext" style="text-transform:uppercase;" disabled="disabled" placeholder="Group Name" id="txtName" value="' + name + '" autocomplete="off">';
            modal += '</div>';

            modal += '<div class="form-group col-md-12">';
            modal += '  <label for="ddEquipment">Machine:</label>';
            modal += '  <div class="input-group">';
            modal +=        '<select id="ddEquipment" class="form-control"><option selected disabled>Select Machine</option></select>';
            modal += '          <span class="input-group-btn" title="Add" data-toggle="tooltip">';
            modal += '              <button class="btn btn-default" onclick="AddEquipment();" type="button" id="btnFocusLotNumber">';
            modal += '                  <span class="glyphicon glyphicon-plus"></span>';
            modal += '              </button>';
            modal += '          </span>';
            modal += '  </div>';
            modal += '</div>';

            modal += '<div class="form-group col-md-12" id="divAssign"><label id="lblList" style="display:none;">Added Machine:</label></div>';

            modal += '</div>';

            modal += '</div>';

            modal += '<div class="modal-footer" style="text-align:center;">';

            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="Assign(' + "'" + id + "'" + ');">Save</button>';

            modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
            modal += '</div>';

            modal += '</div>';
            modal += '</div>';
            modal += '</div>';

            modal += '<script>';
            modal += '$(document).ready(function () {setup_assign();});';
            modal += '</script>';

            $("#form_modal").html(modal);
            $("#form_modal_div").modal("show");
            $("#form_modal_div").css('z-index', '1000001');

            $("body").css("margin", "0px");
            $("body").css("padding", "0px");
        }
    }
};

function Assign(groupID)
{
    notification_modal_confirm_assign(groupID);
}

function SaveAssign(groupID)
{
    $.ajax({
        url: '/EquipmentGroup/DeleteMachineGroupRelation',
        data: { ID: groupID },
        method: 'post'
    }).success(function (val) {

        if (val == "True") {

            if (arrEquip == null || arrEquip.length == 0) {
                modal_checker2 = 1;
                $("#modal_div").modal("hide");
                $("#form_modal_div").modal("hide");
                $('#EquipmentGrid').jqxGrid('updatebounddata');
                notification_modal_dynamic("Notification", "Machine Group Settings Saved", 'success', identifier);
                identifier++;
            }
            else {

                $.ajax({
                    url: '/EquipmentGroup/AddMachineGroupRelation',
                    data: { groupID: groupID, arrEquip: arrEquip },
                    method: 'post'
                }).success(function (result) {

                    if (result == "True")
                    {
                        modal_checker2 = 1;
                        $("#modal_div").modal("hide");
                        $("#form_modal_div").modal("hide");
                        $('#EquipmentGrid').jqxGrid('updatebounddata');
                        notification_modal_dynamic("Notification", "Machine Group Settings Saved", 'success', identifier);
                        identifier++;
                    }
                    else
                    {
                        modal_checker2 = 1;
                        $("#modal_div").modal("hide");
                        $("#form_modal_div").modal("hide");
                        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
                        identifier++;
                    }

                }).error(function () {
                    modal_checker2 = 1;
                    $("#modal_div").modal("hide");
                    $("#form_modal_div").modal("hide");
                    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
                    identifier++;
                });
            }
        }
        else {
            modal_checker2 = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
            identifier++;
        }
    }).error(function (e) {
        modal_checker2 = 1;
        $("#modal_div").modal("hide");
        $("#form_modal_div").modal("hide");
        notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier)
        identifier++;
    });
}

//build html modal confirmation for adding
function notification_modal_confirm_assign(groupID) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to save this machine group assignment?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="SaveAssign(' + "'" + groupID + "'" + ');">OK</button>';
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

        if (modal_checker2 == 0) {
            $("#form_modal_div").modal("show");
        }
        else {
            $("#form_modal_div").modal("hide");
        }

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        modal_checker2 = 0;
    });
}

function AddEquipment()
{
    var index = $("#ddEquipment option:selected").index();
    var equipment = $('#ddEquipment').val();
    var equipmentText = $("#ddEquipment option:selected").text();

    if (index == 0)
    {
        notification_modal_dynamic_super("Notification", "Select Machine", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    if (!arrEquip.contains(equipment))
    {
        $.ajax({
            url: '/EquipmentGroup/CheckIfMachineExist',
            method: 'get',
            data: { groupID: id, equipID: equipment }
        }).success(function (result) {

            if (result == "False") {

                arrEquip.push(equipment);
                $('#lblList').show();
                var tempID = "divAssign_" + equipment;
                $('#divAssign').append('<div style="text-indent:1em;margin-bottom:4px;" id="' + tempID + '"><button class="btn btn-danger" onclick="RemoveEquipment(' + "'" + tempID + "'" + ',' + "'" + equipment + "'" + ');" type="button"><span class="glyphicon glyphicon-remove"></span></button>&nbsp;<label style="text-indent:0em;">' + equipmentText + '</label><br/></div>');

                if (arrEquip.length > 1) {
                    $('#lblList').text("Added Machines:");
                }
                else {
                    $('#lblList').text("Added Machine:");
                }

                $('#lblList').show();
            }
            else {
                notification_modal_dynamic_super("Notification", "Machine already belongs to another group", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
    else
    {
        notification_modal_dynamic_super("Notification", "Machine Already Added", 'danger', 'form_modal_div', identifier);
        identifier++;
    }
}

function RemoveEquipment(ID, equipment)
{
    var arrIndex = arrEquip.indexOf(parseInt(equipment));
    arrEquip.splice(arrIndex, 1);
    $('#' + ID).remove();

    if (arrEquip == null || arrEquip.length == 0)
    {
        $('#lblList').text("Added Machine:");
        $('#lblList').hide();
    }
    else
    {
        if (arrEquip.length > 1) {
            $('#lblList').text("Added Machines:");
        }
        else {
            $('#lblList').text("Added Machine:");
        }
    }
}

function setup_assign()
{
    //ajax call to the controller that will return list of equipments
    $.ajax({
        url: '/EquipmentGroup/GetAllEquipmentWithGroup',
        method: 'get'
    }).success(function (val) {
        var json = JSON.parse(val);

        for (var i = 0; i < json.length; i++) {

            $('#ddEquipment').append($('<option></option>').val(json[i].ID).html(json[i].EquipID));
        }
    });

    //get assigned machine 
    $.ajax({
        url: '/EquipmentGroup/GetAssignedMachine',
        method: 'get',
        data: {groupID: id}
    }).success(function (res) {

        var json = JSON.parse(res);

        if (json != null)
        {
            if (json.length > 0)
            {
                for (var i = 0; i < json.length; i++) {

                    var equip = json[i].ID;
                    var equipText = json[i].EquipID;

                    arrEquip.push(equip);
                    $('#lblList').show();
                    var tempID = "divAssign_" + equip;
                    $('#divAssign').append('<div style="text-indent:1em;margin-bottom:4px;" id="' + tempID + '"><span title="Remove" data-toggle="tooltip"><button class="btn btn-danger" onclick="RemoveEquipment(' + "'" + tempID + "'" + ',' + "'" + equip + "'" + ');" type="button"><span class="glyphicon glyphicon-remove"></span></button></span>&nbsp;<label style="text-indent:0em;">' + equipText + '</label><br/></div>');

                    if (arrEquip.length > 1) {
                        $('#lblList').text("Added Machines:");
                    }
                    else {
                        $('#lblList').text("Added Machine:");
                    }

                    $('#lblList').show();

                }
                $('[data-toggle="tooltip"]').tooltip();
            }
        }
       
    });

    $('[data-toggle="tooltip"]').tooltip();

}

function setup(transaction)
{
    if (transaction.toUpperCase() == "EDIT")
    {
        $("#txtName").val(name);
        $("#txtName").attr('disabled', 'disabled');

        var temp = false;
        if (isEnabled.toUpperCase() == 'ENABLED') {
            temp = true;
        }

        if (temp == true) {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
        }
        else {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled">Enabled</label>');
        }
    }
    else
    {
        $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
        $('#divChkSECSGEM').append('<label><input type="checkbox" id="chkSECSGEM">Yes</label>');
    }
}

//function for submitting form for equipment type
function save(transaction) {

    name = $('#txtName').val().trim().toUpperCase();
    isEnabled = $('#chkEnabled').is(':checked');

    //validate the fields
    if (name == "") {
        notification_modal_dynamic_super("Notification", "Group Name is required", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    //check if the equipment type already exists
    if (transaction.toUpperCase() == "ADD") {

        $.ajax({
            url: '/EquipmentGroup/CheckEquipmentGroup',
            method: 'get',
            data: { name: name }
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_add();
            }
            else {
                notification_modal_dynamic_super("Notification", "Group Name already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
    else {

        $.ajax({
            url: '/EquipmentGroup/CheckEquipmentGroupForUpdate',
            method: 'get',
            data: { name: name, ID: id }
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_update();
            }
            else {
                notification_modal_dynamic_super("Notification", "Machine Type already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
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
    modal += "Are you sure you want to add this machine group?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="insertRecord();">OK</button>';
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
    modal += "Are you sure you want to update this machine group?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="updateRecord();">OK</button>';
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
function notification_modal_confirm_delete(groupID) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to delete this machine group?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="deleteRecord(' + "'" + groupID + "'" + ');">OK</button>';
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

//function for inserting to table
function insertRecord() {

    $.ajax({
        url: '/EquipmentGroup/AddMachineGroup',
        data: { name: name.toUpperCase(), isEnabled: isEnabled},
        method: 'post'
    }).success(function (val) {
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Group Added", 'success', identifier);
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
function updateRecord() {

    $.ajax({
        url: '/EquipmentGroup/UpdateMachineGroup',
        data: { id: id, name: name.toUpperCase(), isEnabled: isEnabled},
        method: 'post'
    }).success(function (val) {

        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Group Updated", 'success', identifier);
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
function deleteRecord(groupID) {
    
    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/EquipmentGroup/DeleteMachineGroup',
        data: { ID: groupID },
        method: 'post'
    }).success(function (val) {

        if (val == "True") {

            $('#EquipmentGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Group Deleted", 'success', identifier);
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