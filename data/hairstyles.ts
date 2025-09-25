import type { HairstyleOption } from "@/types"

export const HAIRSTYLE_OPTIONS: HairstyleOption[] = [
  // Short Styles
  {
    id: "low-fade",
    name: "Low Fade",
    description: "A clean, professional fade that starts just above the ears and gradually tapers down to the skin. Perfect for a sharp, modern look.",
    imageUrl: "/hairstyles/low-fade.jpg",
    category: "short",
  },
  {
    id: "low-taper",
    name: "Low Taper",
    description: "A subtle, professional taper that gradually shortens the hair length around the neck and ears. Ideal for a clean, polished appearance.",
    imageUrl: "/hairstyles/low-taper.jpg",
    category: "short",
  },

  // Natural Styles
  {
    id: "afro",
    name: "Afro",
    description: "A full, natural afro that celebrates natural hair texture. Can be styled in various shapes and sizes to suit personal preference.",
    imageUrl: "/hairstyles/afro.jpg",
    category: "natural",
  },
  {
    id: "bald",
    name: "Bald",
    description: "A clean, shaved head that emphasizes facial features and requires minimal maintenance. A timeless, confident look.",
    imageUrl: "/hairstyles/bald.jpg",
    category: "natural",
  },

  // Curly Styles
  {
    id: "high-fade",
    name: "High Fade",
    description: "A bold fade that starts higher up on the head, creating a dramatic contrast between the longer hair on top and the faded sides.",
    imageUrl: "/hairstyles/high-fade.jpg",
    category: "curly",
  },
  {
    id: "high-taper",
    name: "High Taper",
    description: "A more pronounced taper that extends higher up the sides, creating a defined shape while maintaining a professional look.",
    imageUrl: "/hairstyles/high-taper.jpg",
    category: "curly",
  },
]

