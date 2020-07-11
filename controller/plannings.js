const mongoose = require('mongoose');
const Plannings = require('../models/plannings');
const User = require('../models/user');

exports.getPlannings = async (req, res, next) => {
  const currentLimit = 10;
  const { userId } = req;

  try {
    const userPlannings = await User.findById(userId)
      .populate('plannings')
      .sort({ createdAt: 'asc' })
      .limit(currentLimit);
    const total = await Plannings.countDocuments({ creator: userId });

      res.status(200).json({
        total: total,
        planningsList: userPlannings.plannings
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getPlanning = async (req, res, next) => {
  const { planningId } = req.params;
  const { userId } = req;
  let planning = null;

  if (mongoose.Types.ObjectId.isValid(planningId)) {
    planning = await Plannings.findById(planningId);
  }

  try {
    if (!planning) {
      const error = new Error('Could not find planning.');
      error.statusCode = 404;
      throw error;
    }

    if (planning.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this planning');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      message: 'Planning fetched.',
      planning: planning
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.createPlanning = async (req, res, next) => {
  // TODO, must add validation (with express-validator)
  const { newPlanning } = req.body;
  const { userId } = req;

  const planning = new Plannings({
    ...newPlanning,
    creator: userId
  });

  try {
    await planning.save();
    const user = await User.findById(userId);
    user.plannings.push(planning);
    await user.save();

    res.status(201).json({
      message: 'New planning created !',
      planningID: planning._id,
      creator: { _id: user._id }
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.duplicatePlanning = async (req, res, next) => {
  const { planningID } = req.body;
  const planningToDuplicate = await Plannings.findById(planningID);
  const tempPlanning = Object.assign(planningToDuplicate, { _id: mongoose.Types.ObjectId(), isNew: true });
  const planning = new Plannings(tempPlanning);
  const { userId } = req;

  try {
    if (!planningToDuplicate) {
      const error = new Error('Could not find planning.');
      error.statusCode = 404;
      throw error;
    }

    await planning.save();
    const user = await User.findById(userId);
    user.plannings.push(planning);
    await user.save();

    res.status(200).json({
      message: 'Planning duplicated !',
      newID: planning._id
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    } 
    next(err);
  }

}

exports.updatePlanning = async (req, res, next) => {
  const { planningId } = req.params;
  const { updatedPlanning } = req.body;
  const { userId } = req;

  try {
    let planning = await Plannings.findById(planningId);

    if (!planning) {
      const error = new Error('Could not find planning.');
      error.statusCode = 404;
      throw error;
    }

    // TODO uncomment when auth & session is added
    /* if (planning.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this planning');
      error.statusCode = 403;
      throw error;
    } */

    planning = Object.assign(planning, updatedPlanning);
    const result = await planning.save();
    res.status(200).json({
      message: 'Planning updated',
      planning: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    } 
    next(err);
  }
}

exports.deletePlanning = async (req, res, next) => {
  const { planningId } = req.params;
  const { userId } = req;

  try {
    const planning = await Plannings.findById(planningId);

    if (!planning) {
      const error = new Error('Could not find planning.');
      error.statusCode = 404;
      throw error;
    }

    // TODO uncomment when auth & session is added
    /* if (planning.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this planning');
      error.statusCode = 403;
      throw error;
    } */

    await Plannings.findByIdAndRemove(planningId);

    const user = await User.findById(userId);
    user.plannings.pull(planningId);
    await user.save();

    res.status(200).json({
      message: 'Planning deleted !'
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
