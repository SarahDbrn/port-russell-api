# Port de Plaisance Russell – API & Dashboard

Cette application est une **API privée** accompagnée d’une interface web simple permettant à la capitainerie du **Port de Plaisance Russell** de gérer :

- les **catways** (petits appontements),
- les **réservations**,
- les **utilisateurs** (membres de la capitainerie).

Ce projet a été développé dans le cadre d’un devoir : mise en place d’une API REST avec Express, MongoDB (Atlas), authentification JWT, pages EJS et déploiement en ligne.

---

# 🌐 Application hébergée

👉 **https://port-russell-api-j1ex.onrender.com**

Vous pouvez accéder :

- à la **page d’accueil** (connexion),
- au **dashboard** après authentification,
- aux pages de gestion (catways, réservations, utilisateurs),
- à la **documentation API** disponible à `/docs`.

---

# 🧰 Stack technique

- **Node.js / Express**
- **MongoDB Atlas / Mongoose**
- **EJS** (templates serveur)
- **JWT** + cookies HTTP-only (auth sécurisée)
- **Render.com** (hébergement)

---

# 🚀 Fonctionnalités principales

### ✔️ Authentification
- Connexion via **email + mot de passe**
- JWT envoyé dans un **cookie HTTP-only**
- Middleware d’auth sécurisant toutes les routes sensibles

### ✔️ Gestion des catways
- CRUD complet  
- Règles : catwayNumber unique, type `long` ou `short`, état modifiable

### ✔️ Gestion des réservations
- CRUD complet  
- Sous-ressource de catway : `/catways/:id/reservations`
- Validation : endDate > startDate

### ✔️ Gestion des utilisateurs
- CRUD complet (email unique + mot de passe hashé)

### ✔️ Interface web
- Page d’accueil + connexion  
- Tableau de bord avec réservations en cours  
- Pages de gestion (catways, réservations, utilisateurs)  
- Documentation API

---

# 📂 Structure du projet

```txt
.
├── config/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Catway.js
│   └── Reservation.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── catwayRoutes.js
│   └── reservationRoutes.js
├── views/
│   ├── index.ejs
│   ├── dashboard.ejs
│   ├── docs.ejs
│   ├── catways.ejs
│   ├── reservations.ejs
│   ├── users.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── public/
├── server.js
└── package.json
