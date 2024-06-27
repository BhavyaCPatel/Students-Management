import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();
    } catch (err) {
        console.error(`Token verification error: ${err.message}`);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;
