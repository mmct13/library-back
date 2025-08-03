const dotenv = require('dotenv');
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db");

const JWT_SECRET = process.env.JWT_SECRET

// Route POST pour l'inscription
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe sont requis" });
  }

  try {
    // Vérifier si l'email existe déjà
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur serveur", error: err });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Cet email est déjà utilisé" });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        db.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erreur serveur", error: err });
            }
            res.status(201).json({
              message: "Utilisateur créé",
              id: result.insertId,
              email,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route POST pour la connexion
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe sont requis" });
  }

  // Vérifier l'utilisateur
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur", error: err });
      }
      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      const user = results[0];

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      // Générer un token JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  );
});

module.exports = router;
