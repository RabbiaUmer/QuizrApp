$(function () {

  var token = window.localStorage.getItem('user-token');

  $("#compete-screen").on("pageshow", function () {
    $('#comp-loader').hide();

    // Retreiving data from URL parameters
    var params = $(this).data("url").split("?")[1];
    var emptyString = "";
    var individualParams = params.split("&");
    var id = individualParams[0].replace("id=", emptyString);
    var name = individualParams[1].replace("name=", emptyString);

    // Showing the inital message and data
    var competitionLoader = $("#language-header")
      .text(name).addClass('fadeInDown').show();
    $('#comp-loader').show();

    // Show the text below the language heading with fade in animation
    $('#welcome-text').addClass('fadeIn').show();

    // On start game button, remove the loader element (because we're going to show the questions on the same page
    $('#comp-start-btn').on('click', function (event) {
      event.preventDefault();
      $('#comp-loader').remove();

      $.ajax({
        url: 'https://programming-quiz-learning-app.herokuapp.com/questions',
        headers: {
          'x-access-token': token
        },
        data: {
          categoryId: id
        },
        type: 'GET',
        error: function (err) {
          console.log(err);
        },
        contentType: 'text/plain',
        async: true,
        success: function (data) {
          console.log(data);
          showQuestionsAndAnswers(data);
        }
      });
    });

    // Handle all the logic for displaying the questions and answers
    function showQuestionsAndAnswers(data) {
      var totalNumberOfQuestions = data.length;
      var index = 0;

      // Displays the question
      $('#questions .question').text(data[index].question);
      index = showHideQuestionAnswers(data, index);

    }

    function showHideQuestionAnswers(data, index) {
      // Displays the choices
      data[index].choices.forEach(function (value) {
        var choiceContainer = $("<div class='col-xs-6'></div>");
        var choice = $("<button class='ui-btn ui-shadow ui-corner-all'></button>").text(value).appendTo(choiceContainer);
        choiceContainer.appendTo('#choices');
      });

    }


  });
});