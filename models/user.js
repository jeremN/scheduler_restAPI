const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false
  },
  team: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }
  ],
  role: {
    type: String
  },
  contract: {
    type: String
  },
  plannings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plannings'
    }
  ],
  accessType: {
    type: String,
    default: 'user'
  },
  rights: {
    plannings: {
      create: Boolean,
      write: Boolean,
      read: Boolean
    },
    teams: {
      create: Boolean,
      write: Boolean,
      read: Boolean
    }
  }
});

module.exports = mongoose.model('User', userSchema);
