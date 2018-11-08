require(["dojo/request", "dojo/topic", "dojo/domReady!"], function(request, topic) {
  var proxyApiCall = function() {
    request('https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&text=${encodedText}',
      {
        headers: {
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
