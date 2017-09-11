var boolMenu = false;
var menuID = "";
var identifier_ui = 1;

$(document).ready(function () {

    //prevent the body from scrollin when scrolling the side navbar
    $('#divSideBar').on('mousewheel DOMMouseScroll', function (e) {

        var e0 = e.originalEvent;
        var delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });

});

function ToggleIt()
{
    var isVisible = false;
    isVisible = $('#divLogoPhoto').is(":visible");

    if (isVisible == true)
    {
        $('#divLogoPhoto').hide();
        $('#divLogoText').show();
    }
    else
    {
        $('#divLogoPhoto').show();
        $('#divLogoText').hide();
    }
}

function showInbox(equipment, isSecsGem, lotNo)
{
    if (isSecsGem.toUpperCase() == "FALSE")
    {
        message_tcp(equipment, lotNo);
    }
    else
    {
        message_secsgem(equipment, lotNo);
    }
}

function message_secsgem(equipment, lotNo) {
    $.ajax({
        url: '/Home/getAllAlarmsSECSGEM',
        data: { Equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        var obj = null;
        obj = JSON.parse(result);

        if (obj != null) {
            if (obj.length > 0) {
                callInboxSECSGEMForm(equipment, lotNo, 1);
            }
            else {
                notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
                identifier_ui++;
            }
        }
        else {
            notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
            identifier_ui++;
        }
    });
}

function message_tcp(equipment, lotNo)
{
    $.ajax({
        url: '/Home/getAllAlarmsTCP',
        data: { Equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {

        var obj = null;
        obj = JSON.parse(result);

        if (obj != null) {
            if (obj.length > 0) {

                callInboxForm(equipment, lotNo, 1);
            }
            else {
                notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
                identifier_ui++;
            }
        }
        else {
            notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
            identifier_ui++;
        }
    });
}

function callInboxSECSGEMForm(equipment, lotNo, page) {
    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Inbox (" + equipment + ")" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += '<div id="divInbox"></div><br />';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    var js = "populateSECSGEMInbox('" + equipment + "','" + lotNo + "','" + page + "');";
    modal += '$(document).ready(function (e){ ' + js + '});';
    modal += '</script>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function callInboxForm(equipment, lotNo, page)
{
    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Inbox (" + equipment + ")" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += '<div id="divInbox"></div><br />';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    var js = "populateInbox('" + equipment + "','" + lotNo + "','" + page + "');";
    modal += '$(document).ready(function (e){ ' + js + '});';
    modal += '</script>';

    $("#notification_modal").html(modal);
    $("#modal_div").modal("show");
    $("#modal_div").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");
}

function populateInbox(equipment, lotNo, page)
{
    var mainDiv = $('#divInbox');
    mainDiv.empty();

    $.ajax({
        url: '/Home/getAllAlarmsTCP',
        data: { Equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'get'
    }).success(function (result) {

        var obj = null;
        obj = JSON.parse(result);

        var isRedirect = false;
        var isError = false;
        var id = null;
        var message = null;
        var isRead = null;
        var date = null;
        var strDate = null;
        var type = null;
        var html = null;
        var style = null;
        var divContent = null;

        var lstID = [];
        var lstContent = [];
        var lstMessage = [];
        var lstDate = [];
        var lstError = [];
        var lstRedirect = [];
        var lstGroup = [];
        var lstRead = [];

        if (obj != null)
        {
            var count = 1;
            var group = 1;

            html = "";

            if (obj.length > 0)
            {

                var total = obj.length;
                var numPerPage = 5;
                var pages = Math.ceil(total / numPerPage);
                
                for (var i = 0; i < obj.length; i++) {
                    id = obj[i].MessageId;
                    message = obj[i].MessageText;
                    isRead = obj[i].ReadNotification;
                    date = obj[i].Date;
                    strDate = obj[i].DateStr;
                    type = obj[i].MessageType;

                   
                    style = "";

                    if (isRead.toString() == "0") {
                        style = "font-weight:bold;";
                    }
                    else {
                        style = "color:#A9A9A9;";
                    }

                    if (message.toUpperCase() == "OK") {
                        message = "Template successfully loaded";
                    }

                    if (message == "") {
                        message = "Unknown error received";
                    }

                    if (type.toString() == "COUNT-END") {
                        message = "Job End Quantity: " + message.replace('ACTUAL_QTY=', '').replace('JOBEND_QTY=', '');
                        isRedirect = true;
                        isError = false;
                    }
                    else if (type.toString() == "COUNT-AUTO") {
                        message = "Processed Quantity: " + message.replace('PROCESSED_QTY=', '');
                        isRedirect = false;
                        isError = false;
                    }
                    else if (type.toString() == "COUNT-STOP") {
                        message = "Processed Quantity: " + message.replace('STOP_QTY=', '');
                        isRedirect = false;
                        isError = false;
                    }
                    else if (type.toString() == "REQUEST") {
                        message = message;
                        isRedirect = false;
                        isError = false;
                    }
                    else if (type.toString() == "MACHINE_REQUEST") {
                        message = "Command: " + message;
                        isRedirect = false;
                        isError = false;
                    }
                    else {

                        if (message == "Template successfully loaded") {
                            isRedirect = false;
                            isError = false;
                        }
                        else {
                            isRedirect = false;
                            isError = true;
                        }
                    }

                    divContent = "";
                    divContent = "divMessage_" + id;

                    if (count % numPerPage == 1)
                    {
                        html += '<div id="divGroup' + group + '" style="display:none;">';
                    }

                    html += '<div id="' + divContent + '" style="cursor:pointer;' + style + '">';
                    html += '<label style="overflow:hidden;cursor:pointer;' + style + '">';
                    
                    if (message.length > 50)
                    {
                        html += message.substring(0,49) + "...";
                    }
                    else
                    {
                        html += message;
                    }
                    html += '<br/>Date: ' + strDate;
                    html += '</label>';
                    html += '<hr style="border: 1px solid #EEEEEE">';
                    html += '</div>';

                    //push it before incrementing
                    lstGroup.push(group);
                    if (count % numPerPage == 0)
                    {
                        html += '</div>';
                        mainDiv.append(html);
                        html = "";
                        group++;
                    }
                    else
                    {
                        //last element
                        if (i == obj.length - 1)
                        {
                            var k = count % numPerPage;
                            var missing = parseInt(numPerPage) - parseInt(k);

                            if (parseInt(missing) > 0) {
                                for (var y = 0; y < parseInt(missing) ; y++) {
                                    html += '<div>';
                                    html += '<div>';
                                    html += '<label style="overflow:hidden;">';
                                    html += "&nbsp;";
                                    html += "<br/>&nbsp;";
                                    html += '</label>';
                                    html += '<hr style="border: 1px solid #FFFFFF">';
                                    html += '</div>';
                                    html += '</div>';
                                }
                            }

                            html += '</div>';

                            mainDiv.append(html);
                        }
                    }

                    count++;

                    lstContent.push(divContent);
                    lstID.push(id);
                    lstMessage.push(message);
                    lstDate.push(strDate);
                    lstError.push(isError);
                    lstRedirect.push(isRedirect);
                    lstRead.push(isRead);
                }

                mainDiv.append('<div id="divNavButton"><button class="btn btn-default btn-xs" type="button" id="btnPrev" style="font-weight:bold"><</button><label id="lblPrevFiller">&nbsp;</label><label id="lblCurrentPage">1</label>&nbsp;of&nbsp;<label id="lblLastPage">1</label><label id="lblNextFiller">&nbsp;</label><button class="btn btn-default btn-xs" type="button" id="btnNext" style="font-weight:bold">></button><label id="lblGoTo">&nbsp;Go to page:&nbsp;</label><input type="text" id="txtGoTo" class="input-group-inline input-xs" style="width:30px;"></input></div>');

                for (var x = 0; x < obj.length; x++)
                {
                    var content = document.getElementById(lstContent[x]);
                    content.onclick = createClickHandler(equipment, lstID[x], lstMessage[x], lstDate[x], lstError[x], lstRedirect[x], lotNo, lstGroup[x], lstRead[x]);
                }
                
                var curr = page;
                var last = $('#lblCurrentPage').text();
                
                $('#divGroup' + last).hide();

                $('#lblLastPage').text(pages);
                $('#lblCurrentPage').text(curr);

                $('#divGroup' + curr).show();

                if (parseInt($('#lblCurrentPage').text()) == 1)
                {
                    $('#btnPrev').attr('disabled', 'disabled');
                    $('#btnNext').removeAttr('disabled');
                }
                else if (parseInt($('#lblCurrentPage').text()) == parseInt(pages)) {
                    $('#btnNext').attr('disabled', 'disabled');
                    $('#btnPrev').removeAttr('disabled');
                }
                else
                {
                    $('#btnNext').removeAttr('disabled');
                    $('#btnPrev').removeAttr('disabled');
                }

                if (parseInt(pages) == 1)
                {
                    $('#btnPrev').hide();
                    $('#lblPrevFiller').hide();
                    $('#btnNext').hide();
                    $('#lblNextFiller').hide();
                    $('#lblGoTo').hide();
                    $('#txtGoTo').hide();
                }

                $('#btnPrev').click(function () {
                    var temp = $('#lblCurrentPage').text();

                    $('#divGroup' + temp).hide();

                    temp = parseInt(temp) - 1;

                    $('#btnNext').removeAttr('disabled');

                    if (temp <= 0)
                    {
                        $('#lblCurrentPage').text("1");
                        $('#btnPrev').attr('disabled', 'disabled');
                    }
                    else
                    {
                        $('#lblCurrentPage').text(temp);
                        if (parseInt($('#lblCurrentPage').text()) == 1)
                        {
                            $('#btnPrev').attr('disabled', 'disabled');
                        }
                        else
                        {
                            $('#btnPrev').removeAttr('disabled');
                        }
                    }

                    $('#divGroup' + temp).show();
                });

                $('#btnNext').click(function () {
                    var temp = $('#lblCurrentPage').text();

                    $('#divGroup' + temp).hide();

                    temp = parseInt(temp) + 1;

                    $('#lblCurrentPage').text(temp);

                    $('#btnPrev').removeAttr('disabled');

                    if (parseInt(temp) == parseInt(pages)) {
                        $('#btnNext').attr('disabled', 'disabled');
                    }
                    else
                    {
                        $('#btnNext').removeAttr('disabled');
                    }

                    $('#divGroup' + temp).show();

                });

                //make the textbox to accept only numbers
                $('#txtGoTo').keydown(function (e) {

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

                $('#txtGoTo').keypress(function (event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if (keycode == 13) {
                        var goto = $('#txtGoTo').val();

                        if (parseInt(goto) != 0 && parseInt(goto) <= parseInt(pages))
                        {
                            var temp = $('#lblCurrentPage').text();
                            $('#divGroup' + temp).hide();

                            $('#lblCurrentPage').text(goto);

                            if (parseInt(goto) == 1)
                            {
                                $('#btnPrev').attr('disabled', 'disabled');
                                $('#btnNext').removeAttr('disabled');
                            }
                            else if (parseInt(goto) == parseInt(pages))
                            {
                                $('#btnNext').attr('disabled', 'disabled');
                                $('#btnPrev').removeAttr('disabled');
                            }
                            else
                            {
                                $('#btnNext').removeAttr('disabled');
                                $('#btnPrev').removeAttr('disabled');
                            }

                            temp = goto;
                            $('#divGroup' + temp).show();
                        }
                        else
                        {
                            //notification_modal_dynamic_super("Notification", "Invalid Page", 'danger', 'modal_div', identifier_ui);
                            //identifier_ui++;
                        }
                    }
                });

            }
            else
            {
                $("#modal_div").modal("hide");

                notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
                identifier_ui++;
            }
        }
        else
        {
            $("#modal_div").modal("hide");

            notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
            identifier_ui++;
        }

    }).error(function () {

        $("#modal_div").modal("hide");

        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier_ui);
        identifier_ui++;
    });
}

function populateSECSGEMInbox(equipment, lotNo, page) {
    var mainDiv = $('#divInbox');
    mainDiv.empty();

    $.ajax({
        url: '/Home/getAllAlarmsSECSGEM',
        data: { Equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'get'
    }).success(function (result) {

        var obj = null;
        obj = JSON.parse(result);

        var isRedirect = false;
        var isError = false;
        var id = null;
        var message = null;
        var isRead = null;
        var date = null;
        var strDate = null;
        var type = null;
        var html = null;
        var style = null;
        var divContent = null;

        var lstID = [];
        var lstContent = [];
        var lstMessage = [];
        var lstDate = [];
        var lstError = [];
        var lstRedirect = [];
        var lstGroup = [];
        var lstRead = [];

        if (obj != null) {
            var count = 1;
            var group = 1;

            html = "";

            if (obj.length > 0) {

                var total = obj.length;
                var numPerPage = 5;
                var pages = Math.ceil(total / numPerPage);

                for (var i = 0; i < obj.length; i++) {
                    id = obj[i].MessageId;
                    message = obj[i].MessageText;
                    isRead = obj[i].ReadNotification;
                    date = obj[i].Date;
                    strDate = obj[i].DateStr;
                    type = obj[i].MessageType;


                    style = "";

                    if (isRead.toString() == "0") {
                        style = "font-weight:bold;";
                    }
                    else {
                        style = "color:#A9A9A9;";
                    }

                    //if (message.toUpperCase() == "OK") {
                    //    message = "Template successfully loaded";
                    //}

                    //if (message == "") {
                    //    message = "Unknown error received";
                    //}

                    //if (type.toString() == "COUNT-END") {
                    //    message = "Job End Quantity: " + message.replace('ACTUAL_QTY=', '').replace('JOBEND_QTY=', '');
                    //    isRedirect = true;
                    //    isError = false;
                    //}
                    //else if (type.toString() == "COUNT-AUTO") {
                    //    message = "Processed Quantity: " + message.replace('PROCESSED_QTY=', '');
                    //    isRedirect = false;
                    //    isError = false;
                    //}
                    //else if (type.toString() == "COUNT-STOP") {
                    //    message = "Processed Quantity: " + message.replace('STOP_QTY=', '');
                    //    isRedirect = false;
                    //    isError = false;
                    //}
                    //else if (type.toString() == "REQUEST") {
                    //    message = message;
                    //    isRedirect = false;
                    //    isError = false;
                    //}
                    //else if (type.toString() == "MACHINE_REQUEST") {
                    //    message = "Command: " + message;
                    //    isRedirect = false;
                    //    isError = false;
                    //}
                    //else {

                    //    if (message == "Template successfully loaded") {
                    //        isRedirect = false;
                    //        isError = false;
                    //    }
                    //    else {
                    //        isRedirect = false;
                    //        isError = true;
                    //    }
                    //}

                    divContent = "";
                    divContent = "divMessage_" + id;

                    if (count % numPerPage == 1) {
                        html += '<div id="divGroup' + group + '" style="display:none;">';
                    }

                    html += '<div id="' + divContent + '" style="cursor:pointer;' + style + '">';
                    html += '<label style="overflow:hidden;cursor:pointer;' + style + '">';

                    if (message.length > 50) {
                        html += message.substring(0, 49) + "...";
                    }
                    else {
                        html += message;
                    }
                    html += '<br/>Date: ' + strDate;
                    html += '</label>';
                    html += '<hr style="border: 1px solid #EEEEEE">';
                    html += '</div>';

                    //push it before incrementing
                    lstGroup.push(group);
                    if (count % numPerPage == 0) {
                        html += '</div>';
                        mainDiv.append(html);
                        html = "";
                        group++;
                    }
                    else {
                        //last element
                        if (i == obj.length - 1) {
                            var k = count % numPerPage;
                            var missing = parseInt(numPerPage) - parseInt(k);

                            if (parseInt(missing) > 0) {
                                for (var y = 0; y < parseInt(missing) ; y++) {
                                    html += '<div>';
                                    html += '<div>';
                                    html += '<label style="overflow:hidden;">';
                                    html += "&nbsp;";
                                    html += "<br/>&nbsp;";
                                    html += '</label>';
                                    html += '<hr style="border: 1px solid #FFFFFF">';
                                    html += '</div>';
                                    html += '</div>';
                                }
                            }

                            html += '</div>';

                            mainDiv.append(html);
                        }
                    }

                    count++;

                    lstContent.push(divContent);
                    lstID.push(id);
                    lstMessage.push(message);
                    lstDate.push(strDate);
                    lstError.push(isError);
                    lstRedirect.push(isRedirect);
                    lstRead.push(isRead);
                }

                mainDiv.append('<div id="divNavButton"><button class="btn btn-default btn-xs" type="button" id="btnPrev" style="font-weight:bold"><</button><label id="lblPrevFiller">&nbsp;</label><label id="lblCurrentPage">1</label>&nbsp;of&nbsp;<label id="lblLastPage">1</label><label id="lblNextFiller">&nbsp;</label><button class="btn btn-default btn-xs" type="button" id="btnNext" style="font-weight:bold">></button><label id="lblGoTo">&nbsp;Go to page:&nbsp;</label><input type="text" id="txtGoTo" class="input-group-inline input-xs" style="width:30px;"></input></div>');

                for (var x = 0; x < obj.length; x++) {
                    var content = document.getElementById(lstContent[x]);
                    content.onclick = createClickHandlerSECSGEM(equipment, lstID[x], lstMessage[x], lstDate[x], lstError[x], lstRedirect[x], lotNo, lstGroup[x], lstRead[x]);
                }

                var curr = page;
                var last = $('#lblCurrentPage').text();

                $('#divGroup' + last).hide();

                $('#lblLastPage').text(pages);
                $('#lblCurrentPage').text(curr);

                $('#divGroup' + curr).show();

                if (parseInt($('#lblCurrentPage').text()) == 1) {
                    $('#btnPrev').attr('disabled', 'disabled');
                    $('#btnNext').removeAttr('disabled');
                }
                else if (parseInt($('#lblCurrentPage').text()) == parseInt(pages)) {
                    $('#btnNext').attr('disabled', 'disabled');
                    $('#btnPrev').removeAttr('disabled');
                }
                else {
                    $('#btnNext').removeAttr('disabled');
                    $('#btnPrev').removeAttr('disabled');
                }

                if (parseInt(pages) == 1) {
                    $('#btnPrev').hide();
                    $('#lblPrevFiller').hide();
                    $('#btnNext').hide();
                    $('#lblNextFiller').hide();
                    $('#lblGoTo').hide();
                    $('#txtGoTo').hide();
                }

                $('#btnPrev').click(function () {
                    var temp = $('#lblCurrentPage').text();

                    $('#divGroup' + temp).hide();

                    temp = parseInt(temp) - 1;

                    $('#btnNext').removeAttr('disabled');

                    if (temp <= 0) {
                        $('#lblCurrentPage').text("1");
                        $('#btnPrev').attr('disabled', 'disabled');
                    }
                    else {
                        $('#lblCurrentPage').text(temp);
                        if (parseInt($('#lblCurrentPage').text()) == 1) {
                            $('#btnPrev').attr('disabled', 'disabled');
                        }
                        else {
                            $('#btnPrev').removeAttr('disabled');
                        }
                    }

                    $('#divGroup' + temp).show();
                });

                $('#btnNext').click(function () {
                    var temp = $('#lblCurrentPage').text();

                    $('#divGroup' + temp).hide();

                    temp = parseInt(temp) + 1;

                    $('#lblCurrentPage').text(temp);

                    $('#btnPrev').removeAttr('disabled');

                    if (parseInt(temp) == parseInt(pages)) {
                        $('#btnNext').attr('disabled', 'disabled');
                    }
                    else {
                        $('#btnNext').removeAttr('disabled');
                    }

                    $('#divGroup' + temp).show();

                });

                //make the textbox to accept only numbers
                $('#txtGoTo').keydown(function (e) {

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

                $('#txtGoTo').keypress(function (event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if (keycode == 13) {
                        var goto = $('#txtGoTo').val();

                        if (parseInt(goto) != 0 && parseInt(goto) <= parseInt(pages)) {
                            var temp = $('#lblCurrentPage').text();
                            $('#divGroup' + temp).hide();

                            $('#lblCurrentPage').text(goto);

                            if (parseInt(goto) == 1) {
                                $('#btnPrev').attr('disabled', 'disabled');
                                $('#btnNext').removeAttr('disabled');
                            }
                            else if (parseInt(goto) == parseInt(pages)) {
                                $('#btnNext').attr('disabled', 'disabled');
                                $('#btnPrev').removeAttr('disabled');
                            }
                            else {
                                $('#btnNext').removeAttr('disabled');
                                $('#btnPrev').removeAttr('disabled');
                            }

                            temp = goto;
                            $('#divGroup' + temp).show();
                        }
                        else {
                            //notification_modal_dynamic_super("Notification", "Invalid Page", 'danger', 'modal_div', identifier_ui);
                            //identifier_ui++;
                        }
                    }
                });

            }
            else {
                $("#modal_div").modal("hide");

                notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
                identifier_ui++;
            }
        }
        else {
            $("#modal_div").modal("hide");

            notification_modal_dynamic("Notification", "There are no existing notification for this equipment", 'danger', identifier_ui);
            identifier_ui++;
        }

    }).error(function () {

        $("#modal_div").modal("hide");

        notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier_ui);
        identifier_ui++;
    });
}

var createClickHandler = function (equipment, id, message, date, isError, isRedirect, lotNo, page, isRead) {
    return function ()
    {
        if (isRedirect == true) {
            if (isRead == true) {
                ShowMessage(equipment, id, message, date, isError, lotNo, page, isRead);
            }
            else {
                ShowConfirmation(equipment, id, lotNo, page);
            }
        }
        else {
            ShowMessage(equipment, id, message, date, isError, lotNo, page, isRead);
        }
    };
}

var createClickHandlerSECSGEM = function (equipment, id, message, date, isError, isRedirect, lotNo, page, isRead) {
    return function () {

        ShowMessageSECSEM(equipment, id, message, date, isError, lotNo, page, isRead);

        //if (isRedirect == true) {
        //    if (isRead == true) {
        //        ShowMessage(equipment, id, message, date, isError, lotNo, page, isRead);
        //    }
        //    else {
        //        ShowConfirmation(equipment, id, lotNo, page);
        //    }
        //}
        //else {
        //    ShowMessage(equipment, id, message, date, isError, lotNo, page, isRead);
        //}
    };
}

function redirect(equipment, id, lotNo, mode)
{
    if (lotNo == null || lotNo == "" || lotNo.toUpperCase() == "N/A") {

        document.location.href = '/' + mode + '?Equipment=' + equipment;
    }
    else {
        setCookie('EquipmentNotificationMessageID_' + equipment, id, 30);
        document.location.href = '/' + mode + '?Equipment=' + equipment + "&Lot=" + lotNo + "&Process=fromInbox";
    }

}

function ShowConfirmation(equipment, id, lotNo, page)
{

    $.ajax({
        url: '/TrackIn/isBrand',
        data: { equipment: equipment },
        contentType: 'application/json',
        dataType: 'json',
        method: 'GET'
    }).success(function (result) {
       
        var msg = "";
        var redirect = "";

        if (result == true)
        {
            redirect = "TrackOut";
            msg = "This will redirect you to Track Out transaction. Do you want to proceed?";
        }
        else
        {
            redirect = "TrackIn";
            msg = "This will redirect you to Track In transaction. Do you want to proceed?";
        }

        header_style = 'style="background-color: #1DB198; color: #ffffff;"';

        var modal = '<div class="modal fade" id="modal_div3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        modal += '<div class="modal-dialog">';
        modal += '<div class="modal-content">';

        modal += '<div class="modal-header" ' + header_style + '>';
        modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
        modal += '</div>';

        modal += '<div class="modal-body"><br />';
        modal += msg;
        modal += '</div>';

        modal += '<div class="modal-footer" style="text-align:center;">';
        modal += '<button type="button" class="btn btn-success" onclick="redirect(' + "'" + equipment + "','" + id + "'" + "," + "'" + lotNo + "','" + redirect + "'" + ');">OK</button>';
        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';

        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#modal_div").modal("hide");
        $("#notification_modal3").html(modal);
        $("#modal_div3").modal("show");
        $("#modal_div3").css('z-index', '1000001');

        $("body").css("margin", "0px");
        $("body").css("padding", "0px");

        $("#modal_div3").on("hidden.bs.modal", function () {
            callInboxForm(equipment, lotNo, page);
        });

    });
}

function ShowMessageSECSEM(equipment, messageID, messageText, messageDate, isError, lotNo, page, isRead) {
    var temp = "";

    if (isError == true) {
        temp = "An error occured<br/>" + messageText + "<br/>Machine: " + equipment + "<br/>Date: " + messageDate
    }
    else {
        temp = "Transaction Successful<br/>" + messageText + "<br/>Machine: " + equipment + "<br/>Date: " + messageDate
    }

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Message Details" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    //modal += '<div style="overflow:scroll;"><label>' + temp + '</label></div><br />';
    modal += '<div style="width:500px;word-break:break-all;word-wrap:break-word;"><label>' + temp + '</label></div><br />';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    var js = "markAsReadSECSGEM('" + messageID + "', '" + isRead.toString() + "');"
    modal += '$(document).ready(function (e){ ' + js + '});';
    modal += '</script>';


    $("#modal_div").modal("hide");
    $("#notification_modal2").html(modal);
    $("#modal_div2").modal("show");
    $("#modal_div2").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div2").on("hidden.bs.modal", function () {
        callInboxSECSGEMForm(equipment, lotNo, page);
    });
}

function ShowMessage(equipment, messageID, messageText, messageDate, isError, lotNo, page, isRead)
{
    var temp = "";

    if (isError == true)
    {
        temp = "An error occured<br/>" + messageText + "<br/>Machine: " + equipment + "<br/>Date: " + messageDate
    }
    else
    {
        temp = "Transaction Successful<br/>" + messageText + "<br/>Machine: " + equipment + "<br/>Date: " + messageDate
    }

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Message Details" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    //modal += '<div style="overflow:scroll;"><label>' + temp + '</label></div><br />';
    modal += '<div style="width:500px;word-break:break-all;word-wrap:break-word;"><label>' + temp + '</label></div><br />';
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';

    modal += '</div>';

    modal += '</div>';
    modal += '</div>';
    modal += '</div>';

    modal += '<script>';
    var js = "markAsRead('" + messageID + "', '" + isRead.toString() + "');"
    modal += '$(document).ready(function (e){ ' + js + '});';
    modal += '</script>';


    $("#modal_div").modal("hide");
    $("#notification_modal2").html(modal);
    $("#modal_div2").modal("show");
    $("#modal_div2").css('z-index', '1000001');

    $("body").css("margin", "0px");
    $("body").css("padding", "0px");

    $("#modal_div2").on("hidden.bs.modal", function () {
        callInboxForm(equipment, lotNo, page);
    });
}

function markAsRead(id, isRead)
{
    if (isRead.toString() == "0")
    {
        $.ajax({
            url: '/Home/markAsRead',
            data: { ID: id },
            method: 'POST'
        }).success(function () {
        });
    }
}

function markAsReadSECSGEM(id, isRead) {
    
    if (isRead.toString() == "0") {
        $.ajax({
            url: '/Home/markAsReadSECSGEM',
            data: { ID: id },
            method: 'POST'
        }).success(function () {
        });
    }
}

function show(id)
{
    document.getElementById(id).style.display = 'block';
}

function hide(id)
{
    document.getElementById(id).style.display = 'none';
}

function set(id)
{
    boolMenu = true;
    menuID = id;
}

function reset()
{
    boolMenu = false;
}

function processMenu()
{
    setCookie('isMenu', boolMenu, 30);
    setCookie('menuID', menuID, 30);
}

function insertAfter(newElement, targetElement) {
    // target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    // if the parents lastchild is the targetElement...
    if (parent.lastChild == targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}


