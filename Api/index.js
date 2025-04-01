const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Initialize Prisma Client and Express app
const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON request bodies and cookies
app.use(bodyParser.json());
app.use(cookieParser());


// Secret key for JWT (should be stored in an environment variable in production)
const JWT_SECRET = '][q,s^z4X_J|5c[';

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to require authentication using token
const requireAuth = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Attach user info to request object
        req.user = decoded;
        next();
    });
};

// POST endpoint: Register a new user
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: new Date(dateOfBirth)
            }
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user." });
    }
});

// POST endpoint: Login a user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // Validate user and password
        if (user && await bcrypt.compare(password, user.password)) {
            // Generate JWT token
            const token = generateToken(user);

            // Send token in a cookie
            res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1 hour expiry
            return res.status(200).json({ message: "Login successful", user });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during login" });
    }
});

// POST endpoint: Logout a user (Clear token)
app.post('/api/logout', (req, res) => {
    // Clear the token by setting it to an expired value
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
});

// Example of a protected route
app.get('/api/protected', requireAuth, (req, res) => {
    // This route is protected and requires a valid token
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
