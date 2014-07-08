function handleXhrLoad() {
    if (this.status === 200) {
    	var json_token = JSON.parse(this.responseText);
    	var access_token = json_token.access_token;
    	var refresh_token = json_token.refresh_token;
    	chrome.storage.local.set({"refresh_token": refresh_token});
    	executeOnTokens(access_token, refresh_token);
    }
};

function executeOnTokens(access_token, refresh_token) {
	console.log(access_token);
	chrome.tabs.getSelected(null,function(tab) {
		var postData = {"url": tab.url, "access_token": access_token, "refresh_token": refresh_token};
		var url = "http://127.0.0.1:8080/";
	    var req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.send(JSON.stringify(postData));
  	});
};

