/**
 * Created by Rabbia Umer on 9/19/16.
 */

$(function () {

  // use one instead of on, so that we don't have multiple pagecreate events attached to the same documents,
  // reference here http://stackoverflow.com/a/22585583/1609548 , https://api.jquery.com/one/
  $('#categories-selection').one("pageshow", function (event) {

    var challengeType = $(this).data("url").split("?")[1].split('=')[1];

    /* adding interval since jquery mobile allows to call hide/show loader events
     only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/

    var showLoader = setInterval(function () {
      $.mobile.loading('show');
      clearInterval(showLoader);
    });

    var token = window.localStorage.getItem('user-token');

    $.ajax({
      url: serverUrl.hosted + '/categories',
      headers: {
        'x-access-token': token
      },
      type: 'GET',
      error: function (err) {
        console.log(err);
      },
      contentType: 'text/plain',
      success: function (languages) {

        languages.forEach(function (language) {
          $("#categories").append('<div class="row"><div class="col-xs-12"> <button class="category-btn ui-btn ui-corner-all ui-shadow ui-btn-icon-right ui-icon-carat-r" data-transition="fade" data-id="' + language._id + '" data-name="' + language.name + '" class="btn btn-default btn-block">' + language.name.toUpperCase() + ' </button></div></div>');
        });

        // Once the buttons have been added, attach the click event on them
        $('.category-btn').on('click', function (event) {
          event.preventDefault();
          var config = {
            data: {
              id: $(this).attr("data-id"),
              name: $(this).attr("data-name"),
              challengeType: challengeType
            }
          };
          var pageName = challengeType === 'single' ? 'compete.html' : 'multiplayer-compete.html';
          helper.changeScreen(pageName, config);
        });

        /* adding interval since jquery mobile allows to call hide/show loader events
         only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/
        var hideLoader = setInterval(function () {
          $.mobile.loading('hide');
          clearInterval(showLoader);
        });

      }
    });
  });
});