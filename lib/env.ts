import { z } from "zod"

const envSchema = z.object({
  // API Configuration
  API_BASE_URL: z.string().optional(),
  API_SECRET_KEY: z.string().min(1).default("dev-secret-key-for-local-development"),

  // OAuth Configuration
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Auth Configuration - optional in development, required in production
  AUTH_SECRET: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

// Warn if AUTH_SECRET is missing or too short in production
if (parsedEnv.data.NODE_ENV === "production") {
  if (!parsedEnv.data.AUTH_SECRET || parsedEnv.data.AUTH_SECRET.length < 32) {
    console.warn("⚠️  WARNING: AUTH_SECRET should be at least 32 characters in production")
  }
}

export const env = parsedEnv.data

// Type-safe environment variables
type Env = z.infer<typeof envSchema>
