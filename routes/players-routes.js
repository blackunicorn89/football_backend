const express = require("express");
const { check } = require("express-validator")
const playersController = require("../controllers/players-controller")
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth")


router = express.Router();

router.get("/", playersController.getPlayers);

router.post("/", fileUpload.single("image"),
  [
    check("player_name").not().isEmpty(),
    check("player_number").isNumeric().notEmpty(),
    check("position").notEmpty(),
    check("description").notEmpty()
  ],
  playersController.addPlayer)



module.exports = router;