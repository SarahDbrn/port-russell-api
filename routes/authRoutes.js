const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Stocker dans un cookie (simple pour le devoir)
    res.cookie('token', token, {
      httpOnly: true,
      // secure: true en prod avec HTTPS
    });

    res.json({ message: 'Connecté', user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
});

module.exports = router;
