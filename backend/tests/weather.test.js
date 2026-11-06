import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
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

test('GET /api/weather returns valid current conditions', async () => {
  const res = await fetch(`${baseUrl}/api/weather`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.location);
  assert.equal(json.data.location.name, 'Hosur');
  assert.ok(json.data.current);
  assert.equal(typeof json.data.current.temperature, 'number');
  assert.equal(typeof json.data.current.humidity, 'number');
  assert.ok(json.data.current.condition);
  assert.ok(Array.isArray(json.data.forecast));
});

test('GET /api/weather/forecast returns hourly and 7-day daily forecast', async () => {
  const res = await fetch(`${baseUrl}/api/weather/forecast`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.current);
  assert.ok(Array.isArray(json.data.hourly));
  assert.ok(json.data.hourly.length > 0);
  assert.ok(Array.isArray(json.data.daily));
  assert.equal(json.data.daily.length, 7);
  // Check daily item fields
  const firstDay = json.data.daily[0];
  assert.ok(firstDay.date);
  assert.equal(typeof firstDay.maxTemp, 'number');
  assert.equal(typeof firstDay.minTemp, 'number');
  assert.ok(firstDay.condition);
});

