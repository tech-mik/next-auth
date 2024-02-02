import * as z from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Fill in a valid email address' }),
  password: z.string({ required_error: 'Password is required' }),
})

export type LoginType = z.infer<typeof LoginSchema>
