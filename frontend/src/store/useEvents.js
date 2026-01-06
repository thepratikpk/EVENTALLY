import { create } from "zustand";
import { API } from "../lib/axios";

// Cache duration in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Helper to check if cache is valid
const isCacheValid = (lastFetched) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < CACHE_TTL;
};

// Extract events from API response (handles both paginated and array formats)
const extractEvents = (response) => {
  if (!response) return [];
  if (response.events && Array.isArray(response.events)) return response.events;
  if (Array.isArray(response)) return response;
  return [];
};

export const useEventsStore = create((set, get) => ({
  // All Events State
  allEvents: [],
  allEventsLoading: false,
  allEventsError: null,
  allEventsPagination: null,
  allEventsLastFetched: null,

  // Interest-Based Events State
  interestEvents: [],
  interestEventsLoading: false,
  interestEventsError: null,
  interestEventsPagination: null,
  interestEventsLastFetched: null,

  // My Events (Admin) State
  myEvents: [],
  myEventsLoading: false,
  myEventsError: null,
  myEventsPagination: null,
  myEventsLastFetched: null,

  // Single Event State
  currentEvent: null,
  currentEventLoading: false,
  currentEventError: null,
  currentEventId: null,

  // Fetch All Events
  fetchAllEvents: async (page = 1, limit = 10, forceRefresh = false) => {
    const state = get();
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid(state.allEventsLastFetched) && state.allEvents.length > 0) {
      return { events: state.allEvents, pagination: state.allEventsPagination };
    }

    set({ allEventsLoading: true, allEventsError: null });
    
    try {
      const res = await API.get(`/events?page=${page}&limit=${limit}`);
      const data = res.data.data;
      const events = extractEvents(data);
      const pagination = data?.pagination || null;
      
      set({
        allEvents: events,
        allEventsPagination: pagination,
        allEventsLoading: false,
        allEventsLastFetched: Date.now(),
      });
      
      return { events, pagination };
    } catch (error) {
      set({
        allEventsError: error?.response?.data?.message || "Failed to fetch events",
        allEventsLoading: false,
      });
      throw error;
    }
  },

  // Fetch Interest-Based Events
  fetchInterestEvents: async (page = 1, limit = 10, forceRefresh = false) => {
    const state = get();
    
    if (!forceRefresh && isCacheValid(state.interestEventsLastFetched) && state.interestEvents.length > 0) {
      return { events: state.interestEvents, pagination: state.interestEventsPagination };
    }

    set({ interestEventsLoading: true, interestEventsError: null });
    
    try {
      const res = await API.get(`/events/interests?page=${page}&limit=${limit}`);
      const data = res.data?.data;
      const events = extractEvents(data);
      const pagination = data?.pagination || null;
      
      set({
        interestEvents: events,
        interestEventsPagination: pagination,
        interestEventsLoading: false,
        interestEventsLastFetched: Date.now(),
      });
      
      return { events, pagination };
    } catch (error) {
      set({
        interestEventsError: error?.response?.data?.message || "Failed to fetch interest events",
        interestEventsLoading: false,
      });
      throw error;
    }
  },

  // Fetch My Posted Events (Admin)
  fetchMyEvents: async (page = 1, limit = 10, forceRefresh = false) => {
    const state = get();
    
    if (!forceRefresh && isCacheValid(state.myEventsLastFetched) && state.myEvents.length > 0) {
      return { events: state.myEvents, pagination: state.myEventsPagination };
    }

    set({ myEventsLoading: true, myEventsError: null });
    
    try {
      const res = await API.get(`/events/admin/my-events?page=${page}&limit=${limit}`);
      const data = res.data?.data;
      const events = extractEvents(data);
      const pagination = data?.pagination || null;
      
      set({
        myEvents: events,
        myEventsPagination: pagination,
        myEventsLoading: false,
        myEventsLastFetched: Date.now(),
      });
      
      return { events, pagination };
    } catch (error) {
      set({
        myEventsError: error?.response?.data?.message || "Failed to fetch your events",
        myEventsLoading: false,
      });
      throw error;
    }
  },

  // Fetch Single Event by ID
  fetchEventById: async (id, forceRefresh = false) => {
    const state = get();
    
    // Return cached event if same ID and cache is valid
    if (!forceRefresh && state.currentEventId === id && state.currentEvent && isCacheValid(state.allEventsLastFetched)) {
      return state.currentEvent;
    }

    // Check if event exists in allEvents cache
    if (!forceRefresh) {
      const cachedEvent = state.allEvents.find(e => e._id === id);
      if (cachedEvent) {
        set({ currentEvent: cachedEvent, currentEventId: id });
        // Still fetch fresh data in background for completeness
      }
    }

    set({ currentEventLoading: true, currentEventError: null });
    
    try {
      const res = await API.get(`/events/${id}`);
      const event = res.data.data;
      
      set({
        currentEvent: event,
        currentEventId: id,
        currentEventLoading: false,
      });
      
      return event;
    } catch (error) {
      set({
        currentEventError: error?.response?.data?.message || "Failed to fetch event",
        currentEventLoading: false,
      });
      throw error;
    }
  },

  // Create Event
  createEvent: async (formData) => {
    try {
      const res = await API.post('/events/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Invalidate caches
      set({
        allEventsLastFetched: null,
        myEventsLastFetched: null,
        interestEventsLastFetched: null,
      });
      
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Update Event
  updateEvent: async (id, formData) => {
    try {
      const res = await API.patch(`/events/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Invalidate caches
      set({
        allEventsLastFetched: null,
        myEventsLastFetched: null,
        interestEventsLastFetched: null,
        currentEvent: null,
        currentEventId: null,
      });
      
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete Event
  deleteEvent: async (id) => {
    try {
      await API.delete(`/events/admin/${id}`);
      
      // Update local state immediately
      set((state) => ({
        allEvents: state.allEvents.filter(e => e._id !== id),
        myEvents: state.myEvents.filter(e => e._id !== id),
        interestEvents: state.interestEvents.filter(e => e._id !== id),
        // Invalidate cache timestamps to force refresh on next fetch
        allEventsLastFetched: null,
        myEventsLastFetched: null,
        interestEventsLastFetched: null,
      }));
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Invalidate all caches
  invalidateCache: () => {
    set({
      allEventsLastFetched: null,
      interestEventsLastFetched: null,
      myEventsLastFetched: null,
      currentEvent: null,
      currentEventId: null,
    });
  },

  // Clear all events data
  clearEvents: () => {
    set({
      allEvents: [],
      allEventsLoading: false,
      allEventsError: null,
      allEventsPagination: null,
      allEventsLastFetched: null,
      interestEvents: [],
      interestEventsLoading: false,
      interestEventsError: null,
      interestEventsPagination: null,
      interestEventsLastFetched: null,
      myEvents: [],
      myEventsLoading: false,
      myEventsError: null,
      myEventsPagination: null,
      myEventsLastFetched: null,
      currentEvent: null,
      currentEventLoading: false,
      currentEventError: null,
      currentEventId: null,
    });
  },
}));
