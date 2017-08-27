$(function () {

  var token = window.localStorage.getItem('user-token');

  // $.ajax({
  //   url: 'https://programming-quiz-learning-app.herokuapp.com/',
  //   headers: {
  //     'x-access-token': token
  //   },
  //   type: 'GET',
  //   error: function (err) {
  //     console.log(err);
  //   },
  //   contentType: 'text/plain',
  //   async: true,
  //   success: function (data) {
  //
  //
  //   }
  // });

  $("#compete-screen").on("pageshow", function () {

    // Retreiving data from URL parameters
    var params = $(this).data("url").split("?")[1];
    var emptyString = "";
    var individualParams = params.split("&");
    var id = individualParams[0].replace("id=", emptyString);
    var name = individualParams[1].replace("name=", emptyString);

    // Showing the inital message and data
    var competitionLoader = $("#competition").append("<div id='comp-loader'><div class='row'></div></div>");
    competitionLoader.append("<div class='col-xs-12 text-center'> <h1 class='animated fadeInDown'>" + name + "</h1> <div><p>Here we go!</p></div> <div><br><p> You will be presented with multiple choice questions, correct answers would increase your reputation.</p></div> <br> <br> <p>Press the button to start</p> <br> <br><button id='comp-start-btn' class='ui-btn ui-shadow animated infinite pulse'>Start Game</button></div>");

    // On start game button, remove the loader element (because we're going to show the questions on the same page
    $('#comp-start-btn').on('click', function (event) {
      event.preventDefault();
      competitionLoader.remove();
    });
  });
});