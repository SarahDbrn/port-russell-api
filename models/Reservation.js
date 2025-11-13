const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  boatName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

// Exemple de validation simple : endDate > startDate
reservationSchema.pre('save', function (next) {
  if (this.endDate < this.startDate) {
    return next(new Error('La date de fin doit être après la date de début'));
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
