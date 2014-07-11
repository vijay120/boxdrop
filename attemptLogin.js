var spinner = new Spinner().spin();

document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.getBackgroundPage().attemptLogin(function(loggedin) {
		if(loggedin) {
			document.body.appendChild(spinner.el);
			chrome.extension.getBackgroundPage().sendAuthReq(function(is_success) {
				drawStatusImages(is_success);
				spinner.stop();
				createLogoutButton();
			}, true);
		}
		else {
			createLoginButton();
		}
	});
});