const { User } = require('../models/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.checkToken = async (req, res, next) => {
  try {
    if (req.headers['x-access-token']) {
      // verify token
      const accessToken = req.headers['x-access-token'];
      const { _id, email } = jwt.verify(accessToken, process.env.DB_SECRET);
      console.log(_id, email);

      res.locals.userData = { _id, email };
      next();
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({ error: 'Bad token', errors: error });
  }
};

exports.checkLoggedIn = (req, res, next) => {
  const user = res.locals.userData;
  if (!user) return res.status(401).json({ error: 'No user.Please log in' });

  req.user = user;
  next();
};
