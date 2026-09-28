import { NextRequest } from 'next/server';
import connectToDatabase from '@/server/config/db';
import { UserService } from '@/server/services/user.service';
import { UserRepository } from '@/server/repositories/user.repository';
import { SignupSchema } from '@/server/validators/user.validator';
import { sendPublicSuccess, sendError } from '@/server/utils/response';
import { HTTP_STATUS, ERROR_CODES } from '@/server/config/constants';
import { logger } from '@/server/utils/logger';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      logger.warn('Malformed JSON payload in signup request');
      return sendError(
        'We received an invalid request format. Please try submitting again.',
        ERROR_CODES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Validate request and honeypot BEFORE connecting to MongoDB
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

    if (validationResult.data.website && validationResult.data.website.trim().length > 0) {
      logger.warn('Honeypot field populated; safely rejecting without DB connection');
      return sendError(
        'Invalid request submission.',
        ERROR_CODES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 2. Safe database connection boundary
    try {
      await connectToDatabase();
    } catch (dbErr: any) {
      logger.error('Database connection failed at route boundary');
      return sendError(
        'We could not process your enquiry right now. Please try again shortly.',
        ERROR_CODES.DATABASE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    // 3. Process business logic
    const clientIp = req.headers.get('x-forwarded-for') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;

    await userService.registerUser(validationResult.data, clientIp, userAgent);

    // 4. Return minimal public confirmation (HTTP 200, zero personal details or IDs)
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

    logger.error('Unexpected error in signup route handler');
    return sendError(
      'Oops! Something went wrong on our end. Please try again later.',
      ERROR_CODES.UNKNOWN_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
