// We have to configure this file, because Prisma doesn't work on the Edge
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'

import type { NextAuthConfig } from 'next-auth'
import { getUserByEmail } from './data/user'
import { LoginSchema } from './schemas'

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig