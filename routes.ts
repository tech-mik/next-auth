/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes: string[] = ['/', '/auth/new-verification']

/**
 * An array of routes that require authentication.
 * These routes can only be accessed by authenticated users.
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 */
export const apiAuthPrefix = '/api/auth'

/**
 * Default redirect path after logging in.
 */

export const DEFAULT_LOGIN_REDIRECT = '/settings'
