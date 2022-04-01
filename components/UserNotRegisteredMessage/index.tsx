import { Button, Modal } from '@/components'
import { useStore } from '@/store'
import { useUser } from '@/hooks'
import { useState } from 'react'
import { TxObj } from '@/types'

const CheckUserRegister = () => {
  const [status, setStatus] = useState<TxObj | undefined>()
  const mutate = useStore(state => state.mutate)

  const { handleDiffieKey } = useUser()

  return (
    <>
      <Modal
        overlayCantClose
        className="bg-primary"
        title="User registration"
        isOpen={status && status?.status !== 'still'}
        close={() => {
          if (status?.status === 'success') {
            mutate('isUserRegistered', true)
          }
          setStatus({ ...status, status: 'still' })
        }}
      >
        {status?.status !== 'still' && typeof status?.msg === 'string' ? (
          <p>{status?.msg}</p>
        ) : (
          status?.msg
        )}
      </Modal>
      <p className="mb-5">
        To use this dapp and send emails, you need to register to get your
        private key for encryption and decryption of emails
      </p>
      <Button onClick={() => handleDiffieKey(setStatus)}>Register</Button>
    </>
  )
}

export default CheckUserRegister
