import { z } from "zod"

/**
 * Schema for idea validation input
 */
export const ideaValidationSchema = z.object({
  title: z
    .string()
    .min(5, "عنوان ایده باید حداقل 5 کاراکتر باشد")
    .max(200, "عنوان ایده نباید بیشتر از 200 کاراکتر باشد"),
  description: z
    .string()
    .min(20, "توضیحات باید حداقل 20 کاراکتر باشد")
    .max(2000, "توضیحات نباید بیشتر از 2000 کاراکتر باشد"),
  targetMarket: z
    .string()
    .max(200, "بازار هدف نباید بیشتر از 200 کاراکتر باشد")
    .optional(),
})

export type IdeaValidationInput = z.infer<typeof ideaValidationSchema>

/**
 * Schema for user signup
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email("ایمیل معتبر وارد کنید")
    .min(1, "ایمیل الزامی است"),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .max(100, "رمز عبور نباید بیشتر از 100 کاراکتر باشد"),
  fullName: z
    .string()
    .min(2, "نام کامل باید حداقل 2 کاراکتر باشد")
    .max(100, "نام کامل نباید بیشتر از 100 کاراکتر باشد"),
})

export type SignupInput = z.infer<typeof signupSchema>

/**
 * Schema for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("ایمیل معتبر وارد کنید")
    .min(1, "ایمیل الزامی است"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است"),
})

export type LoginInput = z.infer<typeof loginSchema>
