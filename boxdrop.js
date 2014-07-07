var request = require('request');
var fs = require('fs');
var path = require('path');
var http = require('http');

var urlRegEx = /([^.\/~%]+\.pdf)/;

var downloadUrl = function(url, token, cb) {
	var sanitizedUrl = urlRegEx.exec(url)[0];
	var filePath = "/tmp/"+sanitizedUrl;
	var file = fs.createWriteStream(filePath);
	request.get(url).pipe(file);
	file.on('finish', function() {
		cb(filePath, token);
	});
}

var uploadFile = function(filePath, token) {
	var r = request.post("https://upload.box.com/api/2.0/files/content", function(error, resp, body) {
		console.log(resp);
	}).auth(null, null, true, token);

	var form = r.form();
	form.append("filename", fs.createReadStream(filePath));
	form.append("folder_id", "0");
}

http.createServer(function(req, res) {
	if (req.method == 'POST') {
		var body = '';
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
        	console.log(body);
        	var keyVal = JSON.parse(body);
        	var url = keyVal["url"];
        	var access_token = keyVal["access_token"];
        	var refresh_token = keyVal["refresh_token"];

        	downloadUrl(url, access_token, uploadFile);
        });
	}
}).listen(8080);