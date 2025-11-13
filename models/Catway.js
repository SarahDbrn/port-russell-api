const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  catwayState: {
    type: String,
    default: 'Bon état'
  }
});

module.exports = mongoose.model('Catway', catwaySchema);
