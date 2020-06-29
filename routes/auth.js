const express = require('express');
const { check } = require('express-validator');

const authController = require('../controller/auth');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

router.post('/signup', [], authController.signup);
router.post('/login', [], authController.login);
router.put('/updateUser', [], authController.updateUser);
router.delete('/deleteUser', [], authController.deleteUser);

module.exports = router;