import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //  baseURL: import.meta.env.VITE_API_BASE_URL
  //  baseURL: 'http://192.168.1.5:5000/api'

  baseURL: 'http://localhost:5000/api'

};

export default config;
