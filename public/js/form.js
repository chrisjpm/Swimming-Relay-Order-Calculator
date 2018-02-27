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

// Tell what values to enter into db fields
function addSwimmer() {
  $('#swimmer-submit').on('click', function(e) {
    e.preventDefault();
    var values = {
      swimmer : {
        swimmer_forename: $('input[name="swimmer_forename"]').val(),
        swimmer_surname: $('input[name="swimmer_surname"]').val(),
        swimmer_dob: $('input[name="swimmer_dob"]').val(),
        swimmer_gender: $('select[name="swimmer_gender"]').val(),
      },
      distance_pb : {
        
      }
    };
    $.ajax({
      url: "/addrecords",
      type: "POST",
      contentType: "application/json",
      // processData: false,
      data: JSON.stringify(values),
      success: function(response) {
        if (response) {
          console.log('Alerting success and clearing form');
          alert("Success!");
        }
      }
    });
  });

  // $('#swimmer-submit').submit(function(e) {
  //   e.preventDefault();
  //   var values = {
  //     swimmer_forename: $('input[name="swimmer_forename"]').val(),
  //     swimmer_surname: $('input[name="swimmer_surname"]').val(),
  //     swimmer_dob: $('input[name="swimmer_dob"]').val(),
  //     swimmer_gender: $('select[name="swimmer_gender"]').val()
  //   };
  //   $.ajax({
  //     url: "/addrecords",
  //     type: "POST",
  //     contentType: "application/json",
  //     processData: false,
  //     data: JSON.stringify(values),
  //     success: function(response) {
  //       if(response){
  //         console.log('Alerting success and clearing form');
  //         alert("Success!");
  //       }
  //     }
  //   });
  //   return false;
  //   // $.post("/addrecords", values, function(response){
  //   //   if(response){
  //   //     console.log('Alerting success and clearing form');
  //   //     alert("Success!");
  //   //   }
  //   // });
  // });
}

// fly = Butterfly; bc = Backcrawl; brs = Breastroke; fc = Frontcrawl
function getMillisTime(stroke, distance) {
  var mins = $('input[name="' + stroke + distance + 'mins"]').val();
  var secs = $('input[name="' + stroke + distance + 'secs"]').val();
  var millis = $('input[name="' + stroke + distance + 'millis"]').val();

  var totalMilliseconds = millis + (mins * 60 * 1000) + (secs * 1000);
  return totalMilliseconds;
}
