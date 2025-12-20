// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Session setup for authentication
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Auth middleware for protected routes
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // continue to protected route
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Mount routers
app.use("/customer", customer_routes); // auth_users.js routes
app.use("/", genl_routes);             // general.js routes

// Start server
const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
