# 🔐 Secure Replicate Integration Setup

## Step 1: Get a New API Token

1. Go to [Replicate.com](https://replicate.com)
2. Sign in to your account
3. Navigate to [Account Settings](https://replicate.com/account)
4. **REVOKE the old token** if you shared it anywhere
5. Generate a **NEW** API token
6. Copy the new token (starts with `r8_`)

## Step 2: Secure Local Setup

Create a `.env.local` file in your project root:

\`\`\`bash
# .env.local (NEVER commit this file)
REPLICATE_API_TOKEN=your_new_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Step 3: Verify .gitignore

Ensure your `.gitignore` includes:

\`\`\`
# Environment variables
.env.local
.env.*.local
.env
\`\`\`

## Step 4: Production Deployment

### Vercel Deployment:
1. Push code to GitHub (without .env.local)
2. In Vercel dashboard:
   - Go to Project Settings
   - Navigate to Environment Variables
   - Add: `REPLICATE_API_TOKEN` = `your_new_token`
3. Redeploy your application

### Other Platforms:
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Variables tab in project dashboard
- **Heroku**: Settings → Config Vars

## Step 5: Test the Integration

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to `/app` in your browser
3. Upload a test image
4. Select a hairstyle
5. Click "Generate Preview"

## 🚨 Security Best Practices

### ✅ DO:
- Store API keys in environment variables only
- Use different tokens for development/production
- Regularly rotate API tokens
- Monitor API usage in Replicate dashboard
- Set up billing alerts

### ❌ DON'T:
- Share tokens in chat, email, or code
- Commit .env files to version control
- Use production tokens in development
- Share screenshots containing tokens
- Store tokens in client-side code

## 🔍 Troubleshooting

### "AI service not configured" error:
\`\`\`bash
# Check if token is loaded
echo $REPLICATE_API_TOKEN
# Should show your token (in terminal only)
\`\`\`

### API calls failing:
1. Verify token is correct in Replicate dashboard
2. Check account has sufficient credits
3. Ensure token has proper permissions
4. Review API usage limits

### Development vs Production:
- Use separate tokens for each environment
- Test with small images first
- Monitor costs during development

## 📊 Cost Management

- Each generation costs ~$0.01-0.05
- Set up billing alerts in Replicate
- Use smaller images for testing
- Consider caching results for repeated tests

## 🆘 If Token is Compromised

1. **Immediately revoke** the token in Replicate dashboard
2. Generate a new token
3. Update all environments (local, production)
4. Monitor account for unauthorized usage
5. Consider changing account password
\`\`\`

Let's also create a development testing component:
