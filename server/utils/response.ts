import { NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/server/config/constants';

export const sendPublicSuccess = (
  message = 'Your enquiry has been received successfully. Thank you!',
  status: number = HTTP_STATUS.OK
) => {
  return NextResponse.json(
    {
      success: true,
      message,
    },
    { status }
  );
};

export const sendError = (
  message = 'Error',
  code = 'UNKNOWN_ERROR',
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: any
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
};
