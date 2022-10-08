$("#reg_dob").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0"
});

$("#fpo_estdate").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0"
});

$("#license_fromDate").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0"
});

$("#license_toDate").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+100"
});

$("#blockUnifiedLicense").hide();
$("#showserviceterritory").hide();
$("#showTotalTurnover").hide();
$('.collectionbox').hide();
$('.comname-div').hide();
$('.companyreg-div').hide();
$('.ogname-div').hide();
$('.orgadd-div').hide();
$('.orgcin-div').hide();
$('#fpo_div').hide();
$('.fpo-comp-reg').hide();
var baseUrl = $('#base_url').val();

var restUrl = "https://enam.gov.in/NamWebSrv/";
//from other_register.html

$('.dropdown-container-chk')
    .on('click', '.dropdown-button', function() {
        $(this).siblings('.dropdown-list').toggle();
    })
    .on('input', '.dropdown-search', function() {
        var target = $(this);
        var dropdownList = target.closest('.dropdown-list');
        var search = target.val().toLowerCase();

        if (!search) {
            dropdownList.find('li').show();
            return false;
        }

        dropdownList.find('li').each(function() {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(search) > -1;
            $(this).toggle(match);
        });
    })
    .on('change', '[type="checkbox"]', function() {
        var container = $(this).closest('.dropdown-container-chk');
        var numChecked = container.find('[type="checkbox"]:checked').length;
        var value = container.find('[type="checkbox"]:checked').val();
        container.find('.quantity').text(numChecked || 'Any');
    });

getFarmerState();
ajaxCallToWebservice();
getFpoState();
/* close other_register.html*/
function getFarmerState() {
    console.log('----', window.XDomainRequest);
    contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest)
        contentType = "text/plain";

    $.ajax({
        "headers": {
            "cache-control": "no-cache",
            "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
        },
        url: 'https://enam.gov.in/NamWebSrv/rest/MastersUpdate/getFarmerState',
        type: 'POST',
        dataType: 'json',
        data: {
            'language': 'en'
        },
        contentType: contentType,

        success: function(response) {
            console.log("====**=====", response);
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.stateList, function(key, value) {
                    x = x + '<option value="' + value.stateId + '">' + value.stateName + '</option>';
                });
                $('#add_state').html(x);
            }
        }
    })
}


function getFpoState() {
    contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest)
        contentType = "text/plain";

    $.ajax({
        "headers": {
            "cache-control": "no-cache",
            "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
        },
        url: 'https://enam.gov.in/NamWebSrv/rest/MastersUpdate/getFarmerState',
        type: 'POST',
        dataType: 'json',
        data: {
            'language': 'en'
        },
        contentType: contentType,

        success: function(response) {
            console.log("====*fpo state*=====", response);
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.stateList, function(key, value) {

                    x = x + '<option value="' + value.stateId + '-' + value.stateName + '">' + value.stateName + '</option>';
                });
                $('#fpo_state').html(x);
            }
        }
    })
}


//to fill mandistate field.
function ajaxCallToWebservice(id) {

    var dropboxforState = document.getElementById("regstate");
    var dropboxApplyforState = document.getElementById("applystate");

    var settings = {
        "url": restUrl + "rest/Commodity/getApmcState",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function(response) {
        for (var i = 0; i < response.listApmcState.length; i++) {
            var val = response.listApmcState[i].adoum_oprcd + "-" + response.listApmcState[i].adoum_opr_id + "-" + response.listApmcState[i].adoum_oprname;
            var str = response.listApmcState[i].adoum_oprname;
            var el = document.createElement("option");
            el.textContent = str;
            el.value = val;
            dropboxforState.appendChild(el);
        }
        for (var j = 0; j < response.listApmcState.length; j++) {
            var valu = response.listApmcState[j].adoum_oprcd + "-" + response.listApmcState[j].adoum_opr_id + "-" + response.listApmcState[j].adoum_oprname;
            var stru = response.listApmcState[j].adoum_oprname;
            var e2 = document.createElement("option");
            e2.textContent = stru;
            e2.value = valu;
            dropboxApplyforState.appendChild(e2);
        }
    });
}

$(document).on('change', '#add_state', function() {
    var stateId = $('#add_state').val();
    var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest)
        contentType = "text/plain";
    $.ajax({
        url: restUrl + 'rest/MastersUpdate/getFarmerDistrict',
        type: 'POST',
        data: {
            'stateId': stateId
        },
        dataType: 'json',
        contentType: contentType,
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.districtList, function(key, value) {
                    x = x + '<option value="' + value.districtId + '">' + value.districtName + '</option>';
                });
                $('#add_district').html(x);
            }
        }
    });
});

$(document).on('change', '#add_district', function() {
    var districtId = $('#add_district').val();
    $.ajax({
        type: 'POST',
        url: restUrl + 'rest/MastersUpdate/getFarmerTahsil',
        dataType: 'json',
        data: {
            'districtId': districtId
        },
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.tahsilList, function(key, value) {
                    x = x + '<option value="' + value.tahsilId + '">' + value.tahsilName + '</option>';
                });
                $('#add_tehsil').html(x);
            }
        }
    });
});

$(document).on('change', '#add_tehsil', function() {
    var stateId = $('#add_state').val();
    var districtId = $('#add_district').val();
    var tahshilId = $('#add_tehsil').val();
    $.ajax({
        type: 'POST',
        url: restUrl + 'rest/MastersUpdate/getFarmerCity',
        dataType: 'json',
        data: {
            'stateId': stateId,
            'districtId': districtId,
            'tahsilId': tahshilId
        },
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.cityList, function(key, value) {
                    x = x + '<option value="' + value.cityId + '">' + value.cityName + '</option>';
                });
                $('#add_village').html(x);
            }
        }
    });
});


//for fpo related district,tehsil, village

$(document).on('change', '#fpo_state', function() {
    var stateVal = $('#fpo_state').val();
    var stateId = stateVal.substring(0, stateVal.indexOf("-"));
    var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest)
        contentType = "text/plain";
    $.ajax({
        url: restUrl + 'rest/MastersUpdate/getFarmerDistrict',
        type: 'POST',
        data: {
            'stateId': stateId
        },
        dataType: 'json',
        contentType: contentType,
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.districtList, function(key, value) {
                    x = x + '<option value="' + value.districtId + '-' + value.districtName + '">' + value.districtName + '</option>';
                });
                $('#fpo_district').html(x);
            }
        }
    });
});

$(document).on('change', '#fpo_district', function() {
    var districtVal = $('#fpo_district').val();
    var districtId = districtVal.substring(0, districtVal.indexOf("-"));
    $.ajax({
        type: 'POST',
        url: restUrl + 'rest/MastersUpdate/getFarmerTahsil',
        dataType: 'json',
        data: {
            'districtId': districtId
        },
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.tahsilList, function(key, value) {
                    console.log('==>>', value);
                    x = x + '<option value="' + value.tahsilId + '-' + value.tahsilName + '">' + value.tahsilName + '</option>';
                });
                $('#fpo_tehsil').html(x);
            }
        }
    });
});

$(document).on('change', '#fpo_tehsil', function() {
    var stateVal = $('#fpo_state').val();
    var stateId = stateVal.substring(0, stateVal.indexOf("-"));

    var districtVal = $('#fpo_district').val();
    var districtId = districtVal.substring(0, districtVal.indexOf("-"));

    var tahshilVal = $('#fpo_tehsil').val();
    var tahshilId = tahshilVal.substring(0, tahshilVal.indexOf("-"));

    $.ajax({
        type: 'POST',
        url: restUrl + 'rest/MastersUpdate/getFarmerCity',
        dataType: 'json',
        data: {
            'stateId': stateId,
            'districtId': districtId,
            'tahsilId': tahshilId
        },
        success: function(response) {
            if (response.statusMsg == 'S') {
                var x = '<option value="-select-">-Select-</option>';
                $.each(response.cityList, function(key, value) {
                    x = x + '<option value="' + value.cityId + '-' + value.cityName + '">' + value.cityName + '</option>';
                });
                $('#fpo_village').html(x);
            }
        }
    });
});


$(document).on('change', '#enamMandi', function() {
    let uType = $('#regtype').val();
    let fpctypeT = $('#fpctypeT').val();
    var regLevel = $('input[name=registerlevel]:checked').val();
    var regWithEnam = $('input[name=regiWithEnam]:checked').val();

    if (regWithEnam == 'Y') {
        if (uType == 'T' && fpctypeT == 'TA' && regLevel == 'S') {
            //$('.unifiedLicenseNoModelMLevel').show();
        }
    }

});

