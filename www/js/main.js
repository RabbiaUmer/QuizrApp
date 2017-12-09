/* Main script/logic for the project that has to be executed on the project start */

var authToken = localStorage.getItem('user-token');
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackButton, false);

// Handle the logic for the back-button for entire app here, since the event is attached to the document
function onBackButton() {
  var pageName = $(":mobile-pagecontainer").pagecontainer("getActivePage").attr("id");
  var isTokenSet = window.localStorage.getItem("user-token");
  if (pageName === "main-screen") {
    navigator.app.exitApp();
  } else if (pageName === "login-screen") {
    navigator.app.exitApp();
  } else if (pageName === "home-screen" && isTokenSet) {
    navigator.app.exitApp();
  }
  else {
    navigator.app.backHistory();
  }

}

// device APIs are available
function onDeviceReady() {
  // start showing splash screen
  navigator.splashscreen.show();

  // validate the token with backend (expired or not)
  if (!authToken) { // if the token doesn't even exist

    // then show login screen before even sending request to validate the token
    authenticateUser("login.html");
  } else {

    $.ajax('https://programming-quiz-learning-app.herokuapp.com/authenticate', {headers: {"x-access-token": authToken}})
      .done(function (data) {
        if (data.success) { // if token is not expired

          // then show home screen
          authenticateUser("home.html");

        } else { // if expired

          // then show login screen
          authenticateUser("login.html");

        }
      });
  }

  function authenticateUser(pageName) {
    // hide splash screen before showing any other screen (login or home screen)
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 3000);

    $(':mobile-pagecontainer').pagecontainer("change", pageName, {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: true,
      showLoadMsg: true
    })
  }

}