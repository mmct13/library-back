const dotenv = require('dotenv');
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrait le token du header "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ajoute l'ID utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
