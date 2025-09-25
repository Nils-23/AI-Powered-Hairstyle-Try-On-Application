import { UNIVERSAL_HAIR_PROMPT_RULES } from './hair-universal-rules'

export function generatePrompt(hairstyleDescription: string): string {
  // Ensure the prompt always starts with 'img,'
  const base = hairstyleDescription.trim().toLowerCase().startsWith('img')
    ? hairstyleDescription
    : `img, ${hairstyleDescription}`;
  return `${base}\n\n${UNIVERSAL_HAIR_PROMPT_RULES}`;
} 