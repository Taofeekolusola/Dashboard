const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db')

// Import routes
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Use routes
app.use('/users', userRoutes);

// connect port from .env
const port = process.env.PORT || 5000;

// APP LISTENS ON 
app.listen(port, () => console.log(`Server running on port ${port}`));