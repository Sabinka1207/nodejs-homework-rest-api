/* eslint-disable new-cap */
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw new createError(401, "Not authorized");
    }
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    //  проблема тут, состоит в том, что мы находим юзера в базе, и он есть.
    // Однако токен его логина нигде не хранится и при сравнении конечно
    // его не находим - из - за этого и ошибка

    if (!user || !user.token) {
      throw new createError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = "Not authorized";
    }
    next(error);
  }
};

module.exports = { authenticate };
