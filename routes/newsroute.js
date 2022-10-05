const express = require('express');
const playerModel = require("../models/news")
const router = express.Router();

router.get("/news/", function(req, res) {
    //let query = {"user:":req.session.user}
    playerModel.find(function(err, players) {
        if (err) {
            console.log("Failed to find items. Reason", err)
        }
        return res.status(200).json(players);
    })
});

/*router.post("/players/", function(req, res){
    if(!req.body) {
        return res.status(400).json({Message: "Ei bodya"})
    }
    if (!req.body.player_name) {
        return res.status(400).json({Message: "Pelaajan nimi puuttu"})
    }
    let player = new playerModel ({
        player_name: req.body.player_name,
        position: req.body.position,
        player_number: req.body.player_number,
        description: req.body.description
        

    })
    player.save(function(err){
        if(err) {
            console.log("Failed to create player. Reason", err);
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(201).json({Message: "Success"})
    })
})

router.delete("/players/:id", function(req, res) {
    playerModel.deleteOne({"_id":req.params.id, "user": req.session.user},
    function(err) {
        if (err) {
            console.log("Failed to remove item. Reason", err)
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(200).json({message: "Success"})
    })
})

router.put("/players/:id", function(req, res) {
    if(!req.body) {
        return res.status(400).json({Message: "Bad request"})
    }
    if (!req.body.player_name) {
        return res.status(400).json({Message: "Bad request"})
    }
    let player = ({
        player_name: req.body.player_name,
        position: req.body.position,
        player_number: req.body.player_number,
        description: req.body.description
    })
    playerModel.replaceOne({"_id":req.params.id, "user": req.session.user},
    player, function(err) {
        if (err) {
            console.log("Failed to update item. Reason", err)
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(200).json({message: "Success"})
    })

    
}) */
module.exports = router;