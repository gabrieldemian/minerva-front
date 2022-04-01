import { Popover as HeadlessPopover, Transition } from '@headlessui/react'
import { ReactNode, useState, Fragment } from 'react'
import { usePopper } from 'react-popper'
import { Glass } from '@/components'

interface Props {
  trigger: ReactNode
  children: ReactNode
  /* must be a normal tailwind width class prefix by lg, ex: lg:w-20 */
  maxWidth?: string
}

const Popover = ({ trigger, children, maxWidth }: Props) => {
  let [referenceElement] = useState()
  let [popperElement, setPopperElement] = useState()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  return (
    <HeadlessPopover className="relative">
      {({ open }) => (
        <>
          <HeadlessPopover.Button>{trigger}</HeadlessPopover.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-5"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-5"
          >
            <HeadlessPopover.Panel
              ref={setPopperElement as any}
              style={styles.popper}
              className={`rounded-xl absolute z-[3] mt-7 transform -translate-x-full left-[100%] w-[50vw] ${
                maxWidth ? maxWidth : 'lg:w-[8vw]'
              } backdrop-blur`}
              {...attributes.popper}
            >
              <Glass>{children}</Glass>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  )
}

export default Popover
