const express = require('express');
const newsModel = require("../models/news")
const router = express.Router();

router.get("/news/", function(req, res) {
    //let query = {"user:":req.session.user}
    newsModel.find(function(err, news) {
        if (err) {
            console.log("Failed to find items. Reason", err)
        }
        return res.status(200).json(news);
    })
});

router.post("/news/", function(req, res){
    if(!req.body) {
        return res.status(400).json({Message: "Ei bodya"})
    }
    if (!req.body.header) {
        return res.status(400).json({Message: "otsikko puuttuu"})
    }

    let news_article = new newsModel ({
        header: req.body.header,
        content: req.body.content,
        date: req.body.date
        
    })
    news_article.save(function(err){
        if(err) {
            console.log("Failed to create the article. Reason", err);
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(201).json({Message: "Success"})
    })
})

router.delete("/news/:id", function(req, res) {
    newsModel.deleteOne({"_id":req.params.id},
    function(err) {
        if (err) {
            console.log("Failed to remove news article. Reason", err)
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(200).json({message: "Success"})
    })
})

router.put("/news/:id", function(req, res) {
    if(!req.body) {
        return res.status(400).json({Message: "Bad request"})
    }
    if (!req.body.header) {
        return res.status(400).json({Message: "Bad request"})
    }
    let news_article =  ({
        header: req.body.header,
        content: req.body.content,
        date: req.body.date
        
    })
    newsModel.replaceOne({"_id":req.params.id}, news_article, function(err) {
        if (err) {
            console.log("Failed to update news article. Reason", err)
            return res.status(500).json({message: "Internal server error"})
        }
        return res.status(200).json({message: "Success"})
    })

    
})
module.exports = router;