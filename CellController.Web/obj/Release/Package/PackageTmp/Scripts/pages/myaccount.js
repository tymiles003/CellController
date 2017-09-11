var identifier = 1;
var currentPassword = "";
var originalPassword = "";
var username = "";

$(document).ready(function (e) {

    $("#txtUsername").attr("disabled", "disabled");
    username = getCookie("Username");
    $("#txtUsername").val(username);

    //getuser profile
    getUser(username);

    //button save onclick handler
    $('#btnSave').click(function () {

        var fname = $("#txtFirstName").val().trim();
        var lname = $("#txtLastName").val().trim();
        var mname = $("#txtMiddleName").val().trim();
        var email = $("#txtEmail").val().trim();

        var currentPassword = $("#txtCurrentPassword").val().trim();
        var newPassword = $("#txtPassword").val().trim();
        var confirmPassword = $("#txtConfirmPassword").val().trim();

        if (fname == "" || lname == "" || mname == "" || email == "")
        {
            var msg = "Please provide details for the following field(s):<br/><br/>";

            if (fname == "") {
                msg += "First Name<br/>";
            }
            if (lname == "") {
                msg += "Last Name<br/>";
            }
            if (mname == "") {
                msg += "Middle Initial<br/>";
            }
            if (email == "") {
                msg += "Email<br/>";
            }

            msg += ")";
            msg = msg.replace("<br/>)", "");

            notification_modal_dynamic("Notification", msg, "danger", identifier);
            identifier++;
        }
        else
        {
            var check = validateEmail(email);

            if (check == false) {
                notification_modal_dynamic("Notification", "Please enter a valid email", 'danger', identifier);
                identifier++;
            }
            else
            {
                if (newPassword != "" || confirmPassword != "")
                {
                    if (newPassword != confirmPassword)
                    {
                        notification_modal_dynamic("Notification", "Password does not match", 'danger', identifier);
                        identifier++;
                    }
                    else
                    {
                        if (currentPassword == "")
                        {
                            notification_modal_dynamic("Notification", "Enter Current Password", 'danger', identifier);
                            identifier++;
                        }
                        else
                        {
                            $.ajax({
                                url: '/MyAccount/GetEncodedPassword',
                                type: 'get',
                                data: { password: currentPassword },
                                success: function (val) {
                                    if (val != originalPassword) {
                                        
                                        
                                        $.ajax({
                                            url: '/MyAccount/ValidateAD',
                                            type: 'get',
                                            data: { username: username, password: currentPassword },
                                            success: function (result) {

                                                if (result == "True")
                                                {
                                                    notification_modal_confirm_save();
                                                }
                                                else
                                                {
                                                    notification_modal_dynamic("Notification", "Invalid Current Password", 'danger', identifier);
                                                    identifier++;
                                                }
                                            },
                                            error: function (e) {
                                                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                                                identifier++;
                                            }
                                        });
                                    }
                                    else
                                    {
                                        notification_modal_confirm_save();
                                    }

                                },
                                error: function (e) {
                                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                                    identifier++;
                                }
                            });
                        }
                    }
                }
                else
                {
                    notification_modal_confirm_save();
                }
            }
        }
    });

    HideLoading();

});

