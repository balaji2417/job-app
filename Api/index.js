const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

// Initialize Prisma Client and Express app
const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON request bodies and cookies
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'https://job-portal-peach-zeta.vercel.app', // React app's URL
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], // Include all necessary methods
    credentials: true, // Allow cookies to be sent with the request
};
app.use(cors(corsOptions));

// Secret key for JWT (should be stored in an environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || '][q,s^z4X_J|5c['; // Use env variable with a fallback

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' }); // Include email in JWT payload
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
        req.user = decoded; // Attach the decoded user info (email)
        next();
    });
};

app.get("/api/myJobIds", requireAuth, async (req, res) => {
    try {
        const email = req.user.email;
        const applications = await prisma.application.findMany({
            where: { userId: email },
            select: { jobListingId: true }
        });
        const jobIds = applications.map(app => app.jobListingId);
        res.json({ jobIds });
    } catch (error) {
        console.error("Error fetching job IDs:", error);
        res.status(500).json({ error: "Failed to fetch job IDs." });
    }
});

// POST endpoint: Register a new user (without hashing the password - WARNING!)
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, dob } = req.body;

    if (!email || !password || !firstName || !lastName || !dob) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const parsedDate = new Date(dob);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered." });
        }
        const newUser = await prisma.user.create({
            data: { email, password, firstName, lastName, dateOfBirth: parsedDate } // WARNING: Plaintext password
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user." });
    }
});

// POST endpoint: Login a user (without password hashing - WARNING!)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email }, select: { email: true, firstName: true, password: true } });
        if (user && user.password === password) { // WARNING: Plaintext password comparison
            const token = generateToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Ensure HTTPS in production
                maxAge: 3600000, // 1 hour expiry
                sameSite: 'None', // Required for cross-site cookies (if frontend and backend are on different subdomains)
                
            });
            return res.status(200).json({ message: "Login successful", user });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Error during login" });
    }
});

// GET endpoint: Fetch authenticated user's data
app.get("/api/me", requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: req.user.email }, select: { email: true, firstName: true } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Error fetching user data" });
    }
});

app.post("/api/getRecords", async (req, res) => {
    const { email } = req.body;
    try {
        const records = await prisma.application.findMany({ where: { userId: email } });
        res.json({ records });
    } catch (error) {
        console.error("Error fetching application records:", error);
        res.status(500).json({ error: "Error fetching application records" });
    }
});

app.post("/api/getCount", async (req, res) => {
    const { email, platformName } = req.body;
    try {
        const records = await prisma.performanceMetrics.findUnique({
            where: { userId_platformName: { userId: email, platformName: platformName } }
        });
        res.json({ records });
    } catch (error) {
        console.error("Error fetching performance metrics:", error);
        res.status(500).json({ error: "Error fetching performance metrics" });
    }
});

app.post("/api/updateRecord", async (req, res) => {
    const { email, value, id, platformName } = req.body;
    try {
        const updatedRecord = await prisma.Application.update({
            where: { userId_jobListingId: { userId: email, jobListingId: id } },
            data: { status: value }
        });
        if (value === 'Rejected' || value === 'Selected') { 
            const incrementField = value === 'Rejected' ? { rejections: { increment: 1 } } : { interviews: { increment: 1 } };
            await prisma.performanceMetrics.update({
                where: { userId_platformName: { userId: email, platformName: platformName } },
                data: incrementField
            });
        }
        res.json(updatedRecord);
    } catch (error) {
        console.error("Error updating application record:", error);
        res.status(500).json({ error: "Error updating application record" });
    }
});

app.post("/api/deleteRecord", async (req, res) => {
    const { email, id, platformName } = req.body;
    try {
        const recordToDelete = await prisma.Application.findUnique({
            where: { userId_jobListingId: { userId: email, jobListingId: id } }
        });

        if (!recordToDelete) {
            return res.status(404).json({ error: "Record not found" });
        }

        await prisma.Application.delete({
            where: { userId_jobListingId: { userId: email, jobListingId: id } }
        });

      

        res.json({ message: "Record deleted and metrics updated" });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: "Error deleting record" });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token', { path: '/', secure: true, httpOnly: true, sameSite: 'None' });
    return res.status(200).json({ message: "Logged out successfully" });
});

// Example of a protected route
app.get('/api/protected', requireAuth, (req, res) => {
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});

app.post('/api/application', async (req, res) => {
    const { email, jobId, status, dateApplied, dateUpdated, notes, jobTitle, employer_name, apply_link, publisher } = req.body;

    try {
        await prisma.platformName.upsert({
            where: { platformName: publisher },
            update: {},
            create: { platformName: publisher, createdDate: new Date() }
        });

        const newApplication = await prisma.application.create({
            data: {
                userId: email,
                jobListingId: jobId,
                status,
                dateApplied: new Date(dateApplied),
                dateUpdated: dateUpdated ? new Date(dateUpdated) : null,
                notes: notes || null,
                jobName: jobTitle,
                companyName: employer_name,
                jobLink: apply_link,
                platformName: publisher
            }
        });

        await prisma.performanceMetrics.upsert({
            where: { userId_platformName: { userId: email, platformName: publisher } },
            update: { jobsApplied: { increment: 1 } },
            create: { userId: email, platformName: publisher, totalJobsViewed: 0, jobsApplied: 1, rejections: 0, interviews: 0 }
        });

        return res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error creating application:", error);
        return res.status(500).json({ error: "Failed to insert or update application." });
    }
});

app.get('/', (req, res) => {
    res.send('API is working 🚀');
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});