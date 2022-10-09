const express = require("express");
const { check } = require("express-validator")
const playersController = require("../controllers/players-controller")
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const player = require("../models/player");


router = express.Router();

router.get("/", playersController.getPlayers);
router.get("/:id", playersController.getPlayerById);

router.post("/", checkAuth, fileUpload.single("image"),
  [
    check("player_name").not().isEmpty(),
    check("player_number").isNumeric().notEmpty(),
    check("position").notEmpty(),
    check("description").notEmpty()
  ],
  playersController.addPlayer)

router.put("/:id", checkAuth, fileUpload.single("image"),
  [
    check("player_name").not().isEmpty(),
    check("player_number").isNumeric().notEmpty(),
    check("position").notEmpty(),
    check("description").notEmpty()
  ],
  playersController.editPlayer);

router.delete("/:id", checkAuth, playersController.deletePlayer)

module.exports = router;