const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Initialize Prisma Client and Express app
const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON request bodies and cookies
app.use(cors());
app.use(express.json());
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

// POST endpoint: Register a new user (without hashing the password)
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, dob } = req.body;
 
    // Validate that all required fields are provided
    if (!email || !password || !firstName || !lastName || !dob) {
        
        return res.status(400).json({ message: "All fields are required." });
    }
 
    // Validate and parse the dateOfBirth
    const parsedDate = new Date(dob);
 
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
        console.log("Invalid date format. Use YYYY-MM-DD");
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
    try {
        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
 
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered. Please use a different email." });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user." });
    }
    try {
        // Create a new user with validated dateOfBirth
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: password,  // Storing password in plaintext (not recommended)
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: parsedDate  // Ensured valid Date object
            }
        });
 
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user." });
    }
});
// POST endpoint: Login a user (without password hashing)
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

        // Validate user and password (direct comparison)
        if (user && user.password === password) {
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
