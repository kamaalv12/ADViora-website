export const STORAGE_KEY = 'adviora_attribution_v1';

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

export interface StoredAttributionRecord {
  captureId: string;
  capturedAt: number;
  data: Record<string, string>;
}

export interface AttributionSnapshot {
  captureId: string;
  data: Record<string, string>;
}

// In-memory guard to prevent immediately recapturing consumed URL query parameters on rerenders
let consumedQueryString: string | null = null;

function generateCaptureId(): string {
  return `cap_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Parses and sanitizes approved tracking parameters from a query string.
 * Enforces:
 * - 17 allowlisted keys only
 * - Trimmed strings, max 200 characters
 * - Omission of empty or whitespace-only parameters
 * - Unknown parameters completely ignored
 */
export function getAttributionFromQuery(queryString?: string): Record<string, string> {
  const query =
    typeof queryString === 'string'
      ? queryString
      : typeof window !== 'undefined'
        ? window.location.search
        : '';

  if (!query) return {};

  // If this exact query was already consumed by a successful submission, do not recapture it on rerenders
  if (consumedQueryString && query === consumedQueryString) {
    return {};
  }

  try {
    const params = new URLSearchParams(query);
    const result: Record<string, string> = {};

    for (const key of ALLOWLISTED_UTM_KEYS) {
      const val = params.get(key);
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.length > 0) {
          result[key] = trimmed.slice(0, 200);
        }
      }
    }

    return result;
  } catch {
    return {};
  }
}

/**
 * Safely reads stored attribution from sessionStorage.
 * Handles storage unavailability, malformed JSON, and invalid structures safely.
 */
export function getStoredAttribution(): StoredAttributionRecord | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      typeof parsed.captureId !== 'string' ||
      !parsed.data ||
      typeof parsed.data !== 'object'
    ) {
      // Clear malformed data
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const validatedData: Record<string, string> = {};
    for (const key of ALLOWLISTED_UTM_KEYS) {
      const val = parsed.data[key];
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.length > 0) {
          validatedData[key] = trimmed.slice(0, 200);
        }
      }
    }

    if (Object.keys(validatedData).length === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      captureId: parsed.captureId,
      capturedAt: typeof parsed.capturedAt === 'number' ? parsed.capturedAt : Date.now(),
      data: validatedData,
    };
  } catch {
    return null;
  }
}

/**
 * Saves sanitized tracking data to sessionStorage with a unique captureId.
 * Blank or empty tracking objects will NOT overwrite existing stored attribution.
 */
export function saveAttribution(data: Record<string, string>): StoredAttributionRecord | null {
  if (typeof window === 'undefined') return null;

  const sanitized: Record<string, string> = {};
  for (const key of ALLOWLISTED_UTM_KEYS) {
    const val = data[key];
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.length > 0) {
        sanitized[key] = trimmed.slice(0, 200);
      }
    }
  }

  // Blank or empty tracking data must NOT overwrite valid stored attribution
  if (Object.keys(sanitized).length === 0) {
    return null;
  }

  const record: StoredAttributionRecord = {
    captureId: generateCaptureId(),
    capturedAt: Date.now(),
    data: sanitized,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch {
    // Gracefully handle storage errors (e.g. private mode, quota exceeded)
    return record;
  }
}

/**
 * Captures landing attribution from URL and persists it if new valid tracking is present.
 */
export function captureAndPersistAttribution(queryString?: string): StoredAttributionRecord | null {
  const fromQuery = getAttributionFromQuery(queryString);
  if (Object.keys(fromQuery).length > 0) {
    return saveAttribution(fromQuery);
  }
  return null;
}

/**
 * Retrieves the active attribution snapshot to be consumed by an enquiry submission:
 * - If current URL has valid, unconsumed tracking parameters, saves and returns that touchpoint.
 * - Otherwise falls back to stored attribution from sessionStorage.
 * - If neither is present, returns an empty snapshot.
 */
export function getActiveAttributionSnapshot(queryString?: string): AttributionSnapshot {
  const fromQuery = getAttributionFromQuery(queryString);
  if (Object.keys(fromQuery).length > 0) {
    const saved = saveAttribution(fromQuery);
    return {
      captureId: saved?.captureId || generateCaptureId(),
      data: fromQuery,
    };
  }

  const stored = getStoredAttribution();
  if (stored && Object.keys(stored.data).length > 0) {
    return {
      captureId: stored.captureId,
      data: stored.data,
    };
  }

  return {
    captureId: '',
    data: {},
  };
}

/**
 * Clears only the attribution snapshot consumed by a verified successful submission.
 * Compares unique captureId: if a newer in-flight campaign arrived while submission was pending,
 * the newer campaign remains preserved in sessionStorage.
 */
export function clearConsumedAttribution(snapshot: AttributionSnapshot): void {
  if (typeof window === 'undefined') return;

  // Mark the current URL query as consumed to prevent immediate re-capture on rerender
  if (window.location.search) {
    consumedQueryString = window.location.search;
  }

  if (!snapshot.captureId) {
    return;
  }

  try {
    const current = getStoredAttribution();
    if (current && current.captureId === snapshot.captureId) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors safely
  }
}

/**
 * Resets the in-memory consumed query tracker (useful for testing or navigation).
 */
export function resetConsumedQueryTracker(): void {
  consumedQueryString = null;
}
