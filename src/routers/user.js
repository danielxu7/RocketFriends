const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        // TODO: send welcome email
        // login user
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

// logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// get user info
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        // TODO: send cancellation email
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/*', async (req, res) => {
    res.send('Hello world');
});

module.exports = router