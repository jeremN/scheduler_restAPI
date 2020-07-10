const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const currentUser = {
      email: user.email,
      firstname: user.firstname,
      lastname: '',
      team: [],
      plannings: []
    }

    res.status(200).json({
      message: 'User fetched.',
      user: currentUser
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.updateUser = async (req, res, next) => {
  const { updatedUser } = req.body;

  try {
    let user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user = Object.assign(user, updatedUser);
    await user.save();
    
    res.status(200).json({
      message: 'User updated'
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.deleteUser = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.findOne(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    await User.findByIdAndRemove(userId);

    res.status(200).json({
      message: 'User deleted'
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}