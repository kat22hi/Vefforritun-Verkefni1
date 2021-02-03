const path = require("path");
const express = require("express");
const videos = require("./src/videos");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.locals.setContent = content;
app.use(express.static(path.join(__dirname, "public")));
app.use("/", videos);

function nothingFound(req, res, next) {
  const title = "Ekkert fannst";
  const message = "Ekkert efni fannst";
  res.status(404).render("error", { title, message });
}

function error(err, req, res, next) {
  console.error(err);
  const title = "Villa hefur komið upp";
  const message = err.toString();
  res.status(500).render("error", { title, message });
}

app.use(nothingFound);
app.use(error);

const port = 3000;

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
