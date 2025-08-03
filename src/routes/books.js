const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const booksController = require("../controllers/booksController");

router.get("/", authMiddleware, booksController.getAllBooks);
router.get("/:id", authMiddleware, booksController.getBookById);
router.get(
  "/search/:title",
  authMiddleware,
  booksController.searchBooksByTitle
);
router.post("/", authMiddleware, booksController.createBook);
router.put("/:id", authMiddleware, booksController.updateBook);
router.delete("/:id", authMiddleware, booksController.deleteBook);

module.exports = router;
