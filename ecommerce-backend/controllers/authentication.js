const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // യൂസർ നിലവിലുണ്ടോ എന്ന് നോക്കുക
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // പാസ്‌വേഡ് ഹാഷ് ചെയ്യുക (സെക്യൂരിറ്റിക്ക് വേണ്ടി)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // പാസ്‌വേഡ് ഒത്തുനോക്കുക
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // JWT ടോക്കൺ നിർമ്മിക്കുക
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};