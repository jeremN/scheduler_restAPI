const mongoose = require('mongoose')

const {Schema} = mongoose

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      city: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
      geoId: {
        type: String,
        default: '',
      },
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
        },
        poste: {
          type: String,
        },
        hours: {
          type: Number,
        },
        contract: {
          type: String,
        },
        notes: [
          {
            content: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  {timestamps: true},
)

module.exports = mongoose.model('Team', teamSchema)
