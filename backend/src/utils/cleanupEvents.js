import cron from 'node-cron';
import Event from '../models/event.model.js';



export const scheduleOldEventCleanup = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      const result = await Event.deleteMany({ event_date: { $lt: now } });

      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired events.`);
      }
    } catch (error) {
      console.error('Failed to clean up old events:', error);
    }
  });

  console.log('Old event cleanup job scheduled (runs daily at midnight)');
};
