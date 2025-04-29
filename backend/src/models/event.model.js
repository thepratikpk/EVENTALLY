import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        event_name: {
            type: String,
            required: true
        },
        event_date: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        domains: [{ type: String }]  // Array to store event domains
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;