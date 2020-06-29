const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  const userExist = await User.findOne({ email: email });
  if (!!userExist) {
    const error = new Error('A user with this email already exist');
    error.statusCode = 401;
    throw error;
  }

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

}

exports.updateUser = async (req, res, next) => {

}

exports.deleteUser = async (req, res, next) => {
  
}