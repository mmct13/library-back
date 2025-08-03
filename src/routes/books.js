const express = require("express");
const router = express.Router();
const db = require("../../db");
const authMiddleware = require("../middleware/auth");

// Route GET pour récupérer tous les livres
router.get("/", authMiddleware, (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res.json(results);
  });
});

// Route GET pour récupérer un livre par ID
router.get("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json(results[0]);
  });
});

// Route GET pour rechercher un livre par titre
router.get("/search/:title", authMiddleware, (req, res) => {
  const title = req.params.title;
  db.query(
    "SELECT * FROM books WHERE title LIKE ?",
    [`%${title}%`],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur", error: err });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Aucun livre trouvé pour ce titre" });
      }
      res.json(results);
    }
  );
});

// Route POST pour ajouter un livre
router.post("/", authMiddleware, (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ message: "Titre, auteur et année sont requis" });
  }
  db.query(
    "INSERT INTO books (title, author, year) VALUES (?, ?, ?)",
    [title, author, year],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur", error: err });
      }
      res.status(201).json({ id: result.insertId, title, author, year });
    }
  );
});

// Route PUT pour mettre à jour un livre
router.put("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ message: "Titre, auteur et année sont requis" });
  }
  db.query(
    "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?",
    [title, author, year, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      res.json({ id: parseInt(id), title, author, year });
    }
  );
});

// Route DELETE pour supprimer un livre
router.delete("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(204).send();
  });
});

module.exports = router;
