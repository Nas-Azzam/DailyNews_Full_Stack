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

const User = mongoose.model('User', userSchema);
module.exports = { User };
