const jwt = require('jsonwebtoken');

// middleware to check if user is authenticated
// render login screen if not authenticated
const auth = async (req, res, next) => {
    try {
        const token = req.session.token;
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        // res.status(401).send({ error: 'Please authenticate.' });
        res.render('index');
        // TODO: send 401 or redirect to index
    }
};

module.exports = auth;