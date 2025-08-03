const express = require('express');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Routes pour l'authentification (non protégées)
app.use('/api/auth', authRouter);

// Routes pour les livres (protégées par authentification)
app.use('/api/books', booksRouter);

// Gestion des erreurs pour les routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});