const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'non-technical'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobRole', jobRoleSchema);