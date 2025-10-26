require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpecs = require('./config/swagger');
const { startScheduler } = require('./config/scheduler');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const jobRoleRoutes = require('./routes/jobRoles');
const botRoutes = require('./routes/bot');

const app = express();

connectDB();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://tracking-frontend-ashen.vercel.app',
            'https://tracking-mu-six.vercel.app', 
            'https://tracking-yr4b.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080'
        ];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept', 
        'Origin',
        'Access-Control-Allow-Headers'
    ],
    optionsSuccessStatus: 200,
    maxAge: 86400
};

// Handle preflight requests manually first
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        const origin = req.headers.origin;
        const allowedOrigins = [
            'https://tracking-frontend-ashen.vercel.app',
            'https://tracking-mu-six.vercel.app', 
            'https://tracking-yr4b.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080'
        ];
        
        if (origin && allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
        return res.status(200).json({});
    }
    next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/bot', botRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Hybrid Application Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint for CORS
app.get('/api/test-cors', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            message: 'CORS policy blocked the request',
            error: 'Origin not allowed',
            yourOrigin: req.headers.origin
        });
    }

    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    
    startScheduler();
});

module.exports = app;