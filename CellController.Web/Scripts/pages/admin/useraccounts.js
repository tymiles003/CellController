
var datatable;
var index;
var type_datatable;
var type_index;
var identifier = 1;
var modal_checker = 0;

var username = '';
var firstname = '';
var lastname = '';
var middleInitial = '';
var email = '';
var position = '';

var modecode = "";
var modedesc = "";
var loginsupervision = "";

var globalFrom = "";
var globalUserPage = "";
var globalUserTypePage = "";
var globalUserSearch = "";
var globalUserTypeSearch = "";
var check = false;

$(document).ready(function (e)
{
    //assign create button onclick function
    $("#cmdAddNew").click(function () {
        showform.user('add');
        check = false;
        $('.modal-title').text('Add Account');
    });

    $('#UserGrid').on('rowclick', function (event) {
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
        var rowID = $("#UserGrid").jqxGrid('getrowid', boundIndex);

        //get data based on row id
        var data = $("#UserGrid").jqxGrid('getrowdatabyid', rowID);
        datatable = $("#UserGrid").jqxGrid('getrowdatabyid', rowID);
        index = boundIndex;
    });

    //assign click function for edit
    $(document).delegate(".UserGrid_Edit", "click", function () {
        showform.user('edit', index);
        check = true
        $('.modal-title').text('Update Account');
    });

    //assign click function for delete
    $(document).delegate(".UserGrid_Delete", "click", function () {
        //get the row id
        var rowID = $("#UserGrid").jqxGrid('getrowid', index);
        //get the data
        var data = $("#UserGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.username_string;
        //pass the id to be deleted
        notification_modal_confirm_delete(id);
    });

    //assign keyup function for search
    $(document).delegate("#UserGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#UserGrid_searchField').val();

        //assign columns to be queried
        var columns = ["username_string", "first_name_string", "last_name_string", "middle_initial_string", "email_string", "user_role_string"];

        //pass the criteria to be searched
        generalSearch(search, "UserGrid", columns, e);
    });

    //assign create button onclick function
    $("#cmdAddNewUserType").click(function () {
        showform_type.type('add');
        $('.modal-title').text('Add User Role');
    });

    $('#UserTypeGrid').on('rowclick', function (event) {
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
        var rowID = $("#UserTypeGrid").jqxGrid('getrowid', boundIndex);

        //get data based on row id
        var data = $("#UserTypeGrid").jqxGrid('getrowdatabyid', rowID);
        type_datatable = $("#UserTypeGrid").jqxGrid('getrowdatabyid', rowID);
        type_index = boundIndex;
    });

    //assign click function for edit
    $(document).delegate(".UserTypeGrid_Edit", "click", function () {
        showform_type.type('edit', type_index);
        $('.modal-title').text('Update User Role');
    });

    //assign click function for delete
    $(document).delegate(".UserTypeGrid_Delete", "click", function () {
        //get the row id
        var rowID = $("#UserTypeGrid").jqxGrid('getrowid', type_index);
        //get the data
        var data = $("#UserTypeGrid").jqxGrid('getrowdatabyid', rowID);

        id = data.user_mode_code_number;
        //pass the id to be deleted
        notification_modal_confirm_delete_group(id);
    });

    //assign keyup function for search
    $(document).delegate("#UserTypeGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#UserTypeGrid_searchField').val();

        //assign columns to be queried
        var columns = ["name_string", 'login_supervision_string'];

        //pass the criteria to be searched
        generalSearch(search, "UserTypeGrid", columns, e);
    });

    globalFrom = getCookie('UserAccountFrom');
    globalUserPage = getCookie('UserAccountFromUserPage');
    globalUserTypePage = getCookie('UserAccountFromUserTypePage');
    globalUserSearch = getCookie('UserAccountFromSearchUser');
    globalUserTypeSearch = getCookie('UserAccountFromSearchUserType');

    HideLoading();

});

