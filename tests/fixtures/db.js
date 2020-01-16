const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Daniel',
    email: 'Daniel@example.com',
    password: '56what!!',
    age: 16,
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Dan',
    email: 'Dan@example.com',
    password: 'myhouse099@@',
    age: 17,
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
};

// wipe DB and add 2 users
const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase
};