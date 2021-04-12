var resume_id = -1
var language_id = -1
var on_language_add = false
var lang_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    // TODO: not so strong here
    var component=(window.location.href.split("/"))
    resume_id = component[5]
    console.log("id", resume_id)
    get_resume_language()
    show_one_language(-1)
});

function show_one_language(lang_id) {
    $.each(lang_map, function(key, value){
        if (key == lang_id) {
          $(value).css('display', 'inline')
        } else {
          $(value).css('display', 'none')
        }
    })
    if (lang_id != -1) {
        on_language_add = false
    }

}

function clean_resume_language_edit(lang_id) {
    $('form[class="resume_language_item_edit"][id=' + lang_id + '] #language_name' + lang_id).val("")
    $('form[class="resume_language_item_edit"][id=' + lang_id + '] #language_role' + lang_id).val("")
    $('form[class="resume_language_item_edit"][id=' + lang_id + '] #language_duty' + lang_id).val("")
    $('form[class="resume_language_item_edit"][id=' + lang_id + '] #language_company_name' + lang_id).val("")
}

function gen_resume_language_edit(lang_id) {
    return '<form class="resume_language_item_edit" id=' + lang_id + '>' +
        '<div class="row">' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">语种</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="name" id=language_name' + lang_id + ' value="">' +
          '</div>' +
          '<div class="col-md-6 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">级别</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="cert" id=language_cert' + lang_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-12 input-group">' +
            '<div class="input-group-prepend resume_basic_addon">' +
              '<span class="input-group-text resume_basic_header1" id="basic-addon1" style="width:70px">描述</span>' +
            '</div>' +
            '<input type="text" class="form-control" name="description" id=language_description' + lang_id + ' value="">' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-md-6">' +
            '<button type="button" class="language_save" id=' + lang_id + '>' +
              '确定' +
            '</button>' +
          '</div>' +
          '<div class="col-md-6">' +
            '<button type="button" class="language_cancel" id=' + lang_id + '>' +
              '取消' +
            '</button>' +
          '</div>' +
        '</div>' +
        '</form>'
}

function get_resume_language_one(lang_id) {
    $.ajax({
        url: '/api/languages/' + lang_id + '/',
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("get language successfully ", response)
            // Should update the language item here
            $('div[class="resume_language_item"][id=' + lang_id + ']' + ' .lang_name').text(response.name)
            $('div[class="resume_language_item"][id=' + lang_id + ']' + ' .lang_cert').text(response.cert)
        },
        error: function() {
            console.log("Fail to get resume info of ", resume_id)
        }
    })
}

function get_resume_language() {
    console.log('/api/languages/?resume_id=' + resume_id)
    $.ajax({
        // Keep the standard restful API here
        url: '/api/languages/?resume_id=' + resume_id,
        type: 'GET',
        data: null,
        success: function(response) {
            //console.log("language: ", response)
            $.each(response.results, function(index, ele) {
                //console.log("exp.end:", ele.end, " lang_name:", ele.name, " role:", ele.role)
                // check if the item has been added
                if (lang_map[ele.id]) {
                    console.log(ele.id, " item has beed added, skip it")
                    return
                }
                $('#resume_language_show').append(
                    '<div class="resume_language_item" id=' + ele.id + '>' +
                    '<div class="row">' +
                      '<div class="col-md-4 lang_name">' +
                        ele.name +
                      '</div>' +
                      '<div class="col-md-4 lang_cert">' +
                        ele.cert +
                      '</div>' +
                      '<div class="col-md-3 interval" >' +
                      '</div>' +
                      '<div class="col-md-1">' +
                        '<i class="fas fa-edit resume_language_edit_button" id=' + ele.id + ' style=""></i>' +
                      '</div>' +
                    '</div>' +
                    '</div>'

                )
                $('#resume_language_show').append(
                    gen_resume_language_edit(ele.id)
                )
                clean_resume_language_edit(ele.id)
                // step1: set the basic value
                $('form[class="resume_language_item_edit"][id=' + ele.id + '] #language_name' + ele.id).val(ele.name)
                $('form[class="resume_language_item_edit"][id=' + ele.id + '] #language_cert' + ele.id).val(ele.cert)
                $('form[class="resume_language_item_edit"][id=' + ele.id + '] #language_description' + ele.id).val(ele.description)
                //$('form[class="resume_language_item_edit"][id=' + ele.id + ']').css('display', 'none')

                lang_map[ele.id]='form[class="resume_language_item_edit"][id=' + ele.id + ']'
                $(lang_map[ele.id]).css('display', 'none')

            })
        },
        error: function() {
           console.log("Fail to get the language of ", resume_id)
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

$(document).on('click', '.resume_language_edit_button', function() {
   var id = Number(this.id)
   //console.log('[class="resume_language_item_edit"][id=' + id + ']')
   // get the specified resume_id/language_id info
   // Attention: the and logic for jquery
   show_one_language(id)
   $('form[class="resume_language_item_edit"][id=' + id + ']').show()
});

$(document).on('click', '.resume_language_item_edit .language_save', function() {
    var id = Number(this.id)
    //console.log("logged to id:", id)
    // update the resume info
    //console.log("serialize: ", $('form[class="resume_language_item_edit"][id=' + id + ']').serialize())
    if (id > 0) {
        //console.log("update to id:", id)
        $.ajax({
            url: '/api/languages/' + id + '/',
            async: false,
            type: 'PUT',
            data: $('form[class="resume_language_item_edit"][id=' + id + ']').serialize(),
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
        var fields = $('form[class="resume_language_item_edit"][id=' + id + ']').serialize() + "&resume=" + resume_id
        //console.log("add new items:", fields)
        $.ajax({
            url: '/api/languages/',
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
    show_one_language(-2) // collapse all the items
    get_resume_language_one(id)
    get_resume_language()
});
$(document).on('click', '.resume_language_item_edit .language_cancel', function() {
    var id= Number(this.id)
    $('form[class="resume_language_item_edit"][id=' + id + ']').css('display','none')
});

$(document).on('click', '#resume_language_add_button', function() {
    if (!on_language_add) {
        if (!lang_map[-1]) {
            $('#resume_language_show').append(
                gen_resume_language_edit(-1)
            )
            lang_map[-1]='form[class="resume_language_item_edit"][id=-1]'
        }
        show_one_language(-1)
        clean_resume_language_edit(-1)
    }
    on_language_add = true
});

$(document).on('click', 'form[class="resume_language_item_edit"][id=-1]', function() {
    on_language_add = false
});

