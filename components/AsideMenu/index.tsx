import { AnimateSharedLayout, motion } from 'framer-motion'
import { Card, Svg, Button } from '@/components'
import { Link, useRouter } from '@/libraries'
// import { useMail } from '@/hooks'
import { Icon } from '@/types'
import { memo } from 'react'

interface Items {
  name: String
  href: string | any
  icon: Icon
  quantity?: number
}

const asideItems: Items[] = [
  { name: 'Inbox', href: '/', icon: 'mail', quantity: 5 },
  { name: 'Sent', href: '/sent', icon: 'chevronRight', quantity: 5 }
]

const Aside = () => {
  // const { receivedEmails, sentEmails } = useMail()
  const { pathname } = useRouter()

  return (
    <aside className="h-full">
      <Card bg="secondary" className="h-full px-0">
        <div className="mx-5 mb-5 lg:mb-10">
          <Link href="/new-email">
            <a>
              <Button fluid>New Email</Button>
            </a>
          </Link>
        </div>
        <AnimateSharedLayout>
          {asideItems.map(item => (
            <Link href={item.href} key={item.href}>
              <a
                className={`flex items-center py-3 duration-300 hover:text-white relative font-extrabold ${
                  pathname === item.href ? 'text-white' : 'text-gray'
                }`}
              >
                <div className="mx-5 flex w-full z-[2]">
                  <Svg icon={item.icon} />
                  <div className="flex justify-between w-full">
                    <small className="ml-4 mb-0">{item.name}</small>
                    <small className="font-semibold text-secondary">
                      {item.name === 'Inbox' && ''}
                      {item.name === 'Sent' && ''}
                    </small>
                  </div>
                </div>

                {pathname === item.href && (
                  <motion.div
                    layoutId="active"
                    className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 w-full h-full absolute z-[1] rounded-sm"
                  />
                )}
              </a>
            </Link>
          ))}
        </AnimateSharedLayout>
      </Card>
    </aside>
  )
}

export default memo(Aside)
