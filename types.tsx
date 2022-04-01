import { PublicKey, Transaction } from '@solana/web3.js'
import { ReactNode } from 'react'

export type Icon =
  | 'search'
  | 'menu'
  | 'cog'
  | 'logout'
  | 'chevronLeft'
  | 'chevronRight'
  | 'close'
  | 'refresh'
  | 'mail'
  | 'plus'
  | 'eye'
  | 'eyeOff'
  | 'x'
  | 'dotsVertical'

export interface Email {
  publicKey: PublicKey
  account: {
    body: string
    createdAt: number
    from: PublicKey
    to: PublicKey
    subject: string
    id: string
    authority: PublicKey
    iv: string
    salt: string
  }
}

/* an email filter type can be only one of the following */
export type Filter = 'subject' | 'id' | 'to' | 'from'

export interface FilterObj {
  value: string
  filter: Filter
}

export interface User {
  publicKey: PublicKey
  account: {
    authority: PublicKey
    /* diffie helman pubkey */
    diffiePubkey: string
    bump: number
  }
}

export type TxStatus = 'still' | 'loading' | 'success' | 'error'
export interface TxObj {
  status: TxStatus
  msg?: string | ReactNode
}

export type DisplayEncoding = 'utf8' | 'hex'
export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged'
export type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage'

export interface ConnectOpts {
  onlyIfTrusted: boolean
}

export interface PhantomProvider {
  publicKey: PublicKey | null
  isPhantom: boolean
  isConnected: boolean | null
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: PhantomEvent, handler: (args: any) => void) => void
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>
}
