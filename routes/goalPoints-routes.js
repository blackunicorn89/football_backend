const express = require("express");
const { check } = require("express-validator")
const GamesController = require("")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.put("/:id", checkAuth,
  [
    check("points").not().isEmpty(),
  ],
  GamesController.editGame);

module.exports = router;