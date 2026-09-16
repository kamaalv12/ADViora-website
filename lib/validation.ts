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

export function validateField(id: keyof FormFields, value: string): string {
  const trimmed = value.trim();

  switch (id) {
    case 'name':
      if (!trimmed) return 'Please enter your name.';
      if (trimmed.length < 2) return 'Please enter at least 2 characters.';
      if (trimmed.length > 80) return 'Name cannot exceed 80 characters.';
      return '';

    case 'email':
      if (!trimmed) return 'Please enter your email.';
      if (trimmed.length > 254) return 'Email address is too long (maximum 254 characters).';
      // Sensible RFC 5322 compatible email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return 'Enter a valid email address.';
      return '';

    case 'phone':
      if (!trimmed) return 'Please enter your mobile number.';
      const phoneDigits = trimmed.replace(/\D/g, '');
      if (phoneDigits.length < 8) return 'Please enter a valid mobile number (minimum 8 digits).';
      if (phoneDigits.length > 15) return 'Mobile number cannot exceed 15 digits.';
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
      if (!phoneRegex.test(trimmed)) return 'Enter a valid mobile number (e.g. +91 98765 43210).';
      return '';

    case 'interest':
      if (!trimmed) return 'Please choose an area.';
      if (!ALLOWED_INTERESTS.includes(trimmed as InterestArea)) {
        return 'Please choose a valid area of interest.';
      }
      return '';

    case 'message':
      if (!trimmed) return 'Please enter your goals.';
      if (trimmed.length < 10) return 'Please use at least 10 characters.';
      if (trimmed.length > 1500) return 'Message cannot exceed 1500 characters.';
      return '';

    case 'website':
      return '';

    default:
      return '';
  }
}

export function validateAllFields(fields: FormFields): { isValid: boolean; errors: FormErrors; firstInvalidField: keyof FormFields | null } {
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
