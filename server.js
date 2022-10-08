const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const HttpError = require('./models/http-error');

const usersRoutes = require("./routes/users-routes");
const newsRoutes = require("./routes/news-routes");
const playersRoutes = require("./routes/players-routes");

const app = express()
app.use(bodyParser.json()) //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

// Cors Policy

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
  next();
});

app.use("/api/users", usersRoutes); // Users Sign up, Login routes.
app.use("/api/", newsRoutes); // Create, Read, Update, Deletete news 
app.use("/api/players", playersRoutes) // Create, Read, Update, Deletete players


// GENERAL ERROR HANDLER

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});


// MONGODB CONNECTION
let port = process.env.port || 3001;
const mong_user = process.env.TEAMDATA_MONGODB_USERNAME
const mongo_password = process.env.TEAMDATA_MONGODB_PASSWORD
const mongo_url = process.env.TEAMDATA_MONGODB_URL

mongoose
  .connect("mongodb+srv://" + mong_user + ":" + mongo_password + "@" + mongo_url + "/?retryWrites=true&w=majority")
  .then(() => app.listen(port), console.log(`Running in ${port}`))
  .catch(err => console.log("Failed to connect. Reason", err));
