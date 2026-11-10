const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:5001/api';
axios.post('/auth/admin/login', { email: 'admin@garage.com', password: 'admin123' })
  .then(res => console.log('Response:', res.data))
  .catch(err => console.error('Error:', err.response?.data || err.message));
