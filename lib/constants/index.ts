/**
 * Application-wide constants
 * Centralized location for all magic numbers and configuration values
 */

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  BROKER: "broker",
  CLIENT: "client",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Alert Status
export const ALERT_STATUS = {
  ACTIVE: "active",
  SNOOZED: "snoozed",
  SOUNDING: "sounding",
} as const

export type AlertStatus = (typeof ALERT_STATUS)[keyof typeof ALERT_STATUS]

// Pricing
export const PRICING = {
  ALERT_MONTHLY_COST: 1, // $1 per alert per month
  ALERT_ANNUAL_COST: 12, // $12 per alert per year
  BROKER_STARTER_MONTHLY: 49,
  BROKER_PROFESSIONAL_MONTHLY: 99,
  BROKER_ENTERPRISE_MONTHLY: 199,
} as const

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const

// Token Expiration
export const TOKEN_EXPIRATION = {
  INVITATION: 7 * TIME.DAY, // 7 days
  PASSWORD_RESET: 1 * TIME.HOUR, // 1 hour
  EMAIL_VERIFICATION: 24 * TIME.HOUR, // 24 hours
} as const

// Validation Limits
export const VALIDATION_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 200,
  MAX_COMPANY_NAME_LENGTH: 100,
} as const

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN_DASHBOARD: "/admin",
  BROKER_DASHBOARD: "/broker",
  CLIENT_DASHBOARD: "/dash",
  ONBOARDING: "/onboard",
} as const

// Session Configuration
export const SESSION_COOKIE_NAME = "mortmonitor_session"
export const SESSION_MAX_AGE = 7 * TIME.DAY // 7 days
