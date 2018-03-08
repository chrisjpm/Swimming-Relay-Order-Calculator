// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  getSwimmerDetails()
});

// Get applicable swimmers
function getSwimmerDetails() {
  $('#calc-submit').on('click', function(e) {
    e.preventDefault(); // prevent default action of submit so that the hidden button can check if the fields are valid (using HTML validation)
    // store all the inputs that will be converted to JSOn before sent to the server and inserted into the respected tables
    var values = {
      swimmerDetails: {
        swimmer_dob: $('input[name="calc-yob"]').val(),
        swimmer_gender: $('select[name="calc-gender"]').val(),
      },
      relayDetails: {
        relay_type: $('select[name="calc-relay-type"]').val(),
        relay_distance: $('select[name="calc-relay-distance"]').val(),
      }
    }
    // check if the fields in the HTML form are all valid before posting
    if (!(document.getElementsByClassName("calculator")[0].checkValidity())) {
      // if it is not valid it will click the hidden button that will allow the HTML diaglouges to pop op - otherwise they will not
      document.getElementById("calc-submit-hidden").click();
    } else {
      // if all the fields are valid continue with posting to the server
      $.ajax({
        url: "/calculator",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(values),
        success: function(swimmers) {
          if (isValidRelay(swimmers)) {
            // if the fucntion isValidRelay is true, call the functions that create the table of applicable swimmers and the calculation (and table for result)
            renderTableSwimmers(swimmers);
            calculator(swimmers);
          } else {
            window.alert('Sorry! Not enough swimmers match the criteria for this relay.'); // if the result from the fucntion isValidRelay is false alert the user
                                                                                           // and do not begin the calculation process
          }
        }
      });
    }
  });
}

// Render the table with swimmers details from sroc.swimmer and the times needed for the relay from sroc.distance_pb
function renderTableSwimmers(swimmers) {
  // First clear table if there was a past calculation in the same session
  $('td').remove();

  // Show applicable swimmers in first table

  // find which distance PB to choose from the array swimmers
  var distancePb = $('select[name="calc-relay-distance"]').val();
  // set up the columns for the HTML table
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender", "stroke_name", distancePb];
  // use nested for loop to insert all the relays into the table
  for (var i = 0; i < swimmers.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      if (columns[colIndex] == "swimmer_dob") {
        // use function beautifyDate convert time into UK format
        swimmers[i][columns[colIndex]] = beautifyDate(swimmers[i][columns[colIndex]]);
      }
      if (columns[colIndex] == "swimmer_gender") {
        // use fuction assignGender to conver number into the name of the gender
        swimmers[i][columns[colIndex]] = assignGender(swimmers[i][columns[colIndex]]);
      }
      var cellValue = swimmers[i][columns[colIndex]];
      row$.append($('<td/>').html(cellValue));
    }
    $('table#calc-swimmers-table').append(row$); // select which table to instert into
  }
}

function isValidRelay(swimmers) {
  //Alert message if there are not enough swimmers that match the criteria and don't carry through with the calculation
  var relayType = $('select[name="calc-relay-type"]').val();
  if (relayType == '4') {
    if (swimmers.length < 4) { //there must be at least 4 people to make a relay team
      return false;
    } else {
      return true;
    }
  } else {
    if (swimmers.length < 16) { // The Json is 4x the size becuase it gets all 4 strokes. This still finds if there are less than 4 swimmers
      return false;
    } else {
      return true;
    }
  }
}

function calculator(swimmers){
  //fc relay calculation
  //finds if the input's name is 4 (for fc) or 1,2,3,4 (for medley)
  if (document.getElementsByName("calc-relay-type")[0].value == 4) { // if frontcrawl (4 = fc)
    // use the fucntion k_combinations from the lib to find all the combonations of swimmers in a set of 4
    // the total number of combos is 4C{swimmers.length} (= (swimmers.length)! / 4!*(swimmers.length - 4)!)
    var relays = k_combinations(swimmers, 4);

    // insert relays into table, then call the sorting function (after the if else statement)
    //renderTableResultsFc(relays);
  } else { // else medley (1, 2, 3, 4 = medley)
    var arrFly = []; // init fly array empty
    var arrBc = []; // init backcrawl array empty
    var arrBrs = []; // init breastroke array empty
    var arrFc = []; // init frontcrawl array empty

    for (var i = 0; i < swimmers.length; i++) {
      //split up swimmers array by strokes
      if (i < (swimmers.length / 4)) {
        //add the first quater of the array to the fly array
        arrFly.push(swimmers[i]);
      } else if (i >= (swimmers.length / 4) && i < (swimmers.length / 2)) {
        //add the second quater of the array to the fly array
        arrBc.push(swimmers[i]);
      } else if (i >= (swimmers.length / 2) && i < ((3 / 4) * swimmers.length)) {
        //add the third quater of the array to the fly array
        arrBrs.push(swimmers[i]);
      } else {
        //add the last quater of the array to the fly array
        arrFc.push(swimmers[i]);
      }
    }
  }

  // call sort function after the relay combos and total times have been found
}

// // Render the table with results of an Freestyle calculation
// function renderTableResultsFc(relays) {
//   // First clear table if there was a past calculation in the same session
//   $('td').remove();
//
//   // Will add rank after sorting, otherwise numbers will not be in ascedning order
//   var rank = "";
//   // Set field names from the 2D array of relay combos
//   var swimmer1 = relays[0][0].swimmer_forename + " " + relays[0][0].swimmer_surname;
//   var swimmer2 = relays[1][1].swimmer_forename + " " + relays[1][1].swimmer_surname;
//   var swimmer3 = relays[2][2].swimmer_forename + " " + relays[2][2].swimmer_surname;
//   var swimmer4 = relays[3][3].swimmer_forename + " " + relays[3][3].swimmer_surname;
//   // find the distance that was selected as to select the element in the array
//   var pb = document.getElementsByName("calc-relay-distance")[0].value;
//   // nested for loop to find sum of all swimmers pbs to find the total time
//   var totalTime = 0;
//   for (i = 0; i < 3; i++) {
//     for (j = 0; j < 3; i++) {
//       totalTime+=relays[i][j]. + pb;
//     }
//   }
//   // set up the comlumns for the table in an array
//   var columns = [rank, swimmer1, swmmer2, swimmer3, swimmer4, totalTime];
//   // use nested for loop to insert all the relays into the table
//   for (var i = 0; i < relays.length; i++) {
//     var row$ = $('<tr/>');
//     for (var colIndex = 0; colIndex < columns.length; colIndex++) {
//       var cellValue = relays[i][columns[colIndex]];
//       row$.append($('<td/>').html(cellValue));
//     }
//     $('table#calc-results-table').append(row$); // select which table to instert into
//   }
// }
