import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './config/db';

import todoRoutes from './routes/todo.routes';
import authRoutes from './routes/auth.route';
import collectionRoutes from './routes/collection.routes';
import aiRoutes from './routes/ai.routes';

const PORT = process.env.PORT || 5001;

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/to-do', todoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
