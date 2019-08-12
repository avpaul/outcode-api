import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {*} response
 */
function authenticate(req, res, next) {
  const { SECRET } = process.env;
  const { headers } = req;
  const Authorization = headers.Authorization || headers.authorization;
  if (!Authorization) {
    const error = new Error('No Authorization header found');
    error.status = 401;
    return next(error);
  }
  const token = Authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET, {});
    Object.defineProperty(req, 'user', { value: decoded, enumerable: true });
    return next();
  } catch (err) {
    const error = new Error('You need to login to access this😭');
    error.status = 401;
    return next(error);
  }
}

export default authenticate;
