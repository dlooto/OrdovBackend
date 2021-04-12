var resumeId = -1
var projectId = -1
var interviewId = -1
var exp_map = {}

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = $('#resumeInfo').attr('projectId')
    console.log("projectInfo resumeId(", resumeId, ")")
    console.log("projectInfo projectId(", projectId, ")")
    GetProjectInfo()
});

function GetProjectInfo() {
    xhr_common_send('GET', '/api/posts/' + projectId + '/', null, function (response) {
        var talk_hint = response.talk_hint
        console.log("talk_:", response)
        console.log("talk_hint:", talk_hint, ".")
        $('#projectTaskHint').html(talk_hint)
        var tips = [
            'prologue',
            'workplace',
            'work_purpose',
            'wechat_invite',
        ];
        for (let i = 0; i < tips.length; i++) {
            $('#' + tips[i]).html(response[tips[i]])
        }
        var projectDesc = response['project_name'].split('-')[0];
        $('#interviewStatus').html('目前环节:' + projectDesc);

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
