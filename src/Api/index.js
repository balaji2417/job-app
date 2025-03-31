// Import necessary modules
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

// Initialize Prisma Client and Express app
const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST endpoint: Register a new user
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: password, // In real scenarios, use bcrypt to hash passwords
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

// GET endpoint: Login a user
app.get('/api/login', async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // Check if user exists and validate password
        if (user && user.password === password) {  // In a real scenario, hash comparison is needed
            return res.status(200).json({ message: "Login successful", user });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during login" });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
