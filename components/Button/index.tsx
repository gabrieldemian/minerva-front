import cn from 'classnames'
import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
  fluid?: boolean
  className?: string
  onClick?: any
  bgSecondary?: boolean
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'submit' | 'reset' | 'button'
}

const Button = ({
  children,
  fluid = false,
  className,
  onClick,
  bgSecondary = false,
  size = 'md',
  disabled = false,
  type,
  ...other
}: Props) => {
  const computedClasses = cn(
    fluid ? 'w-full' : 'w-[fit-content]',
    bgSecondary ? 'bg-secondary' : 'bg-purple-500',
    size === 'md' ? 'py-3 px-10' : 'py-2.5 px-2 small'
  )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        shadow-lg
        text-white
        max-h-[44px]
        drop-shadow-button
        flex justify-center items-center
        rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold cursor-pointer
        text-center transition active:filter-none ${computedClasses} ${className}
      `}
      {...other}
    >
      {children}
    </button>
  )
}

export default Button
