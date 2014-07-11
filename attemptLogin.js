document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.getBackgroundPage().attemptLogin(function(loggedin) {
		if(loggedin) {
			createLogoutButton();
			chrome.extension.getBackgroundPage().sendAuthReq(function(is_success) {
				drawStatusImages(is_success);
			});
		}
		else {
			createLoginButton();
		}
	});
});