import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import authConfig from './auth.config'
import { db } from './lib/db'
import { getUserById } from './data/user'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { getAccountByUserId } from './data/account'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    linkAccount: async ({ user }) => {
      await db.user.update({
        data: { emailVerified: new Date() },
        where: { id: user.id },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      // Prevent sign-in without email verification
      const existingUser = await getUserById(user.id)
      if (!user.emailVerified) return false

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        )
        if (!twoFactorConfirmation) return false

        // Delete two factor confrmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    // FIXME: Fix Typescript error hieronder
    // @ts-ignore
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub
      if (token.role && session.user) session.user.role = token.role
      if (token.isTwoFactorEnabled && session.user)
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.isOAuth = token.isOAuth
      }
      return session
    },
    async jwt({ token }) {
      if (token.sub) {
        const existingUser = await getUserById(token.sub)
        if (!existingUser) return token

        const existingAccount = await getAccountByUserId(existingUser.id)

        token.isOAuth = !!existingAccount
        token.email = existingUser.email
        token.name = existingUser.name
        token.role = existingUser.role
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      }
      return token
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
