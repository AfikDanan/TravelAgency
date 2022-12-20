const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
// const pageNotFound = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));




app.listen(3000);
