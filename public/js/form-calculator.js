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
  var relays = []; // init empty array for relays
  //finds if the input's name is 4 (for fc) or 1,2,3,4 (for medley)
  if (document.getElementsByName("calc-relay-type")[0].value == 4) { // if frontcrawl (4 = fc)
    // use the fucntion k_combinations from the lib to find all the combonations of swimmers in a set of 4
    // the total number of combos is 4C{swimmers.length} (= (swimmers.length)! / 4!*(swimmers.length - 4)!)
    relays = k_combinations(swimmers, 4);
    console.log(relays);
    // insert relays into table, then call the sorting function
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
    //var relays = k_combinations(????, 4);
  }
  renderTableResults(relays)
}

// Render the table with results then call sorting fucntion
function renderTableResults(relays) {
  // Will add rank after sorting, otherwise numbers will not be in ascedning order
  console.log(relays);
  // find the distance that was selected as to select the element in the array
  var pb = document.getElementsByName("calc-relay-distance")[0].value;

  var sorting = true;
  // use nested for loop to insert all the relays into the table
  var array_of_magic = [];
  for (var i = 0; i < relays.length; i++) {
    var row$ = $('<tr/>');
    var newRow = [];
    newRow[0] = null;
    newRow[1] = relays[i][0].swimmer_forename + " " + relays[i][0].swimmer_surname;
    newRow[2] = relays[i][1].swimmer_forename + " " + relays[i][1].swimmer_surname;
    newRow[3] = relays[i][2].swimmer_forename + " " + relays[i][2].swimmer_surname;
    newRow[4] = relays[i][3].swimmer_forename + " " + relays[i][3].swimmer_surname;
    newRow[5] = relays[i][0][pb] + relays[i][1][pb] + relays[i][2][pb] + relays[i][3][pb];
    array_of_magic[i] = newRow;
  }

  // Bubble sort
  do {
    sorting = false;
    for(var i = 0; i < array_of_magic.length -1; i++){
      if(array_of_magic[i][5] > array_of_magic[i+1][5]){
        sorting = true;
        var temp1 = array_of_magic[i];
        var temp2 = array_of_magic[i+1];
        array_of_magic[i] = temp2;
        array_of_magic[i+1] = temp1;
      }
    }
  } while (sorting);
  // add values to rank column and conver milliseconds to MM:SS.mm format
  for(var i = 0; i < array_of_magic.length; i++){
    array_of_magic[i][0] = i+1;
    array_of_magic[i][5] = millisReconvert(array_of_magic[i][5]);

    var html = "<tr>";
    for(var j = 0; j < array_of_magic[i].length; j++){
      html += "<td>"+array_of_magic[i][j]+"</td>";
    }
    html+="</tr>";

    $('table#calc-results-table').append(html);
  }

  console.log(array_of_magic);
}
