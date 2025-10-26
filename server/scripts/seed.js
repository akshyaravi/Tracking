require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const JobRole = require('../models/JobRole');
const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await ActivityLog.deleteMany({});
    await Application.deleteMany({});
    await JobRole.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data...');
    
    // Verify users are deleted
    const userCount = await User.countDocuments();
    console.log('Users remaining after delete:', userCount);

    // Create users with correct passwords
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1234567890'
        }
      },
      {
        username: 'bot',
        email: 'bot@demo.com',
        password: 'bot123',
        role: 'bot',
        profile: {
          firstName: 'Bot',
          lastName: 'Mimic',
          phone: '+1234567891'
        }
      },
      {
        username: 'applicant1',
        email: 'user@demo.com',
        password: 'user123',
        role: 'applicant',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567892'
        }
      }
    ]);

    console.log('Created users...');

    const [admin, bot, applicant1] = users;

    // Create job roles
    const jobRoles = await JobRole.create([
      {
        title: 'Senior Software Engineer',
        description: 'Full-stack development with React and Node.js',
        department: 'Engineering',
        type: 'technical',
        requirements: ['React', 'Node.js', 'MongoDB', '5+ years experience'],
        createdBy: admin._id
      },
      {
        title: 'Marketing Manager',
        description: 'Digital marketing and campaign management',
        department: 'Marketing',
        type: 'non-technical',
        requirements: ['Marketing experience', 'Campaign management', 'Analytics'],
        createdBy: admin._id
      }
    ]);

    console.log('Created job roles...');

    // Create applications
    const applications = await Application.create([
      {
        applicant: applicant1._id,
        jobRole: jobRoles[0]._id,
        status: 'applied',
        resume: 'https://example.com/resume1.pdf',
        experience: 6,
        skills: ['React', 'Node.js', 'MongoDB'],
        expectedSalary: 120000,
        availableFrom: new Date('2024-01-15')
      }
    ]);

    console.log('Created applications...');

    // Create activity logs
    await ActivityLog.create({
      application: applications[0]._id,
      action: 'Application submitted',
      newStatus: 'applied',
      performedBy: applicant1._id,
      performedByRole: 'applicant'
    });

    console.log('Created activity logs...');
    console.log('\n=== SEEDING COMPLETED ===');
    console.log('\nSample credentials:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('Bot: bot@demo.com / bot123');
    console.log('Applicant: user@demo.com / user123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedDatabase();
});