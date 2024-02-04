'use server'

import bcrypt from 'bcryptjs'
import { RegisterSchema, RegisterType } from '@/schemas'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const register = async (values: RegisterType) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields' }

  const { email, name, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: 'Email is already in use!' }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  // TODO: Sent verification email

  return { success: 'User created!' }
}
