var identifier = 1;
var globalFrom = "";
var globalModeCode = "";

$(document).ready(function (e) 
{
    //populate the user group
    populateUserGroup();

    //dropdown on change handler
    $('#ddUserGroup').change(function () {
        populateModules();
    });

    //buton click handler for save
    $('#btnSave').click(function () {
    
        save();
    });

    globalFrom = getCookie('AccessRightsFrom');
    globalModeCode = getCookie('AccessRightsModeCode');

    deleteCookie('AccessRightsFrom');
    deleteCookie('AccessRightsModeCode');

    HideLoading();

});

//for populating user group dropdown
function populateUserGroup()
{
    $.ajax({
        url: '/AccessRights/GetAccountTypes',
        method: 'get'
    }).success(function (val)
    {
        var json = JSON.parse(val);
        for (var i = 0; i < json.length; i++) 
        {
            $('#ddUserGroup').append($('<option></option>').val(json[i].UserModeCode).html(json[i].UserModeDesc));
        }

        if (globalFrom != null && globalFrom != "" && globalModeCode != null && globalModeCode != "")
        {
            $("#ddUserGroup").val(globalModeCode);
            populateModules();
            notification_modal_dynamic("Notification", "User Access Rights Saved", 'success', identifier);
            identifier++;
        }
    });
}

//function for saving access rights
function save() {

    var UserModeCode = $('#ddUserGroup').val();

    if (UserModeCode == null || UserModeCode == "")
    {
        notification_modal_dynamic("Notification", "Please select User Role", 'danger', identifier);
        identifier++;
        return;
    }

    try
    {
        $.ajax(
            {
                url: '/AccessRights/GetModules',
                method: 'get',
                data: { UserModeCode: UserModeCode }
            }).success(function (val)
            {
                var json = JSON.parse(val);
                var modules = [];

                for (var i = 0; i < json.length; i++) {
                    if (json[i].HasChild == false) {
                        var controlName = "";
                        var controlID = json[i].Id;
                        if (json[i].ParentId == 0) {
                            controlName = "chkParent_" + controlID;
                        }
                        else {
                            controlName = "chkChild_" + controlID;
                        }
                        modules.push(controlName);
                    }
                }

                var lstModuleID = [];
                var lstIsChecked = [];
                for (var z = 0; z < modules.length; z++)
                {
                    var temp = [];
                    temp = modules[z].split('_');
                    var isChecked = false;
                    if ($('#' + modules[z]).prop('checked'))
                    {
                        isChecked = true;
                    }

                    var ModuleId = temp[1];
                    lstModuleID.push(ModuleId);
                    lstIsChecked.push(isChecked);
                }

                notification_modal_confirm(UserModeCode, lstModuleID, lstIsChecked);

            }).error(function()
            {
                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });
    }
    catch (e) { }
}

