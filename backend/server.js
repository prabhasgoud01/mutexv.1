import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS Config
app.use(
  cors({
    origin: [
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      process.env.CLIENT_URL,
      'https://mutexv-1-1.onrender.com',
      'https://mutexv-1.vercel.app'
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Temporary Health Check Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Working"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
