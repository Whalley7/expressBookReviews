// general.js
const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const public_users = express.Router();
const axios = require('axios');

public_users.use(express.json());

//Task 2:  Get the books based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    return book
        ? res.status(200).json(book)
        : res.status(404).json({ message: "Book not found" });
});

//Task 3:  Get books based on author
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

//Task 4:  Get the books based on title
public_users.get('/title/:title', (req, res) => {
    const titleParam = req.params.title?.toLowerCase();
    if (!titleParam) {
         res.status(400).json({ message: "Title parameter is required" });
    }
    const filteredBooks = Object.values(books).filter(
        b => b.title && b.title.toLowerCase() === titleParam
    );
    return filteredBooks.length > 0
        ? res.status(200).json(filteredBooks)
        : res.status(404).json({ message: "No books found with this title" });
});

//Task 5:  Get the book reviews based on ISBN provided in the request parameters
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    return book
        ? res.status(200).json(book.reviews)
        : res.status(404).json({ message: "Book not found" });
});

// Task 6:  Register as a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password required" });
    }
    if (isValid(username)) {
        res.status(400).json({ message: "User already exists!" });
    }
    users.push({ username, password });
    res.status(200).json({ message: "User successfully registered. Now you can login" });
});

//Task 10: Get the book list available in the shop using Async/Await + axios (Books)
public_users.get("/", async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// Task 11:  Get book details based on ISBN using Async/Await + axios
public_users.get("/isbn/:isbn", async function (req, res) {
     const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Book not found",
            error: error.message
        });
    }
});

//Task 12:  Get book details based on author using async/await + axios 
public_users.get("/author/:author", async function (req, res)  {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Author not found",
            error: error.message
        });
    }
});

//Task 13:  Get book details based on title using async/await + axios
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({
            message: "Title not found",
            error: error.message
        });
    }
});

module.exports.general = public_users;
