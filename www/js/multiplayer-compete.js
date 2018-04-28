$(function () {

  $('#compete-screen').one("pageshow", function (event) {
    $('#post-match').hide();
    var currentUser;

    var params = $(this).data("url").split("?")[1]; // retrieveing url parameters
    var emptyString = ""; // will be used to clear up the string
    var individualParams = params.split("&"); // splitting based on `&` character
    var id = individualParams[0].replace("id=", emptyString); // getting id param value
    var name = individualParams[1].replace("name=", emptyString); // getting name param value
    var challengeType = individualParams[2].replace("challengeType=", emptyString);

    $('#language-name').text(name);
    $.when($.ajax({
        type: "GET",
        headers: {"x-access-token": helper.getAuthToken()}, // have to send token on every request for authentication
        url: serverUrl.hosted + '/user-profile',
        dataType: "json",
      }),
      $.ajax({
        type: "GET",
        headers: {"x-access-token": helper.getAuthToken()}, // have to send token on every request for authentication
        url: serverUrl.hosted + '/chooseAvatar',
        dataType: "json",
      })).then(function (userResponse, avatarsResponse) {
      var user = userResponse[0];
      var avatars = avatarsResponse[0];
      $('#playerAvatar').attr('src', user.avatar);

      var randomAvatars = avatars.slice(0, 3);
      avatars.splice(0, 3);
      avatars.concat(randomAvatars);
      randomAvatars.forEach(function (avatar) {
        $('#random-avatars').append('<img id="playerAvatar" class="img-responsive col-xs-4" src="' + avatar.avatarUrl + '" alt="Avatar">');
      });

      var index = 0;
      // Keep changing the randome avatars with one second delay
      var randomAvatarsDisplayInterval = setInterval(function () {
        $('#random-avatars').children().first().remove();
        $('#random-avatars').append('<img id="playerAvatar" class="img-responsive col-xs-4" src="' + avatars[index].avatarUrl + '" alt="Avatar">');

        if (index === avatars.length - 1) {
          index = 0;
        } else {
          index++;
        }
      }, 1000);

      var dataToBeSentWithSockets = {categoryId: id, categoryName: name};
      var socketEvents = {
        matchPlayer: 'matchPlayer',
        freePlayers: 'freePlayers',
        totalPlayers: 'totalPlayers',
        matchingPlayers: 'matchingPlayers',
        matched: 'matched',
        playerLeft: 'playerLeft',
        startMatch: 'startMatch',
        questions: 'questions',
        failed: 'failed',
        answer: 'answer'
      }

      socket.emit('matchPlayer', {categoryId: id, categoryName: name});
      socket.on('freePlayers', function (players) {
        $('#available-players').text(players.count);
      });

      socket.on('totalPlayers', function (players) {
        $('#total-players').text(players.count);
      });

      socket.on('matchingPlayers', function (players) {
        $('#matching-players').text(players.count);
      });

      socket.on('matched', function (players) {
        $('#pre-match').remove();
        $('#post-match').show();

        $.when(
          $.ajax({
            type: "GET",
            headers: {"x-access-token": helper.getAuthToken()}, // have to send token on every request for authentication
            data: {
              avatar: players[0].avatar
            },
            url: serverUrl.hosted + '/avatar'
          }),
          $.ajax({
            type: "GET",
            headers: {"x-access-token": helper.getAuthToken()}, // have to send token on every request for authentication
            data: {
              avatar: players[1].avatar
            },
            url: serverUrl.hosted + '/avatar'
          })
        ).then(function (avatar1, avatar2) {
          players[0].avatar = avatar1[0];
          players[1].avatar = avatar2[0];

          $('#player-1 img').attr('src', players[0].avatar);
          $('#player-2 img').attr('src', players[1].avatar);

          $('#player-1 #name').text(players[0].firstName);
          $('#player-2 #name').text(players[1].firstName);

          var thisUserEmail = localStorage.getItem('email');
          currentUser = players[0].email === thisUserEmail ? players[0] : players[1];
          console.log(currentUser);

          socket.emit('startMatch', dataToBeSentWithSockets);
          var questions;
          var results = [];
          socket.on('questions', function (response) {
            questions = response;
            showQuestionsAndAnswers(questions, 0, results);
          });

          socket.on('failed', function (data) {
            // stop if last index
            var index = questions.length - 1 === data ? null : data + 1
            if (index) {
              removeQuestionAnswers();
              toggleQuestion();
              showQuestionsAndAnswers(questions, data + 1, results);
            }
          })


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
            console.log('clicked');
            var selectedChoice = $(this).attr('data-choice');
            var correctAnswer = data[index].answer;

            // if the selected choice is the answer
            if (selectedChoice === correctAnswer) {
              results.push({
                correct: true,
                answer: selectedChoice,
                questionId: data[index]._id,
                level: data[index].level
              });
              selectAnswer('correct-answer', data, index, this, results);
            } else { // if the selectedChoice is not the answer
              results.push({
                correct: false,
                answer: selectedChoice,
                questionId: data[index]._id,
                level: data[index].level
              });
              var correctBtn = $('.choice-btn[data-choice=\"' + correctAnswer + '\"]');
              selectAnswer('wrong-answer', data, index, this, results, correctBtn);
            }
            socket.emit('answered', {user: currentUser, index: index});
          });
        } else {
          submitResults(results, data);
        }
      }

      function submitResults(res, data) {
        var numberOfCorrectAnswers = 0;
        res.forEach(function (data, index) {
          if (data.correct) {
            numberOfCorrectAnswers++;
          }
        });
        
        console.log(numberOfCorrectAnswers);
      }

      function selectAnswer(selectionClass, data, index, selectedButton, results, correctBtn) {
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
        }, 200);
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

      socket.on('playerLeft', function () {
        confirm('Player has left the game');
        helper.changeScreen('home.html', {reverse: false});
      })

      // Before removing page do this
      $('#compete-screen').one('pagebeforehide', function () {
        clearInterval(randomAvatarsDisplayInterval);
        socket.emit('leaveMatch', dataToBeSentWithSockets);
        Object.keys(socketEvents).forEach(function (socketEvent) {
          socket.off(socketEvents[socketEvent]);
        });
      });

    });
  });

});