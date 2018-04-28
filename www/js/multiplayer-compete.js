$(function () {

  $('#compete-screen').one("pageshow", function (event) {
    $('#post-match').hide();

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
        playerLeft: 'playerLeft'
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
        $('#post-match').remove();

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
          console.log(players);
          $('#player-1 img').attr('src', players[0].avatar);
          $('#player-2 img').attr('src', players[1].avatar);

          $('#player-1 #name').text(players[0].firstName);
          $('#player-2 #name').text(players[1].firstName);



        });
      });

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