$(document).on('change', '#reg_gender', function() {
    let genderVal = $(this).val();
    if (genderVal == 'F') {
        $("#relationtype option[value='Daughter Of']").prop('selected', 'selected');
        $("#relationtype option[value='Daughter Of']").show();
        $("#relationtype option[value='Mother Of']").show();
        $("#relationtype option[value='Wife Of']").show();
        $("#relationtype option[value='Son Of']").hide();
        $("#relationtype option[value='Father Of']").hide();
        //$("#relationtype option[value='Husband Of']").hide();
    }

    if (genderVal == 'M') {
        $("#relationtype option[value='Son Of']").prop('selected', 'selected');
        $("#relationtype option[value='Son Of']").show();
        $("#relationtype option[value='Father Of']").show();
        //$("#relationtype option[value='Husband Of']").show();
        $("#relationtype option[value='Mother Of']").hide();
        $("#relationtype option[value='Daughter Of']").hide();
        $("#relationtype option[value='Wife Of']").hide();
    }

    if (genderVal == 'O') {
        $("#relationtype option[value='0']").prop('selected', 'selected');
        $("#relationtype option[value='Son Of']").show();
        $("#relationtype option[value='Daughter Of']").show();
        $("#relationtype option[value='Wife Of']").show();
        $("#relationtype option[value='Father Of']").hide();
        //$("#relationtype option[value='Husband Of']").hide();
        $("#relationtype option[value='Mother Of']").hide();
    }

});

/*for dob validation*/

$(document).on('change', '#reg_dob', function() {
    var dateString = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d+$/;
    let dateBirth = $(this).val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0! 
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var sysDate = mm + '/' + dd + '/' + yyyy;
    var enteredDate = dateBirth.split("/");
    var formatedDate = enteredDate[1] + "/" + enteredDate[0] + "/" + enteredDate[2];
    var currentDate = new Date(sysDate);
    var userDOB = new Date(formatedDate);

    if (!dateBirth.match(dateString)) {
        alert("Date Of Birth Should be in DD/MM/YYYY format only");
        document.getElementById("reg_dob").focus();
        return false;
    } else if ((userDOB.getTime()) >= (currentDate.getTime())) {
        alert("Enter valid Date Of Birth, You can not enter future date in DOB field");
        document.getElementById("reg_dob").focus();
        $('#reg_dob').val('');
        return false;
    } else if (myAgeValidation(formatedDate)) {
        alert("Valid age is  above 18 years , Please select valid date of birth .");
        document.getElementById("reg_dob").focus();
        $('#reg_dob').val('');
        return false;
    }
});

$(document).on("click", "input[name='multiApmcIds']", function() {
    let arr = [];
    $("input[name='multiApmcIds']:checked").each(function() {
        arr.push($(this).val());
    });

    $('#selectApmcList').val(arr);
})



