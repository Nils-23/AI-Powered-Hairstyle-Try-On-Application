import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import type { ProcessingResult } from "@/types"
import { enhanceHairstyleImage } from '@/lib/image-processing'
import { generatePrompt } from '@/lib/generatePrompt'
import hairstyleDescriptions from '@/data/hairstyle-descriptions.json'
import sharp from 'sharp'

// Define the HairstyleConfig type
type HairstyleConfig = {
  image: string
  hairstyleId: string
}

// Define model output types
type ModelOutput = string | ReadableStream

type SegmentationResult = {
  mask: string
  confidence: number
}

type IPAdapterResult = {
  image: string
  confidence: number
}

// Replicate model IDs
const MODELS = {
  PHOTO_MAKER: "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4" as const,
  SEGMENTATION: "yyjim/segment-anything-everything:b28e02c3844df2c44dcb2cb96ba2496435681bf88878e3bd0ab6b401a971d79e" as const,
  IP_ADAPTER: "lucataco/ip-adapter-faceid:fb81ef963e74776af72e6f380949013533d46dd5c6228a9e586c57db6303d7cd" as const,
}

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    // Check for API token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("Replicate API token not configured")
      return NextResponse.json(
        { 
          success: false, 
          error: "AI service not configured. Please add your Replicate API token to .env.local" 
        }, 
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const hairstyleId = formData.get("hairstyleId") as string
    const feedback = formData.get("feedback") as string
    const hairstyleDescription = (hairstyleDescriptions as any)[hairstyleId] || 'Apply a professional hairstyle.'
    
    // Enhance prompt with feedback if provided
    let prompt = generatePrompt(hairstyleDescription)
    if (feedback) {
      prompt = `${prompt}\n\nUser feedback: ${feedback}`
    }

    if (!image || !hairstyleId) {
      console.error("Missing required parameters:", { hasImage: !!image, hairstyleId })
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Validate image size
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer()
    const imageBase64 = `data:${image.type};base64,${Buffer.from(imageBuffer).toString("base64")}`

    // Step 1: Get hair segmentation mask
    console.log("Getting hair segmentation mask...")
    const segmentationOutput = await replicate.run(MODELS.SEGMENTATION, {
      input: {
        image: imageBase64,
        mask_limit: -1,
        box_nms_thresh: 0.7,
        crop_nms_thresh: 0.7,
        points_per_side: 32,
        pred_iou_thresh: 0.88,
        crop_overlap_ratio: 0.3413333333333333,
        stability_score_offset: 1,
        stability_score_thresh: 0.95,
        crop_n_points_downscale_factor: 1
      },
    }) as SegmentationResult

    // Step 2: Generate hairstyle with IP-Adapter for feature preservation
    console.log("Generating hairstyle with IP-Adapter...")
    const ipAdapterOutput = await replicate.run(MODELS.IP_ADAPTER, {
      input: {
        face_image: imageBase64,
        prompt: `${prompt}, preserve exact facial features, skin tone, and expression, maintain original pose`,
        negative_prompt: "monochrome, lowres, bad anatomy, worst quality, low quality, blurry, multiple people, change facial features, alter skin tone, modify expression, change pose, alter face shape, modify jawline, change eye shape, modify nose, change mouth shape",
        width: 1024,
        height: 1024,
        num_inference_steps: 30,
        num_outputs: 1,
        agree_to_research_only: true
      },
    }) as IPAdapterResult

    // Step 3: Generate final hairstyle with PhotoMaker using segmentation mask
    console.log("Generating final hairstyle with PhotoMaker...")
    const output = await replicate.run(MODELS.PHOTO_MAKER, {
      input: {
        input_image: imageBase64,
        mask: segmentationOutput.mask,
        prompt: `${prompt}, preserve exact facial features, skin tone, and expression, maintain original pose`,
        negative_prompt: "change facial features, alter skin tone, modify expression, change pose, alter face shape, modify jawline, change eye shape, modify nose, change mouth shape",
        width: 512,
        height: 512,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        num_outputs: 1,
        scheduler: "K_EULER_ANCESTRAL",
        seed: Math.floor(Math.random() * 1000000),
      },
    })

    if (Array.isArray(output) && output.length > 0) {
      const resultImageUrl = output[0]
      
      // Handle ReadableStream output from PhotoMaker model
      if (resultImageUrl instanceof ReadableStream) {
        const chunks: Uint8Array[] = []
        const reader = resultImageUrl.getReader()
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }
        
        const generatedImageBuffer = Buffer.concat(chunks)
        
        // Get the original image buffer
        const originalImageResponse = await fetch(imageBase64)
        if (!originalImageResponse.ok) {
          throw new Error('Failed to fetch original image')
        }
        const originalImageArrayBuffer = await originalImageResponse.arrayBuffer()
        const originalImageBuffer = Buffer.from(originalImageArrayBuffer)
        
        // Validate buffers before processing
        if (generatedImageBuffer.length === 0 || originalImageBuffer.length === 0) {
          throw new Error('Invalid image buffers')
        }

        try {
          // First, ensure the generated image is in a valid format
          const processedGeneratedImage = await sharp(generatedImageBuffer)
            .toFormat('jpeg')
            .toBuffer()
          
          // Then enhance the image
          const enhancedImageBuffer = await enhanceHairstyleImage(processedGeneratedImage, originalImageBuffer)
          
          // Convert to base64
          const base64Image = `data:image/jpeg;base64,${enhancedImageBuffer.toString('base64')}`
          
          const result: ProcessingResult = {
            success: true,
            resultImageUrl: base64Image,
            processingId: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }

          return NextResponse.json(result)
        } catch (error) {
          console.error('Image processing error:', error)
          // If processing fails, return the original generated image
          const base64Image = `data:image/jpeg;base64,${generatedImageBuffer.toString('base64')}`
          return NextResponse.json({
            success: true,
            resultImageUrl: base64Image,
            processingId: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          })
        }
      }
    }

    throw new Error("Failed to generate hairstyle preview")
  } catch (error) {
    console.error("Error in hairstyle generation:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate hairstyle preview. Please try again." 
      }, 
      { status: 500 }
    )
  }
}
