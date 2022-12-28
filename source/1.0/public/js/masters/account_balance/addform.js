$(document).ready(function () {

    var member_list = [];

    $(".loading").hide();

    // Sub Account Validation
    $("#mainForm").submit(function(e){
        var sub_account_id = $("form table input[name=sub_account_id]").val();
        if(sub_account_id) {
            sub_account_id = sub_account_id.trim();
            if(member_list.includes(sub_account_id)){
                alert("Sub Account ID " + sub_account_id + " already exists!");
                e.preventDefault();
            }
        }
        else {
            alert("Enter Sub Account ID!");
            e.preventDefault();
        }
    });

    // Organization Default Values
    var string_or = $("form table select[name=organization_id]").children("option:selected").data('tokens');
    var arr_or = string_or.split(';');
    $("form table input[name=organization_name]").val(arr_or[1]);

    // Account Head Detail Fetch
    $("form table select[name=account_id]").on('change', function () {
        var id = this.value;
        if (id === "--SELECT--")
            return;
        var url = window.location.href;
        var arr = url.split("/");
        var req_url = arr[0] + "//" + arr[2] + "/api/master/accounthead/" + id;
        $.ajax({
            url: req_url,
            success: function (res) {
                if (res.status === true) {
                    var address = res.data.village_name + ",&#13;&#10;" + res.data.taluka_name + ",&#13;&#10;" + res.data.district_name;
                    $("form table textarea[name=sub_account_address]").html(address);
                    $("form table input[name=account_name]").val(res.data.account_name);
                    $("form table input[name=village_name]").val(res.data.village_name);
                    $("form table input[name=taluka_name]").val(res.data.taluka_name);
                    $("form table input[name=district_name]").val(res.data.district_name);
                    if(res.sub_account_list.length > 0) {
                        var rid = res.sub_account_list[0].rid;
                        var sa_arr = [];
                        for(sa of res.sub_account_list) {
                            sa_arr.push(sa.sid);
                        }
                        member_list = sa_arr;
                        sa_str = sa_arr.join("&#13;&#10;");
                        last_id = sa_arr[0];
                        $("form table select[name=resource_person_id]").selectpicker('val',rid);
                        $("form table select[name=resource_person_id]").selectpicker('refresh');
                        var string = $("form table select[name=resource_person_id]").children("option:selected").data('tokens');
                        var arr = string.split(';');
                        $("form table input[name=resource_person_name]").val(arr[1]);
                        $("form table textarea[name=sub_account_list]").html(sa_str);
                        $("form table input[name=sub_account_last_id]").val(last_id);
                    }
                    else {
                        member_list = [];
                        $("form table textarea[name=sub_account_list]").val("--NOT AVAILABLE--");
                        $("form table input[name=sub_account_last_id]").val("--NOT AVAILABLE--");
                    }
                }
                else {
                    member_list = [];
                    alert("Unable to fatch data of selected Society !");
                    $("form table input[name=account_name]").val("--NOT AVAILABLE--");
                    $("form table input[name=village_name]").val("--NOT AVAILABLE--");
                    $("form table input[name=taluka_name]").val("--NOT AVAILABLE--");
                    $("form table input[name=district_name]").val("--NOT AVAILABLE--");
                    $("form table textarea[name=sub_account_list]").val("--NOT AVAILABLE--");
                    $("form table input[name=sub_account_last_id]").val("--NOT AVAILABLE--");
                }
            }
        });
    });

    /*
    // Sub Account Detail Fetch
    $("form table select[name=sub_account_id]").on('change', function () {
        var id = this.value;
        if (id === "--SELECT--")
            return;
        var url = window.location.href;
        var arr = url.split("/");
        var req_url = arr[0] + "//" + arr[2] + "/api/master/subaccount/" + id;
        $.ajax({
            url: req_url,
            success: function (res) {
                if (res.status === true) {
                    $("form table input[name=sub_account_name]").val(res.data.sub_account_name);
                    $("form table textarea[name=sub_account_address]").val(res.data.sub_account_address);
                }
                else {
                    alert("Unable to fatch data of selected Member !");
                    $("form table input[name=sub_account_name]").val("--NOT AVAILABLE--");
                    $("form table textarea[name=sub_account_address]").val("--NOT AVAILABLE--");
                }
            }
        });
    });
    */

    // Insurance Date = Join Date
    $("form table input[name=join_date]").on('change', function() {
        var date = $(this).val();
        $("form table input[name=insurance_date]").val(date);
    });

    // Next Due Date = Birth Date + 32 Months
    $("form table input[name=birth_date]").on('change',function(){
        var date = new Date($(this).val());
        date.setMonth(date.getMonth() + 32);
        var dd = date.getDate().toString();
        var mm = (date.getMonth() + 1).toString();
        var yyyy = (date.getFullYear()).toString();
        if (dd.length == 1)
            dd = "0" + dd;
        if (mm.length == 1)
            mm = "0" + mm;
        var fdate = yyyy + "-" + mm + "-" + dd;
        $("form table input[name=insurance_due_on_date]").val(fdate);
    });

    // Organization Name Fill
    $("form table select[name=organization_id]").on('change', function () {
        var string = $(this).children("option:selected").data('tokens');
        var arr = string.split(';');
        $("form table input[name=organization_name]").val(arr[1]);
    });

    // Resource Person Name Fill
    $("form table select[name=resource_person_id]").on('change', function () {
        var string = $(this).children("option:selected").data('tokens');
        var arr = string.split(';');
        $("form table input[name=resource_person_name]").val(arr[1]);
    });

    // Cow Cast Name Fill
    $("form table select[name=cow_cast_id]").on('change', function () {
        var string = $(this).children("option:selected").data('tokens');
        var arr = string.split(';');
        $("form table input[name=cow_cast_name]").val(arr[1]);
    });

});
