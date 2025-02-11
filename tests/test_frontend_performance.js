import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20, // Liczba równoczesnych użytkowników
    duration: '1m', // Czas trwania testu
};

export default function () {
    const res = http.get('http://localhost:3000/'); // URL aplikacji frontendowej

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1); // Odczekaj 1 sekundę przed kolejnym żądaniem
}
