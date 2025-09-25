"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { HairstyleOption } from "@/types"
import { HAIRSTYLE_OPTIONS } from "@/data/hairstyles"

interface HairstyleGalleryProps {
  selectedHairstyle: HairstyleOption | null
  onHairstyleSelect: (hairstyle: HairstyleOption) => void
  disabled?: boolean
}

export default function HairstyleGallery({
  selectedHairstyle,
  onHairstyleSelect,
  disabled = false,
}: HairstyleGalleryProps) {
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", "short", "natural", "curly"]

  const filteredHairstyles =
    filter === "all" ? HAIRSTYLE_OPTIONS : HAIRSTYLE_OPTIONS.filter((style) => style.category === filter)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Choose Your Style</h3>
        <p className="text-muted-foreground">Select a hairstyle to see how it looks on you</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Hairstyle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHairstyles.map((hairstyle) => (
          <Card
            key={hairstyle.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedHairstyle?.id === hairstyle.id ? "ring-2 ring-primary shadow-lg" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !disabled && onHairstyleSelect(hairstyle)}
          >
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={hairstyle.imageUrl || "/placeholder.svg"}
                  alt={hairstyle.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    // Fallback to placeholder if the real image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(hairstyle.name);
                  }}
                />
                {selectedHairstyle?.id === hairstyle.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <Badge variant="secondary" className="absolute bottom-2 left-2 capitalize">
                  {hairstyle.category}
                </Badge>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">{hairstyle.name}</h4>
                <p className="text-sm text-muted-foreground">{hairstyle.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHairstyles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hairstyles found for the selected category.</p>
        </div>
      )}
    </div>
  )
}
