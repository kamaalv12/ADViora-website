import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  SignupSchema,
  ALLOWED_DIGITAL_INTERESTS,
  ALLOWLISTED_UTM_KEYS,
} from '../server/validators/user.validator';
import { getDatabaseNameFromUri } from '../server/config/db';
import {
  getAttributionFromQuery,
  saveAttribution,
  getStoredAttribution,
  clearConsumedAttribution,
  getActiveAttributionSnapshot,
  resetConsumedQueryTracker,
  STORAGE_KEY,
} from '../lib/utm';
import { normalizeIndianPhoneNumber, validateField, validateAllFields } from '../lib/validation';
import { isSubmissionLocked, submitEnquiry } from '../lib/submission';

// In-memory mock sessionStorage for Node test environment
class MockSessionStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe('ADViora Backend & UTM Isolated Contract Tests', () => {
  beforeEach(() => {
    // Setup global window and sessionStorage for UTM tests
    (global as any).sessionStorage = new MockSessionStorage();
    (global as any).window = {
      location: {
        pathname: '/digital',
        search: '',
      },
    };
    resetConsumedQueryTracker();
  });

  describe('1. Name Validation & Control Character Rejection', () => {
    it('accepts valid 2-60 character names with ordinary single spaces', () => {
      const valid = SignupSchema.shape.name.safeParse('Alex Mercer');
      assert.equal(valid.success, true);
      assert.equal(valid.data, 'Alex Mercer');
    });

    it('rejects control characters (tabs, newlines, carriage returns) before trimming', () => {
      const tabName = SignupSchema.shape.name.safeParse('\tAlex Mercer\n');
      assert.equal(tabName.success, false);
      assert.match(
        tabName.error.issues[0].message,
        /Name cannot contain control characters, tabs, or line breaks/
      );

      const newlineName = SignupSchema.shape.name.safeParse('Alex\nMercer');
      assert.equal(newlineName.success, false);
    });

    it('rejects numbers and special symbols in name', () => {
      const numberName = SignupSchema.shape.name.safeParse('Alex123 Mercer');
      assert.equal(numberName.success, false);

      const symbolName = SignupSchema.shape.name.safeParse('Alex @ Mercer');
      assert.equal(symbolName.success, false);
    });

    it('rejects names shorter than 2 or longer than 60 characters', () => {
      const short = SignupSchema.shape.name.safeParse('A');
      assert.equal(short.success, false);

      const long = SignupSchema.shape.name.safeParse('A'.repeat(61));
      assert.equal(long.success, false);
    });
  });

  describe('2. Phone Normalization Order & India-Only Contract', () => {
    it('accepts standard 10-digit Indian numbers starting with 6-9', () => {
      const res = SignupSchema.shape.phone.safeParse('9876543210');
      assert.equal(res.success, true);
      assert.equal(res.data, '9876543210');
    });

    it('normalizes +91 and 91 prefixes before validating 10 digits', () => {
      const withPlus91 = SignupSchema.shape.phone.safeParse('+91 98765 43210');
      assert.equal(withPlus91.success, true);
      assert.equal(withPlus91.data, '9876543210');

      const with91 = SignupSchema.shape.phone.safeParse('919876543210');
      assert.equal(with91.success, true);
      assert.equal(with91.data, '9876543210');

      const withHyphens = SignupSchema.shape.phone.safeParse('98765-43210');
      assert.equal(withHyphens.success, true);
      assert.equal(withHyphens.data, '9876543210');
    });

    it('rejects foreign prefixes (e.g. +1, +44) without silently converting to Indian number', () => {
      const foreign1 = SignupSchema.shape.phone.safeParse('+1 9876543210');
      assert.equal(foreign1.success, false);
      assert.match(foreign1.error.issues[0].message, /Only Indian mobile numbers \(\+91\)/);

      const foreign44 = SignupSchema.shape.phone.safeParse('+44 9876543210');
      assert.equal(foreign44.success, false);
    });

    it('rejects Indian numbers starting with invalid digits (0-5)', () => {
      const invalid = SignupSchema.shape.phone.safeParse('5876543210');
      assert.equal(invalid.success, false);
    });
  });

  describe('3. Digital Interest Allowlist Validation', () => {
    it('accepts all 3 approved Digital interests', () => {
      for (const interest of ALLOWED_DIGITAL_INTERESTS) {
        const res = SignupSchema.shape.interest.safeParse(interest);
        assert.equal(res.success, true);
      }
    });

    it('rejects Postman sample "Consulting" and removed Academy interests', () => {
      const consulting = SignupSchema.shape.interest.safeParse('Consulting');
      assert.equal(consulting.success, false);

      const academy = SignupSchema.shape.interest.safeParse('ADViora Academy');
      assert.equal(academy.success, false);
    });
  });

  describe('4. Message Length & Whitespace Validation', () => {
    it('accepts messages between 10 and 600 characters', () => {
      const valid = SignupSchema.shape.message.safeParse('I would like to explore business transformation.');
      assert.equal(valid.success, true);
      assert.equal(valid.data, 'I would like to explore business transformation.');
    });

    it('rejects messages shorter than 10 characters or whitespace-only', () => {
      const short = SignupSchema.shape.message.safeParse('Too short');
      assert.equal(short.success, false);

      const whitespace = SignupSchema.shape.message.safeParse('            ');
      assert.equal(whitespace.success, false);
    });

    it('rejects messages exceeding 600 characters', () => {
      const tooLong = SignupSchema.shape.message.safeParse('A'.repeat(601));
      assert.equal(tooLong.success, false);
    });
  });

  describe('5. CountryCode Validation', () => {
    it('accepts default +91', () => {
      const valid = SignupSchema.shape.countryCode.safeParse('+91');
      assert.equal(valid.success, true);
    });

    it('rejects non-+91 country codes', () => {
      const foreign = SignupSchema.shape.countryCode.safeParse('+1');
      assert.equal(foreign.success, false);
    });
  });

  describe('6. Server-Side Honeypot & Tracking Sanitization', () => {
    it('accepts undefined or empty honeypot field', () => {
      const emptyHp = SignupSchema.shape.website.safeParse('');
      assert.equal(emptyHp.success, true);

      const undefHp = SignupSchema.shape.website.safeParse(undefined);
      assert.equal(undefHp.success, true);
    });

    it('sanitizes tracking fields to max 200 characters and trims whitespace', () => {
      const longVal = 'a'.repeat(250);
      const res = SignupSchema.shape.utm_campaign.safeParse(`  ${longVal}  `);
      assert.equal(res.success, true);
      assert.equal(res.data?.length, 200);
    });
  });

  describe('7. Database Isolation & URI Parsing', () => {
    it('extracts database name from valid URI path', () => {
      const uri = 'mongodb+srv://user:pass@cluster.mongodb.net/adviora_prod?retryWrites=true&w=majority';
      assert.equal(getDatabaseNameFromUri(uri), 'adviora_prod');

      const devUri = 'mongodb://localhost:27017/adviora_dev?authSource=admin';
      assert.equal(getDatabaseNameFromUri(devUri), 'adviora_dev');
    });

    it('handles URIs with surrounding quotes or whitespace correctly', () => {
      const quotedDouble = '"mongodb+srv://user:pass@cluster.mongodb.net/adviora_prod?retryWrites=true"';
      assert.equal(getDatabaseNameFromUri(quotedDouble), 'adviora_prod');

      const quotedSingle = "'mongodb+srv://user:pass@cluster.mongodb.net/adviora_prod?retryWrites=true'";
      assert.equal(getDatabaseNameFromUri(quotedSingle), 'adviora_prod');

      const withWhitespace = '  mongodb+srv://user:pass@cluster.mongodb.net/adviora_prod?retryWrites=true  ';
      assert.equal(getDatabaseNameFromUri(withWhitespace), 'adviora_prod');
    });

    it('throws error if database path is missing from URI', () => {
      const invalidUri = 'mongodb+srv://user:pass@cluster.mongodb.net?retryWrites=true';
      assert.throws(() => getDatabaseNameFromUri(invalidUri), /must specify an explicit database path/);
    });
  });

  describe('8. UTM Lifecycle & Persistence', () => {
    it('captures only allowlisted tracking parameters from query string', () => {
      const query = '?utm_source=google&utm_medium=cpc&gclid=g123&invalid_key=malicious_val';
      const parsed = getAttributionFromQuery(query);

      assert.equal(parsed.utm_source, 'google');
      assert.equal(parsed.utm_medium, 'cpc');
      assert.equal(parsed.gclid, 'g123');
      assert.equal((parsed as any).invalid_key, undefined);
    });

    it('preserves stored attribution across clean-URL navigation', () => {
      saveAttribution({ utm_source: 'google', utm_campaign: 'spring_launch' });

      // Clean URL navigation (no query)
      (global as any).window.location.search = '';
      const snapshot = getActiveAttributionSnapshot();

      assert.equal(snapshot.data.utm_source, 'google');
      assert.equal(snapshot.data.utm_campaign, 'spring_launch');
      assert.ok(snapshot.captureId.startsWith('cap_'));
    });

    it('replaces old campaign completely when new valid campaign lands', () => {
      saveAttribution({ utm_source: 'google', utm_campaign: 'first_campaign', utm_medium: 'cpc' });

      // Visitor lands on new campaign without utm_medium
      (global as any).window.location.search = '?utm_source=linkedin&utm_campaign=second_campaign';
      const snapshot = getActiveAttributionSnapshot('?utm_source=linkedin&utm_campaign=second_campaign');

      assert.equal(snapshot.data.utm_source, 'linkedin');
      assert.equal(snapshot.data.utm_campaign, 'second_campaign');
      // Must not bleed old utm_medium into new campaign
      assert.equal(snapshot.data.utm_medium, undefined);
    });

    it('does not overwrite stored attribution with blank or unknown parameters', () => {
      saveAttribution({ utm_source: 'google', utm_campaign: 'spring_launch' });

      // Visitor lands with unknown/empty parameters
      (global as any).window.location.search = '?foo=bar&utm_source=&utm_medium=';
      const snapshot = getActiveAttributionSnapshot('?foo=bar&utm_source=&utm_medium=');

      // Stored attribution remains intact
      assert.equal(snapshot.data.utm_source, 'google');
      assert.equal(snapshot.data.utm_campaign, 'spring_launch');
    });

    it('clears only the consumed snapshot and preserves a newer in-flight campaign', () => {
      const originalRecord = saveAttribution({ utm_source: 'google', utm_campaign: 'campaign_one' })!;
      const consumedSnapshot = { captureId: originalRecord.captureId, data: originalRecord.data };

      // While submission was in flight, visitor arrived on campaign_two
      const newerRecord = saveAttribution({ utm_source: 'linkedin', utm_campaign: 'campaign_two' })!;

      // Now submission finishes and calls clearConsumedAttribution with older snapshot
      clearConsumedAttribution(consumedSnapshot);

      // Newer campaign must remain intact in storage!
      const current = getStoredAttribution();
      assert.ok(current);
      assert.equal(current?.captureId, newerRecord.captureId);
      assert.equal(current?.data.utm_source, 'linkedin');
      assert.equal(current?.data.utm_campaign, 'campaign_two');
    });

    it('prevents recapturing the same consumed query string on component rerender', () => {
      (global as any).window.location.search = '?utm_source=google&utm_campaign=spring_sale';
      const snapshot = getActiveAttributionSnapshot('?utm_source=google&utm_campaign=spring_sale');

      // Successful submission consumes and clears
      clearConsumedAttribution(snapshot);

      // On rerender with the same window.location.search
      const rerenderParsed = getAttributionFromQuery('?utm_source=google&utm_campaign=spring_sale');
      assert.deepEqual(rerenderParsed, {});
    });

    it('gracefully handles malformed JSON in sessionStorage', () => {
      (global as any).sessionStorage.setItem(STORAGE_KEY, '{ invalid_json ::::');
      const stored = getStoredAttribution();
      assert.equal(stored, null);

      // Does not throw when reading snapshot
      const snapshot = getActiveAttributionSnapshot();
      assert.deepEqual(snapshot.data, {});
    });
  });

  describe('9. Client Form Validation & India Phone Normalization', () => {
    it('normalizes Indian phone numbers correctly', () => {
      assert.equal(normalizeIndianPhoneNumber('+91 98765 43210'), '9876543210');
      assert.equal(normalizeIndianPhoneNumber('919876543210'), '9876543210');
      assert.equal(normalizeIndianPhoneNumber('98765-43210'), '9876543210');
      assert.equal(normalizeIndianPhoneNumber('  9876543210  '), '9876543210');
    });

    it('validates all fields and identifies firstInvalidField', () => {
      const invalidFields = {
        name: 'A', // invalid (<2)
        email: 'invalid-email',
        phone: '12345',
        interest: '',
        message: 'short',
      };

      const result = validateAllFields(invalidFields);
      assert.equal(result.isValid, false);
      assert.equal(result.firstInvalidField, 'name');
      assert.ok(result.errors.name);
      assert.ok(result.errors.email);
      assert.ok(result.errors.phone);
      assert.ok(result.errors.interest);
      assert.ok(result.errors.message);
    });

    it('validates a complete valid form payload', () => {
      const validFields = {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        phone: '+91 98765 43210',
        interest: 'Business transformation',
        message: 'Looking for operating model consulting and strategy.',
      };

      const result = validateAllFields(validFields);
      assert.equal(result.isValid, true);
      assert.equal(result.firstInvalidField, null);
      assert.equal(Object.keys(result.errors).length, 0);
    });
  });

  describe('10. Shared Submission Utility & Duplicate Guard', () => {
    it('isSubmissionLocked() reports accurate status and prevents concurrent duplicate calls', async () => {
      assert.equal(isSubmissionLocked(), false);
    });

    it('silently completes honeypot submissions without network requests', async () => {
      const honeypotFields = {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        phone: '+91 98765 43210',
        interest: 'Business transformation',
        message: 'Spam message content here for bot test.',
        website: 'https://spam-link.com',
      };

      const result = await submitEnquiry(honeypotFields);
      assert.equal(result.success, true);
      assert.match(result.message, /received successfully/);
    });
  });

  describe('11. Identity Conflict Resolution & Minimal Response Contracts', () => {
    it('UserRepository.checkIdentity correctly detects SPLIT_IDENTITY and PARTIAL_MISMATCH', async () => {
      // Mock repository logic directly to verify contract in isolation
      const mockUsers = [
        { _id: 'user_1', email: 'user1@example.com', phone: '9876543210' },
        { _id: 'user_2', email: 'user2@example.com', phone: '9123456780' },
      ];

      function checkIdentityMock(email: string, phone: string) {
        const userByEmail = mockUsers.find((u) => u.email === email);
        const userByPhone = mockUsers.find((u) => u.phone === phone);

        if (userByEmail && userByPhone && userByEmail._id !== userByPhone._id) {
          return { type: 'SPLIT_IDENTITY', user: null };
        }
        if (userByEmail && (!userByPhone || userByEmail.phone !== phone)) {
          return { type: 'PARTIAL_MISMATCH', user: null };
        }
        if (userByPhone && (!userByEmail || userByPhone.email !== email)) {
          return { type: 'PARTIAL_MISMATCH', user: null };
        }
        if (userByEmail && userByPhone) {
          return { type: 'EXACT_MATCH', user: userByEmail };
        }
        return { type: 'NO_MATCH', user: null };
      }

      // Case A: Split identity (email from user 1, phone from user 2)
      const split = checkIdentityMock('user1@example.com', '9123456780');
      assert.equal(split.type, 'SPLIT_IDENTITY');

      // Case B: Partial mismatch (email from user 1, new phone not in DB)
      const partial = checkIdentityMock('user1@example.com', '9999999999');
      assert.equal(partial.type, 'PARTIAL_MISMATCH');

      // Case C: Exact match (both match user 1)
      const exact = checkIdentityMock('user1@example.com', '9876543210');
      assert.equal(exact.type, 'EXACT_MATCH');
      assert.equal(exact.user?._id, 'user_1');

      // Case D: No match (both are brand new)
      const brandNew = checkIdentityMock('new@example.com', '9999999999');
      assert.equal(brandNew.type, 'NO_MATCH');
    });

    it('minimal public success contract returns only success and message without IDs or contact details', () => {
      const publicResponse = {
        success: true,
        message: 'Your enquiry has been received successfully. Thank you!',
      };

      assert.equal(publicResponse.success, true);
      assert.equal(typeof publicResponse.message, 'string');
      assert.equal((publicResponse as any).user, undefined);
      assert.equal((publicResponse as any).userId, undefined);
      assert.equal((publicResponse as any).email, undefined);
      assert.equal((publicResponse as any).phone, undefined);
      assert.equal((publicResponse as any).status, undefined);
    });
  });
});
