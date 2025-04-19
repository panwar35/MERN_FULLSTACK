const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');

        // Check if no token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user from the token
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
}; 