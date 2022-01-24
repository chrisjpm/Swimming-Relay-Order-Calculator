// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  addSwimmer();
});

// Values to be entered into db fields
function addSwimmer() {
  $('#swimmer-submit').on('click', function(e) {
    e.preventDefault(); // prevent default action of submit so that the hidden button can check if the fields are valid (using HTML validation)
    // store all the inputs that will be converted to JSON before sent to the server and inserted into the respected tables
    var values = {
      swimmer : {
        swimmer_forename : $('input[name="swimmer_forename"]').val(),
        swimmer_surname : $('input[name="swimmer_surname"]').val(),
        swimmer_dob : $('input[name="swimmer_dob"]').val(),
        swimmer_gender : $('select[name="swimmer_gender"]').val(),
      },
      distance_pb : {
        // calling the getMillis function to convert the time into milliseconds
        fly : {
          pb_25m : getMillisTime("fly", 25),
          pb_50m : getMillisTime("fly", 50),
          pb_100m : getMillisTime("fly", 100),
          pb_200m : getMillisTime("fly", 200)
        },
        bc : {
          pb_25m : getMillisTime("bc", 25),
          pb_50m : getMillisTime("bc", 50),
          pb_100m : getMillisTime("bc", 100),
          pb_200m : getMillisTime("bc", 200)
        },
        brs : {
          pb_25m : getMillisTime("brs", 25),
          pb_50m : getMillisTime("brs", 50),
          pb_100m : getMillisTime("brs", 100),
          pb_200m : getMillisTime("brs", 200)
        },
        fc : {
          pb_25m : getMillisTime("fc", 25),
          pb_50m : getMillisTime("fc", 50),
          pb_100m : getMillisTime("fc", 100),
          pb_200m : getMillisTime("fc", 200)
        }
      }
    };

    // check if the fields in the HTML form are all valid before posting
    if (!(document.getElementsByClassName("addSwimmer")[0].checkValidity())) {
      // if it is not valid it will click the hidden button that will allow the HTML diaglouges to pop op - otherwise they will not
      document.getElementById("swimmer-submit-hidden").click();
    } else {
      // if all the fields are valid continue with posting to the server
      $.ajax({
        url : "/addrecords",
        type : "POST",
        contentType : "application/json",
        data : JSON.stringify(values), // convert the var values into JSON string to be sent to the server
        success : function(response) { // on success, the window will create a pop up confirm to the user their swimmer has been added
          if (response) {
            alert("Success! Your swimmer and their times have been added to our databse, check the View Records Page if they are there. Most recent entries will be at the top.");
            $('form.addSwimmer')[0].reset(); // Clear form
          }
        }
      });
    }
  });
}

// Convert the times for each distance of each stroke into milliseconds
// This is will make adding uptimes for the calculation much easier,
// it also avoid too many fields in the table on the database.
// fly = Butterfly; bc = Backcrawl; brs = Breastroke; fc = Frontcrawl
function getMillisTime(stroke, distance) {
  var mins = parseInt($('#' + stroke + distance + 'mins').val());
  var secs = parseInt($('#' + stroke + distance + 'secs').val());
  var millis = parseInt($('#' + stroke + distance + 'millis').val());

  var totalMilliseconds = (mins * 60000) + (secs * 1000) + (millis * 10); // converting each input box to milliseconds then summing them
  return totalMilliseconds;
}
