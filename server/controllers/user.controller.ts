import { UserService } from '@/server/services/user.service';
import { sendPublicSuccess, sendError } from '@/server/utils/response';
import { SignupSchema, UserDetailsQuerySchema } from '@/server/validators/user.validator';
import { HTTP_STATUS, ERROR_CODES } from '@/server/config/constants';
import { NextRequest } from 'next/server';
import { logger } from '@/server/utils/logger';

export class UserController {
  constructor(private service: UserService) {}

  async signup(req: NextRequest) {
    try {
      let body: any;
      try {
        body = await req.json();
      } catch (err) {
        logger.warn('Malformed JSON payload in signup request');
        return sendError(
          'We received an invalid request format. Please try submitting again.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // 1. Validate payload using SignupSchema
      const validationResult = SignupSchema.safeParse(body);
      if (!validationResult.success) {
        logger.warn('Signup validation failed');
        return sendError(
          'Please check your details and try again. Some information seems to be missing or incorrect.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validationResult.error.format()
        );
      }

      // 2. Server-side honeypot check (reject before DB operations, never log or persist)
      if (validationResult.data.website && validationResult.data.website.trim().length > 0) {
        logger.warn('Honeypot field triggered in signup request');
        return sendError(
          'Invalid request submission.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const clientIp = req.headers.get('x-forwarded-for') || undefined;
      const userAgent = req.headers.get('user-agent') || undefined;

      // 3. Process registration / enquiry in service
      await this.service.registerUser(validationResult.data, clientIp, userAgent);

      // 4. Return minimal public confirmation (HTTP 200, zero PII or user IDs)
      return sendPublicSuccess(
        'Your enquiry has been received successfully. Thank you!',
        HTTP_STATUS.OK
      );
    } catch (error: any) {
      if (error?.message === 'IDENTITY_CONFLICT' || error?.code === 'IDENTITY_CONFLICT') {
        return sendError(
          'Unable to process enquiry with the provided contact details. Please verify your information or contact us directly.',
          ERROR_CODES.IDENTITY_CONFLICT,
          HTTP_STATUS.CONFLICT
        );
      }

      logger.error('Error during signup processing');
      return sendError(
        'Oops! Something went wrong on our end. Please try again later.',
        ERROR_CODES.UNKNOWN_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserDetails(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const query = Object.fromEntries(searchParams.entries());

      const validationResult = UserDetailsQuerySchema.safeParse(query);
      if (!validationResult.success) {
        return sendError(
          'Please check the selected date range and try again.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validationResult.error.format()
        );
      }

      const result = await this.service.getUserDetails(validationResult.data);
      return sendPublicSuccess('User details loaded successfully.', HTTP_STATUS.OK);
    } catch (error: any) {
      logger.error('Error fetching user details');
      return sendError(
        'Oops! Something went wrong while loading the data. Please try again later.',
        ERROR_CODES.UNKNOWN_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
