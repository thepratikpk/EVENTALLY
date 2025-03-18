import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Events from './components/Events';
import Footer from './components/Footer';
import EventDetails from './components/EventDetails';
import Login from './components/AuthPage';
import Dashboard from './components/Dashboard';

// const PrivateRoute = ({ children }) => {
//   return localStorage.getItem("isAuthenticated") ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        
      </Router>
    </Provider>
  );
}

export default App;
