import { z } from 'zod';

export const ALLOWED_DIGITAL_INTERESTS = [
  'Business transformation',
  'ITSM / AI / digital transformation',
  'Professional training',
] as const;

export type DigitalInterest = (typeof ALLOWED_DIGITAL_INTERESTS)[number];

export const ALLOWLISTED_UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'platform',
  'gclid',
  'fbclid',
  'fbp',
  'fbc',
  'matchtype',
  'network',
  'device',
  'keyword',
  'placement',
  'campaignid',
  'adgroupid',
] as const;

export type AllowlistedUtmKey = (typeof ALLOWLISTED_UTM_KEYS)[number];

function sanitizeTrackingField(val?: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, 200);
}

export const SignupSchema = z
  .object({
    name: z
      .string({ required_error: 'Please enter your name.' })
      .refine((val) => !/[\r\n\t\x00-\x1F\x7F]/.test(val), {
        message: 'Name cannot contain control characters, tabs, or line breaks.',
      })
      .transform((val) => val.trim())
      .refine((val) => val.length >= 2 && val.length <= 60, {
        message: 'Enter your name using 2-60 letters.',
      })
      .refine((val) => /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(val), {
        message: 'Enter your name using 2-60 letters and spaces only.',
      }),

    email: z
      .string({ required_error: 'Please enter your email address.' })
      .trim()
      .max(254, 'Email must be under 254 characters.')
      .email('Enter a valid email address.'),

    phone: z
      .string({ required_error: 'Please enter your mobile number.' })
      .refine(
        (val) => {
          // Reject foreign numbers starting with '+' that do not start with +91
          const trimmed = val.trim();
          if (trimmed.startsWith('+') && !trimmed.startsWith('+91')) {
            return false;
          }
          return true;
        },
        { message: 'Only Indian mobile numbers (+91) are currently accepted.' }
      )
      .transform((val) => {
        let cleaned = val.trim();
        // Remove +91 prefix
        if (cleaned.startsWith('+91')) {
          cleaned = cleaned.slice(3);
        } else if (cleaned.startsWith('91') && cleaned.replace(/\D/g, '').length === 12) {
          cleaned = cleaned.replace(/\D/g, '').slice(2);
        }
        // Remove all non-digits
        return cleaned.replace(/\D/g, '');
      })
      .refine((val) => /^[6-9]\d{9}$/.test(val), {
        message: 'Enter a valid 10-digit Indian mobile number beginning with 6-9.',
      }),

    interest: z.enum(ALLOWED_DIGITAL_INTERESTS, {
      errorMap: () => ({ message: 'Please choose an area of interest from the available services.' }),
    }),

    message: z
      .string({ required_error: 'Please describe what you would like to achieve.' })
      .transform((val) => val.trim())
      .refine((val) => val.length >= 10, {
        message: 'Please describe your goals in at least 10 characters.',
      })
      .refine((val) => val.length <= 600, {
        message: 'Keep your message within 600 characters.',
      }),

    countryCode: z
      .string()
      .trim()
      .default('+91')
      .refine((val) => val === '+91', {
        message: 'Only Indian country code (+91) is supported.',
      }),

    timezone: z.string().trim().max(100).default('Asia/Kolkata'),
    route: z.string().trim().max(200).optional(),

    // Server-side honeypot
    website: z.string().optional(),

    // 17 Approved tracking parameters
    utm_source: z.unknown().transform(sanitizeTrackingField),
    utm_medium: z.unknown().transform(sanitizeTrackingField),
    utm_campaign: z.unknown().transform(sanitizeTrackingField),
    utm_content: z.unknown().transform(sanitizeTrackingField),
    utm_term: z.unknown().transform(sanitizeTrackingField),
    platform: z.unknown().transform(sanitizeTrackingField),
    gclid: z.unknown().transform(sanitizeTrackingField),
    fbclid: z.unknown().transform(sanitizeTrackingField),
    fbp: z.unknown().transform(sanitizeTrackingField),
    fbc: z.unknown().transform(sanitizeTrackingField),
    matchtype: z.unknown().transform(sanitizeTrackingField),
    network: z.unknown().transform(sanitizeTrackingField),
    device: z.unknown().transform(sanitizeTrackingField),
    keyword: z.unknown().transform(sanitizeTrackingField),
    placement: z.unknown().transform(sanitizeTrackingField),
    campaignid: z.unknown().transform(sanitizeTrackingField),
    adgroupid: z.unknown().transform(sanitizeTrackingField),
  });

export const UserDetailsQuerySchema = z
  .object({
    range: z.enum(['today', 'yesterday', '7days', '1month', 'custom']).default('today'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().regex(/^\d+$/).default('1').transform(Number),
    limit: z.string().regex(/^\d+$/).default('10').transform(Number),
  })
  .refine(
    (data) => {
      if (data.range === 'custom') {
        return !!data.startDate && !!data.endDate;
      }
      return true;
    },
    {
      message: "startDate and endDate are required when range is 'custom'",
      path: ['range'],
    }
  );
