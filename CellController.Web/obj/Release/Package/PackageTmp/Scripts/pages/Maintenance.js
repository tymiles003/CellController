var mCode;
var datatable,datatableContact;
var index, indexContact;

$(document).delegate("#SupplierGrid_Export_to_Excel", "click", function () {
    $("#SupplierGrid").jqxGrid('exportdata', 'xls', 'Supplier_Details');
});

$(document).delegate("#SupplierGrid_Clear_Filter", "click", function () {
    $('#SupplierGrid').jqxGrid('clearselection');
    $('#ContactPersonGrid').jqxGrid('clearfilters');
});

$(document).delegate("#ContactPersonGrid_Export_to_Excel", "click", function () {
    $("#ContactPersonGrid").jqxGrid('exportdata', 'xls', 'ContactPerson_Details');
});

$("#cmdAddNew").click(function () {
    showform.supplier('add');
});

$("#cmdAddContact").click(function () {
    showform.ContactPerson('add');
});

$("#SupplierGrid").on('rowdoubleclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;
    

    showform.supplier('edit', boundIndex);
});

$("#ContactPersonGrid").on('rowdoubleclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;
    
    
   // showform.ContactPerson('edit', boundIndex);
});

$("#ContactPersonGrid").on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#ContactPersonGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);
    datatableContact = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);
    indexContact = boundIndex;
});

$('#SupplierGrid').on('rowclick', function (event) {
    var args = event.args;
    // row's bound index.
    var boundIndex = args.rowindex;
    // row's visible index.
    var visibleIndex = args.visibleindex;
    // right click.
    var rightclick = args.rightclick;
    // original event.
    var ev = args.originalEvent;

    var rowID = $("#SupplierGrid").jqxGrid('getrowid', boundIndex);
    var data = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);
    datatable = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);
    index = boundIndex;
    console.log(data.code_string);
    applyFilter('supplier_key_string', $(this).attr('grid-child'), data.code_string);
    document.getElementById('cmdAddContact').style.display = 'inline';
    mCode = data.code_string;
});

$(document).delegate("#AddItemSaveButton", "click", function () {
    dbaseOperations.save('add', '');
});

$(document).delegate("#AddItemUpdateButton", "click", function () {
    //if ($("#chkIsAcive").is(":checked")) {
    //    IsActive = 1;
    //}
    dbaseOperations.save('edit', $(this).attr("data-recid"));
});

$(document).delegate("#cmdAddItemContact", "click", function () {
    dbaseOperations.SaveContactPerson('add', '');
});

$(document).delegate("#cmdUpdateContactPerson", "click", function () {
    dbaseOperations.SaveContactPerson('edit', $(this).attr("data-recid"));
});

$(document).delegate(".SupplierGrid_Inactive", "click", function (event) {
    showform.deactivate(datatable.code_string, 'Supplier')
});

$(document).delegate(".SupplierGrid_Edit", "click", function () {
    showform.supplier('edit', index);
});

$(document).delegate("#btnProceedDeactivate", "click", function () {
    dbaseOperations.deactivate($(this).attr('data-source'), $(this).attr('data-id'))
});

$(document).delegate(".ContactPersonGrid_Inactive", "click", function (event) {
    showform.deactivate(datatableContact.code_string, 'Contact')
    //showform.deactivate(datatable.code_string, 'Supplier')
});

$(document).delegate(".ContactPersonGrid_Edit", "click", function () {
    showform.ContactPerson('edit', indexContact);
});

