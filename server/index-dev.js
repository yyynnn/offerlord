import express from "express";
import path from "path";
import fs from "fs";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "../webpack.config.dev";
import bodyParser from "body-parser";
import Handlebars from "handlebars";
// var pdf = require("html-pdf");
// var pdfOptions = {
//   format: "A4",
//   width: "900px",
//   height: "1265px",
//   orientation: "portrait"
// };

const app = express();
const port = process.env.PORT || 8080;
const compiler = webpack(webpackConfig);
const router = express.Router();

app.use(bodyParser.json());
app.post("/downloaddata", update);

function update(req, res) {
  var response = res;
  let source = fs.readFile("./templates/offerTemplate.html", "utf8", function(
    err,
    data
  ) {
    if (err) throw err;
    let dataFront = data.toString();
    let compile = Handlebars.compile(dataFront);
    let result = compile(req.body);
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

app.use(
  webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath
  })
);
app.use(webpackHotMiddleware(compiler));

router.get("/download", function(req, res) {
  let file = path.join(__dirname, `../download/offer.html`);
  res.download(file, file);
});
app.use("/", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index-dev.html"));
});

app.listen(port, () => console.log("Running on localhost:" + port));
