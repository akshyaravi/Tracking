const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  previousStatus: String,
  newStatus: String,
  comment: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performedByRole: {
    type: String,
    enum: ['applicant', 'bot', 'admin'],
    required: true
  },
  isAutomated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);