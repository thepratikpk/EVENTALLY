import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the club admin user
      required: true,
    },

    club_name: {
      type: String,
      trim: true,
    },

    thumbnail: {
      type: String, // URL of the poster or image
      trim: true,
    },

    event_name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    event_date: {
      type: Date, // better to store actual Date type
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    domains: [
      {
        type: String,
        enum: ['technical', 'cultural', 'sports', 'literary', 'workshop', 'seminar', 'others'],
      },
    ],

    registration_link: {
      type: String,
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // Set true if reviewed by super admin
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
