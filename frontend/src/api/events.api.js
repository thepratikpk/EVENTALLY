import { API } from "../lib/axios"

const getAllEvents = async (page = 1, limit = 10) => {
    try {
        const res = await API.get(`/events?page=${page}&limit=${limit}`)
        return res.data.data
    } catch (err) {
        console.error("Failed to fetch events", err);
        throw err;
    }
}

const getEventsByUserInterests = async (page = 1, limit = 10) => {
    try {
        const res = await API.get(`/events/interests?page=${page}&limit=${limit}`);
        return res.data?.data;
    } catch (err) {
        console.error("Failed to fetch events by interests", err);
        throw err;
    }
};

const getEventById = async (id) => {
    try {
        const res = await API.get(`/events/${id}`);
        return res.data.data;
    } catch (err) {
        console.error("Failed to fetch event by ID", err);
        throw err;
    }
};

export {
    getAllEvents,
    getEventsByUserInterests,
    getEventById
}