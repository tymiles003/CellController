var identifier = 1;

$(document).ready(function () {

    //focus on the username textbox
    $("#txtUsername").focus();

    //hide the progress loading bar
    $(".progress").hide();

    //if enter is pressed on username textbox focus on password textbox
    $("#txtUsername").keypress(function (e) {
        if (e.which == 13) {
            $("#txtPassword").focus();
        }
    });

    //if enter is pressed on password texbox execute login function
    $("#txtPassword").keypress(function (e) {
        if (e.which == 13) {
            $("#cmdLogin").trigger("click");
        }
    });

    //assign login function to submit button on click
    $("#cmdLogin").click(function () {
        _action.loginAttempt();
    });
});

var _action = {
    loginAttempt: function () {
        
        //check first if the textbox has inputs
        if (!$.trim($("#txtUsername").val()) && !$.trim($("#txtPassword").val()))
        {
            notification_modal_dynamic("Login Failed", "Please provide username and password", "danger", identifier);
            identifier++;
        }
        else
        {
            //if both textbox have inputs proceed to the ajax call

            $.ajax({
                url: '/Account/Attempt',
                dataType: 'json',
                type: 'post',
                cache: false,
                data:
                {
                    username: $("#txtUsername").val(),
                    password: $("#txtPassword").val()
                },
                beforeSend: function ()
                {
                    //hide the login button
                    $("#cmdLogin").hide();
                    //show the loading progress
                    $(".progress").show();
                },
                success: function (response)
                {
                    console.log(response);

                    //if success proceed to homepage otherwise display a notification
                    if (response.success) {

                        //set the cookie for later use
                        setCookie("Username", $("#txtUsername").val(), 30);

                        //redirect to home
                        window.location.href = '/Home/Index';
                    }
                    else
                    {

                        //show the login button
                        $("#cmdLogin").show();
                        //hide the loading progress
                        $(".progress").hide();

                        //display notification message for login failure
                        //notification_modal_dynamic("Login Failed", "Something went wrong please try again later", "danger", identifier);
                        notification_modal_dynamic("Login Failed", response.message, "danger", identifier);
                        identifier++;

                        //clear the password textbox and focus on username textbox for relogin purposes
                        $("#modal_div").on('hidden.bs.modal', function () {
                            $("#txtPassword").val('');
                            $("#txtUsername").focus();
                            $("#txtUsername").select();
                        })
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //hande the error
                    $("#cmdLogin").show();
                    $(".progress").hide();
                    notification_modal_dynamic("Login Failed", "Something went wrong please try again later", "danger", identifier);
                    identifier++;
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    },
};

//function for getting cookie value
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//function for setting cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//function for deleting cookie
function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}