function clickHandler(e) {
  	var clientId = 'v2octogfnrh9mctd41mrorllzcre027x';
    var clientSecret = 'UuUpJKJGr0lN6RblQNqcePMgWqQVJl27';
    var randomString = Math.random().toString(36).substring(7);
    var queryRegex = /state=(.+)&code=(.+)/;
    var token_url = "https://www.box.com/api/oauth2/token";
    var authorize_url = "https://www.box.com/api/oauth2/authorize"

    function callback(val) {
    	console.log("callback val is:");
    	console.log(val);
    }

    function exchangeCodeForToken(code) {
		var data = new FormData();
		data.append('grant_type', 'authorization_code');
		data.append('code', code);
		data.append('client_id', clientId);
		data.append('client_secret', clientSecret);

      	var xhr = new XMLHttpRequest();
      	xhr.open('POST', token_url, true);
      	xhr.send(data);
      	xhr.onload = handleXhrLoad;
    }

	var options = {
		'interactive': true,
	  	url: authorize_url + '?' + 
	      'response_type=' + 'code' +
	      '&client_id=' + clientId + 
	      '&state=' + randomString
    }

	chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
    	if (chrome.runtime.lastError) {
    		callback(new Error(chrome.runtime.lastError));
            return;
		}
		patternMatch = queryRegex.exec(redirectUri);
		if(patternMatch.length > 2) {
			//This means that the regex has found the .pdf pattern
			if(patternMatch[1] === randomString) {
				var codeToken = patternMatch[2];
				exchangeCodeForToken(codeToken);
			}
		}
    });
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', clickHandler);
});

