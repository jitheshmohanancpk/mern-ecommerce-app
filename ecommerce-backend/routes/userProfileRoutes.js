const express = require('express');
const router = express.Router();
const { authUser } = require('../controllers/userProfile');
const { protect, admin } = require('../middleware/authMiddleware');

// എല്ലാവർക്കും ലോഗിൻ ചെയ്യാം
router.post('/login', authUser);

// ലോഗിൻ ചെയ്തവർക്ക് മാത്രം സ്വന്തം വിവരങ്ങൾ കാണാം
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

// അഡ്മിൻ ആണെങ്കിൽ മാത്രം കാണാൻ കഴിയുന്ന ഒരു റൂട്ട് (ഉദാഹരണത്തിന് എല്ലാ യൂസർമാരെയും കാണാൻ)
router.get('/all', protect, admin, async (req, res) => {
  // ഇവിടെ എല്ലാ യൂസർമാരെയും കാണിക്കുന്ന ലോജിക് എഴുതാം
  res.send("Admin accessed all users");
});

module.exports = router;