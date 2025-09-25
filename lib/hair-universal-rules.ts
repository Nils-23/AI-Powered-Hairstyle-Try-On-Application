export const UNIVERSAL_HAIR_PROMPT_RULES = `
- Subject Identity:
Preserve original subject's facial features and skin tone. Never feminize the subject or apply features that look feminine or racially ambiguous.
- Framing & Composition:
The entire head and hairstyle must be fully visible in the image. Do not crop the top, sides, or chin. Keep the subject centered with at least 10% top space, 5-10% side space, and 5% below the chin, and ensure the top of the shoulders is visible.
- Hairstyle Accuracy:
Render the selected hairstyle exactly as described. Follow the intended shape, texture (e.g., fade, twist, afro), and positioning without distorting or blending it into facial features unnaturally.
- Realism & Image Quality:
Generate high-resolution, photorealistic results with natural skin tone, facial structure, and lighting. Avoid distortion, blurring, or unrealistic blending between hair and scalp.
- Consistency With Input Photo:
Match the subject's face shape, angle, lighting, and expression from the uploaded photo. Do not alter or regenerate facial identity — only modify the hairstyle while keeping the subject recognizable and the initial photo background scene.
`.trim(); 