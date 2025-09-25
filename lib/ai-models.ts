// AI Model configurations for different hairstyle generation approaches
export interface AIModelConfig {
  name: string
  version: string
  description: string
  inputParams: Record<string, any>
  isAvailable: boolean
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  photomaker: {
    name: "PhotoMaker",
    version: "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
    description: "High-quality portrait generation with style transfer",
    inputParams: {
      num_steps: 50,
      style_strength_ratio: 20,
      guidance_scale: 5,
      num_outputs: 1,
    },
    isAvailable: true,
  },
  instantid: {
    name: "InstantID",
    version: "instantx/instantid:9c0c4c0b5b0c4c0b5b0c4c0b5b0c4c0b5b0c4c0b",
    description: "Face-preserving style transfer with ControlNet",
    inputParams: {
      width: 512,
      height: 512,
      num_inference_steps: 30,
      guidance_scale: 7.5,
      ip_adapter_scale: 0.8,
      controlnet_conditioning_scale: 0.8,
      scheduler: "K_EULER_ANCESTRAL",
    },
    isAvailable: true,
  },
  faceswap: {
    name: "Face Swap",
    version: "yan-ops/face_swap:d5900f9ebed33e7ae6ba1c1421b2a14cd3f1be2e8b5f2f3b8e4b5b5b5b5b5b5b",
    description: "Advanced face swapping with hairstyle preservation",
    inputParams: {
      guidance_scale: 7.5,
      num_inference_steps: 25,
      strength: 0.8,
    },
    isAvailable: false, // Enable when model is available
  },
}

export function getAvailableModels(): AIModelConfig[] {
  return Object.values(AI_MODELS).filter((model) => model.isAvailable)
}

export function getModelByName(name: string): AIModelConfig | null {
  return AI_MODELS[name] || null
}

// Enhanced prompt engineering for better hairstyle generation
export function generateHairstylePrompt(hairstyleId: string, gender: "male" | "unisex" = "unisex"): string {
  const basePrompts = {
    "classic-fade": {
      male: "professional classic fade haircut, short tapered sides, clean sharp lines, modern barbershop style",
      unisex: "classic fade haircut with clean lines, professional barbershop style, well-groomed",
    },
    "modern-quiff": {
      male: "stylish modern quiff hairstyle, voluminous textured top, contemporary men's cut, professional styling",
      unisex: "modern quiff hairstyle with textured volume, contemporary professional styling",
    },
    "textured-crop": {
      male: "textured crop haircut, natural texture, short trendy modern style, well-styled",
      unisex: "textured crop haircut with natural texture, modern trendy style",
    },
    "long-layers": {
      male: "long layered hairstyle, flowing natural layers, shoulder length with movement",  
      unisex: "long layered hairstyle with flowing natural layers, shoulder length hair",
    },
    "curly-top": {
      male: "curly top fade, natural textured curls on top, faded sides, well-maintained curly hair",
      unisex: "natural curly hairstyle with defined texture, well-maintained curls",
    },
  }

  const stylePrompts = basePrompts[hairstyleId as keyof typeof basePrompts]
  if (!stylePrompts) {
    return basePrompts["classic-fade"][gender]
  }

  return stylePrompts[gender]
}

// Quality enhancement prompts
export const QUALITY_PROMPTS = {
  positive:
    "high quality portrait photography, professional lighting, sharp focus, detailed hair texture, natural skin tone, photorealistic, 4k resolution, studio quality, full face and hairtyle visible without being zoomed in",
  negative:
    "blurry, low quality, distorted face, deformed, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, ugly, bad proportions, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, out of frame, low resolution, pixelated, oversaturated, undersaturated, overexposed, underexposed",
}
