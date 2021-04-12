// Call the dataTables jQuery plugin
$(document).ready(function() {
  var table = $('#dataTable').DataTable({
    "serverSide": true,
    "ajax": "/api/resumes/?formant=datatables",
    "columns": [
      {"data": "resume_id"},
      {"data": "username"},
      {"data": "gender"},
    ]
  });
});
