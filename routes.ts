/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes: string[] = ['/']

/**
 * An array of routes that require authentication.
 * These routes can only be accessed by authenticated users.
 */
export const authRoutes: string[] = ['/auth/login', '/auth/register']

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * Default redirect path after logging in.
 */

export const DEFAULT_LOGIN_REDIRECT: string = '/settings'
