import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.SWELL_STORE_ID || !process.env.SWELL_PUBLIC_KEY) {
    return NextResponse.json(
      { error: 'Swell configuration missing' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'success',
    config: {
      storeId: process.env.SWELL_STORE_ID,
      publicKey: process.env.SWELL_PUBLIC_KEY ? '*****' : undefined,
      isConfigured: Boolean(process.env.SWELL_STORE_ID && process.env.SWELL_PUBLIC_KEY)
    }
  });
}
