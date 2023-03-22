const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const PostgreSqlDb = require("../models");
const Player = PostgreSqlDb.Player;



// LISTAA KAIKKI PELAAJAT

const getPlayers = async (req, res, next) => { 

  let players;

  try {
    players = await Player.findAll({order: [
      ["player_name"]
    ]})
  } catch (err) {
    const error = new HttpError("Fetching players failed, please try again later.",
      500
    );
    return next(error)
  }
  res.json(players);
};

// HAE PALAAJA ID:N AVULLA. Tarvitaanko? Jos, niin mihin?

/*const getPlayerById = async (req, res, next) => {
  const playerId = req.params.id;
  let player

  try {
    player = await Player.findById(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a player", 500);
    return next(error);
  }

  if (!player) {
    const error = new HttpError("Could not find a player for the provided id.", 404);
    return next(error)
  }

  res.status(200).json({ player: player.toObject({ getters: true }) });

}*/

// LISÄÄ PELAAJA (AUTH)

const addPlayer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, plase check your data", 422)
    );
  }

  const { player_name, player_number, position, description } = req.body

  let existingPlayer;
  let existingPlayerNumber =  parseInt(player_number)
  try {
    existingPlayer = await Player.findAll({attributes: ['player_number']}, {where : { player_number: existingPlayerNumber }})
  } catch (err) {
    const error = new HttpError(
      "Adding player failed, please try again later",
      500
    );
    return next(error);
  }

  //Tarkistetaanko löytyyko palautetusta objektitaulukosta pelaajanumero. Jos löytyy palautetaan false, jos ei löydy palautetaan false 
  const isFound = existingPlayer.some(element => {
    if (element.player_number === existingPlayerNumber) {
       
      return true;
    }

      return false;

  });

  //Jos pelaajanumero on olemassa, annetaan virhe eikä jatketa eteenpäin pelaajan tallennukseen.
  if (isFound) {
    const error = new HttpError(
      "Player with number " + player_number + " Already exists, try another player number.",
      422
    );
    return next(error);
  }

  let imagePath;

  if (!req.file) {
    imagePath = ""
  }
  else {
    imagePath = req.file.path
  }
   
  const createdPlayer = {
    image: imagePath,
    player_name,
    player_number,
    position,
    description
  };

  try {
    await Player.create(createdPlayer);
    console.log("toimii")
  } catch (err) {
    const error = new HttpError(
      "Adding new player failed, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json(createdPlayer);

};

// MUOKKAA PELAAJAA (AUTH) *Kuvan vaihtaminen tarkistamatta!!!

const editPlayer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return next(
      new HttpError("Invalid inputs passed, check your data.", 422)
    );
  }

  const { player_name, player_number, position, description } = req.body
  const playerId = req.params.id
  let playerImagePath;
  let player;

  try {
    player = await Player.findByPk(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong. could not update the player information", 500
    );
    return next(error);
  }

  if (!req.file) {
    playerImagePath = player.image
  }
  else {
    playerImagePath = req.file.path
    fs.unlink(player.image, (err) => {
      console.log(err)
    });
  }

  const editedPlayer = {
  playerImagePath,
  player_name,
  player_number,
  position,
  description
  }

  try {
    await Player.update(editedPlayer, {where: {id: playerId}})
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update player", 500);
    return next(error);
  };

  res.status(200).json(editedPlayer);

}

// POISTA PELAAJA (AUTH)

const deletePlayer = async (req, res, next) => {
  const playerId = req.params.id;
  let player;

  try {
    player = await Player.findByPk(playerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete player", 500)
    return next(error)
  }

  if (!player) {
    const error = new HttpError("Could not find player for this Id", 404);
    return next(error);
  }

  try {
    await Player.destroy({where: {id: playerId}});
  } catch (err) {
    const error = new HttpError("Removing player failed, please try again", 500)
    return next(error);
  }

  fs.unlink(player.image, err => {
    console.log(err)
  });

  res.status(201).json({ Message: "Player succesfully Removed" });
};


// Lisää pelaajan pisteet
const addGoalPoints = async (goalMakers) => { 

  //Muuttujat
  let currentGoalMakerPoints = 0;
  let goalMakerId = 0;
  let newGoalMakerPoints = 0;
  let goal_points = 0 
  
  //Otetaan vastaan taulukko, joka sisältää json-objektina pelaajan nimen, id:n ja pisteet.
  const goal_makers = goalMakers

  //käydään lävitse taulukko ja lisätään pelaajalle pisteet sen mukaisesti
  try {
    for (i = 0; i < goal_makers.length; i ++) {
  
      //Apumuuttuja, johon otetaan talteen pelaajan nykyiset pisteet. Alustetaan jokaisen loopin alussa nollaksi virheiden välttämiseksi
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
      await Player.update(addGoalPoints, {where:{id: goalMakerId}})
    }
  } catch {
    const error = new HttpError(
      "Adding points failed, try again later",
      500
    );
    return next(error);
  }
}

//Muokkaa pelaajan pisteet. 
const editGoalPoints = async (currentGoalMakers, newGoalMakers) => {

  //Muuttujat
  let currentGoalMakerPoints = 0;
  let goalMakerId = 0;
  let deleteGoalMakerPoints = 0;
  let goal_points = 0
  let newGoalMakerPoints = 0; 

  //Otetaan vastaan taulukot, jotka sisältävät vanhat pisteet(current_goal_makers) ja muuttuneet pisteet(new_goal_makers). Taulukot sisävältävät
  //json-objektina pelaajan nimen, id:n ja pisteet. 
  const current_goal_makers = currentGoalMakers;
  const new_goal_makers = newGoalMakers
 

  //käydään lävitse taulukko current_goal_makers, joka sisältää vanhat pistetiedot
  try {
    
    for (i = 0; i < current_goal_makers.length; i ++) {

      
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
      goalMakerId = parseInt(current_goal_makers[i].id)

      //Otetaan talteen pisteet, jotka vähennetään pelaajata
      deleteGoalMakerPoints = parseInt(current_goal_makers[i].points)
      
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
      await Player.update(deleteGoalPoints, {where:{id: goalMakerId}})
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
      await Player.update(addGoalPoints, {where:{id: goalMakerId}})
    
    }
}
catch {
  const error = new HttpError(
    "Editing player's goal points failed, try again later",
    500
  );
  return next (error)
}

};

exports.getPlayers = getPlayers;
//exports.getPlayerById = getPlayerById;
exports.addPlayer = addPlayer;
exports.editPlayer = editPlayer;
exports.deletePlayer = deletePlayer;
exports.addGoalPoints = addGoalPoints
exports.editGoalPoints = editGoalPoints;