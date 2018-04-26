// name spacing the helper file, so that we know in the codebase that we're referring a helper function from here
var helper = {
  changeScreen(pageName, config) {
    // If configs are provided use those, otherwise fallback to dfault
    var preparedConfigs = {
      role: config && config.role ? config.page : "page",
      transition: config && config.transition ? config.transition : "fade",
      changeHash: config && config.changeHash ? config.changeHash : true,
      reverse: config && config.reverse ? config.reverse : true,
      showLoadMsg: config && config.showLoadMsg ? config.showLoadMsg : true,
      data: config && config.data ? config.data : null
    };

    $(':mobile-pagecontainer').pagecontainer("change", pageName, preparedConfigs)
  },
  getAuthToken: function () {
    return window.localStorage.getItem("user-token");
  },
  setAuthToken: function (token) {
    return window.localStorage.setItem("user-token", token);
  },
  clearAuthToken: function () {
    return window.localStorage.removeItem("user-token");
  },
  connectSocket: function (url, token) {
    return io(url, {
      query: 'token=' + token || authToken
    });
  }
};