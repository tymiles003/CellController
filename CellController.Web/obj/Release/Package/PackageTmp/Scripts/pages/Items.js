var dataItem, dataCategory, dataType, dataMeasure, dataDepartment;

$('#btnSupplier').click(function () {
    showforms.item('add');
});
$('#btnCategory').click(function () {
    showforms.add('Category','Category');
});
$('#btnType').click(function () {
    showforms.add('Item Type', 'Type');
});
$('#btnMeasure').click(function () {
    showforms.add('Unit of Measure', 'Measure');
});
$('#btnDept').click(function () {
    showforms.add('Item Department', 'Department');
});

$(document).delegate("#ItemGrid_Export_to_Excel", "click", function () {
    $("#ItemGrid").jqxGrid('exportdata', 'xls', 'Item_Details');
});

$(document).delegate("#CategoryGrid_Export_to_Excel", "click", function () {
    $("#CategoryGrid").jqxGrid('exportdata', 'xls', 'ItemCategory_Details');
});

$(document).delegate("#TypeGrid_Export_to_Excel", "click", function () {
    $("#TypeGrid").jqxGrid('exportdata', 'xls', 'ItemType_Details');
});

$(document).delegate("#MeasureGrid_Export_to_Excel", "click", function () {
    $("#MeasureGrid").jqxGrid('exportdata', 'xls', 'ItemMeasure_Details');
});

$(document).delegate("#DepartmentGrid_Export_to_Excel", "click", function () {
    $("#DepartmentGrid").jqxGrid('exportdata', 'xls', 'ItemDepartment_Details');
});

$(document).delegate('#btnProceedDeactivate', 'click', function () {
    dbase_operation.deactivate($(this).attr('data-source') ,$(this).attr('data-id'));
});

$(document).delegate('#btnSaveItem', 'click', function () {
    dbase_operation.addItem();
});

$(document).delegate('#btnAdd', 'click', function () {
    dbase_operation.add($(this).attr('data-source'));
});

$(document).delegate(".ItemGrid_Inactive", "click", function (event) {
    showforms.deactivate('edit', dataItem.code_string, 'ItemGrid');
});

$(document).delegate(".CategoryGrid_Inactive", "click", function (event) {
    showforms.deactivate('edit', dataCategory.code_string, 'CategoryGrid');
});

$(document).delegate(".TypeGrid_Inactive", "click", function (event) {
    showforms.deactivate('edit', dataType.code_string, 'TypeGrid');
});

$(document).delegate(".MeasureGrid_Inactive", "click", function (event) {
    showforms.deactivate('edit', dataMeasure.code_string, 'MeasureGrid');
});

$(document).delegate(".DepartmentGrid_Inactive", "click", function (event) {
    showforms.deactivate('edit', dataDepartment.code_string, 'DepartmentGrid');
});

$("#ItemGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#ItemGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#ItemGrid").jqxGrid('getrowdatabyid', rowID);
    dataItem = data;
    //showforms.deactivate('edit', data.code_string, 'ItemGrid');
});

$("#CategoryGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#CategoryGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#CategoryGrid").jqxGrid('getrowdatabyid', rowID);
    dataCategory = data;
    //showforms.deactivate('edit', data.code_string, 'CategoryGrid');
});

$("#TypeGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#TypeGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#TypeGrid").jqxGrid('getrowdatabyid', rowID);
    dataType = data;
    //showforms.deactivate('edit', data.code_string, 'TypeGrid');
});

$("#MeasureGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#MeasureGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#MeasureGrid").jqxGrid('getrowdatabyid', rowID);
    dataMeasure = data;
    //showforms.deactivate('edit', data.code_string, 'MeasureGrid');
});

$("#DepartmentGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#DepartmentGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#DepartmentGrid").jqxGrid('getrowdatabyid', rowID);
    dataDepartment = data
    //showforms.deactivate('edit', data.code_string, 'DepartmentGrid');
});