$(document).on('click', '#enam_registration', function() {

    $("#uploadUnifiedLicense").val("");
    var uploadJson = [{
        "docFile": []
    }];

    var $inputLeft = $('#unifiedLicenseTableLeft :input[type=hidden]');
    $inputLeft.each(function() {
        if ($(this).val() != "") {
            var base64 = $(this).val();
            var id = $(this).attr('id');
            var res = id.split("_");
            var srno = res[1];
            var fullPath = $("#fileUpload_" + srno).val();
            var filename = fullPath.replace(/^.*[\\\/]/, '');
            var data = { 'srno': srno, 'base64': base64, 'fileName': filename };
            //var data = '{'+srno+ ':'+base64+'}';
            uploadJson[0].docFile.push(data);
        }
    });
    //console.log('99999999999999', JSON.stringify(uploadJson));	
    $("#uploadUnifiedLicense").val(JSON.stringify(uploadJson));


    var emailid = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var mobileNo = /^[6789]\d{9}$/;
    var number = /^[0-9]+$/;
    var ifsccode = /^[A-Za-z]{4}[0]{1}[a-zA-Z0-9]{6}$/;
    var formvalid = true;
    var spinner = $('#loader');

    var baseUrl = $('#base_url').val();
    var regType = $('#regtype').val();
    var regState = $('#regstate').val();
    var regWith = $('#reg_with').val();
    var reg_level = $('input[name=registerlevel]:checked').val();
    //var reg_cat = $('#regcat').val();

    var fpctypeFVal = $('#fpctypeF').val();

    var nameTitle = $('#nametitle').val();
    var regFname = $('#reg_fname').val();
    var regMname = $('#reg_mname').val();
    var regLname = $('#reg_lname').val();
    var regGender = $('#reg_gender').val();
    var regDob = $('#reg_dob').val();
    var relationType = $('#relationtype').val();
    var relationTypeName = $('#relationtypename').val();
    var regStreet = $('#reg_street').val();
    //var regity = $('#reg_city').val();
    //var reg_post = $('#reg_post').val();
    var reg_pin = $('#reg_pin').val();
    var addState = $('#add_state').val();
    var addDistrict = $('#add_district').val();
    var addTehsil = $('#add_tehsil').val();
    var addVillage = $('#add_village').val();
    var addPost = $('#add_post').val();
    var photoIdType = $('#photoidtype').val();
    var idNumber = $('#idnumber').val();
    var regMobile = $('#reg_mobile').val();
    var regEmail = $('#reg_email').val();
    var companyName = $('#company_name').val();
    var companyReg = $('#company_reg').val();
    var fpcBank = $('#fpcBank').val();
    var fpcBankAccountName = $('#fpcBankAccountName').val();
    var fpcBankAccount = $('#fpcBankAccount').val();
    var typeAgainAccount = $('#typeagainaccount').val();
    var fpcIfsc = $('#fpcIfsc').val();
    var typeAgainIfsc = $('#typeagainifsc').val();
    var companyCertificate = $('#company_certificate').val();
    var GetAcknowledge_sms = $('input[name=GetAcknowledge_sms]:checked').val();
    var GetAcknowledge_email = $('input[name=GetAcknowledge_email]:checked').val();

    var fpoCompRegNo = $('#fpo_comp_reg').val();
    var fpoOrgPin = $('#fpo_org_pin').val();
    var fpoState = $('#fpo_state').val();
    var fpoDistrict = $('#fpo_district').val();
    var fpoTehsil = $('#fpo_tehsil').val();
    var fpoVillage = $('#fpo_village').val();
    var fpoEstDate = $('#fpo_estdate').val();


    if (regType == 0 || regType == "-select-" || regType.trim() == null) {
        $('#regtype_error').html('Please select Registration type.').css('display', 'block');
        $("#regtype").focus();
        formvalid = false;
    } else {
        $('#regtype_error').css('display', 'none');
        formvalid = true;
    }

    if (regState == 0 || regState == "-select-" || regState.trim() == null) {
        $('#regstate_error').html('Please select State.').css('display', 'block');
        formvalid = false;
    } else {
        $('#regstate_error').css('display', 'none');
        formvalid = true;
    }

    if (regWith == 0 || regWith == "-select-" || regWith.trim() == null) {
        $('#reg_with_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_with_error').css('display', 'none');
        formvalid = true;
    }

    if (nameTitle == 0 || nameTitle == "Select Please" || nameTitle.trim() == null) {
        $('#nametitle_error').html('Please select name title.').css('display', 'block');
        formvalid = false;
    } else {
        $('#nametitle_error').css('display', 'none');
        formvalid = true;
    }

    if (regFname == "" || regFname.trim() == "") {
        $('#reg_fname_error').html('Please enter first name.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_fname_error').css('display', 'none');
        formvalid = true;
    }

    if (regMname == "" || regMname.trim() == "") {
        $('#reg_mname_error').html('Please enter middle name.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_mname_error').css('display', 'none');
        formvalid = true;
    }

    if (regLname == "" || regLname.trim() == "") {
        $('#reg_lname_error').html('Please enter last name.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_lname_error').css('display', 'none');
        formvalid = true;
    }

    if (regGender == 0) {
        $('#reg_gender_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_gender_error').css('display', 'none');
        formvalid = true;
    }

    if (regDob == '') {
        $('#reg_dob_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_dob_error').css('display', 'none');
        formvalid = true;
    }

    if (relationType == 0 || relationType == "-Select-") {
        $('#relationtype_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#relationtype_error').css('display', 'none');
        formvalid = true;
    }

    if (relationTypeName == '') {
        $('#relationtype_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#relationtype_error').css('display', 'none');
        formvalid = true;
    }

    if (regStreet == '') {
        $('#reg_street_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_street_error').css('display', 'none');
        formvalid = true;
    }

    if (addState == 0 || addState == "-select-" || addState.trim() == "") {
        $('#add_state_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#add_state_error').css('display', 'none');
        formvalid = true;
    }

    if (addDistrict == 0 || addDistrict == "-select-" || addDistrict.trim() == "") {
        $('#add_district_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#add_district_error').css('display', 'none');
        formvalid = true;
    }

    if (addTehsil == 0 || addTehsil == "-select-" || addTehsil.trim() == "") {
        $('#add_tehsil_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#add_tehsil_error').css('display', 'none');
        formvalid = true;
    }

    if (addVillage == 0 || addVillage == "-select-" || addVillage.trim() == "") {
        $('#add_village_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#add_village_error').css('display', 'none');
        formvalid = true;
    }

    if (addPost == 0 || addVillage == "") {
        $('#add_post_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#add_post_error').css('display', 'none');
        formvalid = true;
    }

    if (photoIdType == 0 || photoIdType == "-Select-") {
        $('#photoidtype_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#photoidtype_error').css('display', 'none');
        formvalid = true;
    }

    if (idNumber == 0 || idNumber == "") {
        $('#idnumber_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#idnumber_error').css('display', 'none');
        formvalid = true;
    }

    if (!regMobile.match(mobileNo) || regMobile.trim() == '') {
        $('#reg_mobile_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_mobile_error').css('display', 'none');
        formvalid = true;
    }

    if (!regEmail.match(emailid) || regEmail.trim() == '') {
        $('#reg_email_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#reg_email_error').css('display', 'none');
        formvalid = true;
    }

    if (companyName == '') {
        $('#company_name_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#company_name_error').css('display', 'none');
        formvalid = true;
    }

    if (companyReg == '') {
        $('#company_reg_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#company_reg_error').css('display', 'none');
        formvalid = true;
    }

    if (fpcBank == '') {
        $('#fpcBank_error').html('Please enter bank name.').css('display', 'block');
        formvalid = false;
    } else {
        $('#fpcBank_error').css('display', 'none');
        formvalid = true;
    }

    if (fpcBankAccountName == '') {
        $('#fpcBankAccountName_error').html('Please enter account holder name.').css('display', 'block');
        formvalid = false;
    } else {
        $('#fpcBankAccountName_error').css('display', 'none');
        formvalid = true;
    }

    if (!fpcBankAccount.match(number) || fpcBankAccount == "") {
        $('#fpcBankAccount_error').html('Please enter account no.').css('display', 'block');
        formvalid = false;
    } else {
        $('#fpcBankAccount_error').css('display', 'none');
        formvalid = true;
    }

    if (typeAgainAccount == '') {
        $('#typeagainaccount_error').html('Please enter confirm account no.').css('display', 'block');
        formvalid = false;
    } else {
        $('#typeagainaccount_error').css('display', 'none');
        formvalid = true;
    }

    if (!fpcIfsc.match(ifsccode) || fpcIfsc == "") {
        $('#fpcIfsc_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#fpcIfsc_error').css('display', 'none');
        formvalid = true;
    }

    if (typeAgainIfsc == '') {
        $('#typeagainifsc_error').html('Please fill this field.').css('display', 'block');
        formvalid = false;
    } else {
        $('#typeagainifsc_error').css('display', 'none');
        formvalid = true;
    }

    if ($('#totalturnover').val() == '') {
        $('#totalturnover_error').html('Please Enter Total Turnover').css('display', 'block');
        //formvalid = false;
    } else {
        $('#totalturnover_error').css('display', 'none');
        //$formvalid = true;

    }

    if (regType == 'F' && fpctypeFVal == 'FF') {

        if (fpoState == 0 || fpoState == "-select-" || fpoState.trim() == null) {
            $('#fpo_state_error').html('Please select State.').css('display', 'block');
            formvalid = false;
        } else {
            $('#fpo_state_error').css('display', 'none');
            formvalid = true;
        }

        if (fpoDistrict == 0 || fpoDistrict == "-select-" || fpoDistrict.trim() == null) {
            $('#fpo_district_error').html('Please select district.').css('display', 'block');
            formvalid = false;
        } else {
            $('#fpo_district_error').css('display', 'none');
            formvalid = true;
        }

        if (fpoTehsil == 0 || fpoTehsil == "-select-" || fpoTehsil.trim() == null) {
            $('#fpo_tehsil_error').html('Please select tehsil.').css('display', 'block');
            formvalid = false;
        } else {
            $('#fpo_tehsil_error').css('display', 'none');
            formvalid = true;
        }

        if (fpoVillage == 0 || fpoVillage == "-select-" || fpoVillage.trim() == null) {
            $('#fpo_village_error').html('Please select village.').css('display', 'block');
            formvalid = false;
        } else {
            $('#fpo_village_error').css('display', 'none');
            formvalid = true;
        }

        if (fpoOrgPin == "" || fpoOrgPin.trim() == "") {
            $('#fpo_org_pin_error').html('Please enter pin code').css('display', 'block');
            formvalid = false;
            $("#fpo_org_pin").focus();
        } else {
            $('#fpo_org_pin_error').css('display', 'none');
            formvalid = true;
        }
    }


    if (formvalid) {
        spinner.show();
        $('#registration_form').ajaxForm({
            dataType: 'json',

            beforeSubmit: function(e) {

            },
            success: function(data) {
                if (data.status == 200) {
                    spinner.hide();
                    swal(
                        'Success!',
                        'Thank You for Registering with e-NAM!. You will receive the Login ID and Password on the registered Email ID',
                        'success'
                    ).then(function() {

                        location.href = 'https://enam.gov.in/web';
                    })
                }
                if (data.status == 500) {

                    spinner.hide();

                    swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.msg
                    })
                }
            }
        }).submit();

    } else {
        alert('went wrong');
    }
});


function onBlurEmail() {
    let emailId = $('#reg_email').val();
    var emailRegExp = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    if (!emailRegExp.test(emailId)) {
        $("#reg_email").val("");
        alert("Please enter a valid E-mail address");
        document.getElementById('reg_email').value = "";
        return regex.test(mobileNo);
    }
}

function onBlurMobileNo() {
    let mobileNo = $('#reg_mobile').val();
    if (mobileNo != "") {
        if (mobileNo.length == 10) {
            let regExpMobile = /^[6789]\d{9}$/;

            if (!regExpMobile.test(mobileNo)) {
                $("#reg_mobile").val("");
                alert("Please enter a valid 10 Digit Mobile Number");
                document.getElementById('reg_mobile').value = "";
                return regex.test(mobileNo);
            }

        } else {
            alert(" Mobile number should not be less than 10 digit");
            $('#reg_mobile').val("");
            $("#reg_mobile").focus();
            return false;
        }
    }
}

// multiplication table
const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

// permutation table
const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

// validates Aadhar number received as string
let cValidId = 0;

function validate(aadharNumber) {
    let invertedArray = aadharNumber.split('').map(Number).reverse()
    invertedArray.forEach((val, i) => {
        cValidId = d[cValidId][p[(i % 8)][val]]
    })
    return (cValidId === 0)
}

function onBlurPhotoIdNo() {
    var photoidtype = $("#photoidtype").val();
    if (photoidtype == "Adhaar") {
        $('#idnumber').attr("maxLength", 12);
        var objNo = document.getElementById("idnumber").value;
        if (objNo != "") {
            if (objNo.length == 12) {
                var regExp = /^\d{4}\d{4}\d{4}$/;

                if (objNo.match(regExp)) {
                    validate(objNo);
                    //console.log('222', cValidId);
                    if (cValidId != 0) {
                        objNo = "";
                        document.getElementById('idnumber').value = "";
                        alert("Please Enter Valid Aadhar Id.");
                        document.getElementById("idnumber").focus();
                        cValidId = 0;
                    }
                } else {
                    alert("Incorect Aadhar No.");
                    objNo = "";
                    document.getElementById('idnumber').value = "";
                    document.getElementById("idnumber").focus();
                    return false;
                }
            } else {
                alert(" Aadhar No. should be 12 digit");
                objNo = "";
                document.getElementById('idnumber').value = "";
                document.getElementById("idnumber").focus();
                return false;
            }
        }
    }

    if (photoidtype == "PAN card") {
        $('#idnumber').attr('maxLength', 10);
        let panCard = document.getElementById('idnumber').value;
        var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        if (!regex.test(panCard.toUpperCase())) {
            $(".idnumber").val("");
            alert("Please enter a valid 10 Digit PAN card No");
            document.getElementById('idnumber').value = "";
            return regex.test(panCard.toUpperCase());
        }
    }

    if (photoidtype == "driving") {
        $('#idnumber').attr('maxLength', 16);
        let drivingLicenseNo = document.getElementById('idnumber').value;
        let reglicnece = /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;

        if (!reglicnece.test(drivingLicenseNo.toUpperCase())) {
            $(".idnumber").val("");
            alert("Please enter a valid 16 Digit Driving Licence No");
            document.getElementById('idnumber').value = "";
            return reglicnece.test(drivingLicenseNo.toUpperCase());
        }
    }

    if (photoidtype == "passport") {
        $('#idnumber').attr('maxLength', 16);
        let passportNo = document.getElementById('idnumber').value;
        var patt = new RegExp("^([A-Z a-z]){1}([0-9]){7}$");;
        if (patt.test(passportNo)) {
            return true;
        } else {
            alert("Passport number is not valid");
        }
        return false;

    }
};


