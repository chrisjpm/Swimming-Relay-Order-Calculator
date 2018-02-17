//Adding underline to active page in header and also removing its hover animation
$(document).ready(function headerUnderline() {
  $(function() {
    switch (window.location.pathname) {
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
      case '/results':
        $('li#nav-results').addClass('nav-active');
        $('li#nav-results a').removeClass('a-nav-hover');
        break;
    }
  });
})

//Changing image on hover for buttons
$(document).ready(function imageOnHover() {
  $(function() {
    //Add records btn
    $('img#addrecordsbtn').mouseover(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace(".png", "-hover.png");
      });
    });
    $('img#addrecordsbtn').mouseleave(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace("-hover.png", ".png");
      });
    });
    //View records button
    $('img#viewrecordsbtn').mouseover(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace(".png", "-hover.png");
      });
    });
    $('img#viewrecordsbtn').mouseleave(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace("-hover.png", ".png");
      });
    });
    //Calculator btn
    $('img#calcbtn').mouseover(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace(".png", "-hover.png");
      });
    });
    $('img#calcbtn').mouseleave(function(){
      $(this).attr("src", function(index, attr){
        return attr.replace("-hover.png", ".png");
      });
    });
  });
})
