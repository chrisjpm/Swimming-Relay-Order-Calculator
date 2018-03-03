// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  removeEnterSubmit();
  getSwimmerDetails()
});

// Prevent the form submitting when accidently hitting enter
function removeEnterSubmit() {
  $(window).keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
}

// Get applicable swimmers
function getSwimmerDetails() {
  $('#calc-submit').on('click', function(e) {
    $.ajax({
      url: "/calculator",
      type: "POST",
      contentType: "application/json",
      data: [],
      success: function(swimmersJson) {
        distancepb = $('select#relay-distance').val();
        renderTable(swimmersJson, distancePb);
      }
    });
}

// Render the table with swimmers details from sroc.swimmer and the times needed for the relay from sroc.distance_pb
function renderTable(swimmersJson, pb) {
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender", "stroke_name", pb];
  console.log(swimmersJson);

  for (var i = 0; i < swimmersJson.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = swimmersJson[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
    $('table#results-table').append(row$);
  }
}
