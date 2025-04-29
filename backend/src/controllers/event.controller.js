import Event from "../models/event.model.js";

export const getAllEvents = async (req, res) => {
    try {
        console.log("Attempting to fetch events from database...");
        const events = await Event.find();
        console.log("Database connection successful");
        console.log("Number of events found:", events.length);
        
        events.forEach(event => {
            console.log(`Event: ${event.event_name}`);
            console.log(`Domains: ${JSON.stringify(event.domains)}`);
            console.log('---');
        });
        
        if (events.length === 0) {
            console.log("No events found in database");
        }
        
        res.status(200).json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "An error occurred while fetching events." });
    }
};
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Error fetching event" });
    }
};

export const getEventsByDomain = async (req, res) => {
    try {
        const events = await Event.find({ domains: req.params.domain });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
};

export const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Simulated user registration (extendable with user model)
        res.status(200).json({ message: "User registered successfully", event });
    } catch (error) {
        res.status(500).json({ error: "Error registering for event" });
    }
};
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { event_name, event_date, venue, time, title, domains } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                event_name,
                event_date,
                venue,
                time,
                title,
                domains: domains.split(',').map(domain => domain.trim()) // Ensure it's an array
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { event_name, event_date, venue, time, title, domains } = req.body;

        if (!event_name || !event_date || !venue || !time || !title || !domains) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEvent = new Event({
            event_name,
            event_date,
            venue,
            time,
            title,
            domains: domains.split(',').map(domain => domain.trim()) // Ensure it's an array
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ error: "Event not found" });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting event" });
    }
};
