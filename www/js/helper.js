// name spacing the helper file, so that we know in the codebase that we're referring a helper function from here
var helper = {
  openHomeScreen: function (reverse) {
    $(':mobile-pagecontainer').pagecontainer("change", "home.html", {
      role: "page",
      transition: "fade",
      changeHash: true,
      reverse: reverse,
      showLoadMsg: true
    })
  }
};