window.gridTheme = 'metro';
window.screenLock = 300000;   //screen lock in milliseconds 300000 = 5min

$(document).ready(function () {

    // CounterUp Plugin
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    ini_main.elements();

    $(".log-out").click(function () {
        LogOut();
    });

    $('.js-example-basic-single').select2({
        minimumResultsForSearch: Infinity
    });
});

function HideLoading()
{
    var sidebar_height = $('#divScroll').height();
    var main_wrapper_height = $('#main-wrapper').height();

    var difference = sidebar_height - main_wrapper_height;
    var total = main_wrapper_height + Math.abs(difference);

    if (sidebar_height > main_wrapper_height)
    {
        //$('#main-wrapper').height(total);
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('#divLoader').hide();
    $('#main-wrapper').show();
    $('#divFooter').show();
}

function notification_modal(title, message, type) {
    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += message;
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    //modal += '<button type="button" class="btn btn-success">Save changes</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup_loading("' + "0" + '");});';
    modal += '</script>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function create_modal_div(id)
{
    var div = $('<div id="' + id + '">');
    $("#notification_modal_dynamic").append(div);
}

function notification_modal_dynamic(title, message, type, identifier) {

    create_modal_div("notification_modal_dynamic" + identifier);

    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div' + identifier + '"' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel' + identifier + '" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel' + identifier + '">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += message;
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    //modal += '<button type="button" class="btn btn-success">Save changes</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup_loading("' + identifier + '");});';
    modal += '</script>';

    $("#notification_modal_dynamic" + identifier).html(modal);
    $("#modal_div" + identifier).modal("show");
    $("#modal_div" + identifier).css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function notification_modal_dynamic_super(title, message, type, parent, identifier) {

    $('#' + parent).modal("hide");

    create_modal_div("notification_modal_dynamic" + identifier);

    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div' + identifier + '"' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel' + identifier + '" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel' + identifier + '">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += message;
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    //modal += '<button type="button" class="btn btn-success">Save changes</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup_loading("' + identifier + '");});';
    modal += '</script>';

    $("#notification_modal_dynamic" + identifier).html(modal);
    $("#modal_div" + identifier).modal("show");
    $("#modal_div" + identifier).css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#notification_modal_dynamic" + identifier).on("hidden.bs.modal", function () {
        $('#' + parent).modal("show");
        $("body").css("margin", "0px");
        $("body").css("padding", "0px");
    });

}

function notification_modal_dynamic_loading(title, message, type, identifier) {

    create_modal_div("notification_modal_dynamic_loading" + identifier);

    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div' + identifier + '"' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel' + identifier + '" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    //modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel' + identifier + '">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += '<div id="circularG"><div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>';
    modal += "<br />";
    modal += '<table align="center"><tr><td>' + message + '</td></tr>';
    modal += '</div>';

    //modal += '<div class="modal-footer">';
    //modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    ////modal += '<button type="button" class="btn btn-success">Save changes</button>';
    //modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup_loading("' + identifier + '");});';
    modal += '</script>';

    $("#notification_modal_dynamic_loading" + identifier).html(modal);
    $("#modal_div" + identifier).modal("show");
    $("#modal_div" + identifier).css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function setup_loading(identifier)
{
    if (identifier == "0")
    {
        $('#modal_div').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    else
    {
        $('#modal_div' + identifier).modal({
            backdrop: 'static',
            keyboard: false
        });
    }
}

function notification_modal_signalr(title, message, type, identifier) {

    create_modal_div("notification_modal_signalR" + identifier);

    var header_style;
    if (type == "success")
        header_style = 'style="background-color: #1DB198; color: #ffffff;"';
    else if (type == "danger")
        header_style = 'style="background-color: #F25656; color: #ffffff;"';
    else if (type == "info")
        header_style = 'style="background-color: #33AFFF; color: #ffffff;"';
    else if (type == "warning")
        header_style = 'style="background-color: #FFC300; color: #ffffff;"';
    else
        header_style = 'style="background-color: #34425A; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div' + identifier + '"' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel' + identifier + '" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="CloseSignalR();"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel' + identifier + '">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += message;
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="CloseSignalR();">Close</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    modal += '$(document).ready(function () {setup_loading("' + identifier + '");});';
    modal += '</script>';

    $("#notification_modal_signalR" + identifier).html(modal);
    $("#modal_div" + identifier).modal("show");
    $("#modal_div" + identifier).css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#notification_modal_signalR" + identifier).on("hidden.bs.modal", function ()
    {

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        CloseSignalR();
    });

}

//function for getting query string
function getParameterByName(name, url) {

    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function CloseSignalR()
{
    $.ajax({
        url: "/Account/Logout",
        dataType: 'json',
        type: 'get',
        data: {},
        beforeSend: function () {

        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            window.location = "/Account/Login";
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function setIdleTimeout(millis, onIdle, onUnidle) {
    var timeout = 0;
    $(startTimer);

    function startTimer() {
        timeout = setTimeout(onExpires, millis);
        $(document).on("mousemove keypress", onActivity);
    }

    function onExpires() {
        timeout = 0;
        onIdle();
    }

    function onActivity() {
        if (timeout) clearTimeout(timeout);
        else onUnidle();
        //since the mouse is moving, we turn off our event hooks for 1 second
        $(document).off("mousemove keypress", onActivity);
        setTimeout(startTimer, 1000);
    }
}

function buildChart(containerId, elemId, _url) {
    $.ajax({
        url: _url,
        dataType: 'html',
        type: 'get',
        data: {},
        beforeSend: function () {

        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            $("#" + containerId).html(response);
            //document.getElementById(containerId).innerHTML = response;
            window['init_hchart_' + elemId]();
            //window.init_hchart_id_ac();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });


}

var ini_main = {
    elements: function () {
        if ($(".InputDateTimeRange").length > 0) {

            $(".InputDateTimeRange").jqxDateTimeInput({
                theme: 'light',
                width: 200,
                height: 25,
                selectionMode: 'range',
                formatString: 'yyyy-MM-dd',
            });
        }

        if ($(".InputDate").length > 0) {

            $(".InputDate").jqxDateTimeInput({
                theme: 'light',
                width: '100%',
                height: 25,
                //selectionMode: 'range',
                formatString: 'yyyy-MM-dd',
                min: new Date()
            });

        }

        if ($(".jqxgrid").length > 0) {
            $('.jqxgrid').each(function () {
                var elem = $(this);
                initialize_jqxwidget_grid(elem);
                elem.jqxGrid('autoresizecolumns');
            });
        }
    },
    element: function (elemtype) {
        switch(elemtype) {
            case 'dropdownlist':

                if ($("." + elemtype).length > 0) {
                    $("." + elemtype).each(function () {
                        var elem = $(this);

                        var w = '95%';
                        if (typeof elem.attr('data-width') != 'undefined' && elem.attr('data-width') != '') {
                            w = elem.attr('data-width');
                        }

                        var h = '20';
                        if (typeof elem.attr('data-height') != 'undefined' && elem.attr('data-height') != '') {
                            h = elem.attr('data-height');
                        }

                        var f = true;
                        if (typeof elem.attr('data-filterable') != 'undefined' && elem.attr('data-filterable') != '') {
                            f = elem.attr('data-filterable');
                        }

                        var d = false;
                        if (typeof elem.attr('data-disabled') != 'undefined' && elem.attr('data-disabled') != '') {
                            d = elem.attr('data-disabled');
                        }

                        //for placeholders -rherejias 11/16/16 10:00 AM
                        var ph = "Please Choose...";
                        if (typeof elem.attr('data-placeholder') != 'undefined' && elem.attr('data-placeholder') != '') {
                            ph = elem.attr('data-placeholder');
                        }

                        var source =
                                {
                                    datatype: "json",
                                    datafields: [
                                        { name: elem.attr("data-display") },
                                        { name: elem.attr("data-value") }
                                    ],
                                    url: elem.attr("data-url"),
                                    async: true,
                                    root: "data"
                                };
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        
                        // Create a jqxDropDownList
                        elem.jqxDropDownList({
                            theme: window.gridTheme,
                            filterable: f,
                            selectedIndex: 0,
                            source: dataAdapter,
                            displayMember: elem.attr("data-display"),
                            valueMember: elem.attr("data-value"),
                            width: w,
                            height: h,
                            disabled: d,
                            placeHolder: ph
                        });
                    });
                }

                break;
            case 'inputtext':
                
                if ($("." + elemtype).length > 0) {
                    $("." + elemtype).each(function () {
                        var elem = $(this);

                        var p = '';
                        if (typeof elem.attr('data-placeHolder') != 'undefined' && elem.attr('data-placeHolder') != '') {
                            p = elem.attr('data-placeHolder');
                        }

                        var w = '95%';
                        if (typeof elem.attr('data-width') != 'undefined' && elem.attr('data-width') != '') {
                            w = elem.attr('data-width');
                        }

                        var h = '20';
                        if (typeof elem.attr('data-height') != 'undefined' && elem.attr('data-height') != '') {
                            h = elem.attr('data-height');
                        }

                        elem.jqxInput({
                            theme: window.gridTheme,
                            placeHolder: p,
                            width: w,
                            height: h
                        });
                    });
                }
                
                break;
            case 'inputnumber':
                
                if ($("." + elemtype).length > 0) {
                    $("." + elemtype).each(function () {
                        var elem = $(this);

                        var w = '95%';
                        if (typeof elem.attr('data-width') != 'undefined' && elem.attr('data-width') != '') {
                            w = elem.attr('data-width');
                        }

                        var h = '20';
                        if (typeof elem.attr('data-height') != 'undefined' && elem.attr('data-height') != '') {
                            h = elem.attr('data-height');
                        }

                        elem.jqxNumberInput({
                            theme: window.gridTheme,
                            spinButtons: true,
                            width: w,
                            height: h,
                            min: 1,
                            value: 1
                        });
                    });
                }

                break;
        }
    }
};

function LogOut(containerId, elemId, _url) {
    $.ajax({
        url: "/Account/Logout",
        dataType: 'json',
        type: 'get',
        data: {},
        beforeSend: function () {

        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response) {
            window.location = "/Account/Login";
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function loader_modal(title, message) {
    var header_style;
    header_style = 'style="background-color: #12AECA; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div_loader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    //modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body">';
    //modal += message;
    modal += '<br /><br /><div class="progress"><div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">' + message + '</div></div>';
    modal += '</div>';

    modal += '<div class="modal-footer">';
    //modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    //modal += '<button type="button" class="btn btn-success">Save changes</button>';
    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    $("#loader_modal").html(modal);
    $("#modal_div_loader").modal({ backdrop: 'static', keyboard: false });
    $("#modal_div_loader").modal("show");
    $("#modal_div_loader").css('z-index', '1000000');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}


function specialKeys() {
    var keys = ["20", "16", "17", "91", "18", "13", "93", "27", "112",
            "113", "114", "115", "116", "117", "118", "119", "120", "121", "122",
            "123", "37", "38", "39", "40", "33", "34", "35", "36", "46",
            "45", "19", "145"];

    return keys;
}

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

function generalSearch(input, gridID, columns, e) {

    var keyCode = e.keyCode || e.which;

    var keys = specialKeys();
    if (keys.contains(keyCode))
    { 

    }
    else {
        if ($('#' + gridID + '_searchField').val() == '') {
            $('#' + gridID).jqxGrid('clearfilters');
            $('#' + gridID).jqxGrid('updatebounddata');
        }
        else {
            var filtertype = 'stringfilter';
            var filtergroup = new $.jqx.filter();
            var filter_or_operator = 0;
            var filtervalue = input;
            var filtercondition = 'contains';
            
            var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
            filtergroup.addfilter(1, filter);

            for (var i = 0; i < columns.length; i++) {
                $('#' + gridID).jqxGrid('addfilter', columns[i], filtergroup);
            }
            $('#' + gridID).jqxGrid('applyfilters');
        }
    }

}

