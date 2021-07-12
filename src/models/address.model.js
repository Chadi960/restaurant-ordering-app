const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  completeAddress: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: [Number],
    required: true,
    index: '2dsphere',
  }
});

const Address = mongoose.model('address', AddressSchema);

module.exports = Address;
