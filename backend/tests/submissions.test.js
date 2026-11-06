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

// Helper for authenticated requests
async function loginAs(email, password) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, ...data };
}

test('POST /api/auth/register creates new member and returns token', async () => {
  const testEmail = `testuser_${Date.now()}@hosurone.local`;
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Vasanth Kumar',
      email: testEmail,
      password: 'SecurePassword123!',
      locality: 'Hosur City',
    }),
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.token);
  assert.equal(json.data.user.email, testEmail);
  assert.equal(json.data.user.role, 'member');
});

test('POST /api/auth/login verifies registered credentials', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  assert.equal(login.status, 200);
  assert.equal(login.success, true);
  assert.ok(login.data.token);
  assert.equal(login.data.user.role, 'member');
});

test('GET /api/auth/me returns authenticated user details', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${login.data.token}` },
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.email, 'member@hosurone.in');
});

test('Unauthenticated user cannot create submission (HTTP 401)', async () => {
  const res = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Unauthorized Park',
      category: 'Parks & Lakes',
      description: 'Test',
      locality: 'Hosur City',
      address: 'Test Rd',
    }),
  });

  assert.equal(res.status, 401);
});

let createdSubmissionId = null;

test('Authenticated member can submit new place (status pending)', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.data.token}`,
    },
    body: JSON.stringify({
      type: 'new_place',
      name: 'Sanjeevani Urban Herbal Garden',
      category: 'Parks & Lakes',
      description: 'Community herbal and medicinal plant botanical garden maintained by youth collective.',
      locality: 'Hosur City',
      address: 'Near Old ASTC Hudco Colony, Hosur - 635109',
      phone: '04344-245678',
      coordinates: { latitude: 12.7485, longitude: 77.8392 },
      sourceUrl: 'https://hosurone.in/parks',
    }),
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'pending');
  assert.equal(json.data.name, 'Sanjeevani Urban Herbal Garden');
  createdSubmissionId = json.data.id || json.data._id;
  assert.ok(createdSubmissionId);
});

test('Duplicate detection flags nearby or duplicate place', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  // Submitting Chandra Choodeswarar Temple which already exists in places.json
  const res = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.data.token}`,
    },
    body: JSON.stringify({
      name: 'Arulmigu Maragathambigai Chandra Choodeswarar Temple',
      category: 'Religious Place',
      description: 'Historic hill temple in Hosur.',
      locality: 'Hosur City',
      address: 'Malai Kovil Hill, Sanasandiram, Hosur - 635109',
      coordinates: { latitude: 12.7235, longitude: 77.8285 },
    }),
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.data.isDuplicateWarning, true);
});

test('GET /api/submissions/mine returns logged in user contributions', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/submissions/mine`, {
    headers: { Authorization: `Bearer ${login.data.token}` },
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.some((s) => s.name === 'Sanjeevani Urban Herbal Garden'));
});

test('Non-admin cannot access admin moderation endpoints (HTTP 403)', async () => {
  const login = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/admin/submissions`, {
    headers: { Authorization: `Bearer ${login.data.token}` },
  });

  assert.equal(res.status, 403);
});

test('Admin can request more information on a submission', async () => {
  const adminLogin = await loginAs('admin@hosurone.in', 'Admin@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/admin/submissions/${createdSubmissionId}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLogin.data.token}`,
    },
    body: JSON.stringify({
      action: 'request_info',
      reason: 'Please specify official opening hours and visiting guidelines.',
    }),
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.data.status, 'needs_information');
  assert.equal(json.data.moderation.feedbackReason, 'Please specify official opening hours and visiting guidelines.');
});

test('Submitter can update submission when needs_information is set', async () => {
  const memberLogin = await loginAs('member@hosurone.in', 'Member@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/submissions/${createdSubmissionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${memberLogin.data.token}`,
    },
    body: JSON.stringify({
      additionalInfo: 'Open to the public from 6:00 AM to 6:30 PM daily. Free entry.',
    }),
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.data.status, 'pending');
  assert.ok(json.data.additionalInfo.includes('6:00 AM to 6:30 PM'));
});

test('Admin can publish an approved submission', async () => {
  const adminLogin = await loginAs('admin@hosurone.in', 'Admin@HosurOne2026');
  const res = await fetch(`${baseUrl}/api/admin/submissions/${createdSubmissionId}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLogin.data.token}`,
    },
    body: JSON.stringify({
      action: 'publish',
      reason: 'Verified by local municipal flora committee.',
    }),
  });

  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.data.status, 'published');
});

test('Published community submission appears in public /api/places directory', async () => {
  const res = await fetch(`${baseUrl}/api/places?search=Sanjeevani`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);

  const matched = json.data.find((p) => p.name.includes('Sanjeevani'));
  assert.ok(matched);
  assert.equal(matched.isCommunityContribution, true);
  assert.equal(matched.verificationStatus, 'community_published');
});

test('Verified contributor submission in eligible category auto-publishes immediately', async () => {
  const contribLogin = await loginAs('contributor@hosurone.in', 'Contributor@2026');
  const res = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${contribLogin.data.token}`,
    },
    body: JSON.stringify({
      name: 'Mookandapalli Community Badminton Park',
      category: 'Parks & Lakes',
      description: 'Outdoor public badminton courts and landscaped perimeter walking path.',
      locality: 'Mookandapalli',
      address: 'Phase 2 Sector 4, Mookandapalli, Hosur - 635126',
      coordinates: { latitude: 12.7562, longitude: 77.8091 },
    }),
  });

  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.data.status, 'published');
  assert.ok(json.message.includes('verified and published directly'));
});

test('Public directory endpoints return verified datasets', async () => {
  // Test /api/places
  const placesRes = await fetch(`${baseUrl}/api/places`);
  assert.equal(placesRes.status, 200);
  const placesJson = await placesRes.json();
  assert.ok(placesJson.data.length >= 6);

  // Test /api/hospitals
  const hospRes = await fetch(`${baseUrl}/api/hospitals`);
  assert.equal(hospRes.status, 200);
  const hospJson = await hospRes.json();
  assert.ok(hospJson.data.length >= 5);
  assert.ok(hospJson.data.some((h) => h.name.includes('District Headquarters Hospital')));

  // Test /api/atms
  const atmRes = await fetch(`${baseUrl}/api/atms`);
  assert.equal(atmRes.status, 200);
  const atmJson = await atmRes.json();
  assert.ok(atmJson.data.length >= 4);

  // Test /api/contacts
  const contactsRes = await fetch(`${baseUrl}/api/contacts`);
  assert.equal(contactsRes.status, 200);
  const contactsJson = await contactsRes.json();
  assert.ok(contactsJson.data.length >= 6);
  assert.ok(contactsJson.data.some((c) => c.phone === '108' || c.phone === '100'));
});

