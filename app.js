const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const MongoDBTravelAgency = require('connect-mongodb-session')(session);
const MONGODB_URI = "mongodb+srv://admin:admin@cluster.xmzwgdr.mongodb.net/TravelAgency?retryWrites=true&w=majority";

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const TravelAgency = new MongoDBTravelAgency({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const flightRoutes = require('./routes/flight');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    TravelAgency: TravelAgency
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      console.log(req.session.user.type);
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


// Routes
app.use('/admin', adminRoutes);
app.use(flightRoutes);
app.use(authRoutes);
app.use(errorController.get404Page);
// end routes


// DataBase connection
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });