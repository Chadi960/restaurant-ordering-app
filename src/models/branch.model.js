const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    index: '2dsphere',
  }
});

const Branch = mongoose.model('branch', BranchSchema);

module.exports = Branch;
