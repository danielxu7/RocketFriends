const auth = require('./middleware/auth')
const path = require('path');
const express = require('express');
const hbs = require('hbs')
require('./db/mongoose');

const userRouter = require('./routers/user');

// create Express application
const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// build-in middleware function in Express
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// routers
app.use(userRouter);

// site links
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home');
});

module.exports = app;