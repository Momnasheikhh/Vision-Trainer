import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      message: 'AI Teachable Machine API is running',
      version: '1.0.0',
      features: [
        'Multi-class image classification',
        'Real-time training',
        'Live predictions',
        'Webcam support',
        'Multiple ML algorithms',
      ],
    },
    { status: 200 }
  )
}
