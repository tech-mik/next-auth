import { UserRole } from '@prisma/client'

// Module augmentation
declare module 'next-auth' {
  export interface User {
    role?: UserRole
    emailVerified?: Date
    isTwoFactorEnabled?: boolean
  }
}
