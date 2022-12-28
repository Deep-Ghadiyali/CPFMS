$(document).ready(function () {

    // Clearing Hidden Delete input
    $("#deleteEmployeeModal form #hidden-input").empty();

    // Add Modal Focus
    $(".table-title #addnew").click(function () {
        setTimeout(function () {
            $("#addEmployeeModal input[name=month_id]").focus();
        }, 500);
    });

    // Multiple Delete Focus to Cancel Button
    $(".table-title #multipledelete").click(function () {
        setTimeout(function () {
            $("#deleteEmployeeModal .modal-footer #cancel").focus();
        }, 500);
    });

    // Edit Modal Focus
    // Edit Modal Value Changes
    $('table tbody .edit').click(function () {
        setTimeout(function () {
            $("#editEmployeeModal input[name=item1]").focus();
        }, 500);
        var row = $(this).parent().parent();
        var li_id = $(this).attr("id");
        var item1 = row.find("td:nth-child(3)").text();
        var item2 = row.find("td:nth-child(4)").text();
        var item3 = row.find("td:nth-child(5)").text();
        var item4 = row.find("td:nth-child(6)").text();
        $("#editEmployeeModal input[name=month_id]").val(li_id);
        $("#editEmployeeModal input[name=item1]").val(item1);
        $("#editEmployeeModal input[name=item2]").val(item2);
        $("#editEmployeeModal input[name=item3]").val(item3);
        $("#editEmployeeModal input[name=item4]").val(item4);
    });

    // Delete One Entry
    $('table tbody .delete').click(function () {
        setTimeout(function () {
            $("#deleteEmployeeModal .modal-footer #cancel").focus();
        }, 500);
        var inputhtml = '<input type="hidden" name="ids[]" value="' + this.id + '">';
        $("#deleteEmployeeModal form #hidden-input").append(inputhtml);
    });

    // Delete Multiple Entry
    $(".table-title #multipledelete").click(function (e) {
        e.preventDefault();
        var checkbox = $('table tbody input[type="checkbox"]');
        var count = 0;
        checkbox.each(function () {
            if (this.checked) {
                ++count;
                var inputhtml = '<input type="hidden" name="ids[]" value="' + this.id + '">';
                $("#deleteEmployeeModal form #hidden-input").append(inputhtml);
            }
        });
        if (count == 0)
            return false;
    });

    //Cancel event of delete modal
    $("#deleteEmployeeModal").on("hidden.bs.modal", function () {
        $("#deleteEmployeeModal form #hidden-input").empty();
    });

});