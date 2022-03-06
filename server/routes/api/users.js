const express = require('express');
let router = express.Router();
require('dotenv').config();

const { User } = require('../../models/user_model');

router.route('/register').post(async (req, res) => {
  try {
    // 1 chenk if email is taken
    if (await User.emailTaken(req.body.email)) {
      return res.status(400).json({
        error: 'Email is already taken',
      });
    }
    //  2 crate the model and hash the password
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    //  3 save the data to the database and generate token
    const savedUser = await user.save();
    const Token = savedUser.generateToken();

    // 4 send the response with token and cookies
    res.cookie('x-access-token', Token);
    res.send(getUserProps(savedUser));
  } catch (error) {
    res.status(400).send({ error: error, message: error.message });
  }
});

router.route('/Signin').post(async (req, res) => {
  try {
    //  Finf user
    let user = await User.findOne({ email: req.body.email });

    // compare Pawsword

    // generate token

    // send response
  } catch (error) {}
});

const getUserProps = (savedUser) => {
  return {
    _id: savedUser._id,
    email: savedUser.email,
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    phone: savedUser.phone,
    roles: savedUser.roles,
  };
};

module.exports = router;
