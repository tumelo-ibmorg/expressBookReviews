const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if username is already taken
    if (!isValid(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    // Register new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author.toLowerCase();
    const bookKeys = Object.keys(books);
    let matchingBooks = [];
  
    for (let key of bookKeys) {
      if (books[key].author.toLowerCase() === authorName) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();
    const bookKeys = Object.keys(books);
    let matchingBooks = [];
  
    for (let key of bookKeys) {
      if (books[key].title.toLowerCase() === titleParam) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given title" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  });
  

module.exports.general = public_users;
