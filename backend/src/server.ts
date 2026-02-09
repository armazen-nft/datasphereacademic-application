import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moltbook_academic';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     MOLTBOOK ACADEMIC NETWORK - AI VALIDATION SYSTEM         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  Server running on port: ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV || 'development'}                    ║
║  Database: MongoDB                                           ║
║                                                              ║
║  Endpoints:                                                  ║
║  - API: http://localhost:${PORT}/api                           ║
║  - Health: http://localhost:${PORT}/api/health                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  });
}

startServer();

export default app;
