const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const News = require("../models/news");


// LISTAA KAIKKI ARTIKKELIT

const getNews = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Cannot get news. Please contact to administrator", 422)
    );
  };

  let newsArticles;
  try {
    newsArticles = await News.find({})
  } catch (err) {
    const error = new HttpError("Failed to find articles. Reason",
      500
    );
    return next(error);
  }

  res.json({ newsArticles: newsArticles.map(article => article.toObject({ getters: true })) });
};

// LISÄÄ UUSI ARTIKKELI

const addNewsArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { header, content, date } = req.body

  const createdNewsArticle = new News({
    header,
    content,
    date,
  });

  try {
    await createdNewsArticle.save();
  } catch (err) {
    const error = new HttpError("Creating news article failed, please try again", 500)
    return next(error);
  };

  res.status(201).json({ Message: "Succesfully created" });
};

// MUOKKAA ARTIKKELIA

const editNewsArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { header, content, date } = req.body;
  const newsId = req.params.id;

  let news;
  try {
    news = await News.findById(newsId);
  } catch (err) {
    const error = new HttpError("Editing news article failed, please try again", 500);
    return next(error);
  };

  news.header = header;
  news.content = content;
  news.date = date;

  try {
    await news.save();
  } catch (err) {
    const error = new HttpError("Editing news article failed, please try again", 500);
    return next(error);
  };

  res.status(200).json({ news: news.toObject({ getters: true }) });

};

// POISTA ARTIKKELI

const removeNewsArticle = async (req, res, next) => {
  const newsId = req.params.id;
  let newsArticle;

  try {
    newsArticle = News.findById(newsId)
  } catch (err) {
    const error = new HttpError("Removing article failed, please try again", 500);
    return next(error);
  };

  try {
    await newsArticle.deleteOne();
  } catch (err) {
    const error = new HttpError("Removing article failed, please try again", 500)
    return next(error);
  };

  res.status(201).json({ Message: "Succesfully Removed" });
};

exports.getNews = getNews;
exports.addNewsArticle = addNewsArticle;
exports.editNewsArticle = editNewsArticle;
exports.removeNewsArticle = removeNewsArticle;
