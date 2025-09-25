import sharp from 'sharp'

export async function enhanceHairstyleImage(
  generatedImageBuffer: Buffer,
  originalImageBuffer: Buffer
): Promise<Buffer> {
  try {
    // 1. Validate input buffers
    if (!generatedImageBuffer || !originalImageBuffer) {
      throw new Error('Invalid input buffers')
    }

    // 2. Get metadata and validate dimensions
    const generatedMetadata = await sharp(generatedImageBuffer).metadata()
    const originalMetadata = await sharp(originalImageBuffer).metadata()

    if (!generatedMetadata.width || !generatedMetadata.height) {
      throw new Error('Invalid generated image dimensions')
    }

    // 3. Resize original image to match generated image dimensions
    const resizedOriginal = await sharp(originalImageBuffer)
      .resize(generatedMetadata.width, generatedMetadata.height)
      .toBuffer()

    // 4. Create hair mask with more robust processing
    const hairMask = await sharp(generatedImageBuffer)
      .threshold(128)
      .blur(2)
      .toBuffer()

    // 5. Blend images with error handling
    const blended = await sharp(generatedImageBuffer)
      .composite([
        {
          input: resizedOriginal,
          blend: 'over',
          raw: {
            width: generatedMetadata.width,
            height: generatedMetadata.height,
            channels: 4
          }
        }
      ])
      .modulate({
        brightness: 1.05,
        saturation: 0.95
      })
      .sharpen(1.5, 1.2, 0.8)
      .toBuffer()

    // 6. Apply final color grading with error handling
    const final = await sharp(blended)
      .modulate({
        brightness: 1.02,
        saturation: 0.98,
        hue: 0
      })
      .gamma(1.1)
      .toBuffer()

    return final
  } catch (error) {
    console.error('Image processing error:', error)
    // Return the original generated image if processing fails
    return generatedImageBuffer
  }
} 