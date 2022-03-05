const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    roles: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 30,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // timestamp: true,
    // collection: 'usersasda',
  }
);

// model for hashing password
userSchema.pre('save', async function (next) {
  let user = this;
  if (user.isModified('password')) {
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});
// model for token
userSchema.methods.generateToken = function () {
  let user = this;
  const userObj = { _id: user._id.toHexString(), email: user.email };
  const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: '1d' });
  return token;
};


// model for emal is taken
userSchema.statics.emailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
