require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpecs = require('./config/swagger');
const { startScheduler } = require('./config/scheduler');

// Import routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const jobRoleRoutes = require('./routes/jobRoles');
const botRoutes = require('./routes/bot');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          'https://tracking-mu-six.vercel.app',
          'https://tracking-ew8ubd9rs-akshyas-projects-8e9b72a3.vercel.app',
          'https://tracking-i144nspbq-akshyas-projects-8e9b72a3.vercel.app',
          'https://tracking-yr4b.vercel.app/api/auth/login',
          'https://tracking-mu-six.vercel.app'
        ]
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  
  // Start automated scheduler
  startScheduler();
});

module.exports = app;