const express = require('express');
const { check } = require('express-validator');

const teamController = require('../controller/teams');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/** Get user teams list 
* @route GET /team/teamsList
*/
router.get('/teamsList', isAuth, teamController.getTeams);

/** Get user specific team by ID
 * @route GET /teams/team/:teamId
 */
router.get('/team/:teamId', isAuth, teamController.getTeam);

/** Create new team 
* @route GET /teams/newTeam
*/
router.post('/newTeam', isAuth, teamController.createTeam);

/** Update team by ID
 * @route GET /teams/updateTeam/:teamId
 */
router.put('/updateTeam/:teamId', isAuth, teamController.updateTeam);

/** Delete team by ID 
* @route GET /teams/deleteTeam/:teamId
*/
 router.delete('/deleteTeam/:teamId', isAuth, teamController.deleteTeam);

 module.exports = router;