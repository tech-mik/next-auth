'use client'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/user-current-user'
import { signOut } from 'next-auth/react'

const SettingsPage = () => {
  const user = useCurrentUser()

  return (
    <div className='bg-white p-10 rounded-xl'>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  )
}
export default SettingsPage
