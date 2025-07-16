import React, { useEffect, useState } from "react";
import { API } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { useAuthStore } from "../store/useAuth";

const ManageEvents = () => {
  const { authUser } = useAuthStore();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }
    fetchMyEvents();
  }, [authUser]);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events/admin/my-events");
      setEvents(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch events");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage My Events</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/create-event")}
        >
          Post New Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No events posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="relative group">
              <EventCard {...event} />

              <button
                className="absolute top-2 right-2 bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                onClick={() => navigate(`/events/edit/${event._id}`)}
              >
                Edit Event
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
