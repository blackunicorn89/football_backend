const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const PostgreSqlDb = require("../models");
const Player = PostgreSqlDb.Player;


//Muokkaa pelaajan pisteet (AUTH). 
const editGoalPoints = async (req, res, next) => {
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
  let newGoalMakerPoints = 0; 

  //Otetaan vastaan taulukot, jotka sisältävät vanhat pisteet(old_goal_makers) ja muuttuneet pisteet(new_goal_makers). Taulukot sisävältävät
  //json-objektina pelaajan nimen, id:n ja pisteet. 
  const {old_goal_makers, new_goal_makers} = req.body
 
  try {

    //käydään lävitse taulukko old_goal_makers, joka sisältää vanhat pistetiedot
    for (i = 0; i < old_goal_makers.length; i ++) {

      
      //Apumuuttuja, johon otetaan talteen pelaajan pisteet tietokannasta. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      currentGoalMakerPoints = 0;
      
      //Muuttuja, johon otetaan talteen pelaajan id. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      goalMakerId = 0;

      //Muuttuja, johon otetaan talteen pelaajalta poistettavat pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      deleteGoalMakerPoints = 0;

      //Muuttuja, johon otetaan talteen päivitettävät pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi. Muuttuja vastaa nimeltään
      //tietokannan sarakketta, jonka arvo päivitetään
      goal_points = 0 

      //Otetaan talteen pelaajan id
      goalMakerId = parseInt(old_goal_makers[i].id)

      //Otetaan talteen pisteet, jotka vähennetään pelaajata
      deleteGoalMakerPoints = parseInt(old_goal_makers[i].points)
     
      //Haetaan id:n avulla tietokannasta pelaajan tiedoilla sarake goal_points, joka sisältää pelaajan nykyiset pisteet
      const goalMaker = await Player.findByPk(goalMakerId, {
        attributes: ["goal_points"]
      })

      //Otetaan apumuuttujaan talteen pisteet
      currentGoalMakerPoints = goalMaker.goal_points

      //Päivitetään pisteet vähentämällä nykyisistä pisteistä poistettavat pisteet
      goal_points = currentGoalMakerPoints - deleteGoalMakerPoints
      
      //Muodostetaan objekti, jolla päivitetään tiedot kantaan
      const deleteGoalPoints = {
        goal_points
      } 

      //Päivitetään kantaan pelaajalta vähennetyt pisteet
      Player.update(deleteGoalPoints, {where:{id: goalMakerId}})
    }

    //käydään lävitse taulukko ja lisätään pelaajalle pisteet muuttuneiden tietojen perusteella
    for (i = 0; i < new_goal_makers.length; i ++) {

      
      //Apumuuttuja, johon otetaan talteen pelaajan nykyiset pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      currentGoalMakerPoints = 0;
      
      //Muuttuja, johon otetaan talteen pelaajan id. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      goalMakerId = 0;

      //Muuttuja, johon otetaan talteen pelaajalle lisättävät pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
      newGoalMakerPoints = 0;

      //Muuttuja, johon otetaan talteen päivitettävät pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi. Muuttuja vastaa nimeltään
      //tietokannan sarakketta, jonka arvo päivitetään
      goal_points = 0 

      //Otetaan talteen pelaajan id
      goalMakerId = parseInt(new_goal_makers[i].id)

      //Otetaan talteen pisteet, jotka lisätään pelaajalle
      newGoalMakerPoints = parseInt(new_goal_makers[i].points)
      //console.log("Pelaajan id: " + points[i].id + " pelajaan nimi: "+ points[i].id + " pelaajan pisteet " + points[i].points)

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
      "Editing player's goal points failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json("Editing player's goal points succeeded");

};
exports.editGoalPoints = editGoalPoints;