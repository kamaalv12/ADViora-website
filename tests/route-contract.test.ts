import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

import { GET as userDetailsHandler } from '../app/api/user-details/route';
import { POST as signupHandler } from '../app/api/signup/route';
import { HTTP_STATUS, ERROR_CODES } from '../server/config/constants';

describe('Route Boundary Contract & Security Tests', () => {
  describe('1. Disabled Reporting Route (/api/user-details)', () => {
    it('returns HTTP 403 Forbidden with stable access denied message and code FORBIDDEN', async () => {
      const req = new NextRequest('http://localhost:3000/api/user-details');
      const res = await userDetailsHandler(req);

      assert.equal(res.status, HTTP_STATUS.FORBIDDEN);
      const json = await res.json();
      assert.equal(json.success, false);
      assert.equal(json.code, ERROR_CODES.FORBIDDEN);
      assert.match(json.message, /Access denied/);
      assert.equal(json.data, undefined);
    });
  });

  describe('2. Pre-Database Validation & Server-Side Honeypot (/api/signup)', () => {
    it('safely rejects invalid JSON format with HTTP 400 before DB connection', async () => {
      const req = new NextRequest('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json{{{',
      });
      const res = await signupHandler(req);

      assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
      const json = await res.json();
      assert.equal(json.success, false);
      assert.equal(json.code, ERROR_CODES.VALIDATION_ERROR);
    });

    it('safely rejects missing required fields with HTTP 400 before DB connection', async () => {
      const req = new NextRequest('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Alex',
        }),
      });
      const res = await signupHandler(req);

      assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
      const json = await res.json();
      assert.equal(json.success, false);
      assert.equal(json.code, ERROR_CODES.VALIDATION_ERROR);
      assert.ok(json.errors);
    });

    it('safely rejects populated honeypot website field with HTTP 400 without DB connection', async () => {
      const req = new NextRequest('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Spam Bot',
          email: 'bot@spam.com',
          phone: '9876543210',
          interest: 'Business transformation',
          message: 'Valid message exceeding ten characters.',
          website: 'https://spamlink.com',
        }),
      });
      const res = await signupHandler(req);

      assert.equal(res.status, HTTP_STATUS.BAD_REQUEST);
      const json = await res.json();
      assert.equal(json.success, false);
      assert.equal(json.code, ERROR_CODES.VALIDATION_ERROR);
      assert.equal(json.message, 'Invalid request submission.');
    });

    it('safely rejects missing database configuration with HTTP 500 when valid payload passes validation', async () => {
      // In this test phase, MONGODB_URI is intentionally not configured
      const previousUri = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;

      const req = new NextRequest('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Alex Mercer',
          email: 'alex@example.com',
          phone: '+91 98765 43210',
          interest: 'Business transformation',
          message: 'Interested in business operating models.',
        }),
      });
      const res = await signupHandler(req);

      assert.equal(res.status, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      const json = await res.json();
      assert.equal(json.success, false);
      assert.equal(json.code, ERROR_CODES.DATABASE_ERROR);
      assert.match(json.message, /could not process your enquiry right now/);
      // Confirms NO internal stack traces or connection errors exposed to client
      assert.equal(json.errors, undefined);

      if (previousUri) process.env.MONGODB_URI = previousUri;
    });
  });
});
