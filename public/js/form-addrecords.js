// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  removeEnterSubmit();
  addSwimmer();
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

// Values to be entered into db fields
function addSwimmer() {
  $('#swimmer-submit').on('click', function(e) {
    e.preventDefault();
    var values = {
      swimmer: {
        swimmer_forename: $('input[name="swimmer_forename"]').val(),
        swimmer_surname: $('input[name="swimmer_surname"]').val(),
        swimmer_dob: $('input[name="swimmer_dob"]').val(),
        swimmer_gender: $('select[name="swimmer_gender"]').val(),
      },
      distance_pb: {
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
    console.log("Bazinga:" +  values);

    if (!(document.getElementsByClassName("addSwimmer")[0].checkValidity())) {
      document.getElementById("swimmer-submit-hidden").click();
    } else {
      $.ajax({
        url: "/addrecords",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(values),
        success: function(response) {
          if (response) {
            console.log('Alerting success and clearing form');
            alert("Success! Your swimmer and his/her times have been added to our databse, check the View Records Page if they are there. Most recent entries will be at the bottom.");
            $('form.addSwimmer')[0].reset(); // Clear form
          }
        }
      });
    }
  });
}

// Convert the times for each distance of each stroke into milliseconds
// fly = Butterfly; bc = Backcrawl; brs = Breastroke; fc = Frontcrawl
function getMillisTime(stroke, distance) {
  var mins = parseInt($('#' + stroke + distance + 'mins').val());
  var secs = parseInt($('#' + stroke + distance + 'secs').val());
  var millis = parseInt($('#' + stroke + distance + 'millis').val());

  var totalMilliseconds = millis + (mins * 60 * 1000) + (secs * 1000);
  console.log(totalMilliseconds); //Checking if the time is added up correctly
  return totalMilliseconds;
}
