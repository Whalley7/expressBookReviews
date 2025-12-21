const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if username + password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// LOGIN route
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

// Placeholder for Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (!book) {
        return res.send("Unable to find review!");
    }

    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
