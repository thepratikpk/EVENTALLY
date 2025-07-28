import axios from 'axios'
import { useAuthStore } from '../store/useAuth';
import { toast } from 'react-hot-toast';

const API=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL+'/api/v1',
    withCredentials:true
})

let isRefreshing = false;
let failedQueue = [];

// Function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error); // Reject queued requests if refresh failed
    } else {
      prom.resolve(token); // Resolve queued requests with the new token
    }
  });
  failedQueue = []; // Clear the queue
};

// Add a request interceptor to attach the access token
API.interceptors.request.use(
  (config) => {
    const authUser = useAuthStore.getState().authUser; // Get current authUser from Zustand
    // Attach access token if available and it's not the refresh token endpoint
    if (authUser?.accessToken && config.url !== '/auth/refresh-token') {
      config.headers['Authorization'] = `Bearer ${authUser.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState(); // Get current state of the auth store

    // Check if the error is 401 Unauthorized AND it's not the refresh token endpoint itself
    // Also, check if this request has already been retried to prevent infinite loops
    if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh-token' && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as having attempted a retry

      if (isRefreshing) {
        // If a token refresh is already in progress, queue the current request
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token; // Update with new token
          return API(originalRequest); // Resend the original request
        })
        .catch(err => {
          return Promise.reject(err); // Propagate error if queued request fails
        });
      }

      // If no refresh is in progress, start one
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          // Call the backend's refresh token endpoint
          // The refresh token is sent via HttpOnly cookie, so no need to explicitly send it in body/headers
          const refreshResponse = await API.post('/auth/refresh-token');
          const { accessToken, refreshToken, user } = refreshResponse.data.data; // Adjust based on your ApiResponse structure

          // Update the Zustand store with the new access token and user data
          // The refresh token is handled by the cookie, but if your store tracks it, update it here too.
          authStore.setAuthUser({ ...user, accessToken }); // Update authUser with new token

          // Update the original failed request's header with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          // Process all requests that were queued while refreshing
          processQueue(null, accessToken);

          // Resolve the promise by retrying the original request
          resolve(API(originalRequest));
        } catch (refreshError) {
          // If the refresh token itself is expired or invalid, log out the user
          console.error("Refresh token failed:", refreshError);
          processQueue(refreshError, null); // Reject all queued requests
          authStore.logout(); // This should clear authUser and navigate to login
          toast.error(refreshError?.response?.data?.message || "Session expired. Please log in again.");
          reject(refreshError); // Propagate the refresh error
        } finally {
          isRefreshing = false; // Reset the refreshing flag
        }
      });
    }

    // For any other error (not 401 or already retried 401), just reject
    return Promise.reject(error);
  }
);

export { API };