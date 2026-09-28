import { ALLOWED_INTERESTS, InterestArea } from './data';

export interface FormFields {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  website?: string; // honeypot
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

/**
 * Normalizes an Indian phone number:
 * - Strips +91 prefix
 * - Strips leading 91 if total length is 12 digits
 * - Strips all non-digit characters
 */
export function normalizeIndianPhoneNumber(value: string): string {
  let cleaned = value.trim();
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.replace(/\D/g, '').length === 12) {
    cleaned = cleaned.replace(/\D/g, '').slice(2);
  }
  return cleaned.replace(/\D/g, '');
}

export function validateField(id: keyof FormFields, value: string): string {
  // Check for control characters before trimming so leading/trailing tabs or newlines are rejected
  if (id === 'name' && /[\r\n\t\x00-\x1F\x7F]/.test(value)) {
    return 'Name cannot contain control characters, tabs, or line breaks.';
  }

  const trimmed = value.trim();

  switch (id) {
    case 'name':
      if (!trimmed) return 'Please enter your name.';
      if (trimmed.length < 2 || trimmed.length > 60) {
        return 'Enter your name using 2-60 letters.';
      }
      if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmed)) {
        return 'Enter your name using 2-60 letters and spaces only.';
      }
      return '';

    case 'email':
      if (!trimmed) return 'Please enter your email.';
      if (trimmed.length > 254) return 'Email address is too long (maximum 254 characters).';
      // RFC 5322 compatible email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return 'Enter a valid email address.';
      return '';

    case 'phone':
      if (!trimmed) return 'Please enter your mobile number.';
      if (trimmed.startsWith('+') && !trimmed.startsWith('+91')) {
        return 'Only Indian mobile numbers (+91) are currently accepted.';
      }
      const normalizedDigits = normalizeIndianPhoneNumber(trimmed);
      if (!/^[6-9]\d{9}$/.test(normalizedDigits)) {
        return 'Enter a valid 10-digit Indian mobile number beginning with 6-9.';
      }
      return '';

    case 'interest':
      if (!trimmed) return 'Please choose an area.';
      if (!ALLOWED_INTERESTS.includes(trimmed as InterestArea)) {
        return 'Please choose a valid area of interest.';
      }
      return '';

    case 'message':
      if (!trimmed) return 'Please describe what you would like to achieve.';
      if (trimmed.length < 10) return 'Please describe your goals in at least 10 characters.';
      if (trimmed.length > 600) return 'Keep your message within 600 characters.';
      return '';

    case 'website':
      return '';

    default:
      return '';
  }
}

export function validateAllFields(fields: FormFields): {
  isValid: boolean;
  errors: FormErrors;
  firstInvalidField: keyof FormFields | null;
} {
  const errors: FormErrors = {};
  let firstInvalidField: keyof FormFields | null = null;

  const nameError = validateField('name', fields.name);
  if (nameError) {
    errors.name = nameError;
    if (!firstInvalidField) firstInvalidField = 'name';
  }

  const emailError = validateField('email', fields.email);
  if (emailError) {
    errors.email = emailError;
    if (!firstInvalidField) firstInvalidField = 'email';
  }

  const phoneError = validateField('phone', fields.phone);
  if (phoneError) {
    errors.phone = phoneError;
    if (!firstInvalidField) firstInvalidField = 'phone';
  }

  const interestError = validateField('interest', fields.interest);
  if (interestError) {
    errors.interest = interestError;
    if (!firstInvalidField) firstInvalidField = 'interest';
  }

  const messageError = validateField('message', fields.message);
  if (messageError) {
    errors.message = messageError;
    if (!firstInvalidField) firstInvalidField = 'message';
  }

  const isValid = Object.keys(errors).length === 0 && !fields.website;

  return { isValid, errors, firstInvalidField };
}
