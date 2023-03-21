const PostgreSqlDb = require("../models");
const Player = PostgreSqlDb.Player;


// Lisää pelaajan pisteet (AUTH)
const addGoalPoints = async (goalMakers) => { 

  //Muuttujat
  let currentGoalMakerPoints = 0;
  let goalMakerId = 0;
  let newGoalMakerPoints = 0;
  let goal_points = 0 
  
  //Otetaan vastaan taulukko, joka sisältää json-objektina pelaajan nimen, id:n ja pisteet.
  const goal_makers = goalMakers

  //käydään lävitse taulukko ja lisätään pelaajalle pisteet sen mukaisesti
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
    Player.update(addGoalPoints, {where:{id: goalMakerId}})
  
  }
  
}; 
exports.addGoalPoints = addGoalPoints;