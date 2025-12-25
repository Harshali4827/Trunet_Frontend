
// import axios from 'axios';
// import config from './config';

// const axiosInstance = axios.create({
//   baseURL: config.baseURL,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     console.log('Token from localStorage:', token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Add response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {

//       localStorage.clear();
    
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//       if (error.response?.data?.message) {
//         console.error('Authentication error:', error.response.data.message);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from 'axios';
import config from './config';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor with token refresh logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we're already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Get refresh token from localStorage or cookie
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Call refresh token endpoint
        const response = await axios.post(
          `${config.baseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          }
        );
        
        if (response.data.success) {
          // Store new tokens
          localStorage.setItem('token', response.data.token);
          
          // If new refresh token is returned, update it
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Update Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Process queued requests
          processQueue(null, response.data.token);
          
          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Process queue with error
        processQueue(refreshError, null);
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userCenter');
        localStorage.removeItem('tempToken');
        localStorage.removeItem('userTemp');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other 401 errors or when retry failed
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userCenter');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('userTemp');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      if (error.response?.data?.message) {
        console.error('Authentication error:', error.response.data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;