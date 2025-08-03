const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db");

const JWT_SECRET = process.env.JWT_SECRET || "ACCESS_TOKEN_SECRET";

exports.register = async (req, res) => {
  const { email, password } = req.body;

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
            res
              .status(201)
              .json({
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
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier l'utilisateur
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur serveur", error: err });
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
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
