$(function () {
  console.log('here');
  $.ajax({
    type: "GET",
    headers: {"x-access-token": helper.getAuthToken()}, // have to send token on every request for authentication
    url: serverUrl.hosted + '/user-profile',
    dataType: "json",
    success: function (user) {
      $('#playerAvatar').attr('src', user.avatar);
    }
  });

});