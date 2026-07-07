const jwt = require('jsonwebtoken');
const { users } = require('../data');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Get user from the token
      const user = users.find(u => u._id === decoded.id);
      if (!user) {
         return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Exclude password
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
     res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
