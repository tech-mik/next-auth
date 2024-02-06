import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { getVerificationTokenByEmail } from './verification-token'
import { getPasswordResetTokenByEmail } from './password-reset-token'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return verificationToken
}

export const generateResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)
  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } })
  }

  try {
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    return passwordResetToken
  } catch (error) {
    return null
  }
}
