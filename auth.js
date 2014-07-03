function clickHandler(e) {
  	var clientId = 'v2octogfnrh9mctd41mrorllzcre027x';
    var clientSecret = 'UuUpJKJGr0lN6RblQNqcePMgWqQVJl27';
    var randomString = Math.random().toString(36).substring(7);
    var queryRegex = /state=(.+)&code=(.+)/;

	var options = {
		'interactive': true,
	  	url:'https://www.box.com/api/oauth2/authorize?' +
	      'response_type=' + 'code' +
	      '&client_id=' + clientId + 
	      '&state=' + randomString
    }

    function callback(val) {
    	console.log("callback val is:");
    	console.log(val);
    }

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
    	if (chrome.runtime.lastError) {
    		callback(new Error(chrome.runtime.lastError));
            return;
		}

		patternMatch = queryRegex.exec(redirectUri);
		if(patternMatch.length > 2) {
			if(patternMatch[1] === randomString) {
				var codeToken = patternMatch[2];
				exchangeCodeForToken(codeToken);
			}
		}

    });

    function executeOnTokens(access_token, refresh_token) {
    	console.log(access_token);
		chrome.tabs.getSelected(null,function(tab) {
			var postData = {"url": tab.url, "access_token": access_token, "refresh_token": refresh_token};
			var url = "http://127.0.0.1:8080/";
		    var req = new XMLHttpRequest();
			req.open("POST", url, true);
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			req.send(JSON.stringify(postData));
	  	});
    }

    function exchangeCodeForToken(code) {

		var data = new FormData();
		data.append('grant_type', 'authorization_code');
		data.append('code', code);
		data.append('client_id', clientId);
		data.append('client_secret', clientSecret);

      	var xhr = new XMLHttpRequest();

      	xhr.open('POST', 'https://www.box.com/api/oauth2/token', true);
      	xhr.send(data);

      	xhr.onload = function () {
	        if (this.status === 200) {
	        	executeOnTokens(JSON.parse(this.responseText).access_token, JSON.parse(this.responseText).refresh_token);
		    }
      	};
    }
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', clickHandler);
});

