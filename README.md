Football_backend

depencies:

"bcrypt": "^5.0.1", https://www.npmjs.com/package/bcrypt
"body-parser": "^1.20.0", https://www.npmjs.com/package/body-parser
"express": "^4.18.1", https://www.npmjs.com/package/express
"express-validator": "^6.14.2", https://express-validator.github.io/docs/index.html
"jsonwebtoken": "^8.5.1", https://jwt.io/
"mongoose": "^6.6.1", https://www.npmjs.com/package/mongoose
"mongoose-unique-validator": "^3.1.0", https://www.npmjs.com/package/mongoose-unique-validator
"nodemon": "^2.0.20", https://www.npmjs.com/package/nodemon
"uuid": "^9.0.0", https://www.npmjs.com/package/uuid

## Server.js

const usersRoutes = require("./routes/users-routes");
app.use("/api/users", usersRoutes);

Routes kansioon kaikki eri routet esim: users, news, players etc...

## ./routes/user-routes.js

localhost:3001/api/users polut

## ./routes/user-routes.js

const express = require("express");
const { check } = require("express-validator")
const usersControllers = require("../controllers/users-controller")

router = express.Router();

Rekisteröinti (toistaiseksi käytössä)

router.post("/signup",
[
check("firstname").not().isEmpty(), ==> check middleware on express-validatorin oma validaatio
check("lastname").not().isEmpty(), ==> Ei voi olla tyhjä
check("email").normalizeEmail().isEmail(), ==> muuntaa kaikki kirjimet pieniksi esim: TesTi@useR.fi === testi@user.fi
check("password").isLength({ min: 6 }) ==> Salasanan mimi pituus
],
usersControllers.signup); ==> Kotrolleri jossa funktiot kirjautumiseen ja rekisteröitymiseen.

router.post("/login", usersControllers.login); ==> Myös tälle on oma funktio (login ) ../controllers/users-controller.js tiedostossa. Kyseinen tiedosto sisältää /api/users routen toiminnallisuudet.

module.exports = router;

## insomnia routet

POST
localhost:3001/api/users/signup

{
"firstname": "Test",
"lastname": "User",
"email": "test@user.com",
"password": "testuser"
}

POST
localhost:3001/api/users/login

{
"email": "test@user.com",
"password": "testuser"
}
