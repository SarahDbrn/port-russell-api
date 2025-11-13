const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes API
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const auth = require('./middleware/authMiddleware');

app.use('/login', authRoutes);
app.use('/users', userRoutes);
app.use('/catways', catwayRoutes);
app.use('/catways/:id/reservations', reservationRoutes);

// Page d'accueil "/"
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

// Traitement du formulaire de connexion (frontend)
const User = require('./models/User');
const jwt = require('jsonwebtoken');

app.post('/login-form', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.render('index', { error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');
  } catch (error) {
    res.render('index', { error: 'Erreur serveur' });
  }
});

// Dashboard (protégé)
app.get('/dashboard', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  const Reservation = require('./models/Reservation');
  const today = new Date();

  const reservationsEnCours = await Reservation.find({
    startDate: { $lte: today },
    endDate: { $gte: today }
  });

  res.render('dashboard', {
    user,
    today,
    reservationsEnCours
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
