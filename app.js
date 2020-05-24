const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const envs = dotenv.config();

if (envs.error) {
  throw envs.error;
}

// ROUTES
const homeRoutes = null;
const teamRoutes = null;
const planningsRoutes = require('./routes/plannings');
const settingsRoutes = null;

const app = express();

// MONGO DB URI
// const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fdsvx.mongodb.net/${process.env.DB_DEV_NAME}`;
const MONGODB_URI = process.env.DB_DEV_URL;
const CONNECT_CFG = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

app.use(bodyParser.json());

// APP USE
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors());

app.use('/plannings', planningsRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  
  res.status(status).json({
    message: message,
    data: data
  });
});

// MONGODB CONNECT
mongoose.connect(MONGODB_URI, CONNECT_CFG) 
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.error(err));

module.exports = app;
