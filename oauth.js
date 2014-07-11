var clientId = 'v2octogfnrh9mctd41mrorllzcre027x';
var clientSecret = 'UuUpJKJGr0lN6RblQNqcePMgWqQVJl27';
var token_url = "https://www.box.com/api/oauth2/token";
var revoke_url = "https://www.box.com/api/oauth2/revoke";

var randomString = Math.random().toString(36).substring(7);
var queryRegex = /state=(.+)&code=(.+)/;
var token_url = "https://www.box.com/api/oauth2/token";
var authorize_url = "https://www.box.com/api/oauth2/authorize"

var g_refresh_token;

var attemptLogin = function(callback) {
	chrome.storage.local.get("refresh_token", function(result) {
		var token = result.refresh_token;
		g_refresh_token = token;

		if(token === undefined) {
			callback(false);
		}
		else {
			sendAuthReq2(callback);
		}
	});
};

var sendAuthReq2 = function(callback) {
	var formdata = new FormData();
	formdata.append("grant_type", "refresh_token");
	formdata.append("refresh_token", g_refresh_token);
	formdata.append("client_id", clientId);
	formdata.append("client_secret", clientSecret);

	var req = new XMLHttpRequest();
	req.open("POST", token_url, true);
	req.send(formdata);
	req.onload = function() {	
		handleXhrLoad(callback, this.status, this.responseText);
	};
};


var sendAuthReq = function(callback) {
	var formdata = new FormData();
	formdata.append("grant_type", "refresh_token");
	formdata.append("refresh_token", g_refresh_token);
	formdata.append("client_id", clientId);
	formdata.append("client_secret", clientSecret);

	var req = new XMLHttpRequest();
	req.open("POST", token_url, true);
	req.send(formdata);
	req.onload = function() {	
		handleXhrLoad2(callback, this.status, this.responseText);
	};
};

var handleXhrLoad = function(callback, status, responseText) {
	console.log(status);

    if (status >= 200 && status < 300) {
    	var json_token = JSON.parse(responseText);
    	var access_token = json_token.access_token;
    	var refresh_token = json_token.refresh_token;
    	chrome.storage.local.set({"refresh_token": refresh_token});
    	g_refresh_token = refresh_token;
    	//executeOnTokens(access_token, refresh_token);

    	callback(true);
    }
    else {
    	callback(false);
    }
};

var handleXhrLoad2 = function(callback, status, responseText) {
	console.log(status);

    if (status >= 200 && status < 300) {
    	var json_token = JSON.parse(responseText);
    	var access_token = json_token.access_token;
    	var refresh_token = json_token.refresh_token;
    	chrome.storage.local.set({"refresh_token": refresh_token});
    	g_refresh_token = refresh_token;
    	executeOnTokens(callback, access_token, refresh_token);
    }
    else {
    	callback(false);
    }
};

function executeOnTokens(callback, access_token, refresh_token) {
	console.log(access_token);
	chrome.tabs.getSelected(null,function(tab) {
		var postData = {"url": tab.url, "access_token": access_token, "refresh_token": refresh_token};
		var url = "http://127.0.0.1:8080/";
	    var req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.send(JSON.stringify(postData));
		req.onload = function() {
			console.log(this.status);
			if(this.status >= 200 && this.status < 300) {
				callback(true);
			}
			else {
				callback(false);
			}
		};
  	});
};

function callback(val) {
	console.log("callback val is:");
	console.log(val);
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
  	xhr.onload = function() {
  		handleXhrLoad(callback, this.status, this.responseText);
  	};
};

var options = {
  	url: authorize_url + '?' + 
      'response_type=' + 'code' +
      '&client_id=' + clientId + 
      '&state=' + randomString,
      'interactive': true
};

var login = function() {
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
};

var logout = function() {
	console.log("in logout");
	var formdata = new FormData();
	formdata.append("client_id", clientId);
	formdata.append("client_secret", clientSecret);
	formdata.append("token", g_refresh_token);

	var req = new XMLHttpRequest();
	req.open("POST", revoke_url, true);
	req.send(formdata);

	req.onload = function() {
		// spinner.stop();
		console.log(this.status);
	}
};
