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

test('GET /api/government integrates government.json records with contact and department fields', async () => {
  const res = await fetch(`${baseUrl}/api/government`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 7);

  const hq = json.data.find((item) => item.id === 'gov-hosur-corp-hq');
  assert.ok(hq, 'Hosur Municipal HQ must be present in government directory');
  assert.equal(hq.name, 'Hosur City Municipal Corporation (HQ)');
  assert.ok(hq.contact || hq.phone, 'Must have contact or phone field');
  assert.ok(hq.department || hq.description, 'Must have department or description');
  assert.ok(hq.coordinates?.latitude || hq.latitude, 'Must have coordinates');
});

test('GET /api/government?category=Hospital surfaces hospital records from hospitals.json', async () => {
  const res = await fetch(`${baseUrl}/api/government?category=Hospital`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 4, 'Must return hospital listings');
  assert.ok(json.data.some((h) => h.name.includes('District Headquarters Hospital')));
});

test('GET /api/government?category=Helpline surfaces emergency contacts from contacts.json', async () => {
  const res = await fetch(`${baseUrl}/api/government?category=Helpline`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 5, 'Must return helpline listings');
  assert.ok(json.data.some((c) => c.phone === '108' || c.phone === '112'));
});

test('GET /api/banks surfaces bank records with normalized bankName, branchName, and IFSC', async () => {
  const res = await fetch(`${baseUrl}/api/banks`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 5, 'Must contain 5 verified bank branches');

  const sbi = json.data.find((b) => b.ifsc === 'SBIN0001928');
  assert.ok(sbi);
  assert.equal(sbi.bankName, 'State Bank of India');
  assert.equal(sbi.branchName, 'Hosur Main Branch');
  assert.ok(sbi.coordinates?.latitude || sbi.latitude);
  assert.ok(sbi.officialSource || sbi.sourceUrl);
});

test('GET /api/places surfaces all places from places.json', async () => {
  const res = await fetch(`${baseUrl}/api/places`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 6);

  const temple = json.data.find((p) => p.id === 'place-chandrachoodeswarar-temple');
  assert.ok(temple);
  assert.equal(temple.category, 'Religious Place');

  const lake = json.data.find((p) => p.id === 'place-ramanaicken-lake');
  assert.ok(lake);
  assert.equal(lake.category, 'Parks & Lakes');
});

test('GET /api/hospitals surfaces verified hospitals with emergency numbers', async () => {
  const res = await fetch(`${baseUrl}/api/hospitals`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 5);

  const gh = json.data.find((h) => h.id === 'hosp-hosur-gh');
  assert.ok(gh);
  assert.equal(gh.emergencyPhone, '108');
  assert.ok(gh.phone);
});

test('GET /api/atms surfaces 24/7 bank ATMs with cash deposit metadata', async () => {
  const res = await fetch(`${baseUrl}/api/atms`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 4);

  const cdm = json.data.find((a) => a.hasCashDeposit === true);
  assert.ok(cdm, 'At least one ATM must indicate CDM cash deposit support');
});

test('GET /api/directory/all aggregates places, hospitals, and ATMs without dropping records', async () => {
  const res = await fetch(`${baseUrl}/api/directory/all`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 15, 'Unified directory must contain places + hospitals + ATMs');
  assert.ok(json.data.some((item) => item.category === 'Religious Place'));
  assert.ok(json.data.some((item) => item.category === 'Government Hospital' || item.category.includes('Hospital')));
  assert.ok(json.data.some((item) => item.category === 'ATM'));
});
