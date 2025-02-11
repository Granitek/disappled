import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
    // Rejestracja użytkownika
    const registerPayload = JSON.stringify({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword123',
        listen_to_wakewords: false
    });
    let res = http.post('http://127.0.0.1:8000/users/register/', registerPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, { 'registered successfully': (r) => r.status === 201 });

    // Logowanie użytkownika
    const loginPayload = JSON.stringify({
        username: 'testuser',
        password: 'testpassword123',
    });
    res = http.post('http://127.0.0.1:8000/users/login/', loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, { 'logged in successfully': (r) => r.status === 200 });

    // Dodanie nowego posta
    const postPayload = JSON.stringify({
        title: 'Blue parrot',
        content: 'Content',
    });
    res = http.post('http://127.0.0.1:8000/api/posts/', postPayload, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${res.json('token')}`, // Przekazanie tokenu autoryzacyjnego
        },
    });
    check(res, { 'post created successfully': (r) => r.status === 201 });

    sleep(1);
}
