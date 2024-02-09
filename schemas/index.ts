import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.nativeEnum(UserRole),
    email: z.optional(z.string().email()),
    password: z.optional(z.string()),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'password is required',
      path: ['password'],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required',
      path: ['newPassword'],
    },
  )

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Fill in a valid email address' }),
  password: z.string({ required_error: 'Password is required' }),
  code: z.optional(z.string()),
})

export type LoginType = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Fill in a valid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
})

export type RegisterType = z.infer<typeof RegisterSchema>

export const ResetSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Fill in a valid email address' }),
})

export type ResetType = z.infer<typeof ResetSchema>

export const NewPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Minimum 6 characters required' }),
    passwordConfirm: z.string({
      required_error: 'Confirm your new password',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'], // path of error
  })

export type NewPasswordType = z.infer<typeof NewPasswordSchema>
