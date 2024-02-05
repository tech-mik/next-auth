import { NewVerificationForm } from '@/components/auth/new-verification-form'

const NewVerificationPage = ({
  searchParams,
}: {
  searchParams: { token: string }
}) => {
  return <NewVerificationForm />
}
export default NewVerificationPage
