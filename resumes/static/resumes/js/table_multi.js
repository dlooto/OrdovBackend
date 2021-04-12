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

function nav_api(from_city, to_city, row_id, with_alert=false) {
  console.log("From:", from_city, "To:", to_city);
  wordgjFirst(from_city, to_city, row_id);
}

function copyText() {
  var tab = document.getElementById("dataTable_resume");
  var trnum = tab.rows.length;

  var startCity = document.getElementById('working_place_city').value;
  if(typeof startCity == "undefined" || startCity == null || startCity == ""){
    return;
  }
  var startStreet = document.getElementById('working_place_street').value;
  if(typeof startStreet == "undefined" || startStreet == null || startStreet == ""){
    return;
  }
  var start_suite = document.getElementById('working_place_suite').value;
  if(typeof start_suite == "undefined" || start_suite == null || start_suite == ""){
    start_suite=" ";
  }

  var topsoucity = startCity + startStreet + start_suite;

  for (i = 1; i < trnum; i++) {
    var geLocation = document.getElementById("dataTable_resume").rows[i].cells[2].innerHTML;
    var geID = document.getElementById("dataTable_resume").rows[i].cells[0].innerHTML;

    geName = geLocation;
    nav_api(topsoucity, geName, geID, true);
    if(i == trnum - 1){
      var msg = i+"行,数据已处理,起点为["+topsoucity+"]";
      document.getElementById("littleshowid").innerHTML = msg;
    }
  }
}

