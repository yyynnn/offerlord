"use strict";

var express = require("express");
var path = require("path");
var fs = require("fs");
var bodyParser = require("body-parser");
var handlebar = require("handlebars");
var serveStatic = require("serve-static");
// var pdf = require("html-pdf");
// var pdfOptions = { format: "A4", width: "860px", orientation: "portrait" };

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();

app.use(bodyParser.json());
app.post("/downloaddata", update);

function update(req, res) {
  var response = res;
  var source = fs.readFile("./templates/offerTemplate.html", "utf8", function(
    err,
    data
  ) {
    if (err) throw err;
    var dataFront = data.toString();
    var compile = Handlebars.compile(dataFront);
    var result = compile(req.body);
    fs.writeFile(`./download/offer.html`, result, function(err) {
      if (err) throw err;
      // var html = fs.readFileSync("./download/offer.html", "utf8");
      // pdf
      //   .create(result, pdfOptions)
      //   .toFile("./download/offer.pdf", function(err, res) {
      //     if (err) return console.log(err);
      //     console.log(res);
      //     response.sendStatus(200);
      //   });
        response.sendStatus(200);
    });
  });
}

app.use(serveStatic(path.join(__dirname, "../download/")));
router.get("/download", function(req, res) {
  var file = path.join(__dirname, `../download/email.html`);
  res.download(file, file);
});

app.use("/", router);
app.use(serveStatic(path.join(__dirname, "../public/")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port);
