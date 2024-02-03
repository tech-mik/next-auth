'use server'

import { LoginSchema, LoginType } from '@/schemas'

export const login = async (values: LoginType) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields' }

  return { success: 'Email sent!' }
}
