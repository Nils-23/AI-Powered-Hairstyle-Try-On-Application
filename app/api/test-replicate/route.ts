import { NextResponse } from "next/server"
import Replicate from "replicate"

export async function GET() {
  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Log token presence (but not the actual token for security)
    console.log("API Token present:", !!process.env.REPLICATE_API_TOKEN)
    console.log("API Token format valid:", process.env.REPLICATE_API_TOKEN?.startsWith('r8_'))

    // Make a simple API call to test the connection
    const testModel = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
    const output = await replicate.run(testModel, {
      input: {
        prompt: "a simple test image",
        num_outputs: 1,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Replicate API connection successful",
      output,
    })
  } catch (error: any) {
    console.error("Replicate API test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.response?.data || "No additional details available",
      },
      { status: 500 }
    )
  }
} 