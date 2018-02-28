// Call functions reagrding the table of swimmers when the page is ready (loaded)
$(document).ready(function() {
  requestSwimmers();
  renderTable();
});


// Tell what values to enter into db fields
function requestSwimmers(data) {
  var values = {
    swimmer_forename: swimmer_forename,
    swimmer_surname: swimmer_surname,
    swimmer_dob: swimmer_dob,
    swimmer_gender: swimmer_gender
  }
  $.ajax({
    url: "/viewrecords",
    type: "REQUEST",
    contentType: "application/json",
    data: JSON.stringify(values),
    success: function(swimmersJson) {
      renderTable(swimmersJson);
    }
  });
};

// Render the table with swimmers details from sroc.swimmer
function renderTable(swimmersJson) {
  var columns = addAllColumnHeaders(swimmersJson, selector);

  for (var i = 0; i < swimmersJson.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = swimmersJson[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
    $('table#swimmers-table').append(row$);
  }
}
