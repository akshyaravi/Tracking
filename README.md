# Hybrid Application Tracking System

A comprehensive MERN stack application for managing job applications with both automated (technical roles) and manual (non-technical roles) tracking capabilities.

## 🚀 Features

### Role-Based Authentication & Dashboards
- **JWT-based authentication** with username/email + password
- **Three distinct roles**: Applicant, Bot Mimic, Admin
- **Role-specific dashboards** with insights, charts, and statistics
- **Access control** ensuring users only see relevant applications

### Application Management
- **Create and track applications** for different job roles
- **Complete traceability** with timestamped activity logs
- **Status progression** through workflow stages
- **Comments and notes** for each status change

### Bot Mimic (Automated Updates)
- **Simulates automated tracking** for technical role applications
- **Progresses applications** through stages: Applied → Reviewed → Interview → Offer
- **Generates timestamped logs** marked as "Bot Mimic"
- **On-demand or scheduled processing** every 30 minutes
- **Only processes technical roles**, ignores non-technical applications

### Admin Manual Updates
- **Create and manage job roles** for accepting applications
- **Manual status updates** for non-technical role applications
- **Add comments and notes** for audit trail
- **Dashboard metrics** and application management

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **node-cron** for scheduled tasks
- **Swagger** for API documentation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HybridApplicationTracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Configuration

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hybrid-tracker
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Database Setup

Ensure MongoDB is running locally or update the `MONGODB_URI` with your cloud database connection string.

### 5. Start the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

#### Individual Servers
```bash
# Start backend server (port 5000)
npm run server

# Start frontend server (port 3000)
npm run client
```

## 🌐 API Documentation

### Swagger UI
Access the interactive API documentation at: `http://localhost:5000/api-docs`

### Sample API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

#### Applications
- `POST /api/applications` - Create new application (Applicant only)
- `GET /api/applications` - Get applications (role-based access)
- `GET /api/applications/:id` - Get single application with activity log
- `PUT /api/applications/:id/status` - Update application status (Admin/Bot only)
- `GET /api/applications/stats` - Get dashboard statistics

#### Job Roles
- `POST /api/job-roles` - Create job role (Admin only)
- `GET /api/job-roles` - Get all job roles
- `GET /api/job-roles/:id` - Get single job role
- `PUT /api/job-roles/:id` - Update job role (Admin only)
- `DELETE /api/job-roles/:id` - Delete job role (Admin only)

#### Bot Operations
- `POST /api/bot/process` - Process automated updates
- `GET /api/bot/activity` - Get bot activity summary
- `POST /api/bot/trigger/:applicationId` - Manually trigger update for specific application

## 👥 Sample User Credentials

### Admin User
- **Email**: admin@demo.com
- **Password**: admin123
- **Capabilities**: Create job roles, manage all applications, view all statistics

### Bot User
- **Email**: bot@demo.com
- **Password**: bot123
- **Capabilities**: Process technical applications automatically, view bot activity

### Applicant User
- **Email**: user@demo.com
- **Password**: user123
- **Capabilities**: Create applications, track own application status

## 🏗 Architecture Overview

### Backend Structure
```
server/
├── config/          # Database and configuration files
├── controllers/     # Business logic handlers
├── middleware/      # Authentication and validation
├── models/          # MongoDB schemas
├── routes/          # API route definitions
└── index.js         # Main server file
```

### Frontend Structure
```
client/src/
├── components/      # Reusable UI components
├── context/         # React context providers
├── pages/           # Page components
├── services/        # API service layer
├── utils/           # Utility functions
└── App.jsx          # Main application component
```

### Database Schema

#### Users Collection
- Authentication credentials and profile information
- Role-based access control (applicant, bot, admin)

#### JobRoles Collection
- Job posting information
- Technical vs non-technical classification
- Created by admin users

#### Applications Collection
- Application details and current status
- Links to user and job role
- Automation flag for technical roles

#### ActivityLogs Collection
- Complete audit trail of all actions
- Timestamps and performer information
- Automated vs manual action tracking

## 🔄 Workflow

### Application Lifecycle

1. **Admin creates job roles** (technical/non-technical)
2. **Applicants submit applications** for available roles
3. **Automated processing** (technical roles):
   - Bot processes applications every 30 minutes
   - Progresses through: Applied → Reviewed → Interview → Offer
   - Generates automated activity logs
4. **Manual processing** (non-technical roles):
   - Admin manually updates application status
   - Adds comments and notes for each change
5. **Complete traceability** maintained for all actions

### Bot Automation Logic

- **Scheduled Processing**: Runs every 30 minutes automatically
- **Random Progression**: 70% chance of status advancement
- **Technical Only**: Only processes applications for technical job roles
- **Status Flow**: Applied → Reviewed → Interview → Offer
- **Activity Logging**: All actions logged with "Bot Mimic" identifier

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB cloud instance (MongoDB Atlas)
2. Configure environment variables
3. Deploy the server directory
4. Ensure proper CORS configuration for frontend domain

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

## 📊 Features Implemented

- ✅ Role-based authentication with JWT
- ✅ Responsive mobile-first design
- ✅ Interactive dashboards with charts
- ✅ Complete application lifecycle management
- ✅ Automated bot processing for technical roles
- ✅ Manual admin management for non-technical roles
- ✅ Full audit trail and activity logging
- ✅ Scheduled automated processing
- ✅ API documentation with Swagger
- ✅ Modular component architecture
- ✅ Error handling and validation

