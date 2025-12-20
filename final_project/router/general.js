// general.js
const express = require('express');
const books = require('./booksdb.js');   // your books file
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

const axios = require('axios');

public_users.get("/promise/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(error => {
            return res.status(500).json({
                message: "Error fetching book by ISBN",
                error: error.message
            });
        });
});


// Task 10: Get book list using async/await with Axios
// Task 10: Async/Await
public_users.get("/async/books", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

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


public_users.get("/promise/books", (req, res) => {
    axios.get("http://localhost:5000/")
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching books", error: error.message });
        });
});





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




