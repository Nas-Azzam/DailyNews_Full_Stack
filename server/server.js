const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Routes
const userRoute = require('./routes/api/users');

// Middle wares
app.use(bodyParser.json());
app.use('/api/users', userRoute);

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}retryWrites=true&w=majority`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const port = process.env.PORT || 1001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
