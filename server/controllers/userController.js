import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const User = mongoose.model("User");

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @return {object} response
 */
const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    const error = new Error("email or password empty");
    error.status = 400;
    return next(error);
  }

  return User.findOne({ email }, null, {}, (error, user) => {
    if (error) return next(error);
    if (!user) {
      return res.status(400).json({ error: "email or password incorrect" });
    }
    if (user.validatePassword(password)) {
      const { SECRET } = process.env;
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        SECRET,
        {
          expiresIn: "30d",
          audience: "author"
        }
      );
      return res.status(200).json({ message: "Login successful", token });
    }
    return res.status(400).json({ error: "email or password incorrect" });
  });
};

export default login;