var showform = {
    supplier: function (operation, boundIndex) {
        var id = '';
        var code = '';
        var name = '';
        var email = '';
        var contactNumb = '';
        var unitNum = '';
        var street = '';
        var municipality = '';
        var city = '';
        var country = '';
        var zip = '';
        var IsActive = '';

        if (operation != "add") {

            var rowID = $("#SupplierGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#SupplierGrid").jqxGrid('getrowdatabyid', rowID);

            id = data.Id_number;
            code = data.code_string;
            name = data.name_string;
            email = data.email_string;
            contactNumb = data.contact_number_string;
            unitNum = data.unit_string;
            street = data.street_name_string;
            municipality = data.municipality_string;
            city = data.city_string;
            country = data.country_string;
            zip = data.zip_string;
            if (data.active_bool) {
                IsActive = 'checked = "checked"';
                var IsActive2 = 1;
            }
        }
        
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

        modal += '<div class="modal fade" id="modal123" role="dialog" >';
        modal += '<div class="modal-dialog">';
        modal += '<div class="modal-content">';

        modal += '<div class="modal-header" style="background-color:#7A6FBE; color:#ffffff">';
        modal += '<h4 class="modal-title">Add Supplier</h4>';
        modal += '</div>';
        modal += '<div class="modal-body" style="margin-top:3%;">';
        modal += '<div class="row">';
        modal += '<div class="col-md-12">';
        modal += '<div class="col-md-12">';
        modal += '<div class="form-group">';
        //modal += '<label class="control-label">';
        //modal += 'Company</label>';
        modal += '<input id="CompanyName" type="text" placeholder="Company Name" class="form-control companyrequired textstyle" value="' + name + '"/>';
        modal += '</div>';
        modal += '</div>';
        modal += '</div>';
        modal += '</div>';

        modal += '<div class="row">';
        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
        modal += '  <div class="col-md-12">';
        modal += '      <div class="col-md-12">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Email Address</label>';
        modal += '              <input id="EmailAddress" type="text"  placeholder="Email" class="form-control companyrequired textstyle"  value="' + email + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Contact Number</label>';
        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Unit Number</label>';
        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        modal += '  </div>';
        modal += '</div>';

        modal += '<div class="row">';
        modal += '  <input id="Code" type="hidden" value="' + code + '" />';
        modal += '  <div class="col-md-12">';
        modal += '      <div class="col-md-12">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Email Address</label>';
        modal += '              <input id="ContactNumber" type="text" placeholder="Contact Number" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Contact Number</label>';
        //modal += '              <input id="ContactNumber" type="text" class="form-control companyrequired textstyle" value="' + contactNumb + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Unit Number</label>';
        //modal += '              <input id="ComUnitCode" type="text" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        modal += '  </div>';
        modal += '</div>';

        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Unit Number</label>';
        modal += '              <input id="ComUnitCode" type="text" placeholder="Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                 Bldg/Street Name</label>';
        modal += '              <input id="ComBldgName" type="text" placeholder="Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Municipality</label>';
        //modal += '              <input id="ComMunicipality" type="text" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        //modal += '      <div class="col-md-4">';
        //modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  City</label>';
        //modal += '              <input id="ComCity" type="text" class="form-control companyrequired textstyle" value="' + city + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        modal += '  </div>';
        modal += '</div>';

        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        //modal += '      <div class="col-md-6">';
        //modal += '          <div class="form-group">';
        ////modal += '              <label class="control-label">';
        ////modal += '                  Unit Number</label>';
        //modal += '              <input id="ComUnitCode" type="text" placeholder="Unit Number" class="form-control companyrequired textstyle"  value="' + unitNum + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        //modal += '      <div class="col-md-6">';
        //modal += '          <div class="form-group">';
        ////modal += '              <label class="control-label">';
        ////modal += '                 Bldg/Street Name</label>';
        //modal += '              <input id="ComBldgName" type="text" placeholder="Bldg/Street Name" class="form-control companyrequired textstyle" value="' + street + '"/>';
        //modal += '          </div>';
        //modal += '      </div>';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Municipality</label>';
        modal += '              <input id="ComMunicipality" type="text" placeholder="Municipality" class="form-control companyrequired textstyle" value="' + municipality + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  City</label>';
        modal += '              <input id="ComCity" type="text" placeholder="City" class="form-control companyrequired textstyle" value="' + city + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        modal += '  </div>';
        modal += '</div>';

        modal += '<div class="row">';
        modal += '  <div class="col-md-12">';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                 Country</label>';
        modal += '              <input id="ComCountry" type="text" placeholder="Country" class="form-control companyrequired textstyle" value="' + country + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        modal += '      <div class="col-md-6">';
        modal += '          <div class="form-group">';
        //modal += '              <label class="control-label">';
        //modal += '                  Zip Code</label>';
        modal += '              <input id="ComZipCode" type="text" placeholder="Zip" class="form-control companyrequired textstyle" value="' + zip + '"/>';
        modal += '          </div>';
        modal += '      </div>';
        //if (operation == "edit") {
        //    modal += '      <div class="col-md-4">';
        //    modal += '          <div class="form-group">';
        //    modal += '              <div class="checkbox">';
        //    modal += '                   <label >';
        //    modal += '                      <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" style="margin-top:.55cm;"> <br/>Activate';
        //    modal += '                  </label>';        
        //    modal += '              </div>';    
        //    //modal += '              <label class="control-label">';
        //    //modal += '                  Activate</label>';
        //    //modal += '                  <br/>';
        //    //modal += '              <input type="checkbox" value="' + IsActive2 + '" ' + IsActive + ' id="chkIsActive" >Activate';
        //    modal += '          </div>';
        //    modal += '      </div>';
        //}
        modal += '  </div>';
        modal += '</div>';


        modal += '<div class="modal-footer">';
        modal += '<div class="row">';
        modal += '<button class="btn btn-primary" data-recid="' + id + '" id="' + ((operation == 'add') ? 'AddItemSaveButton' : 'AddItemUpdateButton') + '"';
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
        $("#modal123").modal("show");
        $("#modal123").css('z-index', '1000000');
    },

    deactivate: function (code, source) {
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

    ContactPerson: function (operation, boundIndex) {
        var firstname = '';
        var middlename = '';
        var lastname = '';
        var email = '';
        var contactnumber = '';
        var department = '';
        //var IsActive;
        var code;

        if (operation != "add") {

            var rowID = $("#ContactPersonGrid").jqxGrid('getrowid', boundIndex);
            var data = $("#ContactPersonGrid").jqxGrid('getrowdatabyid', rowID);

            firstname = data.First_Name_string;
            middlename = data.Middle_Name_string;
            lastname = data.Last_Name_string;
            email = data.Email_string;
            contactnumber = data.Contact_Number_string;
            department = data.Department_string;
            code = data.code_string;
            //if (data.isactive_string) {
            //    IsActive = 'checked = "checked"';
            //    var IsActive2 = 1;
            //}
        }

        var modal2 = '<style>';
        modal2 += ' .textstyle {';
        modal2 += '      background-color: transparent;';
        modal2 += '      outline: none;';
        modal2 += '      outline-style: none;';
        modal2 += '      outline-offset: 0;';
        modal2 += '      border-top: none;';
        modal2 += '      border-left: none;';
        modal2 += '      border-right: none;';
        modal2 += '      border-bottom: solid 1px;';
        modal2 += '      padding: 3px 10px;';
        modal2 += '}';
        modal2 += ' .form-control:focus {';
        modal2 += '      border-top: 0;';
        modal2 += '      border-left: 0;';
        modal2 += '      border-right: 0;';
        modal2 += '      border-bottom: solid 1px;';
        modal2 += '}';
        modal2 += '</style>';

        modal2 += '<div class="modal fade" id="modalContactPerson" role="dialog" >';
        modal2 += '<div class="modal-dialog">';
        modal2 += ' <div class="modal-content">';

        modal2 += '<div class="modal-header" style="background-color:#12AFCB; color:#ffffff">';
        modal2 += '<h4 class="modal-title">Add Contact Person</h4>';
        modal2 += '</div>';
        modal2 += '<div class="modal-body" style="margin-top:3%;">';

        modal2 += '<div class="row">';
        modal2 += '  <div class="col-md-12">';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                 Email</label>';
        modal2 += '              <input id="Email" type="text" placeholder="E-mail" class="form-control companyrequired textstyle" value= "' + email + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                  Contact Number</label>';
        //modal2 += '              <div id="numericInput"></div>';
        modal2 += '              <input id="ContactNumber" type="text" placeholder="Contact Number" class="form-control companyrequired textstyle" value= "' + contactnumber + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                  Department</label>';
        modal2 += '              <input id="Department" type="text" placeholder="Department" class="form-control companyrequired textstyle" value= "' + department + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '  </div>';
        modal2 += '</div>';

        modal2 += '<div class="row">';
        modal2 += '  <input id="Code" type="hidden" value="' + code + '" />';
        modal2 += '  <div class="col-md-12">';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                  First Name</label>';
        modal2 += '              <input id="FirstName" type="text" placeholder="First Name" class="form-control companyrequired textstyle" value= "' + firstname + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                  Middle Name</label>';
        modal2 += '              <input id="MiddleName" type="text" placeholder="Middle Name" class="form-control companyrequired textstyle" value= "' + middlename + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '      <div class="col-md-4">';
        modal2 += '          <div class="form-group">';
        //modal2 += '              <label class="control-label">';
        //modal2 += '                  Last Name</label>';
        modal2 += '              <input id="LastName" type="text" placeholder="Last Name" class="form-control companyrequired textstyle" value= "' + lastname + '"/>';
        modal2 += '          </div>';
        modal2 += '      </div>';
        modal2 += '  </div>';
        modal2 += '</div>';
       
        //if (operation == "edit") {
        //modal2 += '<div class="row">';
        //modal2 += '  <div class="col-md-12">';
        //modal2 += '      <div class="col-md-4">';
        //modal2 += '          <div class="form-group">';
        //modal2 += '              <div class="checkbox">';
        //modal2 += '                   <label >';
        //modal2 += '                      <input type="checkbox" value="'+ IsActive2 +'" '+ IsActive +' id="chkIsActive">Activate';
        //modal2 += '                  </label>';
        //modal2 += '              </div>';
        //modal2 += '          </div>';
        //modal2 += '      </div>';
        //modal2 += '  </div>';
        //modal2 += '</div>';
        //}
        modal2 += '<div class="modal-footer">';
        modal2 += '<div class="row">';
        modal2 += '<button class="btn btn-info" data-recid="' + id + '" id="' + ((operation == 'add') ? 'cmdAddItemContact' : 'cmdUpdateContactPerson') + '"';
        modal2 += 'style="width: 100px;">';
        modal2 += 'SAVE</button>';
        modal2 += '<button type="button" style="width: 100px;" class="btn btn-default" data-dismiss="modal">CANCEL</button> &nbsp ';
        modal2 += '</div>';
        modal2 += '</div>';

        modal2 += '</div>';

        modal2 += '</div>';
        modal2 += '</div>';
        modal2 += '</div>';

        $("#form_modal").html(modal2);
        $("#modalContactPerson").modal("show");
        $("#modalContactPerson").css('z-index', '1000000');

        $("#numericInput").jqxNumberInput({ width: '154px', height: '31px', inputMode: 'simple', decimalDigits: 0 });
    }
};

var dbaseOperations = {
    save: function (operation, trans_id) {
        //for validation if textbox is empty
        var elements = ["#CompanyName", "#EmailAddress", "#ContactNumber", "#ComUnitCode", "#ComBldgName",
                                                "#ComMunicipality", "#ComCity", "#ComCountry", "#ComZipCode"];
        var ctr = 0;
        for (var i = 0; i <= 8; i++) {
            if ($(elements[i]).val() == "") {
                $(elements[i]).css("border-color", "red");
            }
            else {
                $(elements[i]).css("border-color", "#e5e5e5");
                ctr++;
            }
        }

        //if all textbox is filled
        if (ctr == 9) {
            var url = '';
            var msg = '';
            //var IsActive = false;
            if (operation == 'add') {
                url = '/Supplier/AddSupplier';
                msg = 'New supplier added!';
            } else {
                url = '/Supplier/UpdateSupplier';
                msg = 'Supplier updated!';
            }
            //if ($("#chkIsActive").is(":checked")) {
            //    IsActive = true;
            //}
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                data: {
                    id: trans_id,
                    code: $("#Code").val(),
                    Name: $("#CompanyName").val(),
                    Email: $("#EmailAddress").val(),
                    ContactNbr: $("#ContactNumber").val(),
                    UnitNbr: $("#ComUnitCode").val(),
                    StreetName: $("#ComBldgName").val(),
                    Municipality: $("#ComMunicipality").val(),
                    City: $("#ComCity").val(),
                    Country: $("#ComCountry").val(),
                    Zip: $("#ComZipCode").val(),
                    //isactive: IsActive
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    $("#modal123").modal("hide");
                    if (response.success) {
                        notification_modal("Addition Successful!", msg, "success");
                        $('#SupplierGrid').jqxGrid('updatebounddata');
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
    },

    SaveContactPerson: function (operation, trans_id) {
        //for validation if textbox is empty
        var elements = ["#FirstName", "#MiddleName", "#LastName", "#Email", "#ContactNumber", "#Department"]
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

        //if all textbox is filled
        if (ctr == 6) {
            var url = '';
            var msg = '';
            //var IsActive = false;
            if (operation == 'add') {
                url = '/ContactPerson/AddContactPerson';
                msg = 'New supplier added!';
            } else {
                url = '/ContactPerson/UpdateContactPerson';
                msg = 'Supplier updated!';
            }
            //if ($("#chkIsActive").is(":checked")) {
            //    IsActive = true;
            //}
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                data: {
                    id: trans_id,
                    Code: $("#Code").val(),
                    SupplierKey: mCode,
                    FirstName: $("#FirstName").val(),
                    MiddleName: $("#MiddleName").val(),
                    LastName: $("#LastName").val(),
                    Email: $("#Email").val(),
                    ContactNumber: $("#ContactNumber").val(),
                    Department: $("#Department").val(),
                    //IsActive: IsActive
                },
                beforeSend: function () {

                },
                headers: {
                    //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    if (response.success) {
                        $("#modalContactPerson").modal("hide");
                        notification_modal("Addition Successful!", msg, "success");
                        $('#ContactPersonGrid').jqxGrid('updatebounddata');
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
    },

    deactivate: function (source, code) {
        var url = '';
        var msg = '';
        if (source == "Supplier") {
            url = '/Supplier/DeactivateSupplier';
            msg = 'Supplier Deactivated!';
        } else if (source == "Contact") {
            url = '/ContactPerson/DeactivateContact';
            msg = 'Supplier Deactivated!';
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
                    if (source == "Supplier")
                        $('#SupplierGrid').jqxGrid('updatebounddata');
                    else if (source == "Contact")
                        $('#ContactPersonGrid').jqxGrid('updatebounddata');
                } else {
                    notification_modal("Deactivation Failed!", response.message, "danger");
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }
};

var applyFilter = function (datafield, childgrid, _code) {
    if (typeof childgrid == "undefined" || childgrid == '' || typeof childgrid=="null") {
        console.log("Child grid not set!");
    }else{
        //static counter to prevent infinite looping
        var ctr = 0;
        $("#" + childgrid).jqxGrid('clearfilters');
        var filtertype = 'stringfilter';
        var filtergroup = new $.jqx.filter();

        var filter_or_operator = 0;
        var filtervalue = "'" + _code + "'";
        var filtercondition = 'equal';
        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);

        $("#" + childgrid).on("bindingcomplete", function (event) {
            if (ctr == 0) {
                $("#" + childgrid).jqxGrid('addfilter', datafield, filtergroup);
                $("#" + childgrid).jqxGrid('applyfilters');
            }
            ctr = 1;
        });
    }
}



