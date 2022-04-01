import { Nav, AsideMenu, Card, EmailOpened, Footer } from '@/components'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Nav />
      <div className="flex w-full h-full xl:min-h-[88vh] flex-col xl:flex-row items-stretch px-3 gap-10 lg:gap-0">
        <div className="w-full xl:w-1/6 xl:min-w-[330px]">
          <AsideMenu />
        </div>
        <Card
          bg="primary"
          className="flex w-full flex-col xl:flex-row"
          hasShadow={false}
        >
          <div className="w-full xl:w-2/6 overflow-y-auto max-h-[98vh] xl:max-h-[90vh] px-5 mb-5 lg:mb-0">
            {children}
          </div>

          <div className="w-full xl:w-3/6 overflow-y-auto max-h-[98vh] xl:max-h-[90vh] px-5">
            <EmailOpened />
          </div>
        </Card>
      </div>
      <Footer />
    </>
  )
}

export default Layout
