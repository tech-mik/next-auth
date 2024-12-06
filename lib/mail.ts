import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`

  return await resend.emails.send({
    from: 'no-reply@backstr.app',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">Here</a> to confirm email</p>`,
  })
}

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`

  return await resend.emails.send({
    from: 'no-reply@backstr.app',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">Here</a> to reset your password.</p>`,
  })
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'no-reply@backstr.app',
    to: email,
    subject: '2FA code',
    html: `<p>Your 2FA code is: ${token}</p>`,
  })
}
