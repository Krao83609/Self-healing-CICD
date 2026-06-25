/*ChatGPT Prompt: Build a production-ready smoke test application using Node.js and Express. 
The application should start an Express server, expose a GET / endpoint, 
automatically execute a smoke test after startup by sending 
an HTTP request to its own endpoint, validate the HTTP status code 
and response body, handle request timeouts and startup failures, 
gracefully shut down the server, exit with code 0 on success and 
1 on failure, use environment variables for configuration, 
follow clean code principles, and be suitable for CI/CD pipelines.*/

const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 5000;
const EXPECTED_RESPONSE = 'Hello from Express App';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send(EXPECTED_RESPONSE);
});

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('Running smoke test...');

  const request = http.get(`http://localhost:${PORT}/`, (res) => {
    let body = '';

    res.on('data', chunk => {
      body += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code : ${res.statusCode}`);
      console.log(`Response    : ${body}`);

      if (res.statusCode === 200 && body === EXPECTED_RESPONSE) {
        console.log('✅ Smoke test passed');
        shutdown(0);
      } else {
        console.error('❌ Smoke test failed');
        shutdown(1);
      }
    });
  });

  request.setTimeout(5000, () => {
    console.error('❌ Smoke test timed out');
    request.destroy();
    shutdown(1);
  });

  request.on('error', (err) => {
    console.error(`❌ Request failed: ${err.message}`);
    shutdown(1);
  });
});

server.on('error', (err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

function shutdown(exitCode) {
  server.close((err) => {
    if (err) {
      console.error(`Error while shutting down: ${err.message}`);
      process.exit(1);
    }

    console.log('Server stopped.');
    process.exit(exitCode);
  });
}