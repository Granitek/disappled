import axios from 'axios';

axios.defaults.withCredentials = true; // Ciasteczka w każdym żądaniu
axios.defaults.baseURL = 'http://localhost:8000'; // URL serwera

export default axios;
