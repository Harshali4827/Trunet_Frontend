
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

/************************************************************** */

// import axios from 'axios';
// import config from './config';

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

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

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
      
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(token => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return axiosInstance(originalRequest);
//           })
//           .catch(err => Promise.reject(err));
//       }
      
//       originalRequest._retry = true;
//       isRefreshing = true;
      
//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
        
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }
        
//         const response = await axios.post(
//           `${config.baseURL}/auth/refresh-token`,
//           {},
//           {
//             headers: {
//               'Authorization': `Bearer ${refreshToken}`
//             }
//           }
//         );
        
//         if (response.data.success) {

//           localStorage.setItem('token', response.data.token);

//           if (response.data.refreshToken) {
//             localStorage.setItem('refreshToken', response.data.refreshToken);
//           }
          
//           originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
//           processQueue(null, response.data.token);
          
//           return axiosInstance(originalRequest);
//         } else {
//           throw new Error('Token refresh failed');
//         }
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
        
//         processQueue(refreshError, null);
        
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         localStorage.removeItem('user');
//         localStorage.removeItem('userCenter');
//         localStorage.removeItem('tempToken');
//         localStorage.removeItem('userTemp');
        
//         if (!window.location.pathname.includes('/login')) {
//           window.location.href = '/login';
//         }
        
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       localStorage.removeItem('userCenter');
//       localStorage.removeItem('tempToken');
//       localStorage.removeItem('userTemp');
      
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

///********************************************************************* */


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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Don't handle 401 errors for login requests specially
    // Let them pass through to be handled by the component
    if (originalRequest.url === '/auth/login') {
      return Promise.reject(error);
    }
    
    // For other 401 errors, handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      
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
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
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
          localStorage.setItem('token', response.data.token);
          
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          processQueue(null, response.data.token);
          
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        processQueue(refreshError, null);
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userCenter');
        localStorage.removeItem('tempToken');
        localStorage.removeItem('userTemp');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userCenter');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('userTemp');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;