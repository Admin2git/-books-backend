const express = require("express");
const app = express();
app.use(express.json());
const Book = require("./models/book.models");
const { connectDatabase } = require("./db/db.connect");
require("dotenv").config();

connectDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function createBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();
    return savedBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    if (savedBook) {
      res
        .status(201)
        .json({ message: "movie saved succussfully.", book: savedBook });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

async function readAllBooks() {
  try {
    const book = await Book.find();
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const book = await readAllBooks();
    if (book.length != 0) {
      res.status(201).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//get a book's detail by its title.

async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.bookTitle);
    if (book) {
      res.status(201).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//get details of all the books by an author.

async function readAllBookByAuthor(bookAuthor) {
  try {
    const book = await Book.find({ author: bookAuthor });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:bookAuthor", async (req, res) => {
  try {
    const book = await readAllBookByAuthor(req.params.bookAuthor);
    if (book.length != 0) {
      res.status(201).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//get all the books which are of "Business" genre.

async function readAllBookByGenre(bookGenre) {
  try {
    const book = await Book.find({ genre: bookGenre });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
  try {
    const book = await readAllBookByGenre(req.params.bookGenre);
    if (book.length != 0) {
      res.status(201).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//get all the books which was released in the year 2012.

async function readAllBookByreleasedYear(releasedYear) {
  try {
    const book = await Book.find({ publishedYear: releasedYear });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/releasedYear/:year", async (req, res) => {
  try {
    const book = await readAllBookByreleasedYear(req.params.year);
    if (book.length != 0) {
      res.status(201).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//update a book's rating with the help of its id

async function updateBookById(bookId, bookRating) {
  try {
    const book = await Book.findByIdAndUpdate(bookId, bookRating, {
      new: true,
    });
    return book;
  } catch (error) {
    throw error;
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);
    if (updatedBook) {
      res
        .status(201)
        .json({ message: "Book updated succussfully", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// update a book's rating with the help of its title.

async function updateBookByTitle(bookTitle, bookDetail) {
  try {
    const book = await Book.findOneAndUpdate({ title: bookTitle }, bookDetail, {
      new: true,
    });
    return book;
  } catch (error) {
    throw error;
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
    if (updatedBook) {
      res
        .status(201)
        .json({ message: "Book updated succussfully", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

//delete a book with the help of a book id

async function deleteBookById(bookId) {
  try {
    const book = await Book.findByIdAndDelete(bookId);
    return book;
  } catch (error) {
    throw error;
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    if (deletedBook) {
      res
        .status(201)
        .json({ message: "Book deleted succussfully", book: deletedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
