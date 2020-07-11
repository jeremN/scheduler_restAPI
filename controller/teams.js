const mongoose = require('mongoose');
const Team = require('../models/teams');
const User = require('../models/user');

exports.createTeam = async (req, res, next) => {
	const { userId } = req;
  const { newTeam } = req.body;

  const team = new Team({
    ...newTeam,
    creator: userId
  });

  try {
    await team.save();
    const user = await User.findById(userId);
    user.team.push(team);
    await user.save();

    res.status(201).json({
      message: 'New team created !',
      teamID: team._id,
      creator: { _id: user._id }
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getTeams = async (req, res, next) => {
  const { userId } = req;

  try {
    const userTeams = await User.findById(userId)
      .populate('team')
      .sort({ createdAt: 'asc' });

      res.status(200).json({
        teamsList: userTeams.team
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const { userId } = req;
  let team = null;

  if (mongoose.Types.ObjectId.isValid(teamId)) {
    team = await Team.findById(teamId);
  }

  try {
    if (!team) {
      const error = new Error('Could not find team.');
      error.statusCode = 404;
      throw error;
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this team');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      message: 'Team fetched.',
      team: team
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updateTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const { updatedTeam } = req.body;
  const { userId } = req;

  try {
    let team = await Team.findById(teamId);

    if (!team) {
      const error = new Error('Could not find team.');
      error.statusCode = 404;
      throw error;
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this team');
      error.statusCode = 403;
      throw error;
    }

    team = Object.assign(team, updatedTeam);
    const result = await team.save();
    res.status(200).json({
      message: 'Team updated',
      team: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    } 
    next(err);
  }
}

exports.deleteTeam = async (req, res, next) => {
  const { teamId } = req.params;
  const { userId } = req;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      const error = new Error('Could not find this team.');
      error.statusCode = 404;
      throw error;
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this team');
      error.statusCode = 403;
      throw error;
    }

    await Team.findByIdAndRemove(teamId);

    const user = await User.findById(userId);
    user.team.pull(teamId);
    await user.save();

    res.status(200).json({
      message: 'Team deleted !'
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}