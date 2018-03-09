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
    success : function(swimmers) {
      renderTable(swimmers);
    }
  });
}

// Render the table with swimmers details from sroc.swimmer
function renderTable(swimmers) {
  // set up the columns for the HTML table
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender"];
  // use nested for loop to insert all the relays into the table
  for (var i = 0; i < swimmers.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = swimmers[i][columns[colIndex]];
      if(columns[colIndex] == "swimmer_dob"){
        // use function beautifyDate convert time into UK format
        cellValue = beautifyDate(swimmers[i][columns[colIndex]]);
      }
      if(columns[colIndex] == "swimmer_gender"){
        // use fuction assignGender to conver number into the name of the gender
        cellValue = assignGender(swimmers[i][columns[colIndex]]);
      }
      row$.append($('<td/>').html(cellValue));
    }
    $('table#swimmers-table').append(row$); // select which table to instert into
  }
}
