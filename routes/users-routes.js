const express = require("express");
const { check } = require("express-validator")
const checkAuth = require("../middleware/check-auth")
const usersControllers = require("../controllers/users-controller")


router = express.Router();

router.get("/getusers", usersControllers.getUsers);
router.post("/login", usersControllers.login);

router.use(checkAuth);
router.post("/signup", checkAuth,
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersControllers.signup);

router.delete("/removeuser/:id", checkAuth, usersControllers.removeUser);

router.put("/edituser/:id", checkAuth,
[
  check("firstname").not().isEmpty(),
  check("lastname").not().isEmpty(),
  check("email").normalizeEmail().isEmail()
],
usersControllers.editUser);



module.exports = router;