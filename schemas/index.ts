import * as z from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Fill in a valid email address' }),
  password: z.string({ required_error: 'Password is required' }),
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
