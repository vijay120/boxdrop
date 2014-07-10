var token_url = "https://www.box.com/api/oauth2/token";
var revoke_url = "https://www.box.com/api/oauth2/revoke";
var spinner;

var attemptLogin = {
	findToken: function() {
		chrome.storage.local.get("refresh_token", function(result) {
			var token = result.refresh_token;
			if(token === undefined) {
				createLoginButton();
			}
			else {
				spinner = new Spinner().spin();
				document.body.appendChild(spinner.el);

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
	}
};

document.addEventListener('DOMContentLoaded', function () {
	attemptLogin.findToken();
});