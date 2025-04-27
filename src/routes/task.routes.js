import express from 'express';


const router = express.Router();

import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

// Protected routes
router.get('/', authenticateToken, getTasks); // Protect the route
router.post('/', authenticateToken, createTask); // Protect the route
router.put('/:id', authenticateToken, updateTask); // Protect the route
router.delete('/:id', authenticateToken, deleteTask); // Protect the route
router.get('/validate', authenticateToken, (req, res) => {
    res.status(200).json(req.user); // Return user details if token is valid
  });


export default router;
// export default router;
