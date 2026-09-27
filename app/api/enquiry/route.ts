import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Prepared for database recording
    if (!data.name || !data.email || !data.interest || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required enquiry fields' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry received successfully',
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          interest: data.interest,
          message: data.message,
          receivedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
