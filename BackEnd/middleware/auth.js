const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; //Authorization is the name of the header
        if (!token) {
            throw new Error('Authentication failed!');
        }
        jwt.verify(token, 'supersecret_dont_share', (err, decodedToken) => {
            if (err) {
                throw new Error('Authentication failed!');
            }
            req.userData = { userId: decodedToken.userId };
            next();
        })
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
}