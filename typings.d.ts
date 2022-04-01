import type { PhantomProvider } from '@/types'

declare global {
  interface Window {
    solana?: PhantomProvider
  }
}
