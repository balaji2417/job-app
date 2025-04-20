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
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // React app's URL
    methods: ['POST', 'GET'],
    credentials: true,  // Allow cookies to be sent with the request
}));

// Secret key for JWT (should be stored in an environment variable in production)
const JWT_SECRET = '][q,s^z4X_J|5c[';

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
        // Attach user info to request object (match the structure in professor's example)
        req.user = decoded; // Attach the decoded user info (email)
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
            console.log("Existing User");
            return res.status(409).json({ message: "Email is already registered. Please use a different email." });
        }
    } catch (error) {
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

    // ADD THIS CHECK: If there's already a valid token for a different user, block login
    const existingToken = req.cookies.token;
    if (existingToken) {
        try {
            const decoded = jwt.verify(existingToken, JWT_SECRET);
            if (decoded.email !== email) {
                return res.status(403).json({ message: "Another user is already logged in. Please logout first." });
            }
        } catch (err) {
            // Token is invalid or expired — allow new login
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { email: true, firstName: true, password: true },
        });

        if (user && user.password === password) {
            const token = generateToken(user);
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

// GET endpoint: Fetch authenticated user's data (using `requireAuth` middleware)
app.get("/api/me", requireAuth, async (req, res) => {
    try {
        // Accessing `req.user.email` to find the authenticated user's data
        const user = await prisma.user.findUnique({
            where: { email: req.user.email },
            select: { email: true, firstName: true }
        });
       
        if (!user) {
            
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching user data" });
    }
});

app.post("/api/getRecords",async (req,res) => {
    const {email} = req.body;
    try
    {
        const records = await prisma.Application.findMany({
            where:{userId:email}
        });
        res.json({records});
        
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching user data" });
    }
});
app.post("/api/updateRecord", async (req, res) => {
    const { email, value, id,platformName } = req.body;  

    try {
        const updatedRecord = await prisma.Application.update({
            where: {
                userId_jobListingId: {
                  userId: email,
                  jobListingId: id
                }
              },  
            data: { status: value } 
        });

        if (value === 'Rejected' || value === 'Selected') {
            // Update UserStats accordingly
            await prisma.performancemetrics.update({
                where: { userId_platformName: { userId, platformName } },
                data: value === 'Rejected'
                    ? { rejections: { increment: 1 } }
                    : { interviews: { increment: 1 } }
            });
        }        
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating user record" });
    }
});

app.post('/api/logout', (req, res) => {
   
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
});

// Example of a protected route
app.get('/api/protected', requireAuth, (req, res) => {
    // This route is protected and requires a valid token
    res.status(200).json({ message: "Protected route accessed", user: req.user });
});

// POST endpoint: Create a new application (with userId passed in the request)


    
  


  app.post('/api/application', async (req, res) => {
    const {
      email,
      jobId,
      status,
      dateApplied,
      dateUpdated,
      notes,
      jobTitle,
      employer_name,
      apply_link,
      publisher
    } = req.body;
  
    try {
      // Step 1: Ensure platformName entry exists in the platformName table
      await prisma.platformName.upsert({
        where: { platformName: publisher },
        update: {}, // no update needed
        create: {
          platformName: publisher,
          createdDate: new Date()
        }
      });
  
      // Step 2: Check if an application exists for this user and platform
      const existingApplication = await prisma.application.findFirst({
        where: {
          userId: email,
          platformName: publisher
        }
      });
  
      if (existingApplication) {
        // Step 3: If application exists, increment jobsApplied in PerformanceMetrics
        await prisma.performanceMetrics.update({
          where: {
            userId_platformName: {
              userId: email,
              platformName: publisher
            }
          },
          data: {
            jobsApplied: {
              increment: 1
            }
          }
        });
  
        return res.status(200).json({ message: "Application already exists. Updated jobsApplied count." });
      }
  
      // Step 4: If application doesn't exist, create a new application
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
  
      // Step 5: Update or create performanceMetrics for this user and platform
      await prisma.performanceMetrics.upsert({
        where: {
          userId_platformName: {
            userId: email,
            platformName: publisher
          }
        },
        update: {
          jobsApplied: {
            increment: 1
          }
        },
        create: {
          userId: email,
          platformName: publisher,
          totalJobsViewed: 0,
          jobsApplied: 1,
          rejections: 0,
          interviews: 0
        }
      });
  
      return res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error inserting/updating application:", error);
      return res.status(500).json({ error: "Failed to insert or update application." });
    }
  });
  





// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
