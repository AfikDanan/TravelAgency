const fs = require('fs');
const path = require('path');
const Flight = require('../models/flight');
const Order = require('../models/order');
const express = require('express');
const router = express.Router();

const stripe = require('stripe')('sk_test_51MLAFBA4k72Skn4PYTUmu8wPp0p2wQALYQB4RQGlZSONKLLAQLYPnTdxV5rlGxrFk2z6FpgHw2HwvB6cnpCqJ4Xs00MUS1iAK2');
const PDFDocument = require('pdfkit');

// const paypal = require('paypal-rest-sdk');
const { error } = require('console');
// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'Af866sGqvCYo08HegPWAHPpR2owJE8QbXwjnRA4u4cmqyb8qBQcsga6UoWnAdX56eRK0H4UO-0r5pTqY',
//   'client_secret': 'EDvoSMvyMx8N3z3FcwkJ1JvcTo5zL6Okyz7TCQXJUCeniGMk9UYx0S0v12rmnVIFX5t8VvMcUPYSSBNw'
// });

exports.getAllflights = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  Flight.find()
    .then(flights => {
      res.render('flight/flight-list', {
        flights: flights,
        pageTitle: 'All flights',
        path: '/flights',
        isAdmin: isAdmin,

      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getFilterflights = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  const query1 = {};
  const query2 = {};
  const sortByQurey = {};
  if (req.query.takeOffTime) {
    query1.takeOffTime = { $gte: req.query.takeOffTime };
    query2.takeOffTime = query1.takeOffTime;
  }

  if (req.query.destination) {
    query1.destination = req.query.destination;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    query1.price = { $gte: req.query.minPrice || 0, $lte: req.query.maxPrice || 10000 };
    query2.price = query1.price;
  }
  if (req.query.startDate && req.query.endDate) {
    query1.date = { $gte: req.query.startDate, $lte: req.query.endDate }
    query2.date = query1.date;
  }
  if (req.query.trip === 'twoWay') {
    query2.origin = query1.destination;
  }
  else {
    query2.destination = query1.destination;
  }

  if (req.query.sortBy) {
    if (req.query.sortBy === 'priceAsc') {
      sortByQurey.price = 1
    }
    else if (req.query.sortBy === 'priceDesc') {
      sortByQurey.price = -1;
    }
    else if (req.query.sortBy === 'poplar') {
      sortByQurey.numOfSeats = 1;
    }
    else {
      sortByQurey.destination = 1;
    }
  }
  Flight.find({ $or: [query1, query2] }).sort(sortByQurey).then((flights) => {
    res.render('flight/flight-list', {
      flights: flights,
      pageTitle: 'All flights',
      path: '/flights',
      isAdmin: isAdmin,
    })
  })
    .catch((err) => {
      console.log(err);
    });

};

exports.getflight = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  const flightId = req.params.flightId;
  Flight.findById(flightId)
    .then(flight => {
      res.render('flight/flight-detail', {
        flight: flight,
        pageTitle: flight.title,
        path: '/flights',
        isAdmin: isAdmin
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }

  Flight.find().limit(4)
    .then(flights => {
      res.render('flight/index', {
        flights: flights,
        pageTitle: 'Travel Agency',
        path: '/',
        isAdmin: isAdmin
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const flightId = req.body.flightId;
  const qty = req.body.quantity;
  Flight.findById(flightId)
    .then(flight => {
      return req.user.addToCart(flight, qty);
    })
    .then(result => {
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
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('flight/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAdmin: isAdmin,
      });
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  let flights;
  let total = 0;
  req.user
    .populate('cart.items.flightId')
    .then(user => {
      flights = user.cart.items;
      total = 0;
      flights.forEach(f => {
        total += f.quantity * f.flightId.price;
        if (f.quantity > f.flightId.numOfSeats) {
          req.user.removeFromCart(f.flightId)
            .then(() => req.user.addToCart(f.flightId, 1));
        }
      });
      if (flights.length > 0) {
        return stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ['card'],
          line_items: flights.map(f => {
            return {
              quantity: f.quantity,
              price_data: {
                currency: 'usd',
                unit_amount: f.flightId.price * 100,

                product_data: {
                  name: `Flight to ${f.flightId.destination}`,
                  description: `From ${f.flightId.origin}`,
                  images: [f.flightId.imagePath]
                }
              }
            };
          }),
          success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
          cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
        });
      }
    })
    .then(session => {
      if (session) {
        res.render('flight/cart', {
          path: '/cart',
          pageTitle: 'Checkout',
          flights: flights,
          totalSum: total,
          sessionId: session.id,
          isAdmin: isAdmin,
        });
      }
      else {
        res.render('flight/cart', {
          path: '/cart',
          pageTitle: 'Checkout',
          flights: flights,
          totalSum: total,
          isAdmin: isAdmin,
        });
      }
    })

    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.flightId')

    .then(user => {
      const flights = user.cart.items.map(i => {
        return { quantity: i.quantity, flight: { ...i.flightId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.email,
          email: req.user.email,
          userId: req.user._id
        },
        flights: flights
      });
      for (f of flights) {
        Flight.findByIdAndUpdate(f.flight._id, { numOfSeats: (f.flight.numOfSeats - f.quantity) },
          function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              console.log("Updated User : ", docs);
            }
          });
      }
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutCancel = (req, res, next) => {
  res.redirect('/cart');
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      console.log(order);
      order.flights.forEach(fli => {
        console.log(fli.flight.destination);
        totalPrice += fli.quantity * fli.flight.price;
        pdfDoc
          .fontSize(14)
          .text('Flight to ' +
            fli.flight.destination +
            ' - Tickets: ' +
            fli.quantity +
            ' x ' +
            '$' +
            fli.flight.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch(err => next(err));
};


