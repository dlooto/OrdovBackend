/*编辑用户基本信息*/
function editUser(){
  $("#userInfo").css("display","none");
  $("#userEdit").css("display","block");
  $("#userEditBtn").css("display","none");
  $("#userSaveBtn").css("display","block");
}

/*保存用户基本信息*/
function saveUser(){
  $("#userInfo").css("display","block");
  $("#userEdit").css("display","none");
  $("#userEditBtn").css("display","block");
  $("#userSaveBtn").css("display","none");
}

/*新增教育经历*/
function addEduc(){
  $("#educEditBtn").css("display","none");
  $("#educSaveBtn").css("display","block");

  var text = '<div class="layui-form-item">'+
  '<span class="layui-col-sm12">'+
  '   开始时间：<input class="layui-input"  autocomplete="off" placeholder="2012" name="educStrDate" id="educStrDate">'+'   </span>'+
  '   <span class="layui-col-sm12">'+
  '   结束时间：<input class="layui-input"  autocomplete="off" placeholder="2012" name="educEndDate" id="educEndDate">'+
  '   </span>'+
  '   <span class="layui-col-sm12">学校：<input type="text" id="" placeholder="请输入学校名称" name="email" autocomplete="off" class="layui-input"></span>'+
  '   <span class="layui-col-sm12">专业：<input type="text" id="" placeholder="请输入专业名称" name="email" autocomplete="off" class="layui-input"></span>'+
  '   <span class="layui-col-sm12">类别：<input type="text" id="" placeholder="本科" name="email" autocomplete="off" class="layui-input"></span>'+
  '   <span class="layui-col-sm12">类别：<input type="text" id="" placeholder="统招" name="email" autocomplete="off" class="layui-input"></span>'+
  '   <span class="layui-col-sm12">'+
  '    <div class="layui-col-sm12">标签：</div>'+
  '<div class="layui-col-sm12"><button class="layui-btn" onclick="addEducLabel(this)"><i class="layui-icon"></i>添加标签</button></div>'+
  '</span>'+
  '<span class="layui-col-sm12">'+
  '   公司简介：<input type="text" id="" placeholder="山东师范大学" name="email" autocomplete="off" class="layui-input">'+
  '   </span>'+
  '   <span class="layui-col-sm12">'+
  '   职位描述及业绩：<input type="text" id="" placeholder="山东师范大学" name="email" autocomplete="off" class="layui-input">'+
  '   </span>'+
  '   </div>';

  $("#educEditCont").append(text);
    layui.use(['laydate','form'], function(){
      var laydate = layui.laydate;
      var form = layui.form;

      //执行一个laydate实例-毕业时间
      laydate.render({
        elem: '#graduationDate' //指定元素
        ,type: 'year'//年选择器
      });

      //执行一个laydate实例-教育开始时间
      laydate.render({
        elem: '#educStrDate' //指定元素
      });

      //执行一个laydate实例-教育结束时间
      laydate.render({
        elem: '#educEndDate' //指定元素
      });

      //执行一个laydate实例-工作开始时间
      laydate.render({
        elem: '#workStrDate' //指定元素
      });

      //执行一个laydate实例-工作结束时间
      laydate.render({
        elem: '#workEndDate' //指定元素
      });
    });
}

/*编辑教育经历*/
function editEduc(){
  $("#educ").css("display","none");
  $("#educEdit").css("display","block");
  $("#educEditBtn").css("display","none");
  $("#educSaveBtn").css("display","block");
}

/*保存教育经历*/
function saveEduc(){
  $("#educ").css("display","block");
  $("#educEdit").css("display","none");
  $("#educEditBtn").css("display","block");
  $("#educSaveBtn").css("display","none");
}

/*添加教育经历标签*/
function addEducLabel(obj){
  var text = '<div class="layui-col-sm10"><input type="text" class="layui-input"></div>'+
  '<div class="layui-col-sm2"><button class="layui-btn layui-btn-danger" onclick="removeEducLabel()"><i class="layui-icon"></i></button></div>';
  var that=event.currentTarget;
  $(event.currentTarget).parent().prepend(text);
}

/*删除教育经历标签*/
function removeEducLabel(){
  $(event.currentTarget).parent().prev().remove();
  $(event.currentTarget).parent().remove();
}

/*新增工作经历*/
function addWork(){
  $("#workEditBtn").css("display","none");
  $("#workSaveBtn").css("display","block");

  var text = '<div class="layui-form-item">'+
  '<span class="layui-col-sm12">'+
  '       开始时间：<input class="layui-input"  autocomplete="off" placeholder="2012"  name="workStrDate" id="workStrDate">'+
  '       </span>'+
  '       <span class="layui-col-sm12">'+
  '       结束时间：<input class="layui-input"  autocomplete="off" placeholder="2012" placeholder="2012" name="workEndDate" id="workEndDate">'+
  '       </span>'+
  '       <span class="layui-col-sm12">'+
  '       公司：<input type="text" id="" placeholder="请输入公司名称" name="" autocomplete="off" class="layui-input">'+
  '       </span>'+
  '       <span class="layui-col-sm12">'+
  '       职位：<input type="text" id="" placeholder="请输入职位" name="" autocomplete="off" class="layui-input">'+
  '       </span>'+
  '       <span class="layui-col-sm12">'+
  '       时间：<input type="text" id="" placeholder="请输入工作时间" name="" autocomplete="off" class="layui-input">'+
  '       </span>'+
  '       <span class="layui-col-sm12">'+
  '       离职原因：<input type="text" id="" placeholder="请输入离职原因" name="" autocomplete="off" class="layui-input">'+
  '       </span>'+
  '   </div>';

  $("#workCont").append(text);

  layui.use(['laydate','form'], function(){
    var laydate = layui.laydate;
    var form = layui.form;

    //执行一个laydate实例-工作开始时间
    laydate.render({
      elem: '#workStrDate' //指定元素
    });

    //执行一个laydate实例-工作结束时间
    laydate.render({
      elem: '#workEndDate' //指定元素
    });
  });
}

/*编辑工作经历*/
function editWork(){
  $("#work").css("display","none");
  $("#workEdit").css("display","block");
  $("#workEditBtn").css("display","none");
  $("#workSaveBtn").css("display","block");
}

/*保存工作经历*/
function saveWork(){
  $("#work").css("display","block");
  $("#workEdit").css("display","none");
  $("#workEditBtn").css("display","block");
  $("#workSaveBtn").css("display","none");
}

layui.use(['laydate','form'], function(){
  var laydate = layui.laydate;
  var form = layui.form;
  //执行一个laydate实例-毕业时间
  laydate.render({
    elem: '#graduationDate' //指定元素
    ,type: 'year'//年选择器
  });

  //执行一个laydate实例-教育开始时间

  laydate.render({
    elem: '#educStrDate' //指定元素
  });

                //执行一个laydate实例-教育结束时间
  laydate.render({
    elem: '#educEndDate' //指定元素
  });

  //执行一个laydate实例-工作开始时间
  laydate.render({
    elem: '#workStrDate' //指定元素
  });

  //执行一个laydate实例-工作结束时间
  laydate.render({
    elem: '#workEndDate' //指定元素
  });
});

function openUser(){
  $("#userModal").modal("show");
}

function checkFile(){
  $("#files").click();
}

