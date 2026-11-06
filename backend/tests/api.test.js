import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    // Listen on random available port for testing
    server = app.listen(0, () => {
      const address = server.address();
      baseUrl = `http://localhost:${address.port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test('GET /api/health returns 200 and healthy status without exposing secrets', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'healthy');
  assert.equal(json.data.service, 'HosurOne API Backend');
  assert.ok(json.data.environment);
  assert.ok(json.data.database);
  // Ensure no sensitive fields like passwords, secrets, or full connection strings are returned
  assert.equal(json.data.database.uri, undefined);
  assert.equal(json.data.database.password, undefined);
});

test('GET /api/nonexistent returns 404 structured error', async () => {
  const res = await fetch(`${baseUrl}/api/nonexistent`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.status, 404);
  assert.match(json.error.message, /Endpoint not found/);
});

test('Rate limiting headers are set on response', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.ok(res.headers.get('x-ratelimit-limit'));
  assert.ok(res.headers.get('x-ratelimit-remaining'));
  assert.ok(res.headers.get('x-ratelimit-reset'));
});
