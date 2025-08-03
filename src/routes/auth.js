const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");

// Validation middleware pour l'inscription
const registerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe doit avoir au moins 6 caractères"),
];

// Validation middleware pour la connexion
const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

// Route POST pour l'inscription
router.post("/register", registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  authController.register(req, res);
});

// Route POST pour la connexion
router.post("/login", loginValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  authController.login(req, res);
});

module.exports = router;
