const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI_PROD || process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