//build html modal confirmation
function notification_modal_confirm(UserModeCode, lstModuleID, lstIsChecked) {

    header_style = 'style="background-color: #1DB198; color: #ffffff;"';

    var modal = '<div class="modal fade" id="modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    modal += '<div class="modal-dialog">';
    modal += '<div class="modal-content">';

    modal += '<div class="modal-header" ' + header_style + '>';
    modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    modal += '<h4 class="modal-title" id="myModalLabel">' + "Confirmation" + '</h4>';
    modal += '</div>';

    modal += '<div class="modal-body"><br />';
    modal += "Are you sure you want to save this access rights?";
    modal += '</div>';

    modal += '<div class="modal-footer" style="text-align:center;">';
    modal += '<button type="button" class="btn btn-success" onclick="submit(' + "'" + UserModeCode + "'" + ",'" + lstModuleID + "'" + ",'" + lstIsChecked + "'" + ');">OK</button>';
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

//function for submitting the data to the controller
function submit(UserModeCode, lstModuleID, lstIsChecked) {

    var lstModule = lstModuleID.split(',');
    var lstEnabled = lstIsChecked.split(',');

    $("#modal_div").modal("hide");
    $("#form_modal_div").modal("hide");
    
    $.ajax(
            {
                url: '/AccessRights/Save',
                method: 'post',
                data: { UserModeCode: UserModeCode, lstModuleID: lstModule, lstIsEnabled: lstEnabled },
                beforeSend: function ()
                {
                    $("#btnSave").attr("disabled", "disabled");
                }
            }).success(function (val) {

                $("#btnSave").removeAttr("disabled");

                if (val == true)
                {
                    //notification_modal_dynamic("Notification", "User Access Rights Saved", 'success', identifier);
                    //identifier++;

                    setCookie("AccessRightsFrom", 'update', 30);
                    setCookie("AccessRightsModeCode", UserModeCode, 30);

                    document.location.href = '/AccessRights'
                }
                else
                {
                    notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                    identifier++;
                }

            }).error(function () {
                $("#btnSave").removeAttr("disabled");
                notification_modal_dynamic("Notification", "Something went wrong please try again later", 'danger', identifier);
                identifier++;
            });
}

//for populating the modules treeview
function populateModules()
{
    var UserModeCode = $('#ddUserGroup').val();
    $('#divModule').empty();

    try {
        $.ajax({
            url: '/AccessRights/GetModules',
            method: 'get',
            data: { UserModeCode: UserModeCode }
        }).success(function (val) {

            var json = JSON.parse(val);
            var chkAll = [];
            var chkParentNoChild = [];

            if (json.length > 0)
            {
                var checkAll = false;
                for (var i = 0; i < json.length; i++)
                {
                    if (json[i].ParentId == 0)
                    {
                        if (json[i].HasChild == false)
                        {
                            checkAll = true;
                        }
                        else
                        {
                            if(json[i].ChildCount > 0)
                            {
                                checkAll = true;
                            }
                        }
                    }
                }

                if (checkAll == true) {
                    $('#divModule').append('<div><input type="checkbox" id="chkALL"></input>All</div>');
                }
            }

            for (var i = 0; i < json.length; i++)
            {
                if (json[i].ParentId == 0)
                {
                    var isValid = false;
                    $('#divModule').append('<div id="divParent_' + json[i].Id + '" style="margin:0px"></div>');

                    if (json[i].IsEnabled == true) {

                        if (json[i].HasChild == false)
                        {
                            $('#divParent_' + json[i].Id).append('<div id="divContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkParent_' + json[i].Id + '" checked="checked"></input>' + json[i].Name + '</div>')
                            chkParentNoChild.push('chkParent_' + json[i].Id);
                            isValid = true;
                        }
                        else
                        {
                            if (json[i].ChildCount > 0)
                            {
                                $('#divParent_' + json[i].Id).append('<div id="divContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkParent_' + json[i].Id + '" checked="checked"></input>' + json[i].Name + '</div>')
                                isValid = true;
                            }
                            else
                            {
                                isValid = false;
                            }
                        }

                        if (isValid == true)
                        {
                            chkAll.push('chkParent_' + json[i].Id);
                        }
                    }
                    else {
                        
                        if (json[i].HasChild == false) {
                            $('#divParent_' + json[i].Id).append('<div id="divContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkParent_' + json[i].Id + '"></input>' + json[i].Name + '</div>')
                            chkParentNoChild.push('chkParent_' + json[i].Id);
                            isValid = true;
                        }
                        else {
                            if (json[i].ChildCount > 0) {
                                $('#divParent_' + json[i].Id).append('<div id="divContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkParent_' + json[i].Id + '"></input>' + json[i].Name + '</div>')
                                isValid = true;
                            }
                            else {
                                isValid = false;
                            }
                        }

                        if (isValid == true) {
                            chkAll.push('chkParent_' + json[i].Id);
                        }
                    }
                    
                }
                else
                {
                    if (json[i].IsEnabled == true)
                    {
                        $('#divContent_' + json[i].ParentId).append('<div id="divChildContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkChild_' + json[i].Id + '" checked="true"></input>' + json[i].Name + '</div>');
                    }
                    else
                    {
                        $('#divContent_' + json[i].ParentId).append('<div id="divChildContent_' + json[i].Id + '" style="padding-left:15px;"><input type="checkbox" id="chkChild_' + json[i].Id + '"></input>' + json[i].Name + '</div>');
                    }
                    chkAll.push('chkChild_' + json[i].Id);
                }
            }

            var Input = document.getElementById('divModule');
            var child;

            var numberofChild = 0;
            var numberofCheckedChild = 0;
            var parentChkBox = "";
            var ChkBoxList = [];

            for (i = 0; i < Input.childNodes.length; i++)
            {
                child = Input.childNodes[i];
                if (child.id.includes('divParent_'))
                {
                    var Input2 = child;
                    var child2;
                    for (x = 0; x < Input2.childNodes.length; x++)
                    {
                        child2 = Input2.childNodes[x];
                        
                        if (child2.id.includes('divContent_'))
                        {
                            var Input3 = child2;
                            var child3;
                            
                            numberofChild = 0;
                            numberofCheckedChild = 0;
                            parentChkBox = "";

                            for (z = 0; z < Input3.childNodes.length; z++)
                            {
                                child3 = Input3.childNodes[z];
                                try
                                {
                                    if (child3.id.includes('divChildContent_'))
                                    {
                                        var input4 = child3;
                                        var child4;
                                        for (a = 0; a < input4.childNodes.length; a++)
                                        {
                                            child4 = input4.childNodes[a];
                                            if (child4.type.toLowerCase() == "checkbox")
                                            {
                                                numberofChild = numberofChild + 1;
                                                var id = child4.id;
                                                var parent = child2;
                                                
                                                if ($("#" + id).is(':checked'))
                                                {
                                                    numberofCheckedChild = numberofCheckedChild + 1;
                                                }

                                                for (b = 0; b < parent.childNodes.length; b++)
                                                {
                                                    if (parent.childNodes[b].type.toLowerCase() == "checkbox")
                                                    {
                                                        parentChkBox = parent.childNodes[b].id;
                                                        ChkBoxList.push(parentChkBox + "|" + id);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                catch (e) { }
                            }
                        }
                    }
                }

                if (parentChkBox != null && parentChkBox != "")
                {
                    if (numberofChild == numberofCheckedChild)
                    {
                        $('#' + parentChkBox).prop('checked', true);
                    }
                    else
                    {
                        $('#' + parentChkBox).prop('checked', false);
                    }
                }
            }

            var rootCheckBox = "";
            var subList = [];
            var list = "";
            var dict = []
            var tempChkBoxList = ChkBoxList;

            for (c = 0; c < ChkBoxList.length; c++)
            {
                var split = ChkBoxList[c].split('|');
                var root = split[0];

                if (rootCheckBox != root)
                {
                    $('#' + root).change(function ()
                    {
                        var id = this.id;

                        var indexes = [];
                        var sub = [];
                        indexes = searchAllIndex(tempChkBoxList, id);

                        for (d = 0; d < indexes.length; d++)
                        {
                            sub.push(tempChkBoxList[indexes[d]].split('|')[1]);
                        }

                        if (this.checked)
                        {
                            for (e = 0; e < sub.length; e++)
                            {
                                $('#' + sub[e]).prop('checked', true);
                            }
                        }
                        else
                        {
                            for (e = 0; e < sub.length; e++)
                            {
                                $('#' + sub[e]).prop('checked', false);
                            }
                        }

                        var isChecked = true;
                        for (var zz = 0; zz < chkAll.length; zz++) {

                            if (!$('#' + chkAll[zz]).is(':checked')) {
                                isChecked = false;
                            }
                        }

                        try {
                            if (isChecked == true) {
                                $('#chkALL').prop('checked', true);
                            }
                            else {
                                $('#chkALL').prop('checked', false);

                            }
                        } catch (e) { }

                    });
                }

                rootCheckBox = root;
            }
            
            for (f = 0; f < ChkBoxList.length; f++)
            {
                var split = ChkBoxList[f].split('|');
                var sub = split[1];

                $('#' + sub).change(function ()
                {
                    var id = this.id;
                    
                    var indexes = [];
                    var root = "";
                    indexes = searchAllIndex(tempChkBoxList, id);

                    for (g = 0; g < indexes.length; g++)
                    {
                        root = tempChkBoxList[indexes[g]].split('|')[0];
                    }

                    indexes = [];
                    indexes = searchAllIndex(tempChkBoxList, root);
                    var indexesSub = [];

                    for (h = 0; h < indexes.length; h++)
                    {
                        indexesSub.push(tempChkBoxList[indexes[h]].split('|')[1]);
                    }

                    var check = true;
                    for (i = 0; i < indexesSub.length; i++)
                    {
                        if (!$('#' + indexesSub[i]).is(':checked'))
                        {
                            check = false;
                        }
                    }

                    if (check == true)
                    {
                        $('#' + root).prop('checked', true);
                    }
                    else
                    {
                        $('#' + root).prop('checked', false);
                    }

                    var isChecked = true;
                    for (var zz = 0; zz < chkAll.length; zz++) {

                        if (!$('#' + chkAll[zz]).is(':checked'))
                        {
                            isChecked = false;
                        }
                    }

                    try {
                        if (isChecked == true) {
                            $('#chkALL').prop('checked', true);
                        }
                        else {
                            $('#chkALL').prop('checked', false);

                        }
                    } catch (e) { }

                });
            }

            for (var zxc = 0; zxc < chkParentNoChild.length; zxc++)
            {
                $('#' + chkParentNoChild[zxc]).change(function ()
                {
                    var isChecked = true;
                    for (var zz = 0; zz < chkAll.length; zz++) {

                        if (!$('#' + chkAll[zz]).is(':checked')) {
                            isChecked = false;
                        }
                    }

                    try {
                        if (isChecked == true) {
                            $('#chkALL').prop('checked', true);
                        }
                        else {
                            $('#chkALL').prop('checked', false);

                        }
                    } catch (e) { }
                });
            }

            var validator = true;
            for (var zx = 0; zx < chkAll.length; zx++)
            {
                if (!$('#' + chkAll[zx]).is(':checked'))
                {
                    validator = false;
                }
            }
            if (validator == true)
            {
                try {
                    $('#chkALL').prop('checked', true);
                }
                catch (e) { }
            }

            try
            {
                $('#chkALL').change(function ()
                {
                    var isChecked = this.checked;
                    for (var zx = 0; zx < chkAll.length; zx++)
                    {
                        if (isChecked == true)
                        {
                            $('#' + chkAll[zx]).prop('checked', true);
                        }
                        else
                        {
                            $('#' + chkAll[zx]).prop('checked', false);
                        }
                    }
                    
                });
            }
            catch(e){}
        });
    }
    catch (e) { }
}

//for searching an array
function searchAllIndex(arr, searchStr)
{
    var indexes = [];
    for (i = 0; i < arr.length; i++)
    {
        if (arr[i].includes(searchStr))
        {
            indexes.push(i);
        }
    }
    return indexes;
}