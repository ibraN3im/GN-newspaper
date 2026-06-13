import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import usersRoutes from './routes/users.js';
import mediaRoutes from './routes/media.js';
import settingsRoutes from './routes/settings.js';
import statsRoutes from './routes/stats.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3009',
    'https://ghalaba-admins-panel.vercel.app',
    'https://gn-gamma.vercel.app',
    'https://al-galaba.vercel.app',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check exact match
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any Vercel deployment (*.vercel.app)
        if (/\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }

        callback(null, false);
    },
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Galaba News API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            articles: '/api/articles',
            users: '/api/users',
            media: '/api/media',
            settings: '/api/settings',
            stats: '/api/stats'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'GN API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
