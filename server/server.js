import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Environment Variables Configuration
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.static('.'));
app.use(express.json());
app.use(cookieParser());

// // LiveKit server configuration
// const livekitHost = process.env.LIVEKIT_HOST || 'wss://play-um2ffagk.livekit.cloud';
// const apiKey = process.env.LIVEKIT_API_KEY || 'your_api_key';
// const apiSecret = process.env.LIVEKIT_API_SECRET || 'your_api_secret';

// // Initialize RoomServiceClient
// const roomServiceClient = new RoomServiceClient(
//   livekitHost,
//   apiKey,
//   apiSecret
// );

// // Track room metadata in memory
// const roomsMetadata = new Map();

// // Check for missing API keys
// if (!apiKey || !apiSecret) {
//   console.error('Missing LiveKit API credentials. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables.');
//   process.exit(1);
// }

// router.post('/:classId/start-live-session', startLiveSession);

// // API endpoint to check if a room exists
// app.post('/check-room', async (req, res) => {
//   const { roomName } = req.body;

//   if (!roomName) {
//     return res.status(400).json({ error: 'Missing room name' });
//   }

//   try {
//     // Check if we have metadata for this room
//     if (roomsMetadata.has(roomName)) {
//       return res.json({ exists: true });
//     }

//     // Check with LiveKit if the room exists
//     const rooms = await roomServiceClient.listRooms();
//     const roomExists = rooms.some(room => room.name === roomName);

//     return res.json({ exists: roomExists });
//   } catch (error) {
//     console.error('Error checking room:', error);
//     res.status(500).json({ error: 'Failed to check room: ' + error.message });
//   }
// });

// // API endpoint to set room metadata
// app.post('/set-room-metadata', async (req, res) => {
//   const { roomName, metadata } = req.body;

//   if (!roomName || !metadata) {
//     return res.status(400).json({ error: 'Missing room name or metadata' });
//   }

//   try {
//     // Store room metadata
//     roomsMetadata.set(roomName, metadata);
//     console.log(`Set metadata for room ${roomName}:`, metadata);

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error setting room metadata:', error);
//     res.status(500).json({ error: 'Failed to set room metadata: ' + error.message });
//   }
// });

// // API endpoint to end a room
// app.post('/end-room', async (req, res) => {
//   const { roomName, participantId } = req.body;

//   if (!roomName || !participantId) {
//     return res.status(400).json({ error: 'Missing room name or participant ID' });
//   }

//   try {
//     // Verify that the requester is the room creator
//     if (roomsMetadata.has(roomName)) {
//       const metadata = JSON.parse(roomsMetadata.get(roomName));

//       if (metadata.creatorId !== participantId) {
//         return res.status(403).json({
//           error: 'Only the room creator can end the room'
//         });
//       }
//     } else {
//       return res.status(404).json({
//         error: 'Room not found'
//       });
//     }

//     // End the room in LiveKit
//     await roomServiceClient.deleteRoom(roomName);

//     // Remove room metadata
//     roomsMetadata.delete(roomName);

//     console.log(`Room ${roomName} ended by ${participantId}`);
//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error ending room:', error);
//     res.status(500).json({ error: 'Failed to end room: ' + error.message });
//   }
// });

// // API endpoint to create access token
// app.post('/get-token', async (req, res) => {
//   const { roomName, participantName, isRoomCreator } = req.body;

//   if (!roomName || !participantName) {
//     return res.status(400).json({ error: 'Missing room name or participant name' });
//   }

//   try {
//     // Create access token with the API key and secret
//     const at = new AccessToken(apiKey, apiSecret, {
//       identity: participantName,
//       ttl: 3600 * 24, // 24 hours in seconds
//     });

//     // Add grant for the room
//     at.addGrant({
//       roomJoin: true,
//       room: roomName,
//       canPublish: true,
//       canSubscribe: true,
//       canPublishData: true,
//       canUpdateOwnMetadata: true,
//       // Set room admin privileges for the creator
//       roomAdmin: isRoomCreator,
//     });

//     // Generate token
//     const token = await Promise.resolve(at.toJwt());

//     // Log for debugging
//     console.log('Room Name:', roomName);
//     console.log('Participant Name:', participantName);
//     console.log('Is Room Creator:', isRoomCreator);
//     console.log('Generated Token:', token);

//     // Send response
//     res.json({
//       token: token,
//       url: livekitHost
//     });
//   } catch (error) {
//     console.error('Error generating token:', error);
//     res.status(500).json({ error: 'Failed to generate token: ' + error.message });
//   }
// });

// Import routes
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classRoutes);

// Database connection and server startup
import connectDB from './config/connectDB.js';

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
