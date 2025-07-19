import React, { useEffect, useState } from "react";
import { API } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { useAuthStore } from "../store/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await API.delete(`/events/admin/${id}`);
      toast.success("Event deleted successfully");
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-0 bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
            🛠️ Manage My Events
          </h1>
          <button
            className="bg-white text-black font-semibold px-5 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-lg"
            onClick={() => navigate("/create-event")}
          >
            + Post New Event
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-400 text-lg text-center mt-20">No events posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="relative group rounded-xl overflow-hidden shadow-lg">
                <EventCard
                  id={event._id}
                  title={event.title}
                  club_name={event.club_name}
                  thumbnail={event.thumbnail}
                />

                {/* Action buttons overlay */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/events/edit/${event._id}`)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
