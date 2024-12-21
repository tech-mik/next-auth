'use client'

import { useSearchParams } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { toast } from 'sonner'

const TestToaster = () => {
  const searchParams = useSearchParams()
  const testingParam = searchParams.get('testing')

  const mountedRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!testingParam) return
    let timerId: number | string

    if (!mountedRef.current && testingParam === 'true') {
      setTimeout(() => {
        timerId = toast('Welcome tester!', {
          description:
            'For testing purposes, the login details are already provided. Enjoy!',
          position: 'top-center',
        })
      })
    }

    mountedRef.current = true

    return () => {
      clearTimeout(timerId)
    }
  }, [testingParam])

  return null
}
export default TestToaster
