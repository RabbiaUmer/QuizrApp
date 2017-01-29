/**
 * Created by Rabbia Umer on 9/19/16.
 */

$(function () {
    $(document).on("pagecreate", function (event) {
        console.log("PAGECREATE");
        /* adding interval since jquery mobile allows to call hide/show loader events
         only on pageshow event or inside setInterval, refer to  http://stackoverflow.com/a/16277865/1609548*/

        var showLoader = setInterval(function () {
            $.mobile.loading('show');
            clearInterval(showLoader);
        });

        $.ajax({
            url: 'http://localhost:8000/categories',
            type: 'GET',
            error: function (err) {
                console.log(err);
            },
            async:true,
            success: function (languages) {

                for(var language in languages){
                    console.log(language.name);
                }
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