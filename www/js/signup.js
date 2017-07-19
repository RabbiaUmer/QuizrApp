//Handling the login form
$('#signup-form form').submit(function (event) {
  $("#signup-btn").prop("disabled", true);

  // if there is already error message added during previous attempt then remove that first
  removeSignupError();

  var userEmail = $(this).find("#signup-email").val();
  var userPassword = $(this).find("#signup-password").val();
  var fName = $(this).find("#firstName").val();
  var lName = $(this).find("#lastName").val();

  $.ajax({
    type: "POST",
    url: 'https://programming-quiz-learning-app.herokuapp.com/signup',
    data: {
      firstName: fName,
      lastName: lName,
      email: userEmail,
      password: userPassword
    },
    success: function (res) {
      if (res.success === true) {
        var localStorage = window.localStorage;
        localStorage.setItem("user-token", res.token);
        openHomeScreen();
        $("#signup-btn").prop("disabled", false);
      } else {
        addSignupError(res.message);
      }
    },
    dataType: "json"
  });

  event.preventDefault();
});


// Removing errors on focus
$('#signup-form form').find("#signup-email-email, #signup-password").focus(function () {
  // if there is already error message added during previous attempt then remove that on focus
  removeSignupError();
});

// helper functions below (used in code above)
function openHomeScreen() {
  $(':mobile-pagecontainer').pagecontainer("change", "home.html", {
    role: "page",
    transition: "fade",
    changeHash: true,
    reverse: true,
    showLoadMsg: true
  })
}

function addSignupError(msg) {
  $("#signup-btn").prop("disabled", true);
  $('<p class="center signup-error bg-danger">' + msg + '</p>').hide().appendTo('#signup-form form').slideDown(500);
}

function removeSignupError() {
  $("#signup-btn").prop("disabled", false);
  $('p.signup-error').slideUp(500, function () {
    $('p.signup-error').remove();
  }