var resume_id = -1
var certification_id = -1
var on_certification_add = false
var cert_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    // TODO: not so strong here
    var component=(window.location.href.split("/"))
    resume_id = component[5]
    //console.log("id", resume_id)
    get_resume_certification()
    show_one_certification(-1)
});

function show_one_certification(cert_id) {
    $.each(cert_map, function(key, value){
        if (key == cert_id) {
          $(value).css('display', 'inline')
        } else {
          $(value).css('display', 'none')
        }
    })
    if (cert_id != -1) {
        on_certification_add = false
    }
}

function clean_resume_certification_edit(cert_id) {
    $('form[class="resume_certification_item_edit"][id=' + cert_id + '] #certification_time' + cert_id).val("")
    $('form[class="resume_certification_item_edit"][id=' + cert_id + '] #certification_name' + cert_id).val("")
    $('form[class="resume_certification_item_edit"][id=' + cert_id + '] #certification_institution' + cert_id).val("")
}

function gen_resume_certification_edit(cert_id) {
    return '<form class="resume_certification_item_edit" id=' + cert_id + '>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">机构名</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="name" id=certification_name' + cert_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">发证机关</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="institution" id=certification_institution' + cert_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-12 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">发证时间</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="time" id=certification_time' + cert_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6">' +
            '<button type="button" class="certification_save" id=' + cert_id + '>' +
              '确定' +
            '</button>' +
          '</div>' +
          '<div class="col-md-6">' +
            '<button type="button" class="certification_cancel" id=' + cert_id + '>' +
              '取消' +
            '</button>' +
          '</div>' +
        '</div>' +
        '</form>'
}

function get_resume_certification_one(cert_id) {
    $.ajax({
        url: '/api/certifications/' + cert_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("get certification successfully ", response)
            // Should update the certification item here
            $('div[class="resume_certification_item"][id=' + cert_id + ']' + ' .cert_name').text(response.name)
            $('div[class="resume_certification_item"][id=' + cert_id + ']' + ' .cert_institution').text(response.institution)
            $('div[class="resume_certification_item"][id=' + cert_id + ']' + ' .cert_time').text(response.time)
        },
        error: function() {
            console.log("Fail to get resume info of ", resume_id)
        }
    })
}

function get_resume_certification() {
    //console.log('/api/certifications/?resume_id=' + resume_id)
    $.ajax({
        // Keep the standard restful API here
        url: '/api/certifications/?resume_id=' + resume_id,
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("certification: ", response)
            $.each(response.results, function(index, ele) {
                //console.log("exp.end:", ele.end, " cert_name:", ele.name, " institution:", ele.institution)
                // check if the item has been added
                if (cert_map[ele.id]) {
                    //console.log(ele.id, " item has beed added, skip it")
                    return
                }
                $('#resume_certification_show').append(
                    '<div class="resume_certification_item" id=' + ele.id + '>' +
                    '<div class="row">' +
                      '<div class="col-md-3 cert_time" >' +
                        ele.time +
                      '</div>' +
                      '<div class="col-md-4 cert_name">' +
                        ele.name +
                      '</div>' +
                      '<div class="col-md-4 cert_institution">' +
                        ele.institution +
                      '</div>' +
                      '<div class="col-md-1">' +
                        '<i class="fas fa-edit resume_certification_edit_button" id=' + ele.id + ' style=""></i>' +
                      '</div>' +
                    '</div>' +
                    '</div>'

                )
                $('#resume_certification_show').append(
                    gen_resume_certification_edit(ele.id)
                )
                clean_resume_certification_edit(ele.id)
                // step1: set the basic value
                $('form[class="resume_certification_item_edit"][id=' + ele.id + '] #certification_name' + ele.id).val(ele.name)
                $('form[class="resume_certification_item_edit"][id=' + ele.id + '] #certification_institution' + ele.id).val(ele.institution)
                $('form[class="resume_certification_item_edit"][id=' + ele.id + '] #certification_time' + ele.id).val(ele.time)
                //$('form[class="resume_certification_item_edit"][id=' + ele.id + ']').css('display', 'none')

                cert_map[ele.id]='form[class="resume_certification_item_edit"][id=' + ele.id + ']'
                $(cert_map[ele.id]).css('display', 'none')

                $('form[class="resume_certification_item_edit"][id=' + ele.id + '] #certification_time' + ele.id).datepicker({
                    dateFormat: 'yy-mm-dd',
                })

            })
        },
        error: function() {
           console.log("Fail to get the certification of ", resume_id)
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

$(document).on('click', '.resume_certification_edit_button', function() {
   var id = Number(this.id)
   //console.log('[class="resume_certification_item_edit"][id=' + id + ']')
   // get the specified resume_id/certification_id info
   // Attention: the and logic for jquery
   show_one_certification(id)
   $('form[class="resume_certification_item_edit"][id=' + id + ']').show()
});

$(document).on('click', '.resume_certification_item_edit .certification_save', function() {
    var id = Number(this.id)
    //console.log("logged to id:", id)
    // update the resume info
    //console.log("serialize: ", $('form[class="resume_certification_item_edit"][id=' + id + ']').serialize())
    if (id > 0) {
        //console.log("update to id:", id)
        $.ajax({
            url: '/api/certifications/' + id + '/',
            async: false,
            type: 'PUT',
            data: $('form[class="resume_certification_item_edit"][id=' + id + ']').serialize(),
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
        var fields = $('form[class="resume_certification_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        //console.log("add new items:", fields)
        $.ajax({
            url: '/api/certifications/',
            async: false,
            type: 'POST',
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
    show_one_certification(-2) // collapse all the items
    get_resume_certification_one(id)
    get_resume_certification()
});
$(document).on('click', '.resume_certification_item_edit .certification_cancel', function() {
    var id= Number(this.id)
    $('form[class="resume_certification_item_edit"][id=' + id + ']').css('display','none')
});

$(document).on('click', '#resume_certification_add_button', function() {
    if (!on_certification_add) {
        if (!cert_map[-1]) {
            $('#resume_certification_show').append(
                gen_resume_certification_edit(-1)
            )
            cert_map[-1]='form[class="resume_certification_item_edit"][id=-1]'
        }
        show_one_certification(-1)
        clean_resume_certification_edit(-1)

        $('form[class="resume_certification_item_edit"][id=-1] #certification_time-1').datepicker({
            dateFormat: 'yy-mm-dd',
        })
    }
    on_certification_add = true
});

$(document).on('click', 'form[class="resume_certification_item_edit"][id=-1]', function() {
    on_certification_add = false
});

