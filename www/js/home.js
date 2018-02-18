/**
 * Created by rabbiaumer on 5/29/17.
 */

$(function () {

  // Fire off a request to fetch user information as soon as the page loads
  var authToken = window.localStorage.getItem("user-token");
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

  // Once the buttons have been added, attach the click event on them
  $('.single-player-btn').on('click', function (event) {
    event.preventDefault();
    pageContainerChange('single');
  });

  $('.multiple-player-btn').on('click', function (event) {
    event.preventDefault();
    pageContainerChange('multiple');
  });

  function pageContainerChange(challengeType) {
    $(':mobile-pagecontainer').pagecontainer("change", "categories.html", {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: true,
      showLoadMsg: true,
      data: {
        challenge: challengeType
      }
    })
  }


  $("#logout-btn").on("click", function (event) {
    event.preventDefault();
    window.localStorage.removeItem("user-token");
    $(':mobile-pagecontainer').pagecontainer("change", "login.html", {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: true,
      showLoadMsg: true
    })
  });
});