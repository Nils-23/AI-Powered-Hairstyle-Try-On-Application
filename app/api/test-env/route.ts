import { NextResponse } from "next/server"

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const hasToken = !!process.env.REPLICATE_API_TOKEN
  const tokenLength = process.env.REPLICATE_API_TOKEN?.length || 0

  return NextResponse.json({
    hasToken,
    tokenLength: hasToken ? tokenLength : 0,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
