const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ====== MODELS ======
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

// ====== MIDDLEWARES GÉNÉRAUX ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== VUES & FICHIERS STATIQUES ======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ====== ROUTES ======
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const requireAuth = require('./middleware/authMiddleware');

// Routes d’auth (POST /login, GET /logout)
app.use(authRoutes);

// Page d’accueil (login)
app.get('/', (req, res) => {
  res.render('index', { user: req.user || null });
});

// Dashboard (protégé)
app.get('/dashboard', requireAuth, async (req, res) => {
  const today = new Date();

  const reservations = await Reservation.find({
    startDate: { $lte: today },
    endDate: { $gte: today }
  });

  res.render('dashboard', {
    user: req.user,
    today,
    reservations
  });
});

// Page documentation
app.get('/docs', (req, res) => {
  res.render('docs');
});

// ====== ROUTES BACK ======

// ⚠️ IMPORTANT : /users SANS requireAuth ici
app.use('/users', userRoutes);

// Ces routes-là sont protégées globalement
app.use('/catways', requireAuth, catwayRoutes);
app.use('/catways/:id/reservations', requireAuth, reservationRoutes);

// ====== PAGES EJS PROTÉGÉES ======
app.get('/catways-page', requireAuth, async (req, res) => {
  const catways = await Catway.find();
  res.render('catways', { user: req.user, catways });
});

app.get('/reservations-page', requireAuth, async (req, res) => {
  const reservations = await Reservation.find();
  res.render('reservations', { user: req.user, reservations });
});

app.get('/users-page', requireAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.render('users', { user: req.user, users });
});

// ====== LANCEMENT DU SERVEUR ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
