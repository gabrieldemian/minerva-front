import { memo, useMemo } from '@/libraries'
import { Card } from '@/components'
import { useStore } from '@/store'
import { Email } from '@/types'

interface Props {
  toOrFrom: 'to' | 'from'
  email: Email
}

const truncate = 'overflow-ellipsis overflow-hidden whitespace-nowrap'

const EmailLine = ({ email, toOrFrom }: Props) => {
  const activeEmail = useStore(state => state.activeEmail)
  const mutate = useStore(state => state.mutate)

  const isActive = useMemo(
    () => email.account.id === activeEmail,
    [email, activeEmail]
  )

  return (
    <div
      className={`mb-3 w-full flex cursor-pointer transition gap-5`}
      onClick={() => mutate('activeEmail', email.account.id)}
    >
      <Card
        bg={isActive ? 'secondary' : 'primary'}
        className={`w-full duration-300 hover:bg-secondary ${
          isActive ? 'shadow-md' : ''
        }`}
        hasShadow={false}
      >
        <div className="flex justify-between">
          <small>{email?.account[toOrFrom]?.toString().slice(0, 9)}...</small>
          <small className={truncate}>
            {new Date(email?.account.createdAt * 1000).toLocaleDateString()}
          </small>
        </div>
        <p className={truncate + ' text-gray mt-1'}>{email?.account.subject}</p>
      </Card>
    </div>
  )
}

export default memo(EmailLine)
