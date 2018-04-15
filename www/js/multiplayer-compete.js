$(function () {
  console.log('here');
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
  });

});