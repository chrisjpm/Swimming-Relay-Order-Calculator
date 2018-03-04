// Call functions reagrding the table of swimmers when the page is ready (loaded)
$(document).ready(function() {
  requestSwimmers();
});


// Tell what values to enter into db fields
function requestSwimmers(data) {
  $.ajax({
    url : "/viewrecords",
    type : "POST",
    contentType : "application/json",
    data : [],
    success : function(swimmersJson) {
      renderTable(swimmersJson);
    }
  });
}

// Render the table with swimmers details from sroc.swimmer
function renderTable(swimmersJson) {
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender"];

  for (var i = 0; i < swimmersJson.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      if(columns[colIndex] == "swimmer_dob"){
        swimmersJson[i][columns[colIndex]] = beautifyDate(swimmersJson[i][columns[colIndex]]);
      }
      if(columns[colIndex] == "swimmer_gender"){
        swimmersJson[i][columns[colIndex]] = assignGender(swimmersJson[i][columns[colIndex]]);
      }
      var cellValue = swimmersJson[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
    $('table#swimmers-table').append(row$);
  }
}

function beautifyDate(d){
  var date = new Date(d);
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // need to add 1 to get the correct month
  var day = date.getDate();

  return day+"/"+month+"/"+year;
}

// Did you just assign my gender?!?
function assignGender(g){
  var gender = '';
  if (g == 0){
    gender = "Male";
  }
  else if (g == 1) {
    gender = "Female";
  }
  // does not support non-binary genders as there are only 2 genders (m/f) in swimming competitions
  return gender;
}
