const mongoose = require('mongoose')
const Team = require('../models/teams')
const User = require('../models/user')

exports.createTeam = async (req, res, next) => {
  const {userId} = req
  const {newTeam} = req.body

  const team = new Team({
    ...newTeam,
    creator: userId,
  })

  try {
    await team.save()
    const user = await User.findById(userId)
    user.team.push(team)
    await user.save()

    const userTeams = await User.findById(userId)
      .populate('team')
      .sort({createdAt: 'asc'})

    res.status(201).json({
      message: 'New team created !',
      newTeamID: team._id,
      teamsList: userTeams.team,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getTeams = async (req, res, next) => {
  const {userId} = req

  try {
    const userTeams = await User.findById(userId)
      .populate('team')
      .sort({createdAt: 'asc'})

    res.status(200).json({
      teamsList: userTeams.team,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getTeam = async (req, res, next) => {
  const {teamId} = req.params
  const {userId} = req

  try {
    let team = null

    if (mongoose.Types.ObjectId.isValid(teamId)) {
      team = await Team.findById(teamId)
    } else {
      const error = new Error('Please provide a valid teamId')
      error.statusCode = 404
      throw error
    }

    if (!team) {
      const error = new Error('Could not find team.')
      error.statusCode = 404
      throw error
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to view this team')
      error.statusCode = 403
      throw error
    }

    res.status(200).json({
      message: 'Team fetched.',
      team,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updateTeam = async (req, res, next) => {
  const {teamId} = req.params
  const {updatedTeam} = req.body
  const {userId} = req

  try {
    let team = await Team.findById(teamId)

    if (!team) {
      const error = new Error('Could not find team.')
      error.statusCode = 404
      throw error
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this team')
      error.statusCode = 403
      throw error
    }

    team = Object.assign(team, updatedTeam)
    const result = await team.save()
    res.status(200).json({
      message: 'Team updated',
      team: result,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getTeammate = async (req, res, next) => {
  const {teamId, teammateId} = req.params
  const {userId} = req

  if (!userId) {
    const error = new Error('You are not authorized to view this teammate')
    error.statusCode = 403
    throw error
  }

  const [teammate, team] = await Promise.all([
    Team.aggregate([
      {$match: {'members._id': {$in: [mongoose.Types.ObjectId(teammateId)]}}},
      {$unwind: '$members'},
      {$match: {'members._id': {$in: [mongoose.Types.ObjectId(teammateId)]}}},
      {
        $project: {
          firstname: '$members.firstname',
          lastname: '$members.lastname',
          email: '$members.email',
          poste: '$members.poste',
          hours: '$members.hours',
          contract: '$members.contract',
          notes: '$members.notes',
        },
      },
    ]),
    Team.findById(teamId),
  ])

  try {
    if (!teammate) {
      const error = new Error('Could not find teammate.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({
      teammate,
      teamName: team.name,
      location: team.location,
      message: 'Teammate fetched.',
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updateTeammate = async (req, res, next) => {
  const {teamId, teammateId} = req.params
  const {updatedTeammate} = req.body
  const {userId} = req

  if (!userId) {
    const error = new Error('You are not authorized to view this teammate')
    error.statusCode = 403
    throw error
  }

  const setDatas = () => {
    if (!!updatedTeammate.notes && updatedTeammate.notes.length) {
      return {
        'members.$.notes': updatedTeammate.notes,
      }
    }
    return {
      'members.$.firstname': updatedTeammate.firstname,
      'members.$.lastname': updatedTeammate.lastname,
      'members.$.contract': updatedTeammate.contract,
      'members.$.hours': updatedTeammate.hours,
      'members.$.poste': updatedTeammate.poste,
      'members.$.email': updatedTeammate.email,
    }
  }

  try {
    const team = await Team.findOneAndUpdate(
      {
        _id: teamId,
        'members._id': teammateId,
      },
      {
        $set: setDatas(),
      },
      {new: true},
      err => {
        if (err) {
          const error = err
          throw error
        }
      },
    )

    if (!team) {
      const error = new Error('Could not find teammate.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({
      message: 'Teammate profil updated !',
      updated: true,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteTeammate = async (req, res, next) => {
  const {teamId, teammateId} = req.params
  const {userId} = req

  if (!userId) {
    const error = new Error('You are not authorized to view this teammate')
    error.statusCode = 403
    throw error
  }

  try {
    const team = await Team.findOneAndUpdate(
      {
        _id: teamId,
      },
      {
        $pull: {members: {_id: teammateId}},
      },
      {new: true},
      err => {
        if (err) {
          const error = err
          throw error
        }
      },
    )

    if (!team) {
      const error = new Error('Could not find teammate.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({
      message: 'Teammate deleted !',
      deleted: true,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

/* exports.updateTeams = async (req, res, next) => {
  const {updatedTeams} = req.body
  const {userId} = req

  const teamsFilteredByName = await updatedTeams.reduce((item, nextItem) => {
    const {
      firstname,
      lastname,
      contract,
      hours,
      poste,
      email,
      teamID,
    } = nextItem
    const _id = teamID
    const updatedItem = item

    if (!updatedItem[`${_id}`]) updatedItem[`${_id}`] = []

    updatedItem[`${_id}`].push({
      firstname,
      lastname,
      contract,
      hours,
      poste,
      email,
    })

    return updatedItem
  }, {})

  try {
    const errors = []
    const results = []

    Object.keys(teamsFilteredByName).forEach(async (teamId) => {
      let team = await Team.findById(teamId)

      if (!team) {
        const error = new Error('Could not find team.')
        error.statusCode = 404
        errors.push(error)
        return
      }

      if (team.creator._id.toString() !== userId) {
        const error = new Error(
          `You are not authorized to edit this team ${team.name}`
        )
        error.statusCode = 403
        errors.push(error)
        return
      }

      const updatedTeam = {
        ...team,
        members: [...team.members, ...teamsFilteredByName[`${teamId}`]],
      }

      team = Object.assign(team, updatedTeam)
      const result = await team.save()
      await results.push(result)
      console.debug('insidetry, result', result, results)
    })

    if (errors.length === teamsFilteredByName.length) {
      throw errors
    }

    console.debug('after map in try', results, errors)
    res.status(200).json({
      message: 'Team updated',
      team: results,
      errors,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
} */

exports.deleteTeam = async (req, res, next) => {
  const {teamId} = req.params
  const {userId} = req

  try {
    const team = await Team.findById(teamId)

    if (!team) {
      const error = new Error('Could not find this team.')
      error.statusCode = 404
      throw error
    }

    if (team.creator._id.toString() !== userId) {
      const error = new Error('You are not authorized to edit this team')
      error.statusCode = 403
      throw error
    }

    await Team.findByIdAndRemove(teamId)

    const user = await User.findById(userId)
    user.team.pull(teamId)
    await user.save()

    res.status(200).json({
      message: 'Team deleted !',
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
