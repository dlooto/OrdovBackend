var resume_id = -1
var project_id = -1
var on_project_add = false
var edu_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    // TODO: not so strong here
    var component=(window.location.href.split("/"))
    resume_id = component[5]
    console.log("id", resume_id)
    get_resume_project()
    show_one_project(-1)
});

function show_one_project(proj_id) {
    $.each(edu_map, function(key, value){
        if (key == proj_id) {
          $(value).css('display', 'inline')
        } else {
          $(value).css('display', 'none')
        }
    })

}

function clean_resume_project_edit(proj_id) {
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_start' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_end' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_name' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_role' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_duty' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_company_name' + proj_id).val("")
}

function gen_resume_project_edit(proj_id) {
    return '<form class="resume_project_item_edit" id=' + proj_id + '>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">开始时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="start" id=project_start' + proj_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">结束时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="end" id=project_end' + proj_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">项目名</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="name" id=project_name' + proj_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">角色</span> ' +
            '</div>' +
            '<input type="text" class="form-control" name="role" id=project_role' + proj_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">公司名</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="company_name" id=project_company_name' + proj_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">职责</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="duty" id=project_duty' + proj_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-12 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">描述</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="description" id=project_description' + proj_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6">' +
            '<button type="button" class="project_save" id=' + proj_id + '>' +
              '确定' +
            '</button>' +
          '</div>' +
          '<div class="col-md-6">' +
            '<button type="button" class="project_cancel" id=' + proj_id + '>' +
              '取消' +
            '</button>' +
          '</div>' +
        '</div>' +
        '</form>'
}

function get_resume_project_one(proj_id) {
    $.ajax({
        url: '/api/projects/' + proj_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("get project successfully ", response)
            // Should update the project item here
            $('div[class="resume_project_item"][id=' + proj_id + ']' + ' .interval').text(response.start + ' -- ' + response.end)
            $('div[class="resume_project_item"][id=' + proj_id + ']' + ' .proj_name').text(response.name)
            $('div[class="resume_project_item"][id=' + proj_id + ']' + ' .proj_role').text(response.role)
        },
        error: function() {
            console.log("Fail to get resume info of ", resume_id)
        }
    })
}

function get_resume_project() {
    //console.log('/api/projects?resume_id=' + resume_id)
    $.ajax({
        // Keep the standard restful API here
        url: '/api/projects?resume_id=' + resume_id,
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("project: ", response)
            $.each(response.results, function(index, ele) {
                //console.log("exp.end:", ele.end, " proj_name:", ele.name, " role:", ele.role)
                // check if the item has been added
                if (edu_map[ele.id]) {
                    //console.log(ele.id, " item has beed added, skip it")
                    return
                }
                $('#resume_project_show').append(
                    '<div class="resume_project_item" id=' + ele.id + '>' +
                    '<div class="row">' +
                      '<div class="col-md-3 interval" >' +
                        ele.start + ' -- ' + ele.end +
                      '</div>' +
                      '<div class="col-md-4 proj_name">' +
                        ele.name +
                      '</div>' +
                      '<div class="col-md-4 proj_role">' +
                        ele.role +
                      '</div>' +
                      '<div class="col-md-1">' +
                        '<i class="fas fa-edit resume_project_edit_button" id=' + ele.id + ' style=""></i>' +
                      '</div>' +
                    '</div>' +
                    '</div>'

                )
                $('#resume_project_show').append(
                    gen_resume_project_edit(ele.id)
                )
                clean_resume_project_edit(ele.id)
                // step1: set the basic value
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_start' + ele.id).val(ele.start)
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_end' + ele.id).val(ele.end)
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_name' + ele.id).val(ele.name)
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_role' + ele.id).val(ele.role)
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_company_name' + ele.id).val(ele.company_name)
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_duty' + ele.id).val(ele.duty)
                //$('form[class="resume_project_item_edit"][id=' + ele.id + ']').css('display', 'none')

                edu_map[ele.id]='form[class="resume_project_item_edit"][id=' + ele.id + ']'
                $(edu_map[ele.id]).css('display', 'none')

                // step2: set the timepicker
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_start' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
                $('form[class="resume_project_item_edit"][id=' + ele.id + '] #project_end' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })
            })
        },
        error: function() {
           console.log("Fail to get the project of ", resume_id)
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

$(document).on('click', '.resume_project_edit_button', function() {
   var id = Number(this.id)
   //console.log('[class="resume_project_item_edit"][id=' + id + ']')
   // get the specified resume_id/project_id info
   // Attention: the and logic for jquery
   show_one_project(id)
   $('form[class="resume_project_item_edit"][id=' + id + ']').show()
});

$(document).on('click', '.resume_project_item_edit .project_save', function() {
    var id = Number(this.id)
    //console.log("logged to id:", id)
    // update the resume info
    //console.log("serialize: ", $('form[class="resume_project_item_edit"][id=' + id + ']').serialize())
    if (id > 0) {
        console.log("update to id:", id)
        $.ajax({
            url: '/api/projects/' + id + '/',
            async: false,
            type: 'PUT',
            data: $('form[class="resume_project_item_edit"][id=' + id + ']').serialize(),
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
        var fields = $('form[class="resume_project_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        //console.log("add new items:", fields)
        $.ajax({
            url: '/api/projects/',
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
    }
    show_one_project(-2) // collapse all the items
    get_resume_project_one(id)
    get_resume_project()
});
$(document).on('click', '.resume_project_item_edit .project_cancel', function() {
    var id= Number(this.id)
    $('form[class="resume_project_item_edit"][id=' + id + ']').css('display','none')
});

$(document).on('click', '#resume_project_add_button', function() {
    if (!on_project_add) {
        $('#resume_project_show').append(
            gen_resume_project_edit(-1)
        )
        edu_map[-1]='form[class="resume_project_item_edit"][id=-1]'
        show_one_project(-1)
        clean_resume_project_edit(-1)
        $('form[class="resume_project_item_edit"][id=-1] #project_start-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
        $('form[class="resume_project_item_edit"][id=-1] #project_end-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
    }
    on_project_add = true
});

$(document).on('click', 'form[class="resume_project_item_edit"][id=-1]', function() {
    on_project_add = false
});

