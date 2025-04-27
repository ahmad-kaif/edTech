import express from 'express';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize LiveKit client
if (!process.env.LIVEKIT_HOST || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error('LiveKit environment variables are not properly configured');
}

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

const roomServiceClient = new RoomServiceClient(
    livekitHost,
    apiKey,
    apiSecret
);

// Generate token for joining a room
router.post('/token', protect, async (req, res) => {
    try {
        const { roomName, participantName, isMentor } = req.body;
        
        // Create access token
        const at = new AccessToken(
            apiKey,
            apiSecret,
            {
                identity: participantName,
                ttl: 24 * 60 * 60, // 24 hours
            }
        );

        // Grant permissions based on role
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            canPublishSources: ['camera', 'microphone', 'screen_share'],
        });

        // If mentor, grant additional permissions
        if (isMentor) {
            at.addGrant({
                roomAdmin: true,
                canPublishSources: ['camera', 'microphone', 'screen_share'],
            });
        }

        const token = at.toJwt();

        res.json({ token });
    } catch (error) {
        console.error('Error generating LiveKit token:', error);
        res.status(500).json({ message: 'Failed to generate token' });
    }
});

// Create a new room
router.post('/create-room', protect, async (req, res) => {
    try {
        const { roomName } = req.body;
        
        // Create room
        await roomServiceClient.createRoom({
            name: roomName,
            emptyTimeout: 10 * 60, // 10 minutes
            maxParticipants: 50,
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Failed to create room' });
    }
});

// Delete a room
router.delete('/delete-room/:roomName', protect, async (req, res) => {
    try {
        const { roomName } = req.params;
        
        await roomServiceClient.deleteRoom(roomName);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Failed to delete room' });
    }
});

export default router; 