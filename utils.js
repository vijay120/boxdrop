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
	document.getElementById("auth_button").appendChild(login_button);
};

function createLogoutButton(token) {
	var logout_button = document.createElement("BUTTON");
	var text = document.createTextNode("Box Log Out");
	logout_button.appendChild(text);
	logout_button.className = "btn btn-warning btn-sm center-block";
	logout_button.id = "logout";
	logout_button.addEventListener('click', logout);
	document.getElementById("auth_button").appendChild(logout_button);
};

function drawStatusImages(success) {
	var img = document.createElement("img");
	var text = document.createElement("h2");
	text.className = "text-center";
	var textNode;
	img.className = "img-responsive center-block";
	img.height = 50;
	img.width = 50;
	if(success) {
		img.src = "greencheck.png";
		textNode = document.createTextNode("Saved!");
	}
	else {
		img.src = "redcross.png";
		textNode = document.createTextNode("Couldn't save :(");
	}
	text.appendChild(textNode);
	document.getElementById("result_image").appendChild(img);
	document.getElementById("result_text").appendChild(text);
};