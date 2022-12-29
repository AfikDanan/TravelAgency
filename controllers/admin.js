const flight = require('../models/flight');
const User = require('../models/user');

exports.getAddflight = (req, res, next) => {
  res.render('admin/edit-flight', {
    pageTitle: 'Add flight',
    path: '/admin/add-flight',
    editing: false
  });
};

exports.postAddflight = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const flight = new flight({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  flight
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created flight');
      res.redirect('/admin/flights');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditflight = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const flightId = req.params.flightId;
  flight.findById(flightId)
    .then(flight => {
      if (!flight) {
        return res.redirect('/');
      }
      res.render('admin/edit-flight', {
        pageTitle: 'Edit flight',
        path: '/admin/edit-flight',
        editing: editMode,
        flight: flight
      });
    })
    .catch(err => console.log(err));
};

exports.postEditflight = (req, res, next) => {
  const flightId = req.body.flightId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  flight.findById(flightId)
    .then(flight => {
      flight.title = updatedTitle;
      flight.price = updatedPrice;
      flight.description = updatedDesc;
      flight.imageUrl = updatedImageUrl;
      return flight.save();
    })
    .then(result => {
      console.log('UPDATED flight!');
      res.redirect('/admin/flights');
    })
    .catch(err => console.log(err));
};

exports.getflights = (req, res, next) => {
  flight.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(flights => {
      console.log(flights);
      res.render('admin/flights', {
        flights: flights,
        pageTitle: 'Admin flights',
        path: '/admin/flights'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteflight = (req, res, next) => {
  const flightId = req.body.flightId;
  flight.findByIdAndRemove(flightId)
    .then(() => {
      for (let user of User.find()) {
        if (user.cart.item.flightId == flightId) {
          user.removeFromCart(flightId)
        }
      }
    }).then(() => {
      console.log('DESTROYED flight');
      res.redirect('/admin/flights');
    })
    .catch(err => console.log(err));
};
