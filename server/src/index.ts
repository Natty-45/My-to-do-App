import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db';

import todoRoutes from './routes/todo.routes'
import authRoutes from './routes/auth.route'


const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json())

app.use('/api/to-do', todoRoutes);
app.use('/api/auth', authRoutes);

const stratServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
});
    } catch (error) {
         console.error(' Failed to start server:', error);
         process.exit(1);
    }
};

stratServer();

