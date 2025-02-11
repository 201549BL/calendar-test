import { useDroppable, type UseDroppableArguments } from '@dnd-kit/core'
import React, { type ReactNode } from 'react'

type Props = {children: ReactNode, 
  options: UseDroppableArguments
}

export default function Droppable({children, options}: Props) {
  const { setNodeRef } = useDroppable(options)

  return (
    <div ref={setNodeRef}>{children}</div>
  )
}