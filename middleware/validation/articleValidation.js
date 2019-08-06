import Joi from '@hapi/joi';
// import mongoose from 'mongoose';

// const article = mongoose.model('Article');

/**
 *
 * @param {*} data
 * @param {Object} res
 * @param {*} schema
 * @param {*} next
 * @returns {*} response
 */
function validation(data, res, schema, next) {
  const { error } = Joi.validate(data, schema, { abortEarly: true });
  if (!error) return next(error);
  const errors = [];
  const { details } = error;
  details.forEach((errorDetails) => {
    errors.push(errorDetails.message.replace(/"/g, ''));
  });
  return res.status(400).json({ error });
}

const createOrUpdate = (req, res, next) => {
  const schema = {
    title: Joi.string()
      .trim()
      .min(20)
      .required(),
    author: Joi.string()
      .trim()
      .required(),
    stickOnFront: Joi.boolean(),
    tags: Joi.array(),
    featuredImage: Joi.string().uri(),
    description: Joi.string()
      .trim()
      .min(50)
      .required(),
    status: Joi.string()
      .trim()
      .required(),
    content: Joi.string()
      .trim()
      .min(500)
      .required()
  };
  validation(req.body, res, schema, next);
};

const slug = (req, res, next) => {
  const schema = {
    slug: Joi.string().required()
  };
  const { slug: articleID } = req.params;
  validation({ slug: articleID }, res, schema, next);
};

export default {
  createOrUpdate,
  slug
};
