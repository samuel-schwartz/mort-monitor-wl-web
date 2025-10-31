import { z } from "zod"
import { VALIDATION_LIMITS, USER_ROLES, ALERT_STATUS } from "@/lib/constants"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${VALIDATION_LIMITS.MIN_PASSWORD_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_PASSWORD_LENGTH,
      `Password must be less than ${VALIDATION_LIMITS.MAX_PASSWORD_LENGTH} characters`,
    ),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.BROKER, USER_ROLES.CLIENT]).optional(),
})

const signupSchema = z.object({
  firstName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `First name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  lastName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `Last name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${VALIDATION_LIMITS.MIN_PASSWORD_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_PASSWORD_LENGTH,
      `Password must be less than ${VALIDATION_LIMITS.MAX_PASSWORD_LENGTH} characters`,
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

// Property Schemas
export const propertySchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  address: z
    .string()
    .min(5, "Please enter a valid address")
    .max(
      VALIDATION_LIMITS.MAX_ADDRESS_LENGTH,
      `Address must be less than ${VALIDATION_LIMITS.MAX_ADDRESS_LENGTH} characters`,
    ),
  propertyPrice: z.number().positive("Property price must be a positive number"),
  originalLoanAmount: z.number().nonnegative("Original loan amount must be non-negative").optional(),
  currentBalance: z.number().nonnegative("Current balance must be non-negative"),
  interestRate: z.number().positive("Interest rate must be a positive number"),
  termLength: z.number().int().positive("Term length must be a positive integer"),
  startMonth: z
    .number()
    .int()
    .min(1, "Start month must be between 1 and 12")
    .max(12, "Start month must be between 1 and 12"),
  startYear: z.number().int().min(1900, "Start year must be valid"),
  monthlyPayment: z.number().positive("Monthly payment must be a positive number"),
  creditScore: z.enum(["750+", "700-749", "650-699", "600-649", "<600", "Unsure"]).optional(),
})

export const propertyUpdateSchema = propertySchema.partial()

// User Schemas
const userUpdateSchema = z.object({
  firstName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `First name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    )
    .optional(),
  lastName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `Last name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    )
    .optional(),
})

// Broker Schemas
const brokerSchema = z.object({
  emails: z
    .string()
    .min(1, "At least one email is required")
    .refine(
      (val) => {
        const emails = val.split(",").map((e) => e.trim())
        return emails.every((email) => z.string().email().safeParse(email).success)
      },
      { message: "All emails must be valid email addresses" },
    ),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(
      VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH,
      `Company name must be less than ${VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH} characters`,
    ),

  brandColor: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
})

export const brokerUpdateSchema = brokerSchema.partial().omit({ emails: true })

const brokerProfileSchema = z.object({
  firstName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `First name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  lastName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `Last name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(
      VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH,
      `Company name must be less than ${VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH} characters`,
    ),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]+$/, "Please enter a valid phone number")
    .optional(),
  email: z.string().email("Please enter a valid email address"),
})

// Client Schemas
const clientSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `First name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  lastName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `Last name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-()]+$/, "Please enter a valid phone number"),
  creditScore: z.enum(["750+", "700-749", "650-699", "600-649", "<600", "Unsure"], {
    errorMap: () => ({ message: "Please select a credit score range" }),
  }),
  brokerId: z.string().min(1, "Broker ID is required"),
  sendInvite: z.boolean().optional(),
})

const clientUpdateSchema = clientSchema.partial().omit({ email: true, brokerId: true })

// Alert Schemas
const alertSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  templateId: z.string().min(1, "Alert template is required"),
  status: z.enum([ALERT_STATUS.ACTIVE, ALERT_STATUS.SNOOZED, ALERT_STATUS.SOUNDING]).optional(),
  inputs: z.record(z.any()).optional(),
})

const alertUpdateSchema = z.object({
  status: z.enum([ALERT_STATUS.ACTIVE, ALERT_STATUS.SNOOZED, ALERT_STATUS.SOUNDING]).optional(),
  inputs: z.record(z.any()).optional(),
})

// White Label Settings Schema
const whiteLabelSchema = z.object({
  brandName: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(
      VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH,
      `Brand name must be less than ${VALIDATION_LIMITS.MAX_COMPANY_NAME_LENGTH} characters`,
    ),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Primary color must be a valid hex color"),
  logoUrl: z.string().url("Logo URL must be a valid URL").optional(),
  customDomain: z.string().optional(),
})

// Rate Configuration Schema
const rateConfigSchema = z.object({
  defaultMargin: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Margin must be a valid number")
    .refine((val) => Number.parseFloat(val) >= 0 && Number.parseFloat(val) <= 10, "Margin must be between 0 and 10"),
  minCreditScore: z
    .string()
    .regex(/^\d{3}$/, "Credit score must be a 3-digit number")
    .refine(
      (val) => Number.parseInt(val) >= 300 && Number.parseInt(val) <= 850,
      "Credit score must be between 300 and 850",
    ),
  maxLoanAmount: z.string().regex(/^\d+$/, "Max loan amount must be a number"),
})

// Invitation Acceptance Schema
const inviteAcceptanceSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i, "Invalid token format"),
  password: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${VALIDATION_LIMITS.MIN_PASSWORD_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_PASSWORD_LENGTH,
      `Password must be less than ${VALIDATION_LIMITS.MAX_PASSWORD_LENGTH} characters`,
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `First name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
  lastName: z
    .string()
    .min(
      VALIDATION_LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${VALIDATION_LIMITS.MIN_NAME_LENGTH} characters`,
    )
    .max(
      VALIDATION_LIMITS.MAX_NAME_LENGTH,
      `Last name must be less than ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters`,
    ),
})

// Type exports for TypeScript
type LoginInput = z.infer<typeof loginSchema>
type SignupInput = z.infer<typeof signupSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>
type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type BrokerInput = z.infer<typeof brokerSchema>
export type BrokerUpdateInput = z.infer<typeof brokerUpdateSchema>
type BrokerProfileInput = z.infer<typeof brokerProfileSchema>
type ClientInput = z.infer<typeof clientSchema>
type ClientUpdateInput = z.infer<typeof clientUpdateSchema>
type AlertInput = z.infer<typeof alertSchema>
type AlertUpdateInput = z.infer<typeof alertUpdateSchema>
type WhiteLabelInput = z.infer<typeof whiteLabelSchema>
type RateConfigInput = z.infer<typeof rateConfigSchema>
type InviteAcceptanceInput = z.infer<typeof inviteAcceptanceSchema>
