const cron = require('node-cron');
const { processAutomatedUpdates } = require('../controllers/botController');
const User = require('../models/User');

// Schedule automated bot processing every 30 minutes
const startScheduler = () => {
  cron.schedule('*/30 * * * *', async () => {
    try {
      console.log('Running scheduled bot processing...');
      
      // Find bot user for automated processing
      const botUser = await User.findOne({ role: 'bot' });
      if (!botUser) {
        console.log('No bot user found for scheduled processing');
        return;
      }

      // Create mock request object for controller
      const mockReq = { user: botUser };
      const mockRes = {
        json: (data) => console.log('Scheduled processing result:', data),
        status: () => mockRes
      };

      // Process automated updates
      await processAutomatedUpdates(mockReq, mockRes);
    } catch (error) {
      console.error('Scheduled processing error:', error);
    }
  });

  console.log('Bot scheduler started - running every 30 minutes');
};

module.exports = { startScheduler };