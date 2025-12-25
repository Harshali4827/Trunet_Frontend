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

// export default axiosInstance;



// Update your axiosInstance.js
import axios from 'axios';
import config from './config';

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

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {

      localStorage.clear();
    
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
