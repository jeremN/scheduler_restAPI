const express = require('express');

const userController = require('../controller/user');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/** Get user datas
  * @route GET /user/:userId
  */
router.get('/:userId', isAuth, userController.getUser);

/** Update user datas
  * @route PUT /user/updateUser
  */
router.put('/updateUser', isAuth, userController.updateUser);

/** Delete user
  * @route DELETE /user/deleteUser
  */
router.delete('/deleteUser', isAuth, userController.deleteUser);

module.exports = router;