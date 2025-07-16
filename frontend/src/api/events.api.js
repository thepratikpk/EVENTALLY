import { API } from "../lib/axios"

const getAllEvents=async()=>{
    try {
        const res=await API.get('/events')
        return res.data.data
    } catch (error) {
         console.error("Failed to fetch events", err);
    throw err;
    }
}
const getEventsByUserInterests = async () => {
  const res = await API.get("/events/interests");
  return res.data?.data;
};

export {
    getAllEvents,
    getEventsByUserInterests
}