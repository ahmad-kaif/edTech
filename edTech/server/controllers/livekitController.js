import asyncHandler from 'express-async-handler';
import livekitService from '../services/livekitService.js';

// @desc    Generate token for joining a room
// @route   POST /api/livekit/token
// @access  Private
export const generateToken = asyncHandler(async (req, res) => {
    const { roomName, participantName } = req.body;
    const isMentor = req.user.role === 'mentor';

    if (!roomName || !participantName) {
        res.status(400);
        throw new Error('Please provide room name and participant name');
    }

    const token = livekitService.generateToken(roomName, participantName, isMentor);
    
    res.json({
        token,
        roomName,
        participantName
    });
});

// @desc    Create a new room
// @route   POST /api/livekit/room
// @access  Private (Mentor only)
export const createRoom = asyncHandler(async (req, res) => {
    const { roomName } = req.body;

    if (!roomName) {
        res.status(400);
        throw new Error('Please provide a room name');
    }

    if (req.user.role !== 'mentor') {
        res.status(403);
        throw new Error('Only mentors can create rooms');
    }

    await livekitService.createRoom(roomName);
    
    res.json({
        message: 'Room created successfully',
        roomName
    });
});

// @desc    Delete a room
// @route   DELETE /api/livekit/room/:roomName
// @access  Private (Mentor only)
export const deleteRoom = asyncHandler(async (req, res) => {
    const { roomName } = req.params;

    if (req.user.role !== 'mentor') {
        res.status(403);
        throw new Error('Only mentors can delete rooms');
    }

    await livekitService.deleteRoom(roomName);
    
    res.json({
        message: 'Room deleted successfully',
        roomName
    });
}); 