import { EmailPreview, Input, Loading } from '@/components'
import { useCallback } from 'use-memo-one'
import { useMail } from '@/hooks'
import { useRouter } from 'next/router'

const EmailList = () => {
  const { pathname } = useRouter()
  const {
    isLoading,
    setSubjectSearch,
    setWalletSearch,
    subjectSearch,
    walletSearch,
    /* getting a dynamic destructured property */
    emails
  } = useMail()

  const handleRender = useCallback(() => {
    if (!isLoading) {
      if (emails?.length > 0) {
        return emails?.map(email => (
          <EmailPreview
            key={email.publicKey.toBase58() + 'preview'}
            toOrFrom={pathname === '/' ? 'from' : 'to'}
            email={email}
          />
        ))
      }
      return <p className="hasMargin">No emails were found</p>
    } else {
      return <Loading />
    }
  }, [isLoading, emails])

  return (
    <div>
      <h6 className="mb-5">Filters</h6>
      <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-500 mb-5">
        <Input
          onChange={e => setSubjectSearch(e.target.value)}
          placeholder="By subject"
          value={subjectSearch}
          icon="search"
        />
        <Input
          placeholder={`By ${pathname === '/' ? 'sender' : 'receiver'}`}
          onChange={e => setWalletSearch(e.target.value)}
          value={walletSearch}
          className="mb-5"
          icon="search"
        />
      </div>
      {handleRender()}
    </div>
  )
}

export default EmailList
