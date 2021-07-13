const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  total: {
    type: Number,
    required: true,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ["pending", "rejected, accepted"]
  },
  items: [ { type: Schema.Types.ObjectId, ref: 'Item' } ],
  branch: { type: Schema.Types.ObjectId, ref: 'branch' }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
