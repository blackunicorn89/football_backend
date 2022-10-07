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

exports.getNews = getNews;
exports.addNewsArticle = addNewsArticle;