import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import ToasterProvider from './components/ToasterProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthStore } from './store/useAuth';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import ManageEvents from './pages/ManangeEvents';
import EditEvent from './pages/EditEvents';
import EventDetails from './pages/EventDetails';
import UserRoleManager from './pages/UserRoleManager';
import About from './pages/About';

// Loading component for auth check
const AuthLoading = () => (
  <div className="h-screen flex flex-col justify-center items-center text-gray-800 bg-gray-50">
    <div className="animate-spin h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full mb-4" />
    <p className="text-slate-600 font-medium">Checking authentication...</p>
  </div>
);

const App = () => {
  const { isCheckingAuth, checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth(); // run on app load
  }, []);

  // Guard: wait until auth is checked before rendering any protected routes
  const requireAuthCheck = (child) => {
    if (isCheckingAuth) {
      return <AuthLoading />;
    }
    return child;
  };

  const requireAdmin = (children) => {
    return requireAuthCheck(
      !authUser || !['admin', 'superadmin'].includes(authUser.role)
        ? <Navigate to="/" />
        : children
    );
  };

  const requireSuperAdmin = (children) => {
    return requireAuthCheck(
      !authUser || authUser.role !== 'superadmin'
        ? <Navigate to="/" />
        : children
    );
  };

  return (
    <ErrorBoundary>
      <div>
        <ToasterProvider />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/about' element={<About />} />
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
    </ErrorBoundary>
  );
};

export default App;
