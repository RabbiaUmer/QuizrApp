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

          showQuestionsAndAnswers(data, 0);

        }
      });
    });

    // this function adds the questions if provided, otherwise removes the existing question
    function toggleQuestion(questionString) {
      /* check if the argument passed is a string or there is not an argument
       or empty argument add string if provided, otherwise add empty string */
      var question = questionString ? questionString : '';
      $('#questions .question').text(question);
    }

    // Handle all the logic for displaying the questions and answers
    function showQuestionsAndAnswers(data, index) {

      // Displays the question
      toggleQuestion(data[index].question);
      showHideQuestionAnswers(data, index);

      // once the question and choices has been shown the first time, add the event on button click
      $('.choice-btn').on('click', function () {
        var selectedChoice = $(this).attr('data-choice');

        // if the selected choice is the answer
        if (selectedChoice === data[index].answer) {
          // remove the current choices & question
          index++;
          showQuestionsAndAnswers(data, index);
        }
      });

    }

    function showHideQuestionAnswers(data, index) {

      // first remove any existing choices before rendering the new ones
      $('#choices-wrapper').remove();

      // Displays the choices
      var choicesWrapper = $("<div id='choices-wrapper'></div>");
      choicesWrapper.appendTo('#choices');

      data[index].choices.forEach(function (value) {
        var choiceContainer = $("<div class='col-xs-6'></div>");
        var choice = $("<button class='ui-btn ui-corner-all choice-btn' data-choice='" + value + "' ></button>").text(value).appendTo(choiceContainer);
        choiceContainer.appendTo(choicesWrapper);
      });
    }


  });
});