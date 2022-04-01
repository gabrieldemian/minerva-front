import { memo, ReactNode, useEffect, useState } from 'react'
import { Svg, Glass } from '@/components'

interface Props {
  className?: string
  desirableWidth?: string
  maxWidth?: string
  minWidth?: string
  children?: ReactNode
  isOpen: boolean
  title?: string
  overlayCantClose?: boolean
  close: () => void
}

const Modal = ({
  desirableWidth = '30vw',
  maxWidth = '1300px',
  minWidth = '500px',
  className = '',
  overlayCantClose = false,
  children,
  isOpen,
  close,
  title
}: Props) => {
  const [shouldRender, setRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setRender(true)
      document.querySelector('html').classList.add('lock-scroll')
    }
    return () => {
      document.querySelector('html').classList.remove('lock-scroll')
    }
  }, [isOpen])

  const onAnimationEnd = () => {
    if (!isOpen) setRender(false)
  }

  return (
    <>
      {shouldRender && (
        <div
          className="fixed z-[4] inset-0 backdrop-blur-sm"
          onAnimationEnd={onAnimationEnd}
          style={{ animation: `${isOpen ? 'fadeIn' : 'fadeOut'} .5s` }}
        >
          <div
            className="overlay cursor-pointer w-full h-full"
            onClick={() => !overlayCantClose && close()}
          />
          <Glass
            style={{
              width: `clamp(${minWidth}, ${desirableWidth}, ${maxWidth})`
            }}
            className={`
              rounded-lg p-4 absolute min-h-[180px]
              -translate-x-1/2 overflow-y-auto -translate-y-1/2
              top-[50%] left-[50%] lg:w-[30vw] z-[5] max-h-[80vh] max-w-[90vw]
              ${className}`}
          >
            <div className="flex flex-row border-b border-b-gray-100 mb-5">
              {title && (
                <h6 className="mr-auto pb-4 font-extrabold">{title}</h6>
              )}
              <Svg
                icon="x"
                onClick={close}
                className="items-center flex h-6 w-6 justify-center text-secondary cursor-pointer"
              />
            </div>
            {children}
          </Glass>
        </div>
      )}
    </>
  )
}

export default memo(Modal)
