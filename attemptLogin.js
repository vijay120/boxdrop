var token_url = "https://www.box.com/api/oauth2/token";

var attemptLogin = {
	findToken: function() {
		chrome.storage.local.get("refresh_token", function(result) {
			var token = result.refresh_token;
			if(token === undefined) {
				var button = document.createElement("BUTTON");
				var text = document.createTextNode("Login to Box");
				button.appendChild(text);
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

				var paragraph = document.createElement("p");
				var node = document.createTextNode("Document has been sent to the server");
				paragraph.appendChild(node);
			}
		});
	}
};

document.addEventListener('DOMContentLoaded', function () {
	attemptLogin.findToken();
});