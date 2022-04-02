import { Button, Input, Modal, Svg } from '@/components'
import { useMemo, useCallback } from 'use-memo-one'
import { useState, useEffect } from '@/libraries'
import { AES, mode, enc, lib } from 'crypto-js'
import { useUser, useMail } from '@/hooks'
import { TxObj, Email } from '@/types'
import { useStore } from '@/store'

const EmailOpened = () => {
  const { byId } = useMail()
  const { fetchUsers } = useUser()

  const pubkey = useStore(state => state.pubkey)
  const mutate = useStore(state => state.mutate)
  const elliptic = useStore(state => state.elliptic)
  const activeEmail = useStore(state => state.activeEmail)

  const [shouldHidePrivate, setShouldHidePrivate] = useState<boolean>(true)
  const [decryptedBody, setDecryptedBody] = useState<string>('')
  const [privateKey, setPrivateKey] = useState<string>('')
  const [status, setStatus] = useState<TxObj>()

  const [email, setEmail] = useState<Email>()

  useEffect(() => {
    ;(async () => {
      if (activeEmail) {
        const email = await byId(activeEmail)
        setEmail(email)
      } else {
        setEmail(null)
      }
    })()
  }, [activeEmail])

  useEffect(() => setDecryptedBody(''), [email])

  const toOrFrom = useMemo(
    () => (email?.account.from.toString() === pubkey ? 'to' : 'from'),
    [email, pubkey]
  )

  const handleDecrypt = useCallback(async () => {
    try {
      if (!decryptedBody) {
        const theirAccount = await fetchUsers(
          'authority',
          email.account[toOrFrom].toString()
        )
        const myKeypair = elliptic.keyFromPrivate(privateKey)
        const theirKeypair = elliptic.keyFromPublic(
          Buffer.from(theirAccount[0].account.diffiePubkey, 'hex')
        )

        const sharedSecret = myKeypair
          .derive(theirKeypair.getPublic())
          .toString('hex')

        const plaintext = AES.decrypt(
          {
            ciphertext: enc.Hex.parse(email.account.body),
            iv: enc.Hex.parse(email.account.iv),
            salt: enc.Hex.parse(email.account.salt)
          } as lib.CipherParams,
          sharedSecret,
          { mode: mode.CTR }
        )

        if (plaintext.toString(enc.Utf8)) {
          setDecryptedBody(plaintext.toString(enc.Utf8))
        } else {
          setStatus({
            status: 'error',
            msg: 'Error while trying to decrypt, did you passed the right private key?'
          })
        }
      } else {
        setDecryptedBody('')
      }
    } catch (e) {
      setStatus({
        status: 'error',
        msg: 'Error: ' + e?.message
      })
    }
  }, [decryptedBody, email, privateKey])

  const handleRender = useMemo(
    () => (
      <>
        {email && activeEmail && (
          <div className=" border-gray-500 border-t lg:border-none pt-5 relative">
            <Svg
              onClick={() => mutate('activeEmail', null)}
              icon="close"
              className="h-7 w-7 absolute top-0 right-0 text-secondary cursor-pointer"
            />
            <h6 className="mb-5">Decrypt email</h6>
            <div className="flex flex-col justify-between mb-10">
              <div className="flex flex-col lg:flex-row gap-5 items-center">
                <Input
                  iconOnClick={() => setShouldHidePrivate(!shouldHidePrivate)}
                  icon={shouldHidePrivate ? 'eye' : 'eyeOff'}
                  type={shouldHidePrivate ? 'password' : 'text'}
                  value={privateKey}
                  onChange={e => setPrivateKey(e.target.value)}
                  placeholder="Your private key"
                />
                <Button
                  disabled={!(privateKey?.length === 63)}
                  onClick={handleDecrypt}
                  className="w-full lg:w-[auto]"
                  fluid
                >
                  {decryptedBody ? 'Encrypt' : 'Decrypt'}
                </Button>
                <p className="lg:w-5/6">
                  {new Date(email?.account.createdAt * 1000).toLocaleString()}
                </p>
              </div>
              <h4 className="mt-6 w-full text-secondary">
                {email?.account.subject}
              </h4>
            </div>
            <p className="font-thin">
              <strong className="font-bold mr-3">From: </strong>
              {email.account.from.toString() === pubkey
                ? 'You'
                : email.account.from.toString()}
            </p>
            <p className="mb-6 font-thin">
              <strong className="font-bold mr-10">To: </strong>
              {email?.account.to.toString() === pubkey
                ? 'You'
                : email.account.to.toString()}
            </p>
            <p className="text-secondary">
              {decryptedBody || email?.account.body}
            </p>
          </div>
        )}
      </>
    ),
    [email, decryptedBody, privateKey, shouldHidePrivate, activeEmail]
  )

  return (
    <div>
      {handleRender}
      <Modal
        className="bg-primary"
        title="Error"
        isOpen={Boolean(status && status?.status !== 'still')}
        close={() => setStatus({ ...status, status: 'still' })}
      >
        {<p className="my-5">{status?.msg}</p>}
      </Modal>
    </div>
  )
}

export default EmailOpened
