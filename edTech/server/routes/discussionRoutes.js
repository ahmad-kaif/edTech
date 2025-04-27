import express from 'express';
import { createDiscussionPost, getDiscussionPosts, getDiscussionPostById, addReplyToPost, startDiscussion } from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new discussion post (Private)
router.post('/', protect, createDiscussionPost);

// Get all discussion posts (Public)
router.get('/', getDiscussionPosts);

// Get a single discussion post by ID (Public)
router.get('/:id', getDiscussionPostById);

// Add a reply to a specific post (Private)
router.post('/:id/replies', protect, addReplyToPost);

router.post('/start', protect, startDiscussion)

export default router;
