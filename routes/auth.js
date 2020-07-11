const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controller/auth');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/** Create user
  * @route POST /auth/signup
  */
router.post('/signup', [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then((user) => {
          if (user) {
            return Promise.reject('Email address already exists')
          }
        });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('firstname')
    .trim()
    .notEmpty()
], authController.signup);

/** User authentication
  * @route POST /auth/login
  */
router.post('/login', [
  body('email')
  .notEmpty()
  .withMessage('Email field should not be empty')
  .isEmail()
  .withMessage('Please enter a valid email.')
  .custom((value, { req }) => {
    return User.findOne({ email: value })
      .then((user) => {
        if (!user) {
          return Promise.reject('Email address doesn\' exist');
        }
      });
  })
  .normalizeEmail(),
body('password')
  .trim()
  .isLength({ min: 8 })
], authController.login);

module.exports = router;