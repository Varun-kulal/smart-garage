import fetch from 'node-fetch';

const url = 'http://localhost:5001/api/auth/admin/login';
const data = { email: 'admin@garage.com', password: 'admin123' };

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(json => console.log('Response:', json))
  .catch(err => console.error('Error:', err));
