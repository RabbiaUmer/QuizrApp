/**
 * Created by rabbiaumer on 5/29/17.
 */

$(function () {
  $("#logout-btn").on("click", function (event) {
    event.preventDefault();
    window.localStorage.setItem("user-token", null);
    $.mobile.navigate("/index.html");
  });
});