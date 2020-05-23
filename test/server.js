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
const planningsRoutes = require('../routes/plannings');
const settingsRoutes = null;

const app = express();

app.use(bodyParser.json());
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

module.exports = app;
