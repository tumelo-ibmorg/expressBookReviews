const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

app.use(express.json());

// Set up session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// JWT authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(403).json({ message: "No token found. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, "access");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log("Server is running"));
