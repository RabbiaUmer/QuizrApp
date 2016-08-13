/**
 * Created by rabbiaumer on 8/3/16.
 */

$(function () {
    $(document).on("pagecreate", function (event) {
        $.ajax({
            url: 'http://localhost:8000/chooseAvatar',
            type: 'GET',
            error : function (err){
                console.log(err);
            },
            success: function (data) {
                console.log(data);
            }
        });

        console.log("AVATARS LOADED");
    });
});