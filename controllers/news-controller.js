const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const MySqlDb = require("../models");
const News = MySqlDb.News;
//const Op = MySqlDb.Sequelize.Op;


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
    newsArticles = await News.findAll({})
  } catch (err) {
    const error = new HttpError("Failed to find articles. Reason",
      500
    );
    return next(error);
  }

  res.json(newsArticles);
};

// HAE ARTIKKELIA ID:N AVULLA

const findArtcibleById = async (req, res, next) => {
  const articleId = req.params.id;
  let article;
  try {
    article = await News.findByPk(articleId)
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find article", 500);
    return next(error);
  }

  if (!article) {
    const error = new HttpError("Could not find a article for the provided id.", 404);
    return next(error)
  }

  res.status(200).json(article);

};

// LISÄÄ UUSI ARTIKKELI (AUTH)

const addNewsArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { header, content, published } = req.body

  const NewsArticle = {
    header,
    content,
    published,
  };

  try {
    await News.create(NewsArticle)
  } catch (err) {
    const error = new HttpError("Creating news article failed, please try again", 500)
    return next(error);
  };

  res.status(201).json({ Message: "Succesfully created" });
};

// MUOKKAA ARTIKKELIA (AUTH)

const editNewsArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { header, content, published } = req.body;
  const newsId = req.params.id;


  const EditedNewsArticle = {
    header,
    content,
    published,
  };

  try {
    await News.update(EditedNewsArticle, {where: {id: newsId}});
  } catch (err) {
    const error = new HttpError("Editing news article failed, please try again", 500);
    return next(error);
  };

  res.status(200).json(EditedNewsArticle);

};

// POISTA ARTIKKELI (AUTH)

const removeNewsArticle = async (req, res, next) => {
  const newsId = req.params.id;

  try {
    News.destroy({where: {id: newsId}})
  } catch (err) {
    const error = new HttpError("Removing article failed, please try again", 500);
    return next(error);
  };

  res.status(201).json({ Message: "Succesfully Removed" });
};

exports.getNews = getNews;
exports.findArtcibleById = findArtcibleById;
exports.addNewsArticle = addNewsArticle;
exports.editNewsArticle = editNewsArticle;
exports.removeNewsArticle = removeNewsArticle;
