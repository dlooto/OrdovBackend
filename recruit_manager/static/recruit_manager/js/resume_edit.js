var resume_id = -1
var experience_id = -1
var on_experience_add = false
var exp_map = {}
$(document).ready(function() {
    resume_basic_op(readonly=true)
    // get the resume id from the original url
    // TODO: not so strong here
    var component=(window.location.href.split("/"))
    resume_id = component[5]
    //console.log("id", resume_id)
    get_resume_basic()
    get_resume_experience()
    show_one_experience(-1)
});

$(document).on('click', '#resume_basic_edit_button', function() {
    resume_basic_op(false)
    get_resume_basic()
    // ajax to get the resume info
});

function show_one_experience(exp_id) {
    $.each(exp_map, function(key, value){
        if (key == exp_id) {
          $(value).css('display', 'inline')
        } else {
          $(value).css('display', 'none')
        }
    })
    if (exp_id != -1) {
        on_experience_add = false
    }
}

function get_resume_basic() {
    $.ajax({
        url: '/api/resumes/' + resume_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log(response)
            //console.log(response.email)
           gender = '男'
           if (response.gender == 'f') {
               gender = '女'
           }
           $('#resume_basic_name').val(response.username)
           $('#resume_basic_gendor').val(gender)
           $('#resume_basic_birth_time').val("")
           $('#resume_basic_work_time').val("")
           $('#resume_basic_birth_place').val(response.birthorigin)
           $('#resume_basic_current_place').val("xiaoming")
           $('#resume_basic_phone').val(response.phone_number)
           $('#resume_basic_email').val(response.email)
           $('#resume_basic_role').val()
        },
        error: function() {
            console.log("Fail to get resume info of ", resume_id)
        }
    })
}

function clean_resume_experience_edit(exp_id) {
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_start' + exp_id).val("")
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_end' + exp_id).val("")
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_company_name' + exp_id).val("")
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_post_name' + exp_id).val("")
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_description' + exp_id).val("")
    $('form[class="resume_experience_item_edit"][id=' + exp_id + '] #experience_salary' + exp_id).val("")
}

function gen_resume_experience_edit(exp_id) {
    return '<form class="resume_experience_item_edit" id=' + exp_id + '>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">开始时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="start" id=experience_start' + exp_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">结束时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="end" id=experience_end' + exp_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">公司名</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="company_name" id=experience_company_name' + exp_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">职位名</span> ' +
            '</div>' +
            '<input type="text" class="form-control" name="post_name" id=experience_post_name' + exp_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">职责</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="duty" id=experience_duty' + exp_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">薪水</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="salary" id=experience_salary' + exp_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-12 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">描述</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="description" id=experience_description' + exp_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6">' +
            '<button type="button" class="experience_save" id=' + exp_id + '>' +
              '确定' +
            '</button>' +
          '</div>' +
          '<div class="col-md-6">' +
            '<button type="button" class="experience_cancel" id=' + exp_id + '>' +
              '取消' +
            '</button>' +
          '</div>' +
        '</div>' +
        '</form>'
}

function get_resume_experience_one(exp_id) {
    $.ajax({
        url: '/api/experiences/' + exp_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("get experience successfully ", response)
            // Should update the experience item here
            $('div[class="resume_experience_item"][id=' + exp_id + ']' + ' .interval').text(response.start + ' -- ' + response.end)
            $('div[class="resume_experience_item"][id=' + exp_id + ']' + ' .company_name').text(response.company_name)
            $('div[class="resume_experience_item"][id=' + exp_id + ']' + ' .post_name').text(response.post_name)
        },
        error: function() {
            console.log("Fail to get resume info of ", resume_id)
        }
    })
}

function get_resume_experience() {
    //console.log('/api/experiences/?resume_id=' + resume_id)
    $.ajax({
        // Keep the standard restful API here
        url: '/api/experiences/?resume_id=' + resume_id,
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log(response)
            $.each(response.results, function(index, ele) {
                //console.log("exp.end:", ele.end, " company:", ele.company_name, " ele.id:", ele.id)
                // check if the item has been added
                if (exp_map[ele.id]) {
                    //console.log(ele.id, " item has beed added, skip it")
                    return
                }
                $('#resume_experience_show').append(
                    '<div class="resume_experience_item" id=' + ele.id + '>' +
                    '<div class="row">' +
                      '<div class="col-md-3 interval" >' +
                        ele.start + ' -- ' + ele.end +
                      '</div>' +
                      '<div class="col-md-4 company_name">' +
                        ele.company_name +
                      '</div>' +
                      '<div class="col-md-4 post_name">' +
                        ele.post_name +
                      '</div>' +
                      '<div class="col-md-1">' +
                        '<i class="fas fa-edit resume_experience_edit_button" id=' + ele.id + ' style=""></i>' +
                      '</div>' +
                    '</div>' +
                    '</div>'

                )
                $('#resume_experience_show').append(
                    gen_resume_experience_edit(ele.id)
                )
                clean_resume_experience_edit(ele.id)
                // step1: set the basic value
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_start' + ele.id).val(ele.start)
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_end' + ele.id).val(ele.end)
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_company_name' + ele.id).val(ele.company_name)
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_post_name' + ele.id).val(ele.post_name)
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_description' + ele.id).val(ele.experience_description)
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_salary' + ele.id).val(ele.salary)
                //$('form[class="resume_experience_item_edit"][id=' + ele.id + ']').css('display', 'none')

                exp_map[ele.id]='form[class="resume_experience_item_edit"][id=' + ele.id + ']'
                $(exp_map[ele.id]).css('display', 'none')

                // step2: set the timepicker
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_start' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
                $('form[class="resume_experience_item_edit"][id=' + ele.id + '] #experience_end' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
            })
        },
        error: function() {
           console.log("Fail to get the experience of ", resume_id)
        }
    })
}

