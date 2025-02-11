import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 }, // Rozgrzewka: do 50 użytkowników w ciągu 30 sekund
        { duration: '1m', target: 50 },  // Stabilny ruch: 50 użytkowników przez 1 minutę
        { duration: '30s', target: 0 },  // Schładzanie: powrót do 0 użytkowników w ciągu 30 sekund
    ],
};

export default function () {
    const url = 'http://127.0.0.1:8000/api/posts/'; // Przykładowy endpoint API
    const payload = JSON.stringify({
        title: 'Testowy tytuł',
        content: 'Testowa treść',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1); // Odczekaj 1 sekundę przed kolejnym żądaniem
}
