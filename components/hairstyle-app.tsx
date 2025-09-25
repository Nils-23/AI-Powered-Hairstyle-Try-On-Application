"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import ImageUpload from "./image-upload"
import HairstyleGallery from "./hairstyle-gallery"
import ResultDisplay from "./result-display"
import type { UploadedImage, HairstyleOption, ProcessingResult } from "@/types"

type AppStep = "upload" | "select" | "processing" | "result"

export default function HairstyleApp() {
  const [currentStep, setCurrentStep] = useState<AppStep>("upload")
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleOption | null>(null)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [remainingRetries, setRemainingRetries] = useState(2)

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image)
    if (image.isValid) {
      setCurrentStep("select")
    }
  }

  const handleHairstyleSelect = (hairstyle: HairstyleOption) => {
    setSelectedHairstyle(hairstyle)
  }

  const handleProcessHairstyle = async (feedback?: string) => {
    if (!uploadedImage?.file || !selectedHairstyle) return

    setIsProcessing(true)
    setCurrentStep("processing")

    try {
      const formData = new FormData()
      formData.append("image", uploadedImage.file)
      formData.append("hairstyleId", selectedHairstyle.id)
      if (feedback) {
        formData.append("feedback", feedback)
      }

      const response = await fetch("/api/generate-hairstyle", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate hairstyle")
      }

      const result = await response.json()
      setProcessingResult(result)
      setCurrentStep("result")
    } catch (error) {
      console.error("Error generating hairstyle:", error)
      // Handle error appropriately
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = async (feedback: string) => {
    if (remainingRetries > 0) {
      setRemainingRetries(prev => prev - 1)
      await handleProcessHairstyle(feedback)
    }
  }

  const handleStartOver = () => {
    setCurrentStep("upload")
    setUploadedImage(null)
    setSelectedHairstyle(null)
    setProcessingResult(null)
    setRemainingRetries(2)
  }

  const handleTryAnother = () => {
    if (remainingRetries === 0) {
      setCurrentStep("select")
      setProcessingResult(null)
      setRemainingRetries(2)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {["upload", "select", "result"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step ||
                    (["select", "processing", "result"].includes(currentStep) && step === "upload") ||
                    (["processing", "result"].includes(currentStep) && step === "select") ||
                    (currentStep === "result" && step === "result")
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step === "upload" ? "1" : step === "select" ? "2" : "3"}
                </div>
                {index < 2 && <div className="w-12 h-0.5 bg-muted mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && (
          <div className="space-y-6">
            <ImageUpload onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
          </div>
        )}

        {currentStep === "select" && (
          <div className="space-y-6">
            <HairstyleGallery selectedHairstyle={selectedHairstyle} onHairstyleSelect={handleHairstyleSelect} />

            {selectedHairstyle && (
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleStartOver}>
                  Change Photo
                </Button>
                <Button onClick={() => handleProcessHairstyle()} className="min-w-32">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Preview
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === "processing" && (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-8 text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Creating Your Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is working its magic... This usually takes 30-60 seconds.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "result" && processingResult && uploadedImage && selectedHairstyle && (
          <ResultDisplay
            result={processingResult}
            selectedHairstyle={selectedHairstyle}
            originalImage={uploadedImage.preview}
            onTryAnother={handleTryAnother}
            remainingRetries={remainingRetries}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}