$(document).ajaxStop(function () {

    if (globalFrom != null && globalFrom != "")
    {
        //for user grid 
        $('#UserGrid_searchField').val(globalUserSearch);

        var gridID = 'UserGrid';

        var filtertype = 'stringfilter';
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 0;
        var filtervalue = $('#UserGrid_searchField').val();
        var filtercondition = 'contains';

        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(1, filter);

        var columns = ["username_string", "first_name_string", "last_name_string", "middle_initial_string", "email_string", "user_role_string"];

        for (var i = 0; i < columns.length; i++) {
            $('#' + gridID).jqxGrid('addfilter', columns[i], filtergroup);
        }

        $('#' + gridID).jqxGrid('applyfilters');

        //for user type grid
        $('#UserTypeGrid_searchField').val(globalUserTypeSearch);

        gridID = 'UserTypeGrid';

        filtertype = 'stringfilter';
        filtergroup = new $.jqx.filter();
        filter_or_operator = 0;
        filtervalue = $('#UserTypeGrid_searchField').val();
        filtercondition = 'contains';

        filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(1, filter);

        columns = ["name_string", 'login_supervision_string'];

        for (var i = 0; i < columns.length; i++) {
            $('#' + gridID).jqxGrid('addfilter', columns[i], filtergroup);
        }

        $('#' + gridID).jqxGrid('applyfilters');

        //now go to page
        setTimeout(function () {

            var index = parseInt(globalUserPage);
            $("#UserGrid").jqxGrid('gotopage', index);

            var index2 = parseInt(globalUserTypePage);
            $("#UserTypeGrid").jqxGrid('gotopage', index2);

            notification_modal_dynamic("Notification", globalFrom, 'success', identifier);
            identifier++;
            
            deleteCookie('UserAccountFromSearchUser');
            deleteCookie('UserAccountFromUserPage');

            deleteCookie('UserAccountFromUserTypePage');
            deleteCookie('UserAccountFromSearchUserType');
            
            globalUserSearch = "";
            globalUserPage = "";

            globalUserTypePage = "";
            globalUserTypeSearch = "";

            deleteCookie('UserAccountFrom');
            globalFrom = "";

        }, 50);
    }

});

//function for building the html of the add/edit page
var showform_type = {

    type: function (operation, boundIndex) {

        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#UserTypeGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#UserTypeGrid").jqxGrid('getrowdatabyid', rowID);

            modecode = data.user_mode_code_number;
            modedesc = data.name_string;
            loginsupervision = data.login_supervision_string;
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
        modal += '<label for="txtUserGroup">Name:</label>';
        modal += '<input type="text" class="form-control" id="txtUserGroup" placeholder="Name">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12" id="divChk">';
        modal += '<label for="chkEnabled">Login Supervision:</label>';

        modal += '<div></div>';

        modal += '</div>';

        modal += '</div>';

        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';

        if (operation.toUpperCase() == "ADD") {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="CreateUserGroup();">Add</button>';
        }
        else {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="UpdateUserGroup();">Update</button>';
        }

        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        modal += '<script>';
        modal += '$(document).ready(function () {setup2("' + operation + '","");});';
        modal += '</script>';

        $("#form_modal").html(modal);
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    }
};

