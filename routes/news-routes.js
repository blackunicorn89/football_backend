const express = require("express");
const { check } = require("express-validator")
const newsController = require("../controllers/news-controller")
const checkAuth = require("../middleware/check-auth")


router = express.Router();

router.get("/", newsController.getNews);

router.get("/:id", newsController.findArtcibleById);

//router.use(checkAuth);
router.post("/", //checkAuth,
  [
    check("header").not().isEmpty(),
    check("content").not().isEmpty(),
    check("published").not().isEmpty(),
  ],
  newsController.addNewsArticle);

router.put("/:id", //checkAuth,
  [
    check("header").not().isEmpty(),
    check("content").not().isEmpty(),
    check("published").not().isEmpty(),
  ],
  newsController.editNewsArticle);

router.delete("/:id", /*checkAuth,*/ newsController.removeNewsArticle);

module.exports = router;