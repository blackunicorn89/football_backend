const express = require("express");
const { check } = require("express-validator")
const editGoalPointsController = require("../controllers/editGoalPoints-controller")
const checkAuth = require("../middleware/check-auth")

router = express.Router();

router.use(checkAuth);

router.post("/", checkAuth,
  [
    check("old_goal_makers").not().isEmpty(),
    check("new_goal_makers").not().isEmpty(),
  ],
  editGoalPointsController.editGoalPoints);

module.exports = router;