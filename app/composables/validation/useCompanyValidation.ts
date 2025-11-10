/**
 * Company Validation Schemas
 * Using Zod for runtime validation
 */

import { z } from "zod";

// ═══════════════════════════════════════════════
// Validation Schemas
// ═══════════════════════════════════════════════

/**
 * Company Create Schema
 */
export const companyCreateSchema = z.object({
  name: z
    .string()
    .min(3, "اسم الشركة يجب أن يكون 3 أحرف على الأقل")
    .max(100, "اسم الشركة يجب ألا يتجاوز 100 حرف")
    .trim(),

  email: z.string().email("البريد الإلكتروني غير صحيح").toLowerCase().trim(),

  phone: z
    .string()
    .regex(
      /^(05|5)([0-9]{8})$/,
      "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
    )
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "العنوان يجب ألا يتجاوز 200 حرف")
    .trim()
    .optional()
    .or(z.literal("")),

  is_active: z.boolean().default(true),
});

/**
 * Company Update Schema
 */
export const companyUpdateSchema = companyCreateSchema.partial();

/**
 * Company ID Schema
 */
export const companyIdSchema = z.object({
  id: z.string().uuid("معرف الشركة غير صحيح"),
});

// ═══════════════════════════════════════════════
// Type Exports
// ═══════════════════════════════════════════════

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
export type CompanyIdInput = z.infer<typeof companyIdSchema>;

// ═══════════════════════════════════════════════
// Composable
// ═══════════════════════════════════════════════

/**
 * Company Validation Composable
 */
export function useCompanyValidation() {
  /**
   * Validate company creation data
   */
  function validateCreate(data: unknown) {
    return companyCreateSchema.parse(data);
  }

  /**
   * Validate company update data
   */
  function validateUpdate(data: unknown) {
    return companyUpdateSchema.parse(data);
  }

  /**
   * Validate company ID
   */
  function validateId(data: unknown) {
    return companyIdSchema.parse(data);
  }

  /**
   * Safe validation (returns result without throwing)
   */
  function safeValidateCreate(data: unknown) {
    return companyCreateSchema.safeParse(data);
  }

  function safeValidateUpdate(data: unknown) {
    return companyUpdateSchema.safeParse(data);
  }

  function safeValidateId(data: unknown) {
    return companyIdSchema.safeParse(data);
  }

  return {
    // Schemas
    companyCreateSchema,
    companyUpdateSchema,
    companyIdSchema,

    // Validators
    validateCreate,
    validateUpdate,
    validateId,

    // Safe validators
    safeValidateCreate,
    safeValidateUpdate,
    safeValidateId,
  };
}
