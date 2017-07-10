/**
 * Created by rabbiaumer on 5/29/17.
 */

$(function () {
  $("#logout-btn").on("click", function (event) {
    event.preventDefault();
    window.localStorage.removeItem("user-token");
    $(':mobile-pagecontainer').pagecontainer("change", "login.html", {
      role: "page",
      transition: "fade",
      changeHash: false,
      reverse: true,
      showLoadMsg: true
    })
  });
});