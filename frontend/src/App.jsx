import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import Login from './components/Login';
import Register from './components/Register';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuth';

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className='text-gray-800'>
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
      />
    </div>
  );
};

export default App;