const jwt = require('jsonwebtoken');

const {
    NODE_ENV,
    JWT_SECRET,
} = process.env;

module.exports = (req, res, next) => {
    const authorization = req.cookies.jwt;

    if (!authorization) {
        const e = new Error('Необходима авторизация');
        e.statusCode = 401;
        next(e);
    }

    const token = authorization;

    let payload;

    try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
        const e = new Error('Необходима авторизация');
        e.statusCode = 401;
        next(e);
    }

    req.user = payload;

    next();
};