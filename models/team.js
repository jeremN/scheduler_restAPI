const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  {
    timestamps: true
  }
});

module.exports = mongoose.model('Team', teamSchema);
