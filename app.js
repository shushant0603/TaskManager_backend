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
app.use(
    cors({
        origin: 'https://taskmanager-frontend-cb8p.onrender.com', // Replace with your frontend URL
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