$(document).ready(function() {
  var post_selected = false;
  var post_selected_value = 0;

  var resumes_selected = [];
  var resume_selected_value = 0;

  var interviews_selected = [];
  var interview_selected_value = 0;

  var filter_status_value = 0;
  var enable_multi = false;

  var toCollapsed = true;

  var post_tag_info;
  var resumeTagInfo;
  var candidatePreferMapInitial;
  var candidatePreferMapChanged;
  var postMap;
  var candidatePreferInfo;

  function empty_multi_selection() {
    //empty resumes
    resumes_selected = [];
    interviews_selected = [];
  }

  /* return redrawed */
  function button_update(table, container, toggle_value) {
    if (!toggle_value) {
      list = container.classList;
      // Can't use toggleClass Here
      //node[0].toggleClass("btn-info");

      container.classList.remove("btn-info");
      container.innerText = "多选[N]";

      empty_multi_selection();
      table.draw();
      return true;
    } else {
      container.classList.add("btn-info");
      container.innerText = "多选[Y]";
      return false;
    }
  }

  var table = $('#dataTable_resume').DataTable({
    dom:
    "<'row'      <'col-sm-12 col-md-8'<'row' <'resume_multi ml-3'B><'ml-3'l>>>       <'col-sm-12 col-md-4'f>   >" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    buttons: [
      {text: '多选[N]',
       action: function (e, dt, node, config) {
         enable_multi = !enable_multi;
         button_update(dt, node[0], enable_multi);
       }}
    ],
    "processing": true,
    "serverSide": true,

    "ajax": {
      "url": "/api/resumes/",
      "type": "GET",
      "beforeSend": function(request) {
        request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
        request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
        request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
        request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
      },
      "data": function (d) {
        d.degree_id_min = $('#degree_id_min').val();
        d.degree_id_max = $('#degree_id_max').val();
        d.age_id_min = $('#age_id_min').val();
        d.age_id_max = $('#age_id_max').val();
        d.graduate_time_min = $('#graduate_time_start').val();
        d.graduate_time_max = $('#graduate_time_end').val();
        d.gender_id = $('#gender_id').val();
        d.province = $('#working_place_province').val();
        d.city = $('#working_place_city').val();
        d.district = $('#working_place_district').val();
        //var list_elements = document.getElementsByClassName("list-group-item active");
        d.status_id = filter_status_value;
        d.post_id = post_selected_value;
      },
	  "error": function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
            //$('#dataTable_resume tbody').clear()
        }

    },

    "rowCallback": function(row, data) {
      var startCity = document.getElementById('working_place_city').value;
      if(typeof startCity == "undefined" || startCity == null || startCity == ""){
        console.log("请输入筛选的--城市!");
        return;
      }

      var startStreet = document.getElementById('working_place_street').value;
      if(typeof startStreet == "undefined" || startStreet == null || startStreet == ""){
        console.log("请输入--公司.街道!");
        return;
      }

      var start_suite = document.getElementById('working_place_suite').value;
      if(typeof start_suite == "undefined" || start_suite == null || start_suite == ""){
        start_suite=" ";
      }

      var topsoucity = startCity + startStreet + start_suite;

      geName = data.current_settle;
      if(typeof geName == "undefined" || geName == null || geName == ""){
        console.log("geName 为空");
      }

      nav_api(topsoucity, geName, data.DT_RowId, false);

      if ($.inArray(data.DT_RowId.toString(), resumes_selected) !== -1 ) {
        $(row).addClass('selected');
      }

    },

    /* default column 0 to desc ordering, how link 0 with the column id?*/
    "order": [[0, "desc"]],
    "columns": [
      {"data": null,
       "visible": false,
       "checkboxes": {
       },
      },
      {"data": "interview_id", "visible": false},
      {"data": "candidate_id", "visible": false},
      {"data": "id",
       "width": "1%"}, // resume id
      {"data": "newname",
       "width": "1%",
       render: function(data, type, row, meta) {
         //var url = t_resume_detail_url;
         if (post_selected)
           return `
<a class="nav-link" href="/manager/resumes/` + row.id + `">` + data + `</a>
`;
         else
           return `
<a class="nav-link disabled" href="/manager/resumes/` + row.id + `">` + data + `</a>
`;
       }
      },
      {"data": "current_settle",
       "width": "5%"
      },
      {"data": "ageg",
       "width": "5%"
      },
      {"data": "phone_number", "visible":false},
      {"data": "email", "visible": false},
      {"data": "majorfull",
       "width": "10%"},

      {"data": "workexp",
       "orderable": false,
       "width": "20%"},
      {"data": "lastmod",
       "width": "5%"},
      {"data": "interview_status_name",
       "orderable": false,
       "width": "5%"
      },

      /* ================================================================================ */
      {"data": "interview_status",
       "orderable": false,
       "width": "15%",
       render: function(data, type, row, meta) {

         /* -------------------------------------------------------------------------------- */
         if (filter_status_value == -1) {
           return `
                <div class="btn-group">
                --
                </div>
`;
         }
         else if (row.interview_status == 0) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_zero_ai btn btn-sm " id="` + row.id + `">AI</button>
                <button type="button" class="stage_zero_sms btn btn-sm " id="` + row.id + `">短信</button>
                <button type="button" class="stage_zero_pass btn btn-sm " id="` + row.id + `">通过</button>
                <button type="button" class="stage_zero_fail btn btn-sm " id="` + row.id + `">结束</button>
                <div style="width: 120px;height: auto;background-color: white" id="` +'aaadiv'+ row.id + `">地图初始值11:13</div>
                <div style="width: 120px;height: auto;background-color: white" id="` +'bbbdiv'+ row.id + `"></div>
                </div>
          `;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 1) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_one_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">通过</button>
                <button type="button" class="stage_one_show btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">显示</button>
                <button type="button" class="stage_one_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">结束</button>
                </div>

`;
         }
         /* -------------------------------------------------------------------------------- */
         // TBD: Do we need to restore resume_id into DOM data-resume_id in every element?
         else if (row.interview_status == 2) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_two_dail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">拨号面试</button>
                <button type="button" class="stage_two_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">通过</button>
                <button type="button" class="stage_two_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">结束</button>
                <button type="button" class="stage_two_test btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">Test</button>
                </div>

`;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 3) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_three_miss btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">未到场</button>
                <button type="button" class="stage_three_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">通过</button>
                <button type="button" class="stage_three_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">未通过</button>
                </div>
`;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 4) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_four_update btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">更新</button>
                <button type="button" class="stage_four_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">接受</button>
                <button type="button" class="stage_four_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃</button>
                </div>
`;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 5) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_five_update btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">更期入职</button>
                <button type="button" class="stage_five_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">已入职</button>
                <button type="button" class="stage_five_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃</button>
                </div>
`;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 6) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_six_giveup btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">放弃考察</button>
                <button type="button" class="stage_six_pass btn btn-sm " id="` + row.interview_id + `" + data-resume_id="` + row.id + `">通过</button>
                <button type="button" class="stage_six_fail btn btn-sm " id="` + row.interview_id + `" + data-resume_id="` + row.id + `">未通过</button>
                </div>

`;
         }
         /* -------------------------------------------------------------------------------- */
         else if (row.interview_status == 7) {
           return `
                <div class="btn-group">
                <button type="button" class="stage_seven_register btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">登记</button>
                <button type="button" class="stage_seven_bill btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">发票</button>
                <button type="button" class="stage_seven_pass btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">完成</button>
                <button type="button" class="stage_seven_fail btn btn-sm " id="` + row.interview_id + `" data-resume_id="` + row.id + `">坏账</button>
                </div>
`;
         }
         /* -------------------------------------------------------------------------------- */
         else {
           return "流程结束";
         }
       }},
    ],
  });

  /* ================================================================================ */

  var table_post = $('#dataTable_post').DataTable({
    "dom": '<"top"i>rt<"bottom"l<"post_search" f>p><"clear">',
    "lengthChange": false,
    "pageLength" : 15,
    "pagingType": "simple",
    "processing": false,
    "serverSide": true,

    "scrollX": false,
    "scrollCollapse": false,
    "searching": true,

    "ajax": {
      "url": "/api/posts/",
      "type": "GET",
      "beforeSend": function(request) {
        request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
        request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
        request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
        request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
      },
	  "error": function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(jqXHR.status);
            console.log(jqXHR.readyState);
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
            alert("Sorry, 您没有权限遍历当前项目")
        }

    },

    "rowCallback": function(row, data) {

      if ((post_selected === true) && (data.DT_RowId == post_selected_value)) {
        $(row).addClass('selected');
      }
    },

    "columns": [
      {"data": "project_name",
      },
    ],
  });

  /* ======================================== Process Begin Here */

  $(function(){
    /* flush table every 100s */
    setInterval(flush,1000);
    function flush(){
        if (post_selected_value > 0 && interview_selected_value == 1) {
            page_refresh(table, true);
        }
    }
  })

  $('#age_id_min, #age_id_max').keyup(function() {
    page_refresh(table, true);
  });

  $('#working_place_province, #working_place_city, #working_place_district').keyup(function() {
    page_refresh(table, true);
  });

  $('#degree_id_min, #gender_id, #degree_id_max').change(function() {
    page_refresh(table, true);
  });

  $('#graduate_time_start, #graduate_time_end').change(function() {
    page_refresh(table, true);
  });

  $('#closeProject').click(function() {
    $('#projectPanel').css('display', 'none')
    $('#mainOpPanel').removeClass('col-md-10')
    $('#mainOpPanel').addClass('col-md-12')
    // show the right arrow in the left side
    $('#projectSelectShow').css('display', 'inline')
  });

  $('#projectSelectShow').click(function() {
    $('#projectPanel').css('display', 'inline')
    $('#mainOpPanel').removeClass('col-md-12')
    $('#mainOpPanel').addClass('col-md-10')
    // show the right arrow in the left side
    $('#projectSelectShow').css('display','none')
  });

  $('.list-group-item').on('click', function(e) {
    filter_status_value = this.value;
    page_refresh(table, true);
  });

  $('#table_Status').on('click', function(e) {
    if (post_selected == false) {
      alert("请先选择职位.");
      e.stopPropagation();
    } else {
      $('#ai_status').val('-')
      $('#ai_status_action').val('-')
      $('#ai_status_and_action').val('-')
      $('#aiSelectModal').modal('toggle')
    }
  });

  $('#ai_status_action').on('change', function(e) {
    var newStr = "对于AI状态: "+$('#ai_status').val() +" 的记录,"+ "作"+$('#ai_status_action').val()+"处理"
    console.log(newStr)
    $('#ai_status_and_action').val(newStr)
  });

  $('#aiStatusActionSubmit').on('click', function(e) {
    var post_id = post_selected_value
    $.ajax({
      method: "POST",
      url: "/interview/ai/update/",
      data: {
        post_id: post_id,
        ai_status: $('#ai_status').val(),
        ai_status_action: $('#ai_status_action').val(),
      },
      success: function(response) {
        page_refresh(table, true);
        $('#ai_status').val('-')
        $('#ai_status_action').val('-')
        $('#ai_status_and_action').val('done!')
      },
    });
  });

  function format(d) {
    var data = format_inner(d)
    var sData = JSON.parse(data)
    return '<div class=".container">'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<p style="display:inline;">'+"籍贯:"+'</p>'+
            '<p style="display:inline;">'+sData.birthorigin+'</p>'+
          '</div>' +
          '<div class="col-md-2">'+
            '<p style="display:inline;">'+"电话:"+'</p>'+
            '<p style="display:inline;">'+sData.phone_number+'</p>'+
          '</div>' +
          '<div class="col-md-4">'+
            '<p style="display:inline;">'+"毕业时间:"+'</p>'+
            '<p style="display:inline;">'+sData.graduate_time+'</p>'+
          '</div>' +
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-8">'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "现工作地:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + "--" + '</span>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "期望工作地点:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + sData.expected + '</span>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "期望岗位类型:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + "--" + '</span>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "期望薪资:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + "--" + '</span>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
          '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "最近一份工作经历:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + sData.workexp + '</span>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-md-2">'+
       '</div>' +
          '<div class="col-md-2">'+
            '<span>'+ "最高学历:" +'</span>'+
          '</div>' +
          '<div class="col-md-8">'+
            '<span>' + sData.school+ ' ' + sData.major + ' ' + sData.degree +'</span>'+
          '</div>'+
        '</div>'+
        '</div>';
  };

  function format_inner(d) {
	var resume_id = d.id
	return $.ajax({
	  url: '/api/resumes/' + resume_id + '/',
	  type: 'GET',
      "beforeSend": function(request) {
        request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
        request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
        request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
        request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
      },
	  data: null,
	  async: false
	}).responseText;
  };

  // resume table
  $('#dataTable_resume tbody').on('click', 'tr', function(e) {
    if (post_selected == false) {
      //alert("Please select Post first.");
      alert("请先选择职位.");
      e.stopPropagation();
    } else {
      // All interactive elements should be excluded here.
      if ($(e.target).hasClass('btn')) {
        return;
      }

      if (enable_multi) {
        // Multiple Selection
        var id = this.id;
        var interview_id = -1;
        try {
          // TBD: more gerneric and accurate way to get interview_id
          interview_id = this.lastChild.firstElementChild.firstElementChild.id;
          if (interview_id === "")
            interview_id = -1;
        } catch {
          interview_id = -1;
        }

        var index = $.inArray(id, resumes_selected);

        if ( index === -1 ) {
          resumes_selected.push(id);

          if (interview_id >= 0)
            interviews_selected.push(interview_id);
        } else {
          resumes_selected.splice(index, 1);

          if (interview_id >= 0)
            interviews_selected.splice(index, 1);
        }

        $(this).toggleClass('selected');
      } else { // not enable_multi
		var tr = $(this).closest('tr')
		var row = table.row(tr)
		if (row.child.isShown()) {
		  row.child.hide();
		  tr.removeClass('shown')
		}
		else {
		  // Open this row
		  row.child(format(row.data())).show();
		  row.child(format(row.data())).show()
		  tr.addClass('shown')
        }
      }
    }
  });

  function page_refresh(table, reset_flag = false) {
    /*
        Shoud Never call xhr_common_send in xhr_common_send
     */
    if (post_selected_value < 0) {
        return
    }

    $.ajax({
      url: "/manager/resumes/statistic/" + post_selected_value + "/",
      type: 'GET',
      "beforeSend": function(request) {
        request.setRequestHeader("ORDOV-INTERVIEW-ID", interview_selected_value);
        request.setRequestHeader("ORDOV-POST-ID", post_selected_value);
        request.setRequestHeader("ORDOV-RESUME-ID", resume_selected_value);
        request.setRequestHeader("ORDOV-STATUS-ID", filter_status_value);
      },
      data: null,
      success: function(response) {
        document.getElementById("badge_statistic_stage_0").innerHTML = response.resumes_waitting;
        for (var i = 1; i <= response.interviews_status_filters.length; i++) {
          document.getElementById("badge_statistic_stage_" + i).innerHTML = response.interviews_status_filters[i-1];
        }
      }
	});

    empty_multi_selection();
    enable_multi = false;

    // WTF? So many 0s... the first buttons's first child, there're two API:
    // containers() and container(), I can't distinguish them since both of them need to get [0]

    button_container = table.buttons().container()[0].children[0];
    redrawed = button_update(table, button_container, enable_multi);

    if (!redrawed) {
      table.draw(reset_flag);
    }
  }

  function xhr_common_send(method, url, data, succCallback=null, needRefresh=true) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    xhr.setRequestHeader('ORDOV-INTERVIEW-ID', interview_selected_value);
    xhr.setRequestHeader('ORDOV-POST-ID', post_selected_value);
    xhr.setRequestHeader('ORDOV-RESUME-ID', resume_selected_value);
    xhr.setRequestHeader('ORDOV-STATUS-ID', filter_status_value);

    var csrftoken = getCookie('csrftoken');

    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    console.log("------------------------------------>")

    xhr.onloadend = function() {
      //done
      if (needRefresh) {
        page_refresh(table);
      }
    };

    xhr.onreadystatechange=function() {
      if (xhr.readyState === 4){ //if complete
        // 2xx is ok, ref: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
        if(xhr.status >= 200 && xhr.status < 300) {
            if (succCallback) {
                succCallback(JSON.parse(xhr.response))
            }
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
    console.log("send: ", JSON.stringify(data))
    xhr.send(JSON.stringify(data));
  }

  function create_interview(resume_id, post_id, url, status_value, sub_status, is_active=true) {
    data = {"resume": resume_id,
            "post": post_id,
            "is_active": is_active,
            "status": status_value,
            "sub_status": sub_status,
            "result": is_active ? "Pending" : "Stopped",
           };

    /* POST: create the new item */
    xhr_common_send("POST", url, data);
  }

  function stop_interview(interview_id, resume_id, post_id, url, status_value, sub_status, is_active=false) {
    data = {"resume": resume_id,
            "post": post_id,
            "is_active": is_active,
            "status": status_value,
            "sub_status": sub_status,
            "result": is_active ? "Pending" : "Stopped",
           };

    /* POST: create the new item */
    xhr_common_send("PATCH", url + interview_id + '/', data);
  }

  // short-cut for xx-by_compound
  function submit_interview_by_id(interview_id, url, status_value, sub_status) {
    data = {"is_active":true,
            "status": status_value,
            "post": post_selected_value,
            "result":"Pending",
            "sub_status":sub_status,
           };

    xhr_common_send("PATCH", url + interview_id + '/', data);
  }

  /* Save Interview Sub Table */
  function create_interviewsub_info(url, table, data) {
    xhr_common_send("POST", url, data);
  }

  /* Save Interview Sub Table */
  function create_interviewsub_info_test(url, table, data) {
    xhr_common_send("GET", url, data);
  }


  function helper_get_selectbox_text(select_id) {
    console.log("id: ", select_id)
    select_box = document.getElementById(select_id);
    text_box = select_box.options[select_box.selectedIndex].innerHTML;

    return text_box;
  }

  function helper_get_textbox_text(text_id) {
    text_box = document.getElementById(text_id);
    if (text_box != null) {
        return text_box.value;
    }
    return ""
  }

  function show_post_modal(post_id, callback) {
    xhr_common_send('GET', '/api/posts/' + post_id + '/', null, function(response){
        /* here the abbreviation is not work, don't know why. Since the getElementbyid method is the most effience one, use it. */
        //$('#text_postinfo_company').value = response.department.company.name;
        //document.querySelector('#text_postinfo_company').value = response.department.company.name;
        document.getElementById("text_postinfo_company").value = response.department.company.name;
        document.getElementById("text_postinfo_department").value = response.department.name;
        document.getElementById("text_postinfo_post").value = response.name;
        document.getElementById("text_postinfo_description").value = response.description;
    })
  }

  function show_ai_config_modal(resume_id) {
    xhr_common_send('GET', '/api/posts/' + post_selected_value + '/', null, function(response){
        document.getElementById("config_ai_task_name").value = response.baiying_task_name;
    })
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
        document.getElementById("text_name").value = response.username;
        document.getElementById("text_phone_number").value = response.phone_number;
        $('#dialModal').modal('toggle');
    })
  }

  function show_resume_modal(resume_id, callback) {
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
        /*
        document.getElementById("candidate_text_resumeinfo_username").value = response.username;
        document.getElementById("candidate_text_resumeinfo_degree").value = response.degree;
        document.getElementById("candidate_text_resumeinfo_school").value = response.school;
        document.getElementById("candidate_text_resumeinfo_phone_number").value = response.phone_number;
        */
    })
  }

  function show_callCandidate_modal(post_id, resume_id) {
    console.log(post_id)
    getPostTagInfo(post_id)
    initCandidatePostTagInfo(resume_id)
    show_post_modal(post_id, false);
    show_resume_modal(resume_id, false);
    // TBD: no error handler
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
        console.log("response", response)
            /*
        document.getElementById("dail_text_expected_salary").value = response.expected_salary;
        document.getElementById("dail_text_expected_place_province").value = response.expected_province;
        document.getElementById("dail_text_expected_place_city").value = response.expected_city;
        document.getElementById("dail_text_expected_place_district").value = response.expected_district;
        document.getElementById("dail_text_expected_place_street").value = response.expected_street;
        */
        //document.getElementById("").value = response.phone_number;
    })
    $('#dailToCandidateModal').modal('toggle');
    updatePostAndCandidateShowInfo()
    //$('#myModal').modal('toggle');
  }

  function show_ai_info(resume_id, post_id) {

    xhr_common_send('GET', "/interview/ai/info?resume_id=" + resume_id + "&post_id=" + post_id, null, function(response){
		console.log("success: ", response)
        console.log(response.phoneLogs)
        $('#ai_result_panel').val(response.phoneLogs)
        $('#ai_result_duration').text(response.phoneDuration)
        $('#ai_result_projname').text(response.phoneJobName)
        $('#ai_result_tag').text(response.phoneTags)
        $('#aiResult').modal('toggle')
    })
  }

  function show_stop_modal(interview_id, resume_id) {
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
        document.getElementById("text_terminate_expected_province").value = response.expected_province;
        document.getElementById("text_terminate_expected_city").value = response.expected_city;
        document.getElementById("text_terminate_expected_district").value = response.expected_district;
    })
    $('#stopModal').modal('toggle')
  }

  function show_entry_update_modal(interview_id) {
    xhr_common_send('GET', '/interviews/sub/offer/' + interview_id + '/', null, function(response){
        document.getElementById("text_entryupdate_date").value = response.date;
        document.getElementById("text_entryupdate_contact").value = response.contact;
        document.getElementById("text_entryupdate_contact_phone").value = response.contact_phone;
        document.getElementById("text_entryupdate_address").value = response.address;
        document.getElementById("text_entryupdate_postname").value = response.postname;
        document.getElementById("text_entryupdate_certification").value = response.certification;
        document.getElementById("text_entryupdate_salary").value = response.salary;
        document.getElementById("text_entryupdate_notes").value = response.notes;
        $('#entryUpdateModal').modal('toggle');
    })
  }

  // ================================= CLICKS ===============================================
  function tmp_not_support_multi() {
    if (enable_multi)
      alert("This button not support multi-sel event yet!");
  }

  function multisel_submit_wrapper(callback) {
    if (!enable_multi) {
      callback(interview_selected_value);
    } else {
      for (var i = 0; i < interviews_selected.length; i++) {
        callback(interviews_selected[i]);
      }
    }
  }

  function multisel_submit_wrapper_resumeid(callback) {
    if (!enable_multi) {
      callback(resume_selected_value);
    } else {
      for (var i = 0; i < resumes_selected.length; i++) {
        callback(resumes_selected[i]);
      }
    }
  }

  function do_common_plain_submit(interview_id, modal_name, status, sub_status) {
    $(modal_name).modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, sub_status);
  }

  $(document).on('click', '.invite_button', function() {
    resume_selected_value = Number(this.id);
    alert(resume_selected_value);
    tmp_not_support_multi();
  });

  $(document).on('click', '.stage_zero_ai', function() {
    resume_selected_value = Number(this.id);
    show_ai_config_modal(resume_selected_value);
  });

  // TBD: ?
  $(document).on('click', '.stage_zero_sms', function() {
  });

  /*
    About multiple selection
    If the element is for POPUP MODAL, then leave it unchanged.
    If the element is for SUBMIT, then use the multisel* wrapper.
   */
  function do_stage_zero_pass(resume_id) {
    create_interview(resume_id, post_selected_value, "/api/interviews/", 2, '邀约');
  }

  $(document).on('click', '.stage_zero_pass', function() {
    resume_selected_value = Number(this.id);
    multisel_submit_wrapper_resumeid(do_stage_zero_pass);
  });

  function do_stage_zero_fail(resume_id) {
	resume_selected_value = Number(this.id)
    create_interview(resume_id, post_selected_value, "/api/interviews/", 0, "初选-终止", false);
  }

  $(document).on('click', '.stage_zero_fail', function() {
    resume_selected_value = Number(this.id);
    multisel_submit_wrapper_resumeid(do_stage_zero_fail);
  });

  $(document).on('click', '.stage_one_pass', function() {
    interview_selected_value = Number(this.id);
    $('#nextModal').modal('toggle')
  });

  $(document).on('click', '.stage_one_show', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	show_ai_info(resume_selected_value, post_selected_value)
  });

  $(document).on('click', '.stage_one_fail', function() {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
	resume_selected_value = Number(this.dataset.resume_id)
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_two_test', function() {
	interview_selected_value = Number(this.id);
	resume_id = this.dataset.resume_id;
	resume_selected_value = Number(this.dataset.resume_id)
	// construct the url
	url="callInterview?resume_id="+resume_id+
        "&project_id="+post_selected_value+
        "&interview_id="+interview_selected_value+
        "&stage_id=2";
	xadmin.open('标题', url)
  });

  $(document).on('click', '.stage_two_dail', function() {
	interview_selected_value = Number(this.id);
	resume_id = this.dataset.resume_id;
	resume_selected_value = Number(this.dataset.resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_two_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    // This is a popup
    $('#appointmentModal').modal('toggle')
  });
  $(document).on('click', '.stage_two_fail', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_three_miss', function() {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
	resume_selected_value = Number(this.dataset.resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });
  $(document).on('click', '.stage_three_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response) {
        document.getElementById("text_interview_resumeinfo_username").value = response.username;
        document.getElementById("text_interview_resumeinfo_phone_number").value = response.phone_number;
    })
	$('#interviewResultModal').modal('toggle')
  });
  $(document).on('click', '.stage_three_fail', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = this.dataset.resume_id
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_four_update', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
	    document.getElementById("text_update_offer_resumeinfo_username").value = response.username;
		document.getElementById("text_update_offer_resumeinfo_phone_number").value = response.phone_number;
    })
    $('#offerUpdateModal').modal('toggle')
  });
  $(document).on('click', '.stage_four_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
		document.getElementById("text_offer_resumeinfo_username").value = response.username;
		document.getElementById("text_offer_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#offerModal').modal('toggle')
  });
  $(document).on('click', '.stage_four_fail', function() {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
	resume_selected_value = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_five_update', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;
    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
		document.getElementById("text_entry_update_resumeinfo_username").value = response.username;
		document.getElementById("text_entry_update_resumeinfo_phone_number").value = response.phone_number;
    })
    // This is a popup
    show_entry_update_modal(interview_selected_value);
  });

  $(document).on('click', '.stage_five_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
		document.getElementById("text_entry_resumeinfo_username").value = response.username;
		document.getElementById("text_entry_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#entryedModal').modal('toggle')
  });

  $(document).on('click', '.stage_five_fail', function() {
    interview_selected_value = Number(this.id);
    resume_id = this.dataset.resume_id;
	resume_selected_value = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_six_giveup', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    resume_id = this.dataset.resume_id;
    //show_stop_modal(interview_selected_value, resume_id)
    show_callCandidate_modal(post_selected_value, resume_id);
  });

  $(document).on('click', '.stage_six_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
	resume_id = this.dataset.resume_id;

    xhr_common_send('GET', '/api/resumes/' + resume_id + '/', null, function(response){
		document.getElementById("text_probation_resumeinfo_username").value = response.username;
		document.getElementById("text_probation_resumeinfo_phone_number").value = response.phone_number;
    })

    $('#probationSuccModal').modal('toggle')
  });

  $(document).on('click', '.stage_six_fail', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    $('#probationFailModal').modal('toggle')
  });

  $(document).on('click', '.stage_seven_register', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    $('#pbRegisterModal').modal('toggle')
  });

  $(document).on('click', '.stage_seven_bill', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    $('#pbInvoiceModal').modal('toggle')
  });

  $(document).on('click', '.stage_seven_pass', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    $('#pbFinishModal').modal('toggle')
  });

  $(document).on('click', '.stage_seven_fail', function() {
    interview_selected_value = Number(this.id);
	resume_selected_value = Number(this.dataset.resume_id)
    $('#pbBaddebtModal').modal('toggle');
  });

  // post table

  $('#dataTable_post tbody').on('click', 'tr', function() {
    var id = this.id;

    if (id === post_selected_value && post_selected === true) {
      $(this).toggleClass('selected');
      post_selected = false;

      document.getElementById("text_company_name").innerHTML = "选择项目";
    } else {
      $(this).toggleClass('selected');

      if (post_selected === true) {
        $('tr#' + post_selected_value).toggleClass('selected');
      }
      post_selected = true;
      post_selected_value = id;
      getCurPermSync(id);
      getPostTagInfo(id);
      // update the smart tag info

      var tr = document.getElementById(id);

      console.log('post_selected_value',post_selected_value);

      $.ajax({
        url:'/api/posts/' + post_selected_value + '/',
        type: 'GET',
        data: null,
        success: function(response) {
          // update filter also, so the filter strategy is changed that:
          // the widget will display the post's address value, then the actual filter will only refer to the widget value but not the post value
          document.getElementById("working_place_province").value = response.address_province;
          document.getElementById("working_place_city").value = response.address_city;
          document.getElementById("working_place_district").value = response.address_district;
          document.getElementById("working_place_street").value = response.address_street;
          document.getElementById("working_place_suite").value = response.address_suite;

          page_refresh(table);
        },
        error: function() {
          console.log("get resume info failed");
        },
      });



      document.getElementById("text_company_name").innerHTML = tr.innerText;
      document.getElementById("projectName").innerHTML = tr.innerText;
    }
  });

  function do_dial_submit(resume_id) {
    var post_id = post_selected_value;
    var status = 1;

    $.ajax({
      type: "POST",
      url:'/interview/ai/task/',
      data: $('#ai_config_form').serialize(),
    });

    $('#dialModal').modal('hide');

    create_interview(resume_id, post_id, "/api/interviews/", status, 'AI面试');
  }

  $(function(){
    $('#dialFormSubmit').click(function(e){
      e.preventDefault();
      multisel_submit_wrapper_resumeid(do_dial_submit);
    });
  });

  $(function() {
    $('#projSelectorBtn').click(function(e) {
      e.preventDefault();
      $('#projSelector').modal('show')
    });
  });

  function getCurPermSync(post_id) {
      $('#projPermInfo').empty()
      //$('#projPermInfo').append("<span>"+"当前的权限分配信息如下:"+"</span>")
      console.log("Enter getCurPermSync---->", post_id)

      xhr_common_send('GET', '/api/permissions/?post_id=' + post_id, null, function(response){
            //console.log("response ", response)
            result=""
            $.each(response.results, function(index, ele) {
                result += ele.stage_name+":"+ele.user_name+"\n";
            });
            console.log(result)
            //$('#projPermInfo').append('<span style="display:inline">'+ele.stage_name + ':' + ele.user_name + '</span>')
            $('#projPermInfo').val(result)
      })
  }
  getRecruiterSync()
/*
  $('#cRecruiter').click(function(e) {
    console.log("click the cRecruiter selector")
  });
  */

  $('#permOp').change(function(e) {
      var stage = $('#interview_stage_id').val()
      var who = $('#cRecruiter').val()
      var op = $('#permOp').val()
      var fields = 'post=' + post_selected_value + '&user=' + who + '&stage=' + stage
      $('#permOp').val("")
	  $('#interview_stage_id').val("")
      $('#cRecruiter').val("")
	  data = {
		"post": post_selected_value,
		"user": who,
		"stage": stage,
	  }
      console.log("Permission Info: ", data)
      if (op=="增加") {
	    xhr_common_send('POST', '/api/permissions/', data)
        setTimeout(getCurPermSync, 1000, post_selected_value)
        setTimeout(getCurPermSync, 2000, post_selected_value)
        //setTimeout("getCurPermSync(post_selected_value)", 1000)
      } else if (op == "删除") {
        // step1: get the item
        if ((post_selected_value <= 0) || who <= 0 || stage.length <= 0) {
           alert("请确保职位等信息")
           console.log("Fail", post_selected_value, who, stage)
           return
        }

        xhr_common_send('GET', '/api/permissions/?post=' + post_selected_value + '&user=' + who + '&stage=' + stage, null, function(response){
            console.log('/api/permissions/?post_id=' + post_selected_value + '&user=' + who + '&stage=' + stage)
            $.each(response.results, function(index, ele) {
                console.log(ele)
                console.log(stage.includes(ele.stage_id))
                if (stage.includes(ele.stage_id.toString(10)) &&
                    (post_selected_value == ele.post_id) &&
                    (who == ele.user_id)) {
                    console.log("to delete index: ", index, " ", ele.id)
                    xhr_common_send('DELETE', '/api/permissions/'+ele.id+'/', null)
                } else {
                    console.log("No need to delete", ele.user_name)
                }
                setTimeout(getCurPermSync, 1000, post_selected_value)
                setTimeout(getCurPermSync, 2000, post_selected_value)
            });
        })

      }
      getCurPermSync(post_selected_value)
		/*
      $.ajax({
        url:'/api/permissions/' ,
        type: 'POST',
        data: fields,
        success: function(response) {
            getCurPermSync(post_selected_value)
        },
        error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
                console.log(jqXHR.status);
				console.log(jqXHR.readyState);
                console.log(jqXHR.statusText);
                console.log(textStatus);
                console.log(errorThrown);

            alert('Sth Wrong')
        },
      });
		*/
  });

  function getRecruiterSync() {
      $('#cRecruiter').html("")
      $('#cRecruiter').prepend('<option value=""></option>')
      console.log("Enter getRecruiterSync ---->")
        xhr_common_send('GET', '/api/accounts/?user_type=Recruiter', null, function(response){
          $.each(response.results, function(index, ele){
              $('#cRecruiter').append('<option value=' + ele.id + '>' + ele.username + '</option>')
          })
        })
  }

  $(function() {
    $('#projPermissionBtn').click(function(e) {
		if (toCollapsed) {
			toCollapsed = false;
            $(".sidebar2.right").trigger("sidebar:open");
        } else {
            toCollapsed = true;
            $(".sidebar2.right").trigger("sidebar:close");
        }

      return
      e.preventDefault();
      // step0: Get the all recruiter
      // step1: First should update the header
      console.log("post_seelcted_value", post_selected_value)

        xhr_common_send('GET', '/api/posts/' + post_selected_value + '/', null, function(response){
            $('#projPermName').text(response.name)
            $('#permOp').val("")
            $('#interview_stage_id').val("")
            console.log("pre getRecruiterSync")
            getRecruiterSync()
            console.log("post getRecruiterSync")
            console.log("pre getCurPermSync")
            getCurPermSync(post_selected_value)
            console.log("~~~~~~");
            $('#projPermission').modal('show')
            console.log("show le ne");
        })

      // step2: Then the all recruiter

    });
  });

  function do_next_submit(interview_id) {
    var status = 2;
    $('#nextModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '邀约');
  }

  $('#nextSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_next_submit);
  });

  function do_stop_submit(interview_id) {
    $('#stopModal').modal('hide');

    data = {
      "interview": interview_id,
      "expected_industry": helper_get_selectbox_text("text_terminate_expected_industry"),
      "expected_post": helper_get_selectbox_text("text_terminate_expected_post"),
      "expected_shift": helper_get_selectbox_text("text_terminate_expected_shift"),

      "expected_salary": helper_get_textbox_text("text_terminate_expected_salary"),
      "expected_notes": helper_get_textbox_text("text_terminate_expected_notes"),
      "expected_province": helper_get_textbox_text("text_terminate_expected_province"),
      "expected_city": helper_get_textbox_text("text_terminate_expected_city"),
      "expected_district": helper_get_textbox_text("text_terminate_expected_district"),

      "expected_insurance": helper_get_selectbox_text("text_terminate_expected_insurance"),
      "expected_insurance_schedule": helper_get_selectbox_text("text_terminate_expected_insurance_schedule")
    };

    create_interviewsub_info("/interviews/api/terminate_sub/", table, data);
  }

  function do_update_resume(resume_id) {
     data = {
      "id": resume_id,
      "hunting_status": $('#text_terminate_hunting_status').val(),
      "expected_industry": helper_get_selectbox_text("text_terminate_expected_industry"),
      "expected_post": helper_get_selectbox_text("text_terminate_expected_post"),
      "expected_shift": helper_get_selectbox_text("text_terminate_expected_shift"),

      "expected_salary": helper_get_textbox_text("text_terminate_expected_salary"),
      "expected_notes": helper_get_textbox_text("text_terminate_expected_notes"),
      "expected_province": helper_get_textbox_text("text_terminate_expected_province"),
      "expected_city": helper_get_textbox_text("text_terminate_expected_city"),
      "expected_district": helper_get_textbox_text("text_terminate_expected_district"),

      "expected_insurance": helper_get_selectbox_text("text_terminate_expected_insurance"),
      "expected_insurance_schedule": helper_get_selectbox_text("text_terminate_expected_insurance_schedule")
     }
    xhr_common_send('PUT', '/api/resumes/' + resume_id + '/', data)
  }

  $('#stopFormSubmit').click(function(e){
    e.preventDefault();
    do_update_resume(resume_selected_value);
    do_stop_submit(interview_selected_value);
    //multisel_submit_wrapper(do_stop_submit);
  });

  function do_interviewResult_submit(interview_id) {
    $('#interviewResultModal').modal('hide');
    data = {
      "interview": interview_id,
      "result_type": 3,
      "comments": helper_get_textbox_text("text_interviewresult_comments"),
    };

    // step1: update the interview result
    create_interviewsub_info("/interviews/api/interview_sub/", table, data);
    // step2: the interview stage to next
    submit_interview_by_id(interview_id, "/api/interviews/", 4, 'OFFER')
  }

  $('#interviewResultFormSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_interviewResult_submit);
  });

  function do_offerInfo_submit(interview_id) {
    $('#offerModal').modal('hide');
    data = {
      "interview": interview_id,
      "result_type": 3,
      "date": helper_get_textbox_text("text_offerinfo_date"),
      "contact": helper_get_textbox_text("text_offerinfo_contact"),
      "contact_phone": helper_get_textbox_text("text_offerinfo_contact_phone"),
      "address": helper_get_textbox_text("text_offerinfo_address"),
      "postname": helper_get_textbox_text("text_offerinfo_postname"),
      "certification": helper_get_textbox_text("text_offerinfo_certification"),
      "salary": helper_get_textbox_text("text_offerinfo_salary"),
      "notes": helper_get_textbox_text("text_offerinfo_notes")


    };

    // step1:
    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
    // step2:
    submit_interview_by_id(interview_id, "/api/interviews/", 5, '入职')
  }

  function do_offerInfoUpdate_submit(interview_id) {
    $('#offerUpdateModal').modal('hide');
    data = {
      "interview": interview_id,
      "result_type": 3,
      "date": helper_get_textbox_text("text_update_offerinfo_date"),
      "contact": helper_get_textbox_text("text_update_offerinfo_contact"),
      "contact_phone": helper_get_textbox_text("text_update_offerinfo_contact_phone"),
      "address": helper_get_textbox_text("text_update_offerinfo_address"),
      "postname": helper_get_textbox_text("text_update_offerinfo_postname"),
      "certification": helper_get_textbox_text("text_update_offerinfo_certification"),
      "salary": helper_get_textbox_text("text_update_offerinfo_salary"),
      "notes": helper_get_textbox_text("text_update_offerinfo_notes")

    };
    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
  }

  $('#offerSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_offerInfo_submit);
  });

  $('#offerUpdateSubmit').click(function(e) {
    e.preventDefault();
    multisel_submit_wrapper(do_offerInfoUpdate_submit);
  });

  function do_entryed_submit(interview_id) {
    do_common_plain_submit(interview_id, '#entryedModal', 6, '考察');
  }

  $('#entryedSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_entryed_submit);
  });

  function do_entryUpdate_submit(interview_id) {
    $('#entryUpdateModal').modal('hide');
    //var status = 5;

    data = {
      "interview": interview_id,
      "result_type": 4,
      "date": helper_get_textbox_text("text_entryupdate_date"),
      "contact": helper_get_textbox_text("text_entryupdate_contact"),
      "contact_phone": helper_get_textbox_text("text_entryupdate_contact_phone"),
      "address": helper_get_textbox_text("text_entryupdate_address"),
      "postname": helper_get_textbox_text("text_entryupdate_postname"),
      "certification": helper_get_textbox_text("text_entryupdate_certification"),
      "salary": helper_get_textbox_text("text_entryupdate_salary"),
      "notes": helper_get_textbox_text("text_entryupdate_notes")

    };

    create_interviewsub_info("/interviews/api/offer_sub/", table, data);
  }

  $('#entryUpdateSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_entryUpdate_submit);
  });

  function do_probationSucc_submit(interview_id) {
    do_common_plain_submit(interview_id, '#probationSuccModal', 7, '回款');
  }

    // only update the entry info
  $('#probationSuccSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_probationSucc_submit);
  });

  function do_probationFail_submit(interview_id) {
    $('#probationFailModal').modal('hide');
    data = {
      "interview": interview_id,
      "result_type": 3,
      "reason": helper_get_textbox_text("text_probation_reason"),
      "comments": helper_get_textbox_text("text_probation_comments")
    };

    /* This is different with other terminate modal, because it contains the probation fail reason */
    // step1:
    create_interviewsub_info("/interviews/api/probation_sub_fail/", table, data);
    // step2:
    stop_interview(interview_id, resume_id, post_selected_value, "/api/interviews/", 6, '考察期-终止');
  }

    // only update the entry info
  $('#probationFailSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_probationFail_submit);
  });

  function do_pbInvoice_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbInvoiceModal', 7, '回款');
  }

    // only update the entry info
  $('#pbInvoiceSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_pbInvoice_submit);
  });

  function do_pbBaddebt_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbBaddebtModal', 7, '坏账');
  }

 // only update the entry info
  $('#pbBaddebtSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_pbBaddebt_submit);
  });

  function do_pbFinish_submit(interview_id) {
    $('#pbFinishModal').modal('hide');
    // status = 8
    data = {
      "payback_sub": {
        "interview": interview_id,
        "result_type": 3
      },
      "notes": helper_get_textbox_text("text_pbfinish_notes")
    };

    create_interviewsub_info("/interviews/api/payback_sub_finish/", table, data);
  }

  // only update the entry info
  $('#pbFinishSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_pbFinish_submit);
  });

  function do_pbRegister_submit(interview_id) {
    do_common_plain_submit(interview_id, '#pbRegisterModal', 7, '已经注册');
  }

  $(function(){
    // only update the entry info
    $('#pbRegisterSubmit').click(function(e){
      e.preventDefault();
      multisel_submit_wrapper(do_pbRegister_submit);
    });
  });

  function do_appointment_submit(interview_id) {
    $('#appointmentModal').modal('hide');

    data = {
      "interview": interview_id,
      "result_type": 3,
      "date": helper_get_textbox_text("text_appointment_date"),
      "contact": helper_get_textbox_text("text_appointment_contact"),
      "address": helper_get_textbox_text("text_appointment_address"),
      "postname": helper_get_textbox_text("text_appointment_postname"),
      "certification": helper_get_textbox_text("text_appointment_certification"),
      "attention": helper_get_textbox_text("text_appointment_attention"),
      "first_impression": helper_get_textbox_text("text_appointment_first_impression"),
      "notes": helper_get_textbox_text("text_appointment_notes"),
    };

    /* step1: update the appointment info*/
    create_interviewsub_info("/interviews/api/appointment_sub/", table, data);
    /* step2: update the interview status to next stage*/
    submit_interview_by_id(interview_id, "/api/interviews/", 3, '面试')
  }

  $('#appointmentSubmit').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_appointment_submit);
  });

  $('#agree_interview').click(function(e){
    $('#dailToCandidateModal').modal('hide');
    $('#appointmentModal').modal('show');
  });

  function do_save_dail_content(interview_id, resume_id) {
    alert('保存信息'+resume_id+" "+post_selected_value)
    smartData = {
        "resume_id": resume_id,
        "preferList": preferList,
    }
    xhr_common_send('POST', '/api/tags/', smartData)
    return
    data = {
      "id": resume_id,
      /*
      "school":  helper_get_textbox_text("candidate_text_resumeinfo_school"),
      "hunting_status": $('#dail_text_cur_hunting_status').val(),
      "expected_industry": helper_get_selectbox_text("dail_text_expected_industry"),
      "expected_post": helper_get_selectbox_text("dail_text_expected_post"),
      "expected_shift": helper_get_selectbox_text("dail_text_expected_shift"),

      "expected_salary": helper_get_textbox_text("dail_text_expected_salary"),
      "expected_notes": helper_get_textbox_text("dail_text_expected_notes"),
      "expected_province": helper_get_textbox_text("dail_text_expected_place_province"),
      "expected_city": helper_get_textbox_text("dail_text_expected_place_city"),
      "expected_district": helper_get_textbox_text("dail_text_expected_place_district"),
      "expected_street": helper_get_textbox_text("dail_text_expected_place_district"),

      "expected_insurance": helper_get_selectbox_text("dail_text_expected_insurance"),
      "expected_insurance_schedule": helper_get_selectbox_text("dail_text_expected_insurance_schedule")
      */
    }
    console.log("data", data)
    xhr_common_send('PUT', '/api/resumes/' + resume_id + '/', data)
  }

  $('#save_dail_content').click(function(e) {
    e.preventDefault()
    do_save_dail_content(interview_selected_value, resume_selected_value)
  });

  function do_dial_deeper_submit(interview_id) {
    var status = 2;
    $('#dailToCandidateModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '深度沟通');
  }

  $('#dail_deeper_communicate').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_dial_deeper_submit);
  });

  $('#close_dail_content').click(function(e){
    $('#dailToCandidateModal').modal('hide')
  });

  function do_dial_not_linked_submit(interview_id) {
    var status = 2;
    $('#dailToCandidateModal').modal('hide');
    submit_interview_by_id(interview_id, "/api/interviews/", status, '未接通');
  }

  $('#dail_not_linked').click(function(e){
    e.preventDefault();
    multisel_submit_wrapper(do_dial_not_linked_submit);
  });

  $('#giveup_interview').click(function(e){
    $('#dailToCandidateModal').modal('hide');
    do_save_dail_content(interview_selected_value, resume_selected_value)
    do_stop_submit(interview_selected_value);
    //show_stop_modal(interview_selected_value, resume_selected_value)
  });


  // smart recruit related config
  var areaTypeOk = true
  var clearBorder = function() {
    $('#smartAreaType').css('border-style', 'none')
    $('#smartPostLevel').css('border-style', 'none')
  }

  var smartRecruitComponent = [
      {
        "name": "areaType",
        "component": $('#smartAreaType'),
        "selector": $('#smartAreaTypeSelector'),
        "statis": true,
        "statisOK": $('#areaTypeOK'),
        "statisNO": $('#areaTypeNO'),
      },
      {
        "name": "postLevel",
        "component": $('#smartPostLevel'),
        "selector": $('#smartPostLevelSelector'),
        "statis": true,
        "statisOK": $('#postLevelOK'),
        "statisNO": $('#postLevelNO'),
      },
      {
        "name": "postLobbyType",
        "component": $('#smartPostLobbyType'),
        "selector": $('#postLobbyTypeSelector'),
        "statis": true,
        "statisOK": $('#postLobbyTypeOK'),
        "statisNO": $('#postLobbyTypeNO'),
      },
      {
        "name": "socialSecurity",
        "component": $('#socialSecurity'),
        "selector": $('#socialSecuritySelector'),
        "statis": true,
        "statisOK": $('#socialSecurityOK'),
        "statisNO": $('#socialSecurityNO'),
      },
  ]

  var preferListTemplate = [
      {
        "name": "areaType",
        "nameReadable": "行业类别",
        "prefer":"",
        "score": 0,
        "dislike":"",
      },
      {
        "name": "postLevel",
        "nameReadable": "岗位类别",
        "prefer":"",
        "score": 0,
        "dislike":"",
      },
      {
        "name": "postLobbyType",
        "nameReadable": "作息时间",
        "prefer":"",
        "score": 0,
        "dislike":"",
      },
      {
        "name": "socialSecurity",
        "nameReadable": "社保公积金",
        "prefer":"",
        "score": 0,
        "dislike":"",
      },
  ]

  var typeMapToChinese = new Map ()
  typeMapToChinese.set("areaType", "行业类别")
  typeMapToChinese.set("postLevel", "岗位类别")
  typeMapToChinese.set("postLobbyType", "作息时间")
  typeMapToChinese.set("socialSecurity", "社保公积金")

  var typeMapToEnglish = {
    "行业类别": "areaType",
    "岗位类别": "postLevel",
    "作息时间": "postLobbyType",
    "社保公积金": "socialSecurity",
  }

  preferList = preferListTemplate

  var companySmartInfoMock = [
      {
        "name": "areaType",
        "value":"金融业",
      },
      {
        "name": "postLevel",
        "value":"人力资源",
      },
      {
        "name": "postLobbyType",
        "value":"做五休二",
      },
      {
        "name": "socialSecurity",
        "value":"五险一金",
      },
  ]


  var InitCandidateSmartRecruiterInfo = function() {
    for (var i = 0; i < preferList.length; i++) {
       for (var j = 0; j < companySmartInfoMock.length; j++) {
          if (preferList[i].name == companySmartInfoMock[j].name) {
            preferList[i].prefer = companySmartInfoMock[j].value
            preferList[i].score = 10
            break
          }
       }
    }
  } 

  InitCandidateSmartRecruiterInfo()


  var initCandidatePostInfo = function(resumeTagInfo) {
    let iMap = new Map()
    for (i = 0; i < resumeTagInfo.length; i++) {
      item = resumeTagInfo[i]
      console.log("Item" + item.focusPointName + " " + item.itemInFocusPointName)
      key = item.focusPointName + "." + item.itemInFocusPointName
      iMap.set(key, {"score":item.score, "level1":item.focusPointName, "level2":item.itemInFocusPointName})
    }
    console.log("iMap: ", iMap)
    return iMap
  }


  var getPostTagInfo = function(post_id) {
    url = '/api/postTags?post_id=' + post_id 
		xhr_common_send('GET', url, null, function(response){
      post_tag_info = response.data
			console.log("=================", response.data)
			console.log("=================", post_tag_info)
      //
      //
      prefixAreaType = "当前职位所属行业是:" 
      prefixPostLevel = "当前职位级别是:"
      prefixPostLobbyType = "当前职位作息是:"
      prefixSocialSecurity = "当前职位社保公积金是:"
      //
      let iMap = new Map()
      for (i = 0; i < post_tag_info.length; i++) {
        item = post_tag_info[i]
        key = item.focusPointName + '.' + item.itemInFocusPointName
        iMap.set(key, 1)
        if (item.focusPointName == '行业类别') {
          prefixAreaType += item.itemInFocusPointName
        } else if (item.focusPointName == '岗位级别') {
          prefixPostLevel += item.itemInFocusPointName
        } else if (item.focusPointName == '岗位作息') {
          prefixPostLobbyType += item.itemInFocusPointName
        } else if (item.focusPointName == '社保公积金') {
          prefixSocialSecurity += item.itemInFocusPointName
        }
      }
      postMap = iMap
      console.log("postMap", postMap)
      document.getElementById("prefixAreaType").innerHTML=prefixAreaType;
      document.getElementById("prefixPostLevel").innerHTML=prefixPostLevel;
      document.getElementById("prefixPostLobbyType").innerHTML=prefixPostLobbyType;
      document.getElementById("prefixSocialSecurity").innerHTML=prefixSocialSecurity;
      console.log("prefixAreaType", prefixAreaType)
      console.log("prefixPostLevel", prefixPostLevel)
    }) 
  }
	getPostTagInfo(post_selected_value)


  var initCandidatePostTagInfo = function(resume_id) {
    url = '/api/tags?resume_id=' + resume_id
		xhr_common_send('GET', url, null, function(response) {
      resumeTagInfo = response.data
			console.log("candidatePostInfo-----", resumeTagInfo)
      candidatePreferMapInitial = initCandidatePostInfo(resumeTagInfo)
      console.log("condidateMap",  candidatePreferMapInitial)
      candidatePreferMapChanged = new Map()
      console.log("update")
    })

  }

  var genCandidateInfo = function() {
    var logInfo = "<br/>该候选人的兴趣信息更新如下:"
    console.log("candidatePreferMapInitial", candidatePreferMapInitial)
    for (var [key, val] of candidatePreferMapInitial) {
        level1 = val.level1
        level2 = val.level2
        score  = val.score
        console.log("Enter: ", level1, level2, score)
        // should update the info
        logInfo += "<br/>" + level1 + "(" + level2 + "):" + score

    }
    console.log("candidatePreferMapInitial", logInfo)
    /*
    for (var i = 0; i < preferList.length; i++) {
      if (preferList[i].prefer != "") {
        logInfo += "<br/>" + preferList[i].nameReadable + "(" + preferList[i].prefer + "):" + preferList[i].score
      }
      if (preferList[i].dislike != "") {
        logInfo += "<br/>" + preferList[i].nameReadable + "(" + preferList[i].dislike + "):" + "-10"
      }
    }
    */
    return logInfo
  }

  var updatePostAndCandidateShowInfo = function () {
    preferInfo = genCandidateInfo()
    // get the post info
    allInfo = "<br/>岗位标签如下:"
    for (i = 0; i < post_tag_info.length; i++) {
      allInfo += "<br/>" + post_tag_info[i].focusPointName + "/" + post_tag_info[i].itemInFocusPointName
    }

    allInfo += "<br/>"
    allInfo += preferInfo
    console.log("candiateInfo: " + preferInfo)
    document.getElementById("candidateSmartShowInfo").innerHTML=allInfo;
  }

  var updateCandidatePostDislikeInfo = function(curType, statis) {
    console.log("level1Name", typeMapToChinese)
    var level1Name = typeMapToChinese.get(curType)
    console.log("level1Name", level1Name)
    var level2Name = "xxxx"
    found = false
    for (i = 0; i < post_tag_info.length; i++) {
      if (post_tag_info[i].focusPointName == level1Name) {
        level2Name = post_tag_info[i].itemInFocusPointName
        found = true
      }
    }
    if (found && (!statis)) {
      key = level1Name + "." + level2Name
      candidatePreferMapChanged.set(level1Name, {
              "dislike": level2Name})
      console.log("update " + key + " to dislike")
      console.log(candidatePreferMapChanged)
      item = candidatePreferMapChanged.get(key)
    }
  }

  var updateCandidateLikeInfo = function(curType, level2) {
    var level1Name = typeMapToChinese.get(curType)
    if (candidatePreferMapChanged.has(level1Name)) {
      item = candidatePreferMapChanged.get(level1Name)
      item.like = level2
    } else {
      candidatePreferMapChanged.set(level1Name, {
              "like": level2})
    }
    console.log("item: ", candidatePreferMapChanged)
  }

  var updateStatisInfo = function(curType, statis) {
    console.log(curType)
    for (var i = 0; i < smartRecruitComponent.length; i++) {
      if (curType == smartRecruitComponent[i].name) {
        smartRecruitComponent[i].statis = statis
      }
    }
    updateCandidatePostDislikeInfo(curType, statis)
    updateShow(curType)
    updatePostAndCandidateShowInfo()
  }

  var updateShow = function(curType) {
    for (var i = 0; i < smartRecruitComponent.length; i++) {
      if (curType == smartRecruitComponent[i].name) {
        smartRecruitComponent[i].component.css('border-style', 'dotted')
        smartRecruitComponent[i].component.css('border-width', '1px')
      } else {
        smartRecruitComponent[i].component.css('border-style', 'none')
      }

      if (smartRecruitComponent[i].statis) {
        smartRecruitComponent[i].selector.css('display', 'none')
        smartRecruitComponent[i].statisNO.prop('checked', false)
      } else {
        smartRecruitComponent[i].statisOK.prop('checked', false)
        smartRecruitComponent[i].selector.css('display', 'inline')
      }
    }
  }

  // Init the component
  InitSmartRecruitComponent = function() {
    for (var i = 0; i < smartRecruitComponent.length; i++) {
      smartRecruitComponent[i].statisOK.prop('checked', true)
      smartRecruitComponent[i].statisNO.prop('checked', false)
      smartRecruitComponent[i].selector.css('display', 'none')
    }
  }
  InitSmartRecruitComponent()

  $('#postLevelOK').click(function(e) {
    updateStatisInfo('postLevel', true)
  })
  $('#postLevelNO').click(function(e) {
    updateStatisInfo('postLevel', false)
  })
  $('#areaTypeOK').click(function(e) {
    updateStatisInfo('areaType', true)
  })
  $('#areaTypeNO').click(function(e) {
    updateStatisInfo('areaType', false)
  })
  $('#postLobbyTypeOK').click(function(e) {
    updateStatisInfo('postLobbyType', true)
  })
  $('#postLobbyTypeNO').click(function(e) {
    updateStatisInfo('postLobbyType', false)
  })
  $('#socialSecurityOK').click(function(e) {
    updateStatisInfo('socialSecurity', true)
  })
  $('#socialSecurityNO').click(function(e) {
    updateStatisInfo('socialSecurity', false)
  })

  $('#dail_expected_areaType').change(function(e) {
    var prefer = $("#dail_expected_areaType option:selected").val();

    //alert(prefer)
    updateCandidateLikeInfo('areaType', prefer)
  })


  // ================================ CLICKS END ================================================
  //-------- select
    xhr_common_send('GET', '/interview/ai/task', null, function(response){
      $('#ai_task_id').html("")
      $('#ai_task_id').prepend('<option value="">请选择任务</option>');
      if (response !='') {
        $.each(response.ai_taskId,function(index, ele) {
          $('#ai_task_id').append('<option value="ai_task_id' + index + '">' + ele + '</option>');
        });
      }
    })
  //-----------
});
