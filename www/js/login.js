//Handling the login form
$('#login-form form').submit(function (event) {
  $("#login-btn").prop("disabled", true);

  // if there is already error message added during previous attempt then remove that first
  removeLoginError();

  var userEmail = $(this).find("#login-email").val();
  var userPassword = $(this).find("#login-password").val();

  $.ajax({
    type: "POST",
    url: serverUrl.local + '/login',
    // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: {
      email: userEmail,
      password: userPassword
    },
    success: function (res) {
      if (res.success === true) {
        var localStorage = window.localStorage;
        localStorage.setItem("user-token", res.token);
        helper.openHomeScreen(true);
        $("#login-btn").prop("disabled", false);
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
function addLoginError() {
  $("#login-btn").prop("disabled", true);
  $('<p class="center login-error bg-danger">Please check your email or password!</p>').hide().appendTo('#login-form form').slideDown(500);
}

function removeLoginError() {
  $("#login-btn").prop("disabled", false);
  $('p.login-error').slideUp(500, function () {
    $('p.login-error').remove();
  });
}