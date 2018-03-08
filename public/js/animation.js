// Call animations on page load
$(document).ready(function() {
  headerUnderline();
  imageHover();
})

// Adding underline to active page in header and also removing its hover animation
function headerUnderline() {
  switch (window.location.pathname) {
    // using a case to select the page to modify
    case '/':
      $('li#nav-home').addClass('nav-active');
      $('li#nav-home a').removeClass('a-nav-hover');
      break;
    case '/addrecords':
      $('li#nav-a-records').addClass('nav-active');
      $('li#nav-a-records a').removeClass('a-nav-hover');
      break;
    case '/viewrecords':
      $('li#nav-v-records').addClass('nav-active');
      $('li#nav-v-records a').removeClass('a-nav-hover');
      break;
    case '/calculator':
      $('li#nav-calc').addClass('nav-active');
      $('li#nav-calc a').removeClass('a-nav-hover');
      break;
  }
}

// Changing image on hover for buttons
function imageHover() {
  // Add records btn mouseover and mouseleave modifying
  $('img#addrecordsbtn').mouseover(function(){
    $(this).attr("src", function(index, attr){
      // write over the ".png" and add "-hover.png" to the end of the image name to select the new image to show on hover
      return attr.replace(".png", "-hover.png");
    });
  });
  $('img#addrecordsbtn').mouseleave(function(){
    $(this).attr("src", function(index, attr){
      // write over the "-hover.png" and add ".png" to the end of the image name to select the new image to show on hover
      return attr.replace("-hover.png", ".png");
    });
  });
  // View records btn mouseover and mouseleave modifying
  $('img#viewrecordsbtn').mouseover(function(){
    $(this).attr("src", function(index, attr){
      // write over the ".png" and add "-hover.png" to the end of the image name to select the new image to show on hover
      return attr.replace(".png", "-hover.png");
    });
  });
  $('img#viewrecordsbtn').mouseleave(function(){
    $(this).attr("src", function(index, attr){
      // write over the "-hover.png" and add ".png" to the end of the image name to select the new image to show on hover
      return attr.replace("-hover.png", ".png");
    });
  });
  // Calculator btn mouseover and mouseleave modifying
  $('img#calcbtn').mouseover(function(){
    $(this).attr("src", function(index, attr){
      // write over the ".png" and add "-hover.png" to the end of the image name to select the new image to show on hover
      return attr.replace(".png", "-hover.png");
    });
  });
  $('img#calcbtn').mouseleave(function(){
    $(this).attr("src", function(index, attr){
      // write over the "-hover.png" and add ".png" to the end of the image name to select the new image to show on hover
      return attr.replace("-hover.png", ".png");
    });
  });
}