var showforms = {
    item: function (operation, boundIndex) {

        var modal = '<style>';
        modal += ' .textstyle {';
        modal += '      background-color: transparent;';
        modal += '      outline: none;';
        modal += '      outline-style: none;';
        modal += '      outline-offset: 0;';
        modal += '      border-top: none;';
        modal += '      border-left: none;';
        modal += '      border-right: none;';
        modal += '      border-bottom: 1px solid #e5e5e5;';
        modal += '      padding: 3px 10px;';
        modal += '}';
        modal += ' .form-control:focus {';
        modal += '      border-top: 0;';
        modal += '      border-left: 0;';
        modal += '      border-right: 0;';
        modal += '      border-bottom: 1px solid #e5e5e5;';
        modal += '}';
        modal += '</style>';

        modal += '<div class="modal fade" id="modalitemmaster" role="dialog" >';
        modal += '<div class="modal-dialog">';
        modal += ' <div class="modal-content">';

        modal += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
        modal += '<h4 class="modal-title">Add Item</h4>';
        modal += '</div>';
        modal += '<div class="modal-body">';

        modal += '<div class="row">';
        modal += '  <input id="Code" type="hidden" />';
        modal += '  <div class="col-md-12" style="margin-top:3%;">';
        modal += '          <div class="form-group">';
        modal += '              <input id="name" type="text" class="textstyle form-control" placeholder="Item name"class="form-control companyrequired" style="width:98%;" />';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';
        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '          <div class="form-group">';
        modal += '              <input id="description" placeholder="Description"  class="textstyle form-control" type="text" class="form-control companyrequired" style="width:98%;" />';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';
        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '          <div class="form-group">';
        modal += '              <div class="form-control dropdownlist textstyle" id="cmbSupplier" data-placeholder="Supplier" data-url="/Transactions/GetSupplierCombo" data-display="supplier_string" data-value="code_string"></div>';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';
        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '          <div class="form-group">';
        modal += '              <div class="form-control dropdownlist textstyle" id="cmbCategory" data-placeholder="Item Category" data-url="/Items/GetItemCategories" data-display="name_string" data-value="code_string"></div>';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';
        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '          <div class="form-group">';
        modal += '              <div class="form-control dropdownlist textstyle" id="cmbType" data-placeholder="Item Type" data-url="/Items/GetItemTypes" data-display="name_string" data-value="code_string"></div>';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';
        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '          <div class="form-group">';
        modal += '             <div class="form-control dropdownlist textstyle" id="cmbDepartment" data-placeholder="Item Department" data-url="/Items/GetItemDepartment" data-display="name_string" data-value="code_string"></div>';
        modal += '          </div>';
        modal += '  </div>';
        modal += '</div>';

        modal += '<div class="modal-footer">';
        modal += '<div class="row">';
        modal += '<button class="btn btn-success" id="btnSaveItem"';
        modal += 'style="width: 100px;">';
        modal += 'SAVE</button>';
        modal += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
        modal += '</div>';
        modal += '</div>';

        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#form_modal").html(modal);
        $("#modalitemmaster").modal("show");
        $("#modalitemmaster").css('z-index', '1000000');

        ini_main.element('dropdownlist');
        ini_main.element('inputtext');
    },

    deactivate: function (operation, code, source) {
        var modal = '<div class="modal fade" id="modalDeactivate" role="dialog" >';
        modal += '<div class="modal-dialog">';
        modal += ' <div class="modal-content">';

        modal += '<div class="modal-header" style="background-color:#F25656; color:#ffffff">';
        modal += '<h4 class="modal-title">Deativate</h4>';
        modal += '</div>';
        modal += '<br/>';

        modal += '<div class="modal-body">';
        modal += '<p>Are you sure you want to deactivate this record?</p>';
        modal += '</div>';

        modal += '<div class="modal-footer">';
        modal += '<div class="row">';
        modal += '<button class="btn btn-danger" id="btnProceedDeactivate"';
        modal += 'style="width: 100px;" data-source="' + source + '" data-id="' + code + '">';
        modal += 'YES</button>';
        modal += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">NO</button> &nbsp ';
        modal += '</div>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#form_modal").html(modal);
        $("#modalDeactivate").modal("show");
        $("#modalDeactivate").css('z-index', '1000000');
    },

    add: function (title, source) {

        var modal = '<style>';
        modal += ' .textstyle {';
        modal += '      background-color: transparent;';
        modal += '      outline: none;';
        modal += '      outline-style: none;';
        modal += '      outline-offset: 0;';
        modal += '      border-top: none;';
        modal += '      border-left: none;';
        modal += '      border-right: none;';
        modal += '      border-bottom: 1px solid #e5e5e5;';
        modal += '      padding: 3px 10px;';
        modal += '}';
        modal += ' .form-control:focus {';
        modal += '      border-top: 0;';
        modal += '      border-left: 0;';
        modal += '      border-right: 0;';
        modal += '      border-bottom: 1px solid #e5e5e5;';
        modal += '}';
        modal += '</style>';

        modal += '<div class="modal fade" id="modaladd" role="dialog" >';
        modal += '<div class="modal-dialog">';
        modal += ' <div class="modal-content">';

        modal += '<div class="modal-header" style="background-color:#76cad4; color:#ffffff">';
        modal += '<h4 class="modal-title">Add ' + title + '</h4>';
        modal += '</div>';
        modal += '<div class="modal-body" style="margin-top:3%;">';
        //modal += '   <label style="margin-top:3%;">Name</label>'
        modal += '   <input id="name" type="text" placeholder="Name" class="form-control companyrequired textstyle" />';
        //modal += '   <label>Description</label>'
        modal += '   <input id="description" type="text" placeholder="Description" class="form-control companyrequired textstyle" style="margin-top:3%;"/>';
        modal += '</div>';

        modal += '<div class="modal-footer">';
        modal += '<div class="row">';
        modal += '<button class="btn btn-success" id="btnAdd" data-source="' + source + '"';
        modal += 'style="width: 100px;">';
        modal += 'SAVE</button>';
        modal += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">NO</button> &nbsp ';
        modal += '</div>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#form_modal").html(modal);
        $("#modaladd").modal("show");
        $("#modaladd").css('z-index', '1000000');
    }
};

