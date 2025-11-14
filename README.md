# Port de Plaisance Russell – API & Dashboard

Cette application est une API privée avec une interface web simple permettant à la capitainerie du **Port de Plaisance Russell** de gérer :

- les **catways** (petits appontements),
- les **réservations**,
- les **utilisateurs** de la capitainerie.

Elle a été développée dans le cadre d’un devoir : création d’une API Express avec base MongoDB, authentification et tableau de bord.

---

## 🧰 Stack technique

- **Node.js / Express**
- **MongoDB / Mongoose**
- **EJS** pour les vues serveur
- **JWT** + cookies HTTP-only pour l’authentification

---

## 🚀 Fonctionnalités principales

- Authentification par **email + mot de passe**
- Gestion des **catways** (CRUD complet côté API)
- Gestion des **réservations** (CRUD complet, sous-ressource de catway)
- Gestion des **utilisateurs** (CRUD complet côté API)
- Interface web avec :
  - page d’accueil + formulaire de connexion,
  - **tableau de bord** (dashboard),
  - pages de gestion (catways, réservations, utilisateurs),
  - page de **documentation de l’API**.

---

## 📂 Structure du projet (simplifiée)

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
