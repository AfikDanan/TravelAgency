const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const pageNotFound = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


// Routes
const loginRoutes = require('./routes/login');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(loginRoutes);
app.use(pageNotFound.get404Page);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

