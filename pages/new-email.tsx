import { useState, OneForm, useCallback, useEffect } from '@/libraries'
import { Button, Input, Loading, Modal } from '@/components'
import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useUser, useMail } from '@/hooks'
import { AES, mode } from 'crypto-js'
import { useStore } from '@/store'
import { TxObj } from '@/types'

const validations = {
  to: [
    {
      errorMessage: 'You need to type something.',
      getIsValid: ({ value }) => value
    },
    {
      errorMessage: 'A wallet must have exactly 44 chars.',
      getIsValid: ({ value }) => value && value.length === 44
    }
  ],
  subject: [
    {
      errorMessage: 'You need to type something.',
      getIsValid: ({ value }) => value
    },
    {
      errorMessage: 'Subject too long, the maximum is 40 chars.',
      getIsValid: ({ value }) => value && value.length <= 40
    }
  ],
  myPrivate: [
    {
      errorMessage: 'You need to type something.',
      getIsValid: ({ value }) => value
    },
    {
      errorMessage: 'The private key must be exactly 63 chars.',
      getIsValid: ({ value }) => value && value.length === 63
    }
  ],
  body: [
    {
      errorMessage: 'You need to type something.',
      getIsValid: ({ value }) => value
    },
    {
      errorMessage: 'The maximum chars is 250',
      getIsValid: ({ value }) => value && value.length <= 250
    }
  ]
}

const NewEmail = () => {
  const { fetchUsers } = useUser()
  const { refetchEmails } = useMail()
  // const [values, setValues] = useState({})
  const [status, setStatus] = useState<TxObj>()
  const [shouldHidePrivate, setShouldHidePrivate] = useState<boolean>(true)

  const program = useStore(state => state.program)
  const mutate = useStore(state => state.mutate)
  const pubkey = useStore(state => state.pubkey)
  const elliptic = useStore(state => state.elliptic)

  useEffect(() => mutate('activeEmail', null), [])

  const onSubmit = useCallback(async ({ registeredValues }) => {
    const { to, myPrivate, body, subject } = registeredValues

    if (to === pubkey) {
      setStatus({
        status: 'error',
        msg: 'You cannot send an email to yourself.'
      })
    }

    setStatus({ status: 'loading', msg: <Loading /> })

    const theirAccount = await fetchUsers('authority', to)

    if (!theirAccount.length) {
      setStatus({
        status: 'error',
        msg: 'The sender is not registered yet, or maybe you typed the wrong wallet address.'
      })
    }

    const myKeypair = elliptic.keyFromPrivate(myPrivate)
    const theirKeypair = elliptic.keyFromPublic(
      Buffer.from(theirAccount[0].account.diffiePubkey, 'hex')
    )

    const sharedSecret = myKeypair
      .derive(theirKeypair.getPublic())
      .toString('hex')
    const cipher = AES.encrypt(body, sharedSecret, { mode: mode.CTR })

    if (!cipher) {
      return setStatus({
        status: 'error',
        msg: 'Error while trying to generate an ecryption cipher, did you typed everything correctly?'
      })
    }

    const mail = web3.Keypair.generate()

    try {
      await program.rpc.sendEmail(
        subject,
        cipher.ciphertext.toString(),
        new PublicKey(pubkey), //from
        new PublicKey(to), // to
        cipher.salt.toString(), // salt
        cipher.iv.toString(), // iv
        {
          accounts: {
            authority: new PublicKey(pubkey),
            mail: mail.publicKey,
            systemProgram: web3.SystemProgram.programId
          },
          signers: [mail]
        }
      )
    } catch (e) {
      setStatus({
        status: 'error',
        msg:
          e?.message ||
          'An error on Solana blockchain happened, please try again'
      })
    }

    /* refetch the sent emails */
    await refetchEmails()
    // setValues({})
    setStatus({ status: 'success', msg: 'Email sent with success' })
  }, [])

  return (
    <>
      <h6 className="mb-5">Write a new email to someone</h6>
      <OneForm validations={validations} onSubmit={onSubmit}>
        <div className="flex flex-col gap-5">
          <Input name="to" placeholder="To" />
          <Input placeholder="Subject" name="subject" />
          <Input
            iconOnClick={() => setShouldHidePrivate(!shouldHidePrivate)}
            icon={shouldHidePrivate ? 'eye' : 'eyeOff'}
            type={shouldHidePrivate ? 'password' : 'text'}
            placeholder="Your private key"
            name="myPrivate"
          />
          <Input
            placeholder="Body of the email"
            type="textarea"
            rows={10}
            name="body"
          />
          <Button type="submit" fluid>
            Send
          </Button>
        </div>
      </OneForm>
      <Modal
        className="bg-primary"
        title="Send Email"
        isOpen={Boolean(status && status?.status !== 'still')}
        close={() => setStatus({ ...status, status: 'still' })}
        overlayCantClose={status?.status !== 'success'}
      >
        <p className="my-5">{status?.msg}</p>
        <Button fluid onClick={() => setStatus({ ...status, status: 'still' })}>
          Close
        </Button>
      </Modal>
    </>
  )
}

export default NewEmail
