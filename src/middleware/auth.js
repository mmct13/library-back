const jwt = require("jsonwebtoken");

const JWT_SECRET = "ACCESS_TOKEN_SECRET"; // Doit correspondre à celui dans auth.js

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
