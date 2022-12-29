const Flight = require('../models/flight');
const Order = require('../models/order');

exports.getflights = (req, res, next) => {
  Flight.find()
    .then(flights => {
      res.render('flight/flight-list', {
        flights: flights,
        pageTitle: 'All flights',
        path: '/flights',

      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getflight = (req, res, next) => {
  const flightId = req.params.flightId;
  Flight.findById(flightId)
    .then(flight => {
      res.render('flight/flight-detail', {
        flight: flight,
        pageTitle: flight.title,
        path: '/flights',
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Flight.find()
    .then(flights => {
      res.render('flight/index', {
        flights: flights,
        pageTitle: 'flight',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log(req.user);
  req.user
    .populate('cart.items.flightId')
    .then(user => {
      const flights = user.cart.items;
      res.render('flight/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        flights: flights,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const flightId = req.body.flightId;
  const qty = req.body.quantity;
  Flight.findById(flightId)
    .then(flight => {
      return req.user.addToCart(flight, qty);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteflight = (req, res, next) => {
  const flightId = req.body.flightId;
  req.user
    .removeFromCart(flightId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {

  req.user
    .populate('cart.items.flightId')
    .then(user => {
      const flights = user.cart.items.map(i => {
        return { quantity: i.quantity, flight: { ...i.flightId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.email,
          userId: req.user
        },
        flights: flights
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('flight/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};


