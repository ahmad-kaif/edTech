import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// Log environment variables (without sensitive data)
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('LIVEKIT_HOST:', process.env.LIVEKIT_HOST ? 'Set' : 'Not Set');
console.log('LIVEKIT_API_KEY:', process.env.LIVEKIT_API_KEY ? 'Set' : 'Not Set');
console.log('LIVEKIT_API_SECRET:', process.env.LIVEKIT_API_SECRET ? 'Set' : 'Not Set');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import livekitRoutes from './routes/livekit.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/livekit', livekitRoutes);

app.listen(PORT, ()=> {
    connectDB();
    console.log(`server conect at ${PORT}`)
})
