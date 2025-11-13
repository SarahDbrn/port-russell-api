const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Toutes les routes users sont protégées
router.use(auth);

// GET /users
router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// GET /users/:email
router.get('/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select('-password');
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body); // username, email, password
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé', user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /users/:email
router.put('/:email', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Utilisateur mis à jour', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /users/:email
router.delete('/:email', async (req, res) => {
  const user = await User.findOneAndDelete({ email: req.params.email });
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json({ message: 'Utilisateur supprimé' });
});

module.exports = router;
