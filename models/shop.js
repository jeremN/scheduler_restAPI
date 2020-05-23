const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    geoId: {
      type: String
    }
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Shop', shopSchema);
