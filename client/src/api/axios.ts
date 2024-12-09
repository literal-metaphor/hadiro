import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend server's URL
  timeout: 10000, // Optional: Set a timeout for requests
});

export default apiClient;