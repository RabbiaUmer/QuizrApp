$(function () {

  var token = window.localStorage.getItem('user-token');

  $.ajax({
    url: 'https://programming-quiz-learning-app.herokuapp.com/',
    headers: {
      'x-access-token': token
    },
    type: 'GET',
    error: function (err) {
      console.log(err);
    },
    contentType: 'text/plain',
    async: true,
    success: function (data) {


    }
  });

});
