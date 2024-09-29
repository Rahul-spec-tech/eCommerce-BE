const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        req.user = null;
        return next();
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            req.user = null;
            return next();
        }
        req.user = decoded;
        if (req.path === '/' && decoded) {
            return res.status(200).json({ redirect: '/home' });
        }
        next();
    });
};

module.exports = authMiddleware;