$(document).on('click', '.enam_mandi', function() {

    var regWithEnam = $(this).val();
    var regType = $('#regtype').val();
    var fpctypeT = $('#fpctypeT').val();
    var regLevel = $('input[name=registerlevel]:checked').val();
    if (regWithEnam == "E") {
        if (regType == "T" && fpctypeT == "TA" && regWithEnam == "E") {
            $('#mandi_trader').show();
        }

        if (regType == "T" && fpctypeT == "TA" && regWithEnam == "E" && regLevel == 'S') {
            $('#mandi_trader').show();
            $('#state_name').show();
            $('#apply_state').show();
            $('#register_label_s').hide();
            $('#registered_label_s').show();
            $('#register_label_m').hide();
            $('#registered_label_m').show();
        }
        if (regType == "T" && fpctypeT == "TA" && regWithEnam == "E" && regLevel == 'M') {
            $('#mandi_trader').show();
            $('#apply_state').show();
            $('#apply_apmc').show();
            $('#register_label_s').hide();
            $('#registered_label_s').show();
            $('#register_label_m').hide();
            $('#registered_label_m').show();
        }
        if (regType == "T" && fpctypeT == "TA" && regLevel == 'S' && regWithEnam == "N") {
            $('#register_label_s').show();
            $('#registered_label_s').hide();
        }

    } else {
        $('#mandi_trader').hide();
        $('#apply_state').hide();
        $('#apply_apmc').hide();
        $('#register_label_s').show();
        $('#registered_label_s').hide();
        $('#register_label_m').show();
        $('#registered_label_m').hide();
    }


});

$(document).on('click', '.reg_level', function() {
    var x = $(this).val();
    var regType = $('#regtype').val();
    var fpctypeT = $('#fpctypeT').val();
    var fpctypeP = $('#fpctypeP').val();
    var regWith = $('input[name=regiWithEnam]:checked').val();

    if (regType == "T" && fpctypeT == "TA" && x == "S") {
        if (regType == 'T' && fpctypeT == 'TA' && regWith == 'E' && x == 'S') {
            $('#mandi_trader').show();
            $('#apmc_name').show();
            $('#apply_apmc').hide();
            $('#register_label_s').hide();
            $('#registered_label_s').show();
            fetchUnifiedLicense();
        }
        if (regType == 'T' && fpctypeT == 'TA' && regWith == 'N' && x == 'S') {
            $('#registered_label_s').hide();
            $('#register_label_s').show();
            $('#state_name').show();
            $('#mandi_trader').hide();
            $('#apmc_name').hide();
            $('#apply_apmc').hide();
            $("#blockUnifiedLicense").hide();
            $('#unifiedLicenseTableLeft').find('tbody tr').remove();
            return;
        }

        $('#apply_state').show();
        $('#state_name').css('display', 'block');
        $('#apmc_name').hide();
        $('#apply_apmc').hide();
    }
    if (regType == 'T' && fpctypeT == 'TA' && regWith == 'N' && x == 'M') {
        $('#mandi_trader').hide();
        $('#apmc_name').hide();
        $('#apply_apmc').hide();
        $('#state_name').show();
        $('#registered_label_m').hide();
        $('#register_label_m').show();
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
    }

    if (regType == 'T' && fpctypeT == 'TA' && regWith == 'E' && x == 'M') {
        $('#mandi_trader').show();
        $('#apmc_name').show();
        $('#apply_apmc').show();
        $('#state_name').show();
        $('#apply_state').show();
        $('#registered_label_s').show();
        $('#register_label_s').hide();
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
        fetchUnifiedLicense();
        return;
    }

    if (x == 'M') {
        $('#state_name').css('display', 'block');
        $('#apmc_name').css('display', 'block');
        $('#mandi_trader').hide();
        $('#apply_state').hide();
        $('#apply_apmc').hide();
    } else {
        $('#apmc_name').css('display', 'none');
    }
    if (x == 'S') {
        $('#state_name').css('display', 'block');
    } else {
        $('#state_name').css('display', 'block');
        $('#apmc_name').css('display', 'block');
    }

    if (regType == "P" && fpctypeP == "LP" && x == "S") {
        $("#service_territory").show();
        $("#showTotalTurnover").show();
    }
    if (regType == "P" && fpctypeP == "LP" && x == "M") {
        $("#service_territory").hide();
        $("#showTotalTurnover").hide();
        $('#state_name').css('display', 'block');
        $('#apmc_name').css('display', 'block');
    }
});

$(document).on('change', '#regtype', function() {
    var x = $(this).val();
    if (x == 'F') {
        var regLevel = $('input[name=registerlevel]:checked').val();
        if (regLevel == 'M') {
            $('#state_name').show();
            $('#apmc_name').show();

        } else {
            $('#state_name').hide();
            $('#apmc_name').hide();
        }
        $('#state_level').hide();
        $('.statelevelspan').hide();
        $('.mydisplayboxfpcF').css('display', 'block');
        $('.mydisplayboxbuy').css('display', 'none');
        $('.mydisplayboxfpcSP').css('display', 'none');
        $('.apply_enam_mandi').hide();
        $('#apply_state').hide();
        $('#apply_apmc').hide();
        $('#mandi_trader').hide();
        $('.comname-div').hide();
        $('.companyreg-div').hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();
        $('.apmc_unilicenseno').hide();
        $('.lincno').show();
    } else if (x == 'T') {

        $('.comname-div').hide();
        $('.companyreg-div').hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        var regLevel = $('input[name=registerlevel]:checked').val();
        if (regLevel == 'M') {
            $('#state_name').show();
            $('#apmc_name').show();
        } else {
            $('#state_name').hide();
            $('#apmc_name').hide();
        }
        $('#state_level').show();
        $('.statelevelspan').show();
        $('.mydisplayboxbuy').css('display', 'block');
        $('.mydisplayboxfpcF	').css('display', 'none');
        $('.mydisplayboxfpcSP').css('display', 'none');
    } else if (x == 'P') {

        $('#state_level').show();
        $('.statelevelspan').show();
        $('.mydisplayboxfpcSP').css('display', 'block');
        $('.mydisplayboxfpcF').css('display', 'none');
        $('.mydisplayboxbuy').css('display', 'none');
        $('.apply_enam_mandi').hide();
        $('#apply_state').hide();
        $('#apply_apmc').hide();
        $('#mandi_trader').hide();
        $('.reg_level').prop('checked', false);
    } else {
        $('#state_level').show();
        $('.statelevelspan').show();
        $('.mydisplayboxfpcSP').css('display', 'none');
        $('.mydisplayboxfpcF').css('display', 'none');
        $('.mydisplayboxbuy').css('display', 'none');
        $('.apply_enam_mandi').hide();
        $('#apply_state').hide();
        $('#apply_apmc').hide();
        $('#mandi_trader').hide();
        $('.reg_level').prop('checked', false);
    }

    var fpctypeT = document.getElementById("fpctypeT").value;
    var fpctypeP = document.getElementById("fpctypeP").value;
    var regWith = $('input[name=regiWithEnam]:checked').val();

    if (fpctypeT == "TA" && x == "T") {
        document.getElementById("enamMandi").checked = false;
        document.getElementById("nonEnamMandi").checked = false;
        $(".apply_enam_mandi").show(300);

        $('.collectionbox').hide();
        $('#firm_div').show();
        $('.fortrader').show();

        $('.licence').show();
        $('.lincno').hide();
        $('.apmc_unilicenseno').show();
        $('.coregno').hide();
        $('#copname').hide();
        $('#compname').hide();
        $(".comname-div").show();
        $(".companyreg-div").show();
        $('#span_compregnoast').show();
        $(".apply_enam_mandi").show();
        $('.reg_level').prop('checked', false);
        $('#state_name').hide();
        $('#apmc_name').hide();
        $(".co-type").hide();
        $("#firmno").show();
        $("#compreg").hide();
        $(".firmname").show();

        $('#uploddocuments_div').show();
    } else {
        document.getElementById("enamMandi").checked = false;
        document.getElementById("nonEnamMandi").checked = false;
        $(".apply_enam_mandi").hide(200);
    }

    // Unified Table show and hide
    if ("TA" == fpctypeT == "TA" && x == "T" && regLevel == "S" && regWith == "E") {
        fetchUnifiedLicense();
    } else {
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
    }

    if (x == "P" && fpctypeP == "LP" && regLevel == "S") {
        $("#showServiceTerritory").show();
        $("#showTotalTurnover").show();
    } else {
        $("#showServiceTerritory").hide();
        $("#showTotalTurnover").hide();
    }

});

