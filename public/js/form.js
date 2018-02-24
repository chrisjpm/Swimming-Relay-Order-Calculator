// Call functions reagrding the form when the page is ready (loaded)
$(document).ready(function() {
  removeEnterSubmit();
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

function addSwimmer() {
  $('#swimmer-submit').click(function() {
    var values = {
      swimmer_forename: $('input[name="swimmer_forename"]').val(),
      swimmer_surname: $('input[name="swimmer_surname"]').val(),
      swimmer_dob: $('input[name="swimmer_dob"]').val(),
      swimmer_gender: $('input[name="swimmer_gender"]').val()
    };
    $.ajax({
      url: "/addrecords",
      type: "POST",
      contentType: "application/json",
      processData: false,
      data: JSON.stringify(values),
      // complete: function(data) {
      //   $('#output').html(data.responseText);
      // }
    });
  });
}