//function for building the html of the add/edit page
var showform = {

    user: function (operation, boundIndex) {


        if (operation.toUpperCase() == "EDIT") {

            var rowID = $("#UserGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#UserGrid").jqxGrid('getrowdatabyid', rowID);

            username = data.username_string;
            firstname = data.first_name_string;
            lastname = data.last_name_string;
            middleInitial = data.middle_initial_string;
            email = data.email_string;
            position = data.user_role_string;
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
        modal += '<label for="txtUsername">Username:</label>';
        modal += '<div class="input-group">';
        modal += '<input type="text" class="form-control" id="txtUsername" placeholder="Username">';
        modal += '<span class="input-group-btn">';
        modal += '<button class="btn btn-default" type="button" id="btnGetDetails" onclick="notification_modal_confirm_AD();"><span id="spanGetDetails">Get AD Details</span></button>';
        modal += '</span>';
        modal += '</div>';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="txtFirstName">First Name:</label>';
        modal += '<input type="text" class="form-control" id="txtFirstName" placeholder="First Name">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="txtLastName">Last Name:</label>';
        modal += '<input type="text" class="form-control" id="txtLastName" placeholder="Last Name">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="txtMiddleName">Middle Initial:</label>';
        modal += '<input type="text" class="form-control" id="txtMiddleName" placeholder="Middle Initial">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="ddAccountType">User Role:</label>';
        modal += '<select id="ddAccountType" class="form-control">';
        modal += '<option selected disabled>Select User Role</option>'
        modal += '</select>'
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="txtPassword">Password:</label>';
        modal += '<div class="input-group">';
        modal += '<input type="password" class="form-control" id="txtPassword" placeholder="Password">';
        modal += '<span class="input-group-btn">';
        modal += '<button class="btn btn-default" type="button" id="btnSetPassword" onclick="notification_modal_confirm_password();"><span id="spanSetPassword">Set Default Password</span></button>';
        modal += '</span>';
        modal += '</div>';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '<label for="txtConfirmPassword">Confirm Password:</label>';
        modal += '<input type="password" class="form-control" id="txtConfirmPassword" placeholder="Confirm Password">';
        modal += '</div>';

        modal += '<div class="form-group col-md-12">';
        modal += '  <label for="txtEmail">Email:</label>';
        modal += '<input type="text" class="form-control" id="txtEmail" placeholder="Email">';


        modal += '<div></div>';

        modal += '</div>';

        modal += '</div>';

        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';

        if (operation.toUpperCase() == "ADD") {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="CreateUser();">Add</button>';
        }
        else {
            modal += '<button type="button" class="btn btn-success" id="btnSave" onclick="UpdateUser();">Update</button>';
        }

        modal += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel">Cancel</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        modal += '<script>';
        if (operation.toUpperCase() == "ADD") {
            modal += '$(document).ready(function () {setup("' + operation + '","");});';
        }
        else {
            modal += '$(document).ready(function () {setup("' + operation + '","' + username + '");});';
        }
        modal += '</script>';

        $("#form_modal").html(modal);
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

    }
};

//function for setting default password
function SetPassword(password)
{
    $('#txtPassword').val(password);
    $('#txtConfirmPassword').val(password);

    $("#modal_div").modal("hide");

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

//function for UI control setup onload
function setup(operation, username)
{
    populateAccountType(operation);
}

//function for onload setup
function setup2(transaction) {

    if (transaction.toUpperCase() == "EDIT")
    {
        $("#txtUserGroup").val(modedesc);
        $("#txtUserGroup").attr('disabled', 'disabled');

        var temp = false;
        if (loginsupervision.toUpperCase() == 'ENABLED')
        {
            temp = true;
        }

        if (temp == true) {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
        }
        else {
            $('#divChk').append('<label><input type="checkbox" id="chkEnabled">Enabled</label>');
        }
    }
    else {
        $('#divChk').append('<label><input type="checkbox" id="chkEnabled" checked="checked">Enabled</label>');
    }
}

//function for getting account types
function populateAccountType(operation)
{
    $.ajax({
        url: '/UserAccount/GetAccountTypes',
        method: 'get'
    }).success(function (val) {
        var json = JSON.parse(val);
        for (var i = 0; i < json.length; i++) {
            $('#ddAccountType').append($('<option></option>').val(json[i].UserModeCode).html(json[i].UserModeDesc));
        }

        if(operation.toUpperCase() != "ADD")
        {
            $("#txtUsername").attr("disabled", "disabled");
            $("#txtUsername").val(username);
            $("#txtFirstName").val(firstname);
            $("#txtLastName").val(lastname);
            $("#txtMiddleName").val(middleInitial);
            $("#txtEmail").val(email);

            //$("#btnGetDetails").attr("disabled", "disabled");
            
            $("#ddAccountType option:contains('" + position + "')").attr('selected', 'selected');
        }
    });
}

//function to get the AD details
function GetDetails()
{
    $("#modal_div").modal("hide");

    $.ajax({
        url: '/UserAccount/GetUserDetails',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        cache: false,
        data:
        {
            username: $("#txtUsername").val()
        },
        beforeSend: function ()
        {
            $("#txtUsername").attr("disabled", "disabled");
            $("#txtFirstName").attr("disabled", "disabled");
            $("#txtLastName").attr("disabled", "disabled");
            $("#txtMiddleName").attr("disabled", "disabled");
            $("#ddAccountType").attr("disabled", "disabled");
            $("#txtPassword").attr("disabled", "disabled");
            $("#txtConfirmPassword").attr("disabled", "disabled");
            $("#txtEmail").attr("disabled", "disabled");
            $("#spanGetDetails").text("Loading...");
            $('#btnSave').attr("disabled", "disabled");
            $('#btnCancel').attr("disabled", "disabled");
            $('#btnSetPassword').attr("disabled", "disabled");
        },
        success: function (val)
        {
            if (check == false)
            {
                $('#txtUsername').removeAttr('disabled');
            }
            
            $('#txtFirstName').removeAttr('disabled');
            $('#txtLastName').removeAttr('disabled');
            $('#txtMiddleName').removeAttr('disabled');
            $('#ddAccountType').removeAttr('disabled');
            $('#txtPassword').removeAttr('disabled');
            $('#txtConfirmPassword').removeAttr('disabled');
            $('#txtEmail').removeAttr('disabled');
            $('#btnSave').removeAttr("disabled");
            $('#btnCancel').removeAttr("disabled");
            $('#btnSetPassword').removeAttr("disabled");
            $("#spanGetDetails").text("Get AD Details");

            if (val.Error == false) {
                
                $('#txtFirstName').val(val.FirstName);
                $('#txtLastName').val(val.LastName);
                $('#txtMiddleName').val(val.MiddleName);
                $('#txtEmail').val(val.Email);
            }
            else {

                modal_checker = 1;

                //$('#txtFirstName').val("");
                //$('#txtLastName').val("");
                //$('#txtMiddleName').val("");
                //$('#txtEmail').val("");

                notification_modal_dynamic_super("Notification", "Cannot retrieve AD data", 'danger', 'form_modal_div', identifier)
                identifier++;
            }
        },
        error: function (e)
        {
            modal_checker = 1;

            if (check == false) {
                $('#txtUsername').removeAttr('disabled');
            }

            $('#txtFirstName').removeAttr('disabled');
            $('#txtLastName').removeAttr('disabled');
            $('#txtMiddleName').removeAttr('disabled');
            $('#ddAccountType').removeAttr('disabled');
            $('#txtPassword').removeAttr('disabled');
            $('#txtConfirmPassword').removeAttr('disabled');
            $('#txtEmail').removeAttr('disabled');
            $('#btnSave').removeAttr("disabled");
            $('#btnCancel').removeAttr("disabled");
            $('#btnSetPassword').removeAttr("disabled");
            $("#spanGetDetails").text("Get AD Details");

            //$('#txtFirstName').val("");
            //$('#txtLastName').val("");
            //$('#txtMiddleName').val("");
            //$('#txtEmail').val("");

            notification_modal_dynamic_super("Notification", "Cannot retrieve AD data", 'danger', 'form_modal_div', identifier)
            identifier++;
        }
    });
}

//function for email validation
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//build html modal confirmation for setting default passowrd
function notification_modal_confirm_password() {

    $.ajax({
        url: '/UserAccount/GetDefaultPassword',
        type: 'get',
        success: function (val) {

            header_style = 'style="background-color: #1DB198; color: #ffffff;"';

            var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
            modal += '<div class="modal-dialog">';
            modal += '<div class="modal-content">';

            modal += '<div class="modal-header" ' + header_style + '>';
            modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
            modal += '</div>';

            modal += '<div class="modal-body"><br />';
            modal += "Are you sure you want to set the default password (" + val + ")?";
            modal += '</div>';

            modal += '<div class="modal-footer" style="text-align:center;">';
            modal += '<button type="button" class="btn btn-success" onclick="SetPassword(' + "'" + val + "'" + ');">OK</button>';
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

        },
        error: function (e) {
            notification_modal_dynamic_super("Notification", "Cannot set default password", 'danger', 'form_modal_div', identifier);
            identifier++;
        }
    });
    
}

//build html modal confirmation for setting default passowrd
function notification_modal_confirm_AD() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to set the Active Directory details?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="GetDetails();">OK</button>';
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
    modal += "Are you sure you want to add this account?";
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

//build html modal confirmation for adding user group
function notification_modal_confirm_add_group() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to add this User Role?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="insertGroupRecord();">OK</button>';
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

//function for inserting user to table
function CreateUser() {

    var username = $('#txtUsername').val().trim();
    var firstname = $('#txtFirstName').val().trim();
    var lastname = $('#txtLastName').val().trim();
    var middlename = $("#txtMiddleName").val().trim();
    var password = $('#txtPassword').val().trim();
    var confirmpassword = $('#txtConfirmPassword').val().trim();
    var email = $('#txtEmail').val().trim();
    var index = $("#ddAccountType option:selected").index();
    var modecode = $("#ddAccountType option:selected").val();
    var position = $("#ddAccountType option:selected").text();

    //validate the fields
    if (username == "" || firstname == "" || lastname == "" || password == "" || confirmpassword == "" || email == "" || index == 0)
    {

        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (username == "") {
            msg += "Username<br/>";
        }
        if (firstname == "") {
            msg += "First Name<br/>";
        }
        if (lastname == "") {
            msg += "Last Name<br/>";
        }
        if (index == 0) {
            msg += "User Role<br/>";
        }
        if (password == "") {
            msg += "Password<br/>";
        }
        if (confirmpassword == "") {
            msg += "Confirm Password<br/>";
        }
        if (email == "") {
            msg += "Email<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)", "");

        notification_modal_dynamic_super("Notification", msg, 'danger', 'form_modal_div', identifier);
        identifier++;
    }
    else {

        //confirm the password
        if (password != confirmpassword)
        {
            notification_modal_dynamic_super("Notification", "Password does not match", 'danger', 'form_modal_div', identifier);
            identifier++;
        }
        else
        {
            //ajax call to the controller to check if the user exists
            if (validateEmail(email))
            {
                $.ajax({
                    url: '/UserAccount/CheckUser',
                    data: {
                        Username: $("#txtUsername").val()
                    },
                    method: 'get'
                }).success(function (val) {

                    if (val == "True") {
                        notification_modal_dynamic_super("Notification", "Username already exists", 'danger', 'form_modal_div', identifier);
                        identifier++;
                    }
                    else 
                    {
                        notification_modal_confirm_add();
                    }

                }).error(function (e) {
                    notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
                    identifier++;
                });
            }
            else {
                notification_modal_dynamic_super("Notification", "Please enter a valid email", 'danger', 'form_modal_div', identifier);
                identifier++;
            }
        }
    }
}

//function for inserting user group to table
function CreateUserGroup() {

    var usertype = $('#txtUserGroup').val().trim();
    var isChecked = $('#chkEnabled').is(':checked');
    
    //validate the fields
    if (usertype == "") {

        var msg = "Name is required";

        notification_modal_dynamic_super("Notification", msg, 'danger', 'form_modal_div', identifier);
        identifier++;
    }
    else {
        $.ajax({
            url: '/UserAccount/CheckUserGroup',
            data: {
                GroupName: $("#txtUserGroup").val()
            },
            method: 'get'
        }).success(function (val) {

            if (val == "True") {
                notification_modal_dynamic_super("Notification", "User Role already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }
            else {
                notification_modal_confirm_add_group();
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
}

//function to execute insert
function insertGroupRecord() {

    var userdesc = $('#txtUserGroup').val().trim();
    var isChecked = $('#chkEnabled').is(':checked');

    //ajax call to the controller for adding user
    $.ajax({
        url: '/UserAccount/AddUserGroup',
        data: {
            UserModeDesc: userdesc,
            isEnabled: isChecked
        },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserTypeGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "User Role Added", 'success', identifier);
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

//function to execute insert
function insertRecord()
{
    var username = $('#txtUsername').val().trim();
    var firstname = $('#txtFirstName').val().trim();
    var lastname = $('#txtLastName').val().trim();
    var middlename = $("#txtMiddleName").val().trim();
    var password = $('#txtPassword').val().trim();
    var confirmpassword = $('#txtConfirmPassword').val().trim();
    var email = $('#txtEmail').val().trim();
    var index = $("#ddAccountType option:selected").index();
    var modecode = $("#ddAccountType option:selected").val();
    var position = $("#ddAccountType option:selected").text();

    //ajax call to the controller for adding user
    $.ajax({
        url: '/UserAccount/AddUser',
        data: {
            Username: username,
            FirstName: firstname,
            LastName: lastname,
            MiddleName: middlename,
            ModeCode: modecode,
            Password: password,
            Email: email
        },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserGrid').jqxGrid('updatebounddata');
            notification_modal_dynamic("Notification", "Account Added", 'success', identifier);
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
function notification_modal_confirm_delete(id) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to delete this account?";
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

//build html modal for deleting
function notification_modal_confirm_delete_group(id) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to delete this User Role?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="deleteGroupRecord(' + "'" + id + "'" + ');">OK</button>';
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

//function to execute delete
function deleteRecord(id) {

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/UserAccount/DeleteUser',
        data: { username: id },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            $('#UserGrid').jqxGrid('updatebounddata');

            var temp_username = getCookie("Username");

            if (temp_username == id)
            {
                $.ajax({
                    url: '/Account/Logout',
                    method: 'Get'
                }).success(function (val)
                {
                    if(val.error == false)
                    {
                        document.location.href = '/Account/Login';
                    }

                }).error(function (e) {
                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                    identifier++;
                });
            }
            else
            {
                notification_modal_dynamic("Notification", "Account Deleted", 'success', identifier);
                identifier++;
            }
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

//function to execute delete
function deleteGroupRecord(id) {

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");

    $.ajax({
        url: '/UserAccount/DeleteUserGroup',
        data: { UserModeCode: id },
        method: 'post'
    }).success(function (val) {

        if (val == "True") {
           
            $('#UserTypeGrid').jqxGrid('updatebounddata');

            $('#UserGrid').jqxGrid('updatebounddata');

            var position = getCookie("Position");
            $('#smPosition').html(position);

            var isNA = getCookie("isNAUser");
            if (isNA == "True")
            {
                location.reload();
            }
            else
            {
                notification_modal_dynamic("Notification", "User Role Deleted", 'success', identifier);
                identifier++;
            }
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
    modal += "Are you sure you want to update this account?";
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

//build html modal confirmation for updating
function notification_modal_confirm_update_group() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to update this User Role?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="updateGroupRecord();">OK</button>';
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

//function for updating user table
function UpdateUser() {

    var username = $('#txtUsername').val().trim();
    var firstname = $('#txtFirstName').val().trim();
    var lastname = $('#txtLastName').val().trim();
    var middlename = $("#txtMiddleName").val().trim();
    var password = $('#txtPassword').val().trim();
    var confirmpassword = $('#txtConfirmPassword').val().trim();
    var email = $('#txtEmail').val().trim();
    var index = $("#ddAccountType option:selected").index();
    var modecode = $("#ddAccountType option:selected").val();
    var position = $("#ddAccountType option:selected").text();

    //validate the fields
    if (username == "" || firstname == "" || lastname == "" || email == "" || index == 0) {

        var msg = "Please provide details for the following field(s):<br/><br/>";

        if (username == "") {
            msg += "Username<br/>";
        }
        if (firstname == "") {
            msg += "First Name<br/>";
        }
        if (lastname == "") {
            msg += "Last Name<br/>";
        }
        if (index == 0) {
            msg += "User Role<br/>";
        }
        if (email == "") {
            msg += "Email<br/>";
        }

        msg += ")";
        msg = msg.replace("<br/>)", "");

        notification_modal_dynamic_super("Notification", msg, 'danger', 'form_modal_div', identifier);
        identifier++;
    }
    else {

        //confirm the password
        if (password != confirmpassword) {
            notification_modal_dynamic_super("Notification", "Password does not match", 'danger', 'form_modal_div', identifier);
            identifier++;
        }
        else
        {
            if (validateEmail(email))
            {
                //$.ajax({
                //    url: '/UserAccount/CheckUser',
                //    data: {
                //        Username: $("#txtUsername").val()
                //    },
                //    method: 'get'
                //}).success(function (val) {

                //    if (val == "True") {
                //        notification_modal_dynamic("Notification", "Username already exists", 'danger', identifier);
                //        identifier++;
                //    }
                //    else {
                //        notification_modal_confirm_update();
                //    }

                //}).error(function (e) {
                //    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                //    identifier++;
                //});

                notification_modal_confirm_update();
            }
            else {
                notification_modal_dynamic_super("Notification", "Please enter a valid email", 'danger', 'form_modal_div', identifier);
                identifier++;
            }
        }
    }
}

//function for updating user group table
function UpdateUserGroup() {

    var group = $('#txtUserGroup').val().trim();
    
    //validate the fields
    if (group == "") {

        var msg = "Name is required";

        notification_modal_dynamic_super("Notification", msg, 'danger', 'form_modal_div', identifier);
        identifier++;
    }
    else {
        
        $.ajax({
            url: '/UserAccount/CheckUserGroupForUpdate',
            data: {
                GroupName: $("#txtUserGroup").val(),
                UserModeCode: modecode
            },
            method: 'get'
        }).success(function (val) {

            if (val == "True") {
                notification_modal_dynamic_super("Notification", "User Role already exists", 'danger', 'form_modal_div', identifier);
                identifier++;
            }
            else {
                notification_modal_confirm_update_group();
            }

        }).error(function (e) {
            notification_modal_dynamic_super("Notification", "Something went wrong please try again later", 'danger', 'form_modal_div', identifier);
            identifier++;
        });
    }
}

//function to execute update
function updateRecord() {
    var username = $('#txtUsername').val().trim();
    var firstname = $('#txtFirstName').val().trim();
    var lastname = $('#txtLastName').val().trim();
    var middlename = $("#txtMiddleName").val().trim();
    var password = $('#txtPassword').val().trim();
    var confirmpassword = $('#txtConfirmPassword').val().trim();
    var email = $('#txtEmail').val().trim();
    var index = $("#ddAccountType option:selected").index();
    var modecode = $("#ddAccountType option:selected").val();
    var position = $("#ddAccountType option:selected").text();

    //ajax call to the controller for adding user
    $.ajax({
        url: '/UserAccount/UpdateUser',
        data: {
            Username: username,
            FirstName: firstname,
            LastName: lastname,
            MiddleName: middlename,
            ModeCode: modecode,
            Password: password,
            Email: email
        },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserGrid').jqxGrid('updatebounddata');

            var temp_username = getCookie("Username");

            if (username == temp_username)
            {
                $.ajax({
                    url: '/UserAccount/RefreshPosition',
                    data: {
                        username: username
                    },
                    method: 'get'
                }).success(function (val) {

                    $('#smPosition').html(val);

                    var UserPaginginformation = $('#UserGrid').jqxGrid('getpaginginformation');
                    var userPage = UserPaginginformation.pagenum;

                    var UserTypePaginginformation = $('#UserTypeGrid').jqxGrid('getpaginginformation');
                    var userTypePage = UserTypePaginginformation.pagenum;

                    var searchUser = $('#UserGrid_searchField').val();
                    var searchUserType = $('#UserTypeGrid_searchField').val();

                    setCookie("UserAccountFrom", 'Account Updated', 30);
                    setCookie("UserAccountFromUserPage", userPage, 30);
                    setCookie("UserAccountFromUserTypePage", userTypePage, 30);
                    setCookie("UserAccountFromSearchUser", searchUser, 30);
                    setCookie("UserAccountFromSearchUserType", searchUserType, 30);
                    
                    document.location.href = '/UserAccount'
                });
            }
            else
            {
                notification_modal_dynamic("Notification", "Account Updated", 'success', identifier);
                identifier++;
            }
            
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

//function to execute update
function updateGroupRecord() {
    var group = $('#txtUserGroup').val().trim();
    var enabled = $('#chkEnabled').is(':checked');

    //ajax call to the controller for adding user
    $.ajax({
        url: '/UserAccount/UpdateUserGroup',
        data: {
            UserModeDesc: group,
            isEnabled: enabled,
            UserModeCode: modecode
        },
        method: 'post'
    }).success(function (val) {
        
        if (val == "True") {
            modal_checker = 1;
            $("#modal_div").modal("hide");
            $("#form_modal_div").modal("hide");
            $('#UserTypeGrid').jqxGrid('updatebounddata');

            $('#UserGrid').jqxGrid('updatebounddata');

            notification_modal_dynamic("Notification", "User Role Updated", 'success', identifier);
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

