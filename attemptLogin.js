document.addEventListener('DOMContentLoaded', function () {
	var spinner = new Spinner().spin();
	document.getElementById("waiting").appendChild(spinner.el);
	chrome.extension.getBackgroundPage().attemptLogin(function(loggedin) {
		if(loggedin) {
			chrome.extension.getBackgroundPage().sendAuthReq(function(is_success) {
				drawStatusImages(is_success);
				spinner.stop();
				createLogoutButton();
			}, true);
		}
		else {
			spinner.stop();
			createLoginButton();
		}
	});
});