import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
      <pre>{session?.user?.id}</pre>
      <form
        action={async () => {
          'use server'
          await signOut()
        }}>
        <Button type='submit'>Sign out</Button>
      </form>
    </div>
  )
}
export default SettingsPage
