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
import superAdminRoutes from './routes/superAdminRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import seedSuperAdmin from './seeder/superAdminSeeder.js';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import attendanceRoutes from './routes/attendanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Seed Super Admin after DB connection
  seedSuperAdmin();
});

const app = express();

// Security HTTP headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS Config - Must be before rate limit so blocked requests still get CORS headers
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // Increased limit for development
});
app.use('/api/', limiter);

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
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      process.env.CLIENT_URL,
      'https://mutexv-1-1.onrender.com',
      'https://mutexv-1.vercel.app'
    ].filter(Boolean),
    credentials: true,
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('join_student_room', (studentId) => {
    socket.join(`student_${studentId}`);
  });

  socket.on('join_college_room', (collegeName) => {
    socket.join(`college_${collegeName}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
