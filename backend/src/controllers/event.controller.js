import Event from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, getPublicIdFromUrl, uploadOnCloudinary } from "../utils/coudinary.js";
import { clearEventCache } from "../middleware/cache.middleware.js";
import { cleanupOldEvents } from "../utils/cleanupEvents.js";

// OLD

// export const getAllEvents = async (req, res) => {
//     try {
//         console.log("Attempting to fetch events from database...");
//         const events = await Event.find();
//         console.log("Database connection successful");
//         console.log("Number of events found:", events.length);

//         events.forEach(event => {
//             console.log(`Event: ${event.event_name}`);
//             console.log(`Domains: ${JSON.stringify(event.domains)}`);
//             console.log('---');
//         });

//         if (events.length === 0) {
//             console.log("No events found in database");
//         }

//         res.status(200).json(events);
//     } catch (error) {
//         console.error("❌ Error fetching events:", error);
//         res.status(500).json({ error: "An error occurred while fetching events." });
//     }
// };
// export const getEventById = async (req, res) => {
//     try {
//         const event = await Event.findById(req.params.id);
//         if (!event) return res.status(404).json({ error: "Event not found" });
//         res.status(200).json(event);
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching event" });
//     }
// };

// export const getEventsByDomain = async (req, res) => {
//     try {
//         const events = await Event.find({ domains: req.params.domain });
//         res.status(200).json(events);
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching events" });
//     }
// };

// export const registerForEvent = async (req, res) => {
//     try {
//         const event = await Event.findById(req.params.id);
//         if (!event) return res.status(404).json({ error: "Event not found" });

//         // Simulated user registration (extendable with user model)
//         res.status(200).json({ message: "User registered successfully", event });
//     } catch (error) {
//         res.status(500).json({ error: "Error registering for event" });
//     }
// };
// export const updateEvent = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { event_name, event_date, venue, time, title, domains } = req.body;

//         const updatedEvent = await Event.findByIdAndUpdate(
//             id,
//             {
//                 event_name,
//                 event_date,
//                 venue,
//                 time,
//                 title,
//                 domains: domains.split(',').map(domain => domain.trim()) // Ensure it's an array
//             },
//             { new: true }
//         );

//         if (!updatedEvent) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
//     } catch (error) {
//         console.error("Error updating event:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// export const createEvent = async (req, res) => {
//     try {
//         const { event_name, event_date, venue, time, title, domains } = req.body;

//         if (!event_name || !event_date || !venue || !time || !title || !domains) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const newEvent = new Event({
//             event_name,
//             event_date,
//             venue,
//             time,
//             title,
//             domains: domains.split(',').map(domain => domain.trim()) // Ensure it's an array
//         });

//         await newEvent.save();
//         res.status(201).json({ message: "Event created successfully", event: newEvent });
//     } catch (error) {
//         console.error("Error creating event:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// export const deleteEvent = async (req, res) => {
//     try {
//         const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//         if (!deletedEvent) return res.status(404).json({ error: "Event not found" });

//         res.status(200).json({ message: "Event deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error deleting event" });
//     }
// };


// NEW 

const getAllEvents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter for public events
    const query = {};
    const now = new Date();

    // Only show future events (events that haven't passed yet)
    query.event_date = { $gte: now };

    const [events, totalCount] = await Promise.all([
        Event.find(query)
            .select('event_name title description event_date time venue domains thumbnail club_name registration_link')
            .sort({ event_date: 1 })
            .skip(skip)
            .limit(limit)
            .lean(), // Use lean() for better performance
        Event.countDocuments(query)
    ]);

    if (!events) {
        throw new ApiError(400, "Failed to fetch events")
    }

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res
        .status(200)
        .json(new ApiResponse(200, {
            events,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage,
                hasPrevPage,
                limit
            }
        }, "Events fetched successfully"))
})

const getEventsByUserInterests = asyncHandler(async (req, res) => {
    const userInterests = req.user.interests
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userInterests || userInterests.length === 0) {
        throw new ApiError(400, "User has no interests defined")
    }

    const now = new Date();
    const query = {
        domains: { $in: userInterests },
        event_date: { $gte: now }
    };

    const [events, totalCount] = await Promise.all([
        Event.find(query)
            .select('event_name title description event_date time venue domains thumbnail club_name registration_link')
            .sort({ event_date: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Event.countDocuments(query)
    ]);

    if (!events) {
        throw new ApiError(400, "Events not fetched according to interest")
    }

    const totalPages = Math.ceil(totalCount / limit);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            events,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        }, "Events matching with interests fetched"))
})


