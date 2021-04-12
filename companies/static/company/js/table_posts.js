var keywords = {};
function renderBtn(title) {
  return '<button onclick="removeKeyword(\'' + title + '\')" style="background-color: #f7e64c;margin-right: 10px" type="button" class="stage_two_dail btn btn-sm ">' + title + '</button>';
}
console.log("hello world------------>")

    $('#focusPoint').change(function() {
      console.log("focus Point .....")
      var focus = $("#focusPoint option:selected").val();
      $.ajax({
        url: '/api/itemInFocusPoints/',
        type: 'GET',
        data: {
          focus: focus,
          start: 0,
          length: 9999999,
        },
        success: function(res) {
           $('#focusPointItem').empty()
           console.log("Get Some Info...", res)
           for (var item of res.results) {
              var p = '<option id='+item.id+' value='+item.name+'>'+item.name+'</option>'
              $('#focusPointItem').append(p)
           }
        }
      })
    });

    $('#addTag').on('click', function() {
       console.log("click add tag")
       var Level1 = $("#focusPoint option:selected").val();
       var Level2 = $("#focusPointItem option:selected").val();
       /*
       if Level1 == "NULL" || Level2 == NULL {
          alert("请选择一级和二级的分类")
       }
       */
       alert("请选择一级和二级的分类")
    })


    var editorList = [
        'talk_hint',
        'prologue',
        'workplace',
        'work_purpose',
        'wechat_invite'
    ];

    function makeCollomns() {
        return [
            {
                data: function (e) {
                    return '<div class="checker"><span class=""><input type="checkbox" class="checksigle" value="' + e.id + '"></span></div>';

                },
                "sWidth": "3%"
            },
        ]
    }

    $(document).ready(function () {
        var selected = [];
        var table = $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,

            "ajax": {
                "url": "/api/posts/",
                "type": "GET",
            },
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $('td:eq(1)', nRow).html(iDisplayIndex + 1);
                return nRow;
            },
            "rowCallback": function (row, data) {
                if ($.inArray(data.DT_RowId.toString(), selected) !== -1) {
                    $(row).addClass('selected');
                }
            },

            "columns": [
                {"data": "id"},
                {"data": "project_name"},
                {"data": "department.company.name"},
                {"data": "department.name"},
                {"data": "name"},
                {"data": "place"},
                {"data": "description"},
                {"data": "link"},
                {"data": "request"},
            ],
        });

        $('#dataTable tbody').on('click', 'tr', function () {
            var id = this.id;
            var index = $.inArray(id, selected);

            if (index === -1) {
                selected.push(id);
            } else {
                selected.splice(index, 1);
            }
            // alert(1);
            // $(this).toggleClass('selected');
        });

        $('#id_b_submit').on('click', function () {
            console.log(selected);
            localStorage['post'] = selected[0];
        });
        $('#post_button_id').on('click', function () {

            //keywords处理
            if (Object.keys(keywords).length > 0) {
                $('#keywords').val(JSON.stringify(keywords));
            }

            postAjaxSubmit()
            table.draw()
        });
    });

    function postAjaxSubmit() {
        if (true) {
            var formData = new FormData($("#post_filter_form")[0]);
            $.ajax({
                url: '/post/post/update/',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                },
                error: function (data) {
                }
            });
        } else {
            $.ajax({
                "url": "/post/post/update/",
                "type": "POST",
                "data": $('#post_filter_form').serialize(),
            });
        }

    }

    $('#last_modified_time').datepicker({
        dateFormat: 'yy-mm-dd',
    });

    $.ajax({
        type: "GET",
        url: '/interview/ai/task',
        async: false,
        dataType: "json",
        success: function (data) {
            $('#baiying_task_id').html("")
            $('#baiying_task_id').prepend('<option value="">请选择任务</option>');
            if (data != '') {
                $.each(data.ai_taskId, function (index, ele) {
                    $('#baiying_task_id').append('<option value=' + ele[0] + '>' + ele[1] + '</option>');
                });
            }
        }
    });
