var request = require('request');
var fs = require('fs');
var path = require('path');

var testLink = "http://web.stanford.edu/group/scspi/_media/working_papers/pfeffer-danziger-schoeni_wealth-levels.pdf"
var file = fs.createWriteStream("./test1.pdf");
request.get(testLink).pipe(file);

var r = request.post("https://upload.box.com/api/2.0/files/content", function(error, resp, body) {
																console.log(resp);
																//console.log(error);
															}).auth(null, null, true, "wl4CMAv065ZVO1RYs0kbVepc021dASfH");
var form = r.form();
form.append("filename", fs.createReadStream(path.join(__dirname, 'test1.pdf')));
form.append("folder_id", "0");