import { PublicKey } from '@solana/web3.js'
import idl from './idl.json'

export const getUserPDA = async (seed: string, authority: PublicKey) => {
  const [PDA] = await PublicKey.findProgramAddress(
    [new TextEncoder().encode(seed), authority.toBuffer()],
    new PublicKey(idl.metadata.address)
  )
  return PDA
}