//function for email validation
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//function for getting user profile
function getUser(username)
{
    originalPassword = "";

    $.ajax({
        url: '/MyAccount/GetUserProfile',
        type: 'get',
        data: {username : username},
        success: function (val) {

            originalPassword = val.Password;
            $("#txtUsername").val(val.Username);
            $("#txtFirstName").val(val.FirstName);
            $("#txtLastName").val(val.LastName);
            $("#txtMiddleName").val(val.MiddleName);
            $("#txtEmail").val(val.Email);
            $("#txtUserGroup").val(val.UserModeDesc);

        },
        error: function (e) {
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    });
}

//function for setting default password
function SetPassword(password) {
    $('#txtPassword').val(password);
    $('#txtConfirmPassword').val(password);

    $("#modal_div").modal("hide");
}

//function for saving user profile
function save()
{
    var password = $('#txtPassword').val();
    var fname = $('#txtFirstName').val();
    var lname = $('#txtLastName').val();
    var mname = $('#txtMiddleName').val();
    var email = $('#txtEmail').val();

    $.ajax({
        url: '/MyAccount/Save',
        type: 'post',
        data: { username: username, password: password, fname: fname, lname: lname, mname: mname, email: email },
        beforeSend: function () {
            $("#btnSave").attr("disabled", "disabled");
        },
        success: function (val) {

            $("#btnSave").removeAttr("disabled");

            if (val == "True")
            {
                $.ajax({
                    url: '/MyAccount/GetEncodedPassword',
                    type: 'get',
                    data: { password: password },
                    success: function (pass) {
                        
                        originalPassword = pass;
                    }
                });

                $("#modal_div").modal("hide");
                notification_modal_dynamic("Notification", "Account Updated", 'success', identifier);
                identifier++;
            }
            else
            {
                $("#modal_div").modal("hide");
                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            }

        },
        error: function (e) {
            $("#modal_div").modal("hide");
            $("#btnSave").removeAttr("disabled");
            notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
            identifier++;
        }
    });
}

//build html modal confirmation for saving
function notification_modal_confirm_save() {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to update your account?";
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

//build html modal confirmation for setting default passowrd
function notification_modal_confirm_password() {

    $.ajax({
        url: '/MyAccount/GetDefaultPassword',
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

        },
        error: function (e) {
            notification_modal_dynamic("Notification", "Cannot set default password", 'danger', identifier);
            identifier++;
        }
    });


}

//build html modal confirmation for setting AD details
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
}

//function to get the AD details
function GetDetails() {

    $("#modal_div").modal("hide");

    $.ajax({
        url: '/MyAccount/GetUserDetails',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        cache: false,
        data:
        {
            username: $("#txtUsername").val()
        },
        beforeSend: function () {

            $("#txtFirstName").attr("disabled", "disabled");
            $("#txtLastName").attr("disabled", "disabled");
            $("#txtMiddleName").attr("disabled", "disabled");
            $("#txtPassword").attr("disabled", "disabled");
            $("#txtConfirmPassword").attr("disabled", "disabled");
            $("#txtEmail").attr("disabled", "disabled");
            $("#spanGetDetails").text("Loading...");
            $('#btnSave').attr("disabled", "disabled");
            $('#btnSetPassword').attr("disabled", "disabled");
            $("#txtCurrentPassword").attr("disabled", "disabled");
        },
        success: function (val) {
            $("#modal_div").modal("hide");

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
            $('#txtCurrentPassword').removeAttr("disabled");
            $("#spanGetDetails").text("Get AD Details");

            if (val.Error == false) {
                $('#txtFirstName').val(val.FirstName);
                $('#txtLastName').val(val.LastName);
                $('#txtMiddleName').val(val.MiddleName);
                $('#txtEmail').val(val.Email);
            }
            else {

                //$('#txtFirstName').val("");
                //$('#txtLastName').val("");
                //$('#txtMiddleName').val("");
                //$('#txtEmail').val("");

                notification_modal_dynamic("Notification", "Cannot retrieve AD data", 'danger', identifier);
                identifier++;
            }
        },
        error: function (e) {
            $("#modal_div").modal("hide");

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
            $('#txtCurrentPassword').removeAttr('disabled');
            $("#spanGetDetails").text("Get AD Details");

            //$('#txtFirstName').val("");
            //$('#txtLastName').val("");
            //$('#txtMiddleName').val("");
            //$('#txtEmail').val("");

            notification_modal_dynamic("Notification", "Cannot retrieve AD data", 'danger', identifier);
            identifier++;
        }
    });
}


