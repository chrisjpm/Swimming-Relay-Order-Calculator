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

// if (!(document.getElementsByClassName("calculator")[0].checkValidity())) {
//   document.getElementById("calc-submit-hidden").click();
// } else {
//   $.ajax({
//     url: "/calculator",
//     type: "POST",
//     contentType: "application/json",
//     data: JSON.stringify(...),
//     success: function(response) {
//       if (response) {
//         console.log('Alerting success and redireting on alert exit);
//         alert("Success! Click on this dialogue to be redirected to your results - where you will also be given a download option.");
//       }
//     }
//   });
// }
