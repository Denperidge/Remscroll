$(document).ready(function(){
  $("#container").children().animate({"opacity": 1}, 2000);
  $("div").not("#container").animate({"opacity": 1}, 2000);

  var linkLocation;
  $("a").not("[download]").click(function(event){
    event.preventDefault();
    linkLocation = this.href;
    $("div").not("#container").animate({"opacity": 0}, 1000);

    $("#container").children().animate({"opacity": 0}, 1000, redirectPage);
  });
  function redirectPage(){
    window.location = linkLocation;
  }
});
