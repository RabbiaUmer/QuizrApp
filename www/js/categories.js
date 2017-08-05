/**
 * Created by Rabbia Umer on 9/19/16.
 */

$(function () {

  // use one instead of on, so that we don't have multiple pagecreate events attached to the same documents,
  // reference here http://stackoverflow.com/a/22585583/1609548 , https://api.jquery.com/one/
  $(document).one("pagecreate", function (event) {

    /* adding interval since jquery mobile allows to call hide/show loader events
     only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/

    var showLoader = setInterval(function () {
      $.mobile.loading('show');
      clearInterval(showLoader);
    });

    var token = window.localStorage.getItem('user-token');

    $.ajax({
      url: 'https://programming-quiz-learning-app.herokuapp.com/categories',
      headers: {
        'x-access-token': token
      },
      type: 'GET',
      error: function (err) {
        console.log(err);
      },
      contentType: 'text/plain',
      async: true,
      success: function (languages) {

        languages.forEach(function (language) {
          $("#categories").append('<div class="row"><div class="col-xs-12"> <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-icon-right ui-icon-carat-r" data-id="' + language._id + '" data-name="' + language.name + '" class="btn btn-default btn-block">' + language.name.toUpperCase() + ' </a></div></div>');
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