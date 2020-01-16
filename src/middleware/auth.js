const jwt = require('jsonwebtoken');
const User = require('../models/user');

// middleware to check if user is authenticated
const auth = async (req, res, next) => {
    try {
        // remove Bearer
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports = auth;