const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  categories: [ { type: Schema.Types.String, ref: 'category' } ]
});

ItemSchema.index({name: 'text'});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
