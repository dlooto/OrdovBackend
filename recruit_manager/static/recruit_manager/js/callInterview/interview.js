var resumeId = -1
var projectId = -1
var interviewId = -1
var experience_id = -1
var on_experience_add = false
var exp_map = {}

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = $('#resumeInfo').attr('projectId')
    interviewId = $('#resumeInfo').attr('interviewId')
    console.log("basicInfo resumeId(",
        resumeId, ") projectId(",
        projectId, ") interviewId(",
        interviewId, ")")
    GetResumeTag()
    GetExpectedInfo()
});

Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

function InsertTag(ele) {
    var tagInfo = `<span style="border: 2px solid #E8E8E8">日期:${ele.created} 标签:${ele.tag}</span><br/>`
    $('#userTagPanel').append(tagInfo)
}

$(document).on('click', '#userTagAddButton', function () {
    var tagname = $('#userNewTag').val()
    var data = {
        "resume": resumeId,
        "tag": tagname,
    }
    console.log("tagname", tagname)
    xhr_common_send('POST', '/api/tags/', data, function (response) {
        console.log("post successfully")
        $('#userNewTag').val("")
        GetResumeTag()
    })

});

function GetResumeTag() {
    document.getElementById('userTagPanel').innerHTML = ""
    xhr_common_send('GET', '/api/tags/?resume_id=' + resumeId, null, function (response) {
        console.log("-------------", response)
        $.each(response.results, function (index, ele) {
            //console.log("insert ", ele.id, " ", ele.tagname, "")
            InsertTag(ele)
        });
    });
}

$(document).on('change', '#userCurJobState', function () {
    var val = $('#userCurJobState').val()
    var data = {
        "hunting_status": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectArea', function () {
    var val = $('#userExpectArea').val()
    var data = {
        "expected_industry": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});


$(document).on('change', '#userExpectPost', function () {
    var val = $('#userExpectPost').val()
    var data = {
        "expected_post": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectRestModel', function () {
    var val = $('#userExpectRestModel').val()
    var data = {
        "expected_restmodel": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});


$(document).on('change', '#userExpectInsurancePlace', function () {
    var val = $('#userExpectInsurancePlace').val()
    var data = {
        "expected_insurance_place_type": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectInsuranceTime', function () {
    var val = $('#userExpectInsuranceTime').val()
    var data = {
        "expected_insurance_time_type": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});

$(document).on('change', '#userExpectSalary', function () {
    var val = $('#userExpectSalary').val()
    var data = {
        "expected_salary": val,
    }
    console.log("Prepare to update the resume Info data:", data)
    xhr_common_send('PUT', '/api/resumes/' + resumeId + '/', data, function (response) {
        console.log("success update resume Info")
    })
});

function GetExpectedInfo() {
    var jobStateSeletor = document.getElementById("userCurJobState")
    var areaSelector = document.getElementById("userExpectArea")
    var postSelector = document.getElementById("userExpectPost")
    var insurancePlaceSelector = document.getElementById("userExpectInsurancePlace")
    var insuranceTimeSelector = document.getElementById("userExpectInsuranceTime")
    var restModelSelector = document.getElementById("userExpectRestModel")

    // GetProjectInfo();

    projectId = $('#resumeInfo').attr('projectId')


    xhr_common_send('GET', '/api/resumes/' + resumeId + '/', null, function (response) {
        console.log(response)
        console.log('hunting_status', response.hunting_status)

        var baseDesc = $('#interviewStatus').html();
        $('#interviewStatus').html(baseDesc + '-' + response.interview_status_name);


        // job status
        if (response.hunting_status == -1) {
            console.log('hunting_status inner', response.hunting_status)
            jobStateSeletor.options[0].selected = true
        } else if (response.hunting_status > 0) {
            jobStateSeletor.options[response.hunting_status].selected = true
        }

        // restmodel
        var restModelId = parseInt(response.expected_restmodel);
        if (isNaN(restModelId)) {
            restModelId = 0
        }
        restModelSelector.options[restModelId].selected = true

        // areaSelector
        var areaId = parseInt(response.expected_industry);
        if (isNaN(areaId)) {
            areaId = 0
        }
        areaSelector.options[areaId].selected = true

        // postSelector
        var postId = parseInt(response.expected_post);
        if (isNaN(postId)) {
            postId = 0
        }
        postSelector.options[postId].selected = true

        // insurance_place Selector
        var insurancePlaceId = parseInt(response.expected_insurance_place_type);
        if (isNaN(insurancePlaceId)) {
            insurancePlaceId = 0
        }
        insurancePlaceSelector.options[insurancePlaceId].selected = true

        // insurance_time Selector
        var insuranceTimeId = parseInt(response.expected_insurance_time_type);
        if (isNaN(insuranceTimeId)) {
            insuranceTimeId = 0
        }
        insuranceTimeSelector.options[insuranceTimeId].selected = true

        $('#userExpectSalary').val(response.expected_salary)

    });


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

function xhr_common_send(method, url, data, succCallback = null) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    var csrftoken = getCookie('csrftoken');

    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    console.log("------------------------------------>")

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { //if complete
            // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            if (xhr.status >= 200 && xhr.status < 300) {
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
