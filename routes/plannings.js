const express = require('express');
const { check } = require('express-validator');

const planningsController = require('../controller/plannings');
const isAuth = require('../middleware/is-authenticated');

const router = express.Router();

/**
  * GET 
  * Get plannings list 
  * @route GET /plannings/planningsList
  **/
router.get('/planningsList', isAuth, planningsController.getPlannings);

/**
  * POST
  * Create new planning
  * @route POST /plannings/newPlanning
  **/
router.post('/newPlanning', isAuth, planningsController.createPlanning);


/**
  * GET
  * Get specific planning by ID
  * @route GET /plannings/planning/:planningId
  **/
router.get('/planning/:planningId', isAuth, planningsController.getPlanning);

/**
  * PUT
  * Update planning by ID
  * @route PUT /plannings/editPlanning/:planningId
  **/
router.put('/editPlanning/:planningId', isAuth, planningsController.updatePlanning);

/**
  * DELETE
  * Delete planning by ID
  * @route DELETE /plannings/deletePlanning/:planningId
  **/
router.delete('/deletePlanning/:planningId', isAuth, planningsController.deletePlanning);

module.exports = router;