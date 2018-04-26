$(function () {

  $('#compete-screen').one("pageshow", function (event) {

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

      $(':mobile-pagecontainer').pagecontainer({
        beforehide: function () {
          clearInterval(randomAvatarsDisplayInterval);
          socket.emit('leaveMatch');
        }
      });

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
    });
  });

});