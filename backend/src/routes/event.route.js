import { Router } from "express";
import { createEvent, getAllEvents, getEventById, getEventsByUserInterests, getMyPostedEvents, updateEventDetails, updateEventThumbnail, } from "../controllers/event.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
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

router.route('/').get(getAllEvents)
router.route('/interests').get(verifyJWT, getEventsByUserInterests);
router.route('/:id').get(getEventById)

// secured
router.use(verifyJWT)
// router.route('/interests').get(getEventsByUserInterests)

// admin 

router.route('/admin').post(
    authorizeRoles('admin','superadmin'),
    upload.fields([{
    name: "thumbnail",
    maxCount: 1
}]), createEvent)

router.route('/admin/my-events').get(authorizeRoles('admin', 'superadmin'),getMyPostedEvents)

router.route('/admin/:id/details').patch(updateEventDetails)

router.route('/admin/:id/thumbnail').patch(upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    }
]),updateEventThumbnail)


export default router