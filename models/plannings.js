const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planningsSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    }, 
    shop: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    startHours: {
      type: String,
      required: true
    },
    endHours: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    offTimes: {
      type: Array
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    content: [
      {
        member: {
          type: Schema.Types.ObjectId,
          ref: 'Team'
        },
        planned: {
          type: Array
        }
      }
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plannings', planningsSchema)