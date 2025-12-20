const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

console.log("General routes loaded");


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if user already exists
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Register new user
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  });
  

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase().trim();
    const keys = Object.keys(books);
    let results = [];
  
    keys.forEach(key => {
      let bookAuthor = books[key].author.toLowerCase().trim();
      if (bookAuthor === author) {
        results.push(books[key]);
      }
    });
  
    res.send(JSON.stringify(results, null, 4));
  });
  
  
  
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase().trim();
    const keys = Object.keys(books);
    let results = [];
  
    keys.forEach(key => {
      let bookTitle = books[key].title.toLowerCase().trim();
      if (bookTitle.includes(title)) {   // partial match allowed
        results.push(books[key]);
      }
    });
  
    res.send(JSON.stringify(results, null, 4));
  });
  
  

//  Get book review
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.send(JSON.stringify(book, null, 4));
    } else {
      res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 4));
    }
  });
  
  // Get book review
  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.status(404).send(JSON.stringify({ message: "Book not found" }, null, 4));
    }
  });
  
  
  

module.exports.general = public_users;
