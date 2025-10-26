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
    origin: [
        'https://tracking-frontend-ashen.vercel.app',
        'https://tracking-mu-six.vercel.app', 
        'https://tracking-yr4b.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));


app.options('*', cors(corsOptions));


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

    // Handle CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            message: 'CORS policy blocked the request',
            error: 'Origin not allowed'
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
  
  // Start automated scheduler
  startScheduler();
});

module.exports = app;