import { Button, Svg, Popover } from '@/components'
import { useLogin } from '@/hooks'
import { useStore } from '@/store'
import Link from 'next/link'

export interface Item {
  name: string
  href: string
}

const popoverItems: Item[] = [{ name: 'My Account', href: '/account' }]

const Nav = () => {
  const isUserRegistered = useStore(state => state.isUserRegistered)
  const pubkey = useStore(state => state.pubkey)
  const { login } = useLogin()

  return (
    <nav className="bg-secondary w-full py-5 px-10 flex items-center gap-4 shadow-lg z-[6] mb-5 max-h-[60px]">
      <div className="w-full lg:w-2/12">
        <Link href="/">
          <a className="m-0 text-primary">Minerva</a>
        </Link>
      </div>

      <div className="flex w-full lg:w-10/12 items-center justify-end">
        {pubkey ? (
          <small className="hidden lg:inline-block">
            Connected as: {pubkey.slice(0, 7)}...
          </small>
        ) : (
          <Button onClick={login}>Connect</Button>
        )}
      </div>

      {pubkey && isUserRegistered && (
        <Popover
          trigger={
            <div className="bg-purple-500 p-1.5 rounded-full cursor-pointer">
              <Svg className="text-white w-5 h-5" icon="dotsVertical" />
            </div>
          }
        >
          <div>
            {popoverItems.map(item => (
              <Link href={item.href} key={item.name}>
                <a className="text-gray">{item.name}</a>
              </Link>
            ))}
          </div>
        </Popover>
      )}
    </nav>
  )
}

export default Nav
