const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// ROUTES
const planningsRoutes = require('../routes/plannings');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const teamRoutes = require('../routes/teams');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/plannings', planningsRoutes);
app.use('/teams', teamRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

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
