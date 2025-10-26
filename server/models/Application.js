const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRole',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'interview', 'offer', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  resume: {
    type: String, // URL or file path
    required: true
  },
  coverLetter: String,
  experience: Number, // years of experience
  skills: [String],
  expectedSalary: Number,
  availableFrom: Date,
  isAutomated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);