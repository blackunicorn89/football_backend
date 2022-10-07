const express = require("express");
const { check } = require("express-validator")
const newsController = require("../controllers/news-controller")
const checkAuth = require("../middleware/check-auth")


router = express.Router();

router.get("/news", newsController.getNews);

router.use(checkAuth);
router.post("/news",
  [
    check("header").not().isEmpty(),
    check("content").not().isEmpty(),
    check("date").not().isEmpty(),
  ],
  newsController.addNewsArticle);

  router.put("/news/:id",
  [
    check("header").not().isEmpty(),
    check("content").not().isEmpty(),
    check("date").not().isEmpty(),
  ],
  newsController.editNewsArticle);
  
  router.delete("/news/:id", newsController.removeNewsArticle);

module.exports = router;