const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Récupération du token depuis cookie (front) ou Authorization header (API Postman)
  const token =
    req.cookies?.token ||
    req.headers['authorization']?.split(' ')[1];

  if (!token) {
    // Cas API
    if (req.accepts('json')) {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }
    // Cas pages EJS → redirection vers la page de connexion
    return res.redirect('/');
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On recharge l'utilisateur complet (sans le mot de passe)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      if (req.accepts('json')) {
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }
      return res.redirect('/');
    }

    // Injection de l'utilisateur dans req.user pour les vues EJS
    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    if (req.accepts('json')) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    return res.redirect('/');
  }
};

module.exports = auth;
