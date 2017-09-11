
var identifier = 1;
var datatable;
var index;

$(document).ready(function (e) {
    
    //assign keyup function for search
    $(document).delegate("#AuditGrid_searchField", "keyup", function (e) {

        //get the search string
        var search = $('#AuditGrid_searchField').val();

        //assign columns to be queried
        var columns = ['date_string', "module_string", "description_string"
            //, 'computer_name_string'
            , 'IP_address_string', 'username_string'
        ];

        //pass the criteria to be searched
        generalSearch(search, "AuditGrid", columns, e);
    });

    HideLoading();
});