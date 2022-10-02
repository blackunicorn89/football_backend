const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// MODELS
const userModel = require("./models/user");
const sessionModel = require("./models/session");

let app = express();
app.use(express.json());

// MONGODB CONNECTION
let port = process.env.port || 3001;
const mong_user = process.env.TEAMDATA_MONGODB_USERNAME
const mongo_password = process.env.TEAMDATA_MONGODB_PASSWORD
const mongo_url = process.env.TEAMDATA_MONGODB_URL

mongoose.connect("mongodb+srv://" + mong_user + ":" + mongo_password + "@" + mongo_url + "/?retryWrites=true&w=majority").then(
    () => console.log("Connected to mongodb"),
    (err) => console.log("Failed to connect. Reason", err)
);

// SESSION TOKEN LIFETIME VARIABLE
const time_to_live_diff = 3600000;

// HERE WE CREATE TOKEN WHEN USER HAS LOGGED IN
createToken = () => {
    let token = crypto.randomBytes(64);
    return token.toString("hex");
}

// TOKEN CHECK, IF USER HAS ALREADY SIGNED IN
isUserLogged = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(403).json({ message: "Forbidden!" });
    }
    sessionModel.findOne({ "token": req.headers.token }, function (err, session) {
        if (err) {
            console.log("Failed to find session. Reason", err);
            return res.status(403).json({ message: "Forbidden" })
        }
        if (!session) {
            return res.status(403).json({ message: "Forbidden" })
        }
        let now = Date.now();
        if (now > session.ttl) {
            sessionModel.deleteOne({ "_id": session._id }, function (err) {
                if (err) {
                    console.log("Failed to remove session. Reason", err)
                }
                return res.status(403).json({ message: "Forbidden" })
            })
        } else {
            req.session = {};
            req.session.user = session.user;
            session.ttl = now + time_to_live_diff;
            session.save(function (err) {
                if (err) {
                    console.log("Failed to resave session. Reason", err);
                }
                return next()
            })
        }
    })
}

// ADMIN LOGIN ROUTE (/login) 
app.post("/login", function (req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Bad Request" });
    }
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Bad Request" });
    }
    if (req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({ message: "Bad Request" });
    }
    userModel.findOne({ "username": req.body.username }, function (err, user) {
        if (err) {
            console.log("Failed to login. Reason", err);
            return res.status(500).json({ message: "Internal server error" })
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        bcrypt.compare(req.body.password, user.password, function (err, success) {
            if (err) {
                console.log("Comparing passwords failed. Reason", err);
                return res.status(500).json({ message: "Internal server error" })
            }
            if (!success) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            let token = createToken();
            let now = Date.now();
            let session = new sessionModel({
                user: req.body.username,
                ttl: now + time_to_live_diff,
                token: token
            })
            session.save(function (err) {
                if (err) {
                    console.log("Saving session failed. Reason", err);
                    return res.status(500).json({ message: "Internal server error" })
                }
                return res.status(200).json({ token: token });
            })
        })
    })
});

// LOGOUT + DELETING TOKEN
app.post("/logout", function (req, res) {
    if (!req.headers.token) {
        return res.status(404).json({ message: "Not found" });
    }
    sessionModel.deleteOne({ "token": req.headers.token }, function (err) {
        if (err) {
            console.log("Failed to logout user. Reason", err)
        }
        return res.status(200).json({ message: "Logged out" });
    })
})

app.listen(port)
console.log(`Running in ${port}`);