function checkAccNumberMatch() {
    var Account = $("#fpcBankAccount").val();
    var confirmAccount = $("#typeagainaccount").val();
    if (Account != confirmAccount)
        $("#typeagainaccount_error").html("Account Number do not match!");
    else
        $("#typeagainaccount_error").html("Account Number match.");
}

$(document).ready(function() {
    $("#typeagainaccount").keyup(checkAccNumberMatch);
});


function checkIfscNumberMatch() {
    var IFSC = $("#fpcIfsc").val();
    var confirmIFSC = $("#typeagainifsc").val();
    if (IFSC != confirmIFSC)
        $("#typeagainifsc_error").html("IFSC Code do not match!");
    else
        $("#typeagainifsc_error").html("IFSC Code match.");
}

$(document).ready(function() {
    $("#typeagainifsc").keyup(checkIfscNumberMatch);
});


$(document).on('click', '#ifsc-code', function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $("#typeagainifsc");
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

$(document).on('click', '#confirm-acc', function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $("#typeagainaccount");
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

//show hide
var regtype = document.getElementById("regtype").value;
var fpctypeF = document.getElementById("fpctypeF").value;
$(document).on('change', '#fpctypeF', function() {
    var x = $(this).val();
    var regtype = document.getElementById("regtype").value;
    $('#registration_category').val(x);
    $(".service-provider").hide();
    $(".upload_service").hide();
    $(".bank_details").show();
    $(".apply_enam_mandi").hide();
    if (x == "CR") {

        $("#estdate").show();
        $("#dodate").hide();
        $(".lincno").hide();
        $(".coregno").show();
        $(".apmc_unilicenseno").hide();

        $("#compname").hide();
        $("#copname").show();
        $(".licence").show();
        $(".co-type").show();
        $('.collectionbox').show();
        $('.comname-div').show();
        $('.companyreg-div').show();
        $("#compreg").hide();
        $("#iecno").hide();
        $("#firmno").show();
        $('.ogname-div').hide();
        $('.orgadd-div').show();
        $('#span_orgadd').hide();
        $('#span_cooperadd').show();
        $('#span_orgcin').hide();
        $('#span_orgregno').hide();
        $('#span_orgcinregno').hide();
        $('.orgcin-div').hide();
        $('.comp-certi').show();
        $('#pass_ast').show();
        $('#id_ast').show();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    } else {
        $(".co-type").hide();
        $("#dodate").show();
        $("#estdate").hide();
        $("#compreg").show();
        $("#compname").show();
        $("#copname").hide();
        $('.collectionbox').hide();
        $('.comp-certi').hide();
        $('#pass_ast').hide();
        $('#id_ast').hide();
    }

    if (regtype == 'F' && x == 'FF') {

        $('#dodate').show();
        $('#estdate').hide();
        $('.collectionbox').show();
        $('.licence').hide();
        $('.comname-div').hide();
        $('#span_compregnoast').hide();
        $(".companyreg-div").show();
        $("#compreg").show();
        $("#iecno").hide();
        $("#firmno").hide();
        $('.ogname-div').show();
        $('.orgadd-div').show();
        $('#span_orgregno').hide();
        $('#span_orgcin').hide();
        $('#span_orgcinregno').show();
        $('.orgcin-div').show();
        $(".co-type").hide();
        $('#span_orgadd').show();
        $('#span_cooperadd').hide();
        $('.comp-certi').show();
        $('#pass_ast').show();
        $('#id_ast').show();
        $('#fpo_div').show();
        $('.fpo-comp-reg').show();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (x == "IF") {

        $('.collectionbox').hide();
        $(".licence").hide();
        $('.comname-div').hide();
        $(".companyreg-div").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $(".co-type").hide();
        $('#dodate').show();
        $("#estdate").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    } else if (x == "FG") {
        $('.collectionbox').hide();
        $(".licence").hide();
        $('.comname-div').hide();
        $(".companyreg-div").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $(".co-type").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    } else if (x == "AG") {
        $('.collectionbox').hide();
        $(".licence").hide();
        $('.comname-div').hide();
        $(".companyreg-div").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $(".co-type").hide();
        $('#dodate').show();
        $("#estdate").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (regtype == "F" && x == "GA") {
        $('.collectionbox').hide();
        $(".licence").hide();
        $('.comname-div').hide();
        $(".companyreg-div").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $(".co-type").hide();
        $('#dodate').show();
        $("#estdate").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');
    }

    if (regType == "F" && x == "OT") {
        $('.collectionbox').hide();
        $(".licence").hide();
        $('.comname-div').hide();
        $(".companyreg-div").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $(".co-type").hide();
        $('#dodate').show();
        $("#estdate").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');
    }

    var regWith = $('input[name=regiWithEnam]:checked').val();
    var regLevel = $('input[name=registerlevel]:checked').val();

    if (fpctypeF == "TA" && regtype == "T" && regLevel == "S" && regWith == "E") {
        fetchUnifiedLicense();
    } else {
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
    }
});

$(document).on('change', '#fpctypeT', function() {
    var b = $(this).val();
    var regtype = document.getElementById("regtype").value;
    var fpctypeF = $('#fpctypeF').val();

    $('#registration_category').val(b);
    $(".service-provider").hide();
    $(".upload_service").hide();
    $(".bank_details").show();
    $('.collectionbox').hide();

    if (b == "TA") {
        $('.collectionbox').hide();
        $(".lincno").hide();
        $('.licence').show();
        $('.apmc_unilicenseno').show();
        $('.coregno').hide();
        $('#copname').hide();
        $('#compname').hide();
        $(".comname-div").show();
        $(".companyreg-div").show();
        $('#span_compregnoast').show();
        $(".apply_enam_mandi").show();
        $('.reg_level').prop('checked', false);
        $('#state_name').hide();
        $('#apmc_name').hide();
        $(".co-type").hide();
        $('.ogname-div').hide();

        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $("#firmno").show();
        $("#compreg").hide();
        $("#iecno").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();
        $('#firmno').show();
        $('.firmname').show();

        $('#firm_div').show();
        $('.fortrader').show();

        $('#basicdetail_div').show();
        $('#justBeforeEmail').css('display', 'block');
        $('#afterBeforeEmail').css('display', 'none');

        if ($('.enam_mandi').prop('checked')) {
            $('.enam_mandi').prop('checked', false);
        }

        $('.buyerCase').css('display', 'block');

    } else {
        $(".apply_enam_mandi").hide();
        $("#mandi_trader").hide();
        $("#apply_state").hide();
        $("#apply_apmc").hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');
    }

    if (regtype == "T" && b == "CO") {

        $('.reg_level').prop('checked', false);
        $('.licence').show();
        $(".lincno").hide();
        $(".coregno").show();
        $(".apmc_unilicenseno").hide();
        $(".co-type").show();
        $('.collectionbox').show();
        $('.comname-div').show();
        $('.companyreg-div').show();
        $('.ogname-div').hide();
        $('.orgadd-div').show();
        $('#span_orgadd').hide();
        $('#span_cooperadd').show();
        $('#span_orgcin').hide();
        $('#span_orgregno').hide();
        $('#span_orgcinregno').hide();
        $('.orgcin-div').hide();
        $('#dodate').hide();
        $("#estdate").show();
        $("#compname").hide();
        $("#copname").show();
        $("#compreg").hide();
        $("#iecno").hide();
        $("#firmno").show();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();
        $('#firm_div').hide();
        $("#firmno").show();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (b == "AG") {
        $('.collectionbox').hide();
        $(".companyreg-div").hide();
        $(".licence").hide();
        $(".comname-div").hide();
        $(".co-type").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (b == "CA") {
        $('.collectionbox').hide();
        $(".licence").show();
        $(".comname-div").show();
        $(".companyreg-div").show();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $(".co-type").hide();
        $(".lincno").show();
        $(".coregno").hide();
        $(".apmc_unilicenseno").hide();
        $("#compname").show();
        $("#copname").hide();
        $("#compreg").show();
        $("#iecno").hide();

        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (b == "GA") {
        $('.collectionbox').hide();
        $(".licence").show();
        $(".lincno").show();
        $(".coregno").hide();
        $(".apmc_unilicenseno").hide();
        $(".comname-div").show();
        $(".companyreg-div").show();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $(".co-type").hide();
        $("#firmno").hide();
        $("#compreg").show();
        $("#iecno").hide();
        $("#compname").show();
        $("#copname").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (b == "OT") {
        $('.collectionbox').hide();
        $(".licence").show();
        $(".lincno").show();
        $(".coregno").hide();
        $(".apmc_unilicenseno").hide();
        $(".comname-div").show();
        $(".companyreg-div").show();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $(".co-type").hide();
        $("#firmno").hide();
        $("#compreg").show();
        $("#iecno").hide();
        $("#compname").show();
        $("#copname").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();

        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');

    }

    if (regtype == 'T' && b == "EX") {
        $(".licence").hide();
        $(".comname-div").show();
        $('.companyreg-div').show();
        $("#iecno").show();
        var span_Text = document.getElementById("iecno").innerText;
        $('#company_reg').attr({ maxLength: 10, required: "required" });
        $("#compreg").hide();
        $("#firmno").hide();
        $(".co-type").hide();
        $('.ogname-div').hide();
        $('.orgadd-div').hide();
        $('.orgcin-div').hide();
        $('.collectionbox').hide();
        $('#dodate').show();
        $("#estdate").hide();
        $("#compname").show();
        $("#copname").hide();
        $('#fpo_div').hide();
        $('.fpo-comp-reg').hide();
        $('#firm_div').hide();
        $("#firmno").hide();
        $(".firmname").hide();
        $('.fortrader').hide();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');


    } else {
        $("#iecno").hide();
        $('#company_reg').removeAttr('maxLength required');
    }

    if (regtype == 'F' && fpctypeF == 'CO' || fpctypeF == "FF") {

    } else {

    }

    // Unified Table Show and hide  
    var regWith = $('input[name=regiWithEnam]:checked').val();
    var regLevel = $('input[name=registerlevel]:checked').val();

    if (b == "TA" && regtype == "T" && regLevel == "S" && regWith == "E") {
        fetchUnifiedLicense();
    } else {
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
    }
});

$(document).on('change', '#fpctypeP', function() {
    var fpctypeP = $(this).val();
    var uype = $("#utype").val();
    var regLevel = $('input[name=registerlevel]:checked').val();
    $('#registration_category').val(fpctypeP);
    var c = $("#registerlevel").val();
    $(".apply_enam_mandi").hide();
    if (fpctypeP == "HA" || fpctypeP == "LP" || fpctypeP == "LU" || fpctypeP == "GD" || fpctypeP == "WH" || fpctypeP == "CS" || fpctypeP == "PK" || fpctypeP == "QA" || fpctypeP == "OT") {

        $(".service-provider").show();
        $(".bank_details").hide();
        $(".upload_service").show();
        $("#service_territory").hide();
        $("#showTotalTurnover").hide();
        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');
    } else {

        $(".service-provider").hide();
        $(".bank_details").show();
        $(".upload_service").hide();
    }


    if (utype == "P" && fpctypeP == "LP" && regLevel == "S") {
        $("#service_territory").show();
        $("#showTotalTurnover").show();

        $('#justBeforeEmail').css('display', 'none');
        $('#afterBeforeEmail').css('display', 'block');
        $('.buyerCase').css('display', 'none');
    } else {
        $("#service_territory").hide();
        $("#showTotalTurnover").hide();
        $('#state_name').show();
        $('#apmc_name').show();
    }

});

$(document).on('change', '.commo_type', function() {
    var stateId = $('#regstate').val();
    var selectVal = $('input[name=commoType]:checked').val();

    $('#notifyDeNotify').val(selectVal);

    if (stateId == 0) {

    } else {
        $.ajax({
            url: baseUrl + 'Enam_ctrl/checkNotifyDenotify',
            method: 'POST',
            dataType: 'json',
            data: {
                stateId: stateId
            },
            success: function(response) {
                $.each(response, function(key, value) {
                    //console.log('====>>', value);
                    let resId = value.state_id;

                    if (resId === stateId) {
                        if (selectVal == 'D') {
                            if (value.denotified_commodity === 'Yes') {
                                $('.oncommo').css('display', 'block');
                            } else {
                                $('.oncommo').css('display', 'none');
                            }
                        } else if (selectVal == 'N') {
                            if (value.notified_commodity === 'Yes') {
                                $('.oncommo').css('display', 'block');
                            } else {
                                $('.oncommo').css('display', 'none');
                            }
                        } else if (selectVal == 'B') {
                            if (value.denotified_commodity === 'Yes' || value.notified_commodity === 'Yes') {
                                $('.oncommo').css('display', 'block');
                            } else {
                                $('.oncommo').css('display', 'none');
                            }
                        }
                    }
                });
            }
        })
    }
});

//for trader no validation

$('#unified_license').blur(function() {
    let traderId = $(this).val();
    let pattern = /[_~\-!@#\$%\^&'"\*\(\ )]+$/;
    if (pattern.test(traderId) || traderId == 0 || traderId == 'null') {
        alert('Empty or special characters not allowed');
        $('#unified_license').val('');
    } else {

    }
});


document.getElementById('idnumber').maxLength = 16;

function changeValue(dropdown) {
    var option = dropdown.options[dropdown.selectedIndex].value,
        field = document.getElementById('idnumber');
    if (option == 'Adhaar') {
        field.value = '';
        field.maxLength = 12;
        var letters = /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/;
        if (field.value.match(letters)) {
            // document.registration.zip.focus();
            return true;
        } else {
            $('#idnumber_error').append('Adhaar number must have alphanumeric characters only');
            field.focus();
            return false;
        }
    } else if (option == 'PAN card') {
        field.value = '';
        field.maxLength = 10;
    } else if (option == 'ration') {
        field.value = '';
        field.maxLength = 10;
    } else if (option == 'driving') {
        field.value = '';
        field.maxLength = 16;
    } else if (option == 'voter') {
        field.value = '';
        field.maxLength = 10;
    } else if (option == 'passport') {
        field.value = '';
        // field.value = field.value.substr(0, 2); // before reducing the maxlength, make sure it contains at most two characters; you could also reset the value altogether
        field.maxLength = 9;
    }
}

function myAgeValidation(dob_value) {
    // alert("Inside myAgeValidation dob_value => "+dob_value);
    var lre = /^\s*/;
    var datemsg = "";

    var inputDate = dob_value;
    // alert("myAgeValidation inputDate0 = "+inputDate);
    inputDate = inputDate.replace(lre, "");
    // alert("myAgeValidation inputDate = "+inputDate);

    datemsg = isValidDate(inputDate);
    var result;
    if (datemsg != "") {
        //   alert(datemsg);
        return;
    } else {
        //Now find the Age based on the Birth Date
        result = getAge(new Date(inputDate));

    }
    // alert("myAgeValidation result => "+result);
    return result;
}

function getAge(birth) {

    var today = new Date();
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();

    var birthyear = birth.getFullYear();
    var birthmonth = birth.getMonth();
    var birthday = birth.getDate();

    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;

    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        age = parseInt(age) - 1;
    }
    // alert(age);

    if ((age == 18 && age_month <= 0 && age_day <= 0) || age < 18) {
        //  alert("You are under 18");

        return true;
    } else {
        // alert("You have crossed your 18th birthday !");
        return false;
    }

}

function isValidDate(dateStr) {

    var msg = "";
    // Checks for the following valid date formats:
    // MM/DD/YY   MM/DD/YYYY   MM-DD-YY   MM-DD-YYYY
    // Also separates date into month, day, and year variables

    // To require a 2 & 4 digit year entry, use this line instead:
    //var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{2}|\d{4})$/;
    // To require a 4 digit year entry, use this line instead:
    var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/;

    var matchArray = dateStr.match(datePat); // is the format ok?
    if (matchArray == null) {
        msg = "Date is not in a valid format.";
        return msg;
    }

    month = matchArray[1]; // parse date into variables
    day = matchArray[3];
    year = matchArray[4];


    if (month < 1 || month > 12) { // check month range
        msg = "Month must be between 1 and 12.";
        return msg;
    }

    if (day < 1 || day > 31) {
        msg = "Day must be between 1 and 31.";
        return msg;
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        msg = "Month " + month + " doesn't have 31 days!";
        return msg;
    }

    if (month == 2) { // check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            msg = "February " + year + " doesn't have " + day + " days!";
            return msg;
        }
    }

    if (day.charAt(0) == '0') day = day.charAt(1);

    //Incase you need the value in CCYYMMDD format in your server program
    //msg = (parseInt(year,10) * 10000) + (parseInt(month,10) * 100) + parseInt(day,10);

    return msg; // date is valid
}



function onApplyStateChange() {

    var applystateId = $("#applystate").val().substr(3);
    var applystateIdInteger = applystateId.substring(0, applystateId.indexOf("-"));
    dyanamicStateChange(applystateIdInteger, 1);
    var fpctypeT = $("#fpctypeT").val();
    var utype = $("#regtype").val();
    var state = $("#state_level").val();
    var enamMandi = $("#enamMandi").val();

    if (fpctypeT == "TA" && utype == "T" && state == "S" && enamMandi == "E") {
        fetchUnifiedLicense();
    } else {
        $("#blockUnifiedLicense").hide();
        $('#unifiedLicenseTableLeft').find('tbody tr').remove();
    }

}


function readFile(id, input) {
    var FileSize = input.files[0].size / 1024 / 1024; // in MB
    if (FileSize > 2) {
        alert('Can not be greater then 2 MB File size');
        $(input).val(''); //for clearing with Jquery
    } else {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#" + id).val(e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        };
    }
};


function fetchUnifiedLicense(dynamicStateid, status) {
    var fpctypeT = $("#fpctypeT").val();
    var utype = $("#regtype").val();
    // var state  = $("#state_level").val(); 
    // var mandi  = $("#mandi_level").val(); 
    var regLevel = $('input[name=registerlevel]:checked').val();
    var enamMandi = $("#enamMandi").val();

    unifiedLicenseList = [];
    var applystateId = $("#applystate").val();
    var web = "";
    var webAS = "";
    var res = applystateId.split("-");
    for (var i = 0; i < res.length; i++) {
        if (i == 1) {
            web = res[i];
        }
    }
    var stateoprId = web;
    //alert(stateoprId);
    var contentType = "application/x-www-form-urlencoded; charset=utf-8";

    if (window.XDomainRequest)
        contentType = "text/plain";
    $.ajax({
        data: {
            "orgId": "1",
            "oprId": "" + stateoprId,
            "regLevel": regLevel
        },
        dataType: "json",
        url: "https://enam.gov.in/NamWebSrv/rest/UnifiedLiecense/UnifiedLiecenseList",
        type: "POST",
        contentType: contentType,
        success: function(data) {
            console.log('--------,,', data);
            $("#blockUnifiedLicense").show();
            if (utype == "T" && fpctypeT == "TA" && regLevel == "S" && enamMandi == "E") {
                console.log('vice versa');
                $('#apmc_license').hide();
                $('#state_unified').show();
            } else if (utype == "T" && fpctypeT == "TA" && regLevel == "M" && enamMandi == "E") {
                console.log('if every value is right')
                $('#apmc_license').show();
                $('#state_unified').hide();
            }

            if ("S" == data.statusMsg) { // message statusMsg 
                unifiedLicenseList = data.listUnifiedLicenceDocumentList;
                $('#unifiedLicenseTableLeft').find('tbody tr').remove();
                $('#unifiedLicenseTableLeft tbody').append('<tr><th style="background:#bfc5c3;text-align:center;">Sr. No.</th><th style="background:#bfc5c3;text-align:center;">Document Name</th><th style="background:#bfc5c3;text-align:center;">Upload</th><th style="background:#bfc5c3;text-align:center;">Sr. No.</th><th style="background:#bfc5c3;text-align:center;">Application Fee</th></tr>');

                for (var i = 0; i < unifiedLicenseList.length; i++) {
                    if (unifiedLicenseList[i].srNo != "") {
                        $('#unifiedLicenseTableLeft tbody').append('<tr>' + '<td style="text-align:center;">' + unifiedLicenseList[i].srNo + '</td>' + '<td>' + unifiedLicenseList[i].documentName + '</td>' + '<td>' + '<input type="file" class="form-control" onchange="readFile(' + '\'fileDoc_' + unifiedLicenseList[i].srNo + '\',this);" id="fileUpload_' + unifiedLicenseList[i].srNo + '"><input type="hidden" value="" id="fileDoc_' + unifiedLicenseList[i].srNo + '"' + 'name="fileDoc_' + unifiedLicenseList[i].srNo + '" />' + '</td>' + '<td style="text-align:center;">' + unifiedLicenseList[i].applicationFeesSrNo + '</td>' + '<td>' + unifiedLicenseList[i].applicationFees + '</td>' + '</tr>');
                    }

                }

            } else {
                $('#unifiedLicenseTableLeft').find('tbody tr').remove();
                // $('#unifiedLicenseTableRight').find('tbody tr').remove();
                $("#blockUnifiedLicense").hide();
            }
        }
    });
}


function dyanamicStateChange(dynamicStateid, status) {

    usStates = [];
    var stateoprId = $("#regstate").val().substr(3);
    var dropboxforApmc = document.getElementById("reg_with");
    //var stateoprId = document.getElementById("mandistate").value; 
    var settings = {
        "url": restUrl + "rest/Commodity/getApmc",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "SERVERID=node2"
        },
        "data": {
            "oprId": "" + status == 1 ? dynamicStateid : stateoprId
        }
    };

    $.ajax(settings).done(function(response) {

        console.log('getAPMC data to checkkk', response);

        var interestDiv = document.getElementById("interest");
        if (status == 1) {
            usStates = response.listApmc;

            $('.dropdown-container-chk ul').find('li').remove();
            $('.quantity').text('Any');


            var stateTemplate = _.template(
                '<li>' +
                '<input name="multiApmcIds"   value="<%= adoum_opr_id %>"  type="checkbox">' +
                '<label for="<%= adoum_opr_id %>"><%= adoum_oprname %></label>' +
                '</li>'
            );

            // Populate list with states
            _.each(usStates, function(s) {
                $('.dropdown-container-chk ul').append(stateTemplate(s));
            });

        } else {

            var $select = $('#reg_with');
            $select.find('option').remove();

            var el1 = document.createElement("option");
            el1.textContent = "-Select-";
            el1.value = "-select-";
            dropboxforApmc.appendChild(el1);
        }


        for (var i = 0; i < response.listApmc.length; i++) {
            var val = response.listApmc[i].adoum_opr_id + "-" + response.listApmc[i].adoum_oprname;
            var applyApmcVal = response.listApmc[i].adoum_opr_id;
            var str = response.listApmc[i].adoum_oprname;

            if (status == 1) {
                var input = document.createElement("input");
                input.type = "checkbox";
                input.name = "interest";
                input.id = applyApmcVal;
                input.value = applyApmcVal;
                var newlabel = document.createElement("label");
                newlabel.setAttribute("for", applyApmcVal);
                newlabel.innerHTML = str;

            } else {

                var el = document.createElement("option");
                el.textContent = str;
                el.value = val;
                dropboxforApmc.appendChild(el);

            }

        }
    });
}

function isUndefinedOrNull(value) {
    return (value === undefined || value === null || value === "" || value === "null" || value === "undefined");
};

function validateUnifiedTrader() {

    var stateoprId = $("#regstate").val();
    var apmcnameId = $("#reg_with").val();
    var unifiedLicenseNo = $("#trader_id").val();
    var fpctypeT = $("#fpctypeT").val();
    var utype = $("#regtype").val();

    var registerLevel = null;
    var oprIdLevel = null;
    if (document.getElementById("state_level").checked == true) {
        registerLevel = 'S';
        if ("-select-" == stateoprId) {
            alert("Please Select State");
            document.getElementById("regstate").focus();
            return;
        }
    } else {
        registerLevel = 'M';

    }

    if (unifiedLicenseNo.trim().length > 0) {
        if (document.getElementById("state_level").checked == true) {
            oprIdLevel = stateoprId.split("-")[1];
        } else {
            oprIdLevel = apmcnameId.split("-")[0];
        }

        var contentType = "application/x-www-form-urlencoded; charset=utf-8";
        if ("TA" == fpctypeT.trim() && "T" == utype.trim()) { // && 
            if (document.getElementById("enamMandi").checked == true) {
                if (window.XDomainRequest)
                    contentType = "text/plain";
                $.ajax({
                    data: {

                        "traderloginId": "" + unifiedLicenseNo
                    },
                    dataType: "json",
                    url: "https://enam.gov.in/NamWebSrv/rest/validateTrader",
                    type: "POST",
                    contentType: contentType,
                    success: function(data) {

                        console.log('after enter trader-id', data);
                        if ("F" == data.statusMsg) {
                            alert(data.failMsg);
                        } else {
                            $('#reg_fname').val(data.lcam_full_name.split(" ")[0]);
                            $('#reg_mname').val(data.lcam_full_name.split(" ")[1]);
                            $('#reg_lname').val(data.lcam_full_name.split(" ")[2]);
                            //$('#reg_gender').val(data.lcam_gender);
                            $('#reg_street').val(data.lcam_agen_add1 + " " + data.lcam_agen_add2);
                            $('#reg_dob').val(data.lcam_dob);
                            $('#stateId').val(data.lcam_agen_state_id);
                            $('#reg_pin').val(data.lcam_agen_pincd);

                            $('#idnumber').val(data.lcam_photo_number);
                            $('#reg_mobile').val(data.lcam_agen_contno);
                            $('#reg_email').val(data.lcam_agen_emailid);
                            $('#fpcBank').val(data.lcam_bank_name);
                            $('#fpcBankAccountName').val(data.lcam_bank_achname);
                            $('#fpcBankAccount').val(data.lcam_bank_account);
                            $('#fpcIfsc').val(data.lcam_ifsc_code);
                            $('#typeagainaccount').val(data.lcam_bank_account);
                            $('#typeagainifsc').val(data.lcam_ifsc_code);
                            $('#company_name').val(data.lcam_agen_comp_name);
                            $('#company_reg').val(data.lcam_agen_comp_registerno);
                            $('#unified_license').val(data.lcam_agen_trad_licenno);


                            $('select[id = "photoidtype"] option[value = "' + data.lcam_photo_id + '"]').attr("selected", "selected");
                            $('select[id = "reg_gender"] option[value="' + data.lcam_gender + '"]').attr("selected", "selected");
                            $('select[id = "add_state"] option[value="' + data.lcam_agen_state_id + '"]').attr("selected", "selected");
                            $('select[id = "add_district"] option[value="' + data.gmdm_dist_cd + '"]').attr("selected", "selected");
                            if (data.lcam_photo_id = "PAN CARD") {

                                $('select[id = "photoidtype"] option[value="PAN card"]').attr("selected", "selected");
                            }
                            // $('select[id = "add_tehsil"] option[value="'+ data.gmtm_tahsil_id +'"]').attr("selected", "selected");
                            // $('select[id = "add_tehsil"] option[value="'+ data.gmtm_tahsil_id +'"]').attr("selected", "selected");


                            setDistrictTahsil(data.lcam_agen_state_id, data.gmdm_dist_id, data.gmtm_tahsil_id);
                        }

                    }
                });
            }

        }
    }
    //});

}

function setDistrictTahsil(stateId, districtId, tahsilId) {
    console.log(`The stateId is ${stateId}----${districtId} -----${tahsilId}`)
        // fetch api Farmer District
    var dropboxforDistrict = document.getElementById("add_district");
    $('#add_district').empty().append('<option value="">-select-</option>');
    var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest)
        contentType = "text/plain";
    $.ajax({

        url: restUrl + 'rest/MastersUpdate/getFarmerDistrict',
        type: 'POST',
        data: {
            'stateId': stateId
        },
        dataType: 'json',
        contentType: contentType,
        success: function(data) {
            console.log('when district api call', data);
            for (var i = 0; i < data.districtList.length; i++) {
                var val = data.districtList[i].districtId;
                var str = data.districtList[i].districtName;
                var el = document.createElement("option");
                el.textContent = str;
                el.value = val;

                dropboxforDistrict.appendChild(el);
            }

            document.getElementById("add_district").value = isUndefinedOrNull(districtId) ? "-select-" : districtId;
            // fetch api Farmer Tahsil

            var dropboxforTahsil = document.getElementById("add_tehsil");
            $('#add_tehsil').empty().append('<option value="">-Select-</option>');
            var contentType = "application/x-www-form-urlencoded; charset=utf-8";
            if (window.XDomainRequest)
                contentType = "text/plain";
            $.ajax({
                type: 'POST',
                url: restUrl + 'rest/MastersUpdate/getFarmerTahsil',
                dataType: 'json',
                data: {
                    'districtId': districtId
                },
                success: function(data) {
                    console.log('after hit trader district-id', data);
                    for (var i = 0; i < data.tahsilList.length; i++) {
                        var val = data.tahsilList[i].tahsilId;
                        var str = data.tahsilList[i].tahsilName;
                        var el = document.createElement("option");
                        el.textContent = str;
                        el.value = val;

                        dropboxforTahsil.appendChild(el);
                    }
                    document.getElementById("add_tehsil").value = isUndefinedOrNull(tahsilId) ? "-select-" : tahsilId;


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("You can not send Cross Domain AJAX requests Apply State: " + errorThrown);
                }
            });


            var dropboxforVillage = document.getElementById("add_village");
            $('#add_village').empty().append('<option value="">-Select-</option>');
            var stateIdT = $('#add_state').val();
            var districtIdT = $('#add_district').val();
            var tahshilIdT = $('#add_tehsil').val();
            var contentType = "application/x-www-form-urlencoded; charset=utf-8";
            if (window.XDomainRequest)
                contentType = "text/plain";
            $.ajax({
                type: 'POST',
                url: restUrl + 'rest/MastersUpdate/getFarmerCity',
                dataType: 'json',
                data: {
                    'stateId': stateIdT,
                    'districtId': districtIdT,
                    'tahsilId': tahshilIdT
                },
                success: function(data) {
                    console.log('after hit trader district00000-id', data);
                    for (var i = 0; i < data.cityList.length; i++) {
                        var val = data.cityList[i].cityId;
                        var str = data.cityList[i].cityName;
                        var el = document.createElement("option");
                        el.textContent = str;
                        el.value = val;

                        dropboxforVillage.appendChild(el);
                    }
                    document.getElementById("add_village").value = isUndefinedOrNull(cityId) ? "-select-" : cityId;


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("You can not send Cross Domain AJAX requests Apply State: " + errorThrown);
                }
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("You can not send Cross Domain AJAX requests Apply District: " + errorThrown);
        }
    });
};


function loadFile(input) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {

        //get the file size and file type from file input field
        var fsize = $('#uploadBtn_passbook')[0].files[0].size;
        if (fsize > 1075576) //do something if file size more than 1 mb (1048576)
        {
            alert("The file is too large. Allowed maximum size is 1 MB.");
            $("#uploadBtn_passbook").val("");
            $("#passbookImage").val("");
        }
    } else {
        alert("Please upgrade your browser, because your current browser lacks some new features we need!");
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            //alert(e.target.result);
            $('#passbookImage').attr('src', e.target.result);
            $('#base64_passbook').val(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function loadIdProofFile(input) {
    //check whether browser fully supports all File API 
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //get the file size and file type from file input field
        var fsize = $('#uploadBtn_proof')[0].files[0].size;

        if (fsize > 1075576) //do something if file size more than 1 mb (1048576)
        {
            alert("The file is too large. Allowed maximum size is 1 MB.");

            $("#uploadBtn_proof").val("");
            $("#idProofImage").val("");
        }
        // else
        // {
        //   alert(fsize +" bites\nYou are good to go!");
        // }
    } else {
        alert("Please upgrade your browser, because your current browser lacks some new features we need!");
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#idProofImage').attr('src', e.target.result);
            $('#base64_idproof').val(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}


function loadCompanyCertificateFile(input) {
    //check whether browser fully supports all File API 
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //get the file size and file type from file input field
        var fsize = $('#company_certificate')[0].files[0].size;

        if (fsize > 1075576) //do something if file size more than 1 mb (1048576)
        {
            alert("The file is too large. Allowed maximum size is 1 MB.");

            $("#company_certificate").val("");
            $("#companyImage").val("");
        }

    } else {
        alert("Please upgrade your browser, because your current browser lacks some new features we need!");
    }

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#companyImage').attr('src', e.target.result);
            $('#base64_certificate').val(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function toCheckSpecialChars(evt) {
    var charArr = ['!', '@', '#', '$', '%', '^', '&', '*', ')', '(', '+', '=', '.', '_', '-'];
    const isInArray = charArr.includes(evt.key);
    if (isInArray) {
        return false;
    }
    return true;
}