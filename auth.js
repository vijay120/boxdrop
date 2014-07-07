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

    //check for refresh token
    chrome.storage.local.get("refresh_token", function(result) {
    	var token = result.refresh_token;
    	if(token === undefined) {
    		//No tokens detected. Therefore, go through the whole 3 step OAuth process
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
					if(patternMatch[1] === randomString) {
						var codeToken = patternMatch[2];
						exchangeCodeForToken(codeToken);
					}
				}
		    });
    	}
    	else {
			var formdata = new FormData();
			formdata.append("grant_type", "refresh_token");
			formdata.append("refresh_token", token);
			formdata.append("client_id", clientId);
			formdata.append("client_secret", clientSecret);

			var req = new XMLHttpRequest();
			req.open("POST", token_url, true);
			req.send(formdata);
			req.onload = handleXhrLoad;
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
    };

    function handleXhrLoad() {
        if (this.status === 200) {
        	var json_token = JSON.parse(this.responseText);
        	var access_token = json_token.access_token;
        	var refresh_token = json_token.refresh_token;
        	chrome.storage.local.set({"refresh_token": refresh_token});
        	executeOnTokens(access_token, refresh_token);
	    }
    };

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
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', clickHandler);
});

