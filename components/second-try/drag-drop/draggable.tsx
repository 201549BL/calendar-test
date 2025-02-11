"use client"

import React, { type HTMLAttributes, type PropsWithChildren } from 'react';
import {useDraggable, type UseDraggableArguments} from '@dnd-kit/core';

interface Props extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  options: UseDraggableArguments,
}

export function Draggable({options, children, ...rest}: Props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable(options);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...rest} {...listeners} {...attributes} >
      {children}
    </div>
  );
}