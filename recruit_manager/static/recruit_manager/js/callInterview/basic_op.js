var resumeId = -1
var projectId = -1
var interviewId = -1

$(document).ready(function () {
    resumeId = $('#resumeInfo').attr('resumeId')
    projectId = $('#resumeInfo').attr('projectId')
    interviewId = $('#resumeInfo').attr('interviewId')
    console.log("basicInfo resumeId(",
        resumeId, ") projectId(",
        projectId, ") interviewId(",
        interviewId, ")")
});

$(document).on('click', '#deepContactButton', function () {
    var status = 2;
    submitInterviewById(interviewId, "/api/interviews/", status, '深度沟通');
});

$(document).on('click', '#unlinkButton', function () {
    var status = 2;
    submitInterviewById(interviewId, "/api/interviews/", status, '未接通');
});

//同意面试
$(document).on('click', '#agreeInterviewButton', function () {
    //确认框发短信
    layer.open({
        title: '发送短信',
        content: `<form class="layui-form" action="">
  <div class="layui-form-item">
    <label class="layui-form-label">姓名</label>
    <div class="layui-input-block">
      <input type="text" name="title" required  lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">面试官</label>
    <div class="layui-input-inline">
      <input type="password" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">联系方式</label>
    <div class="layui-input-inline">
      <input type="password" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
   <div class="layui-form-item">
    <label class="layui-form-label">面试地址</label>
    <div class="layui-input-inline">
      <input type="password" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
 <div class="layui-form-item">
    <label class="layui-form-label">温馨提示</label>
    <div class="layui-input-inline">
      <input type="password" name="text" required lay-verify="required" placeholder="" autocomplete="off" class="layui-input">
    </div>
  </div>
<div class="layui-form-item">
    <label class="layui-form-label">面试日期</label>
    <div class="layui-input-inline">
      <input autocomplete="off" type="text" class="layui-input test-item" id="time">
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">面试时间</label>
    <div class="layui-input-inline">
      <input autocomplete="off" type="text" class="layui-input test-item1" id="time1">
  </div>
  <script>
layui.use(['layer', 'form', 'element', 'laydate'], function () {
    var layer = layui.layer, form = layui.form, element = layui.element, laydate = layui.laydate;;
    lay('.test-item').each(function () {
        laydate.render({
            elem: this
            , format: 'yyyy-MM-dd'   
            , trigger: 'click'
        });
        
        
    });
    
    lay('.test-item1').each(function () {
        laydate.render({
            elem: this,
                type: 'time'
    ,min: '10:00:00'
    ,max: '16:00:00'
    ,btns: ['clear', 'confirm']
    , trigger: 'click'
        });
        
        
    });
    
 
    
    form.render();
    
  
});
</script>
`,
        yes: function (index, layero) {
            // layer.alert($('#time').val());
            //发送短信api
            layer.msg('短信发送成功');
            //do something
            layer.close(index); //如果设定了yes回调，需进行手工关闭
                var status = 3;
    submitInterviewById(interviewId, "/api/interviews/", status, '面试');
        }
    })
    // var status = 3;
    // submitInterviewById(interviewId, "/api/interviews/", status, '面试');
});

//放弃面试
$(document).on('click', '#giveupInterviewButton', function () {
    var status = -1;//9;
    submitInterviewById(interviewId, "/api/interviews/", status, '不合适');
});


function submitInterviewById(interviewId, url, status_value, sub_status) {
    //项目Id
    post_selected_value = projectId = $('#resumeInfo').attr('projectId')
    var interview_id = $('#resumeInfo').attr('interviewId')
    var data = {
        "is_active": true,
        "status": status_value,
        "post": post_selected_value,
        "result": "Pending",
        "sub_status": sub_status,
    };

    xhr_common_send("PATCH", url + interview_id + '/', data);

    layer.alert('操作成功', {
        closeBtn: 0
    }, function () {
        parent.layer.closeAll()
    });
}

//====================================
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

