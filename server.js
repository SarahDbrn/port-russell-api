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

// ====== PAGES EJS PROTÉGÉES + FORMULAIRES CRUD ======

// ---- CATWAYS ----

// Affichage de la page catways
app.get('/catways-page', requireAuth, async (req, res) => {
  const catways = await Catway.find();
  res.render('catways', { user: req.user, catways });
});

// Création d'un catway
app.post('/catways-page/create', requireAuth, async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    await Catway.create({ catwayNumber, catwayType, catwayState });
    res.redirect('/catways-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la création du catway');
  }
});

// Mise à jour de l'état d'un catway
app.post('/catways-page/update/:catwayNumber', requireAuth, async (req, res) => {
  try {
    await Catway.findOneAndUpdate(
      { catwayNumber: req.params.catwayNumber },
      { catwayState: req.body.catwayState },
      { new: true }
    );
    res.redirect('/catways-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la mise à jour du catway');
  }
});

// Suppression d'un catway
app.post('/catways-page/delete/:catwayNumber', requireAuth, async (req, res) => {
  try {
    await Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
    res.redirect('/catways-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la suppression du catway');
  }
});

// ---- RÉSERVATIONS ----

// Affichage de la page réservations
app.get('/reservations-page', requireAuth, async (req, res) => {
  const reservations = await Reservation.find();
  res.render('reservations', { user: req.user, reservations });
});

// Création d'une réservation
app.post('/reservations-page/create', requireAuth, async (req, res) => {
  try {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
    await Reservation.create({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    });
    res.redirect('/reservations-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la création de la réservation');
  }
});

// Mise à jour d'une réservation
app.post('/reservations-page/update/:id', requireAuth, async (req, res) => {
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    await Reservation.findByIdAndUpdate(
      req.params.id,
      { clientName, boatName, startDate, endDate },
      { new: true, runValidators: true }
    );
    res.redirect('/reservations-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la mise à jour de la réservation');
  }
});

// Suppression d'une réservation
app.post('/reservations-page/delete/:id', requireAuth, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.redirect('/reservations-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la suppression de la réservation');
  }
});

// ---- UTILISATEURS ----

// Affichage de la page utilisateurs
app.get('/users-page', requireAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.render('users', { user: req.user, users });
});

// Création d'un utilisateur
app.post('/users-page/create', requireAuth, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.redirect('/users-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la création de l\'utilisateur');
  }
});

// Mise à jour d'un utilisateur
app.post('/users-page/update/:id', requireAuth, async (req, res) => {
  try {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    );
    res.redirect('/users-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la mise à jour de l\'utilisateur');
  }
});

// Suppression d'un utilisateur
app.post('/users-page/delete/:id', requireAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users-page');
  } catch (error) {
    console.error(error);
    res.status(400).send('Erreur lors de la suppression de l\'utilisateur');
  }
});

// ====== LANCEMENT DU SERVEUR ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
