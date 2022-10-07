const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const news = require("../models/news");

const getNews = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Cannot get news. Please contact to administrator", 422)
      );
    }
    
    let newsArticles;

    try {
       newsArticles  = await news.find({})
    
      } catch (err) {
        const error = new HttpError("Failed to find articles. Reason",
          500
        );
        return next(error);
        
      }
      res.json({ newsArticles: newsArticles.map(article => article.toObject({ getters: true })) });
     }

let addNewsArticle = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { header, content, date } = req.body

  const createdNewsArticle = new news({
    header,
    content,
    date,
  });

  try {
    await createdNewsArticle.save();
  } catch (err) {
    const error = new HttpError("Creating news article failed, please try again", 500)
    return next(error);
  }

  res.status(201).json({Message: "Succesfully created" });  
    

}

let removeNewsArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid id passed, please check your data", 422)
    );
  }
  const {id}= req.params.id

  try {
    await news.deleteOne({id});
  } catch (err) {
    const error = new HttpError("Removing article failed, please try again", 500)
    return next(error);
  }

  res.status(201).json({Message: "Succesfully Removed" });  
}

let editNewsArticle = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { header, content, date } = req.body
  const {id}= req.params.id

  const EditedNewsArticle = ({
    header,
    content,
    date
  });

  try {
    await news.replaceOne({id}, EditedNewsArticle);
  } catch (err) {
    const error = new HttpError("Editing news article failed, please try again", 500)
    return next(error);
  }

  res.status(200).json({Message: "Succesfully edited" });  
    

}



/*router.put("/news/:id", function(req, res) {
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

  
})*/





exports.getNews = getNews;
exports.addNewsArticle = addNewsArticle;
exports.removeNewsArticle = removeNewsArticle;
exports.editNewsArticle = editNewsArticle;