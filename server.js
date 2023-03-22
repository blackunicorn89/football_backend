const fs = require("fs");
const path = require("path")

const express = require('express');
const bodyParser = require('body-parser');
const postgreSqlDb = require("./models");

const HttpError = require('./models/http-error');

const usersRoutes = require("./routes/users-routes");
const newsRoutes = require("./routes/news-routes");
const playersRoutes = require("./routes/players-routes");
const seasonRoutes = require("./routes/season-routes")
const gamesRoutes = require("./routes/game-routes");
const seasonGames = require("./routes/seasonGames-routes")
const deleteGoalPointsRoute = require("./routes/deleteGoalPoints-route")

const app = express()
app.use(bodyParser.json()) //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

app.use("/uploads/images", express.static(path.join("uploads", "images")));

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
app.use("/api/news", newsRoutes); // Create, Read, Update, Deletete news 
app.use("/api/players", playersRoutes) // Create, Read, Update, Deletete players
app.use("/api/seasons", seasonRoutes) // Create, Read, Update, Deletete players
app.use("/api/games", gamesRoutes) // Create, Read, Update, Deletete games
app.use("/api/games/deletegoalpoints", deleteGoalPointsRoute) // Deletes player's goal points 
app.use("/api/seasongames", seasonGames) // Reads games of the season


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


//GENEREAL SERVER RUNNING INFORMATION
let port = process.env.port || 3001;
app.listen(port), console.log(`Running in ${port}`)

  // Sync PostgreSql databases
  //In development, you may need to drop existing tables and re-sync database. Just use force: true
  postgreSqlDb.sequelize.sync({})
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

