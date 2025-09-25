# BarberKit - AI Hairstyle Preview App

A production-ready Next.js application that uses AI to preview hairstyles on user photos.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

\`\`\`bash
# Required: Replicate API Token
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Optional: App URL for production
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### 2. Get Your Replicate API Token

1. Sign up at [Replicate.com](https://replicate.com)
2. Go to your [Account Settings](https://replicate.com/account)
3. Copy your API token
4. Add it to your `.env.local` file

### 3. Install Dependencies

\`\`\`bash
npm install replicate
\`\`\`

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 🔧 API Models Used

The app uses multiple AI models for best results:

- **PhotoMaker**: High-quality portrait generation
- **InstantID**: Face-preserving style transfer
- **Fallback**: Mock responses for development

## 🛡️ Security Features

- ✅ API keys stored securely in environment variables
- ✅ File type and size validation
- ✅ Rate limiting and error handling
- ✅ No client-side API key exposure
- ✅ Comprehensive input sanitization

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── process-hairstyle/route.ts    # Main AI processing
│   │   └── generate-hairstyle/route.ts   # Enhanced generation
│   ├── app/page.tsx                      # App interface
│   └── page.tsx                          # Landing page
├── components/
│   ├── hairstyle-app.tsx                 # Main app component
│   ├── image-upload.tsx                  # File upload handling
│   ├── hairstyle-gallery.tsx             # Style selection
│   └── result-display.tsx                # Results & sharing
├── lib/
│   ├── ai-models.ts                      # AI model configurations
│   ├── env-config.ts                     # Environment validation
│   └── utils.ts                          # Utility functions
└── types/
    └── index.ts                          # TypeScript definitions
\`\`\`

## 🔮 Future Enhancements

- User authentication and history
- Stripe subscription billing
- Barbershop management dashboard
- Advanced AI model fine-tuning
- Mobile app version

## 🐛 Troubleshooting

### "AI service not configured" error
- Check that `REPLICATE_API_TOKEN` is set in your `.env.local` file
- Verify your Replicate account has sufficient credits

### Slow processing times
- This is normal for AI generation (30-60 seconds)
- Consider upgrading your Replicate plan for faster processing

### Image upload issues
- Ensure images are under 5MB
- Use JPEG, PNG, or WebP formats only
- Check that images have clear face visibility

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the [Replicate documentation](https://replicate.com/docs)
3. Open an issue on GitHub
