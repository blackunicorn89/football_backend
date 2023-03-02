const express = require("express");
const { check } = require("express-validator")
const deleteGoalPointsController = require("../controllers/deleteGoalPoints-controller")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.post("/", checkAuth,
  [
    check("goal_makers").not().isEmpty(),
  ],
  deleteGoalPointsController.deleteGoalPoints);

module.exports = router;