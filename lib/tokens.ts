import { db } from '@/lib/db'

import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { getPasswordResetTokenByEmail } from '../data/password-reset-token'
import { getVerificationTokenByEmail } from '../data/verification-token'
import email from 'next-auth/providers/email'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'

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

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)
  if (existingToken) {
    await db.twoFactorToken.delete({ where: { id: existingToken.id } })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return twoFactorToken
}
