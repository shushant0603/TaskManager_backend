import express from 'express';
// import { Router } from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/validate', authenticateToken, (req, res) => {
    res.status(200).json(req.user);
});

export default router