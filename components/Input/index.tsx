import { MouseEventHandler, ReactNode } from 'react'
import { FieldErrorMessage, Field } from '@/libraries'
import { Svg } from '@/components'
import s from './Input.module.css'
import { Icon } from '@/types'

export interface SelectOption {
  value: string | number
  name: string
}

interface Props {
  name?: string
  children?: ReactNode
  icon?: Icon
  type?: 'text' | 'textarea' | 'password'
  placeholder?: string
  id?: string
  className?: string
  value?: string | number
  options?: SelectOption[]
  onChange?: (e: any) => any
  rows?: number
  disabled?: boolean
  min?: number
  max?: number
  errorMsg?: any
  iconOnClick?: MouseEventHandler<HTMLElement>
}

const Input = ({
  icon,
  placeholder,
  type = 'text',
  id,
  className = '',
  iconOnClick,
  value = '',
  onChange,
  rows,
  name = '',
  errorMsg
}: Props) => {
  /* if there is a 'name' prop, it means the input is controoled */
  /* by the dependency named 'oneForm' */

  const renders = {
    text: (
      <div
        className={`${s.wrapper} ${className} ${
          errorMsg?.length ? s.error : ''
        }`}
      >
        {icon && (
          <label htmlFor={id} className={s.icon}>
            <Svg onClick={iconOnClick} icon={icon} />
          </label>
        )}
        {name?.length ? (
          <Field>
            <input
              placeholder={placeholder}
              className={`${s.input}`}
              name={name}
            />
          </Field>
        ) : (
          <input
            id={id}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`${s.input}`}
          />
        )}
      </div>
    ),
    password: (
      <div
        className={`${s.wrapper} ${className} ${
          errorMsg?.length ? s.error : ''
        }`}
      >
        {icon && (
          <label htmlFor={id} className={s.icon}>
            <Svg onClick={iconOnClick} icon={icon} />
          </label>
        )}
        {name ? (
          <Field>
            <input
              placeholder={placeholder}
              className={`${s.input}`}
              name={name}
              type="password"
            />
          </Field>
        ) : (
          <input
            id={id}
            onChange={onChange}
            type="password"
            placeholder={placeholder}
            className={`${s.input}`}
          />
        )}
      </div>
    ),
    textarea: (
      <div className={`${s.wrapper} ${className}`}>
        {icon && (
          <label htmlFor={id} className={s.icon}>
            <Svg onClick={iconOnClick} icon={icon} />
          </label>
        )}
        {name ? (
          <Field>
            <textarea
              name={name}
              rows={rows}
              placeholder={placeholder}
              className={s.input}
            />
          </Field>
        ) : (
          <textarea
            rows={rows}
            value={value}
            id={id}
            placeholder={placeholder}
            className={s.input}
            onChange={onChange}
          />
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {renders[type]}
      <small className="text-red-500">
        {<FieldErrorMessage name={name} />}
      </small>
    </div>
  )
}

export default Input
