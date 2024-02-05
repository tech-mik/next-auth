'use server'

import { signIn } from '@/auth'
import { generateVerificationToken } from '@/data/tokens'
import { getUserByEmail } from '@/data/user'
import { sendVerificationEmail } from '@/lib/mail'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema, LoginType } from '@/schemas'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export const login = async (values: LoginType) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) return { error: 'Invalid fields' }

  const { email, password } = validatedFields.data

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
