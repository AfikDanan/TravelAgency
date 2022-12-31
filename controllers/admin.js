const Flight = require('../models/flight');
const User = require('../models/user');

exports.getAddflight = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  res.render('admin/edit-flight', {
    pageTitle: 'Add flight',
    path: '/admin/add-flight',
    editing: false,
    isAdmin: isAdmin,
  });
};


exports.refreshDB = (req, res, next) => {
  const today = new Date();
  Flight.deleteMany({ date: { $lte: today } }, err => {
    if (err) {
      console.log(err);
    }
    next();
  });

};

exports.postAddflight = (req, res, next) => {
  const flight = new Flight({
    destination: req.body.destination,
    origin: req.body.origin,
    date: new Date(req.body.date),
    takeOffTime: req.body.takeOffTime,
    landing: req.body.landing,
    numOfSeats: req.body.numOfSeats,
    price: req.body.price,
    imagePath: req.body.imagePath,
  });
  flight
    .save()
    .then(result => {
      console.log('Created flight');
      res.redirect('/admin/flights');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditflight = (req, res, next) => {
  let isAdmin = false;
  const editMode = req.query.edit;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  if (!editMode) {
    return res.redirect('/');
  }
  const flightId = req.params.flightId;
  Flight.findById(flightId)
    .then(flight => {
      if (!flight) {
        return res.redirect('/');
      }
      res.render('admin/edit-flight', {
        pageTitle: 'Edit flight',
        path: '/admin/edit-flight',
        editing: editMode,
        flight: flight,
        isAdmin: isAdmin,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditflight = (req, res, next) => {
  const updatedDestinaton = req.body.destinaton;
  const updatedOrigin = req.body.origin;
  const updatedDate = req.body.date;
  const updatedTakeOffTime = req.body.takeOffTime;
  const updatedLanding = req.body.landing;
  const updatedNumOfSeats = req.body.numOfSeats;
  const updatedPrice = req.body.price;
  const updatedImagePath = req.body.imagePath;
  const flightId = req.body.flightId;

  Flight.findById(flightId)
    .then(flight => {
      flight.destinaton = updatedDestinaton;
      flight.origin = updatedOrigin;
      flight.date = updatedDate;
      flight.takeOffTime = updatedTakeOffTime;
      flight.landing = updatedLanding;
      flight.numOfSeats = updatedNumOfSeats;
      flight.price = updatedPrice;
      flight.imagePath = updatedImagePath;
      return flight.save();
    })
    .then(result => {
      console.log('UPDATED flight!');
      res.redirect('/admin/flights');
    })
    .catch(err => console.log(err));
};

exports.getflights = (req, res, next) => {
  let isAdmin = false;
  if (req.session.user) {
    isAdmin = req.session.user.type === 'admin';
  }
  Flight.find()
    .then(flights => {
      res.render('admin/flights', {
        flights: flights,
        pageTitle: 'Admin flights',
        path: '/admin/flights',
        isAdmin: isAdmin,
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteflight = (req, res, next) => {
  const flightId = req.body.flightId;
  Flight.findByIdAndRemove(flightId)
    .then(() => {
      for (let user of User.find()) {
        if (user.cart.item.flightId == flightId) {
          user.removeFromCart(flightId) // need to check
        }
      }
    }).then(() => {
      console.log('DESTROYED flight');
      res.redirect('/admin/flights');
    })
    .catch(err => console.log(err));
};
