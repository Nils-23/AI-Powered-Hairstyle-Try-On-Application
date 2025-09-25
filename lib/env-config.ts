// Environment configuration and validation
export interface EnvConfig {
  replicateApiToken: string | undefined
  nodeEnv: string
  isDevelopment: boolean
  isProduction: boolean
}

export function getEnvConfig(): EnvConfig {
  return {
    replicateApiToken: process.env.REPLICATE_API_TOKEN,
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  }
}

export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = ["REPLICATE_API_TOKEN"]
  const missingVars: string[] = []

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

// Log environment status (for development)
export function logEnvironmentStatus(): void {
  if (process.env.NODE_ENV === "development") {
    const { isValid, missingVars } = validateEnvironment()

    if (isValid) {
      console.log("✅ All required environment variables are configured")
    } else {
      console.warn("⚠️ Missing environment variables:", missingVars)
      console.warn("Please add these to your .env.local file:")
      missingVars.forEach((varName) => {
        console.warn(`${varName}=your_${varName.toLowerCase()}_here`)
      })
    }
  }
}
