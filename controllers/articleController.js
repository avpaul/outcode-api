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
const updateArticle = async (req, res, next) => {
  const { slug: oldSlug } = req.params;
  const { body: articleUpdate } = req;
  const slug = slugGenerator(articleUpdate.title);
  const readTime = calculateReadTime(articleUpdate.content);
  if (articleUpdate.status !== 'draft' && articleUpdate.status !== 'published') {
    Object.defineProperty(articleUpdate, 'status', { value: 'draft', enumerable: true });
  }
  Object.defineProperties(articleUpdate, {
    slug: { value: slug, enumerable: true },
    readTime: { value: readTime, enumerable: true },
    updatedAt: { value: new Date().toUTCString(), enumerable: true }
  });
  try {
    const articleUpdateQuery = await Article.findOneAndUpdate({ slug: oldSlug }, articleUpdate, {
      new: true
    });
    if (articleUpdateQuery === null) {
      const error = new Error('Article not found');
      error.status = 400;
      return next(error);
    }
    return res.status(200).json({ data: articleUpdateQuery });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} response the response objects
 */
const deleteArticle = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const deleteArticleQuery = await Article.findOneAndDelete({ slug });
    if (deleteArticleQuery === null) {
      const error = new Error('Article does not exist');
      error.status = 400;
      return next(error);
    }
    return res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next function to handle errors
 * @returns {Object} response the response objects
 */
const getArticle = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const articleQuery = await Article.findOne({ slug });
    if (articleQuery === null) {
      const error = new Error('Article not found');
      error.status = 404;
      return next(error);
    }
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
 * @returns {Object} response the response objects
 */
const getArticles = async (req, res, next) => {
  const { page = 0, limit = 7 } = req.query;

  try {
    const articleQuery = await Article.find(
      { status: 'published' },
      'slug title description featuredImage stickOnFront createdAt',
      {
        skip: page * Number(limit),
        sort: { updatedAt: -1 },
        limit: Number(limit)
      }
    );
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
 * @returns {Object} response the response objects
 */
const getPublished = async (req, res, next) => {
  const { page = 0, limit = 6 } = req.query;

  try {
    const articleQuery = await Article.find(
      { status: 'published' },
      'slug title description createdAt updatedAt',
      {
        skip: page * Number(limit),
        sort: { updatedAt: -1 },
        limit: Number(limit)
      }
    );
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
 * @returns {Object} response the response objects
 */
const getDrafts = async (req, res, next) => {
  const { page = 0, limit = 6 } = req.query;

  try {
    const articleQuery = await Article.find(
      { status: 'draft' },
      'slug title description createdAt updatedAt',
      {
        skip: page * Number(limit),
        sort: { updatedAt: -1 },
        limit: Number(limit)
      }
    );
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
  getArticlesByTag,
  getDrafts,
  getPublished
};
