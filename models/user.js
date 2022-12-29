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
  paymentDetail: {
    type: String,
    required: false
  },
  cart: {
    items: [
      {
        flightId: {
          type: Schema.Types.ObjectId,
          ref: 'Flight',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});


userSchema.methods.addToCart = function (flight, qty) {
  const cartflightIndex = this.cart.items.findIndex(cp => {
    return cp.flightId.toString() === flight._id.toString();
  });
  let newQuantity = qty;
  const updatedCartItems = [...this.cart.items];

  if (cartflightIndex >= 0) {
    // newQuantity = this.cart.items[cartflightIndex].quantity + 1;
    updatedCartItems[cartflightIndex].quantity = qty;
  } else {
    updatedCartItems.push({
      flightId: flight._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (flightId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.flightId.toString() !== flightId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

