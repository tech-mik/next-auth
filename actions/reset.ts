'use server'

import { generateResetToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { sendResetEmail } from '@/lib/mail'
import { ResetSchema, ResetType } from '@/schemas'
import { Resend } from 'resend'

export const reset = async (values: ResetType) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid email' }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser) return { error: 'Email not found' }

  const resetToken = await generateResetToken(email)
  if (!resetToken) return { error: 'Failed to generate reset token' }

  const { error } = await sendResetEmail(email, resetToken.token)
  if (error) return { error: 'Failed to send reset email' }

  return { success: 'Reset mail sent' }
}
