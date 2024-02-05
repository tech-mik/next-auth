'use client'

import { BeatLoader } from 'react-spinners'
import { CardWrapper } from './card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/new-verification'
import { FormSuccess } from '../form-success'
import { FormError } from '../form-error'

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (success || error) return
    if (!token) return setError('Missing token')

    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Something went wrong')
      })
  }, [token, error, success])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div>
      <CardWrapper
        headerLabel='Comfirming your verification'
        backButtonHref='/auth/login'
        backButtonLabel='Back to login'>
        <div className='flex items-center w-full justify-center'>
          {!success && !error && <BeatLoader />}

          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      </CardWrapper>
    </div>
  )
}
