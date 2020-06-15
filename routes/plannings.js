const express = require('express');
const { check } = require('express-validator');

const planningsController = require('../controller/plannings');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/** Get plannings list 
  * @route GET /plannings/planningsList
  */
router.get('/planningsList', isAuth, planningsController.getPlannings);

/** Create new planning
  * @route POST /plannings/newPlanning
  */
router.post('/newPlanning', isAuth, planningsController.createPlanning);

/** Duplicate planning by ID 
  * @route POST /plannings/duplicate
  */
router.post('/duplicate', isAuth, planningsController.duplicatePlanning);

/** Get specific planning by ID
  * @route GET /plannings/planning/:planningId
  */
router.get('/planning/:planningId', isAuth, planningsController.getPlanning);

/** Update planning by ID
  * @route PUT /plannings/editPlanning/:planningId
  */
router.put('/editPlanning/:planningId', isAuth, planningsController.updatePlanning);

/** Delete planning by ID
  * @route DELETE /plannings/deletePlanning/:planningId
  */
router.delete('/deletePlanning/:planningId', isAuth, planningsController.deletePlanning);

module.exports = router;