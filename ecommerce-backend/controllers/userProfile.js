const User = require('../models/user');
const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. ഇമെയിൽ വഴി യൂസറെ കണ്ടെത്തുന്നു
    const user = await User.findOne({ email });

    // 2. യൂസർ ഉണ്ടോ എന്നും പാസ്‌വേഡ് മാച്ച് ആകുന്നുണ്ടോ എന്നും നോക്കുന്നു
    
    if(user && user.password === password) { 
  res.json({
    _id: user._id,
    token: generateToken(user._id),
  });
} else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// JWT ടോക്കൺ ജനറേറ്റ് ചെയ്യുന്ന ഫംഗ്ഷൻ
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};


module.exports = { authUser };