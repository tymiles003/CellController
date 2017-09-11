$(document).ready(function () {
    $("#cmdSaveAndSubmit").click(function () {
        show_modal.confirmationModal('addHeader', 'Add new record', 'Are you sure you want to continue this transaction?');
    });

    $("#cmdAddItem").click(function () {
        show_modal.addNewItem();
    });
});

$(document).delegate("#cmdProceed", 'click', function () {
    //console.log($(this).attr("data-procedure"));
    switch ($(this).attr("data-procedure")) {
        case "addHeader":
            dbase_operation.addHeader();
            break;
        default:
            console.log('procedure not found');
    }
});

var dbase_operation = {
    addHeader: function() {
        $.ajax({
            url: '/Transactions/AddHeader',
            dataType: 'json',
            type: 'post',
            data: {
                ImpexRefNbr: $("#txtImpexRefNbr").val(),
                DepartmentCode: '',
                ReturnDate: $("#txtReturnDate").val(),
                TransType: $("#cmbTransType").val(),
                CategoryCode: '',
                TypeCode: '',
                Purpose: $("#txtPurpose").val(),
                IsActive: true,
                Status: 0,
            },
            beforeSend: function () {

            },
            headers: {
                //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success) {
                    notification_modal("Addition successful!", response.message, "success");
                } else {
                    notification_modal("Addition failed!", response.message, "danger");
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    },
    addDetails: function() {
        console.log('add details here');
    }
};

var show_modal = {
    confirmationModal: function(procedure,title,message) {
        var modal = '<div class="modal fade" id="conf_modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        modal += '<div class="modal-dialog">';
        modal += '<div class="modal-content">';

        modal += '<div class="modal-header" style="background-color: #08A7C3; color:#ffffff;">';
        modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal += '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>';
        modal += '</div>';

        modal += '<div class="modal-body">';
        modal += message;
        modal += '</div>';

        modal += '<div class="modal-footer">';
        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">No</button>';
        modal += '<button type="button" class="btn btn-success" data-dismiss="modal" data-procedure="'+ procedure +'" id="cmdProceed">Yes</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#confirmation_modal").html(modal);
        $("#conf_modal_div").modal("show");
        $("#conf_modal_div").css('z-index', '1000000');
    },
    addNewItem: function() {
        var modal = '<div class="modal fade" id="form_modal_div" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        modal += '<div class="modal-dialog modal-lg">';
        modal += '<div class="modal-content">';

        modal += '<div class="modal-header" style="background-color: #08A7C3; color:#ffffff;">';
        modal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal += '<h4 class="modal-title" id="myModalLabel">Add New Item</h4>';
        modal += '</div>';

        modal += '<div class="modal-body">';
        modal += '<br />';
        modal += '<div class="row">';

        modal += '<div class="form-group col-md-6">';
        modal += '  <label for="cmbSupplier">Supplier:</label>';
        modal += '  <div class="form-control dropdownlist" id="cmbSupplier" data-url="/Transactions/GetSupplierCombo" data-display="supplier_string" data-value="code_string"></div>';
        modal += '</div>';

        modal += '<div class="form-group col-md-6">';
        modal += '  <label for="cmbItem">Item:</label>';
        modal += '  <div class="form-control dropdownlist" id="cmbItem" data-url="/Items/GetItems" data-disabled="true" data-display="name_string" data-value="code_string"></div>';
        modal += '</div>';

        //modal += '<div class="col-md-6">';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="txtPoNbr">PO Number:</label>';
        modal += '    <input type="text" class="form-control inputtext" id="txtPoNbr">';
        modal += '  </div>';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="txtTagNbr">Tag Number:</label>';
        modal += '    <input type="text" class="form-control inputtext" id="txtTagNbr">';
        modal += '  </div>';
        //modal += '</div>';

        //modal += '<div class="col-md-6">';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="txtQuantity">Quantity:</label>';
        modal += '    <input type="text" class="form-control inputnumber" id="txtQuantity">';
        modal += '  </div>';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="cmbUom">Unit of Measure:</label>';
        modal += '    <div class="form-control dropdownlist" id="cmbUom" data-url="/Items/GetUnitOfMeasures" data-display="name_string" data-value="code_string"></div>';
        modal += '  </div>';
        //modal += '</div>';

        modal += '<div class="form-group col-md-6">';
        modal += '  <label for="txtSerialNbr">Serial Number:</label>';
        modal += '  <input type="text" class="form-control inputtext" id="txtSerialNbr">';
        modal += '</div>';

        //modal += '<div class="col-md-6">';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="cmbCategory">Category:</label>';
        modal += '    <div class="form-control dropdownlist" id="cmbCategory" data-url="/Items/GetItemCategories" data-display="name_string" data-value="code_string"></div>';
        modal += '  </div>';
        modal += '  <div class="form-group col-md-3">';
        modal += '    <label for="cmbItemType">Type:</label>';
        modal += '    <div class="form-control dropdownlist" id="cmbItemType" data-url="/Items/GetItemTypes" data-display="name_string" data-value="code_string"></div>';
        modal += '  </div>';
        //modal += '</div>';

        modal += '</div>';

        modal += '</div>';

        modal += '<div class="modal-footer">';
        modal += '<button type="button" class="btn btn-default" data-dismiss="modal">No</button>';
        modal += '<button type="button" class="btn btn-success" data-dismiss="modal" id="cmdProceedUpload">Yes</button>';
        modal += '</div>';

        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        $("#form_modal").html(modal);
        
        $("#form_modal_div").modal("show");
        $("#form_modal_div").css('z-index', '1000000');

        ini_main.element('inputtext');
        ini_main.element('inputnumber');
        ini_main.element('dropdownlist');
        
    }
};