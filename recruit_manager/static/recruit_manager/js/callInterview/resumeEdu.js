var resumeId = -1
var education_id = -1
var on_education_add = false
var edu_map = {}
$(document).ready(function() {
    // get the resume id from the original url
    // Get resumeId/projectId/interviewId/statusId here
    resumeId = $('#resumeInfo').attr('resumeId')
    console.log("resumeEdu, resumeId(", resumeId, ")")
    getResumeEducation()
});

$(document).on('click', '#userEduEditButton', function() {

	$('#userEduHeader').css('background-color', '#66FFFF')

	$('#userEduAddButton').css('display', 'none')
	$('#userEduEditButton').css('display', 'none')
	$('#userEduSaveButton').css('display', 'inline')
});

$(document).on('click', '#userEduSaveButton', function() {

    // Save
    SaveEducationInfo()
	$('#userEduHeader').css('background-color', '#FFFFFF')

	$('#userEduAddButton').css('display', 'inline')
	$('#userEduEditButton').css('display', 'none')
	$('#userEduSaveButton').css('display', 'none')

	$('#userEduAddPanel').remove()

});

$(document).on('click', '#userEduAddButton', function() {

	$('#userEduHeader').css('background-color', '#66FFFF')

	$('#userEduAddButton').css('display', 'none')
	$('#userEduEditButton').css('display', 'none')
	$('#userEduSaveButton').css('display', 'inline')

	var editpanel = '<div class="layui-form-item" id="userEduAddPanel">'+
	 '<span class="layui-col-sm12">'+
	 '   开始时间：<input class="layui-input"  autocomplete="off" placeholder="2020-01-01" name="educStrDate" id="userEduEditStart">'+
	 '   </span>'+
	 '   <span class="layui-col-sm12">'+
	 '   结束时间：<input class="layui-input"  autocomplete="off" placeholder="2020-01-01" name="educEndDate" id="userEduEditEnd">'+
	 '   </span>'+
	 '   <span class="layui-col-sm12">学校：<input type="text" id="userEduEditSchool" name="email" autocomplete="off" class="layui-input"></span>'+
	 '   <span class="layui-col-sm12">专业：<input type="text" id="userEduEditMajor" name="email" autocomplete="off" class="layui-input"></span>'+
	 '   <span class="layui-col-sm12">学位：<input type="text" id="userEduEditDegree" placeholder="本科" name="email" autocomplete="off" class="layui-input"></span>'+
	 '   <span class="layui-col-sm12">类别：<input type="text" id="userEduEditType" placeholder="统招/成人大学" name="email" autocomplete="off" class="layui-input"></span>'+
	 '   <span class="layui-col-sm12">'+
	 '    <div class="layui-col-sm12">标签：</div>'+
	 '<div class="layui-col-sm12"><button class="layui-btn" onclick="addEducLabel(this)">添加标签</button></div>'+
	 '</span>'+
	 '   </div>';
	$('#resumeEduPanel').append(editpanel)
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

function getResumeEducation_one(edu_id) {
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
            console.log("Fail to get resume info of ", resumeId)
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

function showResumeEducation(ele) {
    //修改显示日期格式
  $('#resumeEduPanel').append(
      '<div class="layui-from-item">' +
        '<div class="layui-col-sm4">' +
            ele.start.substring(0,7) + '-' + ele.end.substring(0,7) +
        '</div>' +
        '<div class="layui-col-sm3">' +
            ele.school +
        '</div>' +
        '<div class="layui-col-sm3">' +
            ele.major +
        '</div>' +
        '<div class="layui-col-sm1">' +
  		    ele.degree +
        '</div>' +
        '<div class="layui-col-sm1">' +
  		    '统招' +
        '</div>' +
      '</div>'
  )
}

function getResumeEducation() {
  console.log('/api/educations/?resume_id=' + resumeId)
  document.getElementById('resumeEduPanel').innerHTML = ""

  xhr_common_send('GET', '/api/educations/?resume_id=' + resumeId, null, function(response) {
    console.log("education: ", response)
	$.each(response.results, function(index, ele) {
	  // check if the item has been added
	  if (edu_map[ele.id]) {
		//console.log(ele.id, " item has beed added, skip it")
		return
	  }
	  showResumeEducation(ele)
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

$(document).on('click', '.resume_education_edit_button', function() {
   var id = Number(this.id)
   //console.log('[class="resume_education_item_edit"][id=' + id + ']')
   // get the specified resumeId/education_id info
   // Attention: the and logic for jquery
   show_one_education(id)
   $('form[class="resume_education_item_edit"][id=' + id + ']').show()
});

function SaveEducationInfo() {

	var data = {}
	console.log("degree ", $('#userEduEditDegree').html())
    if ($('#userEduEditDegree').val() == '小学') {
        data['degree'] = 1
    } else if ($('#userEduEditDegree').val() == '初中') {
        data['degree'] = 2
    } else if ($('#userEduEditDegree').val() == '高中') {
        data['degree'] = 3
    } else if ($('#userEduEditDegree').val() == '中专') {
        data['degree'] = 4
    } else if ($('#userEduEditDegree').val() == '大专') {
        data['degree'] = 5
    } else if ($('#userEduEditDegree').val() == '本科') {
        data['degree'] = 6
    } else if ($('#userEduEditDegree').val() == '硕士') {
        data['degree'] = 7
    } else if ($('#userEduEditDegree').val() == '博士') {
        data['degree'] = 8
    } else if ($('#userEduEditDegree').val() == '博士后') {
        data['degree'] = 9
    }

	data["resume"] = resumeId

	if ($('#userEduEditStart').val().length == 0) {
        data["start"] = "1970-01-01"
	} else {
        data["start"] = $('#userEduEditStart').val()
	}

	if ($('#userEduEditEnd').val().length == 0) {
        data["end"] = "1970-01-01"
	} else {
        data["end"] = $('#userEduEditEnd').val()
	}
    data["school"] = $('#userEduEditSchool').val()
    data["major"] = $('#userEduEditMajor').val()
    data["edu_type"] = $('#userEduEditType').val()

    console.log("---------> fields: ", data)
    xhr_common_send('POST', '/api/educations/', data, function(response) {
        console.log("--------------Add ")
    });
}

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
        var fields = $('form[class="resume_education_item_edit"][id=' + id + ']').serialize() + "&resume=" + resumeId
        console.log("add new items:", fields)
        $.ajax({
            url: '/api/educations/',
            async: false,
            type: 'POST',
            data: fields,
        });
    }
    show_one_education(-2) // collapse all the items
    getResumeEducation_one(id)
    getResumeEducation()
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



