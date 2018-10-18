require(["dojo/request", "dojo/topic", "dojo/domReady!"], function(request, topic) {
  var proxyApiCall = function() {
    request('/files/customizer/proxy?reponame=customizer-sample-apps&proxyFile=proxySample/basicProxy/jsonTestAPI.json',
      {
        headers: {
          'customizer-proxy': true,
          'Content-Type': 'application/json'
        },
        handleAs: 'json',
        method: 'GET',
      }).then((response) => {
        dojo.query("span.shareSome-title")[0].textContent=response.title;
    });
  }

  proxyApiCall();
});
