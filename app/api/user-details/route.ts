import { NextRequest } from 'next/server';
import { sendError } from '@/server/utils/response';
import { HTTP_STATUS, ERROR_CODES } from '@/server/config/constants';

/**
 * Privileged reporting endpoint.
 * Guarded against public access in the landing-page repository.
 */
export async function GET(_req: NextRequest) {
  return sendError(
    'Access denied. Reporting endpoints are restricted to authorized management systems.',
    ERROR_CODES.FORBIDDEN,
    HTTP_STATUS.FORBIDDEN
  );
}
