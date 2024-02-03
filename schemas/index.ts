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
