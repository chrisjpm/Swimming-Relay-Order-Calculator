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
// Make the date look like a UK date
function beautifyDate(d) {
  var date = new Date(d);
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // need to add 1 to get the correct month
  var day = date.getDate();

  return day + "/" + month + "/" + year;
}
// Chnage the number (0/1) to the assigned gender
function assignGender(g) {
  var gender = ""; // init empty
  // 0 and 1 are the 2 values of the select option for gender
  if (g == 0) {
    gender = "Male";
  } else { // 1
    gender = "Female";
  }
  // does not support non-binary genders as there are only 2 genders (m/f) in swimming competitions
  return gender;
}
// Make relay name
function relayType(r) {
  var type = ""; //init empty
  // 4 and (1, 2, 4, 4) are the 2 values of the select option for relay type
  if (r == 4) {
    type = "Freestyle";
  } else { // 1, 2, 3, 4
    type = "Medley";
  }

  return type;
}
// Convert millisecond back to normal time format - MM:SS.mm
function millisReconvert(m) {
  var millis = parseInt((m%1000)/100) // find the remaining milliseconds
  var secs = parseInt((m/1000)%60); // find the highest value for seconds
  var mins = parseInt((m/(1000*60))%60); // find the highest value for mins
  // put a leading zero infront of number if it is less than 10
  if(mins < 10) {
    mins = "0" + mins;
  }
  if(secs < 10) {
    secs = "0" + secs;
  }
  if(millis < 10) {
    millis = "0" + millis;
  }

  return mins + ":" + secs + "." + millis;
}
// Make relay distcance
function relayDistance(dist) {
  var distance = ""; // inint empty
  // pb_25m, pb_25m, pb_25m, pb_25m are the 4 values in the select option for relay distcance
  if (dist == "pb_25m") {
    distance = "4x25m";
  } else if (dist == "pb_50m") {
    distance = "4x50m";
  } else if (dist == "pb_100m") {
    distance = "4x100m";
  } else { // pb_200m
    distance = "4x200m";
  }

  return distance;
}
// export results as CSV
function exportCSV() {
  var csv = [];
  var rows = document.querySelectorAll("table#calc-results-table tr"); // s;ect the table to export (results)
  // nested loop adding the HTML records into a CSV file
  for (var i = 0; i < rows.length; i++) {
    var row = [], // init array empty
    cols = rows[i].querySelectorAll("td, th"); // select the table fields with the values in them
    // add HTML table row to CSv row
    for (var j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }
    // seperate with comma
    csv.push(row.join(","));
  }
  //  call download function
  downloadCSV(csv.join("\n"));
}
// download the results CSV
function downloadCSV(csv) {
  var csvFile;
  var download;
  // Get time for unique file name
  var time = new Date();
  time.getHours();
  time.getMinutes();
  // Set file name
  var name = document.getElementsByName("calc-yob")[0].value + "-" + assignGender(document.getElementsByName("calc-gender")[0].value) + "-" + relayType(document.getElementsByName("calc-relay-type")[0].value) + "-" + relayDistance(document.getElementsByName("calc-relay-distance")[0].value) + "-" + time + ".csv";
  // File to to csv
  csvFile = new Blob([csv], {
    type: "text/csv"
  });
  // Create download link with an anchor tag (<a></a>), set its name to the var name, and click method
  download = document.createElement("a");
  download.download = name;
  download.href = window.URL.createObjectURL(csvFile);
  download.style.display = "none";
  document.body.appendChild(download);
  download.click();
}
