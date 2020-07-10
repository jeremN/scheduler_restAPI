const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const userController = require('../controller/user');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/** Get user datas
  * @route PUT /user/updateUser
  */
router.get('/:userId', isAuth, userController.getUser);

/** Update user datas
  * @route PUT /user/updateUser
  */
router.put('/updateUser', isAuth, userController.updateUser);

/** Delete user
  * @route PUT /user/deleteUser
  */
router.delete('/deleteUser', isAuth, userController.deleteUser);

module.exports = router;