// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  getSwimmerDetails();
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
            // First clear table if there was a past calculation in the same session
            $('td').remove();
            // if the function isValidRelay is true, call the function that creates the table of applicable swimmers and then the find combinations function
            renderTableSwimmers(swimmers);
          } else {
            window.alert('Sorry! Not enough swimmers match the criteria for this relay.'); // if the result from the fucntion isValidRelay is false alert the user
                                                                                           // and do not begin the calculation process
          }
        }
      });
    }
  });
}

function isValidRelay(swimmers) {
  //Alert message if there are not enough swimmers that match the criteria and don't carry through with the calculation
  var relayType = $('select[name="calc-relay-type"]').val();
  if (relayType == '4') {
    if (swimmers.length < 4) { //there must be at least 4 people to make a relay team
      // if there are less than 4 swimmers a relay cannot be made, hence it returns false
      return false;
    } else { // there is more or equal to 4 swimmers applicable so will return true
      return true;
    }
  } else {
    if (swimmers.length < 16) { // The Json is 4x the size becuase it gets all 4 strokes. This still finds if there are less than 4 swimmers
      // if there are less than 4 swimmers a relay cannot be made, hence it returns false
      return false;
    } else { // there is more or equal to 4 swimmers applicable so will return true
      return true;
    }
  }
}

// Render the table with swimmers details from sroc.swimmer and the times needed for the relay from sroc.distance_pb
function renderTableSwimmers(swimmers) {
  // Show applicable swimmers in first table

  // find which distance PB to choose from the array swimmers
  var distancePb = $('select[name="calc-relay-distance"]').val();
  // set up the columns for the HTML table
  var columns = ["swimmer_forename", "swimmer_surname", "swimmer_dob", "swimmer_gender", "stroke_name", distancePb];
  // use nested for loop to insert all the relays into the table
  for (var i = 0; i < swimmers.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = swimmers[i][columns[colIndex]];
      if (columns[colIndex] == "swimmer_dob") {
        // use function beautifyDate convert time into UK format
        cellValue = beautifyDate(swimmers[i][columns[colIndex]]);
      }
      if (columns[colIndex] == "swimmer_gender") {
        // use fuction assignGender to conver number into the name of the gender
        cellValue = assignGender(swimmers[i][columns[colIndex]]);
      }
      if (columns[colIndex] == distancePb) {
        // use fuction assignGender to conver number into the name of the gender
        cellValue = millisReconvert(swimmers[i][columns[colIndex]]);
      }
      row$.append($('<td/>').html(cellValue));
    }
    $('#calc-swimmers-table').append(row$); // select which table to instert into
  }
  findCombos(swimmers); // inside this function, it will call the calculator function and sort function there after
}

// Find all combinations of swimmers
function findCombos(swimmers){
  //finds if the input's name is 4 (for fc) or 1,2,3,4 (for medley)
  // use the fucntion k_combinations from the lib to find all the combonations of swimmers in a set of 4
  // the total number of combos is 4Cswimmers.length [4 Choose swimmers.length] (= (swimmers.length)! / 4!*(swimmers.length - 4)!)
  var relays = k_combinations(swimmers, 4);
  var invalidRelays = [];
  if(document.getElementsByName("calc-relay-type")[0].value != 4) { // if medley we need to pick out invalid relays (ie same swimmer and/or stroke > 1 times in 1 relay)
    //take out relays with same swimmer or stroke appearing more than once
    for (var i = 0; i < relays.length; i++) {
      for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
          // checks if the first swimmer forename+surname is equal to any other swimmers in the combination, and will not compare with itself
          if((relays[i][j].swimmer_forename + relays[i][j].swimmer_surname) == (relays[i][k].swimmer_forename + relays[i][k].swimmer_surname) && (j != k)) {
            if(!invalidRelays.includes(i)){
              invalidRelays.push(i);
            }
          }
          // checks if the stroke is equal to any other strokes in the combination, and will not compare with itself
          if((relays[i][j].stroke_name) == (relays[i][k].stroke_name) && (j != k)) {
            if(!invalidRelays.includes(i)){
              invalidRelays.push(i);
            }
          }
        }
      }
    }

    for (var i = 0; i < invalidRelays.length; i++) {
      relays.splice(invalidRelays[i]-i, 1);
    }
  }
  // call function to order and render result table
  renderTableResults(relays);
}

// Render the table with results then call sorting fucntion
function renderTableResults(relays) {
  // Will add rank after sorting, otherwise numbers will not be in ascedning order
  // console.log(relays);
  // find the distance that was selected as to select the element in the array
  var pb = document.getElementsByName("calc-relay-distance")[0].value;

  var sorting = true;
  // insert all the relays into the table

  // put each relay in a record then put them into an array of records, ready for sorting
  var sortedResults = [];
  for (var i = 0; i < relays.length; i++) {
    var row$ = $('<tr/>');
    var newRow = [];
    newRow[0] = null; // rank - will be added after sorting
    newRow[1] = relays[i][1].swimmer_forename + " " + relays[i][1].swimmer_surname; // bc
    newRow[2] = relays[i][2].swimmer_forename + " " + relays[i][2].swimmer_surname; // brs
    newRow[3] = relays[i][0].swimmer_forename + " " + relays[i][0].swimmer_surname; // fly
    newRow[4] = relays[i][3].swimmer_forename + " " + relays[i][3].swimmer_surname; // free
    newRow[5] = relays[i][0][pb] + relays[i][1][pb] + relays[i][2][pb] + relays[i][3][pb]; // total time
    sortedResults[i] = newRow;
  }

  // Bubble sort
  do {
    sorting = false;
    // loop for i < sortedResults.length - 1 beacuse the last element has nothing to compare with after it
    for(var i = 0; i < sortedResults.length - 1; i++){
      // if the current item is bigger than the next one. if it is then swpa them using a temp var as a middle man
      if(sortedResults[i][5] > sortedResults[i+1][5]){
        sorting = true;
        var temp = sortedResults[i];
        sortedResults[i] = sortedResults[i+1];
        sortedResults[i+1] = temp;
      }
    }
  } while (sorting); // keep looping sorting is true, when sorting is false the sort is completed in ascending order

  // add values to rank column and conver milliseconds to MM:SS.mm format
  for(var i = 0; i < sortedResults.length; i++){
    sortedResults[i][0] = i+1; // add rank as the index of the loop + 1
    sortedResults[i][5] = millisReconvert(sortedResults[i][5]); // MM:SS.mm format function
    // insert the sorted arrays of records into the results table
    var html = "<tr>";
    for(var j = 0; j < sortedResults[i].length; j++){
      html += "<td>"+sortedResults[i][j]+"</td>";
    }
    html+="</tr>";
    $('table#calc-results-table').append(html);
  }
}