var dbase_operation = {
    deactivate: function (grid, code) {
        var url = '';
        var msg = '';
        if (grid == "ItemGrid") {
            url = '/Items/DeactivateItem'
            msg = 'Record Deactivated!';
        } else if (grid == "CategoryGrid") {
            url = '/Items/DeactivateCategory'
            msg = 'Record Deactivated!';
        } else if (grid == "TypeGrid") {
            url = '/Items/DeactivateType'
            msg = 'Record Deactivated!';
        } else if (grid == "MeasureGrid") {
            url = '/Items/DeactivateMeasure'
            msg = 'Record Deactivated!';
        } else if (grid == "DepartmentGrid") {
            url = '/Items/DeactivateDepartment'
            msg = 'Record Deactivated!';
        }
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            data: {
                code: code,
                isactive: false
            },
            beforeSend: function () {

            },
            success: function (response) {
                if (response.success) {
                    $("#modalDeactivate").modal("hide");
                    notification_modal("Deactivate Successful!", msg, "success");
                    if (grid == "ItemGrid")
                        $('#ItemGrid').jqxGrid('updatebounddata');
                    else if (grid == "CategoryGrid")
                        $('#CategoryGrid').jqxGrid('updatebounddata');
                    else if (grid == "TypeGrid")
                        $('#TypeGrid').jqxGrid('updatebounddata');
                    else if (grid == "MeasureGrid")
                        $('#MeasureGrid').jqxGrid('updatebounddata');
                    else if (grid == "DepartmentGrid")
                        $('#DepartmentGrid').jqxGrid('updatebounddata');
                } else {
                    notification_modal("Deactivation Failed!", response.message, "danger");
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    },

    addItem: function () {
      
            var elements = ["#name", "#description", "#cmbSupplier", "#cmbCategory", "#cmbType", "#cmbDepartment"]
            var ctr = 0;
            for (var i = 0; i <= 5; i++) {
                if ($(elements[i]).val() == "") {
                    $(elements[i]).css("border-color", "red");
                }
                else {
                    $(elements[i]).css("border-color", "#e5e5e5");
                    ctr++;
                }
            }
        
        if (ctr == 6) {
            var msg = 'New Item Added!';
            $.ajax({
                url: '/Items/AddItems',
                dataType: 'json',
                type: 'get',
                data: {
                    name: $("#name").val(),
                    description: $("#description").val(),
                    supplier: $("#cmbSupplier").val(),
                    category: $("#cmbCategory").val(),
                    type: $("#cmbType").val(),
                    department: $("#cmbDepartment").val()
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.success) {
                        $("#modalitemmaster").modal("hide");
                        notification_modal("Addition Successful!", msg, "success");
                        $('#ItemGrid').jqxGrid('updatebounddata');
                    } else {
                        notification_modal("Addition failed!", response.message, "danger");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
        else {
            console.log("fill up all fields");
        }
    },

    add: function (source) {

        var elements = ["#name", "#description"]
        var ctr = 0;
        for (var i = 0; i <= 1; i++) {
            if ($(elements[i]).val() == "") {
                $(elements[i]).css("border-color", "red");
            }
            else {
                $(elements[i]).css("border-color", "#e5e5e5");
                ctr++;
            }
        }
        if (ctr == 2) {
            var url = '';
            var msg = '';
            if (source == "Category") {
                url = '/Items/AddCategory'
                msg = 'New Category Added!'
            } else if (source == "Type") {
                url = '/Items/AddType'
                msg = 'New Item Type Added!'
            } else if (source == "Measure") {
                url = '/Items/AddMeasure'
                msg = 'New unit of Measure Added!'
            } else if (source == "Department") {
                url = '/Items/AddDepartment'
                msg = 'New Item Department Added!'
            }
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                data: {
                    name: $("#name").val(),
                    description: $("#description").val()
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.success) {
                        $("#modaladd").modal("hide");
                        notification_modal("Addition Successful!", msg, "success");
                        if (source == "Category")
                            $('#CategoryGrid').jqxGrid('updatebounddata');
                        else if (source == "Type")
                            $('#TypeGrid').jqxGrid('updatebounddata');
                        else if (source == "Measure")
                            $('#MeasureGrid').jqxGrid('updatebounddata');
                        else if (source == "Department")
                            $('#DepartmentGrid').jqxGrid('updatebounddata');
                    } else {
                        notification_modal("Addition failed!", response.message, "danger");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    }
};