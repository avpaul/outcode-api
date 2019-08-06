import mongoose from 'mongoose';
import slugGenerator from '../helpers/slugGenerator';
import calculateReadTime from '../helpers/readTime';

// const User = mongoose.model('User');
const Article = mongoose.model('Article');
/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const createArticle = async (req, res, next) => {
  const { body: newArticle } = req;
  const slug = slugGenerator(newArticle.title);
  const readTime = calculateReadTime(newArticle.content);

  if (newArticle.status !== 'draft') {
    Object.defineProperty(newArticle, 'status', { value: 'draft', enumerable: true });
  }
  Object.defineProperties(newArticle, {
    slug: { value: slug, enumerable: true },
    readTime: { value: readTime, enumerable: true }
  });

  try {
    const createArticleQuery = await Article.create(newArticle);
    // TODO: remove -id and _v in the response
    return res.status(201).json({ data: createArticleQuery });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const updateArticle = (req, res, next) => {};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const deleteArticle = (req, res, next) => {};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const getArticle = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const articleQuery = await Article.findOne({ slug });
    return res.status(200).json({ data: articleQuery });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const getArticles = async (req, res, next) => {
  const { page = 0, limit = 6 } = req.query;
  try {
    const articleQuery = await Article.findOne({});
    return res.status(200).json({ data: articleQuery });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} res the response objects
 */
const getArticlesByTag = (req, res, next) => {};

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  getArticles,
  getArticlesByTag
};
