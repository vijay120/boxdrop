var login = function() {
	chrome.extension.getBackgroundPage().login();
};

var logout = function() {
	chrome.extension.getBackgroundPage().logout();
	window.close();
};

function createLoginButton() {
	var login_button = document.createElement("BUTTON");
	var text = document.createTextNode("Box Log In");
	login_button.appendChild(text);
	login_button.className = "btn btn-primary";
	login_button.id = "login";
	login_button.addEventListener('click', login);
	document.body.appendChild(login_button);
}

function createLogoutButton(token) {
	var logout_button = document.createElement("BUTTON");
	var text = document.createTextNode("Box Log Out");
	logout_button.appendChild(text);
	logout_button.className = "btn btn-warning";
	logout_button.id = "logout";
	logout_button.addEventListener('click', logout);
	document.body.appendChild(logout_button);
}

function drawStatusImages(success) {
	var img = document.createElement("img");
	var text;
	img.className = "img-rounded";
	img.height = 50;
	img.width = 50;
	if(success) {
		img.src = "greencheck.png";
		text = document.createTextNode("Saved!");
	}
	else {
		img.src = "redcross.png";
		text = document.createTextNode("Could not save :(");
	}
	document.getElementById("result_image").appendChild(img);
	document.getElementById("result_text").appendChild(text);
};