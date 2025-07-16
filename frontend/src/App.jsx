import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import ToasterProvider from './components/ToasterProvider';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/useAuth';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import ManageEvents from './pages/ManangeEvents';
import EditEvent from './pages/EditEvents';
import EventDetails from './pages/EventDetails';
import UserRoleManager from './pages/UserRoleManager';


const App = () => {
  const {isCheckingAuth, checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth(); // runs on app load
  }, []);

  const requireAdmin = (children) => {
    if (!authUser || !['admin', 'superadmin'].includes(authUser.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

const requireSuperAdmin = (children) => {
  if (isCheckingAuth) {
    return <div className="h-screen flex justify-center items-center text-white">Checking auth...</div>;
  }

  if (!authUser || authUser.role !== 'superadmin') {
    return <Navigate to="/" />;
  }

  return children;
};

  return (
    <div>
      <Navbar />
      <ToasterProvider />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* 🔒 Admin Routes */}
        <Route path="/create-event" element={requireAdmin(<CreateEvent />)} />
        <Route path="/managed-events" element={requireAdmin(<ManageEvents />)} />
        <Route path="/events/edit/:id" element={requireAdmin(<EditEvent />)} />

        {/* 🔒 Superadmin-only */}
        <Route path="/users/superadmin" element={requireSuperAdmin(<UserRoleManager />)} />
      </Routes>
    </div>
  );
};

export default App;
