// general.js
const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const public_users = express.Router();
const axios = require('axios');


//Async/Await Axios (Author)
public_users.get("/async/author/:author", async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books by author",
            error: error.message
        });
    }
});

// Async/Await (Books)
public_users.get("/async/books", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 10 — Async/Await (ISBN)
public_users.get("/async/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book by ISBN",
            error: error.message
        });
    }
});

// Registration
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


// Core Routes
public_users.get('/', (req, res) => res.status(200).json(books));

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    return book
        ? res.status(200).json(book)
        : res.status(404).json({ message: "Book not found" });
});

//Get books by author (case-insensitive)
public_users.get('/author/:author', (req, res) => {
    const authorParam = req.params.author?.toLowerCase();
    if (!authorParam) {
        return res.status(400).json({ message: "Author parameter is required" });
    }

    const filteredBooks = Object.values(books).filter(book =>
        book.author && book.author.toLowerCase() === authorParam
    );

    return filteredBooks.length > 0
        ? res.status(200).json(filteredBooks)
        : res.status(404).json({ message: "No books found for this author" });
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const titleParam = req.params.title?.toLowerCase();
    if (!titleParam) {
        return res.status(400).json({ message: "Title parameter is required" });
    }

    const filteredBooks = Object.values(books).filter(
        b => b.title && b.title.toLowerCase() === titleParam
    );

    return filteredBooks.length > 0
        ? res.status(200).json(filteredBooks)
        : res.status(404).json({ message: "No books found with this title" });
});

//Async books by title
public_users.get("/async/title/:title", async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book by title",
            error: error.message
        });
    }
});


// Get reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    return book
        ? res.status(200).json(book.reviews)
        : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
