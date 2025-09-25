"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { validateImageFile, createImagePreview } from "@/lib/utils"
import type { UploadedImage } from "@/types"

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void
  uploadedImage: UploadedImage | null
}

export default function ImageUpload({ onImageUpload, uploadedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true)

      const validation = validateImageFile(file)

      if (!validation.isValid) {
        onImageUpload({
          file,
          preview: "",
          isValid: false,
          error: validation.error,
        })
        setIsProcessing(false)
        return
      }

      try {
        const preview = await createImagePreview(file)
        onImageUpload({
          file,
          preview,
          isValid: true,
        })
      } catch (error) {
        onImageUpload({
          file,
          preview: "",
          isValid: false,
          error: "Failed to process image",
        })
      }

      setIsProcessing(false)
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const clearImage = useCallback(() => {
    onImageUpload({
      file: new File([], ""),
      preview: "",
      isValid: false,
    })
  }, [onImageUpload])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-semibold">Upload Your Photo</h3>
            <p className="text-sm text-muted-foreground">Upload a clear selfie to try on different hairstyles</p>
          </div>

          {uploadedImage?.preview ? (
            <div className="relative">
              <img
                src={uploadedImage.preview || "/placeholder.svg"}
                alt="Uploaded selfie"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isProcessing ? "Processing..." : "Drop your image here, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">Supports JPEG, PNG, WebP (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
            </div>
          )}

          {uploadedImage?.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{uploadedImage.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
