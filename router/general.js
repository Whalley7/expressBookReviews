// general.js
const express = require('express');
const books = require('./booksdb.js');
const { isValid } = require('./auth_users.js');
let users = require('./auth_users.js').users;

console.log("Current users:", users);


const public_users = express.Router();
const axios = require('axios');

public_users.use(express.json());


// Task 1: Get all books
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    return book
        ? res.status(200).json(book)
        : res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by author
public_users.get("/author/:author", (req, res) => {
    const authorParam = req.params.author?.toLowerCase();

    if (!authorParam) {
        return res.status(400).json({ message: "Author parameter is required" });
    }

    const filteredBooks = Object.values(books).filter(
        book => book.author && book.author.toLowerCase() === authorParam
    );

    return filteredBooks.length > 0
        ? res.status(200).json(filteredBooks)
        : res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get books by title
public_users.get("/title/:title", (req, res) => {
    const titleParam = req.params.title?.toLowerCase();

    if (!titleParam) {
        return res.status(400).json({ message: "Title parameter is required" });
    }

    const filteredBooks = Object.values(books).filter(
        book => book.title && book.title.toLowerCase() === titleParam
    );

    return filteredBooks.length > 0
        ? res.status(200).json(filteredBooks)
        : res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get reviews for a book by ISBN
public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    return book
        ? res.status(200).json(book.reviews)
        : res.status(404).json({ message: "Book not found" });
});

// Task 6: Register a new customer
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "Customer successfully registered" });
});

//Task 10:  Get all books using an async
public_users.get("/async/books", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book list",
            error: error.message
        });
    }
});

//Task 11: Search by ISBN using an async
public_users.get("/async/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Book not found",
            error: error.message
        });
    }
});

//Task 12:  Search by Author using an async
public_users.get("/async/author/:author", async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Author not found",
            error: error.message
        });
    }
});

//Task 13:  Search Books by Title
public_users.get("/async/title/:title", async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Title not found",
            error: error.message
        });
    }
});




// ---------------------------------------------------------------------------
// Export router
// ---------------------------------------------------------------------------
module.exports.general = public_users;
