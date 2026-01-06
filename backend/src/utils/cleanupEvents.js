import cron from 'node-cron';
import Event from '../models/event.model.js';

// Manual cleanup function that can be called anytime
export const cleanupOldEvents = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    console.log(`[${now.toISOString()}] Starting cleanup of events before: ${oneDayAgo.toISOString()}`);
    
    // Only delete events that ended more than 24 hours ago (safer for production)
    const query = { event_date: { $lt: oneDayAgo } };
    
    // Find events that will be deleted (for logging)
    const oldEvents = await Event.find(query).select('event_name event_date').limit(10);
    
    if (oldEvents.length > 0) {
      console.log(`Found ${oldEvents.length} old events to delete (showing first 10):`, 
        oldEvents.map(e => ({ name: e.event_name, date: e.event_date.toISOString() })));
    }
    
    const result = await Event.deleteMany(query);

    if (result.deletedCount > 0) {
      console.log(`✅ [CLEANUP] Successfully deleted ${result.deletedCount} expired events.`);
    } else {
      console.log(`ℹ️ [CLEANUP] No expired events found to delete.`);
    }
    
    return result.deletedCount;
  } catch (error) {
    console.error('❌ [CLEANUP] Failed to clean up old events:', error);
    throw error;
  }
};

// Scheduled cleanup function
export const scheduleOldEventCleanup = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Run cleanup daily at 2 AM (less traffic time)
  cron.schedule('0 2 * * *', async () => {
    console.log('🕛 [SCHEDULED] Running daily cleanup of old events...');
    try {
      await cleanupOldEvents();
    } catch (error) {
      console.error('❌ [SCHEDULED] Daily cleanup failed:', error);
    }
  });

  // In production, run cleanup twice daily; in development, every 6 hours
  const periodicSchedule = isProduction ? '0 2,14 * * *' : '0 */6 * * *'; // 2 AM and 2 PM in prod
  cron.schedule(periodicSchedule, async () => {
    console.log('🕕 [SCHEDULED] Running periodic cleanup of old events...');
    try {
      await cleanupOldEvents();
    } catch (error) {
      console.error('❌ [SCHEDULED] Periodic cleanup failed:', error);
    }
  });

  console.log('📅 Old event cleanup jobs scheduled:');
  console.log(`   - Daily at 2 AM (0 2 * * *)`);
  console.log(`   - Periodic: ${isProduction ? '2 AM and 2 PM daily' : 'Every 6 hours'} (${periodicSchedule})`);
  
  // Run cleanup on startup (with delay for database connection)
  setTimeout(async () => {
    console.log('🚀 [STARTUP] Running initial cleanup...');
    try {
      await cleanupOldEvents();
    } catch (error) {
      console.error('❌ [STARTUP] Initial cleanup failed:', error);
    }
  }, isProduction ? 10000 : 5000); // Wait longer in production
};
