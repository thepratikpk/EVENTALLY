import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { scheduleOldEventCleanup } from './utils/cleanupEvents.js';


const app=express();

// app.use(cors({
//     origin:process.env.CORS_ORIGIN || 'http://localhost:5173',
//     credentials:true
// }))
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_ORIGIN
    : process.env.DEV_ORIGIN;

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

scheduleOldEventCleanup();

import authRouter from './routes/auth.route.js'
import eventRouter from './routes/event.route.js'

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/events',eventRouter)

export {app}