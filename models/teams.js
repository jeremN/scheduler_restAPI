const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      city: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
      geoId: {
        type: String,
        default: ''
      }
    },  
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        firstname: {
          type: String
        },
        lastname: {
          type: String
        }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
