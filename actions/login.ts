'use server'

import { signIn } from '@/auth'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema, LoginType } from '@/schemas'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { db } from '@/lib/db'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'

export const login = async (values: LoginType) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields' }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    )
    const { error } = await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )
    if (error) return { error: 'Something went wrong' }

    return { success: 'Confirmation email sent!' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
      if (!twoFactorToken) return { error: 'Invalid 2FA code' }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid 2FA code' }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()
      if (hasExpired) return { error: '2FA code has expired' }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' }

        default:
          return { error: 'Something went wrong' }
      }
    }
    // ALWAYS THROW ERROR, OR YOU WILL NOT BE REDIRECTED
    throw error
  }
}
