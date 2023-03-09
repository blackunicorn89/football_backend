const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const PostgreSqlDb = require("../models");
const Player = PostgreSqlDb.Player;


// Lisää pelaajan pisteet (AUTH)
const deleteGoalPoints = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  //Muuttujat
  let currentGoalMakerPoints = 0;
  let goalMakerId = 0;
  let deleteGoalMakerPoints = 0;
  let goal_points = 0 

  //Otetaan vastaan taulukko, joka sisältää json-objektina pelaajan nimen, id:n ja pisteet. Taulukko on json-objektin sisällä. 
  const { goal_makers } = req.body
  try {

    //käydään lävitse taulukko ja vähennetään pelaajalta pisteet sen perusteella
    for (i = 0; i < goal_makers.length; i ++) {

      
      //Apumuuttuja, johon otetaan talteen pelaajan nykyiset pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      currentGoalMakerPoints = 0;
      
      //Muuttuja, johon otetaan talteen pelaajan id. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      goalMakerId = 0;

      //Muuttuja, johon otetaan talteen pelaajalta poistettavat pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      deleteGoalMakerPoints = 0;

      //Muuttuja, johon otetaan talteen nykyiset pisteet tietokannasta. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi. Muuttuja vastaa nimeltään
      //tietokannan sarakketta, jonka arvo päivitetään
      goal_points = 0 

      //Otetaan talteen pelaajan id
      goalMakerId = parseInt(goal_makers[i].id)

      //Otetaan talteen pisteet, jotka vähennetään pelaajata
      deleteGoalMakerPoints = parseInt(goal_makers[i].points)
     
      //Haetaan id:n avulla tietokannasta pelaajan tiedoilla sarake goal_points
      const goalMaker = await Player.findByPk(goalMakerId, {
        attributes: ["goal_points"]
      })

      //Otetaan  apumuuttujaan talteen nykyiset pisteet
      currentGoalMakerPoints = goalMaker.goal_points

      //Päivitetään pisteet vähentämällä nykyisistä pisteistä poistettavat pisteet
      goal_points = currentGoalMakerPoints - deleteGoalMakerPoints

      //Tarkistetaan, etteivät pisteet mene alle nollan. Jos menevät, asetetaan pisteet nollaksi
      if (goal_points < 0) {
        goal_points = 0
      }
      
      //Muodostetaan objekti, jolla päivitetään tiedot kantaan
      const deleteGoalPoints = {
        goal_points
      } 

      //Päivitetään kantaan pelaajalta vähennetyt pisteet
      Player.update(deleteGoalPoints, {where:{id: goalMakerId}})
    
    }
   
  } catch (err) {
    const error = new HttpError(
      "Adding points failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json("Pisteiden poisto onnistui");

};
exports.deleteGoalPoints = deleteGoalPoints;