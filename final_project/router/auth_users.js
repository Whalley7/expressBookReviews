const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
let books = require("./booksdb.js");
let users = [];

//Task 5:  Get the book reviews based on ISBN provided in the request parameters
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (!book) {
        return res.send("Unable to find review!");
    }
    return res.status(300).json({ message: "Yet to be implemented" });
});

//Tasl 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { data: username },
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).json({ message: "User successfully logged in" });
    }
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
});

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if username + password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

//Task 8:  Add, modify a book review
// Add or modify a book review
authenticated.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    // Username comes from the session after login
    const username = req.session.authorization.username;
    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    // Add or update the review for this user
    books[isbn].reviews[username] = review;
    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: books[isbn].reviews
    });

//Task 9:  Delete a book review
authenticated.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review by this user to delete" });
    }
    // Delete the user's review
    delete books[isbn].reviews[username];
    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
