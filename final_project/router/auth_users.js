const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
      username: "tumelo",
      password: "123456"
    }
  ];
  

const isValid = (username) => {
    // e.g., ensure username is not already taken
    return !users.some((user) => user.username === username);
  };

  

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
    }
  
    // Check if user exists and password matches
    const user = users.find((user) => user.username === username && user.password === password);
  
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    // Create JWT
    let accessToken = jwt.sign(
      {
        data: username,
      },
      'access', // secret
      { expiresIn: 60 * 60 } // 1 hour
    );
  
    req.session.authorization = {
      accessToken,
      username,
    };
  
    return res.status(200).json({ message: "User successfully logged in." });
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // review from query string
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review query parameter is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review by username
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: `Review added/updated for ISBN ${isbn} by user ${username}`,
      reviews: books[isbn].reviews,
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
