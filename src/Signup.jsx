import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: authError, isAuthenticated } = useSelector((state) => state.auth);

  // Clear any auth errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show toast for auth errors
  useEffect(() => {
    if (authError) {
      toast.error(authError, {
        duration: 4000,
        style: {
          background: '#FF5A5F',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#FF5A5F',
        },
      });
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user types in a field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Show toast for validation errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors);
      toast.error(errorMessages[0], {
        duration: 4000,
        style: {
          background: '#FF5A5F',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#FF5A5F',
        },
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await dispatch(registerUser({ 
        username: formData.username, 
        password: formData.password 
      })).unwrap();
      
      // Clear form
      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });
      
      // Show success message and redirect
      toast.success('Account created! Redirecting to login...', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
      
      // Delay navigation to allow the toast to be seen
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error is handled by the useEffect above
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Toast container */}
      <Toaster position="top-right" />
      
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        
        <form onSubmit={handleSignup} className="mt-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className={`w-full p-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`w-full p-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`w-full p-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;