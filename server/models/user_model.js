const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    firstname: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    lastname: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    age: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    //   timestamps:true
    //   collection: "player"
  }
);

// mdel for hashing password
userSchema.pre('save', async function (next) {
  let user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

// generating token or cookie
userSchema.methods.generateToken = function () {
  let user = this;
  const userObj = { _id: user._id.toHexString(), email: user.email };
  const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: '1d' });
  return token;
};

// model for comparing password with hash password for valid user
userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  const match = await bcrypt.compare(candidatePassword, user.password);
  return match;
};

// model for already register user by email
userSchema.statics.emailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
