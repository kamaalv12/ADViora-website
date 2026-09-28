import { FormFields, normalizeIndianPhoneNumber } from './validation';
import { getActiveAttributionSnapshot, clearConsumedAttribution, AttributionSnapshot } from './utm';

export interface SubmissionResult {
  success: boolean;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

// Synchronous module-level guard to prevent rapid duplicate requests
let isSubmissionInProgress = false;

export function isSubmissionLocked(): boolean {
  return isSubmissionInProgress;
}

/**
 * Shared enquiry submission utility for inline form and popup modal.
 * Enforces:
 * - Synchronous duplicate submission prevention
 * - Server honeypot preservation & client-side abort
 * - Automatic timeout (12s) with NO automatic POST retries
 * - Attribution snapshot consumption and clearing only upon verified HTTP 200 success
 * - Full attribution preservation on validation/network/timeout/API failures
 */
export async function submitEnquiry(fields: FormFields): Promise<SubmissionResult> {
  if (isSubmissionInProgress) {
    return {
      success: false,
      message: 'A submission is currently in progress. Please wait a moment.',
      code: 'DUPLICATE_SUBMISSION',
    };
  }

  // Honeypot check: If populated by a bot, silently complete without network request
  if (fields.website && fields.website.trim().length > 0) {
    return {
      success: true,
      message: 'Your enquiry has been received successfully. Thank you!',
    };
  }

  isSubmissionInProgress = true;

  // Capture active attribution snapshot
  const snapshot: AttributionSnapshot = getActiveAttributionSnapshot();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const route = typeof window !== 'undefined' ? window.location.pathname : '/';

    let timezone = 'Asia/Kolkata';
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
      }
    } catch {
      timezone = 'Asia/Kolkata';
    }

    const phoneDigits = normalizeIndianPhoneNumber(fields.phone);

    const payload: Record<string, any> = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: phoneDigits,
      interest: fields.interest,
      message: fields.message.trim(),
      countryCode: '+91',
      timezone,
      route,
      ...snapshot.data,
    };

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let resJson: any;
    try {
      resJson = await response.json();
    } catch {
      // Non-JSON response received
      return {
        success: false,
        message: 'Unexpected server response format. Please try again later or contact us directly.',
        code: 'INVALID_RESPONSE',
      };
    }

    // Verify approved success contract: HTTP 200 and success === true
    if (response.status === 200 && resJson && resJson.success === true) {
      // Clear ONLY the consumed attribution snapshot
      clearConsumedAttribution(snapshot);

      return {
        success: true,
        message:
          typeof resJson.message === 'string' && resJson.message.trim().length > 0
            ? resJson.message
            : 'Your enquiry has been received successfully. Thank you!',
      };
    }

    // Extract structured field validation errors if provided by server
    const fieldErrors: Record<string, string> = {};
    if (resJson && resJson.errors && typeof resJson.errors === 'object') {
      for (const [key, val] of Object.entries(resJson.errors)) {
        if (
          val &&
          typeof val === 'object' &&
          Array.isArray((val as any)._errors) &&
          (val as any)._errors.length > 0
        ) {
          fieldErrors[key] = (val as any)._errors[0];
        }
      }
    }

    return {
      success: false,
      message:
        resJson?.message ||
        'Unable to process your enquiry. Please verify your details or contact us directly.',
      code: resJson?.code || 'SUBMISSION_ERROR',
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err?.name === 'AbortError') {
      return {
        success: false,
        message: 'The request took longer than expected. Please check your connection or contact us directly on WhatsApp or email.',
        code: 'TIMEOUT',
      };
    }

    return {
      success: false,
      message: 'Network connection failed. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR',
    };
  } finally {
    isSubmissionInProgress = false;
  }
}
