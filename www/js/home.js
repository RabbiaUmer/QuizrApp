/**
 * Created by rabbiaumer on 5/29/17.
 */

$(function () {
  // Fire off a request to fetch user information as soon as the page loads
  var authToken = helper.getAuthToken();
  $.ajax({
    type: "GET",
    headers: {"x-access-token": authToken}, // have to send token on every request for authentication
    url: serverUrl.hosted + '/user-profile',
    success: function (user) {
      $(".header").text(user.firstName + " " + user.lastName);
      $("#playerAvatar").attr("src", user.avatar);
      if (user.levels.length) {
        var tableHeadings = $("#user-level-chart").append("<tr><th>Category</th><th>Level</th></tr>");
        user.levels.forEach(function (levelObj, index) {
          var categoryRow = $("<tr><td><a href='../compete.html?id=" + levelObj.category._id + "&name=" + levelObj.category.name + "&challengeType=single'>" + levelObj.category.name + "</a></td><td>" + levelObj.level + "</td></tr>").hide().delay(300 * index).fadeIn(1000);
          tableHeadings.append(categoryRow);
        })
      }
    },
    dataType: "json"
  });

  var config = {data: {}};
  // Once the buttons have been added, attach the click event on them
  $('.single-player-btn').on('click', function (event) {
    event.preventDefault();
    config.data.challenge = 'single';
    helper.changeScreen("categories.html", config);
  });

  $('.multiple-player-btn').on('click', function (event) {
    event.preventDefault();
    config.data.challenge = 'multiple';
    helper.changeScreen("categories.html", config);
  });


  $("#logout-btn").on("click", function (event) {
    event.preventDefault();
    window.localStorage.removeItem("user-token");
    socket.disconnect();
    $(':mobile-pagecontainer').pagecontainer("change", "login.html", {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: true,
      showLoadMsg: true
    })
  });


  if (!socket || !socket.connected) {
    socket = helper.connectSocket(serverUrl.hosted, helper.getAuthToken());

    socket.on('connect', function (socket) {
      console.log('authenticated');

    }).on('disconnect', function () {
      console.log('disconnected');
    });

    socket.on('reconnect', function (attemptNumber) {
      console.log(attemptNumber);
    });
  }
});