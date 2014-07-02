var request = require('request');
var fs = require('fs');
var path = require('path');
var http = require('http');

var urlRegEx = /([^.\/~%]+.pdf)/;

var downloadUrl = function(url, cb) {
	var sanitizedUrl = urlRegEx.exec(url)[0];
	var filePath = "/tmp/"+sanitizedUrl;
	var file = fs.createWriteStream(filePath);
	request.get(url).pipe(file);

	file.on('finish', function() {
		cb(filePath);
	});
}

var uploadFile = function(filePath) {
	var r = request.post("https://upload.box.com/api/2.0/files/content", function(error, resp, body) {
		console.log(resp);
	}).auth(null, null, true, "LHTBMJ3wHoLzmFcmQTVROszrjgDxn1Iw");

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
        	var keyVal = JSON.parse(body);
        	var url = keyVal["url"];
        	downloadUrl(url, uploadFile);
        });
	}
}).listen(8080);

