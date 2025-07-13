import Event from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, getPublicIdFromUrl, uploadOnCloudinary } from "../utils/coudinary.js";

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
    const events = await Event.find().sort({ event_date: 1 })
    if (!events) {
        throw new ApiError(400, "Failed to fetch events")
    }

    console.log("Number of Events:", events.length)

    return res
        .status(200)
        .json(new ApiResponse(200, events, "All evnts are fetches"))
})

const getEventsByUserInterests = asyncHandler(async (req, res) => {
    const userInterests = req.user.interests

    if (!userInterests) {
        throw new ApiError(400, "User has no intersest defined")
    }

    const events = await Event.find({
        domains: {
            $in: userInterests
        }
    })

    if (!events) {
        throw new ApiError(400, "Events not fetched acc to interest")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, events, "Evenets matching with interest fetched"))
})


const createEvent = asyncHandler(async (req, res) => {
    // get details from frontend
    // validation of details
    // get thumbnail form req body
    // upload the thumbnail to cloudinary
    // crete events in db
    // return res

    // 1
    const { club_name, event_name, title,
        description, event_date, time, venue, domains,
        registration_link } = req.body

    // 2
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

    //   3

    const localThumbnailPath = req.files?.thumbnail?.[0]?.path
    // 4
    const thumbnail = await uploadOnCloudinary(localThumbnailPath)
    // 5
    const event = await Event.create({
        club: req.user._id,
        club_name: req.user.fullname,
        event_name,
        title,
        description,
        event_date,
        time,
        venue,
        domains,
        registration_link,
        thumbnail: thumbnail?.url || "",
        isApproved: false

    })

    // 6

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event is Created"))


})


const updateEventDetails = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {
        event_name,
        title,
        description,
        event_date,
        time,
        venue,
        domains,
        registration_link,
    } = req.body;


    const existingEvent = await Event.findById(id)

    if (existingEvent.club.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this event");
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, {
        $set: {
            event_name,
            title,
            description,
            event_date,
            time,
            venue,
            registration_link,
            domains,
            isApproved: false,
        }
    },
        {
            new: true, runValidators: true
        }

    )

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

    event.thumbnail = updatedthumbnail.url
    await event.save({ validateBeforeSave:false })

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Thumbnail updated successfully"));



})
export {
    getAllEvents,
    getEventsByUserInterests,
    createEvent,
    updateEventDetails,
    updateEventThumbnail
}