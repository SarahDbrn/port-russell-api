const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// GET /catways
router.get('/', async (req, res) => {
  const catways = await Catway.find();
  res.json(catways);
});

// GET /catways/:id  (id = catwayNumber)
router.get('/:id', async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) return res.status(404).json({ message: 'Catway non trouvé' });
  res.json(catway);
});

// POST /catways
router.post('/', async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.status(201).json(catway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /catways/:id (on ne modifie que catwayState)
router.put('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true }
    );
    if (!catway) return res.status(404).json({ message: 'Catway non trouvé' });
    res.json(catway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /catways/:id
router.delete('/:id', async (req, res) => {
  const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  if (!catway) return res.status(404).json({ message: 'Catway non trouvé' });
  res.json({ message: 'Catway supprimé' });
});

module.exports = router;
