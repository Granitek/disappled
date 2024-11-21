import axios from 'axios';

// Ustawienia globalne dla Axios
axios.defaults.withCredentials = true; // Dołącz ciasteczka do każdego żądania
axios.defaults.baseURL = 'http://localhost:8000'; // Ustaw podstawowy URL

export default axios;
