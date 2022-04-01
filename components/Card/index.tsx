import { memo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
  className?: string
  style?: any
  onClick?: () => void
  onAnimationEnd?: () => any
  bg?: 'primary' | 'secondary'
  hasShadow?: boolean
}

const Card = ({
  children,
  className,
  style,
  onClick,
  onAnimationEnd,
  bg = 'secondary',
  hasShadow = true
}: Props) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-${bg} p-4 rounded-lg ${
        hasShadow ? 'shadow-md' : ''
      } overflow-y-auto ${className}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  )
}

export default memo(Card)
