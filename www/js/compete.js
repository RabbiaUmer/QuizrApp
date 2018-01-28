$(function () {

  var token = window.localStorage.getItem('user-token');

  $("#compete-screen").on("pageshow", function () {
    $('#comp-loader').hide();

    // Retreiving data from URL parameters
    var params = $(this).data("url").split("?")[1]; // retrieveing url parameters
    var emptyString = ""; // will be used to clear up the string
    var individualParams = params.split("&"); // splitting based on `&` character
    var id = individualParams[0].replace("id=", emptyString); // getting id param value
    var name = individualParams[1].replace("name=", emptyString); // getting name param value
    var challengeType = individualParams[2].replace("challengeType=", emptyString);

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
        url: serverUrl.hosted + '/questions',
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

          toggleProgressBar();
          showQuestionsAndAnswers(data, 0, []);

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
    function showQuestionsAndAnswers(data, index, results) {

      if (index !== data.length) {

        // Displays the question
        toggleQuestion(data[index].question);
        showHideQuestionAnswers(data, index);

        // once the question and choices has been shown the first time, add the event on button click
        // using one instead of one, so that if user keeps on clicking the same button, it wouldn't fire the callback each time
        $('.choice-btn').one('click', function () {
          var selectedChoice = $(this).attr('data-choice');
          var correctAnswer = data[index].answer;

          // if the selected choice is the answer
          if (selectedChoice === correctAnswer) {
            results.push({correct: true, answer: selectedChoice});
            selectAnswer('correct-answer', data, index, this, results);

          } else { // if the selectedChoice is not the answer
            results.push({correct: false, answer: selectedChoice});
            var correctBtn = $('.choice-btn[data-choice=\"' + correctAnswer + '\"]')
            selectAnswer('wrong-answer', data, index, this, results, correctBtn);
          }
        });
      } else {
        submitResults(results, data);
      }
    }

    function submitResults(res, data) {
      console.log(res);
      var numberOfCorrectAnswers = 0;
      res.forEach(function (data, index) {
        if (data.correct) {
          numberOfCorrectAnswers++;
        }
      });

      // adding a little bit delay (2 seconds) before we remove everything after completing a quiz and before showing the results
      setTimeout(function () {
        removeQuestionAnswers();
        toggleQuestion();
        toggleProgressBar();
        var percentageOfCorrectAnswers = (numberOfCorrectAnswers * 100) / data.length;
        console.log(percentageOfCorrectAnswers);
      }, 2000)
    }

    function selectAnswer(selectionClass, data, index, selectedButton, results, correctBtn) {
      progressBar(data, index);
      $(selectedButton).addClass(selectionClass);

      // once the user has selected the choice, disable all of the buttons
      $('.choice-btn').prop('disabled', true);
      // but we're enabling the button that the user clicked on
      $(selectedButton).prop('disabled', false);

      // if the answer was wrong, hightlight/show user the correct answer
      if (correctBtn) {
        setTimeout(function () {
          $(correctBtn).addClass('correct-answer');
        }, 500);
      }

      // adding some fake delay before we move to presenting the next question and choices
      setTimeout(function () {
        // remove the current choices & question
        index++;
        showQuestionsAndAnswers(data, index, results);
      }, 1000);
    }

    function removeQuestionAnswers() {
      // first remove any existing choices before rendering the new ones
      $('#choices-wrapper').fadeOut(function () {
        $(this).remove();
      });
    }

    function showHideQuestionAnswers(data, index) {

      removeQuestionAnswers();

      var choicesWrapper = $("<div id='choices-wrapper'></div>");

      data[index].choices.forEach(function (value) {
        var choiceContainer = $("<div class='col-xs-12'></div>");
        var choice = $("<button class='ui-btn ui-corner-all ui-shadow choice-btn' data-choice='" + value + "' ></button>").text(value).appendTo(choiceContainer);
        choiceContainer.appendTo(choicesWrapper);

        // Displays the choices
        choicesWrapper.hide().appendTo('#choices').fadeIn();
      });
    }

    // -------------- PROGRESS BAR RELATED ANSWERS --------------------
    function progressBar(data, index) {
      index = index + 1; // because we're dealing with the question number not the actual index in an array
      var barWidth = (index * 100) / data.length;
      $('#progressBar #bar').css('width', barWidth + '%');
    }

    function toggleProgressBar() {
      var visibilityValue = $('#progressBar').css('visibility');
      visibilityValue = visibilityValue === 'visible' ? 'hidden' : 'visible';
      $('#progressBar').css('visibility', visibilityValue);
    }

  });
});