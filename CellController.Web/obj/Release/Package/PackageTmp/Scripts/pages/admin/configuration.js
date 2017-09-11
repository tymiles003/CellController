
var datatable;
var index;
var identifier = 1;
var modal_checker = 0;

var id = "";
var type = "";
var isEnabled = "";
var isSECSGEM = "";

$(document).ready(function (e) {
    
    //assign create button onclick function
    $("#cmdAddNew").click(function () {
        showform.type('add');
        $('.modal-title').text('Add Machine Type');
    });

    //assign click function for edit
    $(document).delegate(".EquipmentTypeGrid_Edit", "click", function () {
        showform.type('edit', index);
        $('.modal-title').text('Update Machine Type');
    });

    //assign click function for delete
    $(document).delegate(".EquipmentTypeGrid_Delete", "click", function () {
        //get the rowid
        var rowID = $("#EquipmentTypeGrid").jqxGrid('getrowid', index);
        //get the date
        var data = $("#EquipmentTypeGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.id_number;
        //pass the id to be deleted
        notification_modal_confirm_delete(id);
    });

    $('#EquipmentTypeGrid').on('rowclick', function (event) {
        var args = event.args;
        // row's bound index.
        var boundIndex = args.rowindex;
        // row's visible index.
        var visibleIndex = args.visibleindex;
        // right click.
        var rightclick = args.rightclick;
        // original event.
        var ev = args.originalEvent;

        var rowID = $("#EquipmentTypeGrid").jqxGrid('getrowid', boundIndex);
        var data = $("#EquipmentTypeGrid").jqxGrid('getrowdatabyid', rowID);
        datatable = $("#EquipmentTypeGrid").jqxGrid('getrowdatabyid', rowID);
        index = boundIndex;
    });

    //assign keyup function for search
    $(document).delegate("#EquipmentTypeGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#EquipmentTypeGrid_searchField').val();

        //assign columns to be queried
        var columns = ["type_string", "status_string", 'SECSGEM_Compatible_string'
        ];

        //pass the criteria to be searched
        generalSearch(search, "EquipmentTypeGrid", columns, e);
    });

    $("#btnSave").click(function (e) {
        if ($("#txtTolerance").val() == "") {
            notification_modal_dynamic("Notification", "Tolerance value cannot be null", 'danger', identifier);
            identifier++;
        }
        else if ($("#txtOPCTimeout").val() == "") {
            notification_modal_dynamic("Notification", "OPC Command Timeout value cannot be null", 'danger', identifier);
            identifier++;
        }
        else if ($("#txtDefaultPassword").val() == "") {
            notification_modal_dynamic("Notification", "Default Password value cannot be null", 'danger', identifier);
            identifier++;
        }
        else if ($("#txtNoMarkTemplate").val() == "") {
            notification_modal_dynamic("Notification", "No Mark Template Filename value cannot be null", 'danger', identifier);
            identifier++;
        }
        else {
            notification_modal_confirm();
        }
    });

    $.ajax({
        url: '/Configuration/GetTolerance',
        method: 'get'
    }).success(function (val) {
        $('#txtTolerance').val(val);

    }).error(function () {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    $.ajax({
        url: '/Configuration/GetOPCTimeoout',
        method: 'get'
    }).success(function (val) {
        $('#txtOPCTimeout').val(val);

    }).error(function () {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    $.ajax({
        url: '/Configuration/GetNoMarkTemplate',
        method: 'get'
    }).success(function (val) {
        $('#txtNoMarkTemplate').val(val);

    }).error(function () {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    $.ajax({
        url: '/Configuration/GetDefaultPassword',
        method: 'get'
    }).success(function (val) {
        $('#txtDefaultPassword').val(val);

    }).error(function () {
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    $('#txtOPCTimeout').keydown(function (e) {

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

    HideLoading();

});

//check character input
function check(e, value) {
    //Check Character
    var unicode = e.charCode ? e.charCode : e.keyCode;
    if (value.indexOf(".") != -1) if (unicode == 46) return false;
    if (unicode != 8) if ((unicode < 48 || unicode > 57) && unicode != 46) return false;
}

//function for checking length of textbox tolerance value
function checkLength() {
    var fieldVal = document.getElementById('txtTolerance').value;

    if (fieldVal < 100) {
        
        if (fieldVal.includes("."))
        {
            var str = document.getElementById('txtTolerance').value;
            var temp = str.split(".")[1];

            if (temp.length <= 2)
            {
                return true
            }
            else
            {
                var str = document.getElementById('txtTolerance').value;
                str = str.substring(0, str.length - 1);
                document.getElementById('txtTolerance').value = str;
            }
        }
        else
        {
            return true;
        }
    }
    else if (fieldVal == 100)
    {
        if (fieldVal.includes("."))
        {
            var str = document.getElementById('txtTolerance').value;
            str = str.substring(0, str.length - 1);
            document.getElementById('txtTolerance').value = str;
        }
    }
    else
    {
        var str = document.getElementById('txtTolerance').value;
        str = str.substring(0, str.length - 1);
        document.getElementById('txtTolerance').value = str;
    }
}

//function for building the html of the add/edit page
var showform = {

    type: function (operation, boundIndex) {

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#EquipmentTypeGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#EquipmentTypeGrid").jqxGrid('getrowdatabyid', rowID);

            id = data.id_number;
            type = data.type_string;
            isEnabled = data.status_string;
            isSECSGEM = data.SECSGEM_Compatible_string;
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
        modal += '  <label for="txtEquipmentType">Machine Type:</label>';
        modal += '  <input type="text" style="text-transform:uppercase;" class="form-control inputtext" placeholder="Machine Type" id="txtEquipmentType" autocomplete="off">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12" style="margin:0px;padding-top:0px;" id="divChk">';
        modal += '<label for="chkEnabled">Status:</label>';
        
        modal += '<div></div>';

        modal += '</div>';

        modal += '<div class="form-group col-md-12" style="margin:0px;padding-top:0px;" id="divChkSECSGEM">';
        modal += '<label for="chkSECSGEM">SECSGEM Compatible:</label>';

        modal += '<div></div>';

        modal += '</div>';
        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';

        if (operation.toUpperCase() == "ADD") {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="submit(' + "'add'" + ');">Add</button>';
        }
        else {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="submit(' + "'update'" + ');">Update</button>';
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
};

//function for submitting form for equipment type
function submit(transaction) {

    type = $('#txtEquipmentType').val().trim().toUpperCase();
    isEnabled = $('#chkEnabled').is(':checked');
    isSECSGEM = $('#chkSECSGEM').is(':checked');

    //validate the fields
    if (type == "") {
        notification_modal_dynamic_super("Notification", "Machine Type is required", 'danger', 'form_modal_div', identifier);
        identifier++;
        return;
    }

    //check if the equipment type already exists
    if (transaction.toUpperCase() == "ADD") {

        $.ajax({
            url: '/Configuration/CheckEquipmentType',
            method: 'get',
            data: { type: type }
        }).success(function (result) {

            if (result == "False") {
                notification_modal_confirm_add();
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
    else
    {
        $.ajax({
            url: '/Configuration/CheckEquipmentTypeForUpdate',
            method: 'get',
            data: { type: type, ID: id }
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
    modal += "Are you sure you want to add this machine type?";
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
    modal += "Are you sure you want to update this machine type?";
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
    modal += "Are you sure you want to delete this machine type?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="deleteRecord(' + "'" + equipID + "'" + ');">OK</button>';
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

//function for onload setup
function setup(transaction) {

    if (transaction.toUpperCase() == "EDIT") {
        $("#txtEquipmentType").val(type);
        $("#txtEquipmentType").attr('disabled', 'disabled');

        var temp = false;
        if (isEnabled.toUpperCase() == 'ENABLED') {
            temp = true;
        }

        var temp2 = false
        if (isSECSGEM.toUpperCase() == 'YES') {
            temp2 = true;
        }

        if (temp == true)
        {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
        }
        else
        {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled">Enabled</label>');
        }

        if (temp2 == true) {
            $('#divChkSECSGEM').append('<label><input type="checkbox" id="chkSECSGEM" checked="checked">Yes</label>');
        }
        else {
            $('#divChkSECSGEM').append('<label><input type="checkbox" id="chkSECSGEM">Yes</label>');
        }
    }
    else
    {
        $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
        $('#divChkSECSGEM').append('<label><input type="checkbox" id="chkSECSGEM">Yes</label>');
    }
}

//function for inserting to table
function insertRecord() {

    $.ajax({
        url: '/Configuration/AddEquipmentType',
        data: { type: type.toUpperCase(), isEnabled: isEnabled, isSECSGEM : isSECSGEM},
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentTypeGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Type Added", 'success', identifier);
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
        url: '/Configuration/UpdateEquipmentType',
        data: { id: id, type: type.toUpperCase(), isEnabled: isEnabled, isSECSGEM: isSECSGEM},
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#EquipmentTypeGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Type Updated", 'success', identifier);
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
function deleteRecord(equipId) {

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/Configuration/DeleteEquipmentType',
        data: { ID: equipId },
        method: 'post'
    }).success(function (val) {

        if (val == "True") {
            
            $('#EquipmentTypeGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Machine Type Deleted", 'success', identifier);
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

//build html modal confirmation
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
    modal += "Are you sure you want to save this configuration?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="save();">OK</button>';
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

//function for saving config
function save() {

    var tolerance = $("#txtTolerance").val();
    var isSignalR = $('#chkSignalR').is(':checked');
    var OPCTimeout = $("#txtOPCTimeout").val();
    var isOPCTimeout = $('#chkOPCTimeout').is(':checked');
    var DefaultPassword = $("#txtDefaultPassword").val();
    var NoMarkTemplate = $('#txtNoMarkTemplate').val().trim().toUpperCase();
    var isScanner = $('#chkScanner').is(':checked');
    var isHost = $('#chkHost').is(':checked');
    var isEffectiveDate = $('#chkEffectiveDate').is(':checked');

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");
    
    $.ajax({
        url: '/Configuration/SaveConfig',
        data: { isSignalR: isSignalR, tolerance: tolerance, isOPCTimeout: isOPCTimeout, OPCTimeout: OPCTimeout, DefaultPassword: DefaultPassword, NoMarkTemplate: NoMarkTemplate, isScanner: isScanner, isHost: isHost, isEffectiveDate: isEffectiveDate },
        method: 'post',
        beforeSend: function () {
            $("#btnSave").attr("disabled", "disabled");
        }
    }).success(function (val)
    {
        $("#btnSave").removeAttr("disabled");

        if (val == "True")
        {
            var floatVal = parseFloat(tolerance);
            $("#txtTolerance").val(floatVal);
            notification_modal_dynamic("Notification", "Configuration Saved", 'success', identifier);
            identifier++;
        }
        else
        {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }

    }).error(function ()
    {
        $("#btnSave").removeAttr("disabled");
        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
        identifier++;
    });

    
}



