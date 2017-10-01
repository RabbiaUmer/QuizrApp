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
      $('#questions .question').hide().text(question).fadeIn();
    }

    // Handle all the logic for displaying the questions and answers
    function showQuestionsAndAnswers(data, index) {

      // Displays the question
      toggleQuestion(data[index].question);
      showHideQuestionAnswers(data, index);

      // once the question and choices has been shown the first time, add the event on button click
      // using one instead of one, so that if user keeps on clicking the same button, it wouldn't fire the callback each time
      $('.choice-btn').one('click', function () {
        var selectedChoice = $(this).attr('data-choice');

        // if the selected choice is the answer
        if (selectedChoice === data[index].answer) {
          selectAnswer('correct-answer', data, index, this);
        } else { // if the selectedChoice is not the answer
          selectAnswer('wrong-answer', data, index, this);
        }
      });
    }

    function selectAnswer(selectionClass, data, index, button) {
      $(button).addClass(selectionClass);

      // once the user has selected the choice, disable all of the buttons
      $('.choice-btn').prop('disabled', true);
      // but we're enabling the button that the user clicked on
      $(button).prop('disabled', false);

      // adding some fake delay before we move to presenting the next question and choices
      setTimeout(function () {
        // remove the current choices & question
        index++;
        showQuestionsAndAnswers(data, index);
      }, 1000);
    }

    function showHideQuestionAnswers(data, index) {

      // first remove any existing choices before rendering the new ones
      $('#choices-wrapper').fadeOut(function () {
        $(this).remove();
      });

      var choicesWrapper = $("<div id='choices-wrapper'></div>");

      data[index].choices.forEach(function (value) {
        var choiceContainer = $("<div class='col-xs-12'></div>");
        var choice = $("<button class='ui-btn ui-corner-all ui-shadow choice-btn' data-choice='" + value + "' ></button>").text(value).appendTo(choiceContainer);
        choiceContainer.appendTo(choicesWrapper);

        // Displays the choices
        choicesWrapper.hide().appendTo('#choices').fadeIn();
      });
    }


  });
});