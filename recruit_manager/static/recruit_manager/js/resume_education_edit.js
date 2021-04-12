var resume_id = -1
var education_id = -1
var on_education_add = false
var edu_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    // TODO: not so strong here
    var component=(window.location.href.split("/"))
    resume_id = component[5]
    console.log("id", resume_id)
    get_resume_education()
    show_one_education(-1)
});

function show_one_education(edu_id) {
    $.each(edu_map, function(key, value){
        if (key == edu_id) {
          $(value).css('display', 'inline')
        } else {
          $(value).css('display', 'none')
        }
    })
    if (edu_id != -1) {
        on_education_add = false
    }

}

function clean_resume_education_edit(edu_id) {
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_start' + edu_id).val("")
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_end' + edu_id).val("")
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_school' + edu_id).val("")
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_college' + edu_id).val("")
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_degree' + edu_id).val("")
    $('form[class="resume_education_item_edit"][id=' + edu_id + '] #education_major' + edu_id).val("")
}

function gen_resume_education_edit(edu_id) {
    return '<form class="resume_education_item_edit" id=' + edu_id + '>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">开始时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="start" id=education_start' + edu_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">结束时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="end" id=education_end' + edu_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">学校</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="school" id=education_school' + edu_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">学院</span> ' +
            '</div>' +
            '<input type="text" class="form-control" name="college" id=education_college' + edu_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">专业</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="major" id=education_major' + edu_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">学位</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="degree" id=education_degree' + edu_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-12 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">描述</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="description" id=education_description' + edu_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6">' +
            '<button type="button" class="education_save" id=' + edu_id + '>' +
              '确定' +
            '</button>' +
          '</div>' +
          '<div class="col-md-6">' +
            '<button type="button" class="education_cancel" id=' + edu_id + '>' +
              '取消' +
            '</button>' +
          '</div>' +
        '</div>' +
        '</form>'
}

function get_resume_education_one(edu_id) {
    $.ajax({
        url: '/api/educations/' + edu_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            console.log("get education successfully ", response)
            // Should update the education item here
            $('div[class="resume_education_item"][id=' + edu_id + ']' + ' .interval').text(response.start + ' -- ' + response.end)
            $('div[class="resume_education_item"][id=' + edu_id + ']' + ' .school').text(response.school)
            $('div[class="resume_education_item"][id=' + edu_id + ']' + ' .degree').text(response.degree)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Fail to get resume info of ", resume_id)
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

function get_resume_education() {
    //console.log('/api/educations/?resume_id=' + resume_id)
    $.ajax({
        // Keep the standard restful API here
        url: '/api/educations/?resume_id=' + resume_id,
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("education: ", response)
            $.each(response.results, function(index, ele) {
                //console.log("exp.end:", ele.end, " school:", ele.school, " ele.id:", ele.id)
                // check if the item has been added
                if (edu_map[ele.id]) {
                    //console.log(ele.id, " item has beed added, skip it")
                    return
                }
                $('#resume_education_show').append(
                    '<div class="resume_education_item" id=' + ele.id + '>' +
                    '<div class="row">' +
                      '<div class="col-md-3 interval" >' +
                        ele.start + ' -- ' + ele.end +
                      '</div>' +
                      '<div class="col-md-4 school">' +
                        ele.school +
                      '</div>' +
                      '<div class="col-md-4 degree">' +
                        ele.degree +
                      '</div>' +
                      '<div class="col-md-1">' +
                        '<i class="fas fa-edit resume_education_edit_button" id=' + ele.id + ' style=""></i>' +
                      '</div>' +
                    '</div>' +
                    '</div>'

                )
                $('#resume_education_show').append(
                    gen_resume_education_edit(ele.id)
                )
                clean_resume_education_edit(ele.id)
                // step1: set the basic value
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_start' + ele.id).val(ele.start)
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_end' + ele.id).val(ele.end)
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_school' + ele.id).val(ele.school)
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_college' + ele.id).val(ele.college)
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_major' + ele.id).val(ele.major)
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_degree' + ele.id).val(ele.degree)
                //$('form[class="resume_education_item_edit"][id=' + ele.id + ']').css('display', 'none')

                edu_map[ele.id]='form[class="resume_education_item_edit"][id=' + ele.id + ']'
                $(edu_map[ele.id]).css('display', 'none')

                // step2: set the timepicker
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_start' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
                $('form[class="resume_education_item_edit"][id=' + ele.id + '] #education_end' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
            })
        },
        error: function() {
           console.log("Fail to get the education of ", resume_id)
        }
    })
}

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

$(document).on('click', '.resume_education_edit_button', function() {
   var id = Number(this.id)
   //console.log('[class="resume_education_item_edit"][id=' + id + ']')
   // get the specified resume_id/education_id info
   // Attention: the and logic for jquery
   show_one_education(id)
   $('form[class="resume_education_item_edit"][id=' + id + ']').show()
});

$(document).on('click', '.resume_education_item_edit .education_save', function() {
    var id = Number(this.id)
    //console.log("logged to id:", id)
    // update the resume info
    //console.log("serialize: ", $('form[class="resume_education_item_edit"][id=' + id + ']').serialize())
    if (id > 0) {
        //console.log("update to id:", id)
        $.ajax({
            url: '/api/educations/' + id + '/',
            async: false,
            type: 'PUT',
            data: $('form[class="resume_education_item_edit"][id=' + id + ']').serialize(),
            success: function(data, textStatus, jqXHR) {
            /*
                console.log("success ", data)
                console.log("success ", jqXHR.responseText)
                console.log("success ", jqXHR.status)
                console.log("success ", jqXHR.readState)
                console.log("success ", jqXHR.statusText)
                */
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
        var fields = $('form[class="resume_education_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        console.log("add new items:", fields)
        $.ajax({
            url: '/api/educations/',
            async: false,
            type: 'POST',
            data: fields,
        });
    }
    show_one_education(-2) // collapse all the items
    get_resume_education_one(id)
    get_resume_education()
});
$(document).on('click', '.resume_education_item_edit .education_cancel', function() {
    var id= Number(this.id)
    $('form[class="resume_education_item_edit"][id=' + id + ']').css('display','none')
});

$(document).on('click', '#resume_education_add_button', function() {
    if (!on_education_add) {
        if (!edu_map[-1]) {
            $('#resume_education_show').append(
                gen_resume_education_edit(-1)
            )
            edu_map[-1]='form[class="resume_education_item_edit"][id=-1]'
        }
        show_one_education(-1)
        clean_resume_education_edit(-1)
        $('form[class="resume_education_item_edit"][id=-1] #education_start-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
        $('form[class="resume_education_item_edit"][id=-1] #education_end-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
    }
    on_education_add = true
});

$(document).on('click', 'form[class="resume_education_item_edit"][id=-1]', function() {
    on_education_add = false
});

