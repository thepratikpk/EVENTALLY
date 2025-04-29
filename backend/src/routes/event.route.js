import express from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventsByDomain, registerForEvent, updateEvent } from "../controllers/event.controller.js";
const router =express.Router()


/*  Public Routes */
router.get("/", getAllEvents);       // Fetch all events
router.get("/:id", getEventById);     // Fetch event by ID
router.get("/domain/:domain", getEventsByDomain); // Fetch events by domain
router.post("/register/:id", registerForEvent);  // Register for event

/*  Admin Routes */
router.post("/admin", createEvent);      // Create an event
router.put("/admin/:id", updateEvent);    // Update an event
router.delete("/admin/:id", deleteEvent); // Delete an event

export default router