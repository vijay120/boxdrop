var revoke_url = "https://www.box.com/api/oauth2/revoke";
var g_refresh_token;

function handleXhrLoad() {
	console.log(this);

    if (this.status >= 200 && this.status < 300) {
    	var json_token = JSON.parse(this.responseText);
    	var access_token = json_token.access_token;
    	var refresh_token = json_token.refresh_token;
    	chrome.storage.local.set({"refresh_token": refresh_token});
    	g_refresh_token = refresh_token;
    	executeOnTokens(access_token, refresh_token);

    	//Person has already logged in
		createLogoutButton();
    }
    else {
    	spinner.stop();
    	createLoginButton();
    }
};

var login = function() {

	spinner = new Spinner().spin();
	document.body.appendChild(spinner.el);

	console.log("inside click handler");

    var randomString = Math.random().toString(36).substring(7);
    var queryRegex = /state=(.+)&code=(.+)/;
    var token_url = "https://www.box.com/api/oauth2/token";
    var authorize_url = "https://www.box.com/api/oauth2/authorize"

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
      	xhr.onload = handleXhrLoad;
    };

	var options = {
		'interactive': true,
	  	url: authorize_url + '?' + 
	      'response_type=' + 'code' +
	      '&client_id=' + clientId + 
	      '&state=' + randomString
    };

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
	spinner = new Spinner().spin();
	document.body.appendChild(spinner.el);


	req.onload = function() {
		spinner.stop();
		console.log(this.status);
	}
};

function createLoginButton() {
	var login_button = document.createElement("BUTTON");
	var text = document.createTextNode("Login to Box");
	login_button.appendChild(text);
	login_button.id = "login";
	login_button.addEventListener('click', login);
	document.body.appendChild(login_button);
}

function createLogoutButton() {
	var logout_button = document.createElement("BUTTON");
	var text = document.createTextNode("Logout of Box");
	logout_button.appendChild(text);
	logout_button.id = "logout";
	logout_button.addEventListener('click', logout)
	document.body.appendChild(logout_button);
}

function executeOnTokens(access_token, refresh_token) {
	console.log(access_token);
	chrome.tabs.getSelected(null,function(tab) {
		var postData = {"url": tab.url, "access_token": access_token, "refresh_token": refresh_token};
		var url = "http://127.0.0.1:8080/";
	    var req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.send(JSON.stringify(postData));
		req.onload = drawStatusImages;
  	});
};

function drawStatusImages() {
	spinner.stop();

	var figure = document.createElement("figure");
	var img = document.createElement("img");
	img.height = 50;
	img.width = 50;
	var figCaption = document.createElement("figcaption");
	if(this.status >= 200 && this.status < 300) {
		img.src = "greencheck.png";
		figCaption.textContent = "Saved!";
	}
	else {
		img.src = "redcross.png";
		figCaption.textContent = "Could not save file :(";
	}
	figure.appendChild(img);
	figure.appendChild(figCaption);
	document.body.appendChild(figure);
};