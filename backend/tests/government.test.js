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

test('GET /api/government returns verified government directory list', async () => {
  const res = await fetch(`${baseUrl}/api/government`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(json.pagination);
  assert.ok(json.sourceAttribution);

  const first = json.data[0];
  assert.ok(first.name);
  assert.ok(first.department);
  assert.ok(first.sourceUrl);
  assert.equal(first.verificationStatus, 'verified');
});

test('GET /api/government?category=Hospital filters correctly', async () => {
  const res = await fetch(`${baseUrl}/api/government?category=Hospital`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  json.data.forEach((item) => {
    assert.match(item.category.toLowerCase(), /hospital/);
  });
});

test('GET /api/government?locality=Bagalur filters correctly', async () => {
  const res = await fetch(`${baseUrl}/api/government?locality=Bagalur`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  json.data.forEach((item) => {
    assert.match(item.locality.toLowerCase(), /bagalur/);
  });
});

test('GET /api/government/:id returns single office details', async () => {
  const res = await fetch(`${baseUrl}/api/government/gov-hosur-corp-hq`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'gov-hosur-corp-hq');
  assert.match(json.data.name, /Hosur City Municipal Corporation/);
});

test('GET /api/government/invalid-id returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/government/invalid-id-does-not-exist`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.status, 404);
});
