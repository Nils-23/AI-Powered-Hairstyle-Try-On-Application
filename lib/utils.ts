import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image validation utilities
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload a JPEG, PNG, or WebP image file",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size must be less than 5MB",
    }
  }

  return { isValid: true }
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Generate shareable link (mock implementation)
export function generateShareableLink(resultId: string): string {
  return `${window.location.origin}/result/${resultId}`
}

// Download image utility
export async function downloadImage(imageUrl: string, filename = "hairstyle-preview.jpg") {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading image:", error)
    throw new Error("Failed to download image")
  }
}
