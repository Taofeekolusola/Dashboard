const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db')


// Connect to MongoDB
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// connect port from .env
const port = process.env.PORT || 5000;

// APP LISTENS ON 
app.listen(port, () => console.log(`Server running on port ${port}`));