const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes API
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// ⚠️ Ici on monte directement les routes d'auth pour avoir POST /login et GET /logout
app.use(authRoutes);

app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways/:id/reservations', reservationRoutes);

// Petite route racine pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.json({ message: 'API Port de plaisance Russell opérationnelle' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
