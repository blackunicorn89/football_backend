const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const Player = MySqlDb.Player;


// LISTAA KAIKKI KAUDEN PELIT

/*const getGames = async (req, res, next) => {

  let games;

  try {
    games = await MySqlGameModel.findAll({})
  } catch (err) {
    const error = new HttpError("Fetching games failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(games);
};*/

// HAE KAUDEN PELI ID:N AVULLA 

/*const getSeasonById = async (req, res, next) => {
  const seasonId = req.params.id;
  let season

  try {
    season = await season.findById(seasonId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find the season data", 500);
    return next(error);
  }

  if (!player) {
    const error = new HttpError("Could not find a player for the provided id.", 404);
    return next(error)
  }

  res.status(200).json({ player: player.toObject({ getters: true }) });

}*/

// LISÄÄ pelaajan pisteet (AUTH)

const addGoalPoints = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  
  const static_goal_makers = [{"name": "Testi pelaaja 1", "points": "3", "id": "1"}, {"name": "Testi pelaaja 2", "points": "1", "id": "2"}, {"name": "Testi pelaaja 3", "points": "5", "id": "3"} ] 
  
  const goal_makers = req.body
  //const points = goal_makers.goal_makers
  

  try {

    
    
    for (i = 0; i < goal_makers.goal_makers.length; i ++) {

      let currentGoalMakerPoints = 0;
      
      let goalMakerId = 0;
      let newGoalMakerPoints = 0;
      //Tietokannan sarakkeen arvo, jonka arvo tullaan päivittämään
      let goal_points = 0 
      let goalMaker;


      goalMakerId = parseInt(goal_makers.goal_makers[i].id)
      newGoalMakerPoints = parseInt(goal_makers.goal_makers[i].points)
      //console.log("Pelaajan id: " + points[i].id + " pelajaan nimi: "+ points[i].id + " pelaajan pisteet " + points[i].points)

      //console.log("pelkkä id: " + goalMakerId + " ja sen tyyppi: " + typeof goalMakerId)
      //console.log("pelkät pisteet: " + goalMakerPoints + " ja niiden tyyppi: " + typeof goalMakerPoints)
      
      goalMaker = await Player.findByPk(goalMakerId, {
        attributes: ["player_name", "id", "goal_points"]
      })



      currentGoalMakerPoints = goalMaker.goal_points
      console.log("Nykyiset pisteet ovat " + currentGoalMakerPoints)
      goal_points = currentGoalMakerPoints + newGoalMakerPoints
      console.log("nykyiset pisteet lisäyksen jälkeen: " + goal_points)
      
      const addGoalPoints = {
        goal_points
      } 

      Player.update(addGoalPoints, {where:{id: goalMakerId}})
    

    }
   
    
    //await MySqlGameModel.create(newGame);
  } catch (err) {
    const error = new HttpError(
      "Adding points failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json("onnstui");

};

exports.addGoalPoints = addGoalPoints;