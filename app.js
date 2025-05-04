import express from 'express';
import {connectDB}from './src/lib/db.js'; // Import the database connection

import authRoutes from './src/routes/auth.routes.js'; // Import the auth routes
import taskRoutes from './src/routes/task.routes.js'; // Import the task routes
import cors from 'cors'; // Import CORS middleware
import cookieParser from 'cookie-parser';




const app=express();
app.use(cookieParser());

import dotenv from 'dotenv';
dotenv.config();

connectDB();
app.use(express.json());

// Dynamically set the origin based on the environment
const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://taskmanager-frontend-cb8p.onrender.com' // Production origin
    : 'http://localhost:5173';
app.use(
    cors({
        //origin: 'https://taskmanager-frontend-cb8p.onrender.com',
  
        origin: allowedOrigin,
        credentials: true,
    })
)
app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);
app.get('/', (req, res) => {
    res.send('API is running...');
}
);
const PORT = process.env.PORT || 5000; // Changed to match frontend expectation
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 