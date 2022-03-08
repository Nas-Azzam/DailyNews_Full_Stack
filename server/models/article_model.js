const mongooose = require('mongoose');
require('dotenv').config();

const articleSchema = mongooose.Schema({
  title: {
    type: String,
    required: [true, 'You need the title'],
    maxLength: 70,
  },
  content: {
    type: String,
    required: [true, 'You need the content'],
  },
  excerpt: {
    type: String,
    required: [true, 'You need the excerpt'],
    maxLength: 200,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  director: {
    type: String,
    required: [true, 'You need the director'],
  },
  actors: {
    type: [String],
    required: [true, 'You need the actors'],
    validate: {
      validator: function (v) {
        return v.length >= 2;
      },
      message: 'You need at least 2 actors',
    },
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft',
    required: [true, 'You need the status'],
    index: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongooose.model('Article', articleSchema);
module.exports = { Article };
