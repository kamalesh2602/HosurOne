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

test('GET /api/banks returns verified bank branches list', async () => {
  const res = await fetch(`${baseUrl}/api/banks`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);
  assert.ok(json.pagination);
  assert.ok(json.sourceAttribution);

  const first = json.data[0];
  assert.ok(first.bankName);
  assert.ok(first.branchName);
  assert.ok(first.ifsc);
  assert.ok(first.address);
  assert.equal(first.verificationStatus, 'verified');
});

test('GET /api/banks?bank=State Bank of India filters by bank', async () => {
  const res = await fetch(`${baseUrl}/api/banks?bank=State%20Bank%20of%20India`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  json.data.forEach((b) => {
    assert.equal(b.bankName, 'State Bank of India');
  });
});

test('GET /api/banks?locality=SIPCOT filters by locality', async () => {
  const res = await fetch(`${baseUrl}/api/banks?locality=SIPCOT`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  json.data.forEach((b) => {
    assert.equal(b.locality, 'SIPCOT');
  });
});

test('GET /api/banks?search=SBIN0001928 searches by IFSC', async () => {
  const res = await fetch(`${baseUrl}/api/banks?search=SBIN0001928`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.length, 1);
  assert.equal(json.data[0].ifsc, 'SBIN0001928');
});

test('GET /api/banks/:id gets branch by IFSC or ID', async () => {
  const res = await fetch(`${baseUrl}/api/banks/SBIN0001928`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.ifsc, 'SBIN0001928');
  assert.match(json.data.branchName, /Hosur Main/);
});

test('GET /api/banks/invalid-ifsc returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/banks/INVALIDIFSC9999`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.status, 404);
});
