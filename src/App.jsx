import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Events from './components/Events';
import Footer from './components/Footer';
import EventDetails from './components/EventDetails';
import Login from './components/Login';

import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Signup from './components/signup';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Toaster position="top-right" /> {/* Add Toaster component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        
      </Router>
    </Provider>
  );
}

export default App;
