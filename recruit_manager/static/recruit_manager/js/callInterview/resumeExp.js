var resumeId = -1
var project_id = -1
var on_project_add = false
var edu_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    resumeId = $('#resumeInfo').attr('resumeId')
    console.log("resumeExp, resumeId(", resumeId, ")")
    getResumeExperience()
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

$(document).on('click', '#userExpEditButton', function() {

    $('#userExpHeader').css('background-color', '#66FFFF')

    $('#userExpAddButton').css('display', 'none')
    $('#userExpEditButton').css('display', 'none')
    $('#userExpSaveButton').css('display', 'inline')
});

$(document).on('click', '#userExpSaveButton', function() {

	SaveExpInfo()
    $('#userExpHeader').css('background-color', '#FFFFFF')

    $('#userExpAddButton').css('display', 'inline')
    $('#userExpEditButton').css('display', 'none')
    $('#userExpSaveButton').css('display', 'none')

    $('#userExpAddPanel').remove()
});

$(document).on('click', '#userExpAddButton', function() {

    $('#userExpHeader').css('background-color', '#66FFFF')

    $('#userExpAddButton').css('display', 'none')
    $('#userExpEditButton').css('display', 'none')
    $('#userExpSaveButton').css('display', 'inline')

	var userExpAddPanel = '<div class="layui-form-item" id="userExpAddPanel">'+
	'<span class="layui-col-sm12">'+
	'       开始时间：<input class="layui-input"  autocomplete="off" placeholder="2020-01-01"  name="workStrDate" id="userExpEditStart">'+
	'       </span>'+
	'       <span class="layui-col-sm12">'+
	'       结束时间：<input class="layui-input"  autocomplete="off" placeholder="2020-01-01" placeholder="2012" name="workEndDate" id="userExpEditEnd">'+
	'       </span>'+
	'       <span class="layui-col-sm12">'+
	'       公司：<input type="text" id="userExpEditCompanyName" placeholder="请输入公司名称" name="" autocomplete="off" class="layui-input">'+
	'       </span>'+
	'       <span class="layui-col-sm12">'+
	'       职位：<input type="text" id="userExpEditPostName" placeholder="请输入职位" name="" autocomplete="off" class="layui-input">'+
	'       </span>'+
	'       <span class="layui-col-sm12">'+
	'       离职原因：<input type="text" id="userExpEditLeaveReason" placeholder="请输入离职原因" name="" autocomplete="off" class="layui-input">'+
	'       </span>'+
	'   </div>';
	$("#resumeExpPanel").append(userExpAddPanel);
});

function clean_resume_project_edit(proj_id) {
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_start' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_end' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_name' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_role' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_duty' + proj_id).val("")
    $('form[class="resume_project_item_edit"][id=' + proj_id + '] #project_company_name' + proj_id).val("")
}

function SaveExpInfo() {
	data = {}
	data["resume"] = resumeId
	if ($('#userExpEditStart').val().length == 0) {
		data["start"] = "1970-01-01"
	} else {
		data["start"] = $('#userExpEditStart').val()
	}

	if ($('#userExpEditEnd').val().length == 0) {
		data["end"] = "1970-01-01"
	} else {
		data["end"] = $('#userExpEditEnd').val()
	}
	data['company_name'] = $('#userExpEditCompanyName').val()
	data['post_name'] = $('#userExpEditPostName').val()
	data['leave_reason'] = $('#userExpEditLeaveReason').val()

	xhr_common_send('POST', '/api/experiences/', data, function(response){
        getResumeExperience()
		console.log("-------------------success")
	})
}

function getResumeExperience_one(proj_id) {
    $.ajax({
        url: '/api/experiences/' + proj_id + '/',
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

function showResumeExperience(ele) {
    $('#resumeExpPanel').append(
        '<div class="layui-form-item">' +
          '<span class="layui-col-sm4">' +
            ele.start + '-' + ele.end +
          '</span>' +
          '<span class="layui-col-sm2">' +
            ele.company_name +
          '</span>' +
          '<span class="layui-col-sm2">' +
            ele.post_name +
          '</span>' +
          '<span class="layui-col-sm2">' +
			'2年6个月' +
          '</span>' +
          '<span class="layui-col-sm2">' +
			'离职原因' +
          '</span>' +
        '</div>'
    )
}

function getResumeExperience() {
    console.log('/api/experiences?resume_id=' + resumeId)
    document.getElementById('resumeExpPanel').innerHTML = ""
	xhr_common_send('GET', '/api/experiences?resume_id=' + resumeId, null, function(response) {
		console.log("project: ", response)
		$.each(response.results, function(index, ele) {
			//console.log("exp.end:", ele.end, " proj_name:", ele.name, " role:", ele.role)
			// check if the item has been added
			if (edu_map[ele.id]) {
				//console.log(ele.id, " item has beed added, skip it")
				return
			}
			showResumeExperience(ele)
		})
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
            url: '/api/experiences/' + id + '/',
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
    }
    show_one_project(-2) // collapse all the items
    getResumeExperience_one(id)
    getResumeExperience()
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

// ====================================================
// Meta Function
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function xhr_common_send(method, url, data, succCallback=null) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);

  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  var csrftoken = getCookie('csrftoken');

  xhr.setRequestHeader("X-CSRFToken", csrftoken);
  console.log("------------------------------------>")

  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){ //if complete
      // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
      if(xhr.status >= 200 && xhr.status < 300) {
        if (succCallback) {
          succCallback(JSON.parse(xhr.response))
        }
		console.log("success")
      } else {
        console.log("csrftoken: ", csrftoken)
        console.log(xhr.responseText)
        console.log(xhr.status)
        console.log(xhr.statusText)
        console.log(url)
        console.log(data)
        alert("Something error happend\n");
      }
    }
  }
  xhr.send(JSON.stringify(data));
}
