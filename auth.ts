import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import authConfig from './auth.config'
import { db } from './lib/db'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'

// Module augmentation
declare module 'next-auth' {
  interface User {
    role?: UserRole
  }
}

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
    // TODO: Fix Typescript error hieronder
    // @ts-ignore
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub
      if (token.role && session.user) session.user.role = token.role

      return session
    },
    async jwt({ token }) {
      if (token.sub) {
        const existingUser = await getUserById(token.sub)
        if (!existingUser) return token
        token.role = existingUser.role
      }
      return token
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
