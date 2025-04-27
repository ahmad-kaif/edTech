import express from 'express';
import { generateToken, createRoom, deleteRoom } from '../controllers/livekitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate token for joining a room
router.post('/token', protect, generateToken);

// Create a new room (mentor only)
router.post('/room', protect, createRoom);

// Delete a room (mentor only)
router.delete('/room/:roomName', protect, deleteRoom);

export default router; 