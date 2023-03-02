const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const PostgreSqlDb = require("../models");
const Player = PostgreSqlDb.Player;


// Lisää pelaajan pisteet (AUTH)
const addGoalPoints = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  //Muuttujat
  let currentGoalMakerPoints = 0;
  let goalMakerId = 0;
  let newGoalMakerPoints = 0;
  let goal_points = 0 

  //Otetaan vastaan taulukko, joka sisältää json-objektina pelaajan nimen, id:n ja pisteet. Taulukko on json-objektin sisällä. Tauluun viitataan muodossa goal_makers.goal_makers 
  const {goal_makers} = req.body
  try {

    //käydään lävitse taulukko ja lisätään pelaajalle pisteet
    for (i = 0; i < goal_makers.length; i ++) {

      
      //Muuttuja, johon otetaan talteen pelaajan nykyiset pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      currentGoalMakerPoints = 0;
      
      //Muuttuja, johon otetaan talteen pelaajan id. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      goalMakerId = 0;

      //Muuttuja, johon otetaan talteen pelaajalle lisättävät pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      newGoalMakerPoints = 0;

      //Muuttuja, johon otetaan talteen nykyiset pisteet tietokannasta. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi. Muuttuja vastaa nimeltään
      //tietokannan sarakketta, jonka arvo päivitetään
      goal_points = 0 

      //Otetaan talteen pelaajan id
      goalMakerId = parseInt(goal_makers[i].id)

      //Otetaan talteen pisteet, jotka lisätään pelaajalle
      newGoalMakerPoints = parseInt(goal_makers[i].points)
     
      //Haetaan id:n avulla tietokannasta pelaajan tiedoilla sarake goal_points
      const goalMaker = await Player.findByPk(goalMakerId, {
        attributes: ["goal_points"]
      })

      //Otetaan talteen nykyiset pisteet
      currentGoalMakerPoints = goalMaker.goal_points

      //Päivitetään pisteet lisäämällä nykyisiin pisteisiin uudet pisteet
      goal_points = currentGoalMakerPoints + newGoalMakerPoints
      
      //Muodostetaan objekti, jolla päivitetään tiedot kantaan
      const addGoalPoints = {
        goal_points
      } 

      //Päivitetään kantaan pelaajan uudet pisteet
      Player.update(addGoalPoints, {where:{id: goalMakerId}})
    
    }
   
  } catch (err) {
    const error = new HttpError(
      "Adding points failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json("Pisteiden lisäys onnistui");

};
exports.addGoalPoints = addGoalPoints;