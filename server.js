const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares généraux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Vue & statiques
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Middleware d’auth (ex: vérification du JWT dans le cookie)
const requireAuth = require('./middleware/requireAuth');

// Routes d’auth (POST /login, GET /logout)
app.use(authRoutes);

// Pages “front”
app.get('/', (req, res) => {
  // si tu lis déjà le cookie pour l’utilisateur, tu peux le passer à la vue
  res.render('index', { user: req.user || null });
});

app.get('/dashboard', requireAuth, (req, res) => {
  // Ici tu iras chercher : réservations en cours, date du jour, etc.
  res.render('dashboard', {
    user: req.user,
    today: new Date(),
    reservations: [] // à remplacer par un find() en base
  });
});

// Lien vers la documentation
app.get('/docs', (req, res) => {
  res.render('docs'); // page avec la documentation de l’API
});

// Routes BACK protégées
app.use('/users', requireAuth, userRoutes);
app.use('/catways', requireAuth, catwayRoutes);
app.use('/catways/:id/reservations', requireAuth, reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));