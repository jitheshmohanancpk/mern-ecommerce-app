const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ലോഗിൻ ചെയ്ത യൂസർ ആണോ എന്ന് നോക്കാൻ
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }
  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// അഡ്മിൻ ആണോ എന്ന് നോക്കാൻ (ഇത് ഉണ്ടെന്ന് ഉറപ്പാക്കുക)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

// രണ്ടും എക്സ്പോർട്ട് ചെയ്യണം
module.exports = { protect, admin };