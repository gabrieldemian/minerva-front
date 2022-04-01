import { Modal, Button } from '@/components'
import type { TxObj } from '@/types'
import { useStore } from '@/store'
import { useUser } from '@/hooks'
import { useState } from 'react'

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<TxObj>({ status: 'still' })
  const pubkey = useStore(state => state.pubkey)
  const { handleDiffieKey } = useUser()

  return (
    <div>
      <h6 className="hasMargin">Logged as:</h6>
      <p className="hasMargin">{pubkey}</p>

      <h6 className="hasMargin">Generate another private key</h6>
      <p className="hasMargin">
        If you lost your private key, or want to be more secure, you can
        generate another private key for encrypting your emails.
      </p>
      <Button onClick={() => setIsModalOpen(true)} fluid>
        Generate private key
      </Button>

      <Modal
        isOpen={isModalOpen || status?.status !== 'still'}
        close={() => {
          setIsModalOpen(false)
          setStatus({ ...status, status: 'still' })
        }}
        title="Are you sure?"
      >
        {status?.status === 'still' && !status?.msg && (
          <p className="hasMargin">
            Are you sure you want to generate another private key? This new key
            will replace the old one, you can still read your older emails if
            you have the old one. But, for new emails, you will need to use the
            new private key.
          </p>
        )}

        {status?.status !== 'still' && typeof status?.msg === 'string' ? (
          <p>{status?.msg}</p>
        ) : (
          status?.msg
        )}

        {status?.status === 'still' && !status?.msg && (
          <Button
            fluid
            onClick={() => handleDiffieKey(setStatus, 'update')}
            className="mt-5"
          >
            Yes, I know what I'm doing
          </Button>
        )}
      </Modal>
    </div>
  )
}

export default Account
