import { ReactNode } from 'react'

interface Props {
  onClick?: () => void
  children: ReactNode
  hasShadow?: boolean
  className?: string
  style?: any
}

const Glass = ({ children, onClick, className, hasShadow = true, style }: Props) => {
  return (
    <div
      style={style}
      onClick={onClick}
      className={`p-4 rounded-lg backdrop-blur border border-gray-300 ${
        hasShadow ? 'shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Glass
