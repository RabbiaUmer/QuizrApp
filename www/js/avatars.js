/**
 * Created by rabbiaumer on 8/3/16.
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
      url: 'https://programming-quiz-learning-app.herokuapp.com/chooseAvatar',
      type: 'GET',
      headers: {
        'x-access-token': token
      },
      error: function (err) {
        console.log(err);
      },
      success: function (data) {
        data.forEach(function (avatar, i) {
          $("#avatars .row")
            .append("<img src='" + avatar.avatarUrl + "' data-name='" + avatar.avatarName + "' class='col-xs-4 col-md-2 col-lg-2 img-responsive img-circle avatar'/>").hide();
          $("#avatars .row").fadeIn(500);
        });
        /* adding interval since jquery mobile allows to call hide/show loader events
         only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/
        var hideLoader = setInterval(function () {
          $.mobile.loading('hide');
          clearInterval(showLoader);
        });

        // ajax request to set the avatar on the backend, which will set it in the database
        $(".avatar").on("click", function () {
          $.ajax({
            url: 'https://programming-quiz-learning-app.herokuapp.com/set-avatar',
            data: {
              avatarName: $(this).attr("data-name"),
            },
            headers: {
              'x-access-token': token
            },
            type: 'POST',
            headers: {
              'x-access-token': token
            },
            error: function (err) {
              console.log(err);
            },
            success: function (data) {

              $(':mobile-pagecontainer').pagecontainer("change", "home.html", {
                role: "page",
                transition: "fade",
                changeHash: false,
                reverse: true,
                showLoadMsg: true
              });
            }

          }); // end of set-avatar ajax

        }); // end of onClick event

      } // end of success

    }); // end of chooseAvatar ajax

  }); // end of pagecreate event

}); // end of ready function