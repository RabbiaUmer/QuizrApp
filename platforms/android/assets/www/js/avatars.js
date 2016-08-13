/**
 * Created by rabbiaumer on 8/3/16.
 */

$(function () {
    $(document).on("pagecreate", function (event) {
        /* adding interval since jquery mobile allows to call hide/show loader events
         only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/

        var showLoader = setInterval(function () {
            $.mobile.loading('show');
            clearInterval(showLoader);
        });

        $.ajax({
            url: 'http://localhost:8000/chooseAvatar',
            type: 'GET',
            error: function (err) {
                console.log(err);
            },
            success: function (data) {
                data.forEach(function (avatarUrl) {
                    $("#avatars .row").append("<img src='" + avatarUrl + "' class='col-xs-4 img-responsive img-circle'/>");
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