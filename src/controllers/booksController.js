const db = require('../../db');

  exports.getAllBooks = (req, res) => {
      db.query('SELECT * FROM books', (err, results) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          res.json(results);
      });
  };

  exports.getBookById = (req, res) => {
      const id = req.params.id;
      db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          if (results.length === 0) return res.status(404).json({ message: 'Livre non trouvé' });
          res.json(results[0]);
      });
  };

  exports.searchBooksByTitle = (req, res) => {
      const title = req.params.title;
      db.query('SELECT * FROM books WHERE title LIKE ?', [`%${title}%`], (err, results) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          if (results.length === 0) return res.status(404).json({ message: 'Aucun livre trouvé pour ce titre' });
          res.json(results);
      });
  };

  exports.createBook = (req, res) => {
      const { title, author, year } = req.body;
      if (!title || !author || !year) {
          return res.status(400).json({ message: 'Titre, auteur et année sont requis' });
      }
      db.query('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', [title, author, year], (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          res.status(201).json({ id: result.insertId, title, author, year });
      });
  };

  exports.updateBook = (req, res) => {
      const id = req.params.id;
      const { title, author, year } = req.body;
      if (!title || !author || !year) {
          return res.status(400).json({ message: 'Titre, auteur et année sont requis' });
      }
      db.query('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?', [title, author, year, id], (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          if (result.affectedRows === 0) return res.status(404).json({ message: 'Livre non trouvé' });
          res.json({ id: parseInt(id), title, author, year });
      });
  };

  exports.deleteBook = (req, res) => {
      const id = req.params.id;
      db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
          if (result.affectedRows === 0) return res.status(404).json({ message: 'Livre non trouvé' });
          res.status(204).send();
      });
  };