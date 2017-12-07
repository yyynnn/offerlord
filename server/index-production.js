"use strict";

var express = require("express");
var path = require("path");
var fs = require("fs");
var bodyParser = require("body-parser");
var Handlebars = require("handlebars");
var serveStatic = require("serve-static");
var requestSejda = require('request');

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();

app.use(bodyParser.json());
app.post("/downloaddata", update);

function update(req, res) {
	var source = fs.readFile('./templates/offerTemplate.html', 'utf8', function(
		err,
		data
	) {
		if (err) throw err;
		var dataFront = data.toString();
		var compile = Handlebars.compile(dataFront);
		var result = compile(req.body);
		var compiledString = result.toString();
		var options = {
			method: 'POST',
			encoding: 'binary',
			json: { type: 'htmlToPdf', htmlCode: compiledString },
			uri: 'https://api.sejda.com/v1/tasks',
			headers: { 'Content-Type': 'application/json' }
		};
		var callback = function(error, response, body) {
			fs.writeFile(`./download/offer.pdf`, body, 'binary', function(err) {
				if (err) throw err;
				res.sendStatus(200);
			});
		};
		requestSejda(options, callback);
	});
}

app.use(serveStatic(path.join(__dirname, "../download/")));
router.get("/download", function(req, res) {
  var file = path.join(__dirname, `../download/offer.pdf`);
  res.download(file, file);
});

app.use("/", router);
app.use(serveStatic(path.join(__dirname, "../public/")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port);
