const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  shop: {
    type: String
  },
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
  rightsAccess: {}

});

module.exports = mongoose.model('User', userSchema);
