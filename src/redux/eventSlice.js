import { createSlice } from '@reduxjs/toolkit';
import csi from '../assets/csi.jpg' 
import elevate from '../assets/elevate.jpg' 
import inc from '../assets/inc.jpg'
const initialState = {
  events: [
    { id: 1, title: "XENIA 2025", date: "February 14-16, 2025", description: "Join us for XENIA 2025!", image:csi },
    { id: 2, title: "ELEVATE 2025", date: "February 14-17, 2025", description: "Ultimate sports tournament.", image: elevate},
    { id: 3, title: "INC 2025", date: "March 21-23, 2025", description: "Competitions and exhibitions.", image:inc }
  ]
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {}
});

export default eventSlice.reducer;
