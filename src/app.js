const path = require('path');
const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user')

// create Express application
const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

// build-in middleware function in Express
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// routers
app.use(userRouter);

module.exports = app;