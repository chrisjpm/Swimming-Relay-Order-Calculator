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
        swimmers[i][columns[colIndex]] = beautifyDate(swimmers[i][columns[colIndex]]);
      }
      if (columns[colIndex] == "swimmer_gender") {
        // use fuction assignGender to conver number into the name of the gender
        swimmers[i][columns[colIndex]] = assignGender(swimmers[i][columns[colIndex]]);
      }
      if (columns[colIndex] == distancePb) {
        swimmers[i][columns[colIndex]] = swimmers[i][columns[colIndex]];
      }
      row$.append($('</td>').html(cellValue));
    }
    $('table#calc-swimmers-table').append(row$); // select which table to instert into
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
  renderTableResults(relays); // render the table with all combos ready for sorting
}

// Render the table with results then call sorting fucntion
function renderTableResults(relays) {
  // Will add rank after sorting, otherwise numbers will not be in ascedning order
  var rank;
  // find the distance that was selected as to select the element in the array
  var pb = document.getElementsByName("calc-relay-distance")[0].value;
  // for loop to find sum of all swimmers pbs to find the total time
  var totalTime = 2;
  // set up the comlumns for the table in an array
  var columns = ["rank", "swimmer1", "swimmer2", "swimmer3", "swimmer4", "totalTime"];
  // use nested for loop to insert all the relays into the table
  for (var i = 0; i < relays.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = "";
      // add swimmers' names to the swimmer columns
      if(columns[colIndex].indexOf("swimmer") > -1){
        var index = parseInt(columns[colIndex].replace("swimmer",""));
        index--;
        cellValue = relays[i][index].swimmer_forename + " " + relays[i][index].swimmer_surname;
      }
      // find sum off all times
      if(columns[colIndex] == "totalTime"){
        cellValue = relays[i][0][pb] + relays[i][1][pb] + relays[i][2][pb] + relays[i][3][pb];
      }
      row$.append($('</td>').html(cellValue));
    }
    $('table#calc-results-table').append(row$); // select which table to instert into
  }

  // sorting and adding ranks
  var oneRelay = false;
  var numRows = document.getElementById("calc-results-table").rows.length; // find the number or rows in the table
  var row =  $('#calc-results-table tr'); // var to hold tr location
  // if the relay has more than 1 combonation then call the bubble sort function
  var bubbleSortComplete = false;
  if(relays.length > 1) {
    //bubbleSortComplete = bubbleSortTable(numRows, row); // sort the times from fastest to slowest then insert incrementing value into the rank column
    bubbleSortTable(numRows, row); // sort the times from fastest to slowest then insert incrementing value into the rank column
  } else { // else set boolean oneRelay to true
    oneRelay = true;
  }
  // if there was only 1 relay combonation OR the buuble sort is complete, add the ranks column's values and convert the times to MM:SS.mm
  // if (oneRelay == true || bubbleSortComplete == true) {
  //   addRanks(numRows, row);
  //   convertTime(numRows, row);
  // }
}

// Bubble sort for the results and insert incrementing value into the rank column
function bubbleSortTable(numRows, row) {
  var switching; // init switching app outside do while loop
  var breaker = 0;
  do {
    switching = false; // set switching to false at beginning of loop, will stay false until set true when a switch does not need to be made and check the next 2 rows

    for (var i = 1; i < numRows - 1; i++) { // start at second tr so as to not include the header tr
      var a = row[i].getElementsByTagName('td')[5]; // td number 6 is position of the time in the tr. Inner HTML gets the text/integers inside the td
      var b = row[i+1].getElementsByTagName('td')[5]; // the next row's value
      // console.log("Values - a: " + a.innerHTML + " b: " + b.innerHTML);

      if (a.innerHTML > b.innerHTML) { // if the row before is bigger then the next row, swap the two rows positions in the table so that the times will be in ascedning order
        console.log("switching " + a.innerHTML + " and " + b.innerHTML);
        row[i].parentNode.insertBefore(row[i+1], row[i]); // swaps rows to the lowest value goes up
        switching = true; // since true will start the loop again
      }

      // console.log("No switch needed");
    }
    //breaker++;
  } while (switching) // loop while switching is true. stops when false = sort complete
  console.log("Bubble sort complete!");
  if(breaker > 198){
    console.log("YOU BLEW IT, KAPISH");
  }
  return true;
}

function addRanks(numRows, row) {
  // for (var i = 1; i <= numRows; i++) { // start at second tr so as to not include the header tr
  //   row[i].getElementsByTagName('td')[0].innerHTML = i; // insert rank on each row
  // }
}

function convertTime(numRows, row) {
  // for (var i = 1; i <= numRows; i++) { // start at second tr so as to not include the header tr
  //   row[i].getElementsByTagName('td')[5].innerHTML = millisReconvert(row[i].getElementsByTagName('td')[5].innerHTML); // insert rank on each row
  // }
}
