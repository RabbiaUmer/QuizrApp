//Handling the login form
$('#login-form form').submit(function (event) {

  // if there is already error message added during previous attempt then remove that first
  removeLoginError();

  var userEmail = $(this).find("#login-email").val();
  var userPassword = $(this).find("#login-password").val();

  $.ajax({
    type: "POST",
    url: 'http://localhost:8000/login',
    // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      email: userEmail,
      password: userPassword
    },
    success: function (res) {
      if (res.success === true) {
        var localStorage = window.localStorage;
        localStorage.setItem("user-token", res.token);
        openHomeScreen();
      } else {
        addLoginError();
      }
    },
    dataType: "json"
  });

  event.preventDefault();
});


// Removing errors on focus
$('#login-form form').find("#login-email, #login-password").focus(function () {
  // if there is already error message added during previous attempt then remove that on focus
  removeLoginError();
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

function addLoginError() {
  $('#login-form form')
    .append('<p class="center login-error">Please check your email or password!</p>');
}

function removeLoginError() {
  $('p.login-error').remove();
}