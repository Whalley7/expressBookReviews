// general.js
const express = require('express');
const books = require('./booksdb.js');   // your books file
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get books by author (Task 3) - case-insensitive
public_users.get('/author/:author', (req, res) => {
    const authorParam = req.params.author?.toLowerCase();

    if (!authorParam) {
        return res.status(400).json({ message: "Author parameter is required" });
    }

    // Log the books object to debug
    console.log("Books:", books);

    const filteredBooks = Object.values(books).filter(book => {
        if (!book.author) return false;
        return book.author.toLowerCase() === authorParam;
    });

    console.log("Filtered:", filteredBooks);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});


// Get books by title (case-insensitive)
public_users.get('/title/:title', (req, res) => {
    const titleParam = req.params.title?.toLowerCase();
    if (!titleParam) {
        return res.status(400).json({ message: "Title parameter is required" });
    }

    const filteredBooks = Object.values(books).filter(
        b => b.title && b.title.toLowerCase() === titleParam
    );

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
