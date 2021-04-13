const mongoose = require('mongoose')
const Schema = mongoose.Schema

const planningsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    startHours: {
      type: String,
      required: true,
    },
    endHours: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    offTime: {
      maxDuration: Number,
      minDuration: Number,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    content: [
      {
        memberId: Schema.Types.ObjectId,
        memberFullname: String,
        planned: [
          {
            day: String,
            startHour: String,
            endHour: String,
            pauseStartHour: String,
            pauseEndHour: String,
          },
        ],
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {timestamps: true},
)

module.exports = mongoose.model('Plannings', planningsSchema)
