const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
}

const verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const cookieToResponse = ({ res, admin }) => {
    const token = createJWT({ payload: admin });
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token', token, {
        httpOnly: false,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })
    return token;
}

module.exports = {
    createJWT,
    verifyToken,
    cookieToResponse,
}