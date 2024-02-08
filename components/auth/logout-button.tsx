'use client'

import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'

interface LogoutButtonProps {
  children?: React.ReactNode
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    signOut()
  }
  return (
    <span onClick={onClick} className='cursor-pointer'>
      {children}
    </span>
  )
}
export default LogoutButton
