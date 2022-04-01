import create, { PartialState, State, StateCreator } from 'zustand'
import { Idl, Program } from '@project-serum/anchor'
import { PhantomProvider } from './types'
import produce, { Draft } from 'immer'
import { ec } from 'elliptic'

interface StoreState {
  pubkey: string
  /* if the user is reading an email, this is the id */
  activeEmail: string | null
  program: Program<Idl>
  isUserRegistered: boolean
  mutate: (key: string, value: any) => void
  provider: PhantomProvider
  elliptic: ec
}

const log =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api): any =>
    config(
      args => {
        console.log('applying', args)
        set(args)
        // console.log('new state', get())
      },
      get,
      api
    )

/* immutability programming solves data racing bugs */
const immer =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T)
        return set(nextState, replace)
      },
      get,
      api
    )

export const useStore = create<StoreState>(
  immer(
    log(set => ({
      activeEmail: null,
      elliptic: new ec('curve25519'),
      pubkey: '',
      program: null,
      provider: null,
      isUserRegistered: false,
      mutate: (key: keyof StoreState, value: any) =>
        set({ [key]: value } as PartialState<StoreState, keyof StoreState>)
    }))
  )
)
