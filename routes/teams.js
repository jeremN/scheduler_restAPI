const express = require('express')

const teamController = require('../controller/teams')
const isAuth = require('../middleware/is-authenticated')

const router = express.Router()

/** Get user teams list
 * @route GET /teams/teamsList
 */
router.get('/teamsList', isAuth, teamController.getTeams)

/** Get user specific team by ID
 * @route GET /teams/team/:teamId
 */
router.get('/team/:teamId', isAuth, teamController.getTeam)

/** Get teammate by ID
 * @route GET /teams/teammate/:teamId/:teammateId
 */
router.get('/teammate/:teamId/:teammateId', isAuth, teamController.getTeammate)

/** Update teammate by ID
 * @route PUT /teams/updateTeammate/:teamId/:teammateId
 */
router.put(
  '/updateTeammate/:teamId/:teammateId',
  isAuth,
  teamController.updateTeammate,
)

/** delete teammate by ID
 * @route DELETE /teams/deleteTeammate/:teamId/:teammateId
 */
router.delete(
  '/deleteTeammate/:teamId/:teammateId',
  isAuth,
  teamController.deleteTeammate,
)

/** Create new team
 * @route POST /teams/newTeam
 */
router.post('/newTeam', isAuth, teamController.createTeam)

/** Update team by ID
 * @route PUT /teams/updateTeam/:teamId
 */
router.put('/updateTeam/:teamId', isAuth, teamController.updateTeam)

/** Update multiple team
 * @route PUT /teams/updateTeams
 */
// router.put('/updateTeams', isAuth, teamController.updateTeams)

/** Delete team by ID
 * @route DELETE /teams/deleteTeam/:teamId
 */
router.delete('/deleteTeam/:teamId', isAuth, teamController.deleteTeam)

module.exports = router
