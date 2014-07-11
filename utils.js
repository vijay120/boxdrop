var login = function() {
	chrome.extension.getBackgroundPage().login();
};

var logout = function() {
	chrome.extension.getBackgroundPage().logout();
	window.close();
};

function createLoginButton() {
	var login_button = document.createElement("BUTTON");
	var text = document.createTextNode("Login to Box");
	login_button.appendChild(text);
	login_button.id = "login";
	login_button.addEventListener('click', login);
	document.body.appendChild(login_button);
}

function createLogoutButton(token) {
	var logout_button = document.createElement("BUTTON");
	var text = document.createTextNode("Logout of Box");
	logout_button.appendChild(text);
	logout_button.id = "logout";
	logout_button.addEventListener('click', logout);
	document.body.appendChild(logout_button);
}

function drawStatusImages(success) {
	var figure = document.createElement("figure");
	var img = document.createElement("img");
	img.height = 50;
	img.width = 50;
	var figCaption = document.createElement("figcaption");
	if(success) {
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