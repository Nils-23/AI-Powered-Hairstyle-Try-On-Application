"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, RotateCcw, Check, Copy, AlertCircle, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { downloadImage, generateShareableLink } from "@/lib/utils"
import type { ProcessingResult, HairstyleOption } from "@/types"
import { v4 as uuidv4 } from 'uuid'

interface ResultDisplayProps {
  result: ProcessingResult
  selectedHairstyle: HairstyleOption
  originalImage: string
  onTryAnother: () => void
  remainingRetries?: number
  onRetry?: (feedback: string) => Promise<void>
}

export default function ResultDisplay({ 
  result, 
  selectedHairstyle, 
  originalImage, 
  onTryAnother,
  remainingRetries = 2,
  onRetry 
}: ResultDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [shareLink, setShareLink] = useState<string>("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    let sid = localStorage.getItem("sessionId") || undefined
    if (!sid) {
      sid = uuidv4()
      localStorage.setItem("sessionId", sid)
    }
    setSessionId(sid)
  }, [])

  const handleDownload = async () => {
    if (!result.resultImageUrl) return

    setIsDownloading(true)
    try {
      await downloadImage(
        result.resultImageUrl,
        `${selectedHairstyle.name.toLowerCase().replace(/\s+/g, "-")}-preview.jpg`,
      )
    } catch (error) {
      console.error("Download failed:", error)
      // You could add a toast notification here
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = () => {
    if (result.processingId) {
      const link = generateShareableLink(result.processingId)
      setShareLink(link)
      navigator.clipboard.writeText(link)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const handleFeedback = async () => {
    if (!feedback) return
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        feedback,
        comment,
        hairstyle: selectedHairstyle?.id,
        timestamp: Date.now(),
      })
    })
    setSubmitted(true)
  }

  const handleRetry = async () => {
    if (!onRetry || !feedback.trim()) return
    setIsRetrying(true)
    try {
      await onRetry(feedback)
    } finally {
      setIsRetrying(false)
    }
  }

  if (!result.success || !result.resultImageUrl) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-destructive">
              <h3 className="text-lg font-semibold">Processing Failed</h3>
              <p className="text-sm">{result.error || "Something went wrong"}</p>
              {result.error && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please try again with a different photo or hairstyle. Make sure your photo is clear and well-lit.
                </p>
              )}
            </div>
            <Button onClick={onTryAnother} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Your New Look!</h3>
        <p className="text-muted-foreground">Here's how you'd look with the {selectedHairstyle.name}</p>
      </div>

      {/* Before/After Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Before</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original photo"
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">After - {selectedHairstyle.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {imageError ? (
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                  <p className="text-sm text-muted-foreground">Failed to load generated image</p>
                  <Button variant="outline" size="sm" onClick={() => setImageError(false)}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <img
                src={result.resultImageUrl}
                alt="AI generated result"
                className="w-full h-64 md:h-80 object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Retry Section */}
      {remainingRetries > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <h4 className="font-semibold">Not quite right? Try again!</h4>
              <p className="text-sm text-muted-foreground">
                You have {remainingRetries} more {remainingRetries === 1 ? 'try' : 'tries'} left. Add feedback to help improve the result.
              </p>
            </div>
            <Textarea
              placeholder="What would you like to change? (e.g., 'Make the fade higher', 'Less volume on top', 'Keep the sides shorter')"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-center">
              <Button 
                onClick={handleRetry} 
                disabled={!feedback.trim() || isRetrying}
                className="min-w-32"
              >
                {isRetrying ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {remainingRetries === 0 && (
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onTryAnother}>
            Try Different Style
          </Button>
        </div>
      )}

      {/* Share Link Display */}
      {shareLink && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Share link:</span>
              <code className="flex-1 text-xs bg-background px-2 py-1 rounded">{shareLink}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink)
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 2000)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback UI */}
      {!submitted && (
        <div className="mt-8 space-y-2">
          <div className="flex gap-4 justify-center">
            <button onClick={() => setFeedback("good")} className={`text-3xl ${feedback === "good" ? "ring-2 ring-primary rounded-full" : ""}`}>👍</button>
            <button onClick={() => setFeedback("fit-issue") } className={`text-3xl ${feedback === "fit-issue" ? "ring-2 ring-primary rounded-full" : ""}`}>👎</button>
            <button onClick={() => setFeedback("float-color") } className={`text-3xl ${feedback === "float-color" ? "ring-2 ring-primary rounded-full" : ""}`}>🤔</button>
          </div>
          <textarea
            className="w-full mt-2 p-2 border rounded"
            rows={2}
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <div className="flex justify-center mt-2">
            <button onClick={handleFeedback} disabled={!feedback} className="btn btn-primary px-4 py-2 rounded disabled:opacity-50">Submit Feedback</button>
          </div>
        </div>
      )}
      {submitted && (
        <div className="mt-8 text-center text-green-600 font-semibold">Thank you for your feedback!</div>
      )}
    </div>
  )
}
