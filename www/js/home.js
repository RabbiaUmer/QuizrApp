/**
 * Created by rabbiaumer on 5/29/17.
 */

$(function () {

  // Fire off a request to fetch user information as soon as the page loads
  var authToken = window.localStorage.getItem("user-token");
  $.ajax({
    type: "GET",
    headers: {"x-access-token": authToken}, // have to send token on every request for authentication
    url: 'https://programming-quiz-learning-app.herokuapp.com/user-profile',
    success: function (res) {
      $(".header").text(res.firstName + " " + res.lastName);
      $("#playerAvatar").attr("src", res.avatar);
    },
    dataType: "json"
  });


  $("#logout-btn").on("click", function (event) {
    event.preventDefault();
    window.localStorage.removeItem("user-token");
    $(':mobile-pagecontainer').pagecontainer("change", "login.html", {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: true,
      showLoadMsg: true
    })
  });
});