$(document).on('click', '#resume_basic_edit_cancel', function() {
    resume_basic_op(readonly=true)
});

$(document).on('click', '#resume_basic_edit_confirm', function() {
});

$(document).on('click', '#resume_basic_edit_button_down', function() {
   $('#resume_basic_show').css('display', 'none')
   $('#resume_basic_edit_button_up').css('display', 'inline')
   $('#resume_basic_edit_button_down').css('display', 'none')
});

$(document).on('click', '#resume_basic_edit_button_up', function() {
   $('#resume_basic_show').css('display', 'inline')
   $('#resume_basic_edit_button_up').css('display', 'none')
   $('#resume_basic_edit_button_down').css('display', 'inline')
});

function resume_basic_op(readonly) {
    if (readonly) {
        $('#resume_basic_name').attr('readonly', true)
        $('#resume_basic_gendor').attr('readonly', true)
        $('#resume_basic_birth_time').attr('readonly', true)
        $('#resume_basic_work_time').attr('readonly', true)
        $('#resume_basic_birth_place').attr('readonly', true)
        $('#resume_basic_current_place').attr('readonly', true)
        $('#resume_basic_phone').attr('readonly', true)
        $('#resume_basic_email').attr('readonly', true)
        $('#resume_basic_role').attr('readonly', true)
        $('#resume_basic_edit_confirm').css('display', 'none')
        $('#resume_basic_edit_cancel').css('display', 'none')
    } else {
        $('#resume_basic_name').attr('readonly', false)
        $('#resume_basic_gendor').attr('readonly', false)
        $('#resume_basic_birth_time').attr('readonly', false)
        $('#resume_basic_work_time').attr('readonly', false)
        $('#resume_basic_birth_place').attr('readonly', false)
        $('#resume_basic_current_place').attr('readonly', false)
        $('#resume_basic_phone').attr('readonly', false)
        $('#resume_basic_email').attr('readonly', false)
        $('#resume_basic_role').attr('readonly', false)
        $('#resume_basic_edit_confirm').css('display', 'inline')
        $('#resume_basic_edit_cancel').css('display', 'inline')
    }
}

$(document).on('click', '.resume_experience_edit_button', function() {
   var id = Number(this.id)
   console.log('[class="resume_experience_item_edit"][id=' + id + ']')
   // get the specified resume_id/experience_id info
   // Attention: the and logic for jquery
   show_one_experience(id)
   $('form[class="resume_experience_item_edit"][id=' + id + ']').show()
});

$(document).on('click', '.resume_experience_item_edit .experience_save', function() {
    var id= Number(this.id)
    console.log("logged to id:", id)
    // update the resume info
    console.log("serialize: ", $('form[class="resume_experience_item_edit"][id=' + id + ']').serialize())
    if (id > 0) {
        $.ajax({
            url: '/api/experiences/' + id + '/',
            async: false,
            type: 'PUT',
            data: $('form[class="resume_experience_item_edit"][id=' + id + ']').serialize(),
            success: function(data, textStatus, jqXHR) {
                console.log("success ", data)
                console.log("success ", jqXHR.responseText)
                console.log("success ", jqXHR.status)
                console.log("success ", jqXHR.readState)
                console.log("success ", jqXHR.statusText)
			},
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                console.log(jqXHR.status);
                console.log(jqXHR.readyState);
                console.log(jqXHR.statusText);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    } else if (id < 0) {
        // the a new item for resume
        var fields = $('form[class="resume_experience_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        console.log("add new items:", fields)
        $.ajax({
            url: '/api/experiences/',
            type: 'POST',
            async: false,
            data: fields,
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                console.log(jqXHR.status);
                console.log(jqXHR.readyState);
                console.log(jqXHR.statusText);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    } else if (id < 0) {
        // the a new item for resume
        var fields = $('form[class="resume_experience_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        console.log("add new items:", fields)
        $.ajax({
            url: '/api/experiences/',
            type: 'POST',
            async: false,
        });
    }
    show_one_experience(-2) // collapse all the items
    get_resume_experience_one(id)
    get_resume_experience()
});
$(document).on('click', '.resume_experience_item_edit .experience_cancel', function() {
    var id= Number(this.id)
    $('form[class="resume_experience_item_edit"][id=' + id + ']').css('display','none')
});

$(document).on('click', '#resume_experience_add_button', function() {
    console.log("on_experience_add: ", on_experience_add)
    if (!on_experience_add) {
        if (!exp_map[-1])  {
            $('#resume_experience_show').append(
                gen_resume_experience_edit(-1)
            )
            exp_map[-1]='form[class="resume_experience_item_edit"][id=-1]'
        }
        show_one_experience(-1)
        clean_resume_experience_edit(-1)
        $('form[class="resume_experience_item_edit"][id=-1] #experience_start-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
        $('form[class="resume_experience_item_edit"][id=-1] #experience_end-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
    }
    on_experience_add = true
});

$(document).on('click', 'form[class="resume_experience_item_edit"][id=-1]', function() {
    on_experience_add = false
});

