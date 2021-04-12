var resumeId = -1
var experience_id = -1
var on_experience_add = false
var exp_map = {}

$(document).ready(function() {
    resumeId = $('#resumeInfo').attr('resumeId')
    console.log("basicInfo resumeId(", resumeId, ")")
    GetBasicInfo()
});

$(document).on('click', '#userBasicEditButton', function() {

    GetBasicInfo()
    $('#userBasicHeader').css('background-color', '#66FFFF')
    $('#userBasicEditPanel').css('display', 'block') // Attention here: block not inline
    $('#userBasicShowPanel').css('display', 'none')

    $('#userBasicEditButton').css('display', 'none')
    $('#userBasicSaveButton').css('display', 'inline')
});

$(document).on('click', '#userBasicSaveButton', function() {

    console.log("------------------> click update")
    UpdateBasicInfo()
    $('#userBasicHeader').css('background-color', '#FFFFFF')
    $('#userBasicEditPanel').css('display', 'none')
    $('#userBasicShowPanel').css('display', 'block')

    $('#userBasicEditButton').css('display', 'inline')
    $('#userBasicSaveButton').css('display', 'none')

    GetBasicInfo()
});



function GetBasicInfo() {
	xhr_common_send('GET', '/api/resumes/' + resumeId + '/', null, function(response) {
      console.log(response)
      gender = '男'
      if (response.gender == 'f') {
          gender = '女'
      }

      degree = ''

      if (response.degree == 1) {
          degree = '小学'
      } else if (response.degree == 2) {
          degree = '初中'
      } else if (response.degree == 3) {
          degree = '高中'
      } else if (response.degree == 4) {
          degree = '中专'
      } else if (response.degree == 5) {
          degree = '大专'
      } else if (response.degree == 6) {
          degree = '本科'
      } else if (response.degree == 7) {
          degree = '硕士'
      } else if (response.degree == 8) {
          degree = '博士'
      } else if (response.degree == 9) {
          degree = '博士后'
      }

      console.log("To Update Panel", degree, gender)
      // Update the show panel info
      $('#userBasicShowName').html(response.username)
      $('#userBasicShowGendor').html(gender)
      $('#userBasicShowAge').html(response.age)
      $('#userBasicShowDegree').html(degree)
      $('#userBasicShowGraduate').html()
      $('#userBasicShowCurResidence').html("现居住地 : " + response.cursettle)
      $('#userBasicShowBirthPlace').html("籍贯 : " + response.birthorigin)
      $('#userBasicShowExpectPlace').html("期望工作地 : " + response.expected)
      $('#userBasicShowPhone').html("" + response.phone_number)

      // Update the edit panel info
      $('#userBasicEditName').val(response.username)
      $('#userBasicEditGendor').val(gender)
      $('#userBasicEditAge').val(response.age)
      $('#userBasicEditDegree').val(degree)
      $('#userBasicEditGraduate').val(response.birthorigin)
      $('#userBasicEditPhone').val(response.phone_number)

      $('#userBasicEditBirthProvince').val(response.birth_province)
      $('#userBasicEditBirthCity').val(response.birth_city)
      $('#userBasicEditBirthDistrict').val(response.birth_district)
      $('#userBasicEditBirthStreet').val(response.birth_street)

      $('#userBasicEditCurSettleProvince').val(response.current_settle_province)
      $('#userBasicEditCurSettleCity').val(response.current_settle_city)
      $('#userBasicEditCurSettleDistrict').val(response.current_settle_district)
      $('#userBasicEditCurSettleStreet').val(response.current_settle_street)

      $('#userBasicEditExpectProvince').val(response.expected_province)
      $('#userBasicEditExpectCity').val(response.expected_city)
      $('#userBasicEditExpectDistrict').val(response.expected_district)
      $('#userBasicEditExpectStreet').val(response.expected_street)

	})
}

function UpdateBasicInfo() {
    // Parsing the basic info and update
    var data = {}
    if ($('#userBasicEditName').val().length != 0) {
        data['username'] =  $('#userBasicEditName').val()
    } else {
        console.log("username ", $('#userBasicEditName').val())
    }

    if ($('#userBasicEditAge').val().length != 0) {
        data['age'] = parseInt($('#userBasicEditAge').val())
    }

    if ($('#userBasicEditGendor').val() == '男') {
        data['gender'] = 'm'
    } else if ($('#userBasicEditGendor').val() == '女') {
        data['gender'] = 'f'
    }

    if ($('#userBasicEditDegree').val() == '小学') {
        data['degree'] = 1
    } else if ($('#userBasicEditDegree').val() == '初中') {
        data['degree'] = 2
    } else if ($('#userBasicEditDegree').val() == '高中') {
        data['degree'] = 3 
    } else if ($('#userBasicEditDegree').val() == '中专') {
        data['degree'] = 4
    } else if ($('#userBasicEditDegree').val() == '大专') {
        data['degree'] = 5 
    } else if ($('#userBasicEditDegree').val() == '本科') {
        data['degree'] = 6
    } else if ($('#userBasicEditDegree').val() == '硕士') {
        data['degree'] = 7
    } else if ($('#userBasicEditDegree').val() == '博士') {
        data['degree'] = 8
    } else if ($('#userBasicEditDegree').val() == '博士后') {
        data['degree'] = 9 
    }

    if ($('#userBasicEditBirthProvince').val().length != 0) {
        data['birth_province'] = $('#userBasicEditBirthProvince').val()
    }
    if ($('#userBasicEditBirthCity').val().length != 0) {
        data['birth_city'] = $('#userBasicEditBirthCity').val()
    }
    if ($('#userBasicEditBirthDistrict').val().length != 0) {
        data['birth_district'] = $('#userBasicEditBirthDistrict').val()
    }
    if ($('#userBasicEditBirthStreet').val().length != 0) {
        data['birth_street'] = $('#userBasicEditBirthStreet').val()
    }

    if ($('#userBasicEditCurSettleProvince').val().length != 0) {
        data['current_settle_province'] = $('#userBasicEditCurSettleProvince').val()
    }
    if ($('#userBasicEditCurSettleCity').val().length != 0) {
        data['current_settle_city'] = $('#userBasicEditCurSettleCity').val()
    }
    if ($('#userBasicEditCurSettleDistrict').val().length != 0) {
        data['current_settle_district'] = $('#userBasicEditCurSettleDistrict').val()
    }
    if ($('#userBasicEditCurSettleStreet').val().length != 0) {
        data['current_settle_street'] = $('#userBasicEditCurSettleStreet').val()
    }


    if ($('#userBasicEditExpectProvince').val().length != 0) {
        data['expected_province'] = $('#userBasicEditExpectProvince').val()
    }
    if ($('#userBasicEditExpectCity').val().length != 0) {
        data['expected_city'] = $('#userBasicEditExpectCity').val()
    }
    if ($('#userBasicEditExpectDistrict').val().length != 0) {
        data['expected_district'] = $('#userBasicEditExpectDistrict').val()
    }
    if ($('#userBasicEditExpectStreet').val().length != 0) {
        data['expected_street'] = $('#userBasicEditExpectStreet').val()
    }
    /*
    var data = {
      "graduate": $('#userBasicEditGraduate').val(),
    }
    */

    console.log("Prepare to update the resume Info data:", data)
	xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function(response){
		console.log("success update resume Info")
        GetBasicInfo()
	})
}

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
