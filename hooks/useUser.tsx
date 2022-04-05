import { useState } from 'react'
import { useCallback } from 'use-memo-one'
import {
  GetProgramAccountsFilter,
  PublicKey,
  SystemProgram
} from '@solana/web3.js'
import { Loading } from '@/components'
import { getUserPDA } from '@/utils'
import { useStore } from '@/store'
import { TxObj } from '@/types'
import { User } from '@/types'

interface Hooks {
  isLoading: boolean
  fetchUsers: (filter: string, value: string) => Promise<User[]>
  handleDiffieKey: (
    setStatus: (tx: TxObj) => void,
    operation?: 'register' | 'update'
  ) => Promise<void>
}

const memcmpOffsetMap = {
  /* diffie helman pubkey */
  pubkey: 8 + 4,
  /* wallet of the user */
  authority: 8 + 4 + 64
}

const getMemcmp = (
  filter: keyof typeof memcmpOffsetMap,
  bytes: string | undefined
) => {
  return {
    memcmp: {
      offset: memcmpOffsetMap[filter],
      bytes
    }
  }
}

const useUser = (): Hooks => {
  const pubkey = useStore(state => state.pubkey)
  const elliptic = useStore(state => state.elliptic)
  const program = useStore(state => state.program)
  const [isLoading, setIsLoading] = useState(false)

  /* return filtered users that are registered */
  const fetchUsers = async (
    filter: keyof typeof memcmpOffsetMap,
    value: string
  ): Promise<User[]> => {
    if (!pubkey || !program) return

    setIsLoading(true)

    let memcmpFilters: GetProgramAccountsFilter[] = [getMemcmp(filter, value)]

    const mails = (await program.account.userAccount.all(
      memcmpFilters
    )) as User[]

    setIsLoading(false)

    return mails
  }

  /* can either register a new user or update its account */
  /* receives an useState mutation of a TxObj */
  const handleDiffieKey = useCallback(
    async (
      setStatus: (txObj: TxObj) => void,
      operation: 'register' | 'update' = 'register'
    ) => {
      if (!pubkey || !program) return
      setStatus({ status: 'loading', msg: <Loading /> })

      /* this account is a PDA unique to each user */
      /* the PDA address will never change, unless the seed changes */
      const userAccount = await getUserPDA(
        'user-account',
        new PublicKey(pubkey)
      )

      /* generate diffie helmann keypair */
      const keypair = elliptic.genKeyPair()
      const privateKey = keypair.getPrivate().toString('hex')
      const publicKey = keypair.getPublic().encode('hex', true)

      if (keypair) {
        try {
          if (operation === 'register') {
            await program.rpc.register(publicKey, {
              accounts: {
                authority: new PublicKey(pubkey),
                userAccount,
                systemProgram: SystemProgram.programId
              }
            })
          } else {
            await program.rpc.updateAccount(publicKey, {
              accounts: {
                authority: new PublicKey(pubkey),
                userAccount
              }
            })
          }

          setStatus({
            status: 'success',
            msg: (
              <>
                <p className="hasMargin">
                  This is your private key, save this somewhere safe, we won't
                  show this to you ever again!
                </p>
                <strong className="hasMargin">{privateKey}</strong>
              </>
            )
          })
        } catch (e: any) {
          setStatus({
            status: 'error',
            msg: e?.message || 'error, please try again later'
          })
        }
      } else {
        setStatus({
          status: 'error',
          msg: 'Unknown error, please try again'
        })
      }
    },
    []
  )

  return {
    isLoading,
    fetchUsers,
    handleDiffieKey
  }
}

export default useUser