const createEvent = asyncHandler(async (req, res) => {
    const { club_name, event_name, title,
        description, event_date, time, venue, domains,
        registration_link } = req.body

    if (
        !event_name ||
        !title ||
        !event_date ||
        !time ||
        !venue ||
        !Array.isArray(domains) ||
        domains.length === 0
    ) {
        throw new ApiError(400, "All required fields must be provided");
    }

    let fullEventDate;
    try {
        fullEventDate = new Date(`${event_date} ${time}`);

        if (isNaN(fullEventDate.getTime())) {
            throw new ApiError(400, "Invalid event date or time format provided.");
        }
    } catch (parseError) {
        throw new ApiError(400, "Error parsing event date/time: " + parseError.message);
    }

    const localThumbnailPath = req.files?.thumbnail?.[0]?.path
    const thumbnail = await uploadOnCloudinary(localThumbnailPath)

    const event = await Event.create({
        club: req.user._id,
        club_name: club_name || req.user.fullname,
        event_name,
        title,
        description,
        event_date: fullEventDate,
        time,
        venue,
        domains,
        registration_link,
        thumbnail: thumbnail?.secure_url || "",
        isApproved: true  // Auto-approve all events
    })

    // Clear cache when new event is created
    clearEventCache();

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event is Created"))
})

const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (!event) {
        throw new ApiError(400, "Id of event is not fetched")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event is fetched by id"))

})

const updateEventDetails = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {
        event_name,
        title,
        description,
        event_date, // This is the date string
        time,       // This is the time string
        venue,
        domains,
        registration_link,
    } = req.body;

    const existingEvent = await Event.findById(id)

    if (existingEvent.club.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this event");
    }

    // --- IMPORTANT CHANGE HERE ---
    let updatedFullEventDate;
    if (event_date && time) { // Only attempt to parse if both are provided
        try {
            updatedFullEventDate = new Date(`${event_date} ${time}`);
            if (isNaN(updatedFullEventDate.getTime())) {
                throw new ApiError(400, "Invalid event date or time format provided for update.");
            }
        } catch (parseError) {
            throw new ApiError(400, "Error parsing event date/time for update: " + parseError.message);
        }
    }
    // --- END IMPORTANT CHANGE ---

    const updateFields = {
        event_name,
        title,
        description,
        time,
        venue,
        registration_link,
        domains,
        isApproved: true,  // Auto-approve all events
    };

    if (updatedFullEventDate) {
        updateFields.event_date = updatedFullEventDate; // <--- Use this combined Date object
    }


    const updatedEvent = await Event.findByIdAndUpdate(id, {
        $set: updateFields
    },
        {
            new: true, runValidators: true
        }
    )

    // Clear cache when event is updated
    clearEventCache();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedEvent, "Event details updated successfully"))

})

const updateEventThumbnail = asyncHandler(async (req, res) => {
    const { id } = req.params


    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.club.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this event's thumbnail");
    }

    const localThumbnailPath = req.files?.thumbnail?.[0]?.path
    if (!localThumbnailPath) {
        throw new ApiError(400, "No thumbnail file provided");
    }

    //   deleting old image from cloudinary

    if (event.thumbnail) {
        const publicId = getPublicIdFromUrl(event.thumbnail)
        if (!publicId) {
            throw new ApiError(400, "PublicId not obtained")
        }
        await deleteFromCloudinary(publicId)
    }

    // upload new image

    const updatedthumbnail = await uploadOnCloudinary(localThumbnailPath)

    event.thumbnail = updatedthumbnail.secure_url
    await event.save({ validateBeforeSave: false })

    // Clear cache when thumbnail is updated
    clearEventCache();

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Thumbnail updated successfully"));



})

const getMyPostedEvents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { club: req.user._id };

    const [events, totalCount] = await Promise.all([
        Event.find(query)
            .select('event_name title description event_date time venue domains thumbnail registration_link')
            .sort({ event_date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Event.countDocuments(query)
    ]);

    if (!events) {
        throw new ApiError(400, "My posted events not fetched")
    }

    const totalPages = Math.ceil(totalCount / limit);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            events,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        }, 'Your posted events fetched successfully'))
})

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Ensure the user owns the event
    if (event.club.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this event");
    }

    // Delete the thumbnail from Cloudinary if exists
    if (event.thumbnail) {
        const publicId = getPublicIdFromUrl(event.thumbnail);
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    await event.deleteOne();

    // Clear cache when event is deleted
    clearEventCache();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Event deleted successfully"));
});

const cleanupExpiredEvents = asyncHandler(async (req, res) => {
    const deletedCount = await cleanupOldEvents();

    // Clear cache after cleanup
    clearEventCache();

    return res
        .status(200)
        .json(new ApiResponse(200, { deletedCount }, `Cleanup completed. Deleted ${deletedCount} expired events.`));
});



export {
    getAllEvents,
    getEventsByUserInterests,
    createEvent,
    updateEventDetails,
    updateEventThumbnail,
    getMyPostedEvents,
    getEventById,
    deleteEvent,
    cleanupExpiredEvents
}