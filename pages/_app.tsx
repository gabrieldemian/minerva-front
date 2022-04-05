import '@fontsource/nunito-sans/600.css'
import '@fontsource/nunito-sans/700.css'
import '@fontsource/nunito-sans/800.css'
import '../public/styles/globals.css'
import '../public/styles/typography.css'
import { useCallback } from 'use-memo-one'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { UserNotRegisteredMessage, Layout, Modal } from '@/components'
import { useStore } from '@/store'
import { NextSeo } from 'next-seo'
import { Connection, PublicKey } from '@solana/web3.js'
import { Idl, Program, Provider } from '@project-serum/anchor'
import idl from '../idl.json'
import { useUser } from '@/hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const programID = new PublicKey(idl.metadata.address)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function MyApp({ Component, pageProps }) {
  const mutate = useStore(state => state.mutate)
  const pubkey = useStore(state => state.pubkey)
  const program = useStore(state => state.program)
  const isUserRegistered = useStore(state => state.isUserRegistered)
  const [shouldWarnAboutPhantom, setshouldWarnAboutPhantom] = useState(false)
  const { fetchUsers } = useUser()

  /* when the user connect, checks if he is registered */
  useEffect(() => {
    ;(async () => {
      if (pubkey && program) {
        const user = await fetchUsers('authority', pubkey)
        if (user) {
          mutate('isUserRegistered', Boolean(user?.length))
        }
      }
    })()
  }, [pubkey, program])

  /* if user has phantom wallet, instantiate a few classes */
  /* if not, tell him to install phantom */
  const initProgram = useCallback(() => {
    if (window['solana']?.isPhantom) {
      const network = 'https://explorer-api.devnet.solana.com'
      const connection = new Connection(network, 'confirmed')

      const provider = new Provider(
        connection,
        window.solana,
        'processed' as any
      )

      const program = new Program(idl as Idl, programID, provider)

      mutate('program', program)
    } else {
      setshouldWarnAboutPhantom(true)
    }
  }, [isUserRegistered])

  /* TODO: listen to custom events of my contract */

  useEffect(() => {
    const listenToEvents = () => {
      if (window['solana']?.isPhantom) {
        window?.solana?.connect({ onlyIfTrusted: true })
        window?.solana?.on('connect', (pubkey: PublicKey) =>
          mutate('pubkey', pubkey.toString())
        )
        window?.solana?.on('disconnect', () => mutate('pubkey', null))
        window?.solana?.on('accountChanged', (pubkey: PublicKey) => {
          mutate('pubkey', pubkey.toString())
          mutate('activeEmail', null)
        })
        initProgram()
      }
    }
    listenToEvents()
    setTimeout(() => listenToEvents(), 500)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" forcedTheme="dark">
        <NextSeo title="Minerva" />
        <Layout>
          {pubkey ? (
            <>
              {isUserRegistered ? (
                <Component {...pageProps} />
              ) : (
                <UserNotRegisteredMessage />
              )}
            </>
          ) : (
            <p>Please, connect your wallet to proceed</p>
          )}
        </Layout>

        <Modal
          title="Warning"
          isOpen={shouldWarnAboutPhantom}
          close={() => setshouldWarnAboutPhantom(false)}
        >
          <p>You need to install the Phantom wallet to use this dapp</p>
          <p>
            You can install on{' '}
            <a
              className="text-purple-500"
              href="https://phantom.app/"
              target="_blank"
            >
              this link
            </a>
          </p>
        </Modal>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
