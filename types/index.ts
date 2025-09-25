export interface HairstyleOption {
  id: string
  name: string
  description: string
  imageUrl: string
  category: "short" | "medium" | "long" | "curly" | "straight" | "natural"
}

export interface ProcessingResult {
  success: boolean
  resultImageUrl?: string
  error?: string
  processingId?: string
}

export interface UploadedImage {
  file: File
  preview: string
  isValid: boolean
  error?: string
}
