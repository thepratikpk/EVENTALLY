import { Router } from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventsByUserInterests, getMyPostedEvents, updateEventDetails, updateEventThumbnail, cleanupExpiredEvents } from "../controllers/event.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
const router = Router()


/*  Public Routes */
// router.get("/", getAllEvents);       // Fetch all events
// router.get("/:id", getEventById);     // Fetch event by ID
// router.get("/domain/:domain", getEventsByDomain); // Fetch events by domain
// router.post("/register/:id", registerForEvent);  // Register for event

// /*  Admin Routes */
// router.post("/admin", createEvent);      // Create an event
// router.put("/admin/:id", updateEvent);    // Update an event
// router.delete("/admin/:id", deleteEvent); // Delete an event

router.route('/').get(cacheMiddleware(5 * 60 * 1000), getAllEvents) // Cache for 5 minutes
router.route('/interests').get(verifyJWT, cacheMiddleware(3 * 60 * 1000), getEventsByUserInterests); // Cache for 3 minutes
router.route('/:id').get(cacheMiddleware(10 * 60 * 1000), getEventById) // Cache individual events for 10 minutes

// secured
router.use(verifyJWT)
// router.route('/interests').get(getEventsByUserInterests)

// admin 

router.route('/admin').post(
    authorizeRoles('admin', 'superadmin'),
    upload.fields([{
        name: "thumbnail",
        maxCount: 1
    }]), createEvent)

router.route('/admin/my-events').get(authorizeRoles('admin', 'superadmin'), getMyPostedEvents)

router.route('/admin/:id/details').patch(updateEventDetails)

router.route('/admin/:id/thumbnail').patch(upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    }
]), updateEventThumbnail)

router.route('/admin/:id').delete(authorizeRoles('admin', 'superadmin'), deleteEvent);

// Cleanup route - only for superadmin
router.route('/admin/cleanup').post(authorizeRoles('superadmin'), cleanupExpiredEvents);

export default router