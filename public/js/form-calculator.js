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
    e.preventDefault();
    var values = {
      swimmerDetails : {
        swimmer_dob : $('input[name="calc-yob"]').val(),
        swimmer_gender : $('select[name="calc-gender"]').val(),
      },
      relayDetails : {
        relay_type : $('select[name="calc-relay-type"]').val(),
        relay_distance : $('select[name="calc-relay-distance"]').val(),
      }
    }

    if (!(document.getElementsByClassName("calculator")[0].checkValidity())) {
      document.getElementById("calc-submit-hidden").click();
    } else {
      $.ajax({
        url : "/calculator",
        type : "POST",
        contentType : "application/json",
        data : JSON.stringify(values),
        success : function(swimmersJson) {
          if (isValidRelay(swimmersJson)) {
            renderTableSwimmers(swimmersJson);
            //calculation function
          } else {
            window.alert('Sorry! Not enough swimmers match the criteria for this relay.');
          }
          console.log(isValidRelay(swimmersJson) + "dkgjl");
          //renderTableSwimmers(swimmersJson);
        }
      });
    }
  });
}

// Render the table with swimmers details from sroc.swimmer and the times needed for the relay from sroc.distance_pb
function renderTableSwimmers(swimmersJson) {
  // First clear table if there was a past calculation in the same session
  $('td').remove();

  // Show applicable swimmers in first table
  var distancePb = $('select[name="calc-relay-distance"]').val();
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender", "stroke_name", distancePb];

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
    $('table#calc-swimmers-table').append(row$);
  }
}

function isValidRelay(swimmersJson) {
  //Alert message if there are not enough swimmers that match the criteria and don't carry through with the calculation
  var relayType = $('select[name="calc-relay-type"]').val();
  if (relayType == '4') {
    if (swimmersJson.length < 4) { //there must be at least 4 people to make a relay team
      return false;
    } else {
      return true;
    }
  } else {
    if (swimmersJson.length < 16) { // The Json is 4x the size becuase it gets all 4 strokes. This still finds if there are less than 4 swimmers
      return false;
    } else {
      return true;
    }
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
  } else if (g == 1) {
    gender = "Female";
  }
  // does not support non-binary genders as there are only 2 genders (m/f) in swimming competitions
  return gender;
}
