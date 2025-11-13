const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/Reservation');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// GET /catways/:id/reservations
router.get('/', async (req, res) => {
  const reservations = await Reservation.find({ catwayNumber: req.params.id });
  res.json(reservations);
});

// GET /catways/:id/reservations/:idReservation
router.get('/:idReservation', async (req, res) => {
  const reservation = await Reservation.findOne({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  res.json(reservation);
});

// POST /catways/:id/reservations
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      catwayNumber: req.params.id
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /catways/:id/reservations/:idReservation
router.put('/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.idReservation, catwayNumber: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /catways/:id/reservations/:idReservation
router.delete('/:idReservation', async (req, res) => {
  const reservation = await Reservation.findOneAndDelete({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  res.json({ message: 'Réservation supprimée' });
});

module.exports = router;
