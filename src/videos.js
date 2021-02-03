const util = require("util");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const readFileAsync = util.promisify(fs.readFile);

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function readList() {
  const file = await readFileAsync("./videos.json");
  const json = JSON.parse(file);
  return json;
}

async function list(req, res) {
  const title = "Myndbönd";
  const json = await readList();
  const { videos } = json;
  const categories = json.categories.map(({ title, videos }) => ({
    title,
    videos: videos.map((id) => json.videos.find((v) => v.id === id)),
  }));
  res.render("videos", { title, categories });
}

async function video(req, res, next) {
  const { id } = req.params;
  const json = await readList();
  const { videos } = json;
  const foundVideo = videos.find((a) => a.id === Number(id));

  if (!foundVideo) {
    return next();
  }

  const { title } = foundVideo;
  return res.render("video", {
    title,
    video: {
      ...foundVideo,
      related: foundVideo.related.map((id) => videos.find((v) => v.id === id)),
    },
  });
}

router.get("/:id", catchErrors(video));
router.get("/", catchErrors(list));
module.exports = router;
