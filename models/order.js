const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  flights: [
    {
      flight: {
        type: Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
      },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
