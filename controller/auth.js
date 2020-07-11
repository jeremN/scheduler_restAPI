const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const dotenv = require('dotenv');
const envs = dotenv.config();

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { 
    firstname, 
    email = null, 
    lastname = '', 
    password
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword
    });
    const result = await user.save();

    res.status(201).json({
      message: 'User created',
      userID: result._id
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
  const { email, password } = req.body;
  const jwtSignOptions = {
    algorithm: 'HS256',
    expiresIn: '1h'
  }
  let loadedUser;
  let _PRIVATE_KEY = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n') || await fs.readFileSync('./secret/jwtPrivateKey.key', 'utf8');

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    loadedUser = user;
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      }, 
      _PRIVATE_KEY,
      jwtSignOptions
    );

    res.status(200).json({
      message: 'You are authenticated',
      token: token,
      userID: loadedUser._id.toString()
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.forgotPassword = async (req, res, next) => {}
