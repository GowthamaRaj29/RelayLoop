const http = require('http');

// Test GET /api/v1/patients
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/v1/patients',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log('Testing API endpoint: http://localhost:3002/api/v1/patients');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const json = JSON.parse(data);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.end();
