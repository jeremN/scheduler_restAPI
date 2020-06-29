const Team = require('../models/teams');
const User = require('../models/user');

exports.createTeam = async (req, res, next) => {
	const { userId = '5ec84f99e62b85473c18d87a' } = req.body;
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
  const { userId = '5ec84f99e62b85473c18d87a' } = req.body;

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
  const { userId = '5ec84f99e62b85473c18d87a' } = req;
  const team = await Team.findById(teamId);

  try {
    if (!team) {
      const error = new Error('Could not find team.');
      error.statusCode = 404;
      throw error;
    }

    // TODO uncomment when auth & session is added
    /* if (planning.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this planning');
      error.statusCode = 403;
      throw error;
    } */

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
  const { userId = '5ec84f99e62b85473c18d87a' } = req.body;

  try {
    let team = await Team.findById(teamId);

    if (!team) {
      const error = new Error('Could not find team.');
      error.statusCode = 404;
      throw error;
    }

    // TODO uncomment when auth & session is added
    /* if (planning.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this planning');
      error.statusCode = 403;
      throw error;
    } */

    team = Object.assign(team, updatedTeam);
    const result = await team.save();
    res.status(200).json({
      message: 'Planning updated',
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
  const { userId = '5ec84f99e62b85473c18d87a' } = req;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
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