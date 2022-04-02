import { useStore } from '@/store'

interface Hooks {
  login: () => void
}

const useLogin = (): Hooks => {
  const mutate = useStore(state => state.mutate)

  const login = async () => {
    if (typeof window !== 'undefined') {
      const resp = await window.solana.connect()
      mutate('pubkey', resp.publicKey.toString())
    }
  }

  return {
    login
  }
}

export default useLogin
