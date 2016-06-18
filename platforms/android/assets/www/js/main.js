$(function () {

    //Handling the login form
    $("#login-form form").submit(function (event) {

        //preveneting the default form submit event/behaviour/action
        event.preventDefault();
        var userEmail = $(this).find("#login-email").val();
        var userPassword = $(this).find("#login-password").val();
        $.ajax({
            type: "POST",
            url: 'http://localhost:8080/login',
            data: {
                email: userEmail,
                password: userPassword
            },
            success: function (response) {
                console.log(response);
            },
            dataType: "json"
        });
    });

});