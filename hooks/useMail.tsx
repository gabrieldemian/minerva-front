import { useMemo } from 'use-memo-one'
import { useState } from 'react'
import { Email, FilterObj } from '@/types'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useDebounce } from '@/hooks'
import { useStore } from '@/store'
import bs58 from 'bs58'

interface Returns {
  isLoading: boolean
  fetchEmails: (toOrFrom: 'to' | 'from') => Promise<Email[]>
  emails: Email[]
  byId: (id: string) => Promise<Email>
  subjectSearch: string
  walletSearch: string
  setSubjectSearch: (v: string) => void
  setWalletSearch: (v: string) => void
  refetchEmails: () => any
}

const memcmpOffsetMap = {
  from: 8,
  to: 8 + 32,
  id: 8 + 32 + 36,
  subject: 8 + 32 + 36 + 40,
  body: 8 + 32 + 36 + 40 + 7
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

const useMail = (): Returns => {
  const pubkey = useStore(state => state.pubkey)
  const program = useStore(state => state.program)
  const isUserRegistered = useStore(state => state.isUserRegistered)

  const { pathname } = useRouter()

  const [subjectSearch, setSubjectSearch] = useState<string>('')
  const [walletSearch, setWalletSearch] = useState<string>('')

  const subjectDebounced = useDebounce(subjectSearch)
  const receiverDebounced = useDebounce(walletSearch)

  const filters: FilterObj[] = useMemo(
    () => [
      {
        value: bs58.encode(Buffer.from(subjectSearch)),
        filter: 'subject'
      },
      {
        value: walletSearch,
        filter: pathname === '/' ? 'from' : 'to'
      }
    ],
    [subjectDebounced, receiverDebounced]
  )

  /* this will be used for both 'received' and 'sent' routes */
  const fetchEmails = async (toOrFrom: 'to' | 'from'): Promise<Email[]> => {
    const memcmpFilters = filters.map((filter: FilterObj) =>
      getMemcmp(filter.filter, filter.value)
    )

    /* push a filter to get only emails that you sent or received */
    memcmpFilters.push(getMemcmp(toOrFrom, pubkey.toString()))
    const emails = program.account.mail.all(memcmpFilters) as Promise<Email[]>

    return emails
  }

  const {
    data: emails,
    isLoading,
    refetch: refetchEmails
  } = useQuery(
    ['useGetEmails', filters, pubkey],
    () => fetchEmails(pathname === '/' ? 'to' : 'from'),
    { enabled: !!isUserRegistered }
  )

  const byId = async (id: string): Promise<Email> => {
    if (program && id) {
      const mails: any = await program.account.mail.all([
        getMemcmp('id', bs58.encode(Buffer.from(id)))
      ])
      return mails[0]
    }
  }

  return {
    refetchEmails,
    emails,
    subjectSearch,
    walletSearch,
    setSubjectSearch,
    setWalletSearch,
    isLoading,
    fetchEmails,
    byId
  }
}

export default useMail
