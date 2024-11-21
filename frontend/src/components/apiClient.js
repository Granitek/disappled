// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true, // Automatyczne przesyłanie ciasteczek
});

export default apiClient;
