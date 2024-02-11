import { UserRole } from '@prisma/client'

// Module augmentation
declare module 'next-auth' {
  export interface User {
    role?: UserRole
    emailVerified?: Date | null
    isTwoFactorEnabled?: boolean
    isOAuth?: boolean
  }

  export interface Session {
    user?: User
  }
}
