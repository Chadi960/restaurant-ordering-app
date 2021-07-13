const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
});

categorySchema.virtual('name')
  .get(function() { return this._id })
  .set(function(n) {
    const _id = n;
    this.set({ _id })
  })
  // .get(() => { return this._id })
  // .set((name) => { this._id = name });

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
