// Manual cleanup script for old events
// Run this with: node src/scripts/cleanup.js

import 'dotenv/config';
import connectDB from '../db/db.js';
import { cleanupOldEvents } from '../utils/cleanupEvents.js';

const runCleanup = async () => {
  try {
    console.log('🚀 Starting manual cleanup...');
    
    // Connect to database
    await connectDB();
    
    // Run cleanup
    const deletedCount = await cleanupOldEvents();
    
    console.log(`✅ Cleanup completed! Deleted ${deletedCount} old events.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

runCleanup();