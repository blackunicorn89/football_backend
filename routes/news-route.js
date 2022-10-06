const express = require("express");
const { check } = require("express-validator")
const newsController = require("../controllers/news-controller")


router = express.Router();

router.get("/news", newsController.getNews);

module.exports